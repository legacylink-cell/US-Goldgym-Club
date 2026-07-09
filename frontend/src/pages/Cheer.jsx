import { PageHero } from "@/components/common/PageHero";
import { Reveal, SectionHeading } from "@/components/common/Reveal";
import { QuoteRequestDialog } from "@/components/common/QuoteRequestDialog";
import { MagneticButton } from "@/components/common/MagneticButton";
import { IMG, CHEER_TRACKS } from "@/data/site";
import { Check, ArrowUpRight } from "lucide-react";

const Cheer = () => (
  <div data-testid="cheer-page">
    <PageHero
      overline="Tumble & All-Star"
      title={<>Cheer<span className="text-lime">.</span></>}
      subtitle="From your first back handspring to competitive all-star squads — bring the energy, we'll bring the coaching."
      image={IMG.cheerJump}
    />

    <section className="bg-ink py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <SectionHeading overline="Two tracks" title="Pick your path" className="mb-12" />
        <div className="grid lg:grid-cols-2 gap-6">
          {CHEER_TRACKS.map((track, i) => (
            <Reveal key={track.name} delay={i * 0.1}>
              <div className="relative overflow-hidden border border-white/15 group h-full flex flex-col" data-testid={`cheer-track-${i}`}>
                <div className="h-64 overflow-hidden relative">
                  <img src={IMG[track.img]} alt={track.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
                  <div className="absolute bottom-4 left-5">
                    <div className="text-coral text-xs uppercase tracking-[0.2em] font-bold">{track.tag}</div>
                    <div className="font-display text-4xl uppercase text-white leading-none">{track.name}</div>
                  </div>
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1">
                    {track.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-white/75">
                        <Check className="w-5 h-5 text-lime shrink-0 mt-0.5" /> {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7">
                    {track.cta === "quote" ? (
                      <QuoteRequestDialog program="Cheer Tumble Classes" trigger={
                        <button className="bg-lime text-ink font-display uppercase px-6 py-3 hover:bg-white transition-colors flex items-center gap-2" data-testid="cheer-request-pricing">
                          Request Pricing <ArrowUpRight className="w-5 h-5" />
                        </button>
                      } />
                    ) : (
                      <MagneticButton as="link" to="/contact" variant="coral" className="px-6 py-3 text-base" data-testid="cheer-tryout">
                        Tryout Info <ArrowUpRight className="w-5 h-5" />
                      </MagneticButton>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 text-center border border-white/15 p-10 md:p-14">
            <h3 className="font-display text-4xl md:text-5xl uppercase text-white leading-none">Teamwork makes the dream work</h3>
            <p className="text-white/60 mt-4 max-w-2xl mx-auto">Our all-star program is built on discipline, performance, and family. Athletes train stunting, jumps, and routines while building bonds that last a lifetime.</p>
          </div>
        </Reveal>
      </div>
    </section>
  </div>
);

export default Cheer;
