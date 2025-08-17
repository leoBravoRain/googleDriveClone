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

echo "🔐 Setting up access control with access-user..."

# Create a access-user
echo "👤 Creating access-user..."
docker exec $CONTAINER_NAME mc admin user add myminio access-user access-password

# Copy the access policy file to the container
echo "📋 Copying access policy..."
docker cp scripts/minio/access-policy.json $CONTAINER_NAME:/tmp/access-policy.json

# Create the access policy
echo "🔒 Creating access policy..."
docker exec $CONTAINER_NAME mc admin policy create myminio access-policy /tmp/access-policy.json

# Attach the access policy to the access-user
echo "🔗 Attaching policy to access-user..."
docker exec $CONTAINER_NAME mc admin policy attach myminio access-policy --user=access-user

# Clean up the temporary file
docker exec $CONTAINER_NAME rm /tmp/access-policy.json

echo "✅ Access control setup completed!"
echo "📋 Created user: access-user / access-password"
echo "🔒 Applied access policy: access-policy"
echo "💡 To use access-user access, update backend credentials in docker-compose.yml:"
echo "   MINIO_ACCESS_KEY=access-user"
echo "   MINIO_SECRET_KEY=access-password"

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
