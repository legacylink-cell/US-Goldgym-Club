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

## Performance optimizations (2026-08-06)
- Fonts: removed render-blocking `@import` from index.css; moved to async `<link rel=preload as=style onload=swap>` in index.html; dropped unused **Archivo** family and trimmed Inter weights (400/600/700/800). Anton + Inter only.
- LCP: hero `<img>` in PageHero.jsx + Home.jsx now `fetchPriority="high" decoding="async"` (camelCase for React 19).
- Lazy-loading: all non-hero `<img>` across pages got `loading="lazy" decoding="async"` (Home spotlight/tiles/coach/IG + all subpages).
- JSON-LD `url` updated to https://www.usgoldgymclub.com.
- Verified: testing_agent iteration_12 = 100% frontend pass, 0 broken images (62 total, 14 lazy on home), Anton/Inter apply, contact submits, nav works, no regressions. Note: 401s from platform PostHog are pre-existing/not app-functional.
- NOTE: run PageSpeed again AFTER Re-publish (PSI tests the live domain).

## Image remap fix + Roanoke wording (2026-08-06)
- Copy had shuffled two assets: `bars.jpg` actually holds the coach+kids photo, `floor-teen.jpg` holds teen-bars. Remapped IMG keys: `handstand`→floor-teen.jpg (teen bars), `coach`→bars.jpg (real coach photo). College Recruits alumni + Careers/About now show correct older-athlete/coach imagery.
- Replaced all "DFW" copy with "Roanoke & surrounding towns" (Home paragraph, About paragraph, Footer location line).

## Real photos + mobile call CTA (2026-08-06)
- Replaced 7 stock placeholder images in `IMG` (site.js) with the owner's real optimized gym photos (public/assets, EXIF-rotated, resized to 1600px / 130-390KB): heroVault→floor-teen, beamHandstand→beam, floorJump→floor-kid, preschoolBeam→vault-kid, handstand→bars, preschoolGroup→team-huddle, coach→coach. No duplicates. Chose only the pro-quality, correctly-oriented shots; skipped sideways/casual phone snaps.
- Still placeholders (no fitting real photo yet): cheer*, birthday, facility*, baseball, preschoolMat, preschoolPlay.
- Mobile-first: added `MobileCallBar` (always-on sticky "Call Us — phone" bar, `md:hidden` fixed bottom) in Layout; added `pb-16 md:pb-0` to main so content clears it.

## Admin Reset Data (2026-08-06)
- `POST /api/admin/reset-data` (admin-only) wipes analytics_events, geo_cache, leads, contacts, newsletter_subscribers, bookings, client_errors, and all non-admin users. Preserves admin accounts + calendar events. Returns deleted counts.
- Admin dashboard: "Reset All Data" danger button (rose) with an AlertDialog confirm ("Yes, delete everything"). Refetches stats after reset.
- Verified: preview reset → all stats 0, events preserved (8), admin login still 200.
- NOTE: production has its own DB; user must Re-publish then click Reset on the live admin to clear prod.

## Analytics admin-page exclusion + CSV export (2026-08-06)
- **Reports exclude admin/auth pages**: added `not_admin_path` regex filter (`^/(admin|login|register|dashboard)`) to `pv_match` (drives pageviews, unique visitors, top pages, exit pages, location, peak, load, device) and the scroll-depth match. Also recomputed unique visitors from public pageviews only. Removes lingering historical `/login`, `/admin`, `/dashboard` rows from the dashboard.
- **CSV export**: `GET /api/admin/export/{leads|contacts|subscribers}` (admin-only) streams a `text/csv` attachment. Admin dashboard has an "Export CSV" toolbar (Leads / Messages / Subscribers) that downloads via blob.
- Verified: analytics paths now only public ('/', '/preschool', '/cheer'); CSV 200 + headers/rows via curl; buttons render.

## Admin light theme, exclusion, parent-tile removal, homepage spotlight (2026-08-06)
- **Admin exclusion**: `setAnalyticsEnabled` gate in analytics.js; `AnalyticsTracker` disables ALL tracking (pageviews/scroll/clicks) when logged-in user is admin, and never tracks /admin|/login|/register|/dashboard. Waits for `checked` before first event.
- **Admin light theme**: dashboard body now `bg-cream` (light lavender) with white cards + dark text; header kept dark (#1E0838). Rewrote AdminDashboard + AnalyticsPanel for light (charts axes/tooltips/grid, tables, funnel, heatmap all light-readable).
- **Removed** the "Parent Accounts" stat tile (parent logins are off) → 4 tiles.
- **Best-Program Spotlight**: public `GET /api/top-program` (best-converting w/ min 3 views, else most-popular, else default). Homepage `ProgramSpotlight` band above the program grid auto-highlights it with Explore + Book Free Trial CTAs.
- Verified: /top-program curl, admin light + spotlight screenshots.

## Admin standalone shell + Funnel-by-Program + Drop alerts (2026-08-06)
- **Standalone admin view**: moved `/admin` (and `/dashboard`) OUT of the public Layout — no announcement bar, navbar, or footer. Added a slim admin header (logo + "Admin Panel") with a **Logout** button (`admin-logout`) that clears the session and redirects to `/login`. Verified logout + auth guard end-to-end.
- **Funnel by Program**: backend `funnel_by_program` (session attribution: viewed → clicked trial/pricing → submitted, with conv %). New "Trial Funnel by Program" table in Insights.
- **Alert on Drop**: backend `alerts` compares this week vs last week; warns when trial/pricing submissions drop ≥30% (min 2 prior) or leads drop ≥40% (min 3 prior). Amber banner at top of Insights.
- Verified via curl (funnel_by_program, alerts) + screenshots (standalone admin, logout redirect).

## Analytics — Trial Funnel, Period Comparison + Admin-only login (2026-08-06)
- **Login rebranded to Admin**: `/login` now reads "Admin Login" / "Sign in to your website dashboard"; removed parent wording + "Create an account" link. No parent login is visible anywhere public (nav entry stays hidden via SHOW_PARENT_LOGIN=false; `/register` route unlinked). Admin reaches dashboard via `/login` → `/admin`.
- **Trial Funnel**: new client `conversion` events on Contact + Quote form submit. Backend returns `funnel` = distinct sessions at: Viewed a Program → Clicked Book Trial/Request Pricing → Submitted a Request. Dashboard shows gradient funnel bars with continued/drop %.
- **Compare Periods**: backend returns `totals_prev` (same window immediately before). KPI cards show ▲/▼ % vs previous period (emerald up / rose down).
- Verified: funnel 4→2→1 + totals_prev via curl; login + dashboard via screenshots.

## Analytics — Peak Times, Scroll Depth, Exit Pages (2026-08-06)
- Extended tracking: pageviews now send visitor local `hour`/`dow`; new `scroll` events send max scroll depth % per page (flushed on route change / tab hide / pagehide).
- Backend `/api/admin/analytics` now also returns: `peak_times` (day-of-week × hour matrix), `scroll_depth` (avg depth, % reached end, samples per page), and `exit_pages` (last page per session).
- Admin Insights tab: added a 7×24 **Peak Times heatmap** (pink intensity), **Scroll Depth** bars per program page, and an **Exit Pages** table. Verified via curl + dashboard screenshots.
- Admin credentials live in `/app/memory/test_credentials.md`: admin@usgoldgym.com / GymAdmin2026!

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
- P2: Instagram feed live embed (currently curated image grid linking to IG).
- P2: Brute-force login lockout, booking date validation, admin pagination.
- P2: Payment/deposit collection (Stripe) for party $100 deposits & event fees.
- P2: Migrate FastAPI startup events to lifespan; remove unused CORS_ORIGINS env.

## Next Tasks
Gather feedback on content accuracy, then consider Stripe deposits + email notifications (Resend).

## Changelog — 2026-06 (Lighthouse / SEO optimization pass)
- SEO 92 -> 100: added public/robots.txt (with sitemap ref, admin/auth disallowed), public/sitemap.xml
  (14 routes), public/llms.txt (agentic browsing), and a dynamic self-referential canonical link set
  per route in App.js ScrollToTop.
- Accessibility 88 -> 100 (desktop + mobile): fixed all colour-contrast failures by adding tailwind
  colour `pinklt: #FF7AB5` for small pink text on dark backgrounds (Footer + Home), raising
  text-white/40 -> /60, text-ink/70 -> text-ink on pink stat band; added aria-labels to footer social
  icon links; testimonial carousel dots now sit inside 32-36px tap-target buttons.
- Performance (desktop 61 -> ~94 local Lighthouse): re-encoded all gym photos to WebP at sane sizes
  (bars 308KB->84KB, floor-teen 156KB->36KB, coach 391KB->121KB, team-huddle 270KB->59KB etc.),
  logo now local /assets/logo-240.webp (was 919x919 JPEG from CDN), Unsplash URLs now fm=webp&q=70&w=900,
  hero image preloaded (fetchpriority high), preconnect to images.unsplash.com,
  all routes except Home converted to React.lazy + Suspense (main bundle 350KB -> 217KB gzip, recharts
  admin code split into its own chunk).
- Best Practices 96 -> 100: AuthContext no longer calls /api/auth/me for anonymous visitors
  (localStorage `usg_session` flag set on login/register, cleared on logout) -> no more 401 console error.
- Verified by testing agent: /app/test_reports/iteration_13.json — 100% frontend pass (13 lazy routes,
  carousels, admin login/reload/logout, contact form, static SEO files).
- Note: remaining Lighthouse deductions are platform-side (PostHog/emergent scripts ~450ms TBT,
  5-minute asset cache TTL) and not controllable from app code.

## Changelog — 2026-06 (Analytics: Texas-only local market)
- User decision: this is a Roanoke, TX gym, so out-of-market traffic is noise. Every admin analytics KPI
  now counts Texas visitors only.
- backend/server.py: new `LOCAL_STATE = "Texas"` + `local_market_filter(since)` helper. It collects
  session_ids whose pageview IP resolved to a state other than Texas and excludes those sessions from
  pageviews, unique visitors, device split, load times, program/CTA clicks, top pages, referrers, peak
  times, scroll depth, exit pages, timeseries, previous-period trends, funnels, per-program funnels,
  weekly drop alerts, and the public /api/top-program personalization. Sessions with unknown geo
  (private IP / failed lookup) are kept so real local traffic is never dropped.
- City table is Texas-only and now titled "Visitors by City (Texas)" (state column removed); panel
  subtitle states the Texas-only scope.
- Verified: seeded TX / CA / unknown-geo sessions — CA pageviews and its CTA click were excluded from
  totals and the city list; test docs removed afterwards. Admin UI screenshot confirmed.

## Changelog — 2026-06 (Google Calendar embed + admin seed hardening)
- /calendar page: added an "Our Google Calendar" section below the custom calendar that embeds the gym's
  public Google Calendar (usgoldgym@gmail.com, America/Chicago, brand-purple event colour). Desktop shows
  the month grid, mobile shows the AGENDA view, plus an "Add to my calendar" subscribe button.
  Config lives in src/data/site.js -> GOOGLE_CALENDAR {embedUrl, embedUrlAgenda, publicUrl}.
  Verified live: real events (Tumble Clinic, Open Gym, Daytime Playtime, National Gymnastics Day) render.
  OPEN QUESTION for the user: the Google Calendar now duplicates the hand-managed admin calendar above it —
  decide whether Google Calendar becomes the single source of truth.
- backend seed_admin() hardened: ADMIN_EMAIL is trimmed, unwrapped from stray quotes and lowercased (login
  lowercases the submitted email, so a mixed-case secret previously created an unusable account); any legacy
  mixed-case admin doc is folded down to lowercase, role is forced to admin, and the bcrypt hash is reset to
  match ADMIN_PASSWORD on every boot. Startup now logs "Admin account ready for <email> (updated: ...)".
- RESOLVED (root cause found): prod admin login failed with "Something went wrong. Please try again."
  only when the browser was on https://www.usgoldgymclub.com. The API runs on the apex
  (https://usgoldgymclub.com) and CORS allow_origins came from FRONTEND_URL = apex only, so the
  login POST from the www origin got no Access-Control-Allow-Origin header and axios saw a network
  error (detail null -> generic message). Credentials/secrets were correct all along — verified by
  logging into https://usgoldgymclub.com/login (curl + headless browser, both succeeded).
  Fixes: (1) backend _allowed_origins() now derives apex + www twins from FRONTEND_URL;
  (2) frontend src/lib/api.js resolves the API base to window.location.origin whenever the page host
  matches REACT_APP_BACKEND_URL host ignoring "www.", so calls are same-origin and cookies stay
  first-party (ErrorBoundary now reuses the same API base). Needs a re-publish to reach production.
