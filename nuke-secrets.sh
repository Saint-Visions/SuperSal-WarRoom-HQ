#!/bin/bash

# Must be in repo root
echo "🧨 Nuking sensitive files from Git history..."

git filter-repo \
  --force \
  --path temp_secrets.txt --invert-paths \
  --path .replit --invert-paths \
  --path FINAL_DEPLOYMENT_INSTRUCTIONS.md --invert-paths \
  --path VERCEL_DEPLOYMENT.md --invert-paths \
  --path attached_assets/ --invert-paths \
  --path .env --invert-paths \
  --path .env.local --invert-paths \
  --path .env.production --invert-paths

echo "✅ Repo history cleaned. Now re-adding origin..."

git remote remove origin
git remote add origin https://github.com/Saint-Visions/SuperSal-WarRoom-HQ.git

echo "🚀 Pushing clean history..."
git push origin main --force
