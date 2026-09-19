import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Phone, MapPin, Star, Instagram, Flame } from "lucide-react";
import { MagneticButton } from "@/components/common/MagneticButton";
import { Reveal, SectionHeading } from "@/components/common/Reveal";
import { IMG, PROGRAM_TILES, TESTIMONIALS, BUSINESS } from "@/data/site";
import api from "@/lib/api";

const SPOTLIGHT_COPY = {
  best_converting: { tag: "Families' Favorite", line: "Our most-loved program right now — families are signing up fast." },
  most_popular: { tag: "Most Popular", line: "The program families are exploring the most this season." },
  default: { tag: "Program Spotlight", line: "A favorite pathway for building strength, confidence, and skill." },
};
const SPOTLIGHT_IMG = {
  "/preschool": "preschoolBeam", "/recreational": "floorJump", "/competitive": "beamHandstand",
  "/cheer": "cheerJump", "/college-recruits": "handstand",
};

const ProgramSpotlight = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    api.get("/top-program").then(({ data }) => { if (data && data.name) setData(data); }).catch(() => {});
  }, []);
  if (!data) return null;
  const copy = SPOTLIGHT_COPY[data.reason] || SPOTLIGHT_COPY.default;
  const img = IMG[SPOTLIGHT_IMG[data.program]] || IMG.floorJump;
  return (
    <Reveal>
      <div className="relative overflow-hidden border border-lime/40 bg-gradient-to-r from-lime/[0.1] via-lime/[0.03] to-transparent mb-12" data-testid="program-spotlight">
        <div className="grid md:grid-cols-[1.25fr_1fr] items-stretch">
          <div className="p-8 md:p-10">
            <div className="inline-flex items-center gap-2 bg-lime text-ink px-3 py-1 text-xs uppercase font-bold tracking-wide mb-4">
              <Flame className="w-4 h-4" /> {copy.tag}
            </div>
            <h3 className="font-display text-4xl md:text-5xl uppercase text-white leading-none">{data.name}</h3>
            <p className="text-white/70 mt-3 max-w-md">{copy.line}</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <MagneticButton as="link" to={data.program} variant="lime" className="px-6 py-3" data-testid="spotlight-explore">
                Explore {data.name}
              </MagneticButton>
              <MagneticButton as="link" to="/contact" variant="outline" className="px-6 py-3" data-testid="spotlight-trial">
                Book Free Trial
              </MagneticButton>
            </div>
          </div>
          <div className="relative min-h-[220px] hidden md:block">
            <img src={img} alt={data.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/30 to-transparent" />
          </div>
        </div>
      </div>
    </Reveal>
  );
};

const TestimonialCard = ({ t }) => (
  <div className="border border-white/15 bg-white/[0.03] p-7 h-full hover:border-lime transition-colors duration-300">
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, k) => <Star key={k} className="w-4 h-4 fill-lime text-lime" />)}
    </div>
    <p className="text-white/80 leading-relaxed mb-6">"{t.quote}"</p>
    <div className="font-display uppercase text-pinklt text-lg">{t.name}</div>
    <div className="text-white/50 text-xs uppercase tracking-wide">{t.role}</div>
  </div>
);

const MobileTestimonials = ({ items }) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % items.length), 5000);
    return () => clearInterval(id);
  }, [items.length, paused]);

  return (
    <div className="md:hidden" data-testid="testimonials-mobile">
      <div
        className="relative min-h-[340px]"
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        {items.map((t, i) => (
          <motion.div
            key={t.name}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: active === i ? 1 : 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            style={{ pointerEvents: active === i ? "auto" : "none" }}
          >
            <TestimonialCard t={t} />
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center flex-wrap mt-3">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to review ${i + 1}`}
            className="w-8 h-8 flex items-center justify-center"
            data-testid={`testimonial-dot-${i}`}
          >
            <span className={`block h-2 rounded-full transition-all duration-300 ${active === i ? "w-6 bg-lime" : "w-2 bg-white/25"}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

const FadeTestimonials = ({ items, perPage = 4, interval = 5000 }) => {
  const pages = [];
  for (let i = 0; i < items.length; i += perPage) pages.push(items.slice(i, i + perPage));
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || pages.length <= 1) return;
    const id = setInterval(() => setPage((p) => (p + 1) % pages.length), interval);
    return () => clearInterval(id);
  }, [paused, pages.length, interval]);
  return (
    <div className="hidden md:block" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} data-testid="testimonials-desktop">
      <div className="relative min-h-[290px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {pages[page].map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center mt-6">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            aria-label={`Show reviews set ${i + 1}`}
            className="w-9 h-9 flex items-center justify-center group"
            data-testid={`testimonial-page-dot-${i}`}
          >
            <span className={`block h-2 rounded-full transition-all duration-300 ${page === i ? "w-8 bg-lime" : "w-2 bg-white/25 group-hover:bg-white/50"}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"], layoutEffect: false });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <motion.div style={{ y, scale }} className="absolute inset-0">
          <img src={IMG.heroVault} alt="Gymnast vaulting" className="w-full h-full object-cover" fetchPriority="high" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-black/40" />
        </motion.div>

        <div className="relative max-w-[1400px] mx-auto px-5 md:px-8 w-full pt-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-lime/40 bg-lime/10 px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-lime rounded-full animate-pulse" />
            <span className="text-pinklt text-xs uppercase tracking-[0.2em] font-bold">Now enrolling • Roanoke, TX</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem] uppercase text-white leading-[0.85] max-w-5xl"
          >
            Flip. Fly.<br /><span className="text-lime">Find</span> your<br />greatness.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 text-white/80 text-lg md:text-xl max-w-xl leading-relaxed"
          >
            Youth gymnastics & cheer for every age and every level — from first cartwheels
            to college recruiting. Your athlete's journey starts here.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <MagneticButton as="link" to="/contact" variant="lime" data-testid="hero-book-trial">
              Book Free Trial <ArrowUpRight className="w-5 h-5" />
            </MagneticButton>
            <MagneticButton
              as="a"
              href="#programs"
              variant="outline"
              data-testid="hero-explore"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("programs")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Programs
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* PROGRAMS BENTO */}
      <section id="programs" className="bg-ink py-20 md:py-32 scroll-mt-28">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionHeading overline="Find your track" title={<>Programs for<br />every athlete</>} />
            <p className="text-white/60 max-w-sm">
              Whether it's a preschooler's first tumble or a national-level routine, we build a pathway for every goal.
            </p>
          </div>

          <ProgramSpotlight />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {PROGRAM_TILES.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.08} className={`${t.span} col-span-1`}>
                <Link to={t.to} className="group relative block h-72 md:h-96 overflow-hidden" data-testid={`program-tile-${t.to}`}>
                  <img src={IMG[t.img]} alt={t.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-lime transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 p-7">
                    <div className="text-pinklt text-xs uppercase tracking-[0.2em] font-bold mb-2">{t.tag}</div>
                    <div className="font-display text-4xl md:text-5xl uppercase text-white leading-none flex items-center gap-2">
                      {t.title}
                      <ArrowUpRight className="w-7 h-7 text-lime opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE / WHY */}
      <section className="bg-cream text-ink py-20 md:py-32 diagonal-top">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div className="relative">
              <img src={IMG.coach} alt="Coaching" className="w-full h-[480px] object-cover hard-shadow" loading="lazy" decoding="async" />
              <div className="absolute -bottom-6 -right-4 bg-coral text-white p-6 hard-shadow max-w-[220px]">
                <div className="font-display text-4xl leading-none">USAG</div>
                <div className="text-xs uppercase tracking-wide mt-1">& USASF certified coaching staff</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionHeading light overline="Why we're different" title={<>Coaching that<br />builds humans</>} />
            <p className="mt-6 text-ink/80 text-lg leading-relaxed">
              We measure success in confidence, not just medals. Small class sizes, certified coaches,
              and a culture where every kid is celebrated. Families drive from Roanoke and the
              surrounding towns because what
              happens here sticks for life.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {["Small, focused class sizes", "Clear skill progressions", "Safety-first facility", "Family & community roots"].map((f) => (
                <div key={f} className="flex items-center gap-3 border-2 border-ink p-4 bg-white">
                  <Star className="w-5 h-5 text-coral shrink-0" />
                  <span className="font-semibold text-sm">{f}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-ink py-20 md:py-32">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12">
            <SectionHeading overline="Loved by families" title="What parents say" />
            <a href={BUSINESS.googleReviewsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 border border-white/15 px-5 py-3 hover:border-lime transition-colors self-start md:self-auto" data-testid="google-rating">
              <span className="font-display text-4xl text-lime leading-none">{BUSINESS.googleRating}</span>
              <span className="text-white/70 text-sm">
                <span className="flex gap-0.5 text-lime mb-1">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-lime text-lime" />)}</span>
                {BUSINESS.googleReviews}+ Google reviews
              </span>
            </a>
          </div>
          <MobileTestimonials items={TESTIMONIALS} />
          <FadeTestimonials items={TESTIMONIALS} />
        </div>
      </section>

      {/* INSTAGRAM STRIP */}
      <section className="bg-ink pb-20 md:pb-28">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Instagram className="w-6 h-6 text-lime" />
              <span className="font-display text-2xl uppercase text-white">@usgoldgym</span>
            </div>
            <a href={BUSINESS.instagram} target="_blank" rel="noreferrer" className="text-pinklt text-sm uppercase tracking-wide font-bold hover:text-white" data-testid="ig-follow">Follow</a>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[IMG.handstand, IMG.cheerJump, IMG.floorJump, IMG.beamHandstand, IMG.preschoolBeam, IMG.cheerSquad].map((src, i) => (
              <a key={i} href={BUSINESS.instagram} target="_blank" rel="noreferrer" className="relative aspect-square overflow-hidden group">
                <img src={src} alt="Instagram" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-lime/0 group-hover:bg-lime/20 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SCHEDULE TEASER + MAP */}
      <section className="bg-cream text-ink py-20 md:py-28 diagonal-top">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-10 items-stretch">
          <Reveal>
            <SectionHeading light overline="Drop by" title="Come see the gym" />
            <p className="mt-5 text-ink/70 text-lg">Free trials available all week. Call ahead and we'll get your athlete on the schedule.</p>
            <div className="mt-8 space-y-4">
              <a href={`tel:${BUSINESS.phoneRaw}`} className="flex items-center gap-4 border-2 border-ink p-5 bg-white hover:bg-lime transition-colors" data-testid="home-call">
                <Phone className="w-6 h-6" /><span className="font-display text-2xl uppercase">{BUSINESS.phone}</span>
              </a>
              <div className="flex items-start gap-4 border-2 border-ink p-5 bg-white">
                <MapPin className="w-6 h-6 shrink-0" /><span className="font-semibold">{BUSINESS.address}</span>
              </div>
            </div>
            <div className="mt-8">
              <MagneticButton as="link" to="/calendar" variant="dark" data-testid="home-view-calendar">View Live Schedule</MagneticButton>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <iframe title="map" src={BUSINESS.mapEmbed} className="w-full h-full min-h-[400px] border-2 border-ink hard-shadow" loading="lazy" />
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Home;
