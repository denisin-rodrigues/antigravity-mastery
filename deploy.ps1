# Antigravity Mastery - Automated Deploy Script
# Requirement: GitHub PAT and Netlify Token

$BRAND_NAME = "Antigravity Mastery"
$REPO_NAME = "antigravity-mastery"

Write-Host "Starting Deploy Pipeline for $BRAND_NAME..." -ForegroundColor Cyan

# 1. Check for Git
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git not found. Please install Git."
    exit
}

# 2. Git Commit
Write-Host "Committing changes..." -ForegroundColor Yellow
git add .
git commit -m "feat: upgrade to cinematic scrollytelling experience"

# 3. Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

# 4. Netlify Deploy
if (Get-Command netlify -ErrorAction SilentlyContinue) {
    Write-Host "Deploying to Netlify..." -ForegroundColor Yellow
    netlify deploy --prod --dir=public
} else {
    Write-Host "Netlify CLI not found. Please run 'npm install -g netlify-cli' and 'netlify deploy --prod' manually." -ForegroundColor Red
}

Write-Host "Pipeline Finished!" -ForegroundColor Green
