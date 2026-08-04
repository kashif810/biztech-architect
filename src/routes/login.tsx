import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Staff Login — Evertech Corporation" },
      { name: "description", content: "Secure sign-in for Evertech Corporation staff to access the admin catalog and accounting portals." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Staff Login — Evertech Corporation" },
      { property: "og:description", content: "Secure sign-in for Evertech staff portals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/accounting", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in");
    navigate({ to: "/accounting", replace: true });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050914] text-white px-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl border border-white/10 bg-[#0b1428] p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-11 w-11 rounded-md bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
            <Lock className="h-5 w-5 text-sky-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Staff Sign In</h1>
            <p className="text-xs text-white/50">Evertech internal portals</p>
          </div>
        </div>
        <label className="block text-[11px] uppercase tracking-wider text-white/50 font-semibold">Email</label>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="mt-1 mb-4 w-full px-3 py-2.5 rounded-md bg-[#050914] border border-white/15 text-sm focus:outline-none focus:border-sky-500"
        />
        <label className="block text-[11px] uppercase tracking-wider text-white/50 font-semibold">Password</label>
        <input
          type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="mt-1 mb-6 w-full px-3 py-2.5 rounded-md bg-[#050914] border border-white/15 text-sm focus:outline-none focus:border-sky-500"
        />
        <button type="submit" disabled={busy} className="w-full px-4 py-2.5 rounded-md bg-sky-600 hover:bg-sky-500 text-sm font-semibold disabled:opacity-50">
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <p className="mt-4 text-[11px] text-white/40 text-center">Accounts are created by an administrator. Public sign-up is disabled.</p>
      </form>
    </main>
  );
}