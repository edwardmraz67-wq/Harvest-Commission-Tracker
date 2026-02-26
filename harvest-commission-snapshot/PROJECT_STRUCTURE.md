# Project Structure

## Directory Layout

```
harvest-commission-snapshot/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   ├── [...nextauth]/    # NextAuth handlers
│   │   │   └── register/         # User registration
│   │   ├── commissions/          # Commission data API
│   │   ├── harvest/
│   │   │   └── connection/       # Harvest API connection
│   │   ├── projects/             # Projects API
│   │   ├── rules/                # Commission rules API
│   │   └── sync/
│   │       └── harvest/          # Manual sync endpoint
│   ├── commissions/              # Commissions table page
│   ├── dashboard/                # Main dashboard
│   ├── login/                    # Login page
│   ├── onboarding/
│   │   └── harvest/              # Harvest onboarding flow
│   ├── payouts/                  # Payouts page (stub)
│   ├── projects/                 # Projects management
│   ├── rules/                    # Commission rules CRUD
│   ├── signup/                   # Registration page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home/redirect page
├── components/                   # React components
│   ├── AuthenticatedLayout.tsx   # Authenticated page wrapper
│   └── AuthProvider.tsx          # NextAuth session provider
├── lib/                          # Utility libraries
│   ├── auth/
│   │   ├── auth-options.ts       # NextAuth configuration
│   │   └── encryption.ts         # Token encryption utilities
│   ├── commissions/
│   │   └── calculations.ts       # Commission calculation logic
│   ├── db/
│   │   └── prisma.ts             # Prisma client singleton
│   └── harvest/
│       ├── client.ts             # Harvest API client
│       └── sync.ts               # Sync service
├── prisma/
│   └── schema.prisma             # Database schema
├── types/
│   └── next-auth.d.ts            # NextAuth type definitions
├── .env                          # Environment variables (local)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
├── postcss.config.js             # PostCSS config
├── README.md                     # Full documentation
├── QUICKSTART.md                 # Quick start guide
├── tailwind.config.js            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

## Key Files Explained

### `/app/api/` - API Routes

**Authentication:**
- `auth/[...nextauth]/route.ts` - NextAuth.js handlers (login, logout, session)
- `auth/register/route.ts` - User registration endpoint

**Harvest Integration:**
- `harvest/connection/route.ts` - POST to save credentials, GET to check status
- `sync/harvest/route.ts` - POST to trigger manual data sync

**Data Endpoints:**
- `commissions/route.ts` - GET commission data with optional date filters
- `projects/route.ts` - GET projects, PUT to update rule assignments
- `rules/route.ts` - CRUD operations for commission rules

### `/app/` - Pages

**Public Pages:**
- `login/page.tsx` - Login form
- `signup/page.tsx` - Registration form
- `page.tsx` - Root redirect to login or dashboard

**Onboarding:**
- `onboarding/harvest/page.tsx` - Harvest credential input and initial sync

**Authenticated Pages:**
- `dashboard/page.tsx` - Main commission summary dashboard
- `commissions/page.tsx` - Detailed invoice table with CSV export
- `projects/page.tsx` - Project list with rule assignment
- `rules/page.tsx` - Commission rules management
- `payouts/page.tsx` - Payout tracking (placeholder)

### `/components/`

- `AuthenticatedLayout.tsx` - Navigation wrapper for authenticated pages
- `AuthProvider.tsx` - NextAuth SessionProvider wrapper

### `/lib/` - Business Logic

**Authentication & Security:**
- `auth/auth-options.ts` - NextAuth configuration with credentials provider
- `auth/encryption.ts` - AES-256-GCM encryption for Harvest tokens

**Commission Calculations:**
- `commissions/calculations.ts` - Core commission math, filtering, formatting

**Database:**
- `db/prisma.ts` - Prisma client singleton (prevents multiple instances)

**Harvest API:**
- `harvest/client.ts` - Harvest API wrapper with typed responses
- `harvest/sync.ts` - Sync service that upserts clients, projects, invoices

### `/prisma/`

- `schema.prisma` - Database schema with 8 core models

## Data Flow

### 1. User Registration & Login
```
User → /signup → API: /api/auth/register → DB: User created
User → /login → NextAuth credentials → Session created → /dashboard
```

### 2. Harvest Connection
```
User → /onboarding/harvest → Input credentials
  → API: POST /api/harvest/connection
    → Test Harvest API connection
    → Encrypt & save credentials
    → Create default commission rule (10%)
    → Trigger initial sync
      → Fetch clients, projects, invoices from Harvest
      → Upsert to database
      → Auto-assign projects to default rule
  → Redirect to /dashboard
```

### 3. Viewing Commissions
```
User → /dashboard
  → API: GET /api/commissions?startDate=X&endDate=Y
    → Fetch invoices from DB
    → Filter by date range
    → Get project → rule assignments
    → Calculate commission per invoice
    → Return summary + invoice list
  → Display tiles: Open Commission, Earned Commission
```

### 4. Managing Projects
```
User → /projects
  → API: GET /api/projects (load projects + current assignments)
  → User selects new rule for project
  → API: PUT /api/projects (update assignment)
    → Upsert ProjectRuleAssignment
  → Refresh project list
```

### 5. Manual Sync
```
User → Click "Sync Now"
  → API: POST /api/sync/harvest
    → Get user's encrypted Harvest credentials
    → Fetch latest data from Harvest API
    → Upsert clients, projects, invoices
    → Update lastSyncAt timestamp
  → Show stats: X invoices updated, Y created
```

## Database Schema Summary

### Core Models

1. **User** - Authentication (email, password hash)
2. **HarvestConnection** - Encrypted API credentials per user
3. **Client** - Harvest clients (shared globally)
4. **Project** - Harvest projects linked to clients
5. **Invoice** - Harvest invoices with payment data
6. **CommissionRule** - Custom commission percentages
7. **ProjectRuleAssignment** - Maps projects to rules (user-specific)
8. **PayoutPeriod** - Track payout cycles (future)
9. **PayoutAdjustment** - Manual payout adjustments (future)

### Key Relationships

```
User 1:1 HarvestConnection
User 1:N CommissionRule
User 1:N ProjectRuleAssignment
User 1:N PayoutPeriod

Client 1:N Project
Client 1:N Invoice

Project 1:N ProjectRuleAssignment
CommissionRule 1:N ProjectRuleAssignment

PayoutPeriod 1:N PayoutAdjustment
```

## Security Architecture

### Encryption Layer
- **Harvest tokens**: AES-256-GCM with PBKDF2 key derivation
- **Passwords**: bcrypt with automatic salt
- **Sessions**: JWT with HTTP-only cookies

### Data Isolation
- All queries filtered by `userId` to prevent cross-user access
- Harvest data is globally shared (clients, projects, invoices)
- Assignments and rules are user-specific

### API Protection
- All authenticated routes check session via NextAuth
- Return 401 if no valid session
- Never expose encrypted tokens or raw passwords

## Environment Variables

Required for all environments:

```env
DATABASE_URL          # Prisma database connection
NEXTAUTH_URL          # Base URL for NextAuth
NEXTAUTH_SECRET       # JWT signing secret (32+ chars)
ENCRYPTION_KEY        # Token encryption key (32+ chars)
```

## Development vs Production

**Development:**
- SQLite database (`file:./dev.db`)
- Shorter encryption keys (still secure)
- `npm run dev` with hot reload

**Production:**
- PostgreSQL database (required for Vercel, Railway, etc.)
- Strong, randomly generated keys
- HTTPS enforced
- `npm run build && npm start`

## Extending the Application

### Adding a New Commission Rule Type

1. Update `CommissionRule` model in schema if needed
2. Add UI in `/app/rules/page.tsx`
3. Update calculation logic in `/lib/commissions/calculations.ts`

### Adding a New API Endpoint

1. Create file in `/app/api/your-endpoint/route.ts`
2. Export `GET`, `POST`, `PUT`, or `DELETE` functions
3. Check authentication with `getServerSession(authOptions)`
4. Access database via `prisma` client

### Adding a New Page

1. Create folder in `/app/your-page/`
2. Add `page.tsx` with default export component
3. Wrap with `<AuthenticatedLayout>` if authenticated
4. Add navigation link in `AuthenticatedLayout.tsx`

### Adding Payout Functionality

The schema is ready! You need to:
1. Build UI in `/app/payouts/page.tsx`
2. Create API endpoints for CRUD operations
3. Link invoices to payout periods
4. Update dashboard to show "payable" vs "already paid"

## Testing Strategy (Future)

Recommended testing approach:
- **Unit tests**: Commission calculations, encryption
- **Integration tests**: API routes with test database
- **E2E tests**: Cypress for critical user flows
- **Mock Harvest API**: For sync testing without real data

## Performance Considerations

- Harvest API rate limits: 100 requests/15 seconds
- Pagination: Invoices fetched 100 per page
- Database indexes: On foreign keys and frequently queried fields
- Prisma query optimization: Use `include` sparingly

---

This architecture prioritizes simplicity, security, and maintainability for an MVP. Scale considerations (multi-tenancy, queue-based sync, etc.) can be added as needed.
