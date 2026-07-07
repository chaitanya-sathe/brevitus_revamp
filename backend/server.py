"""Brevitus Technology — main FastAPI app."""
from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import re
import io
import csv
import logging
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Response, Query, Body
from fastapi.responses import PlainTextResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

from models import (
    LoginInput, TokenOut,
    Course, Blog, Testimonial, TeamMember, Project, Event, Internship,
    LeadCreate, Lead, LeadUpdate, Homepage, Settings,
)
from auth import create_access_token, verify_password, require_admin, seed_admin
from seed import seed_all


mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Brevitus Technology API")
api = APIRouter(prefix="/api")


def _slug(s: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9\s-]", "", s).strip().lower()
    return re.sub(r"[\s-]+", "-", s)


def _clean(doc: dict) -> dict:
    if doc and "_id" in doc:
        doc.pop("_id", None)
    return doc


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


# =========================================================================
# AUTH
# =========================================================================
@api.post("/auth/login", response_model=TokenOut)
async def login(payload: LoginInput):
    admin = await db.admins.find_one({"username": payload.username}, {"_id": 0})
    if not admin or not verify_password(payload.password, admin.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_access_token(payload.username)
    return TokenOut(access_token=token, user={"username": payload.username, "role": "admin"})


@api.get("/auth/me")
async def me(current=Depends(require_admin)):
    return {"username": current["sub"], "role": current["role"]}


# =========================================================================
# PUBLIC READ ENDPOINTS
# =========================================================================
@api.get("/public/courses")
async def public_courses():
    docs = await db.courses.find({"is_published": True}, {"_id": 0}).sort("order", 1).to_list(200)
    return docs


@api.get("/public/courses/{slug}")
async def public_course(slug: str):
    doc = await db.courses.find_one({"slug": slug, "is_published": True}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Course not found")
    return doc


@api.get("/public/blogs")
async def public_blogs():
    docs = await db.blogs.find({"is_published": True}, {"_id": 0}).sort("published_at", -1).to_list(200)
    return docs


@api.get("/public/blogs/{slug}")
async def public_blog(slug: str):
    doc = await db.blogs.find_one({"slug": slug, "is_published": True}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Blog not found")
    return doc


@api.get("/public/testimonials")
async def public_testimonials():
    return await db.testimonials.find({}, {"_id": 0}).sort("order", 1).to_list(100)


@api.get("/public/team")
async def public_team():
    return await db.team.find({}, {"_id": 0}).sort("order", 1).to_list(100)


@api.get("/public/projects")
async def public_projects():
    return await db.projects.find({}, {"_id": 0}).sort("order", 1).to_list(100)


@api.get("/public/events")
async def public_events():
    return await db.events.find({}, {"_id": 0}).sort("event_date", -1).to_list(100)


@api.get("/public/internships")
async def public_internships():
    return await db.internships.find({}, {"_id": 0}).sort("order", 1).to_list(100)


@api.get("/public/homepage")
async def public_homepage():
    doc = await db.homepage.find_one({"id": "homepage"}, {"_id": 0})
    return doc or {}


@api.get("/public/settings")
async def public_settings():
    doc = await db.settings.find_one({"id": "settings"}, {"_id": 0})
    return doc or {}


# =========================================================================
# LEADS (public POST + admin management)
# =========================================================================
@api.post("/leads")
async def create_lead(payload: LeadCreate):
    # honeypot spam protection
    if payload.honeypot:
        return {"ok": True}  # silently accept spam
    lead = Lead(
        full_name=payload.full_name,
        email=payload.email,
        phone=payload.phone,
        current_status=payload.current_status,
        college_or_company=payload.college_or_company,
        course_interested=payload.course_interested,
        preferred_mode=payload.preferred_mode,
        message=payload.message,
    )
    await db.leads.insert_one(lead.model_dump())
    return {"ok": True, "id": lead.id}


@api.get("/admin/leads")
async def list_leads(
    q: Optional[str] = None,
    status: Optional[str] = None,
    _=Depends(require_admin),
):
    query: dict = {}
    if status:
        query["status"] = status
    if q:
        query["$or"] = [
            {"full_name": {"$regex": q, "$options": "i"}},
            {"email": {"$regex": q, "$options": "i"}},
            {"phone": {"$regex": q, "$options": "i"}},
            {"course_interested": {"$regex": q, "$options": "i"}},
        ]
    return await db.leads.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)


@api.patch("/admin/leads/{lead_id}")
async def update_lead(lead_id: str, payload: LeadUpdate, _=Depends(require_admin)):
    upd = {k: v for k, v in payload.model_dump().items() if v is not None}
    upd["updated_at"] = _now()
    await db.leads.update_one({"id": lead_id}, {"$set": upd})
    return {"ok": True}


@api.delete("/admin/leads/{lead_id}")
async def delete_lead(lead_id: str, _=Depends(require_admin)):
    await db.leads.delete_one({"id": lead_id})
    return {"ok": True}


@api.get("/admin/leads.csv")
async def leads_csv(_=Depends(require_admin)):
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(5000)
    buf = io.StringIO()
    if docs:
        writer = csv.DictWriter(buf, fieldnames=list(docs[0].keys()))
        writer.writeheader()
        writer.writerows(docs)
    return Response(
        content=buf.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=leads.csv"},
    )


# =========================================================================
# DASHBOARD
# =========================================================================
@api.get("/admin/dashboard")
async def dashboard(_=Depends(require_admin)):
    total_leads = await db.leads.count_documents({})
    new_leads = await db.leads.count_documents({"status": "new"})
    # week-old cutoff
    from datetime import timedelta
    week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    week_leads = await db.leads.count_documents({"created_at": {"$gte": week_ago}})
    return {
        "total_leads": total_leads,
        "new_leads": new_leads,
        "week_leads": week_leads,
        "total_courses": await db.courses.count_documents({}),
        "total_blogs": await db.blogs.count_documents({}),
        "total_testimonials": await db.testimonials.count_documents({}),
        "recent_leads": await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(10),
    }


# =========================================================================
# ADMIN CRUD — generic helpers
# =========================================================================
def _crud(prefix: str, collection: str, model_cls, order_field: str = "order", order_dir: int = 1):
    """Attach standard CRUD endpoints to api router."""

    @api.get(f"/admin/{prefix}")
    async def _list(_=Depends(require_admin)):
        return await db[collection].find({}, {"_id": 0}).sort(order_field, order_dir).to_list(500)

    @api.post(f"/admin/{prefix}")
    async def _create(payload: dict = Body(...), _=Depends(require_admin)):
        obj = model_cls(**payload)
        doc = obj.model_dump()
        # generate slug if applicable
        if "slug" in doc and (not doc.get("slug")) and doc.get("title"):
            doc["slug"] = _slug(doc["title"])
        await db[collection].insert_one(doc)
        doc.pop("_id", None)
        return doc

    @api.put(f"/admin/{prefix}/{{item_id}}")
    async def _update(item_id: str, payload: dict = Body(...), _=Depends(require_admin)):
        payload = {k: v for k, v in payload.items() if k not in ("_id", "id", "created_at")}
        payload["updated_at"] = _now()
        if "title" in payload and "slug" in payload and not payload["slug"]:
            payload["slug"] = _slug(payload["title"])
        result = await db[collection].update_one({"id": item_id}, {"$set": payload})
        if result.matched_count == 0:
            raise HTTPException(404, "Not found")
        doc = await db[collection].find_one({"id": item_id}, {"_id": 0})
        return doc

    @api.delete(f"/admin/{prefix}/{{item_id}}")
    async def _delete(item_id: str, _=Depends(require_admin)):
        await db[collection].delete_one({"id": item_id})
        return {"ok": True}


_crud("courses", "courses", Course)
_crud("blogs", "blogs", Blog, order_field="published_at", order_dir=-1)
_crud("testimonials", "testimonials", Testimonial)
_crud("team", "team", TeamMember)
_crud("projects", "projects", Project)
_crud("events", "events", Event, order_field="event_date", order_dir=-1)
_crud("internships", "internships", Internship)


# =========================================================================
# HOMEPAGE / SETTINGS (single-doc)
# =========================================================================
@api.get("/admin/homepage")
async def admin_homepage(_=Depends(require_admin)):
    doc = await db.homepage.find_one({"id": "homepage"}, {"_id": 0})
    return doc or {}


@api.put("/admin/homepage")
async def update_homepage(payload: dict = Body(...), _=Depends(require_admin)):
    payload["updated_at"] = _now()
    payload["id"] = "homepage"
    await db.homepage.update_one({"id": "homepage"}, {"$set": payload}, upsert=True)
    return await db.homepage.find_one({"id": "homepage"}, {"_id": 0})


@api.get("/admin/settings")
async def admin_settings(_=Depends(require_admin)):
    doc = await db.settings.find_one({"id": "settings"}, {"_id": 0})
    return doc or {}


@api.put("/admin/settings")
async def update_settings(payload: dict = Body(...), _=Depends(require_admin)):
    payload["updated_at"] = _now()
    payload["id"] = "settings"
    await db.settings.update_one({"id": "settings"}, {"$set": payload}, upsert=True)
    return await db.settings.find_one({"id": "settings"}, {"_id": 0})


# =========================================================================
# SEO: sitemap / robots / llms
# =========================================================================
def _base_url(request_origin: str = "") -> str:
    return os.environ.get("PUBLIC_SITE_URL", request_origin or "https://brevitus.tech")


@api.get("/sitemap.xml", response_class=Response)
async def sitemap():
    urls = ["/", "/courses", "/blog", "/about", "/team", "/founder", "/contact", "/admission", "/success-stories", "/events", "/internships"]
    courses = await db.courses.find({"is_published": True}, {"_id": 0, "slug": 1, "updated_at": 1}).to_list(500)
    blogs = await db.blogs.find({"is_published": True}, {"_id": 0, "slug": 1, "updated_at": 1}).to_list(500)
    base = _base_url()
    xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        xml.append(f"<url><loc>{base}{u}</loc></url>")
    for c in courses:
        xml.append(f"<url><loc>{base}/courses/{c['slug']}</loc><lastmod>{c.get('updated_at','')}</lastmod></url>")
    for b in blogs:
        xml.append(f"<url><loc>{base}/blog/{b['slug']}</loc><lastmod>{b.get('updated_at','')}</lastmod></url>")
    xml.append("</urlset>")
    return Response(content="\n".join(xml), media_type="application/xml")


@api.get("/robots.txt", response_class=PlainTextResponse)
async def robots():
    base = _base_url()
    return f"User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: {base}/api/sitemap.xml\n"


@api.get("/llms.txt", response_class=PlainTextResponse)
async def llms():
    settings = await db.settings.find_one({"id": "settings"}, {"_id": 0}) or {}
    courses = await db.courses.find({"is_published": True}, {"_id": 0}).sort("order", 1).to_list(200)
    lines = [
        f"# {settings.get('site_name', 'Brevitus Technology')}",
        f"> {settings.get('default_seo_description', '')}",
        "",
        "## Courses",
    ]
    for c in courses:
        lines.append(f"- [{c['title']}](/courses/{c['slug']}) — {c.get('short_summary','')}")
    lines += ["", "## Contact", f"- Email: {settings.get('contact_email','')}", f"- Phone: {settings.get('contact_phone','')}"]
    return "\n".join(lines)


# =========================================================================
# STARTUP
# =========================================================================
@app.on_event("startup")
async def _startup():
    await seed_admin(db)
    await seed_all(db)
    try:
        await db.courses.create_index("slug", unique=True)
        await db.blogs.create_index("slug", unique=True)
    except Exception:
        pass


@api.get("/")
async def root():
    return {"service": "Brevitus Technology API", "status": "ok"}


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


@app.on_event("shutdown")
async def _shutdown():
    client.close()
