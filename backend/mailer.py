"""Staff notification email via Emergent's managed email integration.

Sending is a no-op until the email key and staff inbox are configured, so forms
keep working (and keep saving to the database) regardless.
"""
import ipaddress
import logging
import os
import re
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse

import httpx

logger = logging.getLogger(__name__)

EMAIL_BASE_URL = "https://integrations.emergentagent.com"

FORM_LABELS = {
    "contact": "Contact form message",
    "lead": "Pricing / info request",
    "trial": "Free trial request",
    "booking": "Booking request",
    "newsletter": "Email list signup",
}

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


def _cfg() -> dict:
    return {
        "key": os.environ.get("EMERGENT_EMAIL_KEY", ""),
        "from_name": os.environ.get("EMAIL_FROM_NAME", ""),
        "reply_to": os.environ.get("EMAIL_REPLY_TO", ""),
        "staff_to": os.environ.get("STAFF_TO", ""),
        "staff_cc": os.environ.get("STAFF_CC", ""),
    }


def email_enabled() -> bool:
    c = _cfg()
    return all([c["key"], c["from_name"], c["staff_to"]])


async def send_email(*, to: list, subject: str, html: str) -> str | None:
    _assert_safe_email(subject, html)
    c = _cfg()
    payload = {"to": to, "subject": subject, "html": html, "from_name": c["from_name"]}
    if c["reply_to"]:
        payload["contact_email"] = c["reply_to"]
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": c["key"]},
            json=payload,
        )
    resp.raise_for_status()
    return resp.json().get("id")


def _rows(fields: dict) -> str:
    return "".join(
        f"<tr><td style='padding:6px 14px 6px 0;color:#7a6b8a;font-size:13px;text-transform:uppercase;"
        f"letter-spacing:.06em'>{escape(str(k))}</td>"
        f"<td style='padding:6px 0;color:#2C0A4E;font-size:15px'>{escape(str(v)).replace(chr(10), '<br>')}</td></tr>"
        for k, v in fields.items() if v not in (None, "")
    )


def _shell(title: str, body_html: str) -> str:
    return (
        "<div style=\"font-family:Helvetica,Arial,sans-serif;background:#f6f2fa;padding:24px\">"
        "<div style='max-width:560px;margin:0 auto;background:#fff;border:1px solid #e3d9ee'>"
        f"<div style='background:#2C0A4E;padding:18px 24px;color:#fff;font-size:18px;font-weight:700'>{escape(title)}</div>"
        f"<div style='padding:24px'>{body_html}</div>"
        "<div style='padding:16px 24px;border-top:1px solid #eee;color:#8a7c99;font-size:12px'>"
        "U.S. Gold Gymnastics &amp; Cheer Academy &middot; 4000 Haslet-Roanoke Rd Ste 100, Roanoke, TX 76262 &middot; 817.491.9996</div>"
        "</div></div>"
    )


async def notify_staff(form_type: str, fields: dict, reply_to: str = "") -> None:
    """Email the gym about a new form submission."""
    if not email_enabled():
        logger.info("Email not configured - skipped staff notification for %s", form_type)
        return
    c = _cfg()
    label = FORM_LABELS.get(form_type, form_type.replace("_", " ").title())
    who = fields.get("Name") or fields.get("Email") or ""
    recipients = [c["staff_to"]] + ([c["staff_cc"]] if c["staff_cc"] else [])

    note = ""
    if reply_to:
        note = (
            "<p style='margin-top:20px;color:#8a7c99;font-size:13px'>Reach this family at "
            f"<a href='mailto:{escape(reply_to)}' style='color:#2C0A4E'>{escape(reply_to)}</a>.</p>"
        )
    html = _shell(label, _rows(fields) + note)
    subject = f"[Website] {label}{f' - {who}' if who else ''}"

    try:
        await send_email(to=recipients, subject=subject, html=html)
        logger.info("Staff notification sent for %s", form_type)
    except httpx.HTTPStatusError as exc:
        try:
            code = exc.response.json().get("code", "")
            message = exc.response.json().get("message", "")
        except ValueError:
            code, message = "", exc.response.text
        if code in ("insufficient_credits", "integration_disabled", "daily_limit_reached"):
            logger.warning("Email paused for %s: %s - %s", form_type, code, message)
        else:
            logger.error("Staff notification FAILED for %s: %s %s", form_type, exc.response.status_code, message)
    except Exception as exc:
        logger.error("Staff notification FAILED for %s: %s", form_type, exc)
