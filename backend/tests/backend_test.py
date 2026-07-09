"""
Backend test suite for US Gold Gymnastics & Cheer Academy
Tests: Auth (register/login/me/logout), Leads, Contact, Bookings, Events, Admin endpoints
"""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://cheer-gym-pro.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@usgoldgym.com"
ADMIN_PASSWORD = "GymAdmin2026!"

# Unique parent so test is idempotent
UNIQ = str(int(time.time()))
PARENT_EMAIL = f"TEST_parent_{UNIQ}@example.com"
PARENT_PASSWORD = "TestPass123!"


@pytest.fixture(scope="session")
def parent_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/register", json={
        "name": "Test Parent",
        "email": PARENT_EMAIL,
        "phone": "555-1000",
        "password": PARENT_PASSWORD,
    })
    if r.status_code == 400:
        # Already registered by another worker; login instead
        r = s.post(f"{API}/auth/login", json={"email": PARENT_EMAIL, "password": PARENT_PASSWORD})
    assert r.status_code == 200, f"Parent auth failed {r.status_code} {r.text}"
    return s


@pytest.fixture(scope="session")
def admin_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD,
    })
    assert r.status_code == 200, f"Admin login failed {r.status_code} {r.text}"
    return s


# ---------------- Auth ----------------
class TestAuth:
    def test_register_and_cookie(self):
        s = requests.Session()
        email = f"TEST_reg_{int(time.time()*1000)}@example.com"
        r = s.post(f"{API}/auth/register", json={
            "name": "Reg Test",
            "email": email,
            "phone": "555-0000",
            "password": "TestPass123!",
        })
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["email"] == email.lower()
        assert data["role"] == "parent"
        assert "id" in data
        # cookie should be set
        assert "access_token" in s.cookies.get_dict()
        # /me should work with cookie
        m = s.get(f"{API}/auth/me")
        assert m.status_code == 200
        assert m.json()["email"] == email.lower()

    def test_register_duplicate_email(self):
        s = requests.Session()
        email = f"TEST_dup_{int(time.time()*1000)}@example.com"
        s.post(f"{API}/auth/register", json={
            "name": "Dup", "email": email, "phone": "", "password": "TestPass123!",
        })
        r = s.post(f"{API}/auth/register", json={
            "name": "Dup2", "email": email, "phone": "", "password": "TestPass123!",
        })
        assert r.status_code == 400

    def test_admin_login(self, admin_session):
        r = admin_session.get(f"{API}/auth/me")
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"

    def test_parent_login_wrong_password(self):
        r = requests.post(f"{API}/auth/login", json={
            "email": ADMIN_EMAIL, "password": "WrongPass!",
        })
        assert r.status_code == 401

    def test_me_no_auth(self):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_logout(self, parent_session):
        # use a separate session so we don't invalidate the fixture
        s = requests.Session()
        s.post(f"{API}/auth/login", json={"email": PARENT_EMAIL, "password": PARENT_PASSWORD})
        assert s.get(f"{API}/auth/me").status_code == 200
        r = s.post(f"{API}/auth/logout")
        assert r.status_code == 200
        # clear cookies just as browser would after receiving delete_cookie
        s.cookies.clear()
        assert s.get(f"{API}/auth/me").status_code == 401


# ---------------- Leads (public) ----------------
class TestLeads:
    def test_create_lead_public(self):
        r = requests.post(f"{API}/leads", json={
            "name": "TEST Lead Person",
            "email": f"TEST_lead_{int(time.time()*1000)}@example.com",
            "phone": "555-2000",
            "child_name": "Kiddo",
            "child_age": "6",
            "program": "recreational",
            "frequency": "1x/week",
            "message": "Interested in classes",
        })
        assert r.status_code == 200, r.text
        j = r.json()
        assert "id" in j and j["message"]

    def test_admin_list_leads(self, admin_session):
        r = admin_session.get(f"{API}/admin/leads")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_parent_forbidden_from_admin_leads(self, parent_session):
        r = parent_session.get(f"{API}/admin/leads")
        assert r.status_code == 403


# ---------------- Contact (public) ----------------
class TestContact:
    def test_create_contact_public(self):
        r = requests.post(f"{API}/contact", json={
            "name": "TEST Contact",
            "email": f"TEST_contact_{int(time.time()*1000)}@example.com",
            "phone": "555-3000",
            "topic": "General",
            "message": "Hello, test message.",
        })
        assert r.status_code == 200
        assert "id" in r.json()

    def test_admin_list_contacts(self, admin_session):
        r = admin_session.get(f"{API}/admin/contacts")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_parent_forbidden_admin_contacts(self, parent_session):
        r = parent_session.get(f"{API}/admin/contacts")
        assert r.status_code == 403


# ---------------- Bookings ----------------
class TestBookings:
    def test_booking_requires_auth(self):
        r = requests.post(f"{API}/bookings", json={
            "booking_type": "birthday_party",
            "item_name": "Gold Party",
            "date": "2026-08-01",
            "waiver_signed_name": "Test",
            "waiver_agreed": True,
        })
        assert r.status_code == 401

    def test_booking_rejects_unsigned_waiver(self, parent_session):
        r = parent_session.post(f"{API}/bookings", json={
            "booking_type": "birthday_party",
            "item_name": "Gold Party",
            "date": "2026-08-01",
            "time_slot": "2:00 PM",
            "child_name": "Kiddo",
            "num_kids": 10,
            "waiver_signed_name": "Test Parent",
            "waiver_agreed": False,
        })
        assert r.status_code == 400, r.text

    def test_booking_created_and_listed(self, parent_session):
        r = parent_session.post(f"{API}/bookings", json={
            "booking_type": "birthday_party",
            "item_name": "Gold Party",
            "date": "2026-08-15",
            "time_slot": "2:00 PM",
            "child_name": "Kiddo",
            "num_kids": 12,
            "notes": "Test booking",
            "price": "$350",
            "waiver_signed_name": "Test Parent",
            "waiver_agreed": True,
        })
        assert r.status_code == 200, r.text
        assert "id" in r.json()

        # verify listed under /bookings/me
        me_r = parent_session.get(f"{API}/bookings/me")
        assert me_r.status_code == 200
        bookings = me_r.json()
        assert any(b["item_name"] == "Gold Party" for b in bookings)

    def test_admin_can_list_all_bookings(self, admin_session):
        r = admin_session.get(f"{API}/admin/bookings")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_parent_forbidden_admin_bookings(self, parent_session):
        r = parent_session.get(f"{API}/admin/bookings")
        assert r.status_code == 403


# ---------------- Events ----------------
class TestEvents:
    def test_events_list(self):
        r = requests.get(f"{API}/events")
        assert r.status_code == 200
        events = r.json()
        assert isinstance(events, list)
        assert len(events) > 0
        assert "title" in events[0]
        assert "category" in events[0]
        assert "date" in events[0]

    def test_events_category_filter(self):
        r = requests.get(f"{API}/events", params={"category": "clinic"})
        assert r.status_code == 200
        events = r.json()
        assert all(e["category"] == "clinic" for e in events)
        assert len(events) >= 1


# ---------------- Admin Stats ----------------
class TestAdminStats:
    def test_admin_stats(self, admin_session):
        r = admin_session.get(f"{API}/admin/stats")
        assert r.status_code == 200
        j = r.json()
        assert "leads" in j and "contacts" in j and "bookings" in j and "parents" in j

    def test_parent_forbidden_admin_stats(self, parent_session):
        r = parent_session.get(f"{API}/admin/stats")
        assert r.status_code == 403
