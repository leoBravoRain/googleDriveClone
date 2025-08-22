from rest_framework import serializers
from .models import File

class FileSerializer(serializers.Serializer):
    """Serializer for mongoengine File document"""
    id = serializers.CharField(read_only=True)
    file_id = serializers.CharField(required=True)
    filename = serializers.CharField(required=True)
    original_name = serializers.CharField(required=True)
    size = serializers.IntegerField(min_value=0, required=True)
    file_type = serializers.CharField(required=True)
    storage_path = serializers.CharField(required=True)
    user_id = serializers.CharField(required=False, allow_blank=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    
    def to_representation(self, instance):
        """Convert mongoengine object to dictionary"""
        return {
            'id': str(instance.id),
            'file_id': instance.file_id,
            'filename': instance.filename,
            'original_name': instance.original_name,
            'size': instance.size,
            'file_type': instance.file_type,
            'storage_path': instance.storage_path,
            'user_id': instance.user_id,
            'created_at': instance.created_at.isoformat() if instance.created_at else None,
            'updated_at': instance.updated_at.isoformat() if instance.updated_at else None,
        }
    
    