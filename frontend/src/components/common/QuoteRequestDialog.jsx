import { useState } from "react";
import { toast } from "sonner";
import api, { formatApiError } from "@/lib/api";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const QuoteRequestDialog = ({ program, trigger }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", child_name: "", child_age: "", frequency: "", message: "",
  });

  const upd = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/leads", { ...form, program });
      toast.success("Request received! Our team will reach out with pricing shortly.");
      setOpen(false);
      setForm({ name: "", email: "", phone: "", child_name: "", child_age: "", frequency: "", message: "" });
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-ink border border-white/15 text-white rounded-none max-w-lg max-h-[90vh] overflow-y-auto" data-testid="quote-dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl uppercase text-white">
            Request Pricing<span className="text-lime">.</span>
          </DialogTitle>
          <p className="text-white/60 text-sm">{program} — tuition varies by weekly frequency. Tell us about your athlete and we'll send a personalized quote.</p>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4 mt-2" data-testid="quote-form">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-white/70 text-xs uppercase">Your Name</Label>
              <Input required value={form.name} onChange={upd("name")} className="bg-white/5 border-white/20 rounded-none text-white mt-1" data-testid="quote-name" />
            </div>
            <div>
              <Label className="text-white/70 text-xs uppercase">Phone</Label>
              <Input required value={form.phone} onChange={upd("phone")} className="bg-white/5 border-white/20 rounded-none text-white mt-1" data-testid="quote-phone" />
            </div>
          </div>
          <div>
            <Label className="text-white/70 text-xs uppercase">Email</Label>
            <Input required type="email" value={form.email} onChange={upd("email")} className="bg-white/5 border-white/20 rounded-none text-white mt-1" data-testid="quote-email" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-white/70 text-xs uppercase">Child's Name</Label>
              <Input value={form.child_name} onChange={upd("child_name")} className="bg-white/5 border-white/20 rounded-none text-white mt-1" data-testid="quote-child-name" />
            </div>
            <div>
              <Label className="text-white/70 text-xs uppercase">Child's Age</Label>
              <Input value={form.child_age} onChange={upd("child_age")} className="bg-white/5 border-white/20 rounded-none text-white mt-1" data-testid="quote-child-age" />
            </div>
          </div>
          <div>
            <Label className="text-white/70 text-xs uppercase">Preferred Weekly Frequency</Label>
            <Input value={form.frequency} onChange={upd("frequency")} placeholder="e.g. 1x / 2x per week" className="bg-white/5 border-white/20 rounded-none text-white mt-1" data-testid="quote-frequency" />
          </div>
          <div>
            <Label className="text-white/70 text-xs uppercase">Message (optional)</Label>
            <Textarea value={form.message} onChange={upd("message")} className="bg-white/5 border-white/20 rounded-none text-white mt-1" data-testid="quote-message" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lime text-ink font-display uppercase text-lg py-4 hover:bg-white transition-colors disabled:opacity-60"
            data-testid="quote-submit"
          >
            {loading ? "Sending..." : "Send Request"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteRequestDialog;
