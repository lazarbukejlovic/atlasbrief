# AtlasBrief

A production-ready travel-readiness and destination intelligence platform for checking where you can go, what it may cost, what changed, and whether a destination fits your trip before booking.

## [Live Demo](https://atlasbrief.vercel.app)
## [Repository](https://github.com/lazarbukejlovic/atlasbrief)

## Overview

AtlasBrief is built for better pre-booking decisions, not itinerary building. It helps travelers evaluate trip-readiness signals, practical cost context, local rules, risk posture, and recent destination changes before committing money to flights or stays.

The product combines authenticated workflows and public discovery surfaces in one experience: saved briefs, watchlist monitoring, alerts, 30-90 day stay planning, compare tools, report previews, and publicly accessible destination dossiers. It is implemented as a full-stack, production-deployed web product with authentication, subscription billing, database-backed persistence, SEO-friendly public pages, and Vercel deployment behavior tuned for SPA refresh routing.

## Why This Project Exists

Travel planning is often fragmented across many tabs and inconsistent sources. Before booking, people usually need answers to a practical set of questions:

- Can I go?
- What will it roughly cost?
- What changed since I last checked?
- Is this destination realistic for my trip length and work style?

AtlasBrief turns that fragmented pre-booking research into a structured readiness workflow.

## Core Features

### Trip Readiness

- Destination readiness signals
- Entry and local-rules reminders
- Cost and budget context
- Safety and risk signals
- Practical local travel notes

### Saved Intelligence

- Supabase-backed saved briefs
- Destination watchlist
- Alerts and change-monitoring UX
- Trust and freshness indicators
- Refresh-safe saved data behavior

### 30-90 Day Stay Planning

- Stay planner route and workflow
- Monthly cost estimate context
- Long-stay feasibility score
- Internet and work-fit guidance
- Housing pressure and practical fit notes
- Healthcare and insurance reminders
- Saved stay plans

### Decision Tools

- Destination compare workflow
- Reports and readiness summaries
- Partner redirect surface
- Traveler profile personalization
- Pro preview and family workspace surface (coming soon)

### Public Discovery Layer

- Public destination dossiers
- SEO metadata support
- Sitemap and robots configuration
- Trust and freshness disclaimers
- Landing-page positioning for readiness-first decisions

### Monetization and Account Layer

- Supabase authentication
- Free and Plus plan behavior
- Stripe Checkout
- Stripe webhook sync
- Stripe Billing Portal
- Account and subscription status views
- Pro checkout intentionally disabled (Coming soon)

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- React Router

### Backend and Platform

- Supabase Auth
- Supabase Postgres
- Row Level Security
- Vercel serverless API routes
- Stripe Checkout
- Stripe Webhooks
- Stripe Billing Portal

### Tooling and Deployment

- Vercel
- GitHub
- ESLint
- npm

## Architecture Highlights

- Clear separation between authenticated and logged-out flows
- Supabase-backed persistence with local fallback patterns where appropriate
- User data guarded through RLS-backed access control
- Stripe subscription lifecycle syncing across checkout, webhook, and account surfaces
- SPA routing behavior configured for Vercel refresh-safe navigation
- Public routes and authenticated routes kept intentionally distinct
- Conservative trust and freshness disclaimer layer across decision points
- Modular page-level features with reusable UI components

## Product Screens

> Screenshots will be added for the final portfolio presentation.

Suggested screenshot set:

- Landing hero
- Dashboard
- Destination dossier
- Saved briefs
- Watchlist
- Stay planner
- Compare
- Reports
- Account and billing

## Local Development

```bash
npm install
npm run dev
npm run build
```

Supabase- and Stripe-backed features require environment variables to be configured locally.

## Environment Variables

Environment variables are documented in `.env.example`.

Frontend and server features rely on Supabase and Stripe configuration values. Keep secrets in local or platform environment settings and never commit real credentials.

## Trust and Data Disclaimer

AtlasBrief provides planning intelligence and productized readiness signals. It is not official legal, immigration, medical, or travel safety advice. Travelers should verify final requirements with official government, airline, insurance, and destination sources before booking or departure.

## Project Status

- Production MVP complete
- Public demo available at (https://atlasbrief.vercel.app)
- Pro tier is preview-only and checkout remains disabled (Coming soon)
- Future direction: official provider integrations, stronger alerting, B2B widgets, and richer destination coverage
