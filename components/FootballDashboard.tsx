import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { LeagueBrandPreview } from "@/components/league/LeagueBrandPreview";
import { StatPill } from "@/components/league/StatPill";
import {
  useLeagues,
  usePlayersByLeague,
  useTeamsByLeague,
} from "@/hooks/leagues/useLeagues";
import type { Player, PlayerStats, Team } from "@/lib/types";

const FALLBACK_ACCENT = "#39FF14";
const GOLD = "#FFD600";

function statsFor(player: Player) {
  return player.player_stats?.[0] as PlayerStats | undefined;
}

export function FootballDashboard({ tournament }: { tournament: string }) {
  const leaguesQuery = useLeagues();
  const soccerLeague = useMemo(
    () => leaguesQuery.data?.find((league) => league.sport === "soccer") ?? leaguesQuery.data?.[0] ?? null,
    [leaguesQuery.data],
  );

  const teamsQuery = useTeamsByLeague(soccerLeague?.id);
  const playersQuery = usePlayersByLeague(soccerLeague?.id);
  const accent = soccerLeague?.accent_color ?? FALLBACK_ACCENT;

  const refresh = () => {
    leaguesQuery.refetch();
    teamsQuery.refetch();
    playersQuery.refetch();
  };

  const players = playersQuery.data ?? [];
  const teams = teamsQuery.data ?? [];
  const topPlayer = [...players].sort((a, b) => (statsFor(b)?.goals ?? 0) - (statsFor(a)?.goals ?? 0))[0];

  if (leaguesQuery.isLoading) {
    return <FootballState accent={accent} title="Cargando ligas" text="Conectando con Supabase..." />;
  }

  if (leaguesQuery.isError) {
    return (
      <FootballState
        accent={accent}
        title="No se pudo cargar fútbol"
        text="Revisa la conexión de Supabase y las políticas RLS."
        action="REINTENTAR"
        onAction={refresh}
      />
    );
  }

  if (!soccerLeague) {
    return (
      <FootballState
        accent={accent}
        title="Sin ligas creadas"
        text="Crea una liga en Supabase para llenar esta sección con datos reales."
        action="CREAR LIGA"
        onAction={() => router.push("/create-league")}
      />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={teamsQuery.isRefetching || playersQuery.isRefetching} onRefresh={refresh} tintColor={accent} />}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(450)}>
        <LeagueBrandPreview league={soccerLeague} />
      </Animated.View>

      <View style={styles.summaryGrid}>
        <SummaryCard accent={accent} icon="shield-star-outline" value={teams.length} label="EQUIPOS" />
        <SummaryCard accent={accent} icon="account-group-outline" value={players.length} label="JUGADORES" />
        <SummaryCard accent={accent} icon="soccer" value={players.reduce((sum, player) => sum + (statsFor(player)?.goals ?? 0), 0)} label="GOLES" />
        <SummaryCard accent={accent} icon="trophy-outline" value={tournament} label="TORNEO" compact />
      </View>

      {topPlayer ? (
        <FeaturedPlayer player={topPlayer} accent={accent} />
      ) : (
        <EmptyInline
          accent={accent}
          title="Aún no hay jugadores"
          text="Agrega jugadores desde el panel de liga para mostrar fichas, rankings y credenciales reales."
          action="VER LIGA"
          onAction={() => router.push(`/league/${soccerLeague.id}` as any)}
        />
      )}

      <SectionTitle accent={accent} icon="format-list-numbered" title="Tabla de equipos" eyebrow={soccerLeague.name} />
      {teams.length ? <TeamsTable teams={teams} accent={accent} /> : <EmptyInline accent={accent} title="Sin equipos" text="Registra equipos para iniciar la clasificación." />}

      <SectionTitle accent={accent} icon="trophy-outline" title="Ranking de goleadores" eyebrow="Datos de Supabase" />
      {players.length ? <Scorers players={players} teams={teams} accent={accent} /> : <EmptyInline accent={accent} title="Sin ranking" text="El ranking aparecerá cuando existan jugadores con estadísticas." />}
    </ScrollView>
  );
}

function FootballState({
  accent,
  title,
  text,
  action,
  onAction,
}: {
  accent: string;
  title: string;
  text: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.stateWrap}>
      <LinearGradient colors={[`${accent}1F`, "#0A0A0A"]} style={StyleSheet.absoluteFillObject} />
      <MaterialCommunityIcons name="soccer" size={54} color={accent} />
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateText}>{text}</Text>
      {action ? (
        <Pressable onPress={onAction} style={[styles.stateButton, { backgroundColor: accent }]}>
          <Text style={styles.stateButtonText}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function SummaryCard({
  icon,
  value,
  label,
  accent,
  compact = false,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  value: number | string;
  label: string;
  accent: string;
  compact?: boolean;
}) {
  return (
    <View style={styles.summaryCard}>
      <MaterialCommunityIcons name={icon} size={18} color={accent} />
      <Text style={[styles.summaryValue, compact && styles.summaryValueCompact]} numberOfLines={1}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function SectionTitle({
  icon,
  eyebrow,
  title,
  accent,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  eyebrow: string;
  title: string;
  accent: string;
}) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={[styles.sectionIcon, { borderColor: `${accent}33`, backgroundColor: `${accent}12` }]}>
        <MaterialCommunityIcons name={icon} size={20} color={accent} />
      </View>
      <View>
        <Text style={[styles.eyebrow, { color: accent }]}>{eyebrow.toUpperCase()}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
    </View>
  );
}

function FeaturedPlayer({ player, accent }: { player: Player; accent: string }) {
  const stats = statsFor(player);

  return (
    <Animated.View entering={FadeInDown.duration(450)} style={styles.featureBlock}>
      <SectionTitle accent={accent} icon="account-star-outline" eyebrow="Figura real" title="Jugador destacado" />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ver perfil de ${player.full_name}`}
        onPress={() => router.push(`/player/${player.id}`)}
        style={({ pressed }) => [styles.playerCard, { borderColor: `${accent}40` }, pressed && styles.pressed]}
      >
        <LinearGradient colors={[`${accent}22`, "rgba(10,10,10,0.94)"]} style={StyleSheet.absoluteFillObject} />
        <View style={styles.playerVisual}>
          {player.photo_url ? (
            <Image source={{ uri: player.photo_url }} style={styles.avatar} resizeMode="cover" />
          ) : (
            <View style={styles.avatarFallback}>
              <Ionicons name="person" size={62} color="rgba(255,255,255,0.25)" />
            </View>
          )}
          <View style={[styles.numberBadge, { backgroundColor: accent }]}>
            <Text style={styles.numberText}>{player.number}</Text>
          </View>
        </View>
        <View style={styles.playerContent}>
          <Text style={[styles.playerPosition, { color: accent }]}>{player.position.toUpperCase()}</Text>
          <Text style={styles.playerName}>{player.full_name}</Text>
          <Text style={styles.playerTeam}>{player.teams?.name ?? "Sin equipo asignado"}</Text>
          <View style={styles.playerStats}>
            <StatPill label="PARTIDOS" value={stats?.games ?? 0} accent={accent} />
            <StatPill label="GOLES" value={stats?.goals ?? 0} accent={accent} />
            <StatPill label="ASIST." value={stats?.assists ?? 0} accent={accent} />
          </View>
          <View style={styles.profileLink}>
            <Text style={[styles.profileLinkText, { color: accent }]}>VER CREDENCIAL Y ESTADÍSTICAS</Text>
            <Ionicons name="arrow-forward" size={15} color={accent} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function TeamsTable({ teams, accent }: { teams: Team[]; accent: string }) {
  return (
    <View style={styles.tableCard}>
      {teams.map((team, index) => (
        <View key={team.id} style={styles.teamRow}>
          <Text style={[styles.position, index === 0 && { color: GOLD }]}>{index + 1}</Text>
          <View style={[styles.teamBadge, { backgroundColor: team.primary_color ?? accent }]}>
            <Text style={styles.teamBadgeText}>{team.name.slice(0, 3).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.teamName}>{team.name}</Text>
            <Text style={styles.teamCoach}>{team.coach_name ? `Coach: ${team.coach_name}` : "Coach pendiente"}</Text>
          </View>
          {index === 0 ? <Ionicons name="trophy" size={18} color={GOLD} /> : null}
        </View>
      ))}
    </View>
  );
}

function Scorers({ players, teams, accent }: { players: Player[]; teams: Team[]; accent: string }) {
  const teamMap = new Map(teams.map((team) => [team.id, team]));
  const sorted = [...players].sort((a, b) => (statsFor(b)?.goals ?? 0) - (statsFor(a)?.goals ?? 0));

  return (
    <View style={styles.tableCard}>
      {sorted.map((player, index) => {
        const stats = statsFor(player);
        const team = player.team_id ? teamMap.get(player.team_id) : null;
        const top = index === 0;
        return (
          <Pressable key={player.id} onPress={() => router.push(`/player/${player.id}`)} style={styles.scorerRow}>
            <View style={[styles.rankBadge, top && { backgroundColor: GOLD }]}>
              <Text style={[styles.rankText, top && { color: "#050505" }]}>{top ? "★" : index + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.scorerNameLine}>
                <Text style={styles.scorerName}>{player.full_name}</Text>
                {top ? <Text style={styles.topTag}>LÍDER</Text> : null}
              </View>
              <Text style={styles.scorerTeam}>{team?.name ?? "Sin equipo"} · {stats?.games ?? 0} PJ</Text>
            </View>
            <Text style={[styles.goalValue, { color: top ? GOLD : accent }]}>{stats?.goals ?? 0}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function EmptyInline({
  accent,
  title,
  text,
  action,
  onAction,
}: {
  accent: string;
  title: string;
  text: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={[styles.emptyInline, { borderColor: `${accent}28` }]}>
      <MaterialCommunityIcons name="database-search-outline" size={32} color={accent} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
      {action ? (
        <Pressable onPress={onAction} style={[styles.inlineButton, { borderColor: accent }]}>
          <Text style={[styles.inlineButtonText, { color: accent }]}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 30, gap: 26 },
  stateWrap: { marginHorizontal: 24, marginTop: 28, minHeight: 280, borderRadius: 22, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", backgroundColor: "#0A0A0A", overflow: "hidden", alignItems: "center", justifyContent: "center", padding: 24 },
  stateTitle: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 22, textAlign: "center", marginTop: 16 },
  stateText: { color: "rgba(255,255,255,0.5)", fontFamily: "Inter_500Medium", fontSize: 13, textAlign: "center", lineHeight: 20, marginTop: 8 },
  stateButton: { borderRadius: 14, paddingHorizontal: 18, paddingVertical: 12, marginTop: 18 },
  stateButtonText: { color: "#050505", fontFamily: "Inter_900Black", fontSize: 11, letterSpacing: 1 },
  summaryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  summaryCard: { flexGrow: 1, flexBasis: 120, minWidth: 120, flexDirection: "row", alignItems: "center", gap: 7, padding: 11, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.07)" },
  summaryValue: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 17, maxWidth: 120 },
  summaryValueCompact: { fontSize: 12 },
  summaryLabel: { color: "rgba(255,255,255,0.44)", fontFamily: "Inter_800ExtraBold", fontSize: 8, letterSpacing: 0.8 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 11, marginBottom: 14 },
  sectionIcon: { width: 40, height: 40, borderRadius: 11, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  eyebrow: { fontFamily: "Inter_800ExtraBold", fontSize: 9, letterSpacing: 1.4, marginBottom: 2 },
  sectionTitle: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 19, letterSpacing: -0.4 },
  featureBlock: { gap: 0 },
  playerCard: { borderRadius: 20, overflow: "hidden", borderWidth: 1, backgroundColor: "#0A0A0A" },
  pressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
  playerVisual: { minHeight: 230, position: "relative", backgroundColor: "#141414" },
  avatar: { width: "100%", height: "100%", position: "absolute" },
  avatarFallback: { flex: 1, alignItems: "center", justifyContent: "center" },
  numberBadge: { position: "absolute", left: 16, bottom: 14, width: 55, height: 55, borderRadius: 15, alignItems: "center", justifyContent: "center", transform: [{ rotate: "-4deg" }] },
  numberText: { color: "#050505", fontFamily: "Inter_900Black", fontSize: 27 },
  playerContent: { padding: 20 },
  playerPosition: { fontFamily: "Inter_800ExtraBold", fontSize: 10, letterSpacing: 1.5 },
  playerName: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 29, letterSpacing: -1.1, marginTop: 3 },
  playerTeam: { color: "rgba(255,255,255,0.62)", fontFamily: "Inter_700Bold", fontSize: 12, marginTop: 6 },
  playerStats: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 },
  profileLink: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 16 },
  profileLinkText: { fontFamily: "Inter_800ExtraBold", fontSize: 9, letterSpacing: 1 },
  tableCard: { borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", backgroundColor: "#0A0A0A", overflow: "hidden" },
  teamRow: { minHeight: 64, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(255,255,255,0.08)" },
  position: { width: 24, color: "rgba(255,255,255,0.5)", fontFamily: "Inter_900Black", fontSize: 13 },
  teamBadge: { width: 38, height: 38, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  teamBadgeText: { color: "#050505", fontFamily: "Inter_900Black", fontSize: 9 },
  teamName: { color: "#FFF", fontFamily: "Inter_800ExtraBold", fontSize: 14 },
  teamCoach: { color: "rgba(255,255,255,0.35)", fontFamily: "Inter_600SemiBold", fontSize: 10, marginTop: 3 },
  scorerRow: { minHeight: 68, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(255,255,255,0.08)" },
  rankBadge: { width: 30, height: 30, borderRadius: 9, backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center" },
  rankText: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 11 },
  scorerNameLine: { flexDirection: "row", alignItems: "center", gap: 7 },
  scorerName: { color: "#FFF", fontFamily: "Inter_800ExtraBold", fontSize: 13 },
  topTag: { backgroundColor: GOLD, color: "#050505", fontFamily: "Inter_900Black", fontSize: 7, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  scorerTeam: { color: "rgba(255,255,255,0.38)", fontFamily: "Inter_600SemiBold", fontSize: 10, marginTop: 4 },
  goalValue: { fontFamily: "Inter_900Black", fontSize: 22 },
  emptyInline: { borderRadius: 18, borderWidth: 1, backgroundColor: "rgba(255,255,255,0.035)", padding: 22, alignItems: "center" },
  emptyTitle: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 15, marginTop: 10 },
  emptyText: { color: "rgba(255,255,255,0.46)", fontFamily: "Inter_500Medium", fontSize: 12, textAlign: "center", lineHeight: 19, marginTop: 6 },
  inlineButton: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginTop: 14 },
  inlineButtonText: { fontFamily: "Inter_900Black", fontSize: 10, letterSpacing: 1 },
});
