import { Feather } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { TeamBadge } from "@/components/TeamBadge";
import { MATCHES, TEAMS } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function TeamScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const team = TEAMS.find((t) => t.id === id);
  const { isFavoriteTeam, toggleFavoriteTeam } = useApp();

  if (!team) {
    return (
      <View
        style={[
          styles.notFound,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={{ color: colors.foreground }}>Equipo no encontrado</Text>
      </View>
    );
  }

  const fav = isFavoriteTeam(team.id);
  const upcoming = MATCHES.filter(
    (m) =>
      (m.homeId === team.id || m.awayId === team.id) &&
      m.status === "scheduled",
  );

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <Stack.Screen
        options={{
          title: team.short,
          headerStyle: { backgroundColor: team.colorHex },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontFamily: "Inter_700Bold",
            color: "#fff",
          },
          headerRight: () => (
            <Pressable
              hitSlop={10}
              onPress={() => toggleFavoriteTeam(team.id)}
            >
              <Feather
                name="star"
                size={20}
                color="#fff"
                style={{ opacity: fav ? 1 : 0.5 }}
              />
            </Pressable>
          ),
        }}
      />

      <View style={[styles.hero, { backgroundColor: team.colorHex }]}>
        <TeamBadge short={team.short} color="rgba(0,0,0,0.35)" size={88} />
        <Text style={styles.heroName}>{team.name}</Text>
        <Text style={styles.heroMeta}>
          {team.city} · Fundado en {team.founded}
        </Text>

        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatVal}>{team.wins}</Text>
            <Text style={styles.heroStatLab}>VICTORIAS</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatVal}>{team.losses}</Text>
            <Text style={styles.heroStatLab}>DERROTAS</Text>
          </View>
          {team.ties > 0 ? (
            <>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatVal}>{team.ties}</Text>
                <Text style={styles.heroStatLab}>EMPATES</Text>
              </View>
            </>
          ) : null}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Plantel
        </Text>
        {team.players.map((p) => (
          <View
            key={p.number}
            style={[
              styles.playerRow,
              { borderBottomColor: colors.border },
            ]}
          >
            <View
              style={[
                styles.playerNumber,
                { backgroundColor: colors.card, borderColor: team.colorHex },
              ]}
            >
              <Text
                style={[styles.playerNumberText, { color: colors.foreground }]}
              >
                {p.number}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.playerName, { color: colors.foreground }]}>
                {p.name}
              </Text>
              <Text
                style={[styles.playerPos, { color: colors.mutedForeground }]}
              >
                {p.position}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Resultados recientes
        </Text>
        {team.recent.length === 0 ? (
          <Text
            style={[
              styles.emptyText,
              { color: colors.mutedForeground, paddingHorizontal: 4 },
            ]}
          >
            Sin partidos recientes.
          </Text>
        ) : (
          team.recent.map((r, i) => (
            <View
              key={i}
              style={[
                styles.matchRow,
                { borderBottomColor: colors.border },
              ]}
            >
              <View
                style={[
                  styles.resultBadge,
                  {
                    backgroundColor:
                      r.result === "W"
                        ? colors.sportFitness
                        : r.result === "L"
                          ? colors.destructive
                          : colors.accent,
                  },
                ]}
              >
                <Text style={styles.resultBadgeText}>{r.result}</Text>
              </View>
              <Text
                style={[styles.matchOpp, { color: colors.foreground }]}
              >
                vs {r.opponent}
              </Text>
              <Text style={[styles.matchScore, { color: colors.foreground }]}>
                {r.score}
              </Text>
            </View>
          ))
        )}
      </View>

      {upcoming.length > 0 ? (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Próximos partidos
          </Text>
          {upcoming.map((m) => {
            const opp = TEAMS.find(
              (t) => t.id === (m.homeId === team.id ? m.awayId : m.homeId),
            )!;
            return (
              <Pressable
                key={m.id}
                onPress={() => router.push(`/team/${opp.id}`)}
                style={({ pressed }) => [
                  styles.matchRow,
                  {
                    borderBottomColor: colors.border,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Text style={[styles.matchTime, { color: colors.accent }]}>
                  {m.startTime}
                </Text>
                <Text style={[styles.matchOpp, { color: colors.foreground }]}>
                  vs {opp.short}
                </Text>
                <Text
                  style={[styles.matchVenue, { color: colors.mutedForeground }]}
                  numberOfLines={1}
                >
                  {m.venue}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  hero: {
    paddingVertical: 28,
    paddingHorizontal: 18,
    alignItems: "center",
    gap: 8,
  },
  heroName: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  heroMeta: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  heroStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    gap: 16,
  },
  heroStat: { alignItems: "center" },
  heroStatVal: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 22,
  },
  heroStatLab: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    letterSpacing: 1,
    marginTop: 2,
  },
  heroStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  section: {
    paddingHorizontal: 18,
    paddingTop: 22,
    gap: 6,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  playerNumber: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  playerNumberText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  playerName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  playerPos: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  resultBadge: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  resultBadgeText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 12,
  },
  matchOpp: { fontFamily: "Inter_600SemiBold", fontSize: 14, flex: 1 },
  matchScore: { fontFamily: "Inter_700Bold", fontSize: 14 },
  matchTime: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    width: 64,
  },
  matchVenue: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    flex: 1,
    textAlign: "right",
  },
  emptyText: { fontFamily: "Inter_500Medium", fontSize: 13 },
});
