import { buildPageSchema } from "@/lib/pageSchema";

// Apex host: www.usgoldgymclub.com issues a permanent redirect to this host,
// so canonicals/og:url must use the apex to stay self-referential.
const SITE = "https://usgoldgymclub.com";

export const PAGE_META = {
  "/": {
    title: "Kids Gymnastics & Cheer in Roanoke, TX | U.S. Gold",
    description:
      "Youth gymnastics and cheer classes in Roanoke, TX for ages 1 through 18, from first cartwheels to competitive teams. Book a free trial class this week.",
  },
  "/about": {
    title: "About Our Roanoke Gymnastics Gym | U.S. Gold",
    description:
      "Meet the coaches behind U.S. Gold in Roanoke, TX and see the philosophy that turns nervous first-timers into confident athletes. Book a free trial class.",
  },
  "/preschool": {
    title: "Preschool Gymnastics Classes, Ages 1-5 | U.S. Gold",
    description:
      "Preschool gymnastics classes in Roanoke, TX for ages 1 to 5, with parent-and-me, independent and boys classes that build balance and confidence. Try free.",
  },
  "/recreational": {
    title: "Recreational Gymnastics Classes by Level | U.S. Gold",
    description:
      "Recreational gymnastics classes in Roanoke, TX for beginner through advanced levels on bars, beam, vault and floor in a real training gym. Try a class free.",
  },
  "/competitive": {
    title: "Competitive Gymnastics Team & Tryouts | U.S. Gold",
    description:
      "Competitive gymnastics teams in Roanoke, TX with year-round training, meet schedules and tryout details for DFW athletes ready to compete. Ask about tryouts.",
  },
  "/cheer": {
    title: "Cheer Classes & Competitive Cheer Teams | U.S. Gold",
    description:
      "Cheer tumbling classes and competitive cheer teams in Roanoke, TX, teaching jumps, standing tumbling and running passes at every level. Book a free trial.",
  },
  "/camps": {
    title: "Gymnastics Summer & School Break Camps | U.S. Gold",
    description:
      "Summer and school-break gymnastics camps in Roanoke, TX with themed weeks, open gym time, games and coaching for all levels. See the camp dates and sign up.",
  },
  "/birthday-parties": {
    title: "Gymnastics Birthday Parties in Roanoke | U.S. Gold",
    description:
      "Gymnastics birthday parties in Roanoke, TX with a private party room, trampoline, foam pit and a dedicated host so you can relax. Check party availability.",
  },
  "/special-events": {
    title: "Open Gym, Clinics & Parents' Night Out | U.S. Gold",
    description:
      "Open gym, skill clinics and parents' night out events at our Roanoke, TX gym, giving kids a fun night out and parents a few hours free. See upcoming dates.",
  },
  "/calendar": {
    title: "Class Calendar, Events & Closures | U.S. Gold",
    description:
      "See the current class calendar for U.S. Gold in Roanoke, TX, including clinics, open gym, special events and holiday closures. Check dates before you visit.",
  },
  "/college-recruits": {
    title: "College Gymnastics Recruiting Support | U.S. Gold",
    description:
      "College recruiting support for U.S. Gold athletes in Roanoke, TX, with alumni competing in gymnastics, acro and tumbling programs. See where they landed.",
  },
  "/careers": {
    title: "Gymnastics Coaching Jobs in Roanoke, TX | U.S. Gold",
    description:
      "Gymnastics and cheer coaching jobs in Roanoke, TX. See open positions for preschool, recreational and team coaches, plus front desk roles. Apply this week.",
  },
  "/contact": {
    title: "Contact Us - Hours, Location & Free Trial | U.S. Gold",
    description:
      "Visit U.S. Gold Gymnastics in Roanoke, TX. Find our address, class hours and phone number, or send a message to claim a free trial class for your child.",
  },
};

const setMeta = (selector, attr, value) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    const [, name, key] = selector.match(/\[(name|property)="(.+)"\]/) || [];
    if (!name) return;
    el.setAttribute(name, key);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

export const applyPageHead = (pathname) => {
  // Trailing-slash URLs (/preschool/) must resolve to the same entry as /preschool,
  // otherwise the lookup misses and the page falls back to the homepage head.
  const route = pathname !== "/" ? pathname.replace(/\/+$/, "") || "/" : "/";
  const meta = PAGE_META[route] || PAGE_META["/"];
  const url = `${SITE}${route === "/" ? "/" : route}`;

  document.title = meta.title;

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = url;

  setMeta('meta[name="description"]', "content", meta.description);
  setMeta('meta[property="og:title"]', "content", meta.title);
  setMeta('meta[property="og:description"]', "content", meta.description);
  setMeta('meta[property="og:url"]', "content", url);
  setMeta('meta[name="twitter:title"]', "content", meta.title);
  setMeta('meta[name="twitter:description"]', "content", meta.description);

  let schema = document.getElementById("page-schema");
  if (!schema) {
    schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.id = "page-schema";
    document.head.appendChild(schema);
  }
  schema.textContent = JSON.stringify(buildPageSchema(route));
};
