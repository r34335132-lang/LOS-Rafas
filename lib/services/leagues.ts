import { supabase } from "@/lib/supabase";
import type {
  CardTemplate,
  CredentialRequest,
  League,
  Player,
  PlayerCard,
  PlayerProfile,
  PlayerStats,
  Team,
} from "@/lib/types";
import {
  credentialRequestInputSchema,
  leagueInputSchema,
  playerInputSchema,
  teamInputSchema,
  type CredentialRequestInput,
  type LeagueInput,
  type PlayerInput,
  type TeamInput,
} from "@/lib/validators";

export async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user?.id ?? null;
}

export async function fetchLeagues() {
  const { data, error } = await supabase
    .from("leagues")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as League[];
}

export async function fetchLeague(idOrSlug: string) {
  const column = idOrSlug.includes("-") && idOrSlug.length !== 36 ? "slug" : "id";
  const { data, error } = await supabase
    .from("leagues")
    .select("*")
    .eq(column, idOrSlug)
    .maybeSingle();
  if (error) throw error;
  return data as League | null;
}

export async function createLeague(input: LeagueInput) {
  const payload = leagueInputSchema.parse(input);
  const owner_id = await getCurrentUserId();

  const { data, error } = await supabase
    .from("leagues")
    .insert({ ...payload, owner_id })
    .select("*")
    .single();
  if (error) throw error;

  await ensureDefaultTemplates((data as League).id);
  return data as League;
}

export async function updateLeague(id: string, input: Partial<LeagueInput>) {
  const { data, error } = await supabase
    .from("leagues")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as League;
}

export async function fetchTeamsByLeague(leagueId: string) {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("league_id", leagueId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Team[];
}

export async function createTeam(input: TeamInput) {
  const payload = teamInputSchema.parse(input);
  const { data, error } = await supabase
    .from("teams")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data as Team;
}

export async function fetchPlayersByLeague(leagueId: string) {
  const { data, error } = await supabase
    .from("players")
    .select("*, teams(id,name,logo_url,primary_color,secondary_color), player_stats(*)")
    .eq("league_id", leagueId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Player[];
}

export async function fetchPlayerProfile(playerId: string) {
  const { data, error } = await supabase
    .from("players")
    .select("*, leagues(*), teams(*), player_stats(*)")
    .eq("id", playerId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const raw = data as Player & { leagues: League; teams: Team | null; player_stats: PlayerStats[] };
  return {
    ...raw,
    league: raw.leagues,
    team: raw.teams,
    stats: raw.player_stats?.[0] ?? null,
  } as PlayerProfile;
}

export async function createPlayer(input: PlayerInput) {
  const payload = playerInputSchema.parse(input);
  const code = await nextCredentialCode(payload.league_id);
  const { data, error } = await supabase
    .from("players")
    .insert({ ...payload, credential_code: code })
    .select("*")
    .single();
  if (error) throw error;
  return data as Player;
}

export async function nextCredentialCode(leagueId: string) {
  const league = await fetchLeague(leagueId);
  const prefix = (league?.slug ?? "liga").replace(/-/g, "").slice(0, 6).toUpperCase();
  const season = (league?.season ?? new Date().getFullYear().toString()).replace(/\D/g, "").slice(0, 4) || "2026";
  const { count, error } = await supabase
    .from("players")
    .select("id", { count: "exact", head: true })
    .eq("league_id", leagueId);
  if (error) throw error;
  return `${prefix}-PLAYER-${season}-${String((count ?? 0) + 1).padStart(4, "0")}`;
}

export async function createPlayerAccount(input: CredentialRequestInput) {
  const payload = credentialRequestInputSchema.parse(input);
  const token = `${payload.player_id}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();

  const { data, error } = await supabase
    .from("credential_requests")
    .insert({
      ...payload,
      invitation_token: token,
      expires_at: expiresAt,
      status: "pending",
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as CredentialRequest;
}

export async function fetchPlayerCredential(playerId: string) {
  const profile = await fetchPlayerProfile(playerId);
  if (!profile) return null;

  const { data: card } = await supabase
    .from("player_cards")
    .select("*")
    .eq("player_id", playerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return { profile, card: (card as PlayerCard | null) ?? null };
}

export async function fetchCardTemplates(leagueId: string) {
  const { data, error } = await supabase
    .from("card_templates")
    .select("*")
    .eq("league_id", leagueId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as CardTemplate[];
}

export async function saveDefaultCardTemplate(templateId: string, leagueId: string) {
  const { error: clearError } = await supabase
    .from("card_templates")
    .update({ is_default: false })
    .eq("league_id", leagueId);
  if (clearError) throw clearError;

  const { data, error } = await supabase
    .from("card_templates")
    .update({ is_default: true })
    .eq("id", templateId)
    .select("*")
    .single();
  if (error) throw error;
  return data as CardTemplate;
}

export async function upsertGeneratedPlayerCard(input: {
  player_id: string;
  league_id: string;
  template_id?: string | null;
  image_url?: string | null;
  card_data: Record<string, unknown>;
}) {
  const { data, error } = await supabase
    .from("player_cards")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data as PlayerCard;
}

export async function ensureDefaultTemplates(leagueId: string) {
  const existing = await fetchCardTemplates(leagueId);
  if (existing.length > 0) return existing;

  const templates = [
    {
      league_id: leagueId,
      name: "Upper Deck Elite",
      template_type: "upper_deck_elite",
      background_style: "gradient",
      is_default: true,
      layout_json: { logoPosition: "top-left", photoStyle: "cutout", frame: "metallic" },
    },
    {
      league_id: leagueId,
      name: "Rookie Card",
      template_type: "rookie_card",
      background_style: "solid_premium",
      is_default: false,
      layout_json: { logoPosition: "top-center", photoStyle: "vertical", badge: "ROOKIE" },
    },
    {
      league_id: leagueId,
      name: "MVP Edition",
      template_type: "mvp_edition",
      background_style: "gradient",
      is_default: false,
      layout_json: { logoPosition: "top-right", photoStyle: "full-card", badge: "MVP" },
    },
    {
      league_id: leagueId,
      name: "Team Identity",
      template_type: "team_identity",
      background_style: "sport_pattern",
      is_default: false,
      layout_json: { logoPosition: "top-left", photoStyle: "circular", teamWatermark: true },
    },
  ];

  const { data, error } = await supabase
    .from("card_templates")
    .insert(templates)
    .select("*");
  if (error) throw error;
  return (data ?? []) as CardTemplate[];
}
