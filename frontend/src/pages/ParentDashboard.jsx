import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Reveal } from "@/components/common/Reveal";
import { CalendarDays, ShieldCheck, Ticket, User } from "lucide-react";

const TYPE_LABELS = {
  birthday_party: "Birthday Party",
  camp: "Camp",
  event: "Event",
  trial: "Free Trial",
};

const ParentDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bookings/me").then(({ data }) => setBookings(data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-ink min-h-screen pt-28 pb-20" data-testid="parent-dashboard">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-lime text-ink flex items-center justify-center"><User className="w-8 h-8" /></div>
          <div>
            <div className="text-lime text-xs uppercase tracking-[0.2em] font-bold">Membership Dashboard</div>
            <h1 className="font-display text-4xl md:text-5xl uppercase text-white leading-none">Hi, {user?.name?.split(" ")[0] || "Parent"}</h1>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <StatBox icon={Ticket} label="Total Bookings" value={bookings.length} />
          <StatBox icon={ShieldCheck} label="Waivers on File" value={bookings.filter((b) => b.waiver_agreed).length} />
          <StatBox icon={CalendarDays} label="Upcoming" value={bookings.filter((b) => new Date(b.date) >= new Date()).length} />
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-3xl uppercase text-white">Your Bookings</h2>
          <Link to="/calendar" className="text-lime text-sm uppercase tracking-wide font-bold hover:text-white" data-testid="dash-browse-events">Browse Events</Link>
        </div>

        {loading ? (
          <div className="text-white/50">Loading…</div>
        ) : bookings.length === 0 ? (
          <div className="border border-white/15 p-12 text-center">
            <p className="text-white/60 mb-5">No bookings yet. Book a birthday party, camp, or event to get started.</p>
            <Link to="/birthday-parties" className="inline-block bg-lime text-ink font-display uppercase px-6 py-3" data-testid="dash-book-party">Book a Party</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <Reveal key={b.id}>
                <div className="border border-white/15 bg-white/[0.03] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-lime transition-colors" data-testid="dash-booking-row">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="bg-lime text-ink text-[10px] uppercase tracking-wide font-bold px-2 py-1">{TYPE_LABELS[b.booking_type] || b.booking_type}</span>
                      <span className="font-display text-2xl uppercase text-white">{b.item_name}</span>
                    </div>
                    <div className="text-white/60 text-sm mt-2">
                      {b.date}{b.time_slot ? ` • ${b.time_slot}` : ""}{b.child_name ? ` • ${b.child_name}` : ""}{b.num_kids ? ` • ${b.num_kids} kid(s)` : ""}
                    </div>
                  </div>
                  <div className="text-right">
                    {b.price && <div className="text-lime font-display text-xl">{b.price}</div>}
                    <div className="flex items-center gap-1 text-green-400 text-xs uppercase tracking-wide justify-end mt-1">
                      <ShieldCheck className="w-3 h-3" /> Waiver signed
                    </div>
                    <div className="text-white/40 text-[10px] uppercase mt-1">{b.status}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatBox = ({ icon: Icon, label, value }) => (
  <div className="border border-white/15 bg-white/[0.03] p-6">
    <Icon className="w-6 h-6 text-lime mb-3" />
    <div className="font-display text-4xl text-white leading-none">{value}</div>
    <div className="text-white/50 text-xs uppercase tracking-wide mt-1">{label}</div>
  </div>
);

export default ParentDashboard;
