import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api, { formatApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck } from "lucide-react";

export const BookingDialog = ({ bookingType, itemName, price = "", trigger }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: "", time_slot: "", child_name: "", num_kids: 1, notes: "",
    waiver_signed_name: "", waiver_agreed: false,
  });

  const upd = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.waiver_agreed) {
      toast.error("Please sign the waiver to complete your booking.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/bookings", {
        booking_type: bookingType,
        item_name: itemName,
        price,
        ...form,
        num_kids: Number(form.num_kids) || 1,
      });
      toast.success("Booking confirmed! View it in your dashboard.");
      setOpen(false);
      navigate("/dashboard");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-ink border border-white/15 text-white rounded-none max-w-lg max-h-[90vh] overflow-y-auto" data-testid="booking-dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl uppercase text-white">
            Book: <span className="text-lime">{itemName}</span>
          </DialogTitle>
          {price && <p className="text-white/60 text-sm">{price}</p>}
        </DialogHeader>

        {!user ? (
          <div className="py-8 text-center space-y-4">
            <p className="text-white/70">Please log in or create a parent account to complete your booking and sign the digital waiver.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setOpen(false); navigate("/login"); }} className="bg-lime text-ink font-display uppercase px-6 py-3" data-testid="booking-login">Log In</button>
              <button onClick={() => { setOpen(false); navigate("/register"); }} className="border border-white/30 text-white font-display uppercase px-6 py-3 hover:border-lime" data-testid="booking-register">Register</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4 mt-2" data-testid="booking-form">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/70 text-xs uppercase">Preferred Date</Label>
                <Input required type="date" value={form.date} onChange={upd("date")} className="bg-white/5 border-white/20 rounded-none text-white mt-1" data-testid="booking-date" />
              </div>
              <div>
                <Label className="text-white/70 text-xs uppercase">Time Slot</Label>
                <Input value={form.time_slot} onChange={upd("time_slot")} placeholder="e.g. 10:00 AM" className="bg-white/5 border-white/20 rounded-none text-white mt-1" data-testid="booking-time" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/70 text-xs uppercase">Child's Name</Label>
                <Input value={form.child_name} onChange={upd("child_name")} className="bg-white/5 border-white/20 rounded-none text-white mt-1" data-testid="booking-child" />
              </div>
              <div>
                <Label className="text-white/70 text-xs uppercase"># of Kids</Label>
                <Input type="number" min="1" value={form.num_kids} onChange={upd("num_kids")} className="bg-white/5 border-white/20 rounded-none text-white mt-1" data-testid="booking-kids" />
              </div>
            </div>
            <div>
              <Label className="text-white/70 text-xs uppercase">Notes (optional)</Label>
              <Textarea value={form.notes} onChange={upd("notes")} className="bg-white/5 border-white/20 rounded-none text-white mt-1" data-testid="booking-notes" />
            </div>

            <div className="border border-lime/40 bg-lime/5 p-4">
              <div className="flex items-center gap-2 text-lime font-bold uppercase text-xs tracking-wide mb-2">
                <ShieldCheck className="w-4 h-4" /> Digital Waiver & Release
              </div>
              <p className="text-white/50 text-xs leading-relaxed mb-3 max-h-24 overflow-y-auto">
                I acknowledge the inherent risks of gymnastics and physical activity. I release {" "}
                US Gold Gymnastics & Cheer Academy, its staff and owners from liability for injuries
                sustained during participation, and confirm I am the parent/legal guardian authorized
                to sign on behalf of the participant(s) named in this booking.
              </p>
              <div>
                <Label className="text-white/70 text-xs uppercase">Type your full name to sign</Label>
                <Input required value={form.waiver_signed_name} onChange={upd("waiver_signed_name")} className="bg-white/5 border-white/20 rounded-none text-white mt-1" data-testid="booking-signature" />
              </div>
              <label className="flex items-start gap-2 mt-3 cursor-pointer">
                <Checkbox
                  checked={form.waiver_agreed}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, waiver_agreed: !!v }))}
                  className="mt-0.5 border-white/40 data-[state=checked]:bg-lime data-[state=checked]:text-ink"
                  data-testid="booking-waiver-check"
                />
                <span className="text-white/70 text-xs">I have read and agree to the waiver above.</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-lime text-ink font-display uppercase text-lg py-4 hover:bg-white transition-colors disabled:opacity-60"
              data-testid="booking-submit"
            >
              {loading ? "Confirming..." : "Confirm Booking"}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
