# Complete Beginner's Guide to Running Harvest Commission Snapshot

## What You're About to Do

You're going to run a web application on your own computer. It will look and work just like a website, but it's running locally on your machine. Don't worry - I'll walk you through every single step!

---

## PART 1: Install Required Software (One-Time Setup)

### Step 1: Install Node.js

Node.js is what runs the application. Think of it like Microsoft Word needs to be installed to open Word documents.

**Mac Users:**
1. Go to: https://nodejs.org
2. Click the big green button that says "Download Node.js (LTS)"
3. Open the downloaded file
4. Click "Continue" → "Continue" → "Agree" → "Install"
5. Enter your computer password when asked
6. Click "Close" when done

**Windows Users:**
1. Go to: https://nodejs.org
2. Click the big green button that says "Download Node.js (LTS)"
3. Open the downloaded file
4. Click "Next" → "Next" → "Next" → "Install"
5. Click "Finish" when done

**Verify it worked:**
1. **Mac:** Open "Terminal" (search for it in Spotlight - press Cmd+Space and type "terminal")
2. **Windows:** Open "Command Prompt" (search for it in the Start menu)
3. Type this and press Enter:
   ```
   node --version
   ```
4. You should see something like `v18.17.0` or similar. If you do, it worked! ✅

---

## PART 2: Get the Project Files

You should have downloaded a folder called `harvest-commission-snapshot` from me. 

**Where to put it:**
- **Mac:** Put it in your Documents folder or Desktop (wherever you can easily find it)
- **Windows:** Put it in your Documents folder or Desktop

**Open Terminal/Command Prompt in this folder:**

**Mac:**
1. Open Finder
2. Navigate to where you saved the `harvest-commission-snapshot` folder
3. Right-click the folder
4. Hold down the "Option" key on your keyboard
5. You'll see "Open in Terminal" appear in the menu - click it

**Windows:**
1. Open File Explorer
2. Navigate to where you saved the `harvest-commission-snapshot` folder
3. Hold down the Shift key and right-click inside the folder (not on it)
4. Click "Open PowerShell window here" or "Open Command Prompt here"

**You should see a window with text that ends with `harvest-commission-snapshot`** ✅

---

## PART 3: Install the App Dependencies

Think of this like installing all the pieces the app needs to work.

**In the Terminal/Command Prompt window, type this EXACTLY and press Enter:**

```
npm install
```

**What you'll see:**
- Lots of text will scroll by
- It might take 2-5 minutes
- Eventually it will stop and show you a prompt again

**If you see any warnings in yellow, that's normal - ignore them!**

**If you see "npm: command not found" or similar:**
- Node.js didn't install correctly
- Close the terminal and try Part 1 again

---

## PART 4: Set Up the Database

The app needs a place to store your data. We're using a simple database file.

**Type these commands ONE AT A TIME (press Enter after each):**

```
npx prisma generate
```

Wait for it to finish (you'll see a success message), then type:

```
npx prisma db push
```

**What you'll see:**
- Some text about the database
- "Your database is now in sync with your schema" ✅

---

## PART 5: Start the Application

**Type this command:**

```
npm run dev
```

**What you'll see:**
- Some text will appear
- Eventually you'll see something like:
  ```
  ✓ Ready in 2.3s
  ○ Local:   http://localhost:3000
  ```

**✨ The app is now running!** Leave this window open - don't close it!

---

## PART 6: Open the App in Your Browser

1. Open your web browser (Chrome, Safari, Firefox, etc.)
2. In the address bar, type exactly:
   ```
   localhost:3000
   ```
3. Press Enter

**You should see the login page for Harvest Commission Snapshot!** 🎉

---

## PART 7: Create Your Account

1. Click "Sign up" at the bottom
2. Enter your email and create a password (minimum 8 characters)
3. Click "Sign up"

**You'll be taken to the Harvest connection page** ✅

---

## PART 8: Connect to Harvest

Now you need to get your Harvest credentials. Keep the app open and follow these steps:

### Get Your Harvest Personal Access Token

1. Open a new browser tab
2. Go to your Harvest account: https://id.getharvest.com/
3. Log in to Harvest
4. Click on your profile picture (top right corner)
5. Click "Settings" or go to: https://id.getharvest.com/developers
6. Look for "Personal Access Tokens" section
7. Click "Create New Personal Access Token"
8. Give it a name: "Commission Snapshot"
9. Click "Create Token"

**You'll see two important things:**

**Account ID:** A number like `1234567`
**Token:** A long string like `abcd1234.pt.xyz...`

**IMPORTANT:** Copy both of these - you'll need them in the next step!

### Enter Credentials in the App

1. Go back to the app (localhost:3000)
2. Paste your **Account ID** in the first box
3. Paste your **Personal Access Token** in the second box
4. Click "Connect & Sync Data"

**What happens:**
- You'll see "Connecting to Harvest..."
- This will take 30-60 seconds
- The app is importing all your clients, projects, and invoices
- When done, you'll see your dashboard! 🎊

---

## PART 9: Use the App

**You're done with setup!** Now you can:

### View Your Dashboard
- See your open commissions (from unpaid invoices)
- See your earned commissions (from paid invoices)
- Change the date range to see different periods

### Click "Commissions" in the top menu
- See every invoice with commission calculated
- Filter by Open or Paid
- Click "Export CSV" to download a spreadsheet

### Click "Projects" in the top menu
- See all your Harvest projects
- Each project has a dropdown to change commission percentage
- Default is 10% for everything

### Click "Rules" in the top menu
- Create custom commission percentages
- For example: "VIP Clients - 15%" or "Small Projects - 5%"
- Then assign these to projects in the Projects page

### Click "Sync Now" (in Dashboard)
- Refreshes data from Harvest
- Use this whenever you want the latest invoice data

---

## How to Stop the App

When you're done:

1. Go to the Terminal/Command Prompt window (where you ran `npm run dev`)
2. Press `Ctrl+C` (on both Mac and Windows)
3. The app will stop
4. You can close the terminal window

---

## How to Start the App Again Later

**Every time you want to use the app:**

1. Open Terminal/Command Prompt in the `harvest-commission-snapshot` folder (see Part 2)
2. Type: `npm run dev`
3. Wait for "Ready" message
4. Open browser to `localhost:3000`

**That's it!** No need to reinstall or set up the database again.

---

## Troubleshooting

### "npm: command not found"
- Node.js isn't installed correctly
- Redo Part 1 (Install Node.js)

### "Cannot find module..."
- Run `npm install` again

### "Port 3000 is already in use"
- The app is already running in another window
- Close all terminal windows and try again
- OR change the port by typing: `npm run dev -- -p 3001`
- Then visit `localhost:3001` instead

### "Harvest connection failed"
- Double-check your Account ID and Token
- Make sure you copied the entire token (they're long!)
- Make sure the token hasn't been deleted in Harvest

### "Database error"
- Run these commands again:
  ```
  npx prisma generate
  npx prisma db push
  ```

### Nothing appears when I go to localhost:3000
- Make sure the terminal says "Ready"
- Try `localhost:3000` (no http://)
- Try clearing your browser cache
- Try a different browser

---

## What Files to Keep/Delete

**KEEP THESE:**
- The entire `harvest-commission-snapshot` folder
- Don't move or rename anything inside it

**CAN DELETE (if you want):**
- The documentation files (README.md, QUICKSTART.md, etc.) - but they have useful info!

**NEVER DELETE:**
- The `node_modules` folder (even though it's huge)
- The `.env` file
- The `prisma` folder

---

## Important Notes

### Your Data is Safe
- Everything is stored on YOUR computer
- Your Harvest credentials are encrypted
- Nothing is sent to anyone else
- The app only reads from Harvest (can't change anything)

### Sharing Access
- To let someone else use it, they need their own Harvest credentials
- They can sign up on your running app
- Or you can deploy it to the internet (more advanced - see DEPLOYMENT.md)

### Backing Up
- Your data is in a file called `dev.db` in the `prisma` folder
- To backup: Copy that file somewhere safe
- To restore: Replace it with your backup copy

---

## What to Do Next

1. **Explore!** Click around and see how it works
2. **Customize rules** - Set up commission percentages that match your business
3. **Export data** - Download CSV files for your records
4. **Sync regularly** - Click "Sync Now" weekly to keep data current

---

## Need Help?

If you get stuck:

1. **Close everything and start fresh:**
   - Close terminal/command prompt
   - Reopen it in the project folder
   - Run `npm run dev` again

2. **Check the error message:**
   - Most errors tell you what's wrong
   - Google the exact error message if needed

3. **Common fixes:**
   - Restart your computer
   - Delete `node_modules` folder and run `npm install` again
   - Make sure no other apps are running on port 3000

---

## Success! 🎉

If you can see your dashboard with commission numbers, you did it! 

You now have a working commission tracking tool that saves hours of manual spreadsheet work.

**Pro tip:** Bookmark `localhost:3000` in your browser so you can get to it easily when the app is running!
