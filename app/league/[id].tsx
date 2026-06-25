import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LeagueBrandPreview } from "@/components/league/LeagueBrandPreview";
import { useLeague, usePlayersByLeague, useTeamsByLeague } from "@/hooks/leagues/useLeagues";

export default function LeagueScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const leagueQuery = useLeague(id);
  const league = leagueQuery.data;
  const teamsQuery = useTeamsByLeague(league?.id);
  const playersQuery = usePlayersByLeague(league?.id);
  const accent = league?.accent_color ?? "#39FF14";

  const refresh = () => {
    leagueQuery.refetch();
    teamsQuery.refetch();
    playersQuery.refetch();
  };

  if (leagueQuery.isLoading) {
    return <Centered title="Cargando liga" accent={accent} />;
  }

  if (!league) {
    return <Centered title="Liga no encontrada" accent={accent} action="Regresar" onAction={() => router.back()} />;
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
        refreshControl={<RefreshControl refreshing={leagueQuery.isRefetching || teamsQuery.isRefetching || playersQuery.isRefetching} onRefresh={refresh} tintColor={accent} />}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <Feather name="arrow-left" size={20} color="#FFF" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.eyebrow, { color: accent }]}>DASHBOARD DE LIGA</Text>
            <Text style={styles.title}>{league.name}</Text>
          </View>
          <Pressable onPress={() => router.push(`/admin/league/${league.id}/templates` as any)} style={[styles.iconBtn, { borderColor: `${accent}55` }]}>
            <MaterialCommunityIcons name="cards" size={20} color={accent} />
          </Pressable>
        </View>

        <LeagueBrandPreview league={league} />

        <View style={styles.statsRow}>
          <Metric value={teamsQuery.data?.length ?? 0} label="EQUIPOS" accent={accent} />
          <Metric value={playersQuery.data?.length ?? 0} label="JUGADORES" accent={accent} />
          <Metric value={league.season} label="TEMPORADA" accent={accent} />
        </View>

        <Section title="Equipos" accent={accent} action="Crear equipo" />
        {teamsQuery.isLoading ? <ActivityIndicator color={accent} /> : teamsQuery.data?.length ? (
          <View style={styles.card}>
            {teamsQuery.data.map((team) => (
              <View key={team.id} style={styles.rowItem}>
                <View style={[styles.badge, { backgroundColor: team.primary_color ?? accent }]}>
                  <Text style={styles.badgeText}>{team.name.slice(0, 3).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{team.name}</Text>
                  <Text style={styles.itemSub}>{team.coach_name || "Coach pendiente"}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : <Empty accent={accent} text="Aún no hay equipos registrados." />}

        <Section title="Jugadores" accent={accent} action="Crear jugador" />
        {playersQuery.isLoading ? <ActivityIndicator color={accent} /> : playersQuery.data?.length ? (
          <View style={styles.card}>
            {playersQuery.data.map((player) => (
              <Pressable key={player.id} onPress={() => router.push(`/player/${player.id}`)} style={styles.rowItem}>
                <View style={[styles.badge, { backgroundColor: accent }]}>
                  <Text style={styles.badgeText}>{player.number}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{player.full_name}</Text>
                  <Text style={styles.itemSub}>{player.position} · {player.teams?.name ?? "Sin equipo"}</Text>
                </View>
                <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.35)" />
              </Pressable>
            ))}
          </View>
        ) : <Empty accent={accent} text="Aún no hay jugadores. Agrega jugadores en Supabase o desde el próximo formulario admin." />}
      </ScrollView>
    </View>
  );
}

function Centered({ title, accent, action, onAction }: { title: string; accent: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.centered}>
      <ActivityIndicator color={accent} />
      <Text style={styles.centeredTitle}>{title}</Text>
      {action ? <Pressable onPress={onAction} style={[styles.actionBtn, { backgroundColor: accent }]}><Text style={styles.actionText}>{action}</Text></Pressable> : null}
    </View>
  );
}

function Metric({ value, label, accent }: { value: string | number; label: string; accent: string }) {
  return (
    <View style={styles.metric}>
      <Text style={[styles.metricValue, { color: accent }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function Section({ title, accent, action }: { title: string; accent: string; action: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={[styles.sectionAction, { color: accent }]}>{action}</Text>
    </View>
  );
}

function Empty({ accent, text }: { accent: string; text: string }) {
  return (
    <View style={[styles.empty, { borderColor: `${accent}33` }]}>
      <MaterialCommunityIcons name="database-outline" size={28} color={accent} />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#050505" },
  content: { paddingHorizontal: 20, paddingBottom: 50, gap: 18 },
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBtn: { width: 42, height: 42, borderRadius: 13, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.06)", alignItems: "center", justifyContent: "center" },
  eyebrow: { fontFamily: "Inter_800ExtraBold", fontSize: 8, letterSpacing: 1.5 },
  title: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 22 },
  statsRow: { flexDirection: "row", gap: 10 },
  metric: { flex: 1, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.04)", padding: 14, alignItems: "center" },
  metricValue: { fontFamily: "Inter_900Black", fontSize: 22 },
  metricLabel: { color: "rgba(255,255,255,0.42)", fontFamily: "Inter_800ExtraBold", fontSize: 8, letterSpacing: 1, marginTop: 4 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  sectionTitle: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 17 },
  sectionAction: { fontFamily: "Inter_800ExtraBold", fontSize: 10, letterSpacing: 1 },
  card: { borderRadius: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", backgroundColor: "#0A0A0A", overflow: "hidden" },
  rowItem: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(255,255,255,0.08)" },
  badge: { width: 38, height: 38, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  badgeText: { color: "#050505", fontFamily: "Inter_900Black", fontSize: 10 },
  itemTitle: { color: "#FFF", fontFamily: "Inter_800ExtraBold", fontSize: 14 },
  itemSub: { color: "rgba(255,255,255,0.42)", fontFamily: "Inter_600SemiBold", fontSize: 10, marginTop: 3 },
  empty: { borderWidth: 1, borderRadius: 18, padding: 24, alignItems: "center", gap: 10, backgroundColor: "rgba(255,255,255,0.035)" },
  emptyText: { color: "rgba(255,255,255,0.52)", textAlign: "center", fontFamily: "Inter_500Medium", lineHeight: 19 },
  centered: { flex: 1, backgroundColor: "#050505", alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },
  centeredTitle: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 18, textAlign: "center" },
  actionBtn: { borderRadius: 14, paddingHorizontal: 16, paddingVertical: 11 },
  actionText: { color: "#050505", fontFamily: "Inter_900Black", fontSize: 11 },
});
