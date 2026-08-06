import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth, formatApiError } from "@/context/AuthContext";
import { IMG } from "@/data/site";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const u = await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate(u.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail) || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ink" data-testid="login-page">
      <div className="relative hidden lg:block">
        <img src={IMG.beamHandstand} alt="Gymnast" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="absolute bottom-10 left-10">
          <div className="font-display text-5xl text-white uppercase leading-none">US<span className="text-lime">Gold</span></div>
          <p className="text-white/70 mt-2 max-w-xs">Staff &amp; owner access to your website dashboard.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-lime text-sm uppercase tracking-wide mb-8" data-testid="login-back"><ArrowLeft className="w-4 h-4" /> Back to site</Link>
          <h1 className="font-display text-5xl uppercase text-white leading-none">Admin Login<span className="text-lime">.</span></h1>
          <p className="text-white/60 mt-2 mb-8">Sign in to your website dashboard.</p>
          {error && <div className="bg-coral/15 border border-coral text-coral px-4 py-3 mb-5 text-sm" data-testid="login-error">{error}</div>}
          <form onSubmit={submit} className="space-y-5" data-testid="login-form">
            <div>
              <Label className="text-white/70 text-xs uppercase">Email</Label>
              <Input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="bg-white/5 border-white/20 rounded-none text-white mt-1 h-12" data-testid="login-email" />
            </div>
            <div>
              <Label className="text-white/70 text-xs uppercase">Password</Label>
              <Input required type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="bg-white/5 border-white/20 rounded-none text-white mt-1 h-12" data-testid="login-password" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-lime text-ink font-display uppercase text-lg py-4 hover:bg-white transition-colors disabled:opacity-60" data-testid="login-submit">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
