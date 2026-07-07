"""One-off script to backfill images across all Brevitus content.
Run: python /app/scripts/backfill_images.py
Safe to re-run — it always overwrites the image fields with the mapped defaults.
"""
import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent.parent / "backend" / ".env")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]

U = "https://images.unsplash.com"

# 800x500 crop params for course cards / 1200x800 for wider heroes
def img(id_, w=800, h=500):
    return f"{U}/{id_}?auto=format&fit=crop&w={w}&h={h}&q=70"


COURSE_IMAGES = {
    "Data Science":                              img("photo-1551288049-bebda4e38f71"),   # charts
    "Artificial Intelligence & Machine Learning": img("photo-1677442136019-21780ecad995"), # AI abstract
    "Generative & Agentic AI":                   img("photo-1620712943543-bcc4688e7485"),  # neural
    "Data Analytics":                            img("photo-1460925895917-afdab827c52f"),  # dashboard
    "Python Programming":                        img("photo-1526379095098-d400fd0bf935"),  # code
    "SQL for Data":                              img("photo-1544383835-bda2bc66a55d"),     # server
    "Power BI":                                  img("photo-1543286386-713bdd548da4"),     # bi
    "Tableau":                                   img("photo-1518186285589-2f7649de83e0"),  # viz laptop
}

PROJECT_IMAGES = {
    "AI-Powered Resume Screener":  img("photo-1497633762265-9d179a990aa6", 600, 400),
    "Customer Churn Predictor":     img("photo-1551288049-bebda4e38f71", 600, 400),
    "Sales KPI Dashboard":          img("photo-1553877522-43269d4ea984", 600, 400),
    "Autonomous Research Agent":    img("photo-1620712943543-bcc4688e7485", 600, 400),
}

TEAM_IMAGES = {
    "Rajesh Menon":  img("photo-1560250097-0b93528c311a", 500, 500),   # confident man
    "Neha Iyer":     img("photo-1580489944761-15a19d654956", 500, 500), # professional woman
    "Aman Gupta":    img("photo-1519085360753-af0119f7cbe7", 500, 500), # young man
}

TESTIMONIAL_IMAGES = {
    "Priya Sharma":  img("photo-1573496359142-b8d87734a5a2", 300, 300),
    "Aditya Verma":  img("photo-1544723795-3fb6469f5b39", 300, 300),
    "Rhea Kapoor":   img("photo-1494790108377-be9c29b29330", 300, 300),
    "Karan Mehta":   img("photo-1500648767791-00dcc994a43e", 300, 300),
}

HERO_IMAGE = img("photo-1522202176988-66273c2fd55f", 1200, 800)  # collaboration


async def run():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    # Courses
    for title, url in COURSE_IMAGES.items():
        r = await db.courses.update_one({"title": title}, {"$set": {"thumbnail": url, "thumbnail_alt": f"{title} course thumbnail"}})
        print(f"course '{title}': matched={r.matched_count}")

    # Projects
    for title, url in PROJECT_IMAGES.items():
        r = await db.projects.update_one({"title": title}, {"$set": {"thumbnail": url, "thumbnail_alt": title}})
        print(f"project '{title}': matched={r.matched_count}")

    # Team
    for name, url in TEAM_IMAGES.items():
        r = await db.team.update_one({"name": name}, {"$set": {"photo": url}})
        print(f"team '{name}': matched={r.matched_count}")

    # Testimonials
    for name, url in TESTIMONIAL_IMAGES.items():
        r = await db.testimonials.update_one({"name": name}, {"$set": {"photo": url}})
        print(f"testimonial '{name}': matched={r.matched_count}")

    # Homepage hero
    r = await db.homepage.update_one({"id": "homepage"}, {"$set": {"hero_image": HERO_IMAGE}})
    print(f"homepage hero: matched={r.matched_count}")

    # Blog cover
    r = await db.blogs.update_one(
        {"slug": "why-2026-is-the-year-to-learn-agentic-ai"},
        {"$set": {"cover_image": img("photo-1677442136019-21780ecad995", 1200, 630), "cover_alt": "Agentic AI concept"}},
    )
    print(f"blog cover: matched={r.matched_count}")

    print("\n✓ Image backfill complete.")
    client.close()


if __name__ == "__main__":
    asyncio.run(run())
