# Harvest Commission Snapshot

A lightweight SaaS tool that connects to Harvest invoices to automatically calculate commissions. Designed for individuals or small agencies paid on collected revenue.

## Features

- **Zero-config onboarding**: Immediately show commissions after Harvest connection without heavy configuration
- **Automatic sync**: Import clients, projects, and invoices from Harvest
- **Flexible commission rules**: Create custom commission percentages per project
- **Real-time dashboard**: Track open (potential) and earned (paid) commissions
- **Date range filtering**: View commissions for specific periods
- **CSV export**: Export commission details for record-keeping
- **Project management**: Assign different commission rules to different projects

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **API**: Harvest API (read-only)
- **Security**: AES-256-GCM encryption for tokens

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or SQLite for local development)
- Harvest account with API access

## Getting Started

### 1. Clone and Install

```bash
cd harvest-commission-snapshot
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Database - PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/harvest_commission?schema=public"

# For local development with SQLite, use:
# DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"

# Encryption key for Harvest tokens (32+ characters)
ENCRYPTION_KEY="change-this-to-a-random-32-char-key"
```

**Generate secure keys:**

```bash
# For NEXTAUTH_SECRET and ENCRYPTION_KEY
openssl rand -base64 32
```

### 3. Set Up Database

Run Prisma migrations:

```bash
npm run db:push
```

Or for development with migrations:

```bash
npm run db:migrate
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### Initial Setup

1. **Sign Up**: Create an account at `/signup`
2. **Connect Harvest**: 
   - Get your Harvest Personal Access Token:
     - Log in to Harvest
     - Go to Settings → Authorized Apps → Personal Access Tokens
     - Create a new token
     - Copy your Account ID and Token
   - Enter credentials in the onboarding page
   - Wait for initial sync to complete

### Dashboard

The dashboard shows two key metrics:

- **Open Commission**: Potential commission from unpaid invoices
- **Earned Commission**: Commission from paid invoices in the selected period

Use the date range picker to filter by specific periods (defaults to current quarter).

### Projects

- View all synced projects from Harvest
- Assign custom commission rules to individual projects
- Default rule (10%) is automatically applied to all projects initially

### Commission Rules

- Create custom commission percentages
- Edit existing rules (updates all projects using that rule)
- Delete custom rules (projects reassign to default)
- Default rule cannot be deleted

### Commissions Table

- View detailed invoice-level commission breakdown
- Filter by status: All, Open, or Paid
- Export to CSV for external tracking
- Columns: Invoice #, Client, Project, Dates, Status, Amounts, Commission

### Manual Sync

Click "Sync Now" in the dashboard to manually trigger a Harvest data refresh. This will:
- Update existing invoices (amounts, status, paid dates)
- Import new invoices
- Import new clients and projects

## Database Schema

### Key Models

- **User**: Authentication and ownership
- **HarvestConnection**: Encrypted Harvest API credentials
- **Client**: Harvest clients
- **Project**: Harvest projects linked to clients
- **Invoice**: Harvest invoices with payment status
- **CommissionRule**: Commission percentage rules
- **ProjectRuleAssignment**: Maps projects to commission rules
- **PayoutPeriod**: Track payout cycles (future feature)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Harvest
- `POST /api/harvest/connection` - Save Harvest credentials & initial sync
- `GET /api/harvest/connection` - Get connection status

### Sync
- `POST /api/sync/harvest` - Trigger manual sync

### Commissions
- `GET /api/commissions?startDate=&endDate=` - Get commission data

### Projects
- `GET /api/projects` - List all projects with assignments
- `PUT /api/projects` - Update project rule assignment

### Rules
- `GET /api/rules` - List commission rules
- `POST /api/rules` - Create new rule
- `PUT /api/rules` - Update rule
- `DELETE /api/rules?id=` - Delete rule

## Security Features

- **Token Encryption**: Harvest tokens encrypted at rest using AES-256-GCM
- **Password Hashing**: bcrypt with salt
- **Session Management**: JWT-based sessions via NextAuth
- **HTTPS Required**: Production deployment should use HTTPS
- **Environment Variables**: Sensitive data never committed to code

## Production Deployment

### Recommended Platforms

- **Vercel** (easiest for Next.js)
- **Railway** (includes PostgreSQL)
- **Render**
- **Heroku**

### Environment Variables for Production

Set all variables from `.env.example` with production values:

- Use a strong `NEXTAUTH_SECRET`
- Use a strong `ENCRYPTION_KEY` (never reuse development keys)
- Set `NEXTAUTH_URL` to your production URL
- Use production PostgreSQL database URL

### Database Migrations

```bash
# Generate Prisma client
npm run db:generate

# Apply migrations
npm run db:migrate
```

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema changes (dev)
npm run db:migrate     # Create and run migrations
npm run db:studio      # Open Prisma Studio

# Linting
npm run lint
```

## Troubleshooting

### "Harvest connection failed"
- Verify your Account ID and Personal Access Token are correct
- Check that your token hasn't expired
- Ensure you have proper permissions in Harvest

### "Database connection error"
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check database credentials and permissions

### "Encryption key error"
- Ensure ENCRYPTION_KEY is at least 32 characters
- Don't change the key after data is encrypted (you'll lose access to tokens)

## Future Enhancements (Not in MVP)

- Payout period tracking with adjustments
- Multi-user organizations and teams
- Forecasting and projections
- CRM integrations (Salesforce, HubSpot)
- Multi-rep commission splits
- Tiered commission structures
- Mobile app
- Advanced reporting and analytics

## License

MIT

## Support

For issues or questions, please open an issue on GitHub or contact support.

---

Built with ❤️ for agency business development teams who are tired of manual commission tracking in spreadsheets.
