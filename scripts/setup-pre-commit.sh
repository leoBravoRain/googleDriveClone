#!/bin/bash

# Setup script for pre-commit hooks
# This script installs and configures pre-commit for the Google Drive Clone project

set -e

echo "🚀 Setting up pre-commit hooks for Google Drive Clone project..."

# Check if pre-commit is installed
if ! command -v pre-commit &> /dev/null; then
    echo "📦 Installing pre-commit..."

    # Try different installation methods
    if command -v pip &> /dev/null; then
        pip install pre-commit
    elif command -v pip3 &> /dev/null; then
        pip3 install pre-commit
    elif command -v brew &> /dev/null; then
        brew install pre-commit
    else
        echo "❌ Error: Could not install pre-commit. Please install it manually:"
        echo "   pip install pre-commit"
        echo "   or"
        echo "   brew install pre-commit"
        exit 1
    fi
else
    echo "✅ pre-commit is already installed"
fi

# Install the pre-commit hooks
echo "🔧 Installing pre-commit hooks..."
pre-commit install

# Install commit-msg hook for commitizen
echo "📝 Installing commit-msg hook..."
pre-commit install --hook-type commit-msg

# Install additional dependencies for the hooks
echo "📚 Installing additional dependencies..."

# Install frontend dependencies if package.json exists
if [ -f "frontend/package.json" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Create .secrets.baseline file if it doesn't exist
if [ ! -f ".secrets.baseline" ]; then
    echo "🔒 Creating secrets baseline file..."
    pre-commit run detect-secrets --all-files || true
fi

# Run pre-commit on all files to set up the baseline
echo "🔍 Running pre-commit on all files to establish baseline..."
pre-commit run --all-files || true

echo "✅ Pre-commit setup complete!"
echo ""
echo "📋 Available commands:"
echo "   pre-commit run --all-files    # Run all hooks on all files"
echo "   pre-commit run                # Run hooks on staged files"
echo "   pre-commit run <hook-id>      # Run a specific hook"
echo "   pre-commit clean              # Clean up pre-commit cache"
echo "   pre-commit autoupdate         # Update hook versions"
echo ""
echo "🎯 The following hooks are now active:"
echo "   • Basic file checks (trailing whitespace, file endings, etc.)"
echo "   • Prettier formatting for code"
echo "   • ESLint linting for JavaScript/TypeScript"
echo "   • TypeScript type checking"
echo "   • Svelte type checking"
echo "   • Security checks (detect-secrets)"
echo "   • Commit message formatting (commitizen)"
echo ""
echo "💡 Tips:"
echo "   • Hooks will run automatically on commit"
echo "   • Use 'git commit --no-verify' to skip hooks (not recommended)"
echo "   • Run 'pre-commit run --all-files' to check all files"
