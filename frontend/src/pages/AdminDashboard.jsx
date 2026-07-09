import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Users, Ticket, MessageSquare, Inbox } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ leads: 0, contacts: 0, bookings: 0, parents: 0 });
  const [leads, setLeads] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/admin/stats").then(({ data }) => setStats(data));
    api.get("/admin/leads").then(({ data }) => setLeads(data));
    api.get("/admin/contacts").then(({ data }) => setContacts(data));
    api.get("/admin/bookings").then(({ data }) => setBookings(data));
  }, []);

  return (
    <div className="bg-ink min-h-screen pt-28 pb-20" data-testid="admin-dashboard">
      <div className="max-w-[1300px] mx-auto px-5 md:px-8">
        <div className="text-coral text-xs uppercase tracking-[0.2em] font-bold mb-2">Admin Control</div>
        <h1 className="font-display text-5xl uppercase text-white leading-none mb-10">Dashboard<span className="text-lime">.</span></h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatBox icon={Inbox} label="Pricing Requests" value={stats.leads} />
          <StatBox icon={MessageSquare} label="Contact Messages" value={stats.contacts} />
          <StatBox icon={Ticket} label="Bookings" value={stats.bookings} />
          <StatBox icon={Users} label="Parent Accounts" value={stats.parents} />
        </div>

        <Tabs defaultValue="leads">
          <TabsList className="bg-white/5 border border-white/15 rounded-none p-1">
            <TabsTrigger value="leads" className="rounded-none data-[state=active]:bg-lime data-[state=active]:text-ink uppercase font-bold text-xs" data-testid="admin-tab-leads">Pricing Requests</TabsTrigger>
            <TabsTrigger value="contacts" className="rounded-none data-[state=active]:bg-lime data-[state=active]:text-ink uppercase font-bold text-xs" data-testid="admin-tab-contacts">Messages</TabsTrigger>
            <TabsTrigger value="bookings" className="rounded-none data-[state=active]:bg-lime data-[state=active]:text-ink uppercase font-bold text-xs" data-testid="admin-tab-bookings">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="mt-6">
            <Table headers={["Name", "Contact", "Program", "Child / Freq", "Message"]} rows={leads.map((l) => [
              l.name,
              <span>{l.email}<br /><span className="text-white/50">{l.phone}</span></span>,
              l.program,
              <span>{l.child_name} {l.child_age && `(${l.child_age})`}<br /><span className="text-white/50">{l.frequency}</span></span>,
              l.message,
            ])} testid="admin-leads-table" empty="No pricing requests yet." />
          </TabsContent>

          <TabsContent value="contacts" className="mt-6">
            <Table headers={["Name", "Contact", "Topic", "Message"]} rows={contacts.map((c) => [
              c.name,
              <span>{c.email}<br /><span className="text-white/50">{c.phone}</span></span>,
              c.topic,
              c.message,
            ])} testid="admin-contacts-table" empty="No messages yet." />
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            <Table headers={["Parent", "Type", "Item", "Date", "Kids", "Waiver"]} rows={bookings.map((b) => [
              <span>{b.user_name}<br /><span className="text-white/50">{b.user_email}</span></span>,
              b.booking_type,
              b.item_name,
              <span>{b.date}<br /><span className="text-white/50">{b.time_slot}</span></span>,
              b.num_kids,
              <span className="text-green-400">{b.waiver_signed_name}</span>,
            ])} testid="admin-bookings-table" empty="No bookings yet." />
          </TabsContent>
        </Tabs>
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

const Table = ({ headers, rows, testid, empty }) => (
  <div className="border border-white/15 overflow-x-auto" data-testid={testid}>
    {rows.length === 0 ? (
      <div className="p-10 text-center text-white/50">{empty}</div>
    ) : (
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/5 text-left">
            {headers.map((h) => <th key={h} className="px-4 py-3 text-lime uppercase text-xs tracking-wide font-bold whitespace-nowrap">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-white/10 text-white/80 align-top">
              {r.map((cell, j) => <td key={j} className="px-4 py-3">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default AdminDashboard;
