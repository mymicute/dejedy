## Project Summary
realmiweb is a full-scale, modern real estate e-commerce platform localized for the Nigerian market, connecting buyers, renters, property owners, and real estate professionals. It features role-based accounts, advanced AI-powered property search, interactive maps, real-time messaging, and secure digital transactions (Naira-based) for a unified marketplace experience.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Lucide React, Framer Motion
- **Backend/Database**: Supabase (Auth, PostgreSQL, Storage, Realtime)
- **Payments**: Stripe (Deposits, Rent, Subscriptions - localized for NGN)
- **Map Integration**: Leaflet / Mapbox
- **State Management**: React Context / TanStack Query

## Architecture
- `src/app`: Next.js App Router for all routes (auth, browse, property, dashboard)
- `src/components`: UI components, layout, property-specific and dashboard-specific logic
- `src/lib`: Supabase client, utility functions, hooks
- `src/types`: TypeScript definitions for database and application state

## User Preferences
- **Design**: Unique, modern, and distinctive UI (avoiding "AI slop" aesthetic)
- **Market**: Nigerian Real Estate (Lagos, Abuja, Lekki, etc.)
- **Currency**: Nigerian Naira (₦)
- **Features**: AI-powered recommendations, AR/VR tours, mortgage calculators (Nigerian interest rates), real-time communication

## Project Guidelines
- Use modern Next.js 15 patterns
- Ensure extreme mobile responsiveness (PWA style)
- Maintain role-based access control (Buyer, Agent, Admin)
- Follow secure coding practices for payments and document handling

## Common Patterns
- **Database**: Use Supabase for all data persistence
- **Auth**: Supabase Auth for identity management
- **Components**: Functional components with Tailwind CSS for styling
- **Mobile**: Single column layouts on mobile, optimized touch targets
