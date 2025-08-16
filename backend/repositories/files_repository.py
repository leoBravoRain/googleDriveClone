from typing import List, Optional
from pymongo.database import Database
from pymongo.collection import Collection
from core.database import get_database
from models.file_model import FileModel
from datetime import datetime

class FileRepository: 
    
    def __init__(self):
        self.database: Database = get_database()
        self.collection: Collection = self.database.files
        
    def get_all_files(self) -> List[FileModel]:
        """
        Get all files from database
        """
        try:
            # Find all files (synchronous operation with PyMongo)
            # TODO: manage pagination?
            # TODO: fields to select are: name, size, upload date, file type
            files = list(self.collection.find({}))  # Limit to 100 files
            
            # Convert ObjectId to string for JSON serialization
            # This becasue ObjectId is not serializable by default
            for file in files:
                file["_id"] = str(file["_id"])
            
            return files
            
        except Exception as e:
            print(f"Error getting all files: {e}")
            raise e
    
    def get_file_by_id(self, file_id: str) -> Optional[dict]:
        """
        Get a single file by file_id
        Args:
            file_id: The unique identifier of the file
        Returns: File document or None if not found
        """
        try:
            file = self.collection.find_one({"file_id": file_id})
            
            if file and '_id' in file:
                file['_id'] = str(file['_id'])
            
            return file
            
        except Exception as e:
            print(f"Error getting file by ID {file_id}: {e}")
            raise e
    
    def save_file_metadata(self, file_metadata: FileModel):
        """
        Save file metadata to database
        """
        try:
            self.collection.insert_one(file_metadata)
        except Exception as e:
            print(f"Error saving file metadata: {e}")
            raise e

    def delete_file(self, file_id: str) -> bool:
        """
        Delete a file record by file_id
        Args:
            file_id: The unique identifier of the file
        Returns: True if deleted, False if not found
        """
        try:
            result = self.collection.delete_one({"file_id": file_id})
            return result.deleted_count > 0
            
        except Exception as e:
            print(f"Error deleting file {file_id}: {e}")
            raise e

    def update_file_name(self, file_id: str, new_filename: str) -> Optional[dict]:
        """
        Update file name by file_id
        Args:
            file_id: The unique identifier of the file
            new_filename: New name for the file
        Returns: Updated file document or None if not found
        """
        try:
            
            # Update the document
            result = self.collection.find_one_and_update(
                {"file_id": file_id},
                {
                    "$set": {
                        "filename": new_filename,
                        "updated_at": datetime.utcnow()
                    }
                },
                return_document=True  # Return the updated document
            )
            
            return result
            
        except Exception as e:
            print(f"Error updating file name for {file_id}: {e}")
            raise e