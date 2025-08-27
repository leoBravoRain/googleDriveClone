import os
from typing import Optional

from pymongo import MongoClient
from pymongo.database import Database


# Database connection
class DatabaseManager:
    client: Optional[MongoClient] = None
    database: Optional[Database] = None

# Database instance
db_manager = DatabaseManager()

def connect_to_mongo():
    """Create database connection using PyMongo."""
    # Get MongoDB URL from environment variable or use default
    # TODO: remove credentials from here
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://admin:password123@localhost:27017/filedrive?authSource=admin")

    # Create PyMongo client
    db_manager.client = MongoClient(mongodb_url)

    # Test the connection
    try:
        # Ping the database
        db_manager.client.admin.command('ping')
        print("✅ Successfully connected to MongoDB!")

        # Get the database
        db_manager.database = db_manager.client.filedrive
        print(f"✅ Connected to database: {db_manager.database.name}")

    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        raise e

def close_mongo_connection():
    """Close database connection."""
    if db_manager.client:
        db_manager.client.close()
        print("🔌 MongoDB connection closed.")

def get_database() -> Database:
    """Get database instance."""
    if db_manager.database is None:
        raise Exception("Database not connected. Call connect_to_mongo() first.")
    return db_manager.database
