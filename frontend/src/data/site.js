export const IMG = {
  heroVault: "https://images.unsplash.com/photo-1583155778358-9da4eb5e0c1d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920",
  handstand: "https://images.unsplash.com/photo-1747336406309-79970f9066b1?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  beamHandstand: "https://images.unsplash.com/photo-1747336406564-717968046260?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  floorJump: "https://images.unsplash.com/photo-1505619730259-b1288d154955?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  preschoolGroup: "https://images.unsplash.com/photo-1655842556539-db2d2099ded1?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  preschoolBeam: "https://images.unsplash.com/photo-1655842556432-ece48a4f2c1a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  preschoolMat: "https://images.unsplash.com/photo-1655842556563-2c28adb3fcc5?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  preschoolPlay: "https://images.unsplash.com/photo-1655842556550-6809c404ce9c?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  cheerPose: "https://images.unsplash.com/photo-1639510478219-459967c2be92?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  cheerJump: "https://images.unsplash.com/photo-1589748263853-21d0bd847017?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  cheerSquad: "https://images.unsplash.com/photo-1705592341761-fdca5d1b7f2e?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  cheerStage: "https://images.unsplash.com/photo-1589748239338-afe695e833d3?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  birthday: "https://images.unsplash.com/photo-1761257517671-2c81b35c22a8?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  facilityEquip: "https://images.unsplash.com/photo-1621046590998-78ecf71d58a8?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  facilityFloor: "https://images.unsplash.com/photo-1632758243488-7e6f9173cfa1?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  coach: "https://images.unsplash.com/photo-1655842556556-f7ab19796f25?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
};

export const BUSINESS = {
  name: "U.S. Gold Gymnastics & Cheer Academy",
  shortName: "US Gold",
  phone: "817.491.9996",
  phoneRaw: "+18174919996",
  email: "staff@usgoldgymclub.com",
  address: "4000 Haslet-Roanoke Rd Ste 100, Roanoke, TX 76262",
  mapEmbed:
    "https://www.google.com/maps?q=4000+Haslet-Roanoke+Rd+Ste+100,+Roanoke,+TX+76262&output=embed",
  hours: [
    { day: "Mon – Fri", time: "9:00 AM – 8:00 PM" },
    { day: "Saturday", time: "9:00 AM – 2:00 PM" },
    { day: "Sunday", time: "Closed / Private Events" },
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
  { title: "Preschool", to: "/preschool", img: "preschoolBeam", tag: "Ages walking–5", span: "lg:col-span-5" },
  { title: "Recreational", to: "/recreational", img: "floorJump", tag: "Beginner → Advanced", span: "lg:col-span-7" },
  { title: "Competitive", to: "/competitive", img: "beamHandstand", tag: "USAG Levels 3–10", span: "lg:col-span-7" },
  { title: "Cheer", to: "/cheer", img: "cheerJump", tag: "Tumble & All-Star", span: "lg:col-span-5" },
];

export const TESTIMONIALS = [
  { name: "Amanda R.", role: "Gym parent, Roanoke", quote: "My daughter went from scared of the beam to competing Level 4 in one year. The coaches are absolutely phenomenal with the little ones." },
  { name: "Marcus T.", role: "Boys program parent", quote: "The boys gymnastics track built real strength and confidence. Best decision we made for our son this year." },
  { name: "Jenna P.", role: "All-Star Cheer mom", quote: "Team culture here is unreal. Discipline, teamwork, and so much fun. We drive 30 minutes and it's 100% worth it." },
  { name: "Cole D.", role: "Optional Team athlete", quote: "Coaches pushed me to Level 9 and helped me get recruited. This gym changed my life." },
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

export const CAMPS = [
  { name: "Summer Skills Camp", dates: "Jul 27 – Jul 31, 2026", age: "Ages 5–12", price: "$45 / day • $200 / week", desc: "Gymnastics fundamentals, obstacle courses, games, and open gym." },
  { name: "Ninja Warrior Camp", dates: "Aug 3 – Aug 7, 2026", age: "Ages 6–13", price: "$50 / day • $220 / week", desc: "Climbing, agility, and ninja-course training for high-energy kids." },
  { name: "Cheer & Tumble Camp", dates: "Aug 10 – Aug 14, 2026", age: "Ages 7–14", price: "$50 / day • $220 / week", desc: "Tumbling progressions, jumps, motions, and a showcase Friday." },
  { name: "Winter Break Camp", dates: "Dec 21 – Dec 23, 2026", age: "Ages 5–12", price: "$45 / day", desc: "Beat the break boredom with active, structured gym days." },
];

export const PARTY_TIERS = [
  { name: "Birthday Party", price: "$245", age: "Ages 5+", duration: "1.5 hrs (1 hr gym + 30 min cake/presents)", capacity: "1–15 kids", deposit: "$100 deposit required", featured: true },
  { name: "Tot Party", price: "$225", age: "Ages 3–4", duration: "1 hr (40 min gym + 20 min cake/presents)", capacity: "1–10 kids", deposit: "$100 deposit required", featured: false },
];

export const PARTY_ADDONS = [
  { label: "Additional child", price: "+$8 each" },
  { label: "Extra 30 minutes", price: "+$50" },
];

export const PARTY_INCLUDED = [
  { title: "Trampoline", desc: "In-ground trampoline time supervised by our staff." },
  { title: "Obstacle Course", desc: "Age-appropriate courses built for maximum fun." },
  { title: "Foam Pit", desc: "The crowd favorite — dive, flip, and land soft." },
  { title: "Dedicated Party Host", desc: "A staff member runs the whole event so you relax." },
];

export const RECRUITS = [
  { name: "Cole Davison", level: "USAG Level 10", college: "University of Oklahoma", img: "handstand" },
  { name: "Maya Fields", level: "USAG Level 9", college: "University of Denver", img: "beamHandstand" },
  { name: "Ella Ramirez", level: "USAG Level 10", college: "UCLA", img: "floorJump" },
  { name: "Jordan Pak", level: "USAG Level 9", college: "Stanford University", img: "cheerPose" },
  { name: "Sophie Nguyen", level: "USAG Level 10", college: "University of Georgia", img: "preschoolGroup" },
  { name: "Grace Miller", level: "USAG Level 9", college: "Boise State", img: "cheerStage" },
];

export const STAFF = [
  { name: "Coach Dana", role: "Owner / Head Coach", certs: ["USAG Certified", "Safety/CPR"], img: "coach" },
  { name: "Coach Rob", role: "Boys & Competitive Director", certs: ["USAG Certified"], img: "handstand" },
  { name: "Coach Bri", role: "All-Star Cheer Director", certs: ["USASF Certified"], img: "cheerPose" },
  { name: "Coach Sam", role: "Preschool Program Lead", certs: ["USAG Certified", "Early Childhood"], img: "preschoolGroup" },
];

export const CONTACT_TOPICS = [
  "General Inquiry",
  "Class Enrollment",
  "Birthday Party",
  "Team Tryout",
  "Employment",
];

export const EVENT_CATEGORIES = {
  open_gym: { label: "Open Gym", color: "#D4FF3F" },
  clinic: { label: "Clinics", color: "#FF4E4E" },
  camp: { label: "Camps", color: "#4EA8FF" },
  special_event: { label: "Special Events", color: "#B98CFF" },
};
