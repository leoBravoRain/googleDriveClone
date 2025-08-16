from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import connect_to_mongo, close_mongo_connection
from core.minio_client import connect_to_minio, close_minio_connection
from routes.files_router import router as files_router

app = FastAPI(
    title="Google Drive Clone API",
    description="A simple Google Drive clone API built with FastAPI",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    # TODO: check if this is correct
    allow_origins=["http://localhost:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# add files router
api_base_path = '/api/v1'
app.include_router(files_router, prefix = api_base_path)

@app.on_event("startup")
def startup_db_client():
    """Connect to MongoDB on startup"""
    connect_to_mongo()
    connect_to_minio()

@app.on_event("shutdown")
def shutdown_db_client():
    """Close MongoDB connection on shutdown"""
    close_mongo_connection()
    close_minio_connection()
    
@app.get("/")
async def root():
    """Root endpoint - health check"""
    return {
        "message": "Google Drive Clone API is running!",
        "status": "healthy",
        "version": "1.0.0"
    }