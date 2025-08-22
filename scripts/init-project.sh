#!/bin/bash

# Google Drive Clone Project Initialization Script
# This script initializes the entire project step by step

set -e  # Exit on any error

echo "🚀 Starting Google Drive Clone Project Initialization..."
echo "=================================================="

# Step 0: Create data directories
echo ""
echo "📁 Step 0: Creating data directories..."
echo "--------------------------------------------------"

# Create data directories if they don't exist
mkdir -p data/mongodb data/minio
echo "✅ Created data directories:"
echo "   - data/mongodb/ (MongoDB database files)"
echo "   - data/minio/ (MinIO object storage files)"

# Step 1: Build and start services
echo ""
echo "📦 Step 1: Building and starting services..."
echo "--------------------------------------------------"

# Build and start MinIO MongoDB and Frontend
docker compose -f docker-compose.dev.yml up --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Step 2: Initialize MinIO
echo ""
echo "🔐 Step 2: Set up MinIO..."
echo "--------------------------------------------------"

# Make sure the init script is executable
chmod +x scripts/minio/init-minio.sh

# Run MinIO initialization
./scripts/minio/init-minio.sh

# Step 3: Start the backend
echo ""
echo "🔧 Step 3: Restarting the backend..."
echo "--------------------------------------------------"

# Build and start the backend
docker compose -f docker-compose.dev.yml restart backend

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 5

# Step 4: Verify all services are running
echo ""
echo "✅ Step 4: Verifying all services..."
echo "--------------------------------------------------"

# Check if all services are running
echo "🔍 Checking service status..."
docker compose -f docker-compose.dev.yml ps

# Test backend health
echo ""
echo "🏥 Testing backend health..."
if curl -s http://localhost:8000/ > /dev/null; then
    echo "✅ Backend is healthy!"
else
    echo "❌ Backend health check failed"
fi

# Step 5: Final status
echo "✅ Initialization completed successfully!"

# TODO: add here all the urls to the services
echo "🔗 URLs to the services:"
echo "   - MinIO: http://localhost:9000"
echo "   - MongoDB: http://localhost:27017"
echo "   - FastAPI: http://localhost:8000"
echo "   - Django: http://localhost:8001"
echo "   - Frontend: http://localhost:5173"

# TODO: add here all the urls to the services

