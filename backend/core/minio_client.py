from minio import Minio
from minio.error import S3Error
from typing import Optional
import os

# MinIO connection manager
class MinioManager:
    client: Optional[Minio] = None

# MinIO instance
minio_manager = MinioManager()

def connect_to_minio():
    """Create MinIO connection using environment variables."""
    # Get MinIO configuration from environment variables
    minio_endpoint = os.getenv("MINIO_ENDPOINT", "minio:9000")
    minio_access_key = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
    minio_secret_key = os.getenv("MINIO_SECRET_KEY", "minioadmin123")

    # Create MinIO client
    minio_manager.client = Minio(
        endpoint=minio_endpoint,
        access_key=minio_access_key,
        secret_key=minio_secret_key,
        secure=False  # Set to True if using HTTPS
    )

    # Test the connection
    try:
        # List buckets to test connection
        buckets = minio_manager.client.list_buckets()
        print("✅ Successfully connected to MinIO!")
        print(f"✅ Available buckets: {[bucket.name for bucket in buckets]}")

    except Exception as e:
        print(f"❌ Failed to connect to MinIO: {e}")
        raise e

def close_minio_connection():
    """Close MinIO connection."""
    if minio_manager.client:
        # MinIO client doesn't have a close method, but we can clear the reference
        minio_manager.client = None
        print("🔌 MinIO connection closed.")

def get_minio_client() -> Minio:
    """Get MinIO client instance."""
    if minio_manager.client is None:
        raise Exception("MinIO not connected. Call connect_to_minio() first.")
    return minio_manager.client

def get_bucket_name() -> str:
    """Get bucket name from environment variable."""
    return os.getenv("MINIO_BUCKET_NAME", "filedrive")
