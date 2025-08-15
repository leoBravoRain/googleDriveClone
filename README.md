# Google Drive Clone

A full-stack Google Drive clone built with SvelteKit, FastAPI, MongoDB, and MinIO.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   MongoDB       │
│   (SvelteKit)   │◄──►│   (FastAPI)     │◄──►│   (Metadata)    │
│                 │    │                 │    │                 │
│ - File upload   │    │ - API endpoints │    │ - filename      │
│ - File download │    │ - Business logic│    │ - size          │
│ - UI            │    │ - Validation    │    │ - type          │
└─────────────────┘    └─────────────────┘    │ - upload_date   │
                              │               │ - user_id       │
                              ▼               └─────────────────┘
                       ┌─────────────────┐
                       │   MinIO         │
                       │   (File Storage)│
                       │                 │
                       │ - Actual files  │
                       │ - Binary data   │
                       │ - Images, docs  │
                       │ - Videos, etc.  │
                       └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development)
- Python 3.8+ (for local development)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd googleDriveClone
```

### 2. Start Services
```bash
docker compose up -d
```

This will start:
- **Frontend**: http://localhost:5173 (SvelteKit)
- **Backend**: http://localhost:8000 (FastAPI)
- **MongoDB**: localhost:27017
- **MinIO**: http://localhost:9000 (API) / http://localhost:9001 (Console)

### 3. Setup MinIO Bucket (One-time setup)

After starting the services, you need to create the MinIO bucket manually:

#### Option A: Using MinIO Console (Recommended)
1. Open http://localhost:9001 in your browser
2. Login with:
   - **Username**: `minioadmin`
   - **Password**: `minioadmin123`
3. Click "Create Bucket"
4. Enter bucket name: `filedrive`
5. Click "Create Bucket"

#### Option B: Using MinIO Client (Command Line)
```bash
# Connect to MinIO container
docker exec -it googledriveclone-minio-1 sh

# Set up MinIO client alias
mc alias set myminio http://localhost:9000 minioadmin minioadmin123

# Create bucket
mc mb myminio/filedrive

# Set bucket policy for download access
mc anonymous set download myminio/filedrive

# Verify bucket was created
mc ls myminio

# Exit container
exit
```

#### Option C: Using the provided script
```bash
# Make script executable (if not already)
chmod +x scripts/init-minio.sh

# Run the initialization script
./scripts/init-minio.sh
```

### 4. Verify Setup
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/docs
- **MinIO Console**: http://localhost:9001
- **MongoDB**: Use MongoDB Compass or similar tool

## 🛠️ Development

### Local Development (without Docker)
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Docker Development
```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Rebuild services
docker compose build

# Stop services
docker compose down
```

## 📁 Project Structure
```
googleDriveClone/
├── frontend/                 # SvelteKit application
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── backend/                  # FastAPI application
│   ├── main.py
│   ├── database.py
│   ├── requirements.txt
│   └── Dockerfile
├── data/                     # Data persistence
│   ├── mongo-init/          # MongoDB initialization
│   └── minio-init/          # MinIO initialization (reference)
├── scripts/                  # Utility scripts
│   └── init-minio.sh        # MinIO bucket creation script
├── docs/                     # Documentation
│   └── minio-setup.md       # MinIO setup guide
├── docker-compose.yml        # Service orchestration
└── README.md
```

## 🔧 Configuration

### Environment Variables
The application uses the following environment variables (configured in docker-compose.yml):

#### Backend
- `MONGODB_URL`: MongoDB connection string
- `MINIO_ENDPOINT`: MinIO API endpoint
- `MINIO_ACCESS_KEY`: MinIO access key
- `MINIO_SECRET_KEY`: MinIO secret key
- `MINIO_BUCKET_NAME`: MinIO bucket name

#### MinIO
- `MINIO_ROOT_USER`: Admin username
- `MINIO_ROOT_PASSWORD`: Admin password

### Ports
- **Frontend**: 5173
- **Backend**: 8000
- **MongoDB**: 27017
- **MinIO API**: 9000
- **MinIO Console**: 9001

## 📚 Documentation

- [API Documentation](http://localhost:8000/docs) - FastAPI auto-generated docs