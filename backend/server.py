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
