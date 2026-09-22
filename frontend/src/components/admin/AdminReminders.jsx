import { useState } from "react";
import { BellRing, X } from "lucide-react";

/** Dated reminders that appear in the admin dashboard when the time comes. */
const REMINDERS = [
  {
    id: "smtp-retirement-2026",
    showFrom: "2026-11-01",
    title: "Heads up: website email method needs an update",
    body:
      "Microsoft is retiring the SMTP method our website uses to email staff@usgoldgymclub.com. Ask your web developer to switch the forms over to Microsoft's modern method (Graph) or to Resend so form notifications keep arriving. Nothing breaks today.",
  },
];

export const AdminReminders = () => {
  const [dismissed, setDismissed] = useState(() => JSON.parse(localStorage.getItem("usg_admin_reminders") || "[]"));

  const today = new Date().toISOString().slice(0, 10);
  const active = REMINDERS.filter((r) => today >= r.showFrom && !dismissed.includes(r.id));
  if (active.length === 0) return null;

  const dismiss = (id) => {
    const next = [...dismissed, id];
    localStorage.setItem("usg_admin_reminders", JSON.stringify(next));
    setDismissed(next);
  };

  return (
    <div className="space-y-3 mb-8" data-testid="admin-reminders">
      {active.map((r) => (
        <div
          key={r.id}
          className="border-2 border-coral bg-coral/[0.06] p-5 flex items-start gap-4"
          data-testid={`admin-reminder-${r.id}`}
        >
          <BellRing className="w-5 h-5 text-coral shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-display text-xl uppercase text-ink leading-none">{r.title}</div>
            <p className="text-ink/70 text-sm mt-2">{r.body}</p>
          </div>
          <button
            onClick={() => dismiss(r.id)}
            aria-label="Dismiss reminder"
            className="text-ink/40 hover:text-ink transition-colors"
            data-testid={`admin-reminder-dismiss-${r.id}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminReminders;
