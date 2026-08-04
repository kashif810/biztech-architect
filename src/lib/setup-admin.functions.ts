import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const hasUsers = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 });
    if (error) throw new Error(error.message);
    return (data?.users.length ?? 0) > 0;
  });

export const createFirstAdmin = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        email: z.string().email(),
        password: z.string().min(8),
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: listData } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 });
    if ((listData?.users.length ?? 0) > 0) {
      throw new Error("An admin account already exists. Please sign in.");
    }

    const { error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { role: "admin" },
    });

    if (error) throw new Error(error.message);
    return { email: data.email };
  });

