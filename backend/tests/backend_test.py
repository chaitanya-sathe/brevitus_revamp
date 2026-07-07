"""End-to-end backend tests for Brevitus Technology API."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://admin-lead-dash.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "Brevitus@2026"

EXPECTED_COURSE_SLUGS = {
    "data-science",
    "artificial-intelligence-machine-learning",
    "generative-agentic-ai",
    "data-analytics",
    "python-programming",
    "sql-for-data",
    "power-bi",
    "tableau",
}


# ---------- fixtures ----------
@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(session):
    r = session.post(f"{API}/auth/login", json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    tok = r.json().get("access_token")
    assert tok
    return tok


@pytest.fixture(scope="session")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ---------- Auth ----------
class TestAuth:
    def test_login_success(self, session):
        r = session.post(f"{API}/auth/login", json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert "access_token" in data and isinstance(data["access_token"], str)
        assert data["user"]["username"] == ADMIN_USERNAME
        assert data["user"]["role"] == "admin"

    def test_login_invalid(self, session):
        r = session.post(f"{API}/auth/login", json={"username": ADMIN_USERNAME, "password": "wrong"})
        assert r.status_code == 401

    def test_me_requires_token(self, session):
        r = session.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_ok(self, session, admin_headers):
        r = session.get(f"{API}/auth/me", headers=admin_headers)
        assert r.status_code == 200
        assert r.json()["username"] == ADMIN_USERNAME
        assert r.json()["role"] == "admin"


# ---------- Public endpoints ----------
class TestPublic:
    def test_public_courses_count_and_slugs(self, session):
        r = session.get(f"{API}/public/courses")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        slugs = {c["slug"] for c in items}
        assert EXPECTED_COURSE_SLUGS.issubset(slugs), f"missing slugs: {EXPECTED_COURSE_SLUGS - slugs}"
        assert len(items) >= 8

    def test_public_course_by_slug(self, session):
        r = session.get(f"{API}/public/courses/data-science")
        assert r.status_code == 200
        assert r.json()["slug"] == "data-science"
        assert r.json()["title"].lower().startswith("data")

    def test_public_course_404(self, session):
        r = session.get(f"{API}/public/courses/does-not-exist")
        assert r.status_code == 404

    def test_public_homepage(self, session):
        r = session.get(f"{API}/public/homepage")
        assert r.status_code == 200
        d = r.json()
        assert d.get("hero_heading")
        assert isinstance(d.get("stats"), list) and len(d["stats"]) >= 1

    def test_public_testimonials(self, session):
        r = session.get(f"{API}/public/testimonials")
        assert r.status_code == 200
        assert len(r.json()) >= 1

    def test_public_team(self, session):
        r = session.get(f"{API}/public/team")
        assert r.status_code == 200
        assert len(r.json()) >= 1

    def test_public_projects(self, session):
        r = session.get(f"{API}/public/projects")
        assert r.status_code == 200
        assert len(r.json()) >= 1

    def test_public_settings(self, session):
        r = session.get(f"{API}/public/settings")
        assert r.status_code == 200
        s = r.json()
        assert s.get("site_name")

    def test_public_blogs(self, session):
        r = session.get(f"{API}/public/blogs")
        assert r.status_code == 200
        assert len(r.json()) >= 1


# ---------- Leads ----------
class TestLeads:
    lead_id = None

    def test_create_lead(self, session):
        payload = {
            "full_name": "TEST_Lead User",
            "email": f"test_{uuid.uuid4().hex[:6]}@example.com",
            "phone": "+919000000123",
            "current_status": "Student",
            "college_or_company": "TEST College",
            "course_interested": "Data Science",
            "preferred_mode": "Online",
            "message": "hello from pytest",
            "honeypot": "",
        }
        r = session.post(f"{API}/leads", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d.get("ok") is True
        assert d.get("id")
        TestLeads.lead_id = d["id"]

    def test_honeypot_skips_db(self, session):
        payload = {
            "full_name": "Spammer",
            "email": "spammer@example.com",
            "phone": "1234",
            "current_status": "Student",
            "course_interested": "X",
            "preferred_mode": "Online",
            "honeypot": "trap",
        }
        r = session.post(f"{API}/leads", json=payload)
        assert r.status_code == 200
        assert r.json() == {"ok": True}  # no id returned

    def test_list_leads_contains_created(self, session, admin_headers):
        assert TestLeads.lead_id, "prior test must have created a lead"
        r = session.get(f"{API}/admin/leads", headers=admin_headers)
        assert r.status_code == 200
        ids = [x["id"] for x in r.json()]
        assert TestLeads.lead_id in ids

    def test_update_lead(self, session, admin_headers):
        assert TestLeads.lead_id
        r = session.patch(
            f"{API}/admin/leads/{TestLeads.lead_id}",
            headers=admin_headers,
            json={"status": "contacted", "notes": "reached out"},
        )
        assert r.status_code == 200
        # verify persistence via list
        r2 = session.get(f"{API}/admin/leads", headers=admin_headers)
        row = next((x for x in r2.json() if x["id"] == TestLeads.lead_id), None)
        assert row and row["status"] == "contacted" and row["notes"] == "reached out"

    def test_leads_csv(self, session, admin_headers):
        r = session.get(f"{API}/admin/leads.csv", headers=admin_headers)
        assert r.status_code == 200
        assert "text/csv" in r.headers.get("content-type", "")
        assert "full_name" in r.text

    def test_delete_lead(self, session, admin_headers):
        assert TestLeads.lead_id
        r = session.delete(f"{API}/admin/leads/{TestLeads.lead_id}", headers=admin_headers)
        assert r.status_code == 200
        r2 = session.get(f"{API}/admin/leads", headers=admin_headers)
        assert TestLeads.lead_id not in [x["id"] for x in r2.json()]


# ---------- Dashboard ----------
class TestDashboard:
    def test_dashboard_requires_auth(self, session):
        r = session.get(f"{API}/admin/dashboard")
        assert r.status_code == 401

    def test_dashboard_ok(self, session, admin_headers):
        r = session.get(f"{API}/admin/dashboard", headers=admin_headers)
        assert r.status_code == 200
        d = r.json()
        for k in ["total_leads", "new_leads", "week_leads", "total_courses", "total_blogs", "recent_leads"]:
            assert k in d
        assert d["total_courses"] >= 8
        assert d["total_blogs"] >= 1


# ---------- Admin CRUD (courses example + slug generation) ----------
class TestAdminCRUD:
    created_ids = {}

    def _cycle(self, session, admin_headers, resource: str, payload: dict, title_field: str = "title"):
        # CREATE
        r = session.post(f"{API}/admin/{resource}", headers=admin_headers, json=payload)
        assert r.status_code == 200, f"POST {resource} failed: {r.status_code} {r.text}"
        doc = r.json()
        assert doc.get("id")
        TestAdminCRUD.created_ids[resource] = doc["id"]
        # UPDATE
        upd = {title_field: payload[title_field] + " (updated)"} if title_field in payload else {"description": "updated"}
        r = session.put(f"{API}/admin/{resource}/{doc['id']}", headers=admin_headers, json=upd)
        assert r.status_code == 200, r.text
        # DELETE
        r = session.delete(f"{API}/admin/{resource}/{doc['id']}", headers=admin_headers)
        assert r.status_code == 200

    def test_courses_crud_slug_autogen(self, session, admin_headers):
        payload = {"title": "TEST_Course Alpha", "short_summary": "s", "mode": "Online"}
        r = session.post(f"{API}/admin/courses", headers=admin_headers, json=payload)
        assert r.status_code == 200, r.text
        doc = r.json()
        assert doc["slug"] == "test_course-alpha" or doc["slug"] == "testcourse-alpha" or "test" in doc["slug"], f"slug: {doc['slug']}"
        # cleanup
        session.delete(f"{API}/admin/courses/{doc['id']}", headers=admin_headers)

    def test_blogs_crud(self, session, admin_headers):
        self._cycle(session, admin_headers, "blogs", {"title": "TEST_Blog Post", "content": "<p>hi</p>"})

    def test_testimonials_crud(self, session, admin_headers):
        self._cycle(session, admin_headers, "testimonials", {"name": "TEST_Tester", "quote": "great course"}, title_field="name")

    def test_team_crud(self, session, admin_headers):
        self._cycle(session, admin_headers, "team", {"name": "TEST_Member", "role": "Instructor"}, title_field="name")

    def test_projects_crud(self, session, admin_headers):
        self._cycle(session, admin_headers, "projects", {"title": "TEST_Project", "description": "d"})

    def test_events_crud(self, session, admin_headers):
        self._cycle(session, admin_headers, "events", {"title": "TEST_Event", "description": "d"})

    def test_internships_crud(self, session, admin_headers):
        self._cycle(session, admin_headers, "internships", {"title": "TEST_Internship", "description": "d"})


# ---------- Homepage / Settings upsert ----------
class TestHomepageSettings:
    def test_homepage_upsert(self, session, admin_headers):
        r = session.get(f"{API}/admin/homepage", headers=admin_headers)
        assert r.status_code == 200
        original = r.json()
        original_heading = original.get("hero_heading", "")

        payload = dict(original)
        payload["hero_heading"] = "TEST_HEADING"
        r = session.put(f"{API}/admin/homepage", headers=admin_headers, json=payload)
        assert r.status_code == 200
        assert r.json()["hero_heading"] == "TEST_HEADING"

        # revert
        payload["hero_heading"] = original_heading
        r = session.put(f"{API}/admin/homepage", headers=admin_headers, json=payload)
        assert r.status_code == 200

    def test_settings_upsert(self, session, admin_headers):
        r = session.get(f"{API}/admin/settings", headers=admin_headers)
        assert r.status_code == 200
        original = r.json()
        original_tagline = original.get("site_tagline", "")

        payload = dict(original)
        payload["site_tagline"] = "TEST_TAGLINE"
        r = session.put(f"{API}/admin/settings", headers=admin_headers, json=payload)
        assert r.status_code == 200
        assert r.json()["site_tagline"] == "TEST_TAGLINE"

        # verify via public
        r2 = session.get(f"{API}/public/settings")
        assert r2.json()["site_tagline"] == "TEST_TAGLINE"

        # revert
        payload["site_tagline"] = original_tagline
        session.put(f"{API}/admin/settings", headers=admin_headers, json=payload)


# ---------- SEO endpoints ----------
class TestSEO:
    def test_sitemap(self, session):
        r = session.get(f"{API}/sitemap.xml")
        assert r.status_code == 200
        assert "application/xml" in r.headers.get("content-type", "")
        body = r.text
        assert "data-science" in body
        assert "why-2026-is-the-year-to-learn-agentic-ai" in body

    def test_robots(self, session):
        r = session.get(f"{API}/robots.txt")
        assert r.status_code == 200
        assert "User-agent" in r.text
        assert "Disallow: /admin" in r.text

    def test_llms(self, session):
        r = session.get(f"{API}/llms.txt")
        assert r.status_code == 200
        assert "Brevitus" in r.text
