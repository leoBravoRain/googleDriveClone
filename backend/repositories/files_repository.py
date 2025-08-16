from typing import List
from pymongo.database import Database
from pymongo.collection import Collection
from core.database import get_database
from models.file_model import FileModel

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
    
    def save_file_metadata(self, file_metadata: FileModel):
        """
        Save file metadata to database
        """
        try:
            self.collection.insert_one(file_metadata)
        except Exception as e:
            print(f"Error saving file metadata: {e}")
            raise e