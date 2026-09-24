import {
  PRESCHOOL_TIERS,
  REC_LEVELS,
  COMPETITIVE_PATH,
  CHEER_TRACKS,
  PARTY_TIERS,
  SPECIAL_EVENTS,
  LITTLE_DOG_DAYS,
  CAMP_SESSIONS,
  CAMP_INFO,
} from "@/data/site";

const SITE = "https://usgoldgymclub.com";

const PROVIDER = {
  "@type": "SportsActivityLocation",
  name: "U.S. Gold Gymnastics & Cheer Academy",
  url: SITE,
  telephone: "+1-817-491-9996",
  address: {
    "@type": "PostalAddress",
    streetAddress: "4000 Haslet-Roanoke Rd Ste 100",
    addressLocality: "Roanoke",
    addressRegion: "TX",
    postalCode: "76262",
    addressCountry: "US",
  },
};

// Age ranges in years, keyed by class name (the site copy stores them as prose).
const AGES = {
  Tots: [1, 3],
  "Young 3": [3, 3],
  "Gym I": [3, 4],
  "Gym II": [4, 5],
  "Gym III": [4, 5],
  "Boys Sport": [4, 5],
  "Developmental / Pre-Team": [4, 7],
};

const course = ({ name, description, path, ages, workload }) => {
  const node = {
    "@type": "Course",
    name,
    description,
    url: `${SITE}${path}`,
    provider: PROVIDER,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: PROVIDER,
      ...(workload ? { courseWorkload: workload } : {}),
    },
  };
  if (ages) {
    node.audience = {
      "@type": "PeopleAudience",
      suggestedMinAge: ages[0],
      suggestedMaxAge: ages[1],
    };
  }
  return node;
};

const itemList = (name, items) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item,
  })),
});

// "$245" / "$120 members / $130 non-members" -> numbers
const priceNumbers = (raw) =>
  (String(raw).match(/\$\s?(\d+(?:\.\d{2})?)/g) || []).map((m) =>
    Number(m.replace(/[^\d.]/g, ""))
  );

const offer = (raw) => {
  const nums = priceNumbers(raw);
  if (!nums.length) return null;
  const low = Math.min(...nums);
  const high = Math.max(...nums);
  return low === high
    ? { "@type": "Offer", price: low, priceCurrency: "USD" }
    : {
        "@type": "AggregateOffer",
        lowPrice: low,
        highPrice: high,
        priceCurrency: "USD",
        offerCount: nums.length,
      };
};

const BREADCRUMB_LABELS = {
  "/about": "About",
  "/preschool": "Preschool Gymnastics",
  "/recreational": "Recreational Gymnastics",
  "/competitive": "Competitive Team",
  "/cheer": "Cheer",
  "/camps": "Camps",
  "/birthday-parties": "Birthday Parties",
  "/special-events": "Special Events",
  "/calendar": "Calendar",
  "/college-recruits": "College Recruits",
  "/careers": "Careers",
  "/contact": "Contact",
};

const breadcrumb = (pathname) => {
  const items = [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` }];
  if (BREADCRUMB_LABELS[pathname]) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: BREADCRUMB_LABELS[pathname],
      item: `${SITE}${pathname}`,
    });
  }
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
};

const programSchema = (pathname) => {
  switch (pathname) {
    case "/preschool":
      return itemList(
        "Preschool Gymnastics Classes",
        PRESCHOOL_TIERS.map((t) =>
          course({
            name: `${t.name} Preschool Gymnastics`,
            description: t.focus,
            path: "/preschool",
            ages: AGES[t.name],
            workload: `PT${parseInt(t.length, 10)}M`,
          })
        )
      );

    case "/recreational":
      return itemList(
        "Recreational Gymnastics Classes",
        REC_LEVELS.map((l) =>
          course({
            name: `${l.name} Recreational Gymnastics${l.usag ? ` (${l.usag})` : ""}`,
            description: l.desc,
            path: "/recreational",
            ages: [5, 18],
            workload: `PT${parseInt(l.length, 10)}M`,
          })
        )
      );

    case "/competitive":
      return itemList(
        "Competitive Gymnastics Team Program",
        COMPETITIVE_PATH.map((p) =>
          course({
            name: p.name,
            description: `${p.detail}. ${p.desc}`,
            path: "/competitive",
            ages: AGES[p.name] || [6, 18],
          })
        )
      );

    case "/cheer":
      return itemList(
        "Cheer Classes & Competitive Cheer Teams",
        CHEER_TRACKS.map((t) =>
          course({ name: t.name, description: t.blurb, path: "/cheer", ages: [5, 18] })
        )
      );

    case "/camps": {
      const campCourse = course({
        name: "Summer Gymnastics Camps",
        description: `Themed weekly gymnastics camps for ${CAMP_INFO.ages.toLowerCase()}. Weeks include ${CAMP_SESSIONS.slice(0, 3)
          .map((s) => s.name)
          .join(", ")} and more.`,
        path: "/camps",
        ages: [6, 13],
      });
      const littleDog = course({
        name: "Little Dog Days Camp",
        description: LITTLE_DOG_DAYS.desc,
        path: "/camps",
        ages: [4, 6],
      });
      const ldOffer = offer(LITTLE_DOG_DAYS.price);
      if (ldOffer) littleDog.offers = ldOffer;
      return itemList("Gymnastics Camps", [campCourse, littleDog]);
    }

    case "/birthday-parties":
      return itemList(
        "Gymnastics Birthday Party Packages",
        PARTY_TIERS.map((t) => {
          const node = {
            "@type": "Service",
            serviceType: "Children's birthday party",
            name: t.name,
            description: `${t.age}, ${t.duration}, ${t.capacity}. ${t.deposit}.`,
            url: `${SITE}/birthday-parties`,
            provider: PROVIDER,
            areaServed: { "@type": "City", name: "Roanoke, TX" },
          };
          const o = offer(t.price);
          if (o) node.offers = { ...o, url: `${SITE}/contact` };
          return node;
        })
      );

    case "/special-events":
      return itemList(
        "Open Gym, Clinics & Parents' Night Out",
        SPECIAL_EVENTS.map((e) => {
          const node = {
            "@type": "Service",
            serviceType: "Youth gymnastics event",
            name: e.name,
            description: `${e.meta}. ${e.desc}`,
            url: `${SITE}/special-events`,
            provider: PROVIDER,
          };
          const o = offer(e.price);
          if (o) node.offers = { ...o, url: `${SITE}/contact` };
          return node;
        })
      );

    default:
      return null;
  }
};

export const buildPageSchema = (pathname) => {
  const nodes = [breadcrumb(pathname)];
  const program = programSchema(pathname);
  if (program) nodes.push(program);
  return nodes;
};
