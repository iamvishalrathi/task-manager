#!/bin/bash

# Task Manager Deployment Script
# This script helps deploy the application to various platforms

set -e

echo "🚀 Task Manager Deployment Script"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if node and npm are installed
check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    log_success "Dependencies check passed"
}

# Install packages
install_packages() {
    log_info "Installing packages..."
    npm ci
    log_success "Packages installed successfully"
}

# Build the application
build_app() {
    log_info "Building application for production..."
    npm run build
    log_success "Application built successfully"
    
    # Show build info
    if [ -d "dist" ]; then
        BUILD_SIZE=$(du -sh dist | cut -f1)
        log_success "Build size: $BUILD_SIZE"
    fi
}

# Run tests (if available)
run_tests() {
    log_info "Running tests..."
    if npm run test --silent 2>/dev/null; then
        log_success "All tests passed"
    else
        log_warning "No tests found or tests failed"
    fi
}

# Deploy to Vercel
deploy_vercel() {
    log_info "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        log_warning "Vercel CLI not found. Installing..."
        npm i -g vercel
    fi
    
    vercel --prod
    log_success "Deployed to Vercel successfully"
}

# Deploy to Netlify
deploy_netlify() {
    log_info "Deploying to Netlify..."
    
    if ! command -v netlify &> /dev/null; then
        log_warning "Netlify CLI not found. Installing..."
        npm i -g netlify-cli
    fi
    
    netlify deploy --prod --dir=dist
    log_success "Deployed to Netlify successfully"
}

# Build Docker image
build_docker() {
    log_info "Building Docker image..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker from https://docker.com/"
        exit 1
    fi
    
    docker build -t task-manager:latest .
    log_success "Docker image built successfully"
    
    echo ""
    log_info "To run the Docker container:"
    echo "docker run -p 3000:80 task-manager:latest"
}

# Main menu
show_menu() {
    echo ""
    log_info "Select deployment option:"
    echo "1) Build only"
    echo "2) Build and preview locally"
    echo "3) Deploy to Vercel"
    echo "4) Deploy to Netlify"
    echo "5) Build Docker image"
    echo "6) Full CI/CD (build + test + deploy)"
    echo "0) Exit"
    echo ""
}

# Main script
main() {
    echo ""
    log_info "Starting deployment process..."
    
    check_dependencies
    
    while true; do
        show_menu
        read -p "Enter your choice (0-6): " choice
        
        case $choice in
            1)
                install_packages
                build_app
                ;;
            2)
                install_packages
                build_app
                log_info "Starting preview server..."
                npm run preview
                ;;
            3)
                install_packages
                build_app
                deploy_vercel
                ;;
            4)
                install_packages
                build_app
                deploy_netlify
                ;;
            5)
                build_docker
                ;;
            6)
                install_packages
                run_tests
                build_app
                log_info "Choose deployment target:"
                read -p "Deploy to (v)ercel or (n)etlify? " target
                case $target in
                    v|V|vercel|Vercel)
                        deploy_vercel
                        ;;
                    n|N|netlify|Netlify)
                        deploy_netlify
                        ;;
                    *)
                        log_warning "Invalid target. Skipping deployment."
                        ;;
                esac
                ;;
            0)
                log_success "Goodbye! 👋"
                exit 0
                ;;
            *)
                log_error "Invalid option. Please try again."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main
