export const IMG = {
  heroVault: "/assets/floor-teen.webp",
  handstand: "/assets/floor-teen.webp",
  beamHandstand: "/assets/beam.webp",
  floorJump: "/assets/floor-kid.webp",
  preschoolGroup: "/assets/team-huddle.webp",
  preschoolBeam: "/assets/vault-kid.webp",
  preschoolMat: "https://images.unsplash.com/photo-1655842556563-2c28adb3fcc5?crop=entropy&cs=srgb&fm=webp&q=70&w=900",
  preschoolPlay: "https://images.unsplash.com/photo-1655842556550-6809c404ce9c?crop=entropy&cs=srgb&fm=webp&q=70&w=900",
  cheerPose: "/assets/cheer-squad.webp",
  cheerJump: "https://images.unsplash.com/photo-1589748263853-21d0bd847017?crop=entropy&cs=srgb&fm=webp&q=70&w=900",
  cheerSquad: "https://images.unsplash.com/photo-1705592341761-fdca5d1b7f2e?crop=entropy&cs=srgb&fm=webp&q=70&w=900",
  cheerStage: "https://images.unsplash.com/photo-1589748239338-afe695e833d3?crop=entropy&cs=srgb&fm=webp&q=70&w=900",
  birthday: "https://images.unsplash.com/photo-1761257517671-2c81b35c22a8?crop=entropy&cs=srgb&fm=webp&q=70&w=900",
  facilityEquip: "https://images.unsplash.com/photo-1621046590998-78ecf71d58a8?crop=entropy&cs=srgb&fm=webp&q=70&w=900",
  facilityFloor: "https://images.unsplash.com/photo-1632758243488-7e6f9173cfa1?crop=entropy&cs=srgb&fm=webp&q=70&w=900",
  coach: "/assets/bars.webp",
};

// Friendly "we're updating the site" strip. Set enabled:false to turn it off.
// Bump `version` to re-show it to visitors who previously dismissed it.
export const SITE_NOTICE = {
  enabled: true,
  version: "2026-06",
  text: "Fresh look in progress — we're adding new photos and details all week. Thanks for your patience!",
};

export const GOOGLE_CALENDAR = {
  // usgoldgym@gmail.com public calendar
  embedUrl:
    "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FChicago&showPrint=0&showTitle=0&src=dXNnb2xkZ3ltQGdtYWlsLmNvbQ&color=%23b39ddb",
  publicUrl:
    "https://calendar.google.com/calendar/u/0/r?cid=dXNnb2xkZ3ltQGdtYWlsLmNvbQ",
  embedUrlAgenda:
    "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FChicago&showPrint=0&showTitle=0&showNav=1&showTabs=0&showCalendars=0&mode=AGENDA&src=dXNnb2xkZ3ltQGdtYWlsLmNvbQ&color=%23b39ddb",
};


export const BUSINESS = {
  name: "U.S. Gold Gymnastics & Cheer Academy",
  shortName: "US Gold",
  logo: "/assets/logo-240.webp",
  phone: "817.491.9996",
  phoneRaw: "+18174919996",
  email: "staff@usgoldgymclub.com",
  instagram: "https://www.instagram.com/usgoldgym/",
  facebook: "https://www.facebook.com/129891587058474",
  googleRating: "4.8",
  googleReviews: 67,
  googleReviewsUrl: "https://www.google.com/search?q=US+Gold+Gymnastics+and+Cheer+Academy+Roanoke+TX",
  address: "4000 Haslet-Roanoke Rd Ste 100, Roanoke, TX 76262",
  mapEmbed:
    "https://www.google.com/maps?q=4000+Haslet-Roanoke+Rd+Ste+100,+Roanoke,+TX+76262&output=embed",
  hours: [
    { day: "Monday", time: "9:00 AM – 8:30 PM" },
    { day: "Tuesday", time: "9:00 AM – 8:30 PM" },
    { day: "Wednesday", time: "9:00 AM – 7:30 PM" },
    { day: "Thursday", time: "9:00 AM – 8:30 PM" },
    { day: "Friday", time: "2:30 PM – 6:30 PM" },
    { day: "Saturday", time: "9:00 AM – 12:30 PM" },
    { day: "Sunday", time: "Closed" },
  ],
};

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  {
    label: "Programs",
    children: [
      { label: "Preschool", to: "/preschool" },
      { label: "Recreational", to: "/recreational" },
      { label: "Competitive", to: "/competitive" },
      { label: "Cheer", to: "/cheer" },
      { label: "College Recruits", to: "/college-recruits" },
    ],
  },
  {
    label: "Events",
    children: [
      { label: "Calendar", to: "/calendar" },
      { label: "Camps", to: "/camps" },
      { label: "Special Events", to: "/special-events" },
      { label: "Birthday Parties", to: "/birthday-parties" },
    ],
  },
  { label: "Contact", to: "/contact" },
];

export const STATS = [
  { value: 22, suffix: "+", label: "Years Running" },
  { value: 8000, suffix: "+", label: "Athletes Trained" },
  { value: 140, suffix: "+", label: "Competition Wins" },
  { value: 30, suffix: "+", label: "Certified Coaches" },
];

export const PROGRAM_TILES = [
  { title: "Preschool", to: "/preschool", img: "preschoolBeam", tag: "Ages walking–5", span: "lg:col-span-4" },
  { title: "Recreational", to: "/recreational", img: "floorJump", tag: "Beginner → Advanced", span: "lg:col-span-4" },
  { title: "Competitive", to: "/competitive", img: "beamHandstand", tag: "USAG Levels 3–10", span: "lg:col-span-4" },
  { title: "Cheer", to: "/cheer", img: "cheerJump", tag: "Tumble & All-Star", span: "lg:col-span-6" },
  { title: "College Recruits", to: "/college-recruits", img: "handstand", tag: "Alumni spotlight", span: "lg:col-span-6" },
];

export const TESTIMONIALS = [
  { name: "Bill Vincent", role: "Gym parent · 14 years", quote: "My daughter has been a gymnast at US Gold for 14 years. She started in recreational classes and later tried out and made the competitive team." },
  { name: "Kerri Pfuehler", role: "Gym parent", quote: "We couldn't be happier with this facility. The coaches and staff are incredibly knowledgeable, supportive and truly care about every gymnast both inside and outside the gym." },
  { name: "Sophie Schmitz", role: "Alumni · 18 years", quote: "US Gold has been my gym and home for the past 18 years! The coaches are always so supportive and want the best for you in and outside of gymnastics." },
  { name: "Candice Eldred", role: "Gym parent · 8 years", quote: "We have been with US Gold for 8 years. My daughter has grown tremendously thanks to the coaches and teammates guiding her to be her best — it's been great for her confidence and self esteem." },
  { name: "Lindsey", role: "Former competitive gymnast · 10 years", quote: "I was a competitive gymnast at U.S. Gold for 10 years, and I truly cannot say enough positive things. The coaches are incredibly knowledgeable and genuinely care about helping each athlete." },
  { name: "Juli James", role: "Team parent since 2017", quote: "It's been one of the best decisions we've made for our daughter. She started in rec and has grown into the team program — more than gymnastics, the coaches have instilled real character." },
  { name: "Sharon S", role: "Local Guide · 13 years", quote: "We love U.S. Gold! My daughter trained there for 13 years. She learned a lot about responsibility, discipline, commitment, and time management, and formed meaningful relationships with her teammates and coaches." },
  { name: "Allison Bissell", role: "Team parent · 7 years", quote: "My daughter has been on the gymnastics team at US Gold for the past 7 years and has grown so much. The coaches helped her overcome physical and mental challenges — this gym has become her second home." },
];

export const PRESCHOOL_TIERS = [
  { name: "Tots", age: "Walking – 3 yrs", length: "30 min", focus: "Adult-participation class introducing gymnastics through movement, balance, and play.", img: "preschoolPlay" },
  { name: "Young 3", age: "3 yrs", length: "30 min", focus: "Gross motor skills, listening, following directions, and basic gymnastics skills.", img: "preschoolMat" },
  { name: "Gym I", age: "3.5 – 4.5 yrs", length: "45 min", focus: "Gross motor skills, listening, following directions, and basic gymnastics skills.", img: "preschoolBeam" },
  { name: "Gym II", age: "4.5 – 5.5 yrs", length: "45 min", focus: "Building on basic gymnastics skills with listening and following directions.", img: "preschoolGroup" },
  { name: "Gym III", age: "4.5 – 5.5 yrs", length: "55 min", focus: "Afternoon class equivalent to Gym II, continuing to build gymnastics skills.", img: "handstand" },
  { name: "Boys Sport", age: "4 – 5 yrs", length: "45 min", focus: "General strength, flexibility, and conditioning through gymnastics and other sports activities.", img: "floorJump" },
];

export const PRESCHOOL_EXTRAS = [
  { name: "Daytime Playtime", price: "Free (members) / $5 (non-members)", desc: "One hour of parent-supervised open gym for ages walking–6. Runs September through May, Mondays 11am–12pm." },
  { name: "Lunch & Learn", price: "$30 (members) / $35 (non-members)", desc: "Three hours of gymnastics, games, crafts, and lunch for ages 3–5. 2nd & 4th Wednesdays, 11:30am–2:30pm. Must be fully potty trained." },
];

export const REC_LEVELS = [
  { name: "Beginner", length: "55 min", usag: "", desc: "For students new to gymnastics who want to learn the basic skills and terminology for fun and fitness." },
  { name: "Beginner 2", length: "55 min", usag: "USAG 1–2", desc: "Gymnasts with a basic understanding, training USAG Level 1 & 2 skills." },
  { name: "Intermediate", length: "55 min", usag: "USAG 3–4", desc: "Gymnasts who have mastered Levels 1 & 2 and are now working Level 3 & 4 skills." },
  { name: "Advanced", length: "85 min", usag: "USAG 4–5", desc: "For the more serious or former team gymnast, working Level 4 & 5 skills." },
];

export const TUMBLE_CLASSES = [
  { name: "Tumble 1", level: "Beginner" },
  { name: "Tumble 2", level: "Intermediate" },
  { name: "Tumble 3", level: "Advanced" },
];

export const COMPETITIVE_PATH = [
  { name: "Developmental / Pre-Team", detail: "Invite-only • Ages 4–7 • Year-round commitment", desc: "Our talent pipeline. Young athletes build the strength and skills to join a competitive team." },
  { name: "Compulsory Team", detail: "USAG Levels 3–5 • Fall competition season", desc: "Athletes compete standardized routines and travel to meets across the region." },
  { name: "Optional Team", detail: "USAG Levels 6–10", desc: "Custom routines, elite training, and a path toward national-level competition." },
  { name: "College Recruiting", detail: "Alumni spotlight", desc: "We help optional-level athletes market themselves and compete collegiately." },
];

export const CHEER_TRACKS = [
  { name: "Cheer Tumble Classes", tag: "All Skill Levels", img: "cheerPose", blurb: "The perfect way to build skills whether you're tumbling for fun or hoping to make a competitive or school squad. Skills are taught with proper progressions, giving each athlete a strong foundation to build on.", points: ["Standing and running tumbling", "Jumps, motions, and technique", "Progressions from cartwheel to full", "Great add-on for all-star or school cheer"], cta: "quote" },
  { name: "All-Star Competitive Cheer", tag: "Tryout Required", img: "cheerSquad", blurb: "A great way for your child to grow as an individual and an athlete. All-star cheer encompasses teamwork, athleticism, dedication, and performance ability — building confidence and self-esteem in a loving, positive environment.", points: ["Teamwork, performance, and stunting", "Choreographed competition routines", "Travel to regional competitions", "Builds discipline and confidence"], cta: "tryout" },
];

export const SPECIAL_EVENTS = [
  { name: "Open Gym", price: "$5 members / $7 non-members", meta: "Ages 5+ • 24-hr signup", desc: "Enjoy fun free time in the gym to play. Great any time of year, whatever the weather — bring your friends!", cat: "open_gym" },
  { name: "Friday Night Fun", price: "See Calendar", meta: "Parents' night out • Ages 5+", desc: "The name says it all! Kids come over for a fun time while parents get 4 hours to have dinner, catch a movie, or whatever they choose. 24-hr signup.", cat: "special_event" },
  { name: "Tumbling & Bar/Beam Clinics", price: "$25 members / $30 non-members", meta: "30 min each • 24-hr signup", desc: "Extra time to work on the skills you're learning in class. Great for gymnastics and cheer — both tumbling clinics and bar/beam combo clinics offered.", cat: "clinic" },
  { name: "Field Trips", price: "Request Pricing", meta: "School groups", desc: "1.5 hours of gym time — an obstacle course, the trampoline, the foam pit, and all four gymnastics events!", cat: "special_event" },
  { name: "Girl Scout Events", price: "Contact for Details", meta: "Patches • Sleepovers • Fundraisers", desc: "Fun and fitness for all ages and skill levels of Girl Scouts — daytime events, sleepovers, and fundraisers. Includes the U.S. Gold Patch on all 'Earn a Patch' and sleepover events.", cat: "special_event" },
];

export const CAMP_INFO = {
  ages: "Entering 1st grade & up (Fall 2026)",
  hours: "Drop-off no more than 5 min before start • Prompt pick-up required",
  note: "Closed June 29 – July 5 for the 4th of July. A signed waiver must be on file to participate. Registration required 24 hours in advance — walk-ins are not accepted.",
};

export const CAMP_SESSIONS = [
  { name: "Aloha Summer", dates: "June 1 – 5" },
  { name: "Jungle Safari", dates: "June 8 – 12" },
  { name: "We've Got Talent!", dates: "June 15 – 19" },
  { name: "Red, White & Blue", dates: "June 22 – 26" },
  { name: "Holiday Hoopla", dates: "July 6 – 10" },
  { name: "Wild About Butterflies", dates: "July 13 – 17" },
  { name: "Pajama Party", dates: "July 20 – 24" },
  { name: "Wild West Texas", dates: "July 27 – 31" },
  { name: "Action & Sports", dates: "Aug 3 – 7" },
];

export const LITTLE_DOG_DAYS = {
  price: "$120 members / $130 non-members per session",
  desc: "Our shorter, younger-camper program packed with the same themed fun — gymnastics, games, and crafts.",
  sessions: [
    { name: "Jungle Safari", dates: "June 8 – 11" },
    { name: "Holiday Hoopla", dates: "July 6 – 9" },
    { name: "Wild West Texas", dates: "July 27 – 30" },
  ],
};

export const PARTY_TIERS = [
  { name: "Birthday Party", price: "$245", age: "Ages 5+", duration: "1.5 hrs (1 hr gym + 30 min cake/presents)", capacity: "1–15 kids", deposit: "$100 deposit required", featured: true },
  { name: "Tot Party", price: "$225", age: "Ages 3–4", duration: "1 hr (40 min gym + 20 min cake/presents)", capacity: "1–10 kids", deposit: "$100 deposit required", featured: false },
];

export const PARTY_ADDONS = [
  { label: "Additional child", price: "+$8 each" },
  { label: "Extra 30 minutes", price: "+$50" },
];

export const PARTY_INCLUDED = [
  { title: "Trampoline", desc: "Trampoline time supervised by our staff." },
  { title: "Obstacle Course", desc: "Age-appropriate courses built for maximum fun." },
  { title: "Foam Pit", desc: "The crowd favorite." },
  { title: "Dedicated Party Host", desc: "A staff member runs the whole event so you can relax." },
];

// College alumni grouped by school. `logo` is left null until the gym supplies school logos.
export const RECRUIT_SCHOOLS = [
  {
    school: "Texas Woman's University",
    short: "TWU",
    logo: null,
    athletes: [
      { name: "Mollie Blessing", sport: "Gymnastics" },
      { name: "Kristi Costa", sport: "Gymnastics" },
      { name: "Mackenzie Balderas", sport: "Gymnastics" },
      { name: "Domi Bonzagni", sport: "Gymnastics" },
      { name: "Cayden Smout", sport: "Stunt" },
    ],
  },
  {
    school: "University of Oklahoma",
    short: "OU",
    logo: null,
    athletes: [
      { name: "Samantha Craus", sport: "Gymnastics" },
      { name: "Audrey Collins", sport: "Gymnastics", year: "2027" },
    ],
  },
  {
    school: "Centenary College",
    short: "Centenary",
    logo: null,
    athletes: [
      { name: "Megan DesJardines", sport: "Gymnastics" },
      { name: "Sophie Schmitz", sport: "Gymnastics" },
    ],
  },
  {
    school: "University of Mary Hardin-Baylor",
    short: "UMHB",
    logo: null,
    athletes: [
      { name: "Ryanne Bealle", sport: "Acro" },
      { name: "Carsyn Vincent", sport: "Acro" },
    ],
  },
  {
    school: "Lindenwood University",
    short: "Lindenwood",
    logo: null,
    athletes: [
      { name: "Aleah Turon", sport: "Gymnastics", note: "Now Head Coach — McMurray Gymnastics" },
    ],
  },
  {
    school: "Southern Connecticut State University",
    short: "Southern Connecticut",
    logo: null,
    athletes: [{ name: "Gracie Hundley", sport: "Gymnastics" }],
  },
  {
    school: "Southern Utah University",
    short: "Southern Utah",
    logo: null,
    athletes: [{ name: "Makenna Burnside", sport: "Gymnastics" }],
  },
  {
    school: "Winona State University",
    short: "Winona State",
    logo: null,
    athletes: [{ name: "Hailey Bryant", sport: "Gymnastics" }],
  },
  {
    school: "Frostburg State University",
    short: "Frostburg",
    logo: null,
    athletes: [{ name: "Kaylee Kosi", sport: "Acro" }],
  },
  {
    school: "Limestone University",
    short: "Limestone",
    logo: null,
    athletes: [{ name: "Lindsey Bryant", sport: "Acro" }],
  },
  {
    school: "Canisius University",
    short: "Canisius",
    logo: null,
    athletes: [{ name: "Jordan Yancy", sport: "Acro" }],
  },
  {
    school: "San Jose State University",
    short: "San Jose State",
    logo: null,
    athletes: [{ name: "Camdyn Foster", sport: "Gymnastics" }],
  },
  {
    school: "Cal Poly",
    short: "Cal Poly",
    logo: null,
    athletes: [{ name: "Morgan Allen", sport: "Stunt" }],
  },
  {
    school: "East Texas Baptist University",
    short: "ETBU",
    logo: null,
    athletes: [
      { name: "Karter Neal", sport: "Acro & Tumble" },
      { name: "Norah Collins", sport: "Acro & Tumble", year: "2027" },
    ],
  },
  {
    school: "Central Michigan University",
    short: "Central Michigan",
    logo: null,
    athletes: [{ name: "Jordan Smith", sport: "Gymnastics", year: "2027" }],
  },
];

export const STAFF = [
  { name: "Tina Martin", role: "Owner / Team Coach" },
  { name: "Bobby Dombrowski", role: "Owner / Team Coach" },
  { name: "Michelle Bryant", role: "Office Manager" },
  { name: "Nancy Martin", role: "Office Manager" },
  { name: "Jessica Parker", role: "Owner's Assistant" },
  { name: "Mollie Blessing", role: "Recreational Director / Team Coach" },
];

export const CONTACT_TOPICS = [
  "General Inquiry",
  "Free Trial",
  "Class Enrollment",
  "Event Sign Up",
  "Birthday Party",
  "Team Tryout",
  "Employment",
];

export const EVENT_CATEGORIES = {
  open_gym: { label: "Open Gym", color: "#FF1D8E" },
  clinic: { label: "Clinics", color: "#A855F7" },
  camp: { label: "Camps", color: "#4EA8FF" },
  special_event: { label: "Special Events", color: "#C77DFF" },
};

export const ANNOUNCEMENT =
  "★  Call or Email us to Schedule your FREE Trial Class!  ★  817.491.9996  ★  staff@usgoldgymclub.com  ★";

export const PDFS = {
  enrollmentPacket:
    "https://customer-assets-cm19k8pv.emergentagent.net/job_cheer-gym-pro/artifacts/pzscqfao_Enrollment_Packet.pdf",
  waiver:
    "https://customer-assets-cm19k8pv.emergentagent.net/job_cheer-gym-pro/artifacts/18bh2b6l_Waiver.pdf",
  campRegistration:
    "https://customer-assets-cm19k8pv.emergentagent.net/job_cheer-gym-pro/artifacts/37f1hj5a_Camp_2026_Summer_Fun_Registration.pdf",
  campPolicies:
    "https://customer-assets-cm19k8pv.emergentagent.net/job_cheer-gym-pro/artifacts/t17rj59e_Summer_Camp_Policies.pdf",
  littleDogDays:
    "https://customer-assets-cm19k8pv.emergentagent.net/job_cheer-gym-pro/artifacts/rs8zvrx6_LITTLE_DOG_DAYS_CAMP_SIGN_UP_2026.pdf",
};

export const CAREERS = {
  intro:
    "Looking for a career working with children and teaching cartwheels? U.S. Gold might be the perfect place for you!",
  positions: [
    { title: "Recreational Gymnastics & Tumble Coaches", note: "Teach class fundamentals to a range of ages and levels." },
    { title: "Upper Level Team Gymnastics Coaches", note: "Coach optional-level athletes toward competitive success." },
    { title: "Compulsory Team Gymnastics Coaches", note: "Develop athletes through USAG compulsory levels." },
    { title: "Special Events Coordinator", note: "Run birthday parties and special events (weekends required)." },
    { title: "Preschool Gymnastics Coaches", note: "Help our youngest athletes develop a love for gymnastics (weekday mornings required)." },
  ],
};

export const PRO_SHOP = {
  blurb: "Stop by our in-gym Pro Shop for amazing discounted items — leotards, grips, tape, apparel, and gear.",
  note: "In-store only. No online sales. Come see us during business hours!",
};

