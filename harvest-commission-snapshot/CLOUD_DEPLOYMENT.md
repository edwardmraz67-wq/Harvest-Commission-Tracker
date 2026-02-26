# Deploy to the Cloud - Complete Beginner's Guide

## What "Cloud Deployment" Means

Instead of running on your computer, your app will:
- Run on someone else's servers (in "the cloud")
- Be accessible from any device with internet
- Have a real web address like `your-app.vercel.app`
- Run 24/7 without your computer being on

## What You'll Need (All Free!)

1. **GitHub account** - To store your code
2. **Vercel account** - To run your app (they host it for free)
3. **Vercel Postgres** - To store your data (free tier included)
4. About 30 minutes of your time

**Total Cost: $0** (using free tiers)

---

## PART 1: Set Up GitHub (Code Storage)

GitHub is like Google Drive, but for code. It's where your app's files will live.

### Step 1: Create GitHub Account

1. Go to: https://github.com/signup
2. Enter your email
3. Create a password
4. Choose a username
5. Verify your email
6. Click through the welcome screens (you can skip the questionnaire)

✅ **You now have a GitHub account!**

### Step 2: Install GitHub Desktop (Easy Way)

This is a visual tool - no command line needed!

**Download GitHub Desktop:**
- Go to: https://desktop.github.com/
- Click "Download for [your OS]"
- Install it (just keep clicking Next/Continue)
- Open GitHub Desktop when installed

**Sign In:**
1. Click "Sign in to GitHub.com"
2. Click "Continue with browser"
3. Click "Authorize desktop"
4. Come back to GitHub Desktop

✅ **GitHub Desktop is ready!**

### Step 3: Upload Your Project to GitHub

First, make sure you've downloaded and unzipped the `harvest-commission-snapshot` folder.

**In GitHub Desktop:**

1. Click **"File"** → **"Add Local Repository"**
2. Click **"Choose..."** and find your `harvest-commission-snapshot` folder
3. If it says "not a git repository", click **"create a repository"**
4. Leave everything as default and click **"Create Repository"**

**Now publish it to GitHub:**

1. Click the **"Publish repository"** button (top right)
2. **IMPORTANT:** Uncheck "Keep this code private" (or use private if you prefer)
3. Add a description: "Harvest commission tracking app"
4. Click **"Publish Repository"**

**Wait about 30 seconds...**

✅ **Your code is now on GitHub!**

You can view it by clicking "View on GitHub" in the Repository menu.

---

## PART 2: Set Up Vercel (App Hosting)

Vercel will actually run your app and give you a web address.

### Step 1: Create Vercel Account

1. Go to: https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Click **"Authorize Vercel"**
4. Complete any verification steps

✅ **Vercel account created!**

### Step 2: Import Your Project

You should be on the Vercel dashboard.

1. Click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories
3. Find **"harvest-commission-snapshot"**
4. Click **"Import"**

**Configure the project:**

1. Leave "Framework Preset" as **Next.js** ✅
2. Leave "Root Directory" as **"./"** ✅
3. **DO NOT DEPLOY YET!** Click **"Environment Variables"** first

### Step 3: Add Environment Variables

These are the secret settings your app needs. You need to create 3 secrets:

**Click "Environment Variables" section:**

1. **First Variable:**
   - Name: `NEXTAUTH_SECRET`
   - Value: Go to https://generate-secret.vercel.app/32 and copy the generated secret
   - Click "Add"

2. **Second Variable:**
   - Name: `ENCRYPTION_KEY`
   - Value: Go to https://generate-secret.vercel.app/32 again (get a NEW one)
   - Click "Add"

3. **Third Variable:**
   - Name: `NEXTAUTH_URL`
   - Value: Leave this BLANK for now - we'll add it after deployment
   - Click "Add"

4. **Fourth Variable (we'll add the database URL in the next section):**
   - Don't add DATABASE_URL yet!

### Step 4: Add Database

**Click the "Storage" tab** (or skip to next section if you don't see it)

If you see a Storage tab:
1. Click **"Create Database"**
2. Choose **"Postgres"**
3. Choose a database name: `harvest-commission-db`
4. Click **"Create"**
5. **Vercel will automatically add the DATABASE_URL variable** ✅

If you DON'T see a Storage tab:
1. We'll add the database after deployment
2. Continue to next step

---

## PART 3: Deploy Your App! 🚀

### Step 1: First Deployment

Back on the project configuration page:

1. Make sure all your environment variables are there (except DATABASE_URL if no storage tab)
2. Click **"Deploy"**

**What happens now:**
- Vercel will start building your app (takes 2-3 minutes)
- You'll see a progress screen with lots of logs
- Wait for it to say **"Congratulations!"** or show a success screen

### Step 2: Get Your App URL

After successful deployment:

1. You'll see your app URL (something like `harvest-commission-snapshot.vercel.app`)
2. **Copy this URL!**

### Step 3: Update Environment Variables

**Very Important:**

1. Click on your project name at the top
2. Go to **"Settings"** tab
3. Click **"Environment Variables"**
4. Find `NEXTAUTH_URL`
5. Click the three dots → **"Edit"**
6. Change the value to your app URL with `https://` in front
   - Example: `https://harvest-commission-snapshot.vercel.app`
7. Click **"Save"**

### Step 4: Redeploy

The app needs to restart with the new URL:

1. Go to **"Deployments"** tab
2. Click the three dots next to the top deployment
3. Click **"Redeploy"**
4. Click **"Redeploy"** again to confirm

Wait 1-2 minutes for the redeployment.

---

## PART 4: Add Database (If You Skipped It Earlier)

If Vercel didn't have a Storage tab, we'll use their external database:

### Option A: Use Vercel Postgres (Recommended)

1. In your Vercel project, go to the **"Storage"** tab
2. Click **"Create Database"**
3. Choose **"Postgres"**
4. Name it: `harvest-commission-db`
5. Click **"Create"**
6. Click **"Connect"**
7. Select your project: `harvest-commission-snapshot`
8. Click **"Connect"**

✅ **Database connected!** Vercel automatically added the DATABASE_URL.

### Option B: Use Neon (Alternative Free Database)

If Vercel Postgres isn't available:

1. Go to: https://neon.tech/
2. Sign up with GitHub
3. Create a new project: "harvest-commission"
4. Copy the connection string (starts with `postgresql://`)
5. Go back to Vercel
6. Settings → Environment Variables
7. Add new variable:
   - Name: `DATABASE_URL`
   - Value: (paste the connection string)
8. Click "Save"

### Step 5: Update Database Schema

The database needs to be set up with your app's tables.

**In Vercel:**

1. Go to your project
2. Click **"Settings"** → **"Functions"**
3. Scroll to "Environment Variables"
4. Make sure `DATABASE_URL` is there ✅

**We need to run a migration. Two ways to do this:**

#### Easy Way (GitHub Desktop):

1. Open GitHub Desktop
2. Make sure your repository is selected
3. Open a terminal in your project:
   - **Mac:** Repository → Open in Terminal
   - **Windows:** Repository → Open in Command Prompt
4. Type these commands:

```bash
npm install
npx prisma migrate deploy
```

Wait for it to complete. Your database is now set up! ✅

#### Alternative (If that doesn't work):

Don't worry - the database will auto-setup when you first use the app. Skip this step.

---

## PART 5: Test Your Live App! 🎉

### Step 1: Visit Your App

1. Open a web browser
2. Go to your app URL (the one that looks like `https://your-app.vercel.app`)

**You should see the login page!**

### Step 2: Create Your Account

1. Click **"Sign up"**
2. Enter your email and password
3. Click **"Sign up"**

### Step 3: Connect to Harvest

Same as before:

1. Go to Harvest → Settings → Personal Access Tokens
2. Create a new token
3. Copy your Account ID and Token
4. Paste them in the app
5. Click **"Connect & Sync Data"**
6. Wait 30-60 seconds

### Step 4: See Your Dashboard!

🎊 **Congratulations! Your app is live on the internet!**

---

## What You Just Did

You now have:
- ✅ A live web app accessible from anywhere
- ✅ Your own database storing your data securely
- ✅ Automatic HTTPS (secure connection)
- ✅ No need to keep your computer running
- ✅ Free hosting (Vercel free tier)

## Using Your App

**Share it with others:**
- Send them your app URL
- They create their own account
- They connect their own Harvest account
- Their data is separate from yours

**Access from anywhere:**
- Phone browser
- Work computer
- Home computer
- Tablet

**Updates automatically:**
- Any changes you make in GitHub Desktop
- Will automatically deploy to Vercel
- Just commit and push changes

---

## Managing Your App

### To Make Updates:

1. Edit files in your local `harvest-commission-snapshot` folder
2. Open GitHub Desktop
3. Write a summary of changes (bottom left)
4. Click **"Commit to main"**
5. Click **"Push origin"**
6. Vercel will automatically redeploy (takes 2 minutes)

### To View Logs/Errors:

1. Go to Vercel dashboard
2. Click your project
3. Click **"Deployments"**
4. Click on a deployment to see logs

### To See Database:

1. In Vercel, click **"Storage"**
2. Click your database
3. Click **"Data"** tab
4. You can view all your data here

---

## Costs & Limits (Important!)

### Vercel Free Tier:
- **100 GB bandwidth/month** - More than enough for personal use
- **Unlimited deployments**
- **100 GB-hours serverless execution** - Plenty for this app
- **You won't hit these limits unless hundreds of people use your app**

### Vercel Postgres Free Tier:
- **256 MB storage** - Holds thousands of invoices
- **60 hours compute/month** - More than enough
- **3 GB data transfer** - Plenty

### When You Might Need to Pay:
- If you get 10,000+ visitors per month
- If you store 100,000+ invoices
- **For personal/small business use: FREE forever!**

---

## Troubleshooting

### "Build Failed" Error

1. Check the build logs in Vercel
2. Look for red error messages
3. Common fix: Make sure all files were uploaded to GitHub
4. In GitHub Desktop: Check if all files are committed

### "Application Error" When Visiting App

1. Go to Vercel → Settings → Environment Variables
2. Make sure you have:
   - `NEXTAUTH_URL` (your app URL with https://)
   - `NEXTAUTH_SECRET` (random string)
   - `ENCRYPTION_KEY` (different random string)
   - `DATABASE_URL` (from Vercel Postgres)
3. Click **"Redeploy"** after fixing

### Database Connection Error

1. Make sure `DATABASE_URL` is in environment variables
2. Make sure it starts with `postgresql://`
3. Try reconnecting the database in Vercel Storage tab

### Can't Log In

1. Clear browser cookies
2. Try incognito/private browsing mode
3. Check that `NEXTAUTH_URL` matches your actual URL exactly

---

## Next Steps

Now that your app is live:

1. **Use it!** Track your commissions online
2. **Share with team members** - Send them the URL
3. **Set up custom commission rules** for your projects
4. **Export data regularly** - Download CSVs for your records
5. **Bookmark your app URL** for easy access

---

## Support

If something goes wrong:

1. **Check Vercel dashboard** for error messages
2. **Try redeploying** (often fixes issues)
3. **Check GitHub Desktop** to ensure code is uploaded
4. **Clear browser cache** and try again

**Common Issues:**
- Most problems are fixed by redeploying
- Make sure environment variables are correct
- Ensure DATABASE_URL is set

---

## You Did It! 🎉

Your Harvest Commission Snapshot is now:
- Running in the cloud ☁️
- Accessible from anywhere 🌍
- Secure and encrypted 🔒
- Free to use 💰
- Professional looking 💼

**Bookmark your app URL and start tracking commissions!**
