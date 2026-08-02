import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "@/lib/api";

export const NewsletterSignup = ({ compact = false }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/newsletter", { email });
      toast.success(data.message);
      setEmail("");
    } catch (err) {
      toast.error(formatApiError(err?.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex w-full max-w-md gap-0" data-testid="newsletter-form">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 bg-white/[0.06] border border-white/20 border-r-0 text-white placeholder:text-white/40 px-4 py-3 text-sm outline-none focus:border-lime"
        data-testid="newsletter-email-input"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-lime text-ink font-display uppercase px-5 py-3 text-sm tracking-wide hover:bg-white transition-colors flex items-center gap-2 disabled:opacity-60"
        data-testid="newsletter-submit"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {!compact && "Join"}
      </button>
    </form>
  );
};

export default NewsletterSignup;
