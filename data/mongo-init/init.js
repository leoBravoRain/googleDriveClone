// MongoDB initialization script for FileDrive application
// This script runs when the MongoDB container starts for the first time

// Switch to the filedrive database
db = db.getSiblingDB('filedrive');

// Create collections
db.createCollection('files');

// Create indexes for better performance
db.files.createIndex({ "filename": 1 });
db.files.createIndex({ "upload_date": -1 });
db.files.createIndex({ "file_type": 1 });

// Insert a sample document to verify the setup
db.files.insertOne({
    filename: "sample.txt",
    original_name: "sample.txt",
    size: 1024,
    file_type: "text/plain",
    upload_date: new Date(),
    storage_path: "sample/sample.txt",
    user_id: null, // Will be used when we add authentication
    created_at: new Date(),
    updated_at: new Date()
});

print("MongoDB initialization completed successfully!");
print("Database: filedrive");
print("Collection: files");
print("Indexes created for: filename, upload_date, file_type, user_id");
