from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Google Drive Clone API",
    description="A simple Google Drive clone API built with FastAPI",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    # TODO: check if this is correct
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint - health check"""
    return {
        "message": "Google Drive Clone API is running!",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "google-drive-clone-api"
    }

# TODO: manage pagination?
@app.get("/api/files")
async def get_files():
    """Get all files (placeholder for now)"""
    return {
        "files": [
            {
                "id": 1,
                "name": "example.pdf",
                "size": "2.5 MB",
                "type": "pdf",
                "upload_date": "2024-01-15"
            }
        ],
        "total": 1
    } 