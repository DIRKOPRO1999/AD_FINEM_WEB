#!/usr/bin/env bash
# scripts/gh-set-secrets.sh
# Usage:
#   export VITE_SUPABASE_URL="..."
#   export VITE_SUPABASE_ANON_KEY="..."
#   export CLOUDFLARE_API_TOKEN="..."   # optional
#   ./scripts/gh-set-secrets.sh

set -euo pipefail
REPO="DIRKOPRO1999/AD_FINEM_WEB"

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required. Install from https://cli.github.com/"
  exit 1
fi

: ${VITE_SUPABASE_URL:=""}
: ${VITE_SUPABASE_ANON_KEY:=""}
: ${CLOUDFLARE_API_TOKEN:=""}
: ${CLOUDFLARE_PAGES_PROJECT_NAME:="ad-finem-web"}

if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
  echo "You must export VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before running this script."
  echo "Example: export VITE_SUPABASE_URL=https://... && export VITE_SUPABASE_ANON_KEY=xxx"
  exit 1
fi

echo "Uploading secrets to GitHub repo: $REPO"

echo "- VITE_SUPABASE_URL"
gh secret set VITE_SUPABASE_URL -b"$VITE_SUPABASE_URL" --repo "$REPO"

echo "- VITE_SUPABASE_ANON_KEY"
gh secret set VITE_SUPABASE_ANON_KEY -b"$VITE_SUPABASE_ANON_KEY" --repo "$REPO"

if [ -n "$CLOUDFLARE_API_TOKEN" ]; then
  echo "- CLOUDFLARE_API_TOKEN"
  gh secret set CLOUDFLARE_API_TOKEN -b"$CLOUDFLARE_API_TOKEN" --repo "$REPO"
  echo "- CLOUDFLARE_PAGES_PROJECT_NAME"
  gh secret set CLOUDFLARE_PAGES_PROJECT_NAME -b"$CLOUDFLARE_PAGES_PROJECT_NAME" --repo "$REPO"
else
  echo "CLOUDFLARE_API_TOKEN not provided — skipping Cloudflare secrets (optional)."
fi

echo "Done. Trigger the workflow in GitHub Actions or push to main to run the build/deploy."