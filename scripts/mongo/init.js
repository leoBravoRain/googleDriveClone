// MongoDB initialization script for FileDrive application
// This script runs when the MongoDB container starts for the first time

// Switch to the filedrive database
db = db.getSiblingDB('filedrive');

// Create collections
db.createCollection('files');

// Create indexes for better performance
db.files.createIndex({ "upload_date": -1 });
db.files.createIndex({ "file_id": 1 });

print("MongoDB initialization completed successfully!");
print("Database: filedrive");
print("Collection: files");
print("Indexes created for:upload_date, file_id");
