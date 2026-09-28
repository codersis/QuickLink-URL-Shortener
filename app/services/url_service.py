import secrets
from sqlalchemy.orm import Session
from app import models


def generate_short_code(db: Session) -> str:
    while True:
        code = secrets.token_urlsafe(5)

        existing_url = (
            db.query(models.URL).filter(models.URL.short_code == code).first()
        )

        if existing_url is None:
            return code
