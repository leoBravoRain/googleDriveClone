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

    def get_all_files(self, page: int = 1, limit: int = 10) -> dict:
        """
        Get all files from database with pagination
        Args:
            page: Page number (starts from 1)
            limit: Number of files per page
        Returns:
            dict with files and pagination info
        """
        try:
            # Calculate skip value for pagination
            skip = (page - 1) * limit

            # Get total count of files
            total = self.collection.count_documents({})

            # Get paginated results with sorting
            files = list(self.collection.find({})
                         .sort("upload_date", -1)
                         .skip(skip)
                         .limit(limit))

            # Convert ObjectId to string for JSON serialization
            for file in files:
                file["_id"] = str(file["_id"])

            # Calculate pagination info
            total_pages = (total + limit - 1) // limit  # Ceiling division
            has_next = page < total_pages
            has_prev = page > 1

            return {
                "files": files,
                "pagination": {
                    "current_page": page,
                    "total_pages": total_pages,
                    "total_files": total,
                    "files_per_page": limit,
                    "has_next": has_next,
                    "has_prev": has_prev,
                    "next_page": page + 1 if has_next else None,
                    "prev_page": page - 1 if has_prev else None
                }
            }

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
