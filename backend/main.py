# TODO: separate responsabilities (setup, routes, services, etc...)
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import connect_to_mongo, close_mongo_connection, get_database
from minio_client import connect_to_minio, close_minio_connection, get_minio_client, get_bucket_name
import uuid
from datetime import datetime
from minio.error import S3Error
from fastapi.responses import StreamingResponse

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
        # TODO: manage pagination?
        files = list(files_collection.find({}))  # Limit to 100 files
        
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
    
    
@app.get("/api/files/{file_id}/download")
async def download_file(file_id: str):
    """Download a file with the given file_id"""
    try:
        # get database
        database = get_database()
        files_collection = database.files
        
        # try to get filemetadata
        file_metadata = files_collection.find_one({"file_id": file_id})
        
        if not file_metadata:
            raise HTTPException(status_code = 404, detail = f"File with id {file_id} not found")
        
        # get minio client and bucket name
        minio_client = get_minio_client()
        bucket_name = get_bucket_name()
        
        try:
            response = minio_client.get_object(
                bucket_name = bucket_name,
                object_name = file_metadata["storage_path"]
            )
        except S3Error as e:
            raise HTTPException(status_code = 500, detail = f"Download failed: {str(e)}")
        
        # return the file   
        return StreamingResponse(
            response.stream(32*1024),
            media_type = file_metadata["file_type"],
            headers = {
                    "Content-Disposition": f"attachment; filename={file_metadata['filename']}",
                    "Content-Length": str(file_metadata["size"])
            }
        )

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code = 500, detail =f"Download failed: {str(e)}")
    
@app.patch("/api/files/{file_id}")
async def update_file(file_id: str, file_name: str):
    """Update the file name of the file with the given file_id"""
    try:
        
        # Validate file_name is not empty
        if not file_name or len(file_name.strip()) == 0:
            raise HTTPException(
                status_code=400, 
                detail="File name cannot be empty"
            )
            
        # get database
        database = get_database()
        files_collection = database.files
        
        # TODO: check if keep the file extension
        file_metadata = files_collection.find_one_and_update({
            "file_id": file_id
        }, {
            "$set": {
                "filename": file_name
            }
        })
        
        if not file_metadata:
            raise HTTPException(status_code = 404, detail = f"File with id {file_id} not found")
        
        return {
            "message": "File updated successfully",
            "file_id": file_id,
            "filename": file_name
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code = 500, detail = f"Update failed: {str(e)}")
    
    
@app.delete("/api/files/{file_id}")
async def delete_file(file_id: str):
    """Delete a file with the given file_id from MinIO and MongoDB"""
    try:
        # get database
        database = get_database()
        files_collection = database.files
        
        # get minio client and bucket name
        minio_client = get_minio_client()
        bucket_name = get_bucket_name()
        
        # try to delete the file metadata
        file_metadata =files_collection.find_one_and_delete({
            "file_id": file_id
        })
        
         # check if file was deleted
        if not file_metadata:
            raise HTTPException(status_code = 404, detail = f"File with id {file_id} not found")
        
        # delete file from minio
        try:
            minio_client.remove_object(
                bucket_name = bucket_name,
                object_name = file_metadata["storage_path"]
            )
        except S3Error as e:
            print("Warning: File not found in MinIO, but it was deleted from MongoDB")
        
        return {
            "message": "File deleted successfully",
            "file_id": file_id
        }
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code = 500, detail = f"Delete failed: {str(e)}")
    
    