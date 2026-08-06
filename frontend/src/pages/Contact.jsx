import { useState } from "react";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import api, { formatApiError } from "@/lib/api";
import { trackConversion } from "@/lib/analytics";
import { PageHero } from "@/components/common/PageHero";
import { Reveal, SectionHeading } from "@/components/common/Reveal";
import { IMG, BUSINESS, CONTACT_TOPICS } from "@/data/site";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: "General Inquiry", message: "" });
  const [loading, setLoading] = useState(false);
  const upd = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact", form);
      trackConversion("contact_submitted");
      toast.success("Message sent! We'll be in touch soon.");
      setForm({ name: "", email: "", phone: "", topic: "General Inquiry", message: "" });
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="contact-page">
      <PageHero
        overline="Get in touch"
        title={<>Let's talk<span className="text-lime">.</span></>}
        subtitle="Questions, enrollment, tryouts, or a free trial — reach out and a real human from our team will get back to you."
        image={IMG.facilityEquip}
      />

      <section className="bg-ink py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-14">
          <Reveal>
            <SectionHeading overline="Send a message" title="Drop us a line" className="mb-8" />
            <form onSubmit={submit} className="space-y-5" data-testid="contact-form">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70 text-xs uppercase">Name</Label>
                  <Input required value={form.name} onChange={upd("name")} className="bg-white/5 border-white/20 rounded-none text-white mt-1" data-testid="contact-name" />
                </div>
                <div>
                  <Label className="text-white/70 text-xs uppercase">Phone</Label>
                  <Input value={form.phone} onChange={upd("phone")} className="bg-white/5 border-white/20 rounded-none text-white mt-1" data-testid="contact-phone" />
                </div>
              </div>
              <div>
                <Label className="text-white/70 text-xs uppercase">Email</Label>
                <Input required type="email" value={form.email} onChange={upd("email")} className="bg-white/5 border-white/20 rounded-none text-white mt-1" data-testid="contact-email" />
              </div>
              <div>
                <Label className="text-white/70 text-xs uppercase">Topic</Label>
                <Select value={form.topic} onValueChange={(v) => setForm((f) => ({ ...f, topic: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/20 rounded-none text-white mt-1" data-testid="contact-topic">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-ink border-white/20 text-white rounded-none">
                    {CONTACT_TOPICS.map((t) => (
                      <SelectItem key={t} value={t} className="focus:bg-lime focus:text-ink" data-testid={`topic-${t}`}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/70 text-xs uppercase">Message</Label>
                <Textarea required value={form.message} onChange={upd("message")} rows={5} className="bg-white/5 border-white/20 rounded-none text-white mt-1" data-testid="contact-message" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-lime text-ink font-display uppercase text-lg py-4 hover:bg-white transition-colors disabled:opacity-60" data-testid="contact-submit">
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-4">
              <a href={`tel:${BUSINESS.phoneRaw}`} className="flex items-center gap-4 border border-white/15 p-6 hover:border-lime transition-colors group" data-testid="contact-call-btn">
                <div className="w-12 h-12 bg-lime text-ink flex items-center justify-center shrink-0"><Phone className="w-6 h-6" /></div>
                <div>
                  <div className="text-white/50 text-xs uppercase tracking-wide">Click to call</div>
                  <div className="font-display text-2xl uppercase text-white group-hover:text-lime transition-colors">{BUSINESS.phone}</div>
                </div>
              </a>
              <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-4 border border-white/15 p-6 hover:border-lime transition-colors" data-testid="contact-email-btn">
                <div className="w-12 h-12 bg-coral text-white flex items-center justify-center shrink-0"><Mail className="w-6 h-6" /></div>
                <div>
                  <div className="text-white/50 text-xs uppercase tracking-wide">Email us</div>
                  <div className="text-white font-semibold">{BUSINESS.email}</div>
                </div>
              </a>
              <div className="flex items-center gap-4 border border-white/15 p-6">
                <div className="w-12 h-12 bg-white/10 text-white flex items-center justify-center shrink-0"><MapPin className="w-6 h-6" /></div>
                <div className="text-white font-semibold">{BUSINESS.address}</div>
              </div>
              <div className="border border-white/15 p-6">
                <div className="flex items-center gap-2 text-lime text-xs uppercase tracking-[0.2em] font-bold mb-3"><Clock className="w-4 h-4" /> Business Hours</div>
                {BUSINESS.hours.map((h) => (
                  <div key={h.day} className="flex justify-between text-white/70 py-1 border-b border-white/5 last:border-0">
                    <span className="font-semibold text-white">{h.day}</span><span>{h.time}</span>
                  </div>
                ))}
              </div>
              <iframe title="map" src={BUSINESS.mapEmbed} className="w-full h-64 border border-white/15" loading="lazy" />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Contact;
