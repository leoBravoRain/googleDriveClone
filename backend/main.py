# TODO: separate responsabilities (setup, routes, services, etc...)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import connect_to_mongo, close_mongo_connection, get_database

app = FastAPI(
    title="Google Drive Clone API",
    description="A simple Google Drive clone API built with FastAPI",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    # TODO: check if this is correct
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_db_client():
    """Connect to MongoDB on startup"""
    connect_to_mongo()

@app.on_event("shutdown")
def shutdown_db_client():
    """Close MongoDB connection on shutdown"""
    close_mongo_connection()

@app.get("/")
async def root():
    """Root endpoint - health check"""
    return {
        "message": "Google Drive Clone API is running!",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "google-drive-clone-api"
    }

# TODO: manage pagination?
@app.get("/api/files")
async def get_files():
    """Get all files from MongoDB using PyMongo"""
    try:
        # Get database instance
        database = get_database()
        
        # Get files collection
        files_collection = database.files
        
        # Find all files (synchronous operation with PyMongo)
        files = list(files_collection.find({}).limit(100))  # Limit to 100 files
        
        # Convert ObjectId to string for JSON serialization
        # This becasue ObjectId is not serializable by default
        for file in files:
            file["_id"] = str(file["_id"])
        
        return {
            "files": files,
            "total": len(files)
        }
    except Exception as e:
        return {
            "error": f"Failed to fetch files: {str(e)}",
            "files": [],
            "total": 0
        } 