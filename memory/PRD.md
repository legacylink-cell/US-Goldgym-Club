# US Gold Gymnastics & Cheer Academy — PRD

## Original Problem Statement
Full-site build for a modern youth Gymnastics & Cheer Academy (reference: usgoldgymclub.com).
Dark near-black (#0E0E10) base, off-white (#F5F4F0) light sections, electric-lime (#D4FF3F) primary
accent, coral-red (#FF4E4E) secondary. Condensed grotesque display headings (Anton), Inter body.
Asymmetric/bento grids, diagonal breaks, parallax hero, magnetic buttons, grain overlay, sticky nav
with persistent "Book Free Trial" CTA. 12 content pages + booking engine, digital waivers, parent
login/membership dashboard, admin dashboard, mobile-first, LocalBusiness structured data. Remove
Emergent badge.

## User Choices
- Booking: custom-built system (own MongoDB, admin views)
- Contact & quote requests: saved to DB + admin dashboard
- Auth: custom email+password JWT
- Design: follow dark+lime system with creative elevation
- Media: high-quality stock imagery

## Architecture
- Backend: FastAPI + MongoDB (motor). JWT httpOnly cookies (SameSite=None, Secure), bcrypt.
  Collections: users, leads, contacts, bookings, events. Admin seeded on startup; 8 events seeded.
- Frontend: React 19 + react-router 7, Tailwind, framer-motion, shadcn/ui, sonner, dayjs.
  AuthContext (cookie session), Layout (Navbar/Footer/grain), reusable MagneticButton/StatCounter/
  Reveal/PageHero, QuoteRequestDialog, BookingDialog (embedded digital waiver).

## Analytics / Business Insights (2026-08-06)
- **Custom first-party analytics** (no third-party account). Frontend `lib/analytics.js` + `AnalyticsTracker` logs pageviews (with load time via Navigation Timing, device type, referrer) and meaningful clicks (program links + key CTAs) via a delegated listener keyed off existing data-testids. Anonymous session id in localStorage.
- **Backend**: `POST /api/analytics/track` (bot/headless/test traffic filtered out; IP→city/state via free ip-api.com with `geo_cache`), `GET /api/admin/analytics?days=7|30|90` (admin-only) aggregates: pageviews, unique visitors, device split, avg load time (web vs mobile), top programs, CTA clicks, visitors by city/state, top pages, top referrers, and a leads/signups/pageviews time series. Added `httpx` to requirements.
- **Admin UI**: new default **"Insights"** tab in `/admin` (`components/admin/AnalyticsPanel.jsx`, recharts) with KPI cards, load-time cards, device donut, traffic/conversion area chart, program & CTA bar charts, and location/pages/referrers tables. Purple+pink themed. No Emergent/testing data shown.
- Verified: track endpoint (bot-filter + real geo), admin aggregation via curl, 401 when unauthenticated, and full dashboard render with live data.

## Rebrand (2026-08-06) — Purple + Pink theme + new logo
- Reworked palette via 4 core tokens in `tailwind.config.js` + `index.css` (cascades site-wide): `ink` #0E0E10→#2C0A4E (deep royal purple, dominant surface), `cream` #F5F4F0→#F4EEFB (light lavender), `lime` #D4FF3F→#FF1D8E (hot pink primary accent — announcement bar, buttons, overlines), `coral` #FF4E4E→#C01C6E (berry pink secondary). Updated shadcn HSL tokens, scrollbar, selection, ErrorBoundary inline colors, Camps alt section, Calendar category colors (no more yellow/red), and index.html theme-color + favicon.
- New logo: `BUSINESS.logo` (US Gym Logo.jpeg badge) shown as a white circular coin in Navbar + Footer, and set as favicon/apple-touch-icon.
- Verified readability on dark + light sections (hero, programs grid, footer, preschool light cards, calendar). Purely presentational change — no functional logic touched.

## Implemented (2026-08-02) — New feature batch
- **Newsletter / Email List**: `POST /api/newsletter` (dedupe), `GET /api/admin/newsletter`, `subscribers` count in admin stats. Footer signup band + reusable `NewsletterSignup` component. Admin dashboard now has 5 stat boxes + "Email List" tab. Saves to `newsletter_subscribers` collection — NO emails sent.
- **Careers page** (`/careers`): Employment Opportunities, 4 real open positions, "Request Application" mailto CTA (staff@usgoldgymclub.com). Linked in footer.
- **Baseball program** (`/baseball`): added to Programs nav dropdown. 3 tracks (Skills, Athletic Development, Private Lessons), Request Pricing + Book Free Trial CTAs.
- **Moving announcement bar**: fixed lime marquee at very top of every page — "Call or Email us to Schedule your FREE Trial Class! 817.491.9996 staff@usgoldgymclub.com".
- **Pro Shop**: informational blurb in footer (in-store only, no online sales).
- **PDF forms**: Enrollment Packet + Waiver linked in footer; Camp Registration, Camp Policies, Little Dog Days sign-up linked on Camps page (uploaded artifact URLs).
- **Camps page rebuilt**: 9 real Summer Fun themed weeks + Little Dog Days camp ($120 members / $130 non-members per session) with real dates from uploaded PDFs.
- Verified: iteration_11 — 27/27 backend, all frontend flows pass.

## Blocked / Waiting on user
- iClassPro portal URL (user does not have it yet) — CTAs route to Contact/Request Pricing for now.
- Real photos/videos + custom domain (deferred to end per user).
- Real Baseball program content (currently sensible placeholder), Home stats, staff details, college alumni.

## Implemented (2026-07-09)
- All 12 pages: Home, About, Preschool, Recreational, Competitive, Cheer, Camps, Special Events,
  Calendar (month/week/list, color-coded, filterable, click-to-register), Birthday Parties (2 tiers +
  add-ons + What's Included + waiver step), College Recruits, Contact (topic dropdown, map, click-to-call).
- Auth: register/login/logout/me/refresh. Parent membership dashboard + Admin dashboard (leads/
  messages/bookings tabs + stats).
- Booking engine with digital waiver required; quote-request ("Request Pricing") flows; contact form.
- LocalBusiness (SportsActivityLocation) JSON-LD, gym-branded title/meta. Emergent badge hidden.
- Verified: 21/21 backend tests, 12/12 frontend flows pass.

## Core Requirements (static)
Marketing site + custom booking + waivers + parent/admin auth dashboards, mobile-first, local SEO.

## Backlog / Remaining
- P1: Silence expected 401 from /auth/me on public pages (console noise only).
- P2: Instagram feed live embed (currently curated image grid linking to IG).
- P2: Brute-force login lockout, booking date validation, admin pagination.
- P2: Payment/deposit collection (Stripe) for party $100 deposits & event fees.
- P2: Migrate FastAPI startup events to lifespan; remove unused CORS_ORIGINS env.

## Next Tasks
Gather feedback on content accuracy, then consider Stripe deposits + email notifications (Resend).
