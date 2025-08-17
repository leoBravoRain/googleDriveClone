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
                       └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development)
- Python 3.8+ (for local development)

### 1. Clone and Setup
```bash
git clone https://github.com/leoBravoRain/googleDriveClone
cd googleDriveClone
```

### 2. Setup Environment Variables
```bash
# Copy the environment variables template
cp .env.example .env

# Edit .env file with your preferred credentials
# (Optional: Change default passwords for security)
```

### 3. Initialize the Project
```bash
# Make script executable (if not already)
chmod +x scripts/init-project.sh

# Run the complete initialization
./scripts/init-project.sh
```

This script will automatically:
1. Build and start all services (MinIO, MongoDB, Frontend, Backend)
2. Initialize MinIO with access control policies
3. Verify all services are running properly

### 4. Access the Application
Once initialization is complete, you can access:
- **Frontend**: http://localhost:5173 (SvelteKit)
- **Backend API**: http://localhost:8000/docs (FastAPI)
- **MinIO Console**: http://localhost:9001
- **MongoDB**: localhost:27017

## 🛠️ Development

The project includes hot-reloading for both frontend and backend, so you can develop and see changes immediately without restarting services. 

## 📁 Project Structure
```
googleDriveClone/
├── frontend/                 # SvelteKit application
├── backend/                  # FastAPI application
├── data/                     # Data persistence
│   ├── mongodb/              # MongoDB database files
│   └── minio/                # MinIO object storage files
├── scripts/                  # Utility scripts
│   └── mongo/           # MongoDB initialization
|       ├── init.js      # Initialize DB
|   └── minio/
│       ├── init-minio.sh     # MinIO bucket creation script
│       └── access-policy.json # MinIO access policy
│   ├── init-project.sh      # Complete project 
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