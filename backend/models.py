"""Pydantic models and MongoDB document schemas for Brevitus Technology."""
from datetime import datetime, timezone
from typing import List, Optional, Any
from pydantic import BaseModel, Field, EmailStr, ConfigDict
import uuid


def _uid() -> str:
    return str(uuid.uuid4())


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


class BaseDoc(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)
    id: str = Field(default_factory=_uid)
    created_at: str = Field(default_factory=_now)
    updated_at: str = Field(default_factory=_now)


# ---------- Auth ----------
class LoginInput(BaseModel):
    username: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


# ---------- Course ----------
class CourseFAQ(BaseModel):
    question: str
    answer: str


class CourseBatch(BaseModel):
    start_date: str = ""
    mode: str = "Online"
    seats_left: Optional[int] = None


class Course(BaseDoc):
    title: str
    slug: str = ""
    short_summary: str = ""
    long_description: str = ""
    thumbnail: str = ""  # base64 data URL
    thumbnail_alt: str = ""
    curriculum: List[str] = []
    tools: List[str] = []
    projects: List[str] = []
    duration: str = ""
    price: str = ""
    mode: str = "Online"
    next_batch_date: str = ""
    batches: List[CourseBatch] = []
    faqs: List[CourseFAQ] = []
    seo_title: str = ""
    seo_description: str = ""
    is_published: bool = True
    order: int = 0


# ---------- Blog ----------
class Blog(BaseDoc):
    title: str
    slug: str = ""
    excerpt: str = ""
    content: str = ""  # HTML from TipTap
    cover_image: str = ""  # base64
    cover_alt: str = ""
    category: str = ""
    tags: List[str] = []
    author: str = "Brevitus Team"
    seo_title: str = ""
    seo_description: str = ""
    is_published: bool = True
    published_at: str = Field(default_factory=_now)


# ---------- Testimonial ----------
class Testimonial(BaseDoc):
    name: str
    role: str = ""
    company: str = ""
    quote: str
    photo: str = ""  # base64
    linkedin_url: str = ""
    rating: int = 5
    order: int = 0


# ---------- Team ----------
class TeamMember(BaseDoc):
    name: str
    role: str
    bio: str = ""
    photo: str = ""
    credentials: List[str] = []
    linkedin_url: str = ""
    twitter_url: str = ""
    is_founder: bool = False
    order: int = 0


# ---------- Project ----------
class Project(BaseDoc):
    title: str
    category: str = ""
    description: str = ""
    tech_tags: List[str] = []
    thumbnail: str = ""
    thumbnail_alt: str = ""
    external_url: str = ""
    order: int = 0


# ---------- Event / Internship ----------
class Event(BaseDoc):
    title: str
    description: str = ""
    event_date: str = ""
    location: str = ""
    apply_link: str = ""
    thumbnail: str = ""
    is_upcoming: bool = True
    order: int = 0


class Internship(BaseDoc):
    title: str
    description: str = ""
    duration: str = ""
    stipend: str = ""
    apply_link: str = ""
    thumbnail: str = ""
    order: int = 0


# ---------- Lead ----------
class LeadCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    current_status: str  # Student / Fresher / Working Professional
    college_or_company: str = ""
    course_interested: str
    preferred_mode: str  # Online/Offline/Hybrid
    message: str = ""
    honeypot: str = ""  # anti-spam


class Lead(BaseDoc):
    full_name: str
    email: str
    phone: str
    current_status: str
    college_or_company: str = ""
    course_interested: str
    preferred_mode: str
    message: str = ""
    status: str = "new"  # new / contacted / converted / rejected
    notes: str = ""


class LeadUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


# ---------- Homepage ----------
class HomepageStat(BaseModel):
    label: str
    value: str


class HomepageFAQ(BaseModel):
    question: str
    answer: str


class Homepage(BaseModel):
    id: str = "homepage"
    hero_heading: str = ""
    hero_subheading: str = ""
    hero_cta_primary: str = "Book Free Demo"
    hero_cta_secondary: str = "Explore Courses"
    hero_image: str = ""
    stats: List[HomepageStat] = []
    what_we_do_heading: str = ""
    what_we_do_items: List[dict] = []  # {title, description, icon}
    faqs: List[HomepageFAQ] = []
    testimonial_heading: str = "What our learners say"
    updated_at: str = Field(default_factory=_now)


# ---------- Settings ----------
class Settings(BaseModel):
    id: str = "settings"
    site_name: str = "Brevitus Technology"
    site_tagline: str = "Master AI, Data & Analytics"
    default_seo_title: str = "Brevitus Technology — AI, Data Science & Analytics Courses"
    default_seo_description: str = "Job-ready EdTech courses in Data Science, AI, ML, Analytics, Python, SQL, Power BI, and Tableau."
    contact_email: str = "hello@brevitus.tech"
    contact_phone: str = "+91-9000000000"
    contact_address: str = "Bengaluru, India"
    whatsapp_number: str = "919000000000"
    social_linkedin: str = ""
    social_instagram: str = ""
    social_youtube: str = ""
    social_twitter: str = ""
    ga4_id: str = ""
    gsc_verification: str = ""
    logo: str = ""
    updated_at: str = Field(default_factory=_now)
