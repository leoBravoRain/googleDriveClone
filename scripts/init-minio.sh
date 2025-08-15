#!/bin/bash

# MinIO Initialization Script
# This script creates the MinIO bucket using docker exec commands

echo "🚀 Starting MinIO bucket initialization..."

# Check if MinIO container is running
if ! docker compose ps | grep -q "minio.*Up"; then
    echo "❌ MinIO service is not running. Starting MinIO..."
    docker compose up -d minio
    echo "⏳ Waiting for MinIO to be ready..."
    sleep 10
fi

# Get the container name
CONTAINER_NAME=$(docker compose ps -q minio)
if [ -z "$CONTAINER_NAME" ]; then
    echo "❌ Could not find MinIO container!"
    exit 1
fi

echo "🔧 Connecting to MinIO container: $CONTAINER_NAME"

# Execute commands inside the MinIO container
echo "📦 Setting up MinIO client alias..."
docker exec $CONTAINER_NAME mc alias set myminio http://localhost:9000 minioadmin minioadmin123

echo "📦 Creating bucket 'filedrive'..."
docker exec $CONTAINER_NAME mc mb myminio/filedrive

echo "🔐 Setting bucket policy for download access..."
docker exec $CONTAINER_NAME mc anonymous set download myminio/filedrive

echo "✅ Verifying bucket was created..."
docker exec $CONTAINER_NAME mc ls myminio

# Check if the commands were successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ MinIO initialization completed successfully!"
    echo "📦 Bucket 'filedrive' is ready for use"
    echo "🌐 MinIO Console: http://localhost:9001"
    echo "🔑 Login: minioadmin / minioadmin123"
    echo "🔗 API Endpoint: http://localhost:9000"
else
    echo ""
    echo "❌ MinIO initialization failed!"
    echo "📋 Check the logs above for more details"
    exit 1
fi
