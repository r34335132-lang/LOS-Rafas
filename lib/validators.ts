import { z } from "zod";

export const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Usa un color hexadecimal válido");

export const slugSchema = z
  .string()
  .min(3, "El slug debe tener al menos 3 caracteres")
  .max(40, "El slug es demasiado largo")
  .transform((value) =>
    value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
  )
  .refine((value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), "Slug inválido");

export const leagueInputSchema = z.object({
  name: z.string().min(3, "Escribe el nombre de la liga"),
  slug: slugSchema,
  city: z.string().min(2, "Escribe la ciudad"),
  state: z.string().min(2, "Escribe el estado"),
  sport: z.enum(["soccer", "flag", "basketball", "baseball", "volleyball", "other"]),
  category: z.enum(["varonil", "femenil", "mixto", "infantil", "juvenil", "libre"]),
  season: z.string().min(2, "Escribe la temporada"),
  description: z.string().max(180).optional().default(""),
  logo_url: z.string().url().nullable().optional(),
  banner_url: z.string().url().nullable().optional(),
  primary_color: hexColorSchema,
  secondary_color: hexColorSchema,
  accent_color: hexColorSchema,
  visual_style: z.enum(["modern", "upper_deck", "urban", "minimal", "classic"]),
});

export const teamInputSchema = z.object({
  league_id: z.string().uuid(),
  name: z.string().min(2),
  logo_url: z.string().url().nullable().optional(),
  primary_color: hexColorSchema.optional(),
  secondary_color: hexColorSchema.optional(),
  coach_name: z.string().nullable().optional(),
});

export const playerInputSchema = z.object({
  league_id: z.string().uuid(),
  team_id: z.string().uuid().nullable().optional(),
  full_name: z.string().min(2),
  nickname: z.string().nullable().optional(),
  number: z.string().min(1).max(4),
  position: z.string().min(1),
  birth_date: z.string().nullable().optional(),
  photo_url: z.string().url().nullable().optional(),
  status: z.enum(["active", "pending", "suspended"]).default("active"),
});

export const credentialRequestInputSchema = z.object({
  player_id: z.string().uuid(),
  league_id: z.string().uuid(),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
});

export type LeagueInput = z.input<typeof leagueInputSchema>;
export type LeagueInsert = z.output<typeof leagueInputSchema>;
export type TeamInput = z.input<typeof teamInputSchema>;
export type PlayerInput = z.input<typeof playerInputSchema>;
export type CredentialRequestInput = z.input<typeof credentialRequestInputSchema>;
