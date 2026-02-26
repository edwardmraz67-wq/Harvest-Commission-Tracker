# Harvest Commission Snapshot - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies
```bash
cd harvest-commission-snapshot
npm install
```

### Step 2: Set Up Database
The project is pre-configured to use SQLite for local development (no PostgreSQL needed!).

```bash
npx prisma generate
npx prisma db push
```

### Step 3: Start the Development Server
```bash
npm run dev
```

Visit **http://localhost:3000**

### Step 4: Create Your Account
1. Click "Sign up"
2. Enter your email and password
3. You'll be redirected to connect Harvest

### Step 5: Connect to Harvest

#### Get Your Harvest Credentials:
1. Log in to your Harvest account
2. Navigate to: **Settings → Authorized Apps → Personal Access Tokens**
3. Click **"Create New Personal Access Token"**
4. Give it a name (e.g., "Commission Snapshot")
5. Copy your **Account ID** and **Personal Access Token**

#### Connect in the App:
1. Paste your Account ID
2. Paste your Personal Access Token
3. Click "Connect & Sync Data"
4. Wait 30-60 seconds for initial sync

### Step 6: View Your Dashboard
After sync completes, you'll see:
- Open commissions (from unpaid invoices)
- Earned commissions (from paid invoices)
- Date range controls (defaults to current quarter)

## 📊 What You Can Do

### Dashboard
- View commission summary for any date range
- See open vs. earned commissions
- Manual "Sync Now" button to refresh data

### Commissions Table
- Detailed invoice-level breakdown
- Filter by status (All/Open/Paid)
- Export to CSV

### Projects
- See all your Harvest projects
- Assign custom commission rules per project
- Default 10% rule applied automatically

### Rules
- Create custom commission percentages
- Edit existing rules
- Delete rules (projects reassign to default)

## 🔄 Syncing Data

The app imports from Harvest:
- ✅ Clients
- ✅ Projects  
- ✅ Invoices (with payment status)
- ✅ Payment amounts and dates

Click **"Sync Now"** in the dashboard to refresh at any time.

## 🛠️ Switching to PostgreSQL (Production)

For production deployment, update `.env`:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
```

Then update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Run migrations:
```bash
npx prisma migrate dev
```

## 📝 Default Settings

- **Default Commission Rule**: 10%
- **Auto-Assignment**: All projects automatically use default rule
- **Date Range**: Current quarter
- **Token Encryption**: AES-256-GCM (production-ready)

## 🎯 Core Value Proposition

**"Stop tracking commissions in spreadsheets!"**

This tool:
- Connects to Harvest in under 5 minutes
- Generates commission reports in under 10 minutes  
- Saves 2-3 hours monthly vs. manual tracking
- Zero configuration required to see initial data

## 🔐 Security Notes

- Harvest tokens are encrypted at rest
- Passwords are hashed with bcrypt
- Never logs sensitive credentials
- Session-based authentication

## 💡 Tips

1. **First Time Setup**: The initial sync might take 1-2 minutes if you have many invoices
2. **Commission Accuracy**: Make sure your Harvest invoices have correct payment dates
3. **Custom Rules**: Create rules for VIP clients, different service types, etc.
4. **Export CSV**: Use for your own records or to share with accounting

## ❓ Troubleshooting

**"Harvest connection failed"**
- Double-check your Account ID and Token
- Make sure the token hasn't been revoked in Harvest
- Verify you have API access enabled

**"No data showing"**
- Click "Sync Now" to manually trigger a refresh
- Check that you have invoices in Harvest for the selected date range

**"Database error"**
- Run `npx prisma db push` again
- Delete `prisma/dev.db` and re-run the command

## 🚢 Deploying to Production

Recommended platforms:
- **Vercel** - Easiest for Next.js (auto-deploys from Git)
- **Railway** - Includes PostgreSQL database
- **Render** - Good balance of features and pricing

Remember to:
1. Set strong production environment variables
2. Use PostgreSQL (not SQLite)
3. Enable HTTPS (usually automatic)
4. Set proper `NEXTAUTH_URL` to your domain

---

Need help? Check the full README.md or open an issue!
