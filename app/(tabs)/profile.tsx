import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { NewsCard } from "@/components/NewsCard";
import { SectionHeader } from "@/components/SectionHeader";
import { TeamBadge } from "@/components/TeamBadge";
import { NEWS, TEAMS } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ProfileScreen() {
  const colors = useColors();
  const {
    isAuthenticated,
    username,
    email,
    favoriteTeams,
    savedNews,
    signOut,
    toggleSavedNews,
    isSavedNews,
    toggleFavoriteTeam,
  } = useApp();

  const favTeams = TEAMS.filter((t) => favoriteTeams.includes(t.id));
  const saved = NEWS.filter((n) => savedNews.includes(n.id));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Perfil" subtitle="Tu rincón en Rugido" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.card,
            { backgroundColor: colors.elevated, borderColor: colors.border },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>
                {(username ?? "Aficionado")
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: colors.foreground }]}>
                {isAuthenticated ? username : "Aficionado invitado"}
              </Text>
              <Text style={[styles.email, { color: colors.mutedForeground }]}>
                {isAuthenticated ? email : "Inicia sesión para sincronizar"}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {favTeams.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                Equipos
              </Text>
            </View>
            <View
              style={[
                styles.statDivider,
                { backgroundColor: colors.border },
              ]}
            />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {saved.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                Noticias
              </Text>
            </View>
            <View
              style={[
                styles.statDivider,
                { backgroundColor: colors.border },
              ]}
            />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                7
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                Alertas
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() =>
              isAuthenticated ? signOut() : router.push("/auth")
            }
            style={({ pressed }) => [
              styles.cta,
              {
                backgroundColor: isAuthenticated
                  ? colors.card
                  : colors.primary,
                borderColor: isAuthenticated ? colors.border : colors.primary,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Feather
              name={isAuthenticated ? "log-out" : "log-in"}
              size={16}
              color={isAuthenticated ? colors.foreground : "#fff"}
            />
            <Text
              style={[
                styles.ctaText,
                { color: isAuthenticated ? colors.foreground : "#fff" },
              ]}
            >
              {isAuthenticated ? "Cerrar sesión" : "Iniciar sesión"}
            </Text>
          </Pressable>
        </View>

        <SectionHeader title="Equipos favoritos" accent={colors.primary} />
        {favTeams.length === 0 ? (
          <View style={styles.empty}>
            <Feather
              name="star"
              size={28}
              color={colors.mutedForeground}
            />
            <Text
              style={[styles.emptyText, { color: colors.mutedForeground }]}
            >
              Aún no sigues a ningún equipo.
            </Text>
          </View>
        ) : (
          favTeams.map((team) => (
            <Pressable
              key={team.id}
              onPress={() => router.push(`/team/${team.id}`)}
              style={({ pressed }) => [
                styles.teamRow,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: pressed ? 0.92 : 1,
                },
              ]}
            >
              <TeamBadge short={team.short} color={team.colorHex} size={42} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[styles.teamName, { color: colors.foreground }]}>
                  {team.name}
                </Text>
                <Text
                  style={[styles.teamMeta, { color: colors.mutedForeground }]}
                >
                  {team.city} · {team.wins}-{team.losses}
                </Text>
              </View>
              <Pressable
                hitSlop={10}
                onPress={() => toggleFavoriteTeam(team.id)}
              >
                <Feather name="star" size={18} color={colors.accent} />
              </Pressable>
            </Pressable>
          ))
        )}

        <SectionHeader title="Noticias guardadas" accent={colors.accent} />
        {saved.length === 0 ? (
          <View style={styles.empty}>
            <Feather
              name="bookmark"
              size={28}
              color={colors.mutedForeground}
            />
            <Text
              style={[styles.emptyText, { color: colors.mutedForeground }]}
            >
              Toca el marcador en cualquier nota para guardarla.
            </Text>
          </View>
        ) : (
          saved.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              saved={isSavedNews(item.id)}
              onToggleSave={() => toggleSavedNews(item.id)}
            />
          ))
        )}

        <View style={{ paddingHorizontal: 18, marginTop: 24, gap: 8 }}>
          <Text style={[styles.footerLine, { color: colors.mutedForeground }]}>
            Rugido Deportivo Durango · v1.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    marginHorizontal: 18,
    marginTop: 16,
    padding: 16,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 18,
  },
  name: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
  },
  email: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  stat: { flex: 1, alignItems: "center", gap: 2 },
  statValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
  },
  statLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 1,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 28,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  ctaText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    letterSpacing: 0.3,
  },
  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginHorizontal: 18,
    marginBottom: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  teamName: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
  },
  teamMeta: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },
  empty: {
    paddingVertical: 28,
    alignItems: "center",
    gap: 10,
  },
  emptyText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  footerLine: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    textAlign: "center",
  },
});
