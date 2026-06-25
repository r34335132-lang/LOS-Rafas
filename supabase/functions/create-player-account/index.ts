import { createClient } from "https://esm.sh/@supabase/supabase-js@2.107.0";

type Body = {
  player_id: string;
  league_id: string;
  email: string;
  phone?: string | null;
  redirect_to?: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      throw new Error("Missing Supabase function environment variables");
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: authData, error: authError } = await userClient.auth.getUser();
    if (authError || !authData.user) {
      return json({ error: "Unauthorized" }, 401);
    }

    const body = (await req.json()) as Body;
    if (!body.player_id || !body.league_id || !body.email) {
      return json({ error: "player_id, league_id and email are required" }, 400);
    }

    const { data: league, error: leagueError } = await adminClient
      .from("leagues")
      .select("id, owner_id, slug, season")
      .eq("id", body.league_id)
      .single();

    if (leagueError || !league) return json({ error: "League not found" }, 404);
    if (league.owner_id !== authData.user.id) return json({ error: "Forbidden" }, 403);

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();

    const { data: request, error: requestError } = await adminClient
      .from("credential_requests")
      .insert({
        player_id: body.player_id,
        league_id: body.league_id,
        email: body.email,
        phone: body.phone ?? null,
        status: "pending",
        invitation_token: token,
        expires_at: expiresAt,
      })
      .select("*")
      .single();

    if (requestError) throw requestError;

    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
      body.email,
      { redirectTo: body.redirect_to },
    );

    if (inviteError) {
      return json({ request, warning: inviteError.message }, 200);
    }

    if (inviteData.user?.id) {
      await adminClient
        .from("players")
        .update({ auth_user_id: inviteData.user.id, status: "pending" })
        .eq("id", body.player_id);
    }

    return json({ request, user_id: inviteData.user?.id ?? null }, 200);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
