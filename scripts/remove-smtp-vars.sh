#!/bin/bash

# Script to remove SMTP variables from Vercel
# These are no longer needed since we're using AWS SES

echo "🗑️  Removing SMTP variables from Vercel..."
echo ""

# Check if Vercel CLI is available
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed."
    echo "   Install it: npm install -g vercel"
    echo ""
    echo "   Or remove manually in Vercel Dashboard:"
    echo "   - Go to Vercel → Settings → Environment Variables"
    echo "   - Delete these variables:"
    echo "     • SMTP_HOST"
    echo "     • SMTP_USER"
    echo "     • SMTP_PASSWORD"
    exit 1
fi

# Check if authenticated
if ! vercel whoami &> /dev/null; then
    echo "❌ Not authenticated with Vercel CLI."
    echo "   Run: vercel login"
    exit 1
fi

# Variables to remove
VARS_TO_REMOVE=("SMTP_HOST" "SMTP_USER" "SMTP_PASSWORD")

echo "Variables to remove:"
for var in "${VARS_TO_REMOVE[@]}"; do
    echo "  - $var"
done
echo ""

# Get project info
PROJECT_NAME=$(basename $(pwd))
echo "Project: $PROJECT_NAME"
echo ""

# Remove variables for each environment
ENVIRONMENTS=("production" "preview" "development")

for env in "${ENVIRONMENTS[@]}"; do
    echo "Removing from $env environment..."
    for var in "${VARS_TO_REMOVE[@]}"; do
        if vercel env rm "$var" "$env" --yes &> /dev/null; then
            echo "  ✅ Removed $var from $env"
        else
            echo "  ⚠️  $var not found in $env (or already removed)"
        fi
    done
done

echo ""
echo "✅ Done! SMTP variables removed."
echo ""
echo "Note: RESEND_API_KEY can also be removed if you're only using AWS SES."
