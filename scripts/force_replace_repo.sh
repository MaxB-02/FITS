#!/usr/bin/env bash
set -euo pipefail
REPO_URL="${1:-https://github.com/MaxB-02/FITS.git}"
BRANCH="${2:-main}"

git init
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"
git add -A
git commit -m "Publish production-ready site"
git branch -M "$BRANCH"
git push --force origin "$BRANCH"
echo "Force-pushed to $REPO_URL ($BRANCH)" 