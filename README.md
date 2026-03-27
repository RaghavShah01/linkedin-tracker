# LinkedIn Outreach Tracker

An end-to-end framework and application to automatically track your LinkedIn activities and save them to a serverless AWS backend. Allows viewing and editing these events on a stylish React Dashboard hosted via GitHub pages.

## Setup Instructions

### Step 1: Clone and configure
```bash
git clone https://github.com/raghavshah01/linkedin-tracker.git
cd linkedin-tracker
```

### Step 2: Deploy AWS backend
```bash
cd backend
./deploy.sh linkedin-tracker us-east-1
```
Then note the API Gateway URL and retrieve the API key from AWS Console.

### Step 3: Configure dashboard
```bash
cd dashboard
cp .env.example .env
# Edit .env with your API_BASE_URL and API_KEY
```

### Step 4: Add GitHub Secrets
In GitHub repo settings → Secrets → add:
- `VITE_API_BASE_URL`
- `VITE_API_KEY`

### Step 5: Enable GitHub Pages
In repo settings → Pages → Source: `gh-pages` branch

### Step 6: Configure Chrome Extension
```bash
cd extension
cp config.example.js config.js
# Edit config.js with your API_BASE_URL and API_KEY
```
Then in Chrome: go to `chrome://extensions` → Enable Developer Mode → Load Unpacked → select `extension/` folder.

### Step 7: Push to deploy dashboard
```bash
git add .
git commit -m "Initial commit"
git push origin main
# GitHub Actions will build and deploy to GitHub Pages automatically
```
