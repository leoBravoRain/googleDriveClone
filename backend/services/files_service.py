from typing import List
from repositories.files_repository import FileRepository
from models.file_model import FileModel
from fastapi import UploadFile, File
import uuid
from datetime import datetime
from core.minio_client import get_minio_client, get_bucket_name
from minio.error import S3Error

class FileService:
    
    def __init__(self):
        self.file_repository = FileRepository()
        self.minio_client = get_minio_client()
        self.bucket_name = get_bucket_name()

    def get_all_files(self) -> List[FileModel]:
        return self.file_repository.get_all_files()
    
    # TODO: manage case when file was not uploaded to MinIO
    # TODO: change return type to normal response
    async def upload_file(self, file: UploadFile = File(...)) -> dict:
        
        # TODO: check if it's unique in DB?
        # Generate unique file ID
        file_id = str(uuid.uuid4())
        
        # Create file path in MinIO
        file_path = f"{file_id}/{file.filename}"
        
        # Read file content
        file_content = await file.read()
        file_size = len(file_content)
        # Reset file pointer to beginning
        await file.seek(0)
        
        # TODO: check to move to another file?
        # Upload file to MinIO
        self.minio_client.put_object(
            bucket_name=self.bucket_name,
            object_name=file_path,
            data=file.file,
            length=file_size,  # Let MinIO determine file size
            content_type=file.content_type
        )
        
        # save metadata to database
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
        
        # save metadata to database
        self.file_repository.save_file_metadata(file_metadata)
        
        # TODO: normalize response
        return {
            "message": "File uploaded successfully",
            "file_id": file_id,
            "filename": file.filename,
            "size": file_metadata["size"]
        }
        
    def download_file(self, file_id: str):
        """
        Download a file by file_id
        Args:
            file_id: The unique identifier of the file
        Returns: File data as bytes
        """
        try:
            # Get file metadata from database
            file_metadata = self.file_repository.get_file_by_id(file_id)
            
            if not file_metadata:
                raise FileNotFoundError(f"File with id {file_id} not found")
            
            # Get MinIO client and bucket name
            minio_client = get_minio_client()
            bucket_name = get_bucket_name()
            
            try:
                # Get file from MinIO
                response = minio_client.get_object(
                    bucket_name=bucket_name,
                    object_name=file_metadata["storage_path"]
                )
                
                # Read the file data
                file_data = response.read()
                response.close()
                response.release_conn()
                
                return {
                    "data": file_data,
                    "filename": file_metadata["filename"],
                    "content_type": file_metadata["file_type"],
                    "size": file_metadata["size"]
                }
                
            except S3Error as e:
                raise FileNotFoundError(f"File not found in storage: {str(e)}")
                
        except FileNotFoundError:
            raise
        except Exception as e:
            raise Exception(f"Download failed: {str(e)}")
        
        
        
        
        