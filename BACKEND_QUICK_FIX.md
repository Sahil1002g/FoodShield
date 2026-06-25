# Quick Fix Guide - Backend Security & Setup

## 1. FIX: Hardcoded SECRET_KEY ⚠️ CRITICAL

### Current (UNSAFE):
```python
# core/security.py
SECRET_KEY = "supersecretkey"  # Exposed in code!
```

### Fixed:
```python
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
```

### Update .env file:
```env
SECRET_KEY=your-random-secure-key-at-least-32-chars-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

**Generate secure key:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## 2. ADD: CORS Middleware

### Update main.py:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="FoodShield API")

# Add CORS middleware BEFORE including routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # Web dev
        "http://localhost:8081",      # React Native dev
        "https://yourdomain.com",     # Production
        # Add your frontend URLs here
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... rest of your code
```

---

## 3. ADD: Health Check Endpoint

```python
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0"
    }
```

---

## 4. UPDATE: requirements.txt

Add these for production:
```
fastapi
uvicorn
python-dotenv
python-multipart
sqlalchemy
psycopg2-binary
pydantic
python-jose[cryptography]
passlib[bcrypt]
pytesseract
opencv-python
pandas
pyarrow
pillow
deep-translator
spacy
gunicorn
```

---

## 5. CREATE: .env.example

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/foodshield

# Security
SECRET_KEY=change-me-with-secure-random-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# File Upload
UPLOAD_DIR=data/images
MAX_UPLOAD_SIZE=10485760  # 10MB

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081

# Server
DEBUG=False
```

**Note**: Add `.env` to `.gitignore` - NEVER commit it!

---

## 6. CREATE: docker-compose.yml

```yaml
version: '3.8'

services:
  # FastAPI Backend
  backend:
    build: .
    container_name: foodshield_backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
      SECRET_KEY: ${SECRET_KEY}
      ALGORITHM: HS256
    depends_on:
      - db
    volumes:
      - ./data:/app/data
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    networks:
      - foodshield_network

  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    container_name: foodshield_db
    environment:
      POSTGRES_USER: ${DB_USER:-foodshield_user}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-foodshield_pass}
      POSTGRES_DB: ${DB_NAME:-foodshield}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - foodshield_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:

networks:
  foodshield_network:
    driver: bridge
```

---

## 7. CREATE: Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libsm6 \
    libxext6 \
    libxrender-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create upload directory
RUN mkdir -p data/images

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# Run app
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "-k", "uvicorn.workers.UvicornWorker", "main:app"]
```

---

## 8. UPDATE: main.py

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

from src.pipeline import run_pipeline
import shutil
from api.scan import router as scan_router
from db.session import engine
from db.base import Base
from api.user import router as user_router
from api.auth import router as auth_router
from api.history import router as history_router

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize app
app = FastAPI(
    title="FoodShield API",
    description="Food product analysis and allergen detection API",
    version="1.0.0"
)

# Security middleware
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "data/images")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(scan_router, prefix="/api/scan")
app.include_router(user_router, prefix="/api")
app.include_router(history_router, prefix="/api")

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "1.0.0"}

# Root endpoint
@app.get("/")
def root():
    return {"status": "FoodShield API running", "version": "1.0.0"}

# Image analysis endpoint
@app.post("/analyze-image/")
async def analyze_image(file: UploadFile = File(...)):
    image_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    ingredients, warnings, extracted_text = run_pipeline(
        image_path=image_path,
        image_name=file.filename
    )

    return {
        "image": file.filename,
        "ingredients": ingredients,
        "warnings": warnings
    }
```

---

## Quick Start - Local Development

```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Copy .env file
cp .env.example .env

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run with Docker (recommended)
docker-compose up

# 5. Or run locally
uvicorn main:app --reload

# API will be at: http://localhost:8000
# Swagger UI: http://localhost:8000/docs
```

---

## Deployment Checklist

- [ ] Move all hardcoded values to `.env`
- [ ] Add CORS configuration
- [ ] Create `.gitignore` with `.env` and `__pycache__`
- [ ] Add health check endpoint
- [ ] Create Dockerfile
- [ ] Create docker-compose.yml
- [ ] Update requirements.txt with versions
- [ ] Add error logging
- [ ] Configure database migrations
- [ ] Set up monitoring (logs, metrics)
- [ ] Generate secure SECRET_KEY
- [ ] Test all endpoints with actual frontend app

---

## Testing API with Frontend

### React Native Example:
```typescript
const API_URL = "http://your-backend-url:8000";

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const scanProduct = async (barcode: string, token: string) => {
  const response = await fetch(`${API_URL}/api/scan/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ barcode }),
  });
  return response.json();
};
```

---

## Production Hosting URLs

Once deployed, update your frontend:

```typescript
// development
const API_URL = "http://localhost:8000";

// production
const API_URL = "https://your-cloud-run-url.a.run.app";
```

---

**Any questions? Check HOSTING_RECOMMENDATIONS.md for detailed platform setup!**
