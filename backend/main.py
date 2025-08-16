# TODO: separate responsabilities (setup, routes, services, etc...)
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
# from database import connect_to_mongo, close_mongo_connection, get_database
# from minio_client import connect_to_minio, close_minio_connection, get_minio_client, get_bucket_name
import uuid
from datetime import datetime
from minio.error import S3Error
from fastapi.responses import StreamingResponse
from core.database import connect_to_mongo, close_mongo_connection
from core.minio_client import connect_to_minio, close_minio_connection
from services.files_service import FileService
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

api_base_path = '/api/v1'
# add files router
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

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "google-drive-clone-api"
    }

# @app.delete("/api/files/{file_id}")
# async def delete_file(file_id: str):
#     """Delete a file with the given file_id from MinIO and MongoDB"""
#     try:
#         # get database
#         database = get_database()
#         files_collection = database.files
        
#         # get minio client and bucket name
#         minio_client = get_minio_client()
#         bucket_name = get_bucket_name()
        
#         # try to delete the file metadata
#         file_metadata =files_collection.find_one_and_delete({
#             "file_id": file_id
#         })
        
#          # check if file was deleted
#         if not file_metadata:
#             raise HTTPException(status_code = 404, detail = f"File with id {file_id} not found")
        
#         # delete file from minio
#         try:
#             minio_client.remove_object(
#                 bucket_name = bucket_name,
#                 object_name = file_metadata["storage_path"]
#             )
#         except S3Error as e:
#             print("Warning: File not found in MinIO, but it was deleted from MongoDB")
        
#         return {
#             "message": "File deleted successfully",
#             "file_id": file_id
#         }
        
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code = 500, detail = f"Delete failed: {str(e)}")
    
    