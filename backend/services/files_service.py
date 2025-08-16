from typing import List
from repositories.files_repository import FileRepository
from models.file_model import FileModel

class FileService:
    
    def __init__(self):
        self.file_repository = FileRepository()

    def get_all_files(self) -> List[FileModel]:
        return self.file_repository.get_all_files()