import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing Supabase credentials");

const supabaseAdmin = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const testEmail = "test.setup.evertech@example.com";

async function main() {
  const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 100 });
  const user = list?.users?.find((u) => u.email === testEmail);
  if (user) {
    await supabaseAdmin.auth.admin.deleteUser(user.id);
    console.log("Deleted test user:", user.email);
  } else {
    console.log("No test user found");
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
