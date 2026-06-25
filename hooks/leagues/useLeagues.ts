import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createLeague,
  createPlayer,
  createPlayerAccount,
  createTeam,
  fetchCardTemplates,
  fetchLeague,
  fetchLeagues,
  fetchPlayerCredential,
  fetchPlayerProfile,
  fetchPlayersByLeague,
  fetchTeamsByLeague,
  saveDefaultCardTemplate,
} from "@/lib/services/leagues";
import type { CredentialRequestInput, LeagueInput, PlayerInput, TeamInput } from "@/lib/validators";

export const leagueKeys = {
  all: ["leagues"] as const,
  detail: (idOrSlug: string) => ["league", idOrSlug] as const,
  teams: (leagueId: string) => ["league", leagueId, "teams"] as const,
  players: (leagueId: string) => ["league", leagueId, "players"] as const,
  player: (playerId: string) => ["player", playerId] as const,
  credential: (playerId: string) => ["player", playerId, "credential"] as const,
  templates: (leagueId: string) => ["league", leagueId, "templates"] as const,
};

export function useLeagues() {
  return useQuery({ queryKey: leagueKeys.all, queryFn: fetchLeagues });
}

export function useLeague(idOrSlug: string | undefined) {
  return useQuery({
    queryKey: leagueKeys.detail(idOrSlug ?? ""),
    queryFn: () => fetchLeague(idOrSlug!),
    enabled: Boolean(idOrSlug),
  });
}

export function useCreateLeague() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LeagueInput) => createLeague(input),
    onSuccess: (league) => {
      queryClient.invalidateQueries({ queryKey: leagueKeys.all });
      queryClient.setQueryData(leagueKeys.detail(league.id), league);
      queryClient.setQueryData(leagueKeys.detail(league.slug), league);
    },
  });
}

export function useTeamsByLeague(leagueId: string | undefined) {
  return useQuery({
    queryKey: leagueKeys.teams(leagueId ?? ""),
    queryFn: () => fetchTeamsByLeague(leagueId!),
    enabled: Boolean(leagueId),
  });
}

export function useCreateTeam(leagueId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TeamInput) => createTeam(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: leagueKeys.teams(leagueId) }),
  });
}

export function usePlayersByLeague(leagueId: string | undefined) {
  return useQuery({
    queryKey: leagueKeys.players(leagueId ?? ""),
    queryFn: () => fetchPlayersByLeague(leagueId!),
    enabled: Boolean(leagueId),
  });
}

export function usePlayerProfile(playerId: string | undefined) {
  return useQuery({
    queryKey: leagueKeys.player(playerId ?? ""),
    queryFn: () => fetchPlayerProfile(playerId!),
    enabled: Boolean(playerId),
  });
}

export function useCreatePlayerAccount() {
  return useMutation({
    mutationFn: (input: CredentialRequestInput) => createPlayerAccount(input),
  });
}

export function useCreatePlayer(leagueId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PlayerInput) => createPlayer(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: leagueKeys.players(leagueId) }),
  });
}

export function usePlayerCredential(playerId: string | undefined) {
  return useQuery({
    queryKey: leagueKeys.credential(playerId ?? ""),
    queryFn: () => fetchPlayerCredential(playerId!),
    enabled: Boolean(playerId),
  });
}

export function useCardTemplates(leagueId: string | undefined) {
  return useQuery({
    queryKey: leagueKeys.templates(leagueId ?? ""),
    queryFn: () => fetchCardTemplates(leagueId!),
    enabled: Boolean(leagueId),
  });
}

export function useSaveDefaultCardTemplate(leagueId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (templateId: string) => saveDefaultCardTemplate(templateId, leagueId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: leagueKeys.templates(leagueId) }),
  });
}
