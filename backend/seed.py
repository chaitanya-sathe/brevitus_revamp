"""Seed initial data: 8 courses, sample testimonials/team/projects/homepage."""
from datetime import datetime, timezone

# tiny local slugify
import re


def _slug(s: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9\s-]", "", s).strip().lower()
    return re.sub(r"[\s-]+", "-", s)


COURSES = [
    {
        "title": "Data Science",
        "short_summary": "Master statistics, Python, ML, and real-world projects to become a job-ready Data Scientist.",
        "long_description": "A comprehensive, hands-on Data Science program that takes you from Python fundamentals to advanced machine learning. Learn statistics, data wrangling, exploratory analysis, supervised & unsupervised algorithms, model evaluation, and MLOps basics. Build a portfolio of 5+ industry-grade projects with mentorship from working data scientists.",
        "curriculum": [
            "Python for Data Science",
            "Statistics & Probability",
            "Pandas, NumPy & EDA",
            "SQL for analysts",
            "Machine Learning: Regression, Classification, Clustering",
            "Deep Learning fundamentals",
            "Capstone project + portfolio review",
        ],
        "tools": ["Python", "Pandas", "Scikit-learn", "SQL", "Jupyter", "Git", "Tableau"],
        "projects": ["Customer Churn Prediction", "Sales Forecasting", "NLP Sentiment Analyzer", "Recommendation Engine"],
        "duration": "6 months",
        "price": "₹49,999",
        "mode": "Hybrid",
        "next_batch_date": "2026-03-15",
        "seo_title": "Data Science Course — Python, ML & Capstone Projects | Brevitus",
        "seo_description": "Learn Data Science with Python, ML, SQL and real-world projects. 6-month job-ready program with placement support.",
    },
    {
        "title": "Artificial Intelligence & Machine Learning",
        "short_summary": "Build production ML systems — deep learning, computer vision, NLP, MLOps.",
        "long_description": "Go beyond basics with our advanced AI & ML program. Master neural networks, CNNs, RNNs, transformers, and MLOps. Ship models to production with Docker, FastAPI, and cloud deployment.",
        "curriculum": [
            "Advanced Python & Math for ML",
            "Supervised & Unsupervised ML",
            "Deep Learning with PyTorch",
            "Computer Vision (CNNs, YOLO)",
            "Natural Language Processing",
            "MLOps: Docker, MLflow, deployment",
            "Capstone: end-to-end AI product",
        ],
        "tools": ["PyTorch", "TensorFlow", "HuggingFace", "Docker", "FastAPI", "AWS/GCP"],
        "projects": ["Image classifier API", "Chatbot with RAG", "Object detection dashboard"],
        "duration": "7 months",
        "price": "₹59,999",
        "mode": "Hybrid",
        "next_batch_date": "2026-03-22",
        "seo_title": "AI & Machine Learning Course — Deep Learning, MLOps | Brevitus",
        "seo_description": "Master Deep Learning, CV, NLP & MLOps. Build & deploy production AI systems with mentorship.",
    },
    {
        "title": "Generative & Agentic AI",
        "short_summary": "Build LLM apps, RAG pipelines and autonomous AI agents.",
        "long_description": "The future is agentic. Learn prompt engineering, LLM fine-tuning, RAG, vector databases, tool-using agents, and multi-agent orchestration. Ship real AI products powered by GPT, Claude, and open-source models.",
        "curriculum": [
            "LLM fundamentals & prompt engineering",
            "Retrieval-Augmented Generation (RAG)",
            "Vector DBs: Pinecone, Chroma",
            "Fine-tuning & LoRA",
            "Agent frameworks: LangGraph, CrewAI",
            "Multi-agent systems",
            "Capstone: launch your own AI agent",
        ],
        "tools": ["OpenAI", "Anthropic", "LangChain", "LangGraph", "Pinecone", "Chroma"],
        "projects": ["Custom RAG chatbot", "Autonomous research agent", "Multi-agent workflow"],
        "duration": "5 months",
        "price": "₹64,999",
        "mode": "Online",
        "next_batch_date": "2026-03-10",
        "seo_title": "Generative & Agentic AI Course — LLMs, RAG, Agents | Brevitus",
        "seo_description": "Build LLM apps, RAG systems and autonomous AI agents with LangChain, LangGraph & vector DBs.",
    },
    {
        "title": "Data Analytics",
        "short_summary": "Analyst-track program: Excel, SQL, Power BI, Tableau and business storytelling.",
        "long_description": "Become a business-ready Data Analyst. Master Excel, SQL, visualization, and dashboarding. Learn how to translate messy data into decisions with storytelling frameworks used at top firms.",
        "curriculum": [
            "Advanced Excel & business math",
            "SQL for analysts",
            "Power BI dashboards",
            "Tableau storytelling",
            "Statistics for business",
            "Case studies + capstone",
        ],
        "tools": ["Excel", "SQL", "Power BI", "Tableau", "Python (intro)"],
        "projects": ["Sales KPI dashboard", "Marketing funnel analysis", "Financial reporting suite"],
        "duration": "4 months",
        "price": "₹34,999",
        "mode": "Hybrid",
        "next_batch_date": "2026-03-08",
        "seo_title": "Data Analytics Course — SQL, Power BI, Tableau | Brevitus",
        "seo_description": "Learn Excel, SQL, Power BI & Tableau. Real dashboards, real case studies, real placement support.",
    },
    {
        "title": "Python Programming",
        "short_summary": "From zero to confident Pythonista — automation, OOP, and beyond.",
        "long_description": "Learn Python for absolute beginners and grow into automation, web scraping, and OOP. Perfect foundation for data, AI, or backend paths.",
        "curriculum": [
            "Python basics & control flow",
            "Data structures",
            "Functions & OOP",
            "File I/O & modules",
            "Automation projects",
            "Intro to web scraping & APIs",
        ],
        "tools": ["Python", "VS Code", "Git", "Requests", "BeautifulSoup"],
        "projects": ["File organizer bot", "Weather CLI", "Web scraper"],
        "duration": "2 months",
        "price": "₹14,999",
        "mode": "Online",
        "next_batch_date": "2026-03-01",
        "seo_title": "Python Programming Course — Beginner to Pro | Brevitus",
        "seo_description": "Master Python from scratch. Build automation, scripts, and small apps in 8 weeks.",
    },
    {
        "title": "SQL for Data",
        "short_summary": "Query, join, optimize — the SQL every data role demands.",
        "long_description": "Master SQL for analytics and engineering. Learn queries, joins, subqueries, window functions, and performance tuning. Practice on real datasets from ecommerce, finance, and SaaS.",
        "curriculum": [
            "SELECT, WHERE, GROUP BY",
            "Joins (inner/outer/self)",
            "Subqueries & CTEs",
            "Window functions",
            "Indexing & query performance",
            "Interview prep drills",
        ],
        "tools": ["PostgreSQL", "MySQL", "BigQuery basics"],
        "projects": ["Ecommerce cohort analysis", "SaaS funnel queries"],
        "duration": "6 weeks",
        "price": "₹9,999",
        "mode": "Online",
        "next_batch_date": "2026-02-25",
        "seo_title": "SQL for Data Course — Analytics & Interview Prep | Brevitus",
        "seo_description": "Master SQL end-to-end: joins, CTEs, windows, performance. Includes interview drills.",
    },
    {
        "title": "Power BI",
        "short_summary": "Dashboards that drive decisions — DAX, Power Query & storytelling.",
        "long_description": "Turn raw data into stakeholder-ready dashboards. Learn Power Query, DAX, data modeling, and design principles.",
        "curriculum": [
            "Power Query & data prep",
            "Data modeling & relationships",
            "DAX essentials",
            "Advanced DAX & time intelligence",
            "Design principles for dashboards",
            "Publishing & sharing",
        ],
        "tools": ["Power BI Desktop", "Power BI Service", "Excel"],
        "projects": ["Sales & revenue dashboard", "HR analytics dashboard"],
        "duration": "8 weeks",
        "price": "₹12,999",
        "mode": "Online",
        "next_batch_date": "2026-02-28",
        "seo_title": "Power BI Course — DAX, Dashboards & Design | Brevitus",
        "seo_description": "Build boardroom-ready Power BI dashboards with DAX, modeling and clear design.",
    },
    {
        "title": "Tableau",
        "short_summary": "Beautiful, insight-driven dashboards with Tableau.",
        "long_description": "Learn Tableau from data connection to publishing. Master calculated fields, LOD expressions, and visual best practices.",
        "curriculum": [
            "Tableau basics",
            "Charts & visual grammar",
            "Calculated fields & parameters",
            "LOD expressions",
            "Dashboards & storytelling",
            "Publishing to Tableau Public",
        ],
        "tools": ["Tableau Desktop", "Tableau Public"],
        "projects": ["Global sales dashboard", "Marketing spend analyzer"],
        "duration": "6 weeks",
        "price": "₹11,999",
        "mode": "Online",
        "next_batch_date": "2026-02-27",
        "seo_title": "Tableau Course — Dashboards, LOD & Storytelling | Brevitus",
        "seo_description": "Design stunning Tableau dashboards with LOD expressions and storytelling techniques.",
    },
]


TESTIMONIALS = [
    {"name": "Priya Sharma", "role": "Data Scientist", "company": "Fintech Startup", "quote": "Brevitus turned my career around. From no coding background to a Data Scientist role in 7 months — the mentorship and projects made the difference.", "rating": 5, "order": 1},
    {"name": "Aditya Verma", "role": "AI Engineer", "company": "Product SaaS", "quote": "The Agentic AI cohort was ahead of the curve. I built and shipped an AI agent for my company before the course ended.", "rating": 5, "order": 2},
    {"name": "Rhea Kapoor", "role": "Data Analyst", "company": "E-commerce", "quote": "SQL, Power BI, and storytelling — everything a modern analyst needs. My dashboards now drive board decisions.", "rating": 5, "order": 3},
    {"name": "Karan Mehta", "role": "ML Engineer", "company": "Health-tech", "quote": "The MLOps modules were gold. I finally understood how to ship models to production.", "rating": 5, "order": 4},
]


TEAM = [
    {"name": "Rajesh Menon", "role": "Founder & CEO", "bio": "15+ years in AI/ML across product companies. Ex-Google & Flipkart. Passionate about accessible, outcomes-first education.", "credentials": ["M.S. Computer Science, IIT", "Ex-Google", "Ex-Flipkart"], "is_founder": True, "order": 0},
    {"name": "Neha Iyer", "role": "Head of Curriculum", "bio": "Curriculum architect with a decade of industry teaching experience.", "credentials": ["Ph.D. Statistics", "10+ yrs teaching"], "order": 1},
    {"name": "Aman Gupta", "role": "Lead AI Instructor", "bio": "Deep learning engineer with published research in NLP.", "credentials": ["M.Tech AI", "Published NeurIPS"], "order": 2},
]


PROJECTS = [
    {"title": "AI-Powered Resume Screener", "category": "Generative AI", "description": "Student capstone using LLMs and RAG to rank resumes against job descriptions.", "tech_tags": ["Python", "LangChain", "FastAPI"], "order": 0},
    {"title": "Customer Churn Predictor", "category": "Machine Learning", "description": "Ensemble ML model on telecom data with 89% ROC-AUC.", "tech_tags": ["Scikit-learn", "XGBoost", "SHAP"], "order": 1},
    {"title": "Sales KPI Dashboard", "category": "Data Analytics", "description": "Interactive Power BI dashboard for regional sales performance.", "tech_tags": ["Power BI", "SQL", "DAX"], "order": 2},
    {"title": "Autonomous Research Agent", "category": "Agentic AI", "description": "Multi-agent system that researches topics and produces briefs.", "tech_tags": ["LangGraph", "OpenAI", "Chroma"], "order": 3},
]


HOMEPAGE = {
    "hero_heading": "Master AI, Data & Analytics",
    "hero_subheading": "Job-ready programs, live mentorship, real projects, and a placement network that actually works.",
    "hero_cta_primary": "Book Free Demo",
    "hero_cta_secondary": "Explore Courses",
    "stats": [
        {"label": "Learners trained", "value": "2,400+"},
        {"label": "Placement rate", "value": "92%"},
        {"label": "Hiring partners", "value": "80+"},
        {"label": "Avg. salary hike", "value": "68%"},
    ],
    "what_we_do_heading": "How Brevitus is different",
    "what_we_do_items": [
        {"title": "Outcome-driven curriculum", "description": "Every module maps to a real job function. No theory bloat.", "icon": "Target"},
        {"title": "Live 1:1 mentorship", "description": "Working practitioners guide you weekly.", "icon": "Handshake"},
        {"title": "Portfolio you can defend", "description": "5+ real projects reviewed by hiring managers.", "icon": "Briefcase"},
        {"title": "Placement network", "description": "Direct intros to 80+ hiring partners.", "icon": "Rocket"},
    ],
    "faqs": [
        {"question": "Do I need prior coding experience?", "answer": "No. Our Python and Data Analytics programs assume zero background. AI/ML programs benefit from Python basics — we help you get there."},
        {"question": "What is the placement support?", "answer": "Resume reviews, mock interviews, portfolio audits, and direct intros to our hiring network. 92% placement rate for eligible learners."},
        {"question": "Are the classes live?", "answer": "Yes. Live sessions with recordings you can revisit, plus weekly 1:1 mentorship."},
        {"question": "Is there an EMI option?", "answer": "Yes — 0% EMI available on all long-form programs."},
    ],
    "testimonial_heading": "What our learners say",
}


async def seed_all(db):
    now = datetime.now(timezone.utc).isoformat()
    import uuid

    # image URL builder (Unsplash CDN)
    def img(pid, w=800, h=500):
        return f"https://images.unsplash.com/{pid}?auto=format&fit=crop&w={w}&h={h}&q=70"

    COURSE_IMGS = {
        "Data Science": img("photo-1551288049-bebda4e38f71"),
        "Artificial Intelligence & Machine Learning": img("photo-1677442136019-21780ecad995"),
        "Generative & Agentic AI": img("photo-1620712943543-bcc4688e7485"),
        "Data Analytics": img("photo-1460925895917-afdab827c52f"),
        "Python Programming": img("photo-1526379095098-d400fd0bf935"),
        "SQL for Data": img("photo-1544383835-bda2bc66a55d"),
        "Power BI": img("photo-1543286386-713bdd548da4"),
        "Tableau": img("photo-1518186285589-2f7649de83e0"),
    }
    PROJECT_IMGS = {
        "AI-Powered Resume Screener": img("photo-1497633762265-9d179a990aa6", 600, 400),
        "Customer Churn Predictor": img("photo-1551288049-bebda4e38f71", 600, 400),
        "Sales KPI Dashboard": img("photo-1553877522-43269d4ea984", 600, 400),
        "Autonomous Research Agent": img("photo-1620712943543-bcc4688e7485", 600, 400),
    }
    TEAM_IMGS = {
        "Rajesh Menon": img("photo-1560250097-0b93528c311a", 500, 500),
        "Neha Iyer": img("photo-1580489944761-15a19d654956", 500, 500),
        "Aman Gupta": img("photo-1519085360753-af0119f7cbe7", 500, 500),
    }
    TESTI_IMGS = {
        "Priya Sharma": img("photo-1573496359142-b8d87734a5a2", 300, 300),
        "Aditya Verma": img("photo-1544723795-3fb6469f5b39", 300, 300),
        "Rhea Kapoor": img("photo-1494790108377-be9c29b29330", 300, 300),
        "Karan Mehta": img("photo-1500648767791-00dcc994a43e", 300, 300),
    }
    HERO_IMG = img("photo-1522202176988-66273c2fd55f", 1200, 800)
    BLOG_COVER = img("photo-1677442136019-21780ecad995", 1200, 630)

    # Courses
    if await db.courses.count_documents({}) == 0:
        docs = []
        for i, c in enumerate(COURSES):
            docs.append({
                "id": str(uuid.uuid4()),
                "title": c["title"],
                "slug": _slug(c["title"]),
                "short_summary": c["short_summary"],
                "long_description": c["long_description"],
                "thumbnail": COURSE_IMGS.get(c["title"], ""),
                "thumbnail_alt": c["title"],
                "curriculum": c["curriculum"],
                "tools": c["tools"],
                "projects": c["projects"],
                "duration": c["duration"],
                "price": c["price"],
                "mode": c["mode"],
                "next_batch_date": c["next_batch_date"],
                "batches": [],
                "faqs": [],
                "seo_title": c["seo_title"],
                "seo_description": c["seo_description"],
                "is_published": True,
                "order": i,
                "created_at": now,
                "updated_at": now,
            })
        await db.courses.insert_many(docs)

    # Testimonials
    if await db.testimonials.count_documents({}) == 0:
        docs = []
        for t in TESTIMONIALS:
            docs.append({
                "id": str(uuid.uuid4()),
                "name": t["name"],
                "role": t["role"],
                "company": t["company"],
                "quote": t["quote"],
                "photo": TESTI_IMGS.get(t["name"], ""),
                "order": t["order"],
                "created_at": now,
                "updated_at": now,
            })
        await db.testimonials.insert_many(docs)

    # Team
    if await db.team.count_documents({}) == 0:
        docs = []
        for m in TEAM:
            docs.append({
                "id": str(uuid.uuid4()),
                "name": m["name"],
                "role": m["role"],
                "bio": m["bio"],
                "photo": TEAM_IMGS.get(m["name"], ""),
                "credentials": m["credentials"],
                "linkedin_url": "",
                "twitter_url": "",
                "is_founder": m.get("is_founder", False),
                "order": m["order"],
                "created_at": now,
                "updated_at": now,
            })
        await db.team.insert_many(docs)

    # Projects
    if await db.projects.count_documents({}) == 0:
        docs = []
        for p in PROJECTS:
            docs.append({
                "id": str(uuid.uuid4()),
                "title": p["title"],
                "category": p["category"],
                "description": p["description"],
                "tech_tags": p["tech_tags"],
                "thumbnail": PROJECT_IMGS.get(p["title"], ""),
                "thumbnail_alt": p["title"],
                "external_url": "",
                "order": p["order"],
                "created_at": now,
                "updated_at": now,
            })
        await db.projects.insert_many(docs)

    # Homepage
    if await db.homepage.find_one({"id": "homepage"}) is None:
        await db.homepage.insert_one({**HOMEPAGE, "id": "homepage", "hero_image": HERO_IMG, "updated_at": now})

    # Settings
    if await db.settings.find_one({"id": "settings"}) is None:
        await db.settings.insert_one({
            "id": "settings",
            "site_name": "Brevitus Technology",
            "site_tagline": "Master AI, Data & Analytics",
            "default_seo_title": "Brevitus Technology — AI, Data Science & Analytics Courses",
            "default_seo_description": "Job-ready EdTech courses in Data Science, AI, ML, Analytics, Python, SQL, Power BI, and Tableau.",
            "contact_email": "hello@brevitus.tech",
            "contact_phone": "+91-9000000000",
            "contact_address": "Bengaluru, India",
            "whatsapp_number": "919000000000",
            "social_linkedin": "",
            "social_instagram": "",
            "social_youtube": "",
            "social_twitter": "",
            "ga4_id": "",
            "gsc_verification": "",
            "logo": "",
            "updated_at": now,
        })

    # Sample blog
    if await db.blogs.count_documents({}) == 0:
        await db.blogs.insert_one({
            "id": str(uuid.uuid4()),
            "title": "Why 2026 is the Year to Learn Agentic AI",
            "slug": "why-2026-is-the-year-to-learn-agentic-ai",
            "excerpt": "Agentic AI is moving from labs to production. Here's what learners must focus on to stay ahead.",
            "content": "<h2>The rise of agents</h2><p>2026 marks a turning point for autonomous AI systems. From research copilots to full-stack coding agents, the shift from single-shot LLM calls to multi-step, tool-using agents is here.</p><h3>What to learn</h3><ul><li>Prompt engineering fundamentals</li><li>RAG pipelines & vector DBs</li><li>Agent orchestration with LangGraph</li><li>Evaluation & safety</li></ul><p>Our Generative & Agentic AI cohort covers every one of these. Book a demo to see the curriculum.</p>",
            "cover_image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&h=630&q=70",
            "cover_alt": "Agentic AI",
            "category": "AI",
            "tags": ["Agentic AI", "LLM", "RAG"],
            "author": "Brevitus Team",
            "seo_title": "Why 2026 is the Year to Learn Agentic AI | Brevitus",
            "seo_description": "Agentic AI is moving from labs to production. Learn the fundamentals every professional needs.",
            "is_published": True,
            "published_at": now,
            "created_at": now,
            "updated_at": now,
        })
