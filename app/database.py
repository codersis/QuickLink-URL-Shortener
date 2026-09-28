from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings



engine = create_engine(settings.DATABASE_URL)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


Base = declarative_base()

# created to handle the sessionmaker and close of db and avoid us manually doing that
# Creating database dependency
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


"""
Incoming API request
        ↓
FastAPI calls get_db()
        ↓
Database session is created
        ↓
Endpoint receives the session
        ↓
Endpoint works with database
        ↓
Session is closed automatically
"""
