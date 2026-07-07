# Brevitus Technology — Dynamic Website + Admin Panel (PRD)

## Original problem statement
Fully dynamic, SEO-optimized website for Brevitus Technology with a secure admin panel to manage every piece of content, plus an admission form that captures leads directly into the admin dashboard. Deep-blue + electric-purple gradient edtech feel. Admin credentials: `admin` / `Brevitus@2026`. Preloaded courses: Data Science, AI & ML, Generative & Agentic AI, Data Analytics, Python, SQL, Power BI, Tableau.

## User personas
1. **Public visitor** — students, freshers, working pros, colleges, recruiters.
2. **Admin** — founder / marketing team, single user.

## Core requirements (static)
- Public: Home, Courses list & detail, Blog list & detail, About, Team, Founder, Contact, Admission form, Success Stories, Events, Internships.
- SEO: dynamic meta, canonical, OG, Twitter, JSON-LD, sitemap.xml, robots.txt, llms.txt.
- Sticky WhatsApp + Book Free Demo CTAs.
- Admission form with honeypot spam protection.
- Admin: JWT auth, dashboard, full CRUD on Courses (with FAQs, curriculum, tools, projects), Blogs (TipTap rich text), Testimonials, Team, Projects, Events, Internships, Homepage sections, Site Settings, Leads (search/filter/status/notes/CSV export). Base64 image uploads.

## What's been implemented (2026-02-07)
- Full backend (FastAPI + MongoDB) with JWT admin auth (bcrypt-hashed, idempotent seed at startup)
- Public + admin REST APIs, sitemap.xml, robots.txt, llms.txt
- Auto-seed 8 courses, sample testimonials, team, projects, homepage, settings, one blog post
- CSV export for leads
- Full React frontend (JS) with react-router, TipTap rich-text editor, react-helmet SEO, Phosphor icons, sonner toasts, base64 image uploader with 900KB guard
- Sticky WhatsApp + Book Free Demo CTAs
- Admin panel with sidebar (dark theme), CRUD screens for all 10 collections + single-doc editors for homepage & settings
- Testing: 33/33 backend pytest ✅, ~97% frontend e2e verified

## Tech stack
- Frontend: React 19 (JS), Tailwind CSS, TipTap, react-router-dom, react-helmet-async, Phosphor icons, sonner, shadcn/ui
- Backend: FastAPI, Motor (Mongo), Pydantic v2, PyJWT, bcrypt
- DB: MongoDB — collections: admins, courses, blogs, testimonials, team, projects, events, internships, leads, homepage (singleton), settings (singleton)

## Backlog (deferred / next phase)
- **P1**: Email acknowledgment on lead submission (Resend/SendGrid) — user asked to skip for now
- **P1**: Object Storage integration for larger images (currently base64 with 900KB guard)
- **P2**: Payment gateway integration (Razorpay/Stripe) for direct course purchase
- **P2**: Student LMS (content delivery, progress tracking)
- **P2**: Automated WhatsApp / SMS notifications on new leads
- **P2**: Multi-admin with roles & permissions
- **P3**: Google Business Profile reviews integration
- **P3**: Analytics dashboard inside admin (leads-over-time chart, conversion funnel)

## Admin credentials
`admin` / `Brevitus@2026` (stored in backend/.env, hashed on startup)
