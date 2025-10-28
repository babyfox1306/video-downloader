#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Starting build process..."

# Update package lists and install ffmpeg
echo "Installing system dependencies (ffmpeg)..."
apt-get update -y && apt-get install -y ffmpeg

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Install Playwright browsers
echo "Installing Playwright browsers..."
playwright install chromium

# Verify installation
echo "Verifying Playwright installation..."
playwright --version
ls -la ~/.cache/ms-playwright/ || echo "Playwright cache directory not found"

echo "Build completed successfully!" 