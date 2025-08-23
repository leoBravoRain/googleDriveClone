from mongoengine import Document, StringField, IntField, DateTimeField
from datetime import datetime

class File(Document):
    file_id = StringField(required=True)
    filename = StringField(required=True)
    original_name = StringField(required=True)
    size = IntField(required=True)
    file_type = StringField(required=True)
    upload_date = DateTimeField(default=datetime.utcnow)
    storage_path = StringField(required=True)
    user_id = StringField(required=False)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'files',
        'ordering': ['-created_at']
    }

    def __str__(self):
        return f"{self.filename} ({self.file_type})"
