
# QuickLink - URL Shortener

A full-stack URL Shortener application built using **FastAPI, PostgreSQL, SQLAlchemy, and JavaScript**, with Docker support for containerized development.

QuickLink allows users to convert long URLs into short links, redirect users to the original URLs, track link clicks, and manage shortened URLs through a simple web interface.

---

## Features

### URL Management
- Create short URLs from long URLs.
- Generate random 6-character alphanumeric short codes.
- Detect duplicate URLs and return the existing short link.
- Redirect users to the original URL using the short code.
- Delete shortened URLs.
- Retrieve and search stored URLs.

### Analytics and Dashboard
- Track the number of clicks on each shortened URL.
- View total links created.
- View total clicks across all links.
- Identify the most-clicked URL.
- Search, copy, refresh, and manage URLs through the dashboard.

### Backend and Database
- REST APIs developed using FastAPI.
- PostgreSQL database integration using SQLAlchemy.
- Database schema management using Alembic migrations.
- Automatic API documentation using Swagger UI.

### Containerization
- Dockerized FastAPI backend.
- PostgreSQL running in a separate Docker container.
- Docker Compose for managing the backend and database.
- Persistent PostgreSQL storage using Docker volumes.

---

## Tech Stack

| Category | Technologies |
|---|---|
| Backend | Python, FastAPI |
| Frontend | HTML, CSS, JavaScript |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Database Migrations | Alembic |
| API Documentation | Swagger UI |
| Containerization | Docker, Docker Compose |
| API Testing | Postman |

---

## Getting Started

You can run QuickLink using Docker (recommended) or set it up manually on your local machine.

### Prerequisites

For Docker setup:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git

For manual setup:

- Python 3.12 or compatible version
- PostgreSQL
- pip

---

## Option 1: Run with Docker (Recommended)

### 1. Clone the repository

```bash
git clone https://github.com/codersis/QuickLink-URL-Shortener.git
```

Navigate to the project directory:

```bash
cd QuickLink-URL-Shortener
```


### 2. Start the application

Make sure Docker Desktop is running.

Run:

```bash
docker compose up --build -d
```

This command builds the backend image and starts the FastAPI backend and PostgreSQL database.

Docker Compose automatically configures the connection between the backend and database.

### 3. Verify the containers

```bash
docker compose ps
```

Check backend logs:

```bash
docker compose logs backend
```

### 4. Access the application

| Service | URL |
|---|---|
| FastAPI API | http://127.0.0.1:8001 |
| Swagger UI | http://127.0.0.1:8001/docs |
| Frontend | http://127.0.0.1:5500 |

The frontend is served separately from the Dockerized backend.

To start the frontend, open another terminal in the project root and run:

```bash
python -m http.server 5500 --directory frontend
```

Then open:

http://127.0.0.1:5500

### 5. Stop the application

```bash
docker compose down
```

The PostgreSQL data is stored in a Docker volume and is preserved when the containers are stopped.

To start the project again:

```bash
docker compose up -d
```


---

## API Endpoints

The following table summarizes the main API operations provided by QuickLink.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/shorten` | Create a shortened URL |
| GET | `/urls` | Retrieve stored URLs |
| GET | `/{short_code}` | Redirect to the original URL |
| DELETE | `/{short_code}` | Delete a shortened URL |

The exact route paths and parameter formats are defined in the FastAPI application. Refer to Swagger UI at `/docs` for the current request schemas, response formats, and available endpoints.

---

## How It Works

1. The user submits a long URL through the frontend.
2. The FastAPI backend validates the URL and checks whether it already exists.
3. If it exists, the existing short link is returned. Otherwise, a unique short code is generated and stored in PostgreSQL.
4. When a short link is accessed, the backend retrieves the original URL and redirects the user.
5. The click count is updated, and the dashboard displays the link statistics.

---

## Learning Outcomes

Through this project, I gained practical experience with:

- Building REST APIs using FastAPI.
- Integrating PostgreSQL with SQLAlchemy.
- Managing database schema changes using Alembic.
- Implementing URL validation, redirection, and click tracking.
- Connecting a JavaScript frontend to backend APIs.
- Containerizing applications using Docker.
- Managing multiple services and persistent storage using Docker Compose.
- Testing API endpoints using Postman.

---

## Future Improvements

- Deploy the application to a cloud platform.
- Add user authentication and personal URL management.
- Implement rate limiting and additional security controls.
- Add more detailed analytics and link expiration.

---

## Author

**Akanksha Gupta**

GitHub: [codersis](https://github.com/codersis)

---

If you find this project useful, feel free to star the repository!
