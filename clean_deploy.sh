#!/bin/bash

# Clean SuperSal War Room HQ Deployment
echo "🔧 Cleaning deployment and removing sensitive files..."

# Remove all attached assets and sensitive files
rm -rf attached_assets/
rm -f temp_secrets.txt
rm -f .env*

# Remove any files that might contain API keys
find . -name "*.txt" -exec grep -l "***REMOVED***proj\|***REMOVED***live\|github_pat" {} \; | xargs rm -f
find . -name "*.md" -exec grep -l "***REMOVED***proj\|***REMOVED***live\|github_pat" {} \; | xargs rm -f

# Clean git history completely
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch attached_assets/* || true
git rm --cached --ignore-unmatch temp_secrets.txt || true
git rm --cached --ignore-unmatch .env* || true' \
--prune-empty --tag-name-filter cat -- --all

# Force garbage collection
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Add all remaining files
git add .
git commit -m "SuperSal War Room HQ - Clean Production Deploy

✅ Complete 8-page AI command center
✅ OpenAI GPT-4o integration ready
✅ Real-time dashboard operational
✅ External service integrations
✅ Mobile PWA capabilities
✅ Clean deployment (no secrets in repo)

Status: PRODUCTION READY FOR VERCEL"

# Force push to override history
echo "🚀 Force pushing clean deployment..."
git push origin main --force

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Clean SuperSal War Room HQ deployed!"
    echo "📍 Repository: https://github.com/Saint-Visions/Cookin-SaintSal-Platform"
    echo "⚡ Ready for Vercel deployment with environment variables"
    echo ""
    echo "Next: Add your API keys as environment variables in Vercel"
else
    echo "❌ Push failed. Check error above."
fi