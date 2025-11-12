# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**O'Reilly Answers QA Dashboard** - A portfolio/demo project demonstrating a B2B internal tools product for triaging AI-generated answer feedback.

This is a Next.js 15 full-stack application with TypeScript, Supabase (PostgreSQL), and shadcn/ui components. The project uses **100% mock data** (no real O'Reilly integration) and was designed to be demo-ready in 3 weeks.

**Status: ✅ MVP COMPLETE - All core features implemented and functional**

## Tech Stack

- **Frontend**: Next.js 15 App Router + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Next.js API routes (serverless)
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Auth**: Supabase Auth with email/password

## Architecture

### High-Level Structure

```
app/
├── (auth)/          # Authentication pages (login, register)
├── feedback/        # Main feedback list view
├── escalations/     # Escalations dashboard
├── metrics/         # Basic metrics page
└── api/             # API routes for CRUD operations

components/
├── ui/              # shadcn/ui base components
├── feedback/        # Feedback-specific components (DetailModal, EscalationModal, etc.)
├── escalations/     # Escalation-specific components (EscalationDetailModal, etc.)
├── metrics/         # Metrics components (TimeRangeSelector)
└── nav.tsx          # Shared navigation component

lib/
├── supabase/        # Supabase client and utilities
├── types/           # TypeScript type definitions
└── utils/           # Shared utilities

scripts/
└── seed.ts          # Mock data generation script
```

### Database Schema

**feedback table:**
- `id` (uuid, primary key)
- `query` (text) - User's original question
- `answer` (text) - AI-generated answer
- `sources` (jsonb) - Array of cited sources
- `rating` (boolean) - true = thumbs up, false = thumbs down
- `user_comment` (text, nullable) - Optional user feedback
- `status` (enum: 'open' | 'escalated' | 'closed')
- `tag` (enum: 'hallucination' | 'outdated_content' | 'wrong_context' | 'poor_ux' | 'source_misinterpretation' | 'correct_answer', nullable)
- `pm_notes` (text, nullable, max 255 chars)
- `created_at` (timestamp)

**escalations table:**
- `id` (uuid, primary key)
- `feedback_id` (uuid, foreign key → feedback.id)
- `team` (enum: 'engineering' | 'editorial')
- `priority` (enum: 'critical' | 'high' | 'medium' | 'low')
- `summary` (text, max 100 chars)
- `details` (text, max 500 chars)
- `suggested_action` (text, max 200 chars, nullable)
- `status` (enum: 'open' | 'closed')
- `resolution_notes` (text, nullable)
- `created_at` (timestamp)
- `resolved_at` (timestamp, nullable)

**Indexes:** status, rating, created_at, team, priority

## Development Commands

Once the project is initialized:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Generate and seed mock data
npm run seed

# Type checking
npm run type-check

# Linting
npm run lint
```

## Core MVP Features (Demo Flow)

1. **Feedback List Page** (`/feedback`)
   - Paginated list (50/page)
   - Filters: rating, status, date range
   - Search: query text and comments
   - Click → opens detail modal

2. **Detail View Modal** (component)
   - Display: query, answer, sources, timestamp
   - Actions: Tag dropdown, PM notes input, Save/Escalate/Close buttons

3. **Escalation Flow** (2-step modal)
   - Step 1: Select team (Engineering/Editorial)
   - Step 2: Set priority + summary + details + suggested action
   - Auto-includes all context from original feedback

4. **Escalations Dashboard** (`/escalations`)
   - Unified view of all escalations
   - Filters: team, priority, status
   - Sort: priority desc, date asc
   - Actions: View details, Mark closed, Reopen

5. **Metrics Page** (`/metrics`)
   - Simple count tables (no charts in MVP)
   - Time ranges: 7d/30d/90d
   - Metrics: total feedback, thumbs down %, issues by category, escalations by team, avg resolution time

## Key Architectural Decisions

- **No real-time sync**: Static mock dataset with realistic timestamps (simpler for demo)
- **No SSO**: Simple auth sufficient for portfolio demo
- **Separate database**: Demonstrates production-ready pattern even though we're using mock data
- **Server components by default**: Use Next.js 14 App Router conventions
- **API routes for mutations**: Client components call API routes for all data modifications
- **Optimistic UI updates**: Show immediate feedback, revalidate in background

## Mock Data Strategy

Currently generates 24 realistic feedback items via seed script with:
- Mix of thumbs up/down (50/50 ratio - 12 positive, 12 negative)
- Variety of issue types across categories (hallucination, outdated content, wrong context, etc.)
- Realistic O'Reilly queries (JavaScript, Docker, AWS, Python, React, PostgreSQL, etc.)
- 12 pre-existing escalations (6 Engineering, 6 Editorial, 5 resolved, 7 open)
- Timestamps evenly spread across last 90 days
- Run `npm run seed` to regenerate data

## Component Conventions

- Use shadcn/ui for all base components (Button, Dialog, Select, etc.)
- Server Components by default, Client Components only when needed (interactivity, hooks)
- Modals/dialogs use shadcn/ui Dialog component
- Forms use controlled components with React Hook Form
- Loading states use Suspense boundaries
- Error states use error.tsx boundaries

## API Route Patterns

**Implemented Routes:**
```typescript
// GET /api/feedback/[id] - Fetch single feedback item
// PATCH /api/feedback/[id] - Update (tag, pm_notes, status)

// GET /api/escalations - List escalations with filters (team, priority, status)
// POST /api/escalations - Create new escalation
// GET /api/escalations/[id] - Fetch single escalation with feedback
// PATCH /api/escalations/[id] - Update status/resolution_notes
```

All routes:
- Return JSON with standard HTTP status codes
- Require authentication (check user session)
- Validate inputs before database operations
- Handle errors gracefully with descriptive messages

## Supabase Setup

1. Create Supabase project
2. Run `supabase/migrations/001_initial_schema.sql` in Supabase SQL Editor
3. Add credentials to `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Run `npm run seed` to populate with mock data
5. Email confirmation is disabled in Supabase Auth settings for demo

## Demo Preparation

The 90-second demo flow:
1. Show feedback list (15s)
2. Open detail view, show full context (15s)
3. Tag as "Hallucination", add PM notes (15s)
4. Escalate to Engineering with priority (20s)
5. Navigate to escalations dashboard, show filtered view, resolve item (15s)
6. Show metrics page with counts (10s)

Ensure all interactions are smooth, no loading spinners during demo if possible (pre-warm data).

## Non-Goals (See Future Roadmap in PRD)

- Team-specific dashboards (V2)
- AI-suggested tags (V3)
- Bulk operations (V3)
- SSO integration (V4)
- Jira/Linear integration (V4)
- Real-time updates (V4)
- Advanced charts/visualizations (V4)

## Important Files

- `O'Reilly Product PRD.md` - Complete product specification, problem framing, and roadmap
- `README.md` - Project setup and installation instructions
- `.env.local` - Supabase credentials (gitignored, use `.env.example` as template)
- `supabase/migrations/001_initial_schema.sql` - Database schema and indexes
- `scripts/seed.ts` - Mock data generator

## Deployment Checklist

Before deploying to Vercel:
1. ✅ Production build passes (`npm run build`)
2. ✅ All TypeScript types valid
3. ✅ Database schema created in Supabase
4. ✅ Mock data seeded
5. ⏳ Environment variables added to Vercel
6. ⏳ Email confirmation disabled in Supabase Auth settings
