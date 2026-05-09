# AtlasBrief

A production-deployed travel-readiness and destination intelligence platform for evaluating destination fit, cost pressure, risk context, and what changed before booking.

- **Live Demo:** https://atlasbrief.vercel.app
- **Repository:** https://github.com/lazarbukejlovic/atlasbrief

## At A Glance

- Live production demo
- Supabase Auth
- Stripe Plus billing
- Saved briefs and watchlist
- 30-90 day stay planner
- Public destination dossiers
- Reports, alerts, compare, profile, and partner redirect surfaces
- Vercel SPA refresh-safe deployment

## Overview

AtlasBrief is built around one practical pre-booking question: Is this destination actually practical before I commit money?

It combines public discovery pages (landing, dossiers, SEO-facing surfaces) with authenticated workflows (saved intelligence, monitoring, planning, account, and billing). AtlasBrief is implemented as a full-stack product layer with authentication, subscription billing, database-backed persistence, refresh-safe route deployment, and trust/freshness disclaimers at key decision points.

The goal is not to overclaim official-source authority. The product is designed to help travelers structure pre-booking readiness decisions clearly and conservatively.

## Why This Project Exists

Travel planning is fragmented across tabs, inconsistent sources, and constantly changing destination conditions.

Before booking, travelers usually need answers to:

- Can I go?
- What will it roughly cost?
- What changed since I last checked?
- Is this realistic for my trip length, budget, and work style?

AtlasBrief turns that scattered pre-booking research into a structured readiness workflow.

## Core Features

| Area | What it includes |
| --- | --- |
| Trip Readiness | Destination readiness signals, entry/rules reminders, cost posture, safety/risk context, and practical local travel notes before booking. |
| Saved Intelligence | Supabase-backed saved briefs, destination watchlist, alerts and change-monitoring UX, trust/freshness indicators, and refresh-safe saved data behavior. |
| 30-90 Day Stay Planning | Stay planner flow with monthly cost estimation, long-stay feasibility scoring, internet/work fit guidance, housing pressure context, healthcare/insurance reminders, and saved stay plans. |
| Decision Tools | Destination compare, readiness report surfaces, traveler profile personalization, partner redirects, and Pro preview/family workspace surfaces. |
| Public Discovery Layer | Public destination dossiers, SEO metadata, sitemap/robots support, trust/freshness disclaimers, and readiness-first landing positioning. |
| Monetization and Account Layer | Supabase auth, Free/Plus behavior, Stripe Checkout, webhook sync, Billing Portal, account subscription status surfaces, and Pro tier checkout disabled (Coming soon). |

## What This Project Demonstrates

- Full-stack product architecture beyond a static UI
- Authenticated and logged-out user flows
- Supabase-backed persistence with RLS
- Stripe Checkout, webhook sync, and billing portal integration
- Production-safe Vercel deployment with SPA refresh routing
- Public SEO-style product surfaces
- Trust/freshness and disclaimer handling for sensitive travel-readiness information
- Product thinking across Free, Plus, and future Pro tiers

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

- Supabase-backed user data with RLS
- Stripe lifecycle sync across checkout, webhook, account, and billing portal surfaces
- Public and authenticated route separation
- Local fallback behavior where appropriate
- Refresh-safe SPA routing on Vercel
- Modular feature pages and reusable UI patterns
- Conservative trust and freshness layer across decision points

## Product Screens

> Final screenshots will be added for portfolio presentation.

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
- Public demo deployed
- Plus billing flow implemented
- Pro tier preview-only (Coming soon)
- Future direction: official provider integrations, richer alerting, broader destination coverage, and B2B/widget surfaces
