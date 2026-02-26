# Cloud Deployment Checklist ✓

Print this and check off each step!

## Prerequisites (5 minutes)
- [ ] Download and unzip the project folder
- [ ] Put it somewhere easy to find (Desktop or Documents)

## Part 1: GitHub Setup (10 minutes)
- [ ] Create GitHub account at github.com/signup
- [ ] Download and install GitHub Desktop
- [ ] Sign in to GitHub Desktop
- [ ] Add your project folder as a repository
- [ ] Publish repository to GitHub

## Part 2: Vercel Setup (5 minutes)
- [ ] Create Vercel account at vercel.com/signup
- [ ] Use "Continue with GitHub" option
- [ ] Authorize Vercel to access GitHub

## Part 3: Deploy (10 minutes)
- [ ] In Vercel, click "Add New" → "Project"
- [ ] Import your GitHub repository
- [ ] Add environment variables:
  - [ ] `NEXTAUTH_SECRET` (generate at generate-secret.vercel.app/32)
  - [ ] `ENCRYPTION_KEY` (generate a different one)
  - [ ] `NEXTAUTH_URL` (leave blank for now)
- [ ] Create Postgres database in Storage tab
- [ ] Click "Deploy"
- [ ] Wait for "Congratulations!" message

## Part 4: Configure (5 minutes)
- [ ] Copy your app URL (looks like: your-app.vercel.app)
- [ ] Go to Settings → Environment Variables
- [ ] Edit `NEXTAUTH_URL` and set it to: https://your-app-url-here.vercel.app
- [ ] Click "Redeploy"
- [ ] Wait for redeployment to complete

## Part 5: Test (5 minutes)
- [ ] Visit your app URL in a browser
- [ ] See the login page
- [ ] Click "Sign up"
- [ ] Create your account
- [ ] Get Harvest credentials:
  - [ ] Harvest → Settings → Personal Access Tokens
  - [ ] Create new token
  - [ ] Copy Account ID
  - [ ] Copy Token
- [ ] Enter credentials in app
- [ ] Click "Connect & Sync Data"
- [ ] Wait 30-60 seconds
- [ ] See your dashboard! 🎉

## You're Live!
Your app is now:
- ✅ Running on the internet
- ✅ Accessible from any device
- ✅ Free to use
- ✅ Secure with HTTPS

## To Make Updates Later:
- [ ] Edit files locally
- [ ] Open GitHub Desktop
- [ ] Commit changes (bottom left)
- [ ] Push to GitHub
- [ ] Vercel auto-deploys (2 minutes)

---

**Your app URL:** ___________________________________

**Keep this safe!** Bookmark it or write it down.

**Stuck?** Check CLOUD_DEPLOYMENT.md for detailed help!
