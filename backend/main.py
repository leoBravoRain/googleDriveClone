# TODO: separate responsabilities (setup, routes, services, etc...)
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import connect_to_mongo, close_mongo_connection, get_database
from minio_client import connect_to_minio, close_minio_connection, get_minio_client, get_bucket_name
import uuid
from datetime import datetime
import io

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
    """Get all files from MongoDB using PyMongo"""
    try:
        # Get database instance
        database = get_database()
        
        # Get files collection
        files_collection = database.files
        
        # Find all files (synchronous operation with PyMongo)
        files = list(files_collection.find({}).limit(100))  # Limit to 100 files
        
        # Convert ObjectId to string for JSON serialization
        # This becasue ObjectId is not serializable by default
        for file in files:
            file["_id"] = str(file["_id"])
        
        return {
            "files": files,
            "total": len(files)
        }
    except Exception as e:
        return {
            "error": f"Failed to fetch files: {str(e)}",
            "files": [],
            "total": 0
        } 
        
@app.post("/api/files")
async def upload_file(file: UploadFile = File(...)):
    """Upload a file to MinIO and save metadata to MongoDB."""
    try:
        # Get MinIO client and bucket name
        minio_client = get_minio_client()
        bucket_name = get_bucket_name()
        
        # Generate unique file ID
        file_id = str(uuid.uuid4())
        
        # Create file path in MinIO
        file_path = f"{file_id}/{file.filename}"
        
        # Read file content
        file_content = await file.read()
        file_size = len(file_content)
        # Reset file pointer to beginning
        await file.seek(0)
        
        # Upload file to MinIO
        minio_client.put_object(
            bucket_name=bucket_name,
            object_name=file_path,
            data=file.file,
            length=file_size,  # Let MinIO determine file size
            content_type=file.content_type
        )

        # Save metadata to MongoDB
        database = get_database()
        files_collection = database.files
        
        file_metadata = {
            "file_id": file_id,
            "filename": file.filename,
            "original_name": file.filename,
            "size": file_size,  # We'll update this later if needed
            "file_type": file.content_type,
            "upload_date": datetime.utcnow(),
            "storage_path": file_path,
            "user_id": None,  # Will be used when we add authentication
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # TODO: manage case when file was not uploaded to MinIO
        result = files_collection.insert_one(file_metadata)
        
        return {
            "message": "File uploaded successfully",
            "file_id": file_id,
            "filename": file.filename,
            "size": file_metadata["size"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")