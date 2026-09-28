from fastapi import FastAPI
# since to avoid CORS (since fronted use port different and backedn differnt port so we are importing this)
from fastapi.middleware.cors import CORSMiddleware


from app.database import engine, Base
from app.routers.urls import router as url_router
from app import models

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="URL Shortener API",
    description="A simple URL shortening REST API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:5501",
        "http://localhost:5501",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(url_router)


@app.get("/")
def home():
    return {"message": "URL Shortener API is running!"}


# Comment
''' Create FastAPI app
       ↓
Create database tables
       ↓
Register routers
       ↓
Health/root endpoint

'''
