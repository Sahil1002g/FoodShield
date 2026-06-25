# FoodShield Backend - Hosting Recommendations

## Current Architecture Analysis

Your backend is a **FastAPI application** with the following characteristics:

### Stack Overview
- **Framework**: FastAPI (Python)
- **Server**: Uvicorn ASGI
- **Database**: PostgreSQL/MySQL (via SQLAlchemy ORM)
- **Authentication**: JWT-based OAuth2
- **Key Processing**: Image OCR, NLP model analysis, Data processing
- **File Upload**: Image storage and processing

---

## 🚨 Critical Security Issues Found

### 1. **Hardcoded SECRET_KEY** ⚠️ HIGH PRIORITY
```python
# ❌ In core/security.py
SECRET_KEY = "supersecretkey"  # EXPOSED!
```
**Solution**: Move to environment variable immediately:
```python
SECRET_KEY = os.getenv("SECRET_KEY", "default-change-me")
```

### 2. **No CORS Configuration**
Your API accepts requests from anywhere. Add CORS middleware for cross-origin requests.

---

## Hosting Options (Best to Most Cost-Effective)

### **Option 1: Docker + Cloud Platform (RECOMMENDED)** ⭐⭐⭐⭐⭐
Best for production, scalability, and multi-platform support.

#### Platforms:
- **AWS (Elastic Container Service / App Runner)**
- **Google Cloud Run**
- **Azure Container Instances / App Service**
- **DigitalOcean App Platform**
- **Heroku** (simplest, higher cost)

#### Advantages:
✅ Works with ANY client (React Native, Web, iOS, Android)  
✅ Auto-scaling  
✅ CDN integration  
✅ Easy environment variable management  
✅ Database separation  
✅ File storage (S3, GCS, etc.)  

#### What you need:
- Dockerfile
- Environment variables (.env)
- Database (managed PostgreSQL)
- Storage bucket (images)

---

### **Option 2: Traditional VPS** ⭐⭐⭐⭐
Self-managed but cost-effective for medium traffic.

#### Platforms:
- **Linode / AWS EC2 / DigitalOcean Droplets**
- **Vultr, Hetzner**

#### Advantages:
✅ Full control  
✅ Cost-effective  
✅ Works with any app  

#### Setup:
```bash
# On your VPS:
sudo apt-get install python3-pip python3-venv nginx
git clone your-repo
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

---

### **Option 3: Serverless (AWS Lambda)** ⭐⭐⭐
Cheapest for low-traffic apps, but complex for heavy processing.

#### Limitations:
❌ 15-minute execution timeout (your image processing might exceed)  
❌ Large ML models may exceed size limits  
✅ Pay only for execution time  

---

### **Option 4: Local Network / VPS** ⭐⭐
If you need development/testing environment.

#### Setup on Windows/Linux machine:
```bash
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## Recommended Setup for "Works with Any App"

### Architecture:
```
┌─────────────────────────────────────────┐
│   ANY CLIENT APP                        │
│   (React Native, Web, iOS, Android)     │
└────────────────┬────────────────────────┘
                 │ HTTPS REST API
                 ▼
┌─────────────────────────────────────────┐
│   DOCKER CONTAINER                      │
│   ├─ FastAPI App                        │
│   ├─ Uvicorn Server                     │
│   ├─ Environment Variables              │
│   └─ Health Checks                      │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┬──────────────┐
        ▼                   ▼              ▼
   ┌─────────┐         ┌──────────┐  ┌─────────┐
   │PostgreSQL│        │S3 Bucket │  │Redis    │
   │Database  │        │(Images)  │  │(Cache)  │
   └─────────┘         └──────────┘  └─────────┘
```

---

## Step-by-Step: Docker Setup

### 1. Create `Dockerfile`
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for pytesseract & opencv
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Create `.env.example`
```env
DATABASE_URL=postgresql://user:password@db:5432/foodshield
SECRET_KEY=your-super-secure-random-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
UPLOAD_DIR=/app/data/images
```

### 3. Create `docker-compose.yml`
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/foodshield
      SECRET_KEY: ${SECRET_KEY}
    depends_on:
      - db
    volumes:
      - ./data:/app/data

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: foodshield
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## Deployment on Cloud Platform (Example: Google Cloud Run)

### Step 1: Prepare your code
```bash
# Ensure .env variables are set in Cloud Run console
# Move hardcoded values to environment variables
```

### Step 2: Deploy
```bash
gcloud run deploy foodshield-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=your-db-url,SECRET_KEY=your-key
```

### Step 3: Update frontend
```typescript
// In your React Native app
const API_URL = "https://your-cloud-run-url.a.run.app";
```

---

## API Endpoints (Works with Any App)

Your API is **already cross-platform compatible**:

- `POST /api/auth/login` - Authenticate any client
- `POST /api/scan/` - Scan products (works with any app)
- `POST /analyze-image/` - Upload and process images
- `POST /api/scan/translate` - Translation service
- File uploads support - Any app can upload images

---

## Environment Configuration Checklist

- [ ] Move `SECRET_KEY` to environment variable
- [ ] Add `CORS` middleware
- [ ] Set `DATABASE_URL` per environment
- [ ] Configure file storage (local, S3, GCS)
- [ ] Add health check endpoint
- [ ] Set up logging
- [ ] Configure request timeout (for image processing)
- [ ] Add rate limiting
- [ ] Set up monitoring/alerts

---

## Estimated Costs (Monthly)

| Platform | Small | Medium | Large |
|----------|-------|--------|-------|
| Google Cloud Run | $1-10 | $10-50 | $50-200 |
| AWS App Runner | $5-20 | $20-80 | $80-300 |
| DigitalOcean VPS | $5-12 | $12-24 | $24-40 |
| Heroku | $7-50 | $50-200 | $200+ |
| AWS Lambda | $0.20-2 | $2-10 | $10-50 |

---

## Conclusion

**For "works with any app"**: Use **Docker + Cloud Run/App Runner**
- ✅ Works with React Native, Web, iOS, Android
- ✅ Scales automatically
- ✅ Low maintenance
- ✅ Environment-based configuration
- ✅ Cost-effective

**Immediate Actions**:
1. Fix hardcoded `SECRET_KEY` → environment variable
2. Add CORS middleware
3. Create Dockerfile
4. Deploy to cloud platform
5. Update frontend API URLs

