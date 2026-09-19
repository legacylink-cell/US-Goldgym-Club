"""Staff notification + parent confirmation email (Microsoft 365 SMTP).

Sending is a no-op until SMTP_PASSWORD is set, so forms keep working (and keep
saving to the database) before the mailbox credentials are configured.
"""
import asyncio
import logging
import os
from email.message import EmailMessage
from html import escape

import aiosmtplib

logger = logging.getLogger(__name__)

FORM_LABELS = {
    "contact": "Contact form message",
    "lead": "Pricing / info request",
    "trial": "Free trial request",
    "booking": "Booking request",
    "newsletter": "Email list signup",
}


def _cfg() -> dict:
    return {
        "host": os.environ.get("SMTP_HOST", ""),
        "port": int(os.environ.get("SMTP_PORT", "587")),
        "username": os.environ.get("SMTP_USERNAME", ""),
        "password": os.environ.get("SMTP_PASSWORD", ""),
        "mail_from": os.environ.get("MAIL_FROM", ""),
        "staff_to": os.environ.get("STAFF_TO", ""),
    }


def email_enabled() -> bool:
    c = _cfg()
    return all([c["host"], c["username"], c["password"], c["mail_from"], c["staff_to"]])


async def _send(msg: EmailMessage, attempts: int = 3) -> None:
    c = _cfg()
    for attempt in range(attempts):
        try:
            await aiosmtplib.send(
                msg,
                hostname=c["host"],
                port=c["port"],
                username=c["username"],
                password=c["password"],
                start_tls=True,
                timeout=30,
                validate_certs=True,
            )
            return
        except Exception:
            if attempt == attempts - 1:
                raise
            await asyncio.sleep(2 ** attempt)


def _rows(fields: dict) -> tuple:
    text = "\n".join(f"{k}: {v}" for k, v in fields.items() if v not in (None, ""))
    html = "".join(
        f"<tr><td style='padding:6px 14px 6px 0;color:#7a6b8a;font-size:13px;text-transform:uppercase;"
        f"letter-spacing:.06em'>{escape(str(k))}</td>"
        f"<td style='padding:6px 0;color:#2C0A4E;font-size:15px'>{escape(str(v)).replace(chr(10), '<br>')}</td></tr>"
        for k, v in fields.items() if v not in (None, "")
    )
    return text, f"<table style='border-collapse:collapse'>{html}</table>"


def _shell(title: str, body_html: str) -> str:
    return (
        "<div style=\"font-family:Helvetica,Arial,sans-serif;background:#f6f2fa;padding:24px\">"
        "<div style='max-width:560px;margin:0 auto;background:#fff;border:1px solid #e3d9ee'>"
        f"<div style='background:#2C0A4E;padding:18px 24px;color:#fff;font-size:18px;font-weight:700'>{escape(title)}</div>"
        f"<div style='padding:24px'>{body_html}</div>"
        "<div style='padding:16px 24px;border-top:1px solid #eee;color:#8a7c99;font-size:12px'>"
        "U.S. Gold Gymnastics &amp; Cheer Academy &middot; 1301 Bluebonnet Dr, Roanoke, TX &middot; 817.491.9996</div>"
        "</div></div>"
    )


async def notify_staff(form_type: str, fields: dict, reply_to: str = "") -> None:
    """Email the gym about a new form submission. Reply-To is the parent's address."""
    if not email_enabled():
        logger.info("Email not configured - skipped staff notification for %s", form_type)
        return
    c = _cfg()
    label = FORM_LABELS.get(form_type, form_type.replace("_", " ").title())
    who = fields.get("Name") or fields.get("Email") or ""
    text, html_rows = _rows(fields)

    msg = EmailMessage()
    msg["Subject"] = f"[Website] {label}{f' - {who}' if who else ''}"
    msg["From"] = c["mail_from"]
    msg["To"] = c["staff_to"]
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.set_content(f"{label}\n\n{text}\n\nSent from usgoldgymclub.com")
    msg.add_alternative(
        _shell(
            label,
            html_rows + "<p style='margin-top:20px;color:#8a7c99;font-size:13px'>"
            "Hit reply to answer this family directly.</p>",
        ),
        subtype="html",
    )
    try:
        await _send(msg)
        logger.info("Staff notification sent for %s", form_type)
    except Exception as exc:
        logger.error("Staff notification FAILED for %s: %s", form_type, exc)


async def confirm_to_parent(to_email: str, name: str = "", form_type: str = "contact") -> None:
    """Short 'we got it' acknowledgement to the person who filled the form."""
    if not email_enabled() or not to_email:
        return
    c = _cfg()
    first = (name or "").split(" ")[0]
    greeting = f"Hi {first}," if first else "Hi there,"
    if form_type == "newsletter":
        body = "You're on the U.S. Gold email list. We'll send camp openings, events, and gym news your way."
    else:
        body = ("Thanks for reaching out to U.S. Gold Gymnastics &amp; Cheer Academy. "
                "We've got your message and someone from our team will get back to you shortly. "
                "If you need us right away, call 817.491.9996.")

    msg = EmailMessage()
    msg["Subject"] = "We got your message - U.S. Gold Gymnastics & Cheer"
    msg["From"] = c["mail_from"]
    msg["To"] = to_email
    msg["Reply-To"] = c["staff_to"]
    msg.set_content(f"{greeting}\n\n{body.replace('&amp;', '&')}\n\nU.S. Gold Gymnastics & Cheer Academy\n817.491.9996")
    msg.add_alternative(
        _shell(
            "Thanks for reaching out!",
            f"<p style='color:#2C0A4E;font-size:16px'>{escape(greeting)}</p>"
            f"<p style='color:#4a3d5c;font-size:15px;line-height:1.5'>{body}</p>"
            "<p style='margin-top:24px'><a href='https://www.usgoldgymclub.com' "
            "style='background:#FF1D8E;color:#2C0A4E;text-decoration:none;padding:12px 22px;"
            "font-weight:700;display:inline-block'>Visit our website</a></p>",
        ),
        subtype="html",
    )
    try:
        await _send(msg)
    except Exception as exc:
        logger.error("Parent confirmation FAILED to %s: %s", to_email, exc)
