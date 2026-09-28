# What did the user request?
# all routes

from sqlalchemy.orm import Session
from fastapi import Depends
from app.services.url_service import generate_short_code
from app.database import get_db
from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from app.config import settings
from app.database import SessionLocal
from app import models
from app.schemas import URLCreate, URLResponse, URLStatsResponse

router = APIRouter()


@router.post("/shorten", response_model= URLResponse)
def create_short_url(url_data: URLCreate, db: Session = Depends(get_db)):
    original_url = str(url_data.url)

    # Step 1: Check if URL already exists
    existing_url = (
        db.query(models.URL).filter(models.URL.original_url == original_url).first()
    )

    # Step 2: If it exists, return its existing short code
    if existing_url:
        return {
            "short_code": existing_url.short_code,
            "short_url": f"{settings.BASE_URL}/{existing_url.short_code}",
        }

    # Step 3: Generate a new code if URL is new
    short_code = generate_short_code(db)

    new_url = models.URL(original_url=original_url, short_code=short_code)

    db.add(new_url) 

    try:
        db.commit()
        db.refresh(new_url)

    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create short URL")

    return {
        "short_code": new_url.short_code,
        "short_url": f"{settings.BASE_URL}/{new_url.short_code}",
    }


@router.get("/urls")
def get_all_urls(db: Session = Depends(get_db)):

    urls = db.query(models.URL).order_by(models.URL.id.desc()).all()

    return [
        {
            "short_code": url.short_code,
            "original_url": url.original_url,
            "short_url": f"{settings.BASE_URL}/{url.short_code}",
            "click_count": url.click_count,
            "created_at": url.created_at,
        }
        for url in urls
    ]


@router.get("/{short_code}")
def redirect_to_url(short_code: str, db: Session = Depends(get_db)):

    url = db.query(models.URL).filter(models.URL.short_code == short_code).first()

    if url is None:
        raise HTTPException(status_code=404, detail="Short URL not found")

    url.click_count += 1
    db.commit()

    original_url = url.original_url

    return RedirectResponse(original_url)


@router.get("/stats/{short_code}", response_model=URLStatsResponse)
def get_stats(short_code: str, db: Session = Depends(get_db)):

    url = db.query(models.URL).filter(models.URL.short_code == short_code).first()

    if url is None:
        raise HTTPException(status_code=404, detail="Short URL not found")

    return {
        "short_code": url.short_code,
        "original_url": url.original_url,
        "click_count": url.click_count,
        "created_at": url.created_at
    }


@router.delete("/{short_code}")
def delete_url(short_code: str, db: Session = Depends(get_db)):

    url = db.query(models.URL).filter(models.URL.short_code == short_code).first()

    if url is None:
        
        raise HTTPException(status_code=404, detail="Short URL not found")

    db.delete(url)
    db.commit()
    
    return {"message": "Short URL deleted successfully"}
