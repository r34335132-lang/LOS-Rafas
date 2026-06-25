export type SportType =
  | "soccer"
  | "flag"
  | "basketball"
  | "baseball"
  | "volleyball"
  | "other";

export type LeagueCategory =
  | "varonil"
  | "femenil"
  | "mixto"
  | "infantil"
  | "juvenil"
  | "libre";

export type VisualStyle =
  | "modern"
  | "upper_deck"
  | "urban"
  | "minimal"
  | "classic";

export type League = {
  id: string;
  owner_id: string | null;
  name: string;
  slug: string;
  city: string;
  state: string;
  sport: SportType;
  category: LeagueCategory;
  season: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  visual_style: VisualStyle;
  public_profiles_enabled?: boolean | null;
  created_at: string;
  updated_at: string;
};

export type Team = {
  id: string;
  league_id: string;
  name: string;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  coach_name: string | null;
  created_at: string;
};

export type Player = {
  id: string;
  league_id: string;
  team_id: string | null;
  auth_user_id: string | null;
  full_name: string;
  nickname: string | null;
  number: string;
  position: string;
  birth_date: string | null;
  photo_url: string | null;
  status: "active" | "pending" | "suspended";
  credential_code: string;
  created_at: string;
  updated_at: string;
  teams?: Pick<Team, "id" | "name" | "logo_url" | "primary_color" | "secondary_color"> | null;
  player_stats?: PlayerStats[];
};

export type PlayerStats = {
  id: string;
  player_id: string;
  league_id: string;
  season: string;
  games: number;
  points: number;
  touchdowns: number;
  goals: number;
  assists: number;
  tackles: number;
  interceptions: number;
  mvp_count: number;
  created_at: string;
  updated_at: string;
};

export type CardTemplate = {
  id: string;
  league_id: string;
  name: string;
  template_type: "upper_deck_elite" | "rookie_card" | "mvp_edition" | "team_identity" | string;
  background_style: "gradient" | "sport_pattern" | "solid_premium" | string;
  layout_json: Record<string, unknown>;
  is_default: boolean;
  created_at: string;
};

export type PlayerCard = {
  id: string;
  player_id: string;
  league_id: string;
  template_id: string | null;
  image_url: string | null;
  card_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type CredentialRequest = {
  id: string;
  player_id: string;
  league_id: string;
  email: string;
  phone: string | null;
  status: "pending" | "accepted" | "expired" | "cancelled";
  invitation_token: string;
  expires_at: string;
  created_at: string;
};

export type LeagueWithCounts = League & {
  teams_count?: number;
  players_count?: number;
};

export type PlayerProfile = Player & {
  league: League;
  team: Team | null;
  stats: PlayerStats | null;
};
