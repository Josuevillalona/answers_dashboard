# O'Reilly Answers QA Dashboard

A Next.js 14 full-stack application for triaging AI-generated answer feedback. This is a portfolio/demo project showcasing a B2B internal tools product.

## Tech Stack

- **Frontend**: Next.js 14 App Router + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Next.js API routes (serverless)
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Auth**: Supabase Auth (email/password)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project created
- Vercel account (for deployment)

### 1. Clone and Install

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Get your credentials from Supabase Dashboard → Settings → API

### 3. Run Database Migration

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL Editor and click **Run**

This will create:
- `feedback` table with indexes
- `escalations` table with indexes
- All necessary enum types
- Proper relationships and constraints

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 5. Generate Mock Data (Coming Soon)

```bash
npm run seed
```

This will populate the database with 50-100 realistic feedback items.

## Project Structure

```
app/
├── (auth)/          # Authentication pages (login, register)
├── feedback/        # Main feedback list view
├── escalations/     # Escalations dashboard
├── metrics/         # Basic metrics page
└── api/             # API routes for CRUD operations

components/
├── ui/              # shadcn/ui base components
├── feedback/        # Feedback-specific components
└── escalations/     # Escalation-specific components

lib/
├── supabase/        # Supabase client utilities
├── types/           # TypeScript type definitions
└── utils/           # Shared utilities

supabase/
└── migrations/      # SQL migration files
```

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Run production build locally
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## Features

### MVP (v1.0)
- ✅ Feedback list with filters (rating, status, date range) and search
- ✅ Detail view modal with tagging system
- ✅ Two-step escalation flow (team selection → priority/details)
- ✅ Escalations dashboard with filters and resolution actions
- ✅ Basic metrics page with count tables

### Future Roadmap
- Team-specific dashboards (v2)
- AI-suggested tags (v3)
- Bulk operations (v3)
- SSO integration (v4)
- Jira/Linear integration (v4)

## Database Schema

### Feedback Table
- User queries and AI-generated answers
- Thumbs up/down ratings with optional comments
- Status tracking (open/escalated/closed)
- Issue categorization with tags
- PM notes for internal tracking

### Escalations Table
- Issues routed to Engineering or Editorial teams
- Priority levels (critical/high/medium/low)
- Detailed descriptions and suggested actions
- Resolution tracking with timestamps

## Demo Flow (90 seconds)

1. **Feedback List** - View all user ratings and comments (15s)
2. **Detail View** - See full context: query, answer, sources (15s)
3. **Tagging** - Tag as "Hallucination" and add PM notes (15s)
4. **Escalation** - Escalate to Engineering with priority (20s)
5. **Dashboard** - View escalated items, resolve one (15s)
6. **Metrics** - Show improvement over time (10s)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This is a portfolio/demo project. Not for production use with real O'Reilly data.