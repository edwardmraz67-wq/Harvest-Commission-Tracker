# Setup Checklist ✓

Print this out or keep it open while you set up!

## Pre-Setup
- [ ] Download the `harvest-commission-snapshot` folder
- [ ] Put it somewhere you can find it (Desktop or Documents)

## Installation (One-Time)
- [ ] Install Node.js from nodejs.org
- [ ] Verify: Open terminal and type `node --version`

## Setup Commands (One-Time)
- [ ] Open terminal in the project folder
- [ ] Run: `npm install` (wait 2-5 minutes)
- [ ] Run: `npx prisma generate`
- [ ] Run: `npx prisma db push`

## Start the App (Every Time You Use It)
- [ ] Open terminal in the project folder
- [ ] Run: `npm run dev`
- [ ] Wait for "Ready" message
- [ ] Open browser to `localhost:3000`

## First-Time Setup
- [ ] Click "Sign up"
- [ ] Create account with email and password
- [ ] Get Harvest credentials:
  - [ ] Go to Harvest Settings → Personal Access Tokens
  - [ ] Create new token named "Commission Snapshot"
  - [ ] Copy Account ID
  - [ ] Copy Personal Access Token
- [ ] Enter both in the app
- [ ] Click "Connect & Sync Data"
- [ ] Wait 30-60 seconds for sync
- [ ] See your dashboard! 🎉

## You're Done!
Now you can:
- View commission summary
- See detailed invoice table
- Export to CSV
- Create custom commission rules
- Assign rules to projects

## To Use Later
- [ ] Open terminal in project folder
- [ ] Run: `npm run dev`
- [ ] Go to `localhost:3000`

## To Stop
- [ ] In terminal, press Ctrl+C
- [ ] Close terminal

---

**Stuck?** Check BEGINNER_GUIDE.md for detailed help!
