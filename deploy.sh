#!/bin/bash

# LinkedIn Post Generator - Deployment Script
# This script helps set up and deploy the application

set -e

echo "🚀 LinkedIn Post Generator - Deployment Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js v14 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 14 ]; then
        print_error "Node.js version 14 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    print_success "npm $(npm -v) is installed"
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from template..."
        cp env.example .env
        print_warning "Please edit backend/.env and add your OpenAI API key"
    else
        print_success ".env file already exists"
    fi
    
    cd ..
    print_success "Backend setup complete"
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    cd ..
    print_success "Frontend setup complete"
}

# Start development servers
start_dev() {
    print_status "Starting development servers..."
    
    # Start backend in background
    print_status "Starting backend server on http://localhost:5000"
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend
    print_status "Starting frontend server on http://localhost:3000"
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    print_success "Development servers started!"
    print_status "Backend: http://localhost:5000"
    print_status "Frontend: http://localhost:3000"
    print_status "Health check: http://localhost:5000/health"
    
    # Wait for user to stop servers
    echo ""
    print_warning "Press Ctrl+C to stop all servers"
    
    # Function to cleanup on exit
    cleanup() {
        print_status "Stopping servers..."
        kill $BACKEND_PID 2>/dev/null || true
        kill $FRONTEND_PID 2>/dev/null || true
        print_success "Servers stopped"
        exit 0
    }
    
    # Set trap to cleanup on exit
    trap cleanup SIGINT SIGTERM
    
    # Wait for background processes
    wait
}

# Build for production
build_production() {
    print_status "Building for production..."
    
    # Build frontend
    print_status "Building frontend..."
    cd frontend
    npm run build
    cd ..
    
    print_success "Production build complete!"
    print_status "Frontend build files are in frontend/build/"
}

# Deploy to Heroku
deploy_heroku() {
    print_status "Deploying to Heroku..."
    
    # Check if Heroku CLI is installed
    if ! command -v heroku &> /dev/null; then
        print_error "Heroku CLI is not installed. Please install it first."
        print_status "Visit: https://devcenter.heroku.com/articles/heroku-cli"
        exit 1
    fi
    
    # Check if logged in to Heroku
    if ! heroku auth:whoami &> /dev/null; then
        print_error "Not logged in to Heroku. Please run 'heroku login' first."
        exit 1
    fi
    
    # Deploy backend
    print_status "Deploying backend to Heroku..."
    cd backend
    
    # Create Heroku app if it doesn't exist
    if [ ! -f .git/config ]; then
        git init
        git add .
        git commit -m "Initial commit"
    fi
    
    # Create Heroku app
    APP_NAME="linkedin-post-generator-$(date +%s)"
    heroku create $APP_NAME
    
    # Set environment variables
    print_warning "Please set your OpenAI API key in Heroku:"
    print_status "heroku config:set OPENAI_API_KEY=your_api_key -a $APP_NAME"
    
    # Deploy
    git push heroku main
    
    cd ..
    
    print_success "Backend deployed to: https://$APP_NAME.herokuapp.com"
    
    # Deploy frontend
    print_status "Deploying frontend to Heroku..."
    cd frontend
    
    # Create Heroku app for frontend
    FRONTEND_APP_NAME="linkedin-post-generator-frontend-$(date +%s)"
    heroku create $FRONTEND_APP_NAME
    
    # Set buildpacks
    heroku buildpacks:set heroku/nodejs -a $FRONTEND_APP_NAME
    heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static -a $FRONTEND_APP_NAME
    
    # Create static.json for static buildpack
    cat > static.json << EOF
{
  "root": "build/",
  "routes": {
    "/**": "index.html"
  }
}
EOF
    
    # Deploy
    git init
    git add .
    git commit -m "Initial commit"
    git push heroku main
    
    cd ..
    
    print_success "Frontend deployed to: https://$FRONTEND_APP_NAME.herokuapp.com"
    print_warning "Don't forget to update the API URL in the frontend to point to your backend!"
}

# Show help
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  setup     - Set up both frontend and backend"
    echo "  dev       - Start development servers"
    echo "  build     - Build for production"
    echo "  deploy    - Deploy to Heroku"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup    # Set up the project"
    echo "  $0 dev      # Start development servers"
    echo "  $0 build    # Build for production"
    echo "  $0 deploy   # Deploy to Heroku"
}

# Main script logic
main() {
    case "${1:-help}" in
        setup)
            check_node
            check_npm
            setup_backend
            setup_frontend
            print_success "Setup complete! Run '$0 dev' to start development servers"
            ;;
        dev)
            check_node
            check_npm
            start_dev
            ;;
        build)
            check_node
            check_npm
            build_production
            ;;
        deploy)
            check_node
            check_npm
            deploy_heroku
            ;;
        help|*)
            show_help
            ;;
    esac
}

# Run main function
main "$@"
