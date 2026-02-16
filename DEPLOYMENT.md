# Deployment Guide - Bellas Glamour

## 🚀 Production Deployment

### Prerequisites

- Vercel account (recommended) or Node.js hosting
- PostgreSQL database (production) or continue with SQLite
- Stripe account for payments
- Supabase or AWS S3 for file storage

### Step 1: Database Setup

#### Option A: SQLite (Development/Small Scale)
```bash
# Already configured in schema.prisma
DATABASE_URL="file:./db/custom.db"
```

#### Option B: PostgreSQL (Production)
1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Set `DATABASE_URL` to your PostgreSQL connection string.

3. Run migrations:
```bash
bunx prisma migrate deploy
```

### Step 2: Environment Variables

Set these in your hosting platform:

```bash
# Required
DATABASE_URL="your-database-url"
JWT_SECRET="your-32-char-secret"
NEXTAUTH_SECRET="your-nextauth-secret"

# Payments
STRIPE_SECRET_KEY="sk_live_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# Storage
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="xxx"

# Optional
REDIS_URL="redis://xxx"
```

### Step 3: Build & Deploy

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
CMD ["npm", "start"]
```

### Step 4: Post-Deployment

1. **Run database migrations:**
   ```bash
   bunx prisma migrate deploy
   ```

2. **Create admin user:**
   ```bash
   bunx prisma studio
   # Or via seed script
   ```

3. **Configure Stripe webhooks:**
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events: `payment_intent.*`, `customer.subscription.*`, `invoice.*`

4. **Set up monitoring:**
   - Enable Vercel Analytics
   - Configure error tracking (Sentry)

## 🔒 Security Checklist

- [ ] All secrets stored in environment variables
- [ ] HTTPS enforced
- [ ] Rate limiting enabled
- [ ] CSP headers configured
- [ ] Database backups scheduled
- [ ] Error monitoring active

## 📊 Performance Optimization

### Caching
```typescript
// Enable Redis caching
REDIS_URL="redis://your-redis-instance"
```

### CDN
- Use Vercel's Edge Network or CloudFront
- Configure cache headers for static assets

### Database
- Enable connection pooling (PgBouncer)
- Add indexes for frequently queried fields

## 🔄 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx prisma generate
      - run: npm run build
      - run: npm run test
      - uses: vercel/deploy@v1
```

## 🚨 Monitoring & Alerts

### Health Check Endpoint
```
GET /api/health
```

### Log Aggregation
- Configure Vercel Log Drain
- Or use external service (Datadog, LogDNA)

### Alerting Rules
- Error rate > 1%
- Response time > 2s
- Database connection failures

---

For issues or questions, contact the development team.
