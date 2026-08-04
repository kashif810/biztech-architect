import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Mail, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { hasUsers, createFirstAdmin } from "@/lib/setup-admin.functions";

export const Route = createFileRoute("/setup-admin")({
  ssr: false,
  beforeLoad: async () => {
    if (await hasUsers()) throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { title: "Create Admin Account — Evertech" },
      { name: "description", content: "One-time setup for Evertech admin and accounting portals." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SetupAdminPage,
});

function SetupAdminPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await createFirstAdmin({ email: email.trim(), password });
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      toast.success("Admin account created. Welcome to Evertech.");
      navigate({ to: "/admin", replace: true });
    } catch (err: any) {
      toast.error(err.message || "Failed to create admin account");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050914] text-white px-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl border border-white/10 bg-[#0b1428] p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-11 w-11 rounded-md bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-sky-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Create Admin Account</h1>
            <p className="text-xs text-white/50">One-time setup for Evertech portals</p>
          </div>
        </div>

        <label className="block text-[11px] uppercase tracking-wider text-white/50 font-semibold">Email</label>
        <div className="relative mt-1 mb-4">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-md bg-[#050914] border border-white/15 text-sm focus:outline-none focus:border-sky-500"
          />
        </div>

        <label className="block text-[11px] uppercase tracking-wider text-white/50 font-semibold">Password</label>
        <div className="relative mt-1 mb-6">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-md bg-[#050914] border border-white/15 text-sm focus:outline-none focus:border-sky-500"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full px-4 py-2.5 rounded-md bg-sky-600 hover:bg-sky-500 text-sm font-semibold disabled:opacity-50"
        >
          {busy ? "Creating…" : "Create admin account"}
        </button>

        <p className="mt-4 text-[11px] text-white/40 text-center">
          This page is only available while no admin account exists. After creation, use /login.
        </p>
      </form>
    </main>
  );
}
