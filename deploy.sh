#!/bin/bash

echo "🚀 Starting SR Dashboard MERN Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    print_error "Node.js version $NODE_VERSION is too old. Please install Node.js 18 or higher."
    exit 1
fi

print_status "Node.js version $NODE_VERSION is compatible ✓"

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    print_warning "MongoDB doesn't appear to be running. Please start MongoDB service."
    echo "To start MongoDB:"
    echo "  sudo systemctl start mongod"
    echo "  # or"
    echo "  sudo service mongod start"
fi

# Install dependencies
print_status "Installing dependencies..."
npm run install:all

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

# Create uploads directory
print_status "Creating uploads directory..."
mkdir -p uploads

# Set proper permissions
chmod 755 uploads

# Copy environment file
if [ ! -f "server/.env" ]; then
    print_status "Creating environment file..."
    cp server/.env.example server/.env
    print_warning "Please update server/.env with your configuration"
fi

# Seed database with default users
print_status "Seeding database with default users..."
npm run seed

if [ $? -ne 0 ]; then
    print_error "Failed to seed database"
    exit 1
fi

# Build React frontend
print_status "Building React frontend..."
cd client && npm run build

if [ $? -ne 0 ]; then
    print_error "Failed to build frontend"
    exit 1
fi

cd ..

print_status "✅ Deployment completed successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Update server/.env with your configuration"
echo "2. Start the application:"
echo "   npm run dev    # For development"
echo "   npm start      # For production"
echo ""
echo "📋 Default login credentials:"
echo ""
echo "🌐 Access the application at:"
echo "   http://172.22.97.21:5173 (Development)"
echo "   http://172.22.97.21:5001 (Production)"
