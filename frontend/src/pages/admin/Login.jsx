import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { formatError } from "@/lib/api";
import SEO from "@/components/SEO";
import { LockKey } from "@phosphor-icons/react"; // eslint-disable-line no-unused-vars

export default function AdminLogin() {
  const { user, login } = useAuth();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  if (user) return <Navigate to="/admin/dashboard" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      toast.success("Welcome back!");
      nav("/admin/dashboard");
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6">
      <SEO title="Admin Login — Brevitus" description="Admin login for Brevitus Technology." />
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#111114] border border-[#27272a]" data-testid="login-card">
        <img src="/assets/brevitus-logo.jpeg" alt="Brevitus" className="h-14 w-14 rounded-xl object-cover bg-black" />
        <h1 className="font-heading text-3xl font-bold text-white mt-5">Brevitus Admin</h1>
        <p className="text-sm text-zinc-400 mt-1">Sign in to manage content and leads.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <div className="text-xs uppercase tracking-widest font-bold text-zinc-500 mb-1.5">Username</div>
            <input
              data-testid="username-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#18181b] border border-[#3f3f46] rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40"
            />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest font-bold text-zinc-500 mb-1.5">Password</div>
            <input
              data-testid="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#18181b] border border-[#3f3f46] rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40"
            />
          </div>
          <button type="submit" disabled={loading} data-testid="login-submit" className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm disabled:opacity-60">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
