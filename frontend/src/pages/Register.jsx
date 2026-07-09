import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth, formatApiError } from "@/context/AuthContext";
import { IMG } from "@/data/site";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const upd = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail) || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ink" data-testid="register-page">
      <div className="flex items-center justify-center p-6 md:p-12 order-2 lg:order-1">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-lime text-sm uppercase tracking-wide mb-8" data-testid="register-back"><ArrowLeft className="w-4 h-4" /> Back to site</Link>
          <h1 className="font-display text-5xl uppercase text-white leading-none">Join Us<span className="text-lime">.</span></h1>
          <p className="text-white/60 mt-2 mb-8">Create a parent account to book classes, parties & events.</p>
          {error && <div className="bg-coral/15 border border-coral text-coral px-4 py-3 mb-5 text-sm" data-testid="register-error">{error}</div>}
          <form onSubmit={submit} className="space-y-5" data-testid="register-form">
            <div>
              <Label className="text-white/70 text-xs uppercase">Full Name</Label>
              <Input required value={form.name} onChange={upd("name")} className="bg-white/5 border-white/20 rounded-none text-white mt-1 h-12" data-testid="register-name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white/70 text-xs uppercase">Email</Label>
                <Input required type="email" value={form.email} onChange={upd("email")} className="bg-white/5 border-white/20 rounded-none text-white mt-1 h-12" data-testid="register-email" />
              </div>
              <div>
                <Label className="text-white/70 text-xs uppercase">Phone</Label>
                <Input value={form.phone} onChange={upd("phone")} className="bg-white/5 border-white/20 rounded-none text-white mt-1 h-12" data-testid="register-phone" />
              </div>
            </div>
            <div>
              <Label className="text-white/70 text-xs uppercase">Password</Label>
              <Input required type="password" minLength={6} value={form.password} onChange={upd("password")} className="bg-white/5 border-white/20 rounded-none text-white mt-1 h-12" data-testid="register-password" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-lime text-ink font-display uppercase text-lg py-4 hover:bg-white transition-colors disabled:opacity-60" data-testid="register-submit">
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
          <p className="text-white/60 mt-6 text-sm">
            Already a member? <Link to="/login" className="text-lime font-semibold hover:underline" data-testid="register-to-login">Log in</Link>
          </p>
        </div>
      </div>
      <div className="relative hidden lg:block order-1 lg:order-2">
        <img src={IMG.cheerJump} alt="Cheer" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      </div>
    </div>
  );
};

export default Register;
