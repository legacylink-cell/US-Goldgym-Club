from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, BeforeValidator
from typing import List, Optional, Annotated
from datetime import datetime, timezone, timedelta
from bson import ObjectId
import logging
import jwt
import bcrypt
import secrets
import re
import httpx

# ---------------- DB ----------------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ---------------- Helpers ----------------
PyObjectId = Annotated[str, BeforeValidator(str)]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email,
               "exp": datetime.now(timezone.utc) + timedelta(minutes=60), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, access: str, refresh: str):
    response.set_cookie("access_token", access, httponly=True, secure=True, samesite="none", max_age=3600, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=True, samesite="none", max_age=604800, path="/")


def serialize_user(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "email": doc["email"],
        "name": doc.get("name", ""),
        "phone": doc.get("phone", ""),
        "role": doc.get("role", "parent"),
        "created_at": doc.get("created_at"),
    }


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def require_admin(request: Request) -> dict:
    user = await get_current_user(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ---------------- Analytics helpers ----------------
BOT_RE = re.compile(
    r"(bot|spider|crawl|slurp|headless|playwright|puppeteer|lighthouse|"
    r"curl|wget|python-requests|node-fetch|monitor|pingdom|uptime|scan|preview)",
    re.I,
)

ANALYTICS_PROGRAM_PATHS = ["/preschool", "/recreational", "/competitive", "/cheer", "/baseball", "/college-recruits"]

ANALYTICS_PROGRAM_NAMES = {
    "/preschool": "Preschool",
    "/recreational": "Recreational",
    "/competitive": "Competitive Team",
    "/cheer": "Cheer & Tumbling",
    "/baseball": "Baseball",
    "/college-recruits": "College Recruits",
}


def get_client_ip(request: Request) -> str:
    xff = request.headers.get("x-forwarded-for", "")
    if xff:
        return xff.split(",")[0].strip()
    real = request.headers.get("x-real-ip", "")
    if real:
        return real.strip()
    return request.client.host if request.client else ""


def _is_private_ip(ip: str) -> bool:
    if not ip:
        return True
    if ip in ("127.0.0.1", "::1", "localhost"):
        return True
    return ip.startswith(("10.", "192.168.", "172.16.", "172.17.", "172.18.",
                          "172.19.", "172.2", "172.30.", "172.31.", "fe80", "fc", "fd"))


async def geo_lookup(ip: str) -> dict:
    if _is_private_ip(ip):
        return {}
    cached = await db.geo_cache.find_one({"_id": ip})
    if cached:
        return {"city": cached.get("city", ""), "state": cached.get("state", ""),
                "country": cached.get("country", "")}
    try:
        async with httpx.AsyncClient(timeout=2.5) as c:
            r = await c.get(f"http://ip-api.com/json/{ip}",
                            params={"fields": "status,city,regionName,country"})
            d = r.json()
            if d.get("status") == "success":
                geo = {"city": d.get("city", ""), "state": d.get("regionName", ""),
                       "country": d.get("country", "")}
                await db.geo_cache.insert_one(
                    {"_id": ip, **geo, "created_at": datetime.now(timezone.utc).isoformat()})
                return geo
    except Exception:
        pass
    return {}


# ---------------- Models ----------------
class RegisterInput(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    password: str = Field(min_length=6)


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class LeadInput(BaseModel):
    name: str
    email: EmailStr
    phone: str
    child_name: Optional[str] = ""
    child_age: Optional[str] = ""
    program: str
    frequency: Optional[str] = ""
    message: Optional[str] = ""


class ContactInput(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    topic: str
    message: str


class ClientErrorInput(BaseModel):
    message: Optional[str] = ""
    stack: Optional[str] = ""
    componentStack: Optional[str] = ""
    url: Optional[str] = ""
    userAgent: Optional[str] = ""


class NewsletterInput(BaseModel):
    email: EmailStr
    name: Optional[str] = ""


class AnalyticsEventInput(BaseModel):
    type: str                       # pageview | click | scroll
    path: Optional[str] = ""
    category: Optional[str] = ""    # program | cta
    label: Optional[str] = ""       # program path or cta name
    device: Optional[str] = "desktop"
    load_time_ms: Optional[int] = None
    session_id: Optional[str] = ""
    referrer: Optional[str] = ""
    hour: Optional[int] = None       # visitor local hour 0-23 (pageview)
    dow: Optional[int] = None        # visitor local day-of-week 0=Sun..6=Sat
    depth: Optional[int] = None      # max scroll depth % (scroll events)


class BookingInput(BaseModel):
    booking_type: str            # birthday_party, camp, event, trial
    item_name: str               # package / camp / event name
    date: str
    time_slot: Optional[str] = ""
    child_name: Optional[str] = ""
    num_kids: Optional[int] = 1
    notes: Optional[str] = ""
    price: Optional[str] = ""
    waiver_signed_name: str
    waiver_agreed: bool


# ---------------- Auth Endpoints ----------------
@api_router.post("/auth/register")
async def register(data: RegisterInput, response: Response):
    email = data.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    doc = {
        "email": email, "name": data.name, "phone": data.phone or "",
        "password_hash": hash_password(data.password), "role": "parent",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    res = await db.users.insert_one(doc)
    doc["_id"] = res.inserted_id
    uid = str(res.inserted_id)
    set_auth_cookies(response, create_access_token(uid, email), create_refresh_token(uid))
    return serialize_user(doc)


@api_router.post("/auth/login")
async def login(data: LoginInput, response: Response):
    email = data.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    uid = str(user["_id"])
    set_auth_cookies(response, create_access_token(uid, email), create_refresh_token(uid))
    return serialize_user(user)


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out"}


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return serialize_user(user)


@api_router.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        uid = str(user["_id"])
        set_auth_cookies(response, create_access_token(uid, user["email"]), create_refresh_token(uid))
        return serialize_user(user)
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


# ---------------- Leads (Request Pricing) ----------------
@api_router.post("/leads")
async def create_lead(data: LeadInput):
    doc = data.model_dump()
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    doc["status"] = "new"
    res = await db.leads.insert_one(doc)
    return {"id": str(res.inserted_id), "message": "Request received"}


@api_router.get("/admin/leads")
async def list_leads(admin: dict = Depends(require_admin)):
    docs = await db.leads.find().sort("created_at", -1).to_list(1000)
    for d in docs:
        d["id"] = str(d.pop("_id"))
    return docs


# ---------------- Contact ----------------
@api_router.post("/contact")
async def create_contact(data: ContactInput):
    doc = data.model_dump()
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    res = await db.contacts.insert_one(doc)
    return {"id": str(res.inserted_id), "message": "Message sent"}


@api_router.post("/client-error")
async def report_client_error(data: ClientErrorInput):
    doc = data.model_dump()
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.client_errors.insert_one(doc)
    logger.error("CLIENT ERROR REPORT | url=%s | ua=%s | message=%s | stack=%s | componentStack=%s",
                 data.url, data.userAgent, data.message, (data.stack or "")[:1500], (data.componentStack or "")[:1500])
    return {"ok": True}



# ---------------- Newsletter / Email List ----------------
@api_router.post("/newsletter")
async def subscribe_newsletter(data: NewsletterInput):
    email = data.email.lower()
    existing = await db.newsletter_subscribers.find_one({"email": email})
    if existing:
        return {"message": "You're already on the list!", "already": True}
    await db.newsletter_subscribers.insert_one({
        "email": email,
        "name": data.name or "",
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"message": "You're on the list!", "already": False}


@api_router.get("/admin/newsletter")
async def list_newsletter(admin: dict = Depends(require_admin)):
    docs = await db.newsletter_subscribers.find().sort("created_at", -1).to_list(2000)
    for d in docs:
        d["id"] = str(d.pop("_id"))
    return docs


@api_router.get("/admin/contacts")
async def list_contacts(admin: dict = Depends(require_admin)):
    docs = await db.contacts.find().sort("created_at", -1).to_list(1000)
    for d in docs:
        d["id"] = str(d.pop("_id"))
    return docs


# ---------------- Bookings ----------------
@api_router.post("/bookings")
async def create_booking(data: BookingInput, user: dict = Depends(get_current_user)):
    if not data.waiver_agreed:
        raise HTTPException(status_code=400, detail="Waiver must be signed to complete booking")
    doc = data.model_dump()
    doc["user_id"] = str(user["_id"])
    doc["user_email"] = user["email"]
    doc["user_name"] = user.get("name", "")
    doc["status"] = "confirmed"
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    res = await db.bookings.insert_one(doc)
    return {"id": str(res.inserted_id), "message": "Booking confirmed"}


@api_router.get("/bookings/me")
async def my_bookings(user: dict = Depends(get_current_user)):
    docs = await db.bookings.find({"user_id": str(user["_id"])}).sort("created_at", -1).to_list(1000)
    for d in docs:
        d["id"] = str(d.pop("_id"))
    return docs


@api_router.get("/admin/bookings")
async def list_bookings(admin: dict = Depends(require_admin)):
    docs = await db.bookings.find().sort("created_at", -1).to_list(1000)
    for d in docs:
        d["id"] = str(d.pop("_id"))
    return docs


@api_router.get("/admin/stats")
async def admin_stats(admin: dict = Depends(require_admin)):
    return {
        "leads": await db.leads.count_documents({}),
        "contacts": await db.contacts.count_documents({}),
        "bookings": await db.bookings.count_documents({}),
        "parents": await db.users.count_documents({"role": "parent"}),
        "subscribers": await db.newsletter_subscribers.count_documents({}),
    }


# ---------------- Events / Calendar ----------------
@api_router.get("/events")
async def list_events(category: Optional[str] = None):
    query = {}
    if category and category != "all":
        query["category"] = category
    docs = await db.events.find(query).sort("date", 1).to_list(1000)
    for d in docs:
        d["id"] = str(d.pop("_id"))
    return docs


# ---------------- Analytics ----------------
@api_router.post("/analytics/track")
async def track_event(data: AnalyticsEventInput, request: Request):
    ua = request.headers.get("user-agent", "")
    if BOT_RE.search(ua):
        return {"ok": True, "skipped": "bot"}
    geo = {}
    if data.type == "pageview":
        geo = await geo_lookup(get_client_ip(request))
    now = datetime.now(timezone.utc)
    doc = data.model_dump()
    doc.update({
        "ua": ua[:300],
        "city": geo.get("city", ""),
        "state": geo.get("state", ""),
        "country": geo.get("country", ""),
        "created_at": now.isoformat(),
    })
    await db.analytics_events.insert_one(doc)
    return {"ok": True}


@api_router.get("/admin/analytics")
async def get_analytics(days: int = 30, admin: dict = Depends(require_admin)):
    days = max(1, min(days, 365))
    now = datetime.now(timezone.utc)
    cutoff = (now - timedelta(days=days)).isoformat()
    pv_match = {"type": "pageview", "created_at": {"$gte": cutoff}}
    click_match = {"type": "click", "created_at": {"$gte": cutoff}}

    async def agg(coll, pipeline):
        return await coll.aggregate(pipeline).to_list(2000)

    pageviews = await db.analytics_events.count_documents(pv_match)
    sessions = await db.analytics_events.distinct("session_id", {"created_at": {"$gte": cutoff}})
    unique_visitors = len([s for s in sessions if s])

    device_rows = await agg(db.analytics_events, [
        {"$match": pv_match},
        {"$group": {"_id": {"$ifNull": ["$device", "desktop"]}, "count": {"$sum": 1}}},
    ])
    device_split = {(r["_id"] or "desktop"): r["count"] for r in device_rows}

    load_rows = await agg(db.analytics_events, [
        {"$match": {**pv_match, "load_time_ms": {"$ne": None, "$gt": 0}}},
        {"$group": {"_id": {"$cond": [{"$eq": ["$device", "mobile"]}, "mobile", "web"]},
                    "avg": {"$avg": "$load_time_ms"}, "count": {"$sum": 1}}},
    ])
    load_time = {r["_id"]: {"avg_ms": round(r["avg"]), "samples": r["count"]} for r in load_rows}

    program_rows = await agg(db.analytics_events, [
        {"$match": {**click_match, "category": "program"}},
        {"$group": {"_id": "$label", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}, {"$limit": 20},
    ])
    top_programs = [{"program": r["_id"], "clicks": r["count"]} for r in program_rows if r["_id"]]

    cta_rows = await agg(db.analytics_events, [
        {"$match": {**click_match, "category": "cta"}},
        {"$group": {"_id": "$label", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ])
    cta_clicks = [{"cta": r["_id"], "clicks": r["count"]} for r in cta_rows if r["_id"]]

    loc_rows = await agg(db.analytics_events, [
        {"$match": {**pv_match, "city": {"$nin": ["", None]}}},
        {"$group": {"_id": {"city": "$city", "state": "$state"}, "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}, {"$limit": 25},
    ])
    by_location = [{"city": r["_id"]["city"], "state": r["_id"].get("state", ""), "views": r["count"]}
                   for r in loc_rows]

    page_rows = await agg(db.analytics_events, [
        {"$match": pv_match},
        {"$group": {"_id": "$path", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}, {"$limit": 15},
    ])
    top_pages = [{"path": (r["_id"] or "/"), "views": r["count"]} for r in page_rows]

    ref_rows = await agg(db.analytics_events, [
        {"$match": {**pv_match, "referrer": {"$nin": ["", None]}}},
        {"$group": {"_id": "$referrer", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}, {"$limit": 15},
    ])
    top_referrers = [{"referrer": r["_id"], "count": r["count"]} for r in ref_rows]

    # peak times heatmap (day-of-week x hour, visitor local time)
    peak_rows = await agg(db.analytics_events, [
        {"$match": {**pv_match, "hour": {"$ne": None}, "dow": {"$ne": None}}},
        {"$group": {"_id": {"dow": "$dow", "hour": "$hour"}, "count": {"$sum": 1}}},
    ])
    peak_times = [{"dow": r["_id"]["dow"], "hour": r["_id"]["hour"], "count": r["count"]} for r in peak_rows]

    # scroll depth per page (how far visitors read)
    scroll_rows = await agg(db.analytics_events, [
        {"$match": {"type": "scroll", "created_at": {"$gte": cutoff}, "depth": {"$ne": None}}},
        {"$group": {"_id": "$path", "avg": {"$avg": "$depth"}, "samples": {"$sum": 1},
                    "bottom": {"$sum": {"$cond": [{"$gte": ["$depth", 90]}, 1, 0]}}}},
        {"$sort": {"samples": -1}}, {"$limit": 15},
    ])
    scroll_depth = [{"path": (r["_id"] or "/"), "avg_depth": round(r["avg"]), "samples": r["samples"],
                     "reached_bottom_pct": round(r["bottom"] / r["samples"] * 100) if r["samples"] else 0}
                    for r in scroll_rows]

    # exit pages (last page viewed per session)
    exit_rows = await agg(db.analytics_events, [
        {"$match": pv_match},
        {"$sort": {"created_at": 1}},
        {"$group": {"_id": "$session_id", "last": {"$last": "$path"}}},
        {"$group": {"_id": "$last", "exits": {"$sum": 1}}},
        {"$sort": {"exits": -1}}, {"$limit": 15},
    ])
    exit_pages = [{"path": (r["_id"] or "/"), "exits": r["exits"]} for r in exit_rows]

    pv_day = await agg(db.analytics_events, [
        {"$match": pv_match},
        {"$group": {"_id": {"$substrCP": ["$created_at", 0, 10]}, "count": {"$sum": 1}}},
    ])
    pv_by_day = {r["_id"]: r["count"] for r in pv_day}

    lead_day = await agg(db.leads, [
        {"$match": {"created_at": {"$gte": cutoff}}},
        {"$group": {"_id": {"$substrCP": ["$created_at", 0, 10]}, "count": {"$sum": 1}}},
    ])
    leads_by_day = {r["_id"]: r["count"] for r in lead_day}

    sub_day = await agg(db.newsletter_subscribers, [
        {"$match": {"created_at": {"$gte": cutoff}}},
        {"$group": {"_id": {"$substrCP": ["$created_at", 0, 10]}, "count": {"$sum": 1}}},
    ])
    subs_by_day = {r["_id"]: r["count"] for r in sub_day}

    series = []
    for i in range(days, -1, -1):
        d = (now - timedelta(days=i)).strftime("%Y-%m-%d")
        series.append({"date": d, "pageviews": pv_by_day.get(d, 0),
                       "leads": leads_by_day.get(d, 0), "signups": subs_by_day.get(d, 0)})

    total_leads = await db.leads.count_documents({"created_at": {"$gte": cutoff}})
    total_signups = await db.newsletter_subscribers.count_documents({"created_at": {"$gte": cutoff}})

    # previous period (for trend arrows)
    prev_start = (now - timedelta(days=days * 2)).isoformat()
    prev_win = {"$gte": prev_start, "$lt": cutoff}
    prev_pageviews = await db.analytics_events.count_documents({"type": "pageview", "created_at": prev_win})
    prev_sessions = await db.analytics_events.distinct("session_id", {"created_at": prev_win})
    prev_unique = len([s for s in prev_sessions if s])
    prev_leads = await db.leads.count_documents({"created_at": prev_win})
    prev_signups = await db.newsletter_subscribers.count_documents({"created_at": prev_win})
    totals_prev = {
        "pageviews": prev_pageviews,
        "unique_visitors": prev_unique,
        "leads": prev_leads,
        "signups": prev_signups,
        "conversion_rate": round(prev_leads / prev_unique * 100, 1) if prev_unique else 0,
    }

    # trial funnel (distinct sessions reaching each stage in this period)
    def _n(lst):
        return len([x for x in lst if x])
    prog_sessions = await db.analytics_events.distinct(
        "session_id", {"type": "pageview", "path": {"$in": ANALYTICS_PROGRAM_PATHS}, "created_at": {"$gte": cutoff}})
    cta_sessions = await db.analytics_events.distinct(
        "session_id", {"type": "click", "category": "cta",
                       "label": {"$in": ["book_free_trial", "request_pricing"]}, "created_at": {"$gte": cutoff}})
    sub_sessions = await db.analytics_events.distinct(
        "session_id", {"type": "conversion", "created_at": {"$gte": cutoff}})
    funnel = [
        {"stage": "Viewed a Program", "sessions": _n(prog_sessions)},
        {"stage": "Clicked Trial / Pricing", "sessions": _n(cta_sessions)},
        {"stage": "Submitted a Request", "sessions": _n(sub_sessions)},
    ]

    # per-program funnel (session attribution)
    cta_set = {s for s in cta_sessions if s}
    sub_set = {s for s in sub_sessions if s}
    prog_view_rows = await agg(db.analytics_events, [
        {"$match": {"type": "pageview", "path": {"$in": ANALYTICS_PROGRAM_PATHS}, "created_at": {"$gte": cutoff}}},
        {"$group": {"_id": "$path", "sessions": {"$addToSet": "$session_id"}}},
    ])
    funnel_by_program = []
    for r in prog_view_rows:
        vs = {s for s in r["sessions"] if s}
        viewed = len(vs)
        clicked = len(vs & cta_set)
        submitted = len(vs & sub_set)
        funnel_by_program.append({
            "program": r["_id"], "viewed": viewed, "clicked": clicked, "submitted": submitted,
            "conv_rate": round(submitted / viewed * 100, 1) if viewed else 0,
        })
    funnel_by_program.sort(key=lambda x: x["viewed"], reverse=True)

    # week-over-week drop alerts
    wk1 = (now - timedelta(days=7)).isoformat()
    wk2 = (now - timedelta(days=14)).isoformat()
    subs_this = await db.analytics_events.count_documents({"type": "conversion", "created_at": {"$gte": wk1}})
    subs_prev = await db.analytics_events.count_documents({"type": "conversion", "created_at": {"$gte": wk2, "$lt": wk1}})
    leads_this = await db.leads.count_documents({"created_at": {"$gte": wk1}})
    leads_prev = await db.leads.count_documents({"created_at": {"$gte": wk2, "$lt": wk1}})
    alerts = []
    if subs_prev >= 2 and subs_this <= subs_prev * 0.7:
        drop = round((subs_prev - subs_this) / subs_prev * 100)
        alerts.append({"level": "warning", "title": "Trial submissions dropping",
                       "message": f"Trial/pricing form submissions fell {drop}% this week ({subs_this}) vs last week ({subs_prev}). Consider a promo or a follow-up push."})
    if leads_prev >= 3 and leads_this <= leads_prev * 0.6:
        drop = round((leads_prev - leads_this) / leads_prev * 100)
        alerts.append({"level": "warning", "title": "Pricing requests dropping",
                       "message": f"Pricing requests fell {drop}% this week ({leads_this}) vs last week ({leads_prev})."})

    return {
        "range_days": days,
        "alerts": alerts,
        "funnel_by_program": funnel_by_program,
        "totals": {
            "pageviews": pageviews,
            "unique_visitors": unique_visitors,
            "leads": total_leads,
            "signups": total_signups,
            "conversion_rate": round(total_leads / unique_visitors * 100, 1) if unique_visitors else 0,
        },
        "totals_prev": totals_prev,
        "funnel": funnel,
        "device_split": device_split,
        "load_time": load_time,
        "top_programs": top_programs,
        "cta_clicks": cta_clicks,
        "by_location": by_location,
        "top_pages": top_pages,
        "top_referrers": top_referrers,
        "peak_times": peak_times,
        "scroll_depth": scroll_depth,
        "exit_pages": exit_pages,
        "timeseries": series,
    }


@api_router.get("/top-program")
async def top_program():
    now = datetime.now(timezone.utc)
    cutoff = (now - timedelta(days=90)).isoformat()
    rows = await db.analytics_events.aggregate([
        {"$match": {"type": "pageview", "path": {"$in": ANALYTICS_PROGRAM_PATHS}, "created_at": {"$gte": cutoff}}},
        {"$group": {"_id": "$path", "sessions": {"$addToSet": "$session_id"}}},
    ]).to_list(50)
    sub_sessions = await db.analytics_events.distinct("session_id", {"type": "conversion", "created_at": {"$gte": cutoff}})
    sub_set = {s for s in sub_sessions if s}
    stats = []
    for r in rows:
        vs = {s for s in r["sessions"] if s}
        viewed = len(vs)
        submitted = len(vs & sub_set)
        stats.append({"program": r["_id"], "viewed": viewed, "submitted": submitted,
                      "conv": (submitted / viewed if viewed else 0)})
    if stats:
        conv_candidates = [s for s in stats if s["viewed"] >= 3 and s["submitted"] > 0]
        if conv_candidates:
            best = max(conv_candidates, key=lambda s: (s["conv"], s["viewed"]))
            reason = "best_converting"
        else:
            best = max(stats, key=lambda s: s["viewed"])
            reason = "most_popular"
        return {"program": best["program"], "name": ANALYTICS_PROGRAM_NAMES.get(best["program"], ""),
                "reason": reason, "views": best["viewed"], "conv_rate": round(best["conv"] * 100, 1)}
    return {"program": "/competitive", "name": ANALYTICS_PROGRAM_NAMES["/competitive"],
            "reason": "default", "views": 0, "conv_rate": 0}


# ---------------- Seed ----------------
async def seed_admin():
    email = os.environ.get("ADMIN_EMAIL", "admin@example.com")
    password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": email})
    if existing is None:
        await db.users.insert_one({
            "email": email, "password_hash": hash_password(password), "name": "Gym Admin",
            "phone": "", "role": "admin", "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded admin user")
    elif not verify_password(password, existing["password_hash"]):
        await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(password)}})


async def seed_events():
    if await db.events.count_documents({}) > 0:
        return
    events = [
        {"title": "Open Gym", "category": "open_gym", "date": "2026-07-11", "time": "6:00 PM - 8:00 PM",
         "price": "$5 members / $7 non-members", "age": "Ages 5+", "description": "Free play on all equipment with staff supervision. 24-hour signup required."},
        {"title": "Tumbling Clinic", "category": "clinic", "date": "2026-07-15", "time": "5:00 PM - 5:30 PM",
         "price": "$25 members / $30 non-members", "age": "All levels", "description": "30-minute focused tumbling skills clinic."},
        {"title": "Bar & Beam Clinic", "category": "clinic", "date": "2026-07-18", "time": "5:30 PM - 6:00 PM",
         "price": "$25 members / $30 non-members", "age": "All levels", "description": "30-minute bar and beam technique clinic."},
        {"title": "Friday Night Fun", "category": "special_event", "date": "2026-07-24", "time": "6:30 PM - 9:30 PM",
         "price": "See Calendar", "age": "Ages 5+", "description": "Parents' night out! Games, gym time and pizza. Sign-up required."},
        {"title": "Summer Skills Camp", "category": "camp", "date": "2026-07-27", "time": "9:00 AM - 12:00 PM",
         "price": "$45/day", "age": "Ages 5-12", "description": "Week-long summer camp focused on gymnastics fundamentals and games."},
        {"title": "Preschool Lunch & Learn", "category": "special_event", "date": "2026-08-05", "time": "11:30 AM - 1:00 PM",
         "price": "$30 members / $35 non-members", "age": "Ages 3-5", "description": "Structured gym time plus lunch. A preschool favorite."},
        {"title": "Open Gym", "category": "open_gym", "date": "2026-08-08", "time": "6:00 PM - 8:00 PM",
         "price": "$5 members / $7 non-members", "age": "Ages 5+", "description": "Free play on all equipment with staff supervision."},
        {"title": "Back to School Tumbling Clinic", "category": "clinic", "date": "2026-08-14", "time": "5:00 PM - 5:30 PM",
         "price": "$25 members / $30 non-members", "age": "All levels", "description": "Kick off the season with a tumbling refresher."},
    ]
    for e in events:
        e["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.events.insert_many(events)
    logger.info("Seeded events")


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await seed_admin()
    await seed_events()


@app.on_event("shutdown")
async def shutdown():
    client.close()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[os.environ.get("FRONTEND_URL", "http://localhost:3000"), "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
