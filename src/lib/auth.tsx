import { useEffect, useState } from "react";
import { redirect, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/** Client-side route gate for the private portals. Use inside `beforeLoad` with `ssr: false`. */
export async function requireSession() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw redirect({ to: "/login" });
  return { user: data.user };
}

export function useSessionEmail() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);
  return email;
}

export function LogoutButton({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  const email = useSessionEmail();
  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {email && <span className="text-xs opacity-70 truncate max-w-[180px]">{email}</span>}
      <button
        onClick={signOut}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-current/30 text-xs font-semibold hover:opacity-80"
      >
        <LogOut className="h-3.5 w-3.5" />
        Log out
      </button>
    </div>
  );
}