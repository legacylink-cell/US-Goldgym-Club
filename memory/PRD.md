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

## Changelog — 2026-06 (Friendly "site updating" notice)
- New src/components/common/SiteNotice.jsx, rendered from Layout under the fixed navbar: glassy
  purple strip, sparkle icon, copy "Fresh look in progress — we're adding new photos and details all
  week. Thanks for your patience!", a tap-to-call 817.491.9996 link, and an X to dismiss.
- Calm by design: fades out once the visitor scrolls past 90px, never covers the Book Free Trial CTA,
  and dismissal is remembered in localStorage (key usg_notice_dismissed = SITE_NOTICE.version).
- Controlled from src/data/site.js -> SITE_NOTICE { enabled, version, text }. Set enabled:false to turn
  it off (user asked for it to stay up until turned off manually); bump `version` to re-show it to
  people who already dismissed it.
- Verified in preview: shows on load, hides on scroll, dismiss persists across reload.

## Changelog — 2026-06 (Content batch: About, Recruits, Camps, Parties, Contact, Careers)
- SiteNotice: sparkle icon swapped for a hammer (user: no AI-looking icons anywhere on the site).
- Home: pink stats band (22+ years / 8000+ athletes / 140+ wins / 30+ coaches) REMOVED at user request
  (numbers were placeholders). STATS still exists in site.js if it's ever wanted back.
- About: hero subtitle now "Over three decades of turning nervous first-timers into confident athletes…".
  Team section rebuilt with the 6 real staff (Tina Martin & Bobby Dombrowski — Owner/Team Coach;
  Michelle Bryant & Nancy Martin — Office Manager; Jessica Parker — Owner's Assistant; Mollie Blessing —
  Recreational Director/Team Coach), every card shows a "Photo coming soon" placeholder, and ALL
  certification badges were removed (USAG gym, may return later). Heading is "The people in the gym every
  day" — user still owes final "Meet the team" and "Rooted in the community" wording + photos.
- College Recruits: photos removed; 22 alumni now grouped into 15 school cards (RECRUIT_SCHOOLS in site.js,
  each with a `logo: null` slot ready for the school logos the user is sourcing). Aleah Turon carries the
  note "Now Head Coach — McMurray Gymnastics". Spelling corrected 2026-06 per user:
  Linwood -> "Lindenwood University". "McMurray" left as the user wrote it.
- Camps: added "Summer 2027 camp info coming early 2027!" callout (data-testid=camps-2027-note).
- Special Events: "Sign Up" no longer opens the booking dialog — it deep-links to
  /contact?topic=Event Sign Up&event=<event>.
- Birthday Parties: "Book This Party" deep-links to /contact?topic=Birthday Party&package=<tier>;
  What's Included wording trimmed (no "in-ground", no "dive, flip, and land soft", "so you can relax");
  waiver block now reads "Digital waiver — coming soon!". Header photo still to be supplied by user.
- Contact: subtitle "…one of our team members will get back to you."; topic list is now General Inquiry,
  Free Trial, Class Enrollment, Event Sign Up, Birthday Party, Team Tryout, Employment; the form prefills
  topic + message from the query string.
- Careers: intro now "Looking for a career working with children and teaching cartwheels? U.S. Gold might
  be the perfect place for you!" and added "Preschool Gymnastics Coaches (weekday mornings required)".
- Verified by testing agent: /app/test_reports/iteration_14.json — 100% frontend pass, all 14 routes 200.

## Changelog — 2026-06 (Baseball removed, recruit class years)
- Baseball program does not exist: /baseball page deleted along with its nav entry, home program tile,
  BASEBALL data + IMG.baseball, sitemap and llms.txt entries, and the program path lists used by
  analytics (frontend src/lib/analytics.js, AnalyticsPanel label map, backend ANALYTICS_PROGRAM_PATHS
  and page-label map). /baseball now falls through the catch-all route and redirects to the homepage.
  Home program grid rebalanced to 5 tiles (3 across, then 2 half-width).
- College Recruits: class years added — Audrey Collins (OU) 2027, Norah Collins (ETBU) 2027 with sport
  corrected to "Acro & Tumble", Jordan Smith (Central Michigan) 2027. Years render as "Name · 2027".
- "Boys & Competitive Director" no longer appears anywhere (it was part of the old placeholder staff list
  replaced in the previous batch). NOTE for user: the Recreational page still advertises a "Boys
  Gymnastics" track and a "Boys Sport" preschool class — confirm whether those are accurate.
- Self-verified in preview: 0 baseball links on the homepage, program grid renders, recruit rows show the
  new years, /baseball redirects home.

- 2026-06: About hero subtitle reverted at user request to their exact wording: "Two decades of turning
  nervous first-timers into confidant athletes - and building a community families are proud to be part
  of" (user's spelling "confidant" and hyphen kept verbatim; flagged to them as a possible typo for
  "confident"). Verified live on /about.

- 2026-06: About collage — the Unsplash pompom cheerleader stock photo was replaced with a REAL US Gold
  photo (cheer squad huddle, from the user's "US GOLD Pics.zip" asset). Saved as
  /assets/cheer-squad.webp (758x1000, 123KB) and wired to IMG.cheerPose, so it also now appears on the
  Cheer page "Cheer Tumble Classes" card. Verified on /about.
  The zip (15 real photos: beam, split leap, vault handstand, bars release, floor poses, podium shots,
  coach with athletes, gym wide shots) is available at
  https://customer-assets-cm19k8pv.emergentagent.net/job_cheer-gym-pro/artifacts/vl6am4tm_US%20GOLD%20Pics.zip
  — remaining stock images that could be swapped for these: cheerJump, cheerSquad, cheerStage, birthday,
  facilityEquip, facilityFloor, preschoolMat, preschoolPlay. NOTE: 6 of the zip photos need EXIF rotation
  handling (use ImageOps.exif_transpose) and the 4000x3000 "inbound" shots are sideways wide gym views.

## Changelog — 2026-06 (Google Calendar is now THE calendar)
- /calendar rewritten: the hand-built month/week/list calendar (and its event detail dialog, /api/events
  fetch, category filters) was REMOVED and replaced by the gym's Google Calendar embed as the primary
  schedule. Hero kept ("Live schedule / Calendar"), plus a "dates subject to change — call us" line with
  a tap-to-call link.
- The "Add to my calendar" button was removed, and Google's own "Add to Google Calendar" link inside the
  embed footer is masked with a matching #f1f3f4 strip (data-testid=gcal-link-mask). Google Calendar
  attribution/logo is intentionally left visible.
- Desktop = month grid (680px), mobile = agenda view (560px). Verified in preview.
- IMPLICATION: the admin dashboard's calendar/event editor no longer drives anything public — events must
  now be managed in Google Calendar. /api/events still exists and is used by nothing on the public site.

- 2026-06 (calendar polish): the Google Calendar embed is now dark-themed to match the site — the iframe
  wrapper uses CSS `filter: invert(0.92) hue-rotate(180deg)` inside an ink card, so the grid reads as dark
  purple/near-black with light text like the old custom calendar. The "Add to Google Calendar" link is
  covered by a 24px #edf2f6 strip placed INSIDE the filtered wrapper (so it inverts to exactly the footer
  colour and is invisible); the timezone line and Google attribution remain visible. Verified at 1527px.

## Changelog — 2026-06 (Custom purple calendar, powered by Google Calendar)
- The Google iframe embed was dropped. New backend endpoint GET /api/gcal/events reads the gym's PUBLIC
  Google Calendar ICS feed (usgoldgym@gmail.com), expands recurring events with recurring-ical-events,
  converts to America/Chicago, caches the feed in memory for 10 minutes, and returns
  {id,title,date,time,all_day,category,location,description}. Categories are derived from the title:
  "open gym"->open_gym, "clinic"->clinic, "camp"->camp, everything else->special_event.
  New deps: icalendar, recurring-ical-events (requirements.txt updated via pip freeze).
- /calendar restored to the original branded purple UI, now fed by the Google feed: dynamic
  month/week-range/"Upcoming events" header that follows the view, prev/next arrows, MONTH/WEEK/LIST
  toggle, and the category key (All / Open Gym / Clinics / Camps / Special Events) used as filters.
  Event chips use the category colours; clicking one opens a dialog with day/time/location/description and
  two CTAs — "Sign up / ask a question" (deep links to /contact?topic=Event Sign Up&event=<title>) and
  "Call the gym". Graceful fallback message if the feed is unreachable.
- Mobile respected: LIST view is the default under 768px, the month grid scrolls horizontally
  (min-w-[680px] inside an overflow-x wrapper), and controls/legend wrap.
- Verified in preview at 1527px and 390px: header switches Sep->Oct on next, list shows real events
  (Tumble Clinic, Bar/Beam Clinic, National Gymnastics Day all-day, Daytime Playtime, Lunch & Learn,
  Open Gym), dialog renders correctly.
- Special Events "Sign Up" -> contact form was already done in the earlier batch and re-confirmed in code
  (SpecialEvents.jsx line ~44) and by testing agent in iteration_14.

- 2026-06 (calendar crash report): user hit "Something went wrong — Cannot access '__WEBPACK_DEFAULT_EXPORT__'
  before initialization" on /calendar. Diagnosis: transient stale-module state from the dev server's hot
  reload while CalendarPage.jsx was being rewritten; /calendar renders correctly (14 events, SEPTEMBER 2026
  header, zero page errors) and production chunk hashes were all verified present and self-consistent
  (prod index.html is served no-store, so chunk names can't drift). NOT a code bug.
  Hardening added anyway: ErrorBoundary now detects stale-bundle signatures (Loading chunk / ChunkLoadError /
  "before initialization" / "Unexpected token '<'" / failed dynamic import) and performs ONE silent
  hard reload (sessionStorage flag usg_bundle_reloaded) instead of showing the crash screen to a parent.

## Changelog — 2026-06 (Email notifications + all CTAs to the form + mobile bar polish)
- EMAIL (Microsoft 365 SMTP, user choice): new /app/backend/mailer.py sends a staff notification to
  STAFF_TO with the parent's address as Reply-To, plus a branded "we got your message" confirmation to
  the parent. Wired via FastAPI BackgroundTasks into /api/contact, /api/leads, /api/newsletter,
  /api/bookings. Gated by mailer.email_enabled() — with SMTP_PASSWORD empty it logs
  "Email not configured — skipped" and forms keep saving, so nothing breaks pre-credentials.
  Helpers: POST /api/admin/email/test, GET /api/admin/email/status. Env keys added to backend/.env
  (SMTP_HOST/PORT/USERNAME/PASSWORD, MAIL_FROM, STAFF_TO) — SMTP_PASSWORD intentionally blank and MUST
  also be added to deployment secrets for production. Dep: aiosmtplib.
  PENDING FROM USER: Microsoft 365 app password for staff@usgoldgymclub.com. Full instructions written to
  /app/memory/SMTP_SETUP.md (enable Authenticated SMTP on the mailbox, create app password, send it over).
  Note Microsoft disables basic SMTP AUTH by default after Dec 2026 — migrate to Graph Mail.Send or
  Resend before then.
- ALL CTAs now point at the contact form (user request): the last pop-up dialogs were replaced with
  deep links — Preschool "Request Class Pricing" + extras "Request Info", Recreational "Request Pricing",
  Cheer "Request Pricing", Special Events "Inquire". Every CTA carries topic + program/event/package so
  Contact.jsx prefills the dropdown and message (it now also reads the `program` param).
  QuoteRequestDialog.jsx / BookingDialog.jsx are now dead code (kept, unreferenced by public pages).
- Contact form: added an "or talk to us now" divider plus a full-width tel: "Call 817.491.9996" button
  (data-testid=contact-form-call) under Send Message.
- Mobile action bar: now slides out of view on scroll-down and returns instantly on scroll-up or at the
  page bottom (rAF-throttled, 300ms transform), with iOS safe-area padding, and the layout reserves
  bottom space so the footer credit is never covered. Verified at 390x844.
- Removed the hero <link rel=preload> that was logging "preloaded but not used" warnings on every page.
- Verified by testing agent: /app/test_reports/iteration_15.json — backend 32/32 pytest, frontend 100%.

- 2026-06: Recreational page — the confusing "Tuition set by weekly frequency / Request Pricing" block was
  replaced with a "Family friendly pricing — More classes, more savings" section featuring two cards
  (Multi-class discount, Sibling discount) and an "Ask about discounts" CTA to
  /contact?topic=Class Enrollment&program=Recreational Classes. Deliberately NO percentages or dollar
  figures — CONFIRM with the user whether they want exact discount amounts published.
  Verified on /recreational (old tuition copy gone, CTA routes correctly).

- 2026-06: tuition messaging unified. New shared component
  /app/frontend/src/components/common/PricingDiscounts.jsx (props: program, note) renders the
  "Family friendly pricing / More classes, more savings" panel with Multi-class + Sibling discount cards
  and an "Ask about discounts" CTA to /contact?topic=Class Enrollment&program=<program>.
  Used on Recreational (replaces the earlier inline copy), Preschool (replaces "Tuition varies by weekly
  frequency"), and Cheer (new, after the tracks grid). Competitive keeps its "Inquire About Team" CTA since
  team fees are quoted individually. Verified on all three pages.

- 2026-06: College Recruits — added Karter Neal (ETBU, Acro & Tumble, first year, no class year listed)
  alongside Norah Collins, and corrected "Linwood University" to "Lindenwood University". Header count now
  reads 23 alumni - 15 programs (auto-derived). Verified on /college-recruits.

- 2026-06 (mobile polish): CTA sizing is now responsive — MagneticButton base is px-5 py-3 text-base on
  mobile and px-8 py-4 text-lg from md up, and every hardcoded "text-lg px-8 py-4" CTA across pages/dialogs
  (Contact, Login, Register, BirthdayParties, PricingDiscounts, Quote/Booking dialogs) was swapped to the
  same responsive pair. Desktop appearance unchanged.
  Mobile reviews rebuilt as a CROSS-FADE carousel: all 8 cards stacked absolutely in a min-h-[340px]
  container, opacity-animated (0.45s ease-in-out), auto-advance every 5s, pause while the user is touching,
  dots remain tappable (32px targets). The old horizontal snap-scroll (which showed half-cut neighbouring
  cards on phones) is gone, and there is no horizontal page overflow.
  Verified at 390x844 (fade always shows a card, no blank frame) and 1440px (desktop 4-up carousel intact).

- 2026-06: user asked to remove all em dashes from the site. Every "—" in frontend copy (20 files: pages,
  components, data/site.js, index.html meta, llms.txt) and in backend/mailer.py email templates was
  replaced with a plain hyphen "-". Verified 0 em dashes rendering on /, /about, /recreational, /contact,
  /calendar. NOTE: en dashes (–) are still used in numeric ranges only ("9:00 AM – 8:30 PM", "4 – 5 yrs")
  and in Google Calendar event time labels; ask before changing those.

- 2026-06: mobile CTA pairs looked mismatched (wide pink primary next to a narrower outlined secondary).
  Fix: hero and program-spotlight CTA rows now use `grid grid-cols-1 sm:flex` with `w-full sm:w-auto`
  buttons, so on phones they stack full-width and equal; from sm up they sit inline as before. Also added
  `border-2 border-transparent` to the MagneticButton base so filled variants match the outline variant's
  height exactly (previously 4px shorter). Verified at 390x844 on hero + spotlight.

## Changelog — 2026-06 (Filterable class schedule on the Calendar page)
- User request: reuse the calendar's filter-chip pattern for classes. New component
  /app/frontend/src/components/common/ClassSchedule.jsx rendered at the bottom of /calendar (below the
  events calendar, separated by a divider).
- Filters: All classes / Preschool / Recreational / Cheer Tumble / Boys (colour-dotted chips matching the
  calendar legend styling). 14 class cards built from existing site.js data — PRESCHOOL_TIERS (Boys Sport
  routed to the Boys filter), REC_LEVELS, TUMBLE_CLASSES, plus the Boys Gymnastics 55-min class.
  Each card shows class name, age/level, length, description and a "Program details" link to the matching
  program page. Counts verified: preschool 5, recreational 4, cheer tumble 3, boys 2, all 14.
- Per user: NO day/time data (they don't have it finalized) — instead a note "Days and times are set each
  session and can change seasonally - call the front desk ... A full day-by-day schedule is coming soon."
  plus an "Ask about day & time options" tap-to-call button. USER TO CONFIRM LATER whether the schedule is
  seasonal (then we can label it e.g. "Fall 2026") and whether to add real day/time rows.
- Verified desktop 1440px and mobile 390px (single column, no horizontal overflow).

## Reminder system (added 2026-06)
- /app/frontend/src/components/admin/AdminReminders.jsx renders dated notices at the top of /admin.
  Entries have {id, showFrom, title, body}; they appear automatically once today >= showFrom and can be
  dismissed per-browser (localStorage key usg_admin_reminders).
- ACTIVE ENTRY: id "smtp-retirement-2026", showFrom 2026-11-01 - warns the gym that Microsoft is retiring
  the SMTP method used for form notifications and that the site must move to Microsoft Graph Mail.Send or
  Resend. The user explicitly asked to be reminded "when the time comes".
- FUTURE AGENT ACTION: when picking up this project on/after 2026-11-01, migrate mailer.py off
  smtp.office365.com basic auth. Verified the banner stays hidden before its date (dashboard checked
  2026-09-22, 0 banners, no console errors).

- 2026-06: ClassSchedule "Program details" links audited. One was wrong - "Boys Sport" (ages 4-5, lives in
  PRESCHOOL_TIERS but filtered under Boys) pointed at /recreational; now overridden to /preschool via an
  optional per-row `link` field. All 14 verified: 6 preschool classes -> /preschool, 4 rec levels + Boys
  Gymnastics -> /recreational, Tumble 1-3 -> /cheer, and click-through navigation confirmed.

## Changelog — 2026-06 (Admin follow-up tracking)
- Every admin list (Pricing Requests, Messages, Bookings, Email List) now shows a **Received** column
  (date + time, from created_at) and a **Follow-up** toggle that flips between NEW (pink) and CONTACTED
  (green check). One click, optimistic UI, rolls back + toasts on failure.
- Backend: PATCH /api/admin/{kind}/{id}/status with {"status": "new"|"contacted"} where kind is
  leads|contacts|bookings|newsletter. Writes `contact_status` + `contact_status_at` - deliberately a
  SEPARATE field from a booking's own `status` ("confirmed") so nothing collides. Items without the field
  read as "new". New contact submissions also store status "new".
- Filter chips above each table: All / Needs contact / Contacted, each with a live count.
- CSV exports now include contact_status as the second column.
- Verified: toggle flips + persists across reload, counts update, filters work, no console errors.
  Also purged leftover QA test records from the preview DB (5 contacts, 1 lead, 2 subscribers).
