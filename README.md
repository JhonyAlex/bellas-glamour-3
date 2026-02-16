# Bellas Glamour - Premium Adult Content Platform

A sophisticated, premium adult content platform built with Next.js 16, featuring age verification, model profiles, subscription management, and admin moderation.

## 🌟 Features

### User Features
- **Age Verification System (AVS)**: Full-screen age gate with cookie-based verification
- **Model Discovery**: Browse and search models with advanced filters
- **Premium Content Paywall**: Subscription-based content access
- **Responsive Design**: Mobile-first approach with elegant dark theme

### Model Dashboard
- **Analytics Dashboard**: View subscribers, earnings, views, and engagement
- **Content Management**: Upload and manage photos and videos
- **Earnings Tracking**: Real-time earnings and payout management

### Admin Panel
- **Model Verification**: Review and approve model applications
- **Content Moderation**: Approve, reject, or flag content
- **User Management**: Ban, suspend, or manage users
- **Compliance Dashboard**: 2257 records, DMCA takedowns, audit logs

### Technical Features
- **Row-Level Security**: Secure data access patterns
- **Audit Logging**: Complete action tracking for compliance
- **Rate Limiting**: Protection against abuse
- **Geoblocking**: Country-based access restrictions

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Animations**: Framer Motion
- **Database**: SQLite (Prisma ORM)
- **Authentication**: JWT-based with secure cookies
- **Fonts**: Inter (sans-serif) + Playfair Display (serif)

## 📁 Project Structure

```
/bellas-glamour
├── prisma/
│   └── schema.prisma          # Complete database schema
├── src/
│   ├── app/
│   │   ├── actions/           # Server Actions
│   │   │   ├── auth.ts
│   │   │   ├── models.ts
│   │   │   ├── media.ts
│   │   │   └── subscriptions.ts
│   │   ├── api/
│   │   │   ├── age-verification/
│   │   │   ├── health/
│   │   │   ├── models/
│   │   │   └── webhooks/stripe/
│   │   ├── globals.css        # Luxury theme styles
│   │   ├── layout.tsx         # Root layout with fonts
│   │   └── page.tsx           # Main application page
│   ├── components/
│   │   ├── admin/
│   │   ├── layout/
│   │   ├── models/
│   │   ├── providers/
│   │   └── ui/
│   ├── lib/
│   │   ├── constants.ts
│   │   ├── db.ts
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts
│   └── middleware.ts          # Security & rate limiting
└── .env.example               # Environment variables template
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm

### Installation

1. **Clone and install dependencies:**
   ```bash
   bun install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

3. **Initialize the database:**
   ```bash
   bunx prisma generate
   bunx prisma db push
   ```

4. **Run the development server:**
   ```bash
   bun run dev
   ```

5. **Open http://localhost:3000** in your browser.

### Available Scripts

```bash
bun run dev      # Start development server
bun run build    # Build for production
bun run lint     # Run ESLint
bun run db:push  # Push schema changes to database
```

## 🎨 Design System

### Colors

| Name | Hex | Usage |
|------|-----|-------|
| Gold | `#D4AF37` | Primary accent, CTAs |
| Gold Light | `#F5D76E` | Hover states |
| Black | `#0A0A0A` | Background |
| Dark Gray | `#1A1A1A` | Cards |
| Medium Gray | `#2A2A2A` | Inputs |
| White Smoke | `#F5F5F5` | Text |
| Accent Red | `#8B0000` | Premium/Destructive |

### Typography

- **Titles**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

## 🔐 Security Features

### Age Verification
- Full-screen modal (non-dismissible)
- Date of birth validation
- Cookie-based verification (30 days)
- 18 U.S.C. 2257 compliant

### Content Protection
- Dynamic watermarking support
- EXIF data removal
- Signed URLs with expiration
- Right-click protection

### Rate Limiting
- API: 60 requests/minute
- Uploads: 50/hour
- Login attempts: 10/hour

## 📊 Database Schema

### Core Tables
- **Users**: Authentication and roles
- **Profiles**: Model information
- **Media**: Content storage
- **Subscriptions**: User subscriptions
- **Transactions**: Payment records
- **AuditLogs**: Action tracking
- **AgeVerificationLogs**: 2257 compliance

## 🔧 Configuration

### Environment Variables

See `.env.example` for all available options:

- `DATABASE_URL` - SQLite connection
- `JWT_SECRET` - Session token secret
- `STRIPE_*` - Payment processing
- `SUPABASE_*` - File storage
- `REDIS_URL` - Caching (optional)

## 📝 License & Compliance

- **18 U.S.C. 2257**: Records keeping requirements
- **GDPR**: Data protection compliance
- **DMCA**: Takedown procedures
- **DSA**: Digital Services Act (EU)

## 🤝 Contributing

This is a private repository. Contact the development team for contribution guidelines.

---

© 2025 Bellas Glamour. All rights reserved.
