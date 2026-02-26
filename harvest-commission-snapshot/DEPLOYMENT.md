# Deployment Guide

This guide covers deploying Harvest Commission Snapshot to production.

## Pre-Deployment Checklist

- [ ] Test the application locally
- [ ] Generate strong production secrets
- [ ] Set up production database (PostgreSQL)
- [ ] Choose deployment platform
- [ ] Configure environment variables
- [ ] Test Harvest API connection

## Platform Options

### Option 1: Vercel (Recommended for Next.js)

**Pros:**
- Easiest deployment for Next.js
- Automatic HTTPS
- Git integration
- Free tier available
- Built-in analytics

**Cons:**
- Need separate database (use Vercel Postgres or external)
- Function execution limits on free tier

**Steps:**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd harvest-commission-snapshot
   vercel
   ```

4. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project → Settings → Environment Variables
   - Add all variables from `.env.example`
   - Use Vercel Postgres or external PostgreSQL for `DATABASE_URL`

5. **Configure Production Build**
   ```bash
   vercel --prod
   ```

### Option 2: Railway

**Pros:**
- Includes PostgreSQL database
- Simple pricing
- GitHub integration
- Environment variable management

**Steps:**

1. **Create Railway Account** at railway.app

2. **Create New Project** → "Deploy from GitHub repo"

3. **Add PostgreSQL Database**:
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will set `DATABASE_URL` automatically

4. **Set Environment Variables**:
   - Go to project → Variables
   - Add `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `ENCRYPTION_KEY`

5. **Deploy**:
   - Railway auto-deploys on git push

### Option 3: Render

**Pros:**
- Free tier with PostgreSQL
- Simple dashboard
- Auto-deploy from Git

**Steps:**

1. **Create Account** at render.com

2. **Create PostgreSQL Database**:
   - New → PostgreSQL
   - Note the connection string

3. **Create Web Service**:
   - New → Web Service
   - Connect your Git repo
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`

4. **Set Environment Variables** in dashboard

5. **Deploy** automatically on git push

## Environment Variables for Production

Generate strong secrets:

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate ENCRYPTION_KEY
openssl rand -base64 32
```

Set these in your platform:

```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname?schema=public"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="<generated-secret>"
ENCRYPTION_KEY="<generated-secret>"
```

⚠️ **Important**: Never reuse development keys in production!

## Database Setup

### Update Schema for PostgreSQL

In `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Run Migrations

```bash
npx prisma generate
npx prisma migrate deploy
```

Or use `prisma db push` for initial setup:

```bash
npx prisma db push
```

## Build Configuration

Ensure your `package.json` has correct build script:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "start": "next start"
  }
}
```

## Post-Deployment

### 1. Test the Application

- Visit your deployed URL
- Create a test account
- Connect to Harvest
- Verify data sync works
- Test all pages

### 2. Set Up Monitoring

**Recommended tools:**
- Vercel Analytics (built-in on Vercel)
- Sentry for error tracking
- Uptime monitoring (UptimeRobot, Pingdom)

### 3. Backup Strategy

**Database Backups:**
- Vercel Postgres: Automatic daily backups
- Railway: Automatic backups included
- Render: Automatic backups on paid plans

**Manual Backup:**
```bash
pg_dump $DATABASE_URL > backup.sql
```

## Security Best Practices

### 1. HTTPS Only
All platforms provide HTTPS by default. Ensure `NEXTAUTH_URL` uses `https://`.

### 2. Environment Variables
- Never commit `.env` to Git
- Use platform secret management
- Rotate keys periodically

### 3. Database Security
- Use strong database passwords
- Restrict database access to your app only
- Enable SSL connections if available

### 4. Rate Limiting
Consider adding rate limiting for API routes:

```typescript
// Example using vercel/edge
import { next } from '@vercel/edge'
import { Ratelimit } from '@upstash/ratelimit'
```

## Scaling Considerations

### Performance Optimization

1. **Database Indexes**: Already included in schema
2. **Edge Caching**: Use Vercel Edge for static assets
3. **API Optimization**: Consider caching Harvest data

### When to Scale

Current architecture supports:
- 100+ users comfortably
- 10,000+ invoices
- Hourly sync schedules

If you need more:
- Add Redis for caching
- Implement background job queues (Bull, Inngest)
- Consider read replicas for database

## Troubleshooting

### Build Failures

**"Module not found"**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**"Prisma Client not found"**
```bash
# Ensure prisma generate runs in build
npx prisma generate
```

### Runtime Errors

**"Database connection failed"**
- Verify `DATABASE_URL` is correct
- Check database is running and accessible
- Ensure SSL mode is correct (`?sslmode=require`)

**"NextAuth configuration error"**
- Verify `NEXTAUTH_URL` matches your domain
- Check `NEXTAUTH_SECRET` is set
- Ensure cookies are enabled

### Harvest API Issues

**"Rate limit exceeded"**
- Implement exponential backoff
- Reduce sync frequency
- Cache data when possible

**"Invalid credentials"**
- User may need to reconnect
- Check token hasn't been revoked in Harvest

## Maintenance

### Regular Tasks

**Weekly:**
- Monitor error logs
- Check sync success rates
- Review user feedback

**Monthly:**
- Database cleanup (old deleted records)
- Update dependencies: `npm update`
- Security audit: `npm audit`

**Quarterly:**
- Review and rotate secrets
- Database optimization
- Feature usage analysis

### Updating the Application

1. **Local Development**
   ```bash
   git pull origin main
   npm install
   npx prisma generate
   npm run dev  # Test locally
   ```

2. **Deploy Update**
   ```bash
   git push origin main  # Auto-deploys on most platforms
   ```

3. **Database Migrations**
   ```bash
   npx prisma migrate deploy
   ```

## Cost Estimation

### Vercel + Postgres
- Hobby (Free): Good for testing
- Pro ($20/mo): Production ready
- Postgres: $10-50/mo depending on size

### Railway
- Starter ($5/mo): Includes PostgreSQL
- Developer ($20/mo): More resources

### Render
- Free: 750 hours/mo + PostgreSQL
- Starter ($7/mo): Always on

## Support & Monitoring

### Set Up Alerts

**Database:**
- Storage > 80%
- Connection pool saturation
- Slow queries

**Application:**
- Error rate > 1%
- Response time > 2s
- Failed Harvest syncs

### Logging

Use structured logging:
```typescript
console.error({
  timestamp: new Date(),
  level: 'error',
  message: 'Sync failed',
  userId: user.id,
  error: error.message
})
```

Consider log aggregation:
- Vercel: Built-in logging
- External: Logtail, Papertrail

## Rollback Plan

If deployment fails:

1. **Vercel**: Revert to previous deployment in dashboard
2. **Railway**: Rollback in deployment history
3. **Render**: Redeploy previous commit

For database issues:
```bash
# Restore from backup
psql $DATABASE_URL < backup.sql
```

---

## Quick Reference

**Pre-Deploy:**
```bash
npm install
npx prisma generate
npm run build
npm start  # Test production build locally
```

**Deploy:**
- Push to Git (auto-deploys)
- Or use platform CLI

**Post-Deploy:**
- Run migrations if needed
- Test all features
- Monitor logs

**Emergency:**
- Check platform status page
- Review error logs
- Rollback if necessary

---

Need help? Check platform documentation:
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
