from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class FileModel(BaseModel):
    file_id: str
    filename: str
    original_name: str
    size: int
    file_type: str
    upload_date: datetime
    storage_path: str
    user_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    