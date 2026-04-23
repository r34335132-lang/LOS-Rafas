import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TeamBadge } from "@/components/TeamBadge";
import { TEAMS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const team = TEAMS.find((t) => t.id === id);

  if (!team) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground }}>Equipo no encontrado</Text>
      </View>
    );
  }

  // Cálculos rápidos
  const points = team.wins * 3 + team.ties;
  const matchesPlayed = team.wins + team.losses + team.ties;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* 1. CABECERA INMERSIVA CON GRADIENTE */}
        <LinearGradient
          colors={[team.colorHex, colors.background]}
          style={[styles.headerGradient, { paddingTop: insets.top + 16 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.headerNav}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backBtn, { backgroundColor: 'rgba(0,0,0,0.3)', opacity: pressed ? 0.7 : 1 }]}
            >
              <Feather name="chevron-left" size={24} color="#FFF" />
            </Pressable>
          </View>

          <View style={styles.teamHero}>
            <TeamBadge short={team.short} color={team.colorHex} size={96} />
            <Text style={styles.teamName}>{team.name}</Text>
            <Text style={styles.teamCity}>{team.city} • Fundado en {team.founded}</Text>
          </View>
        </LinearGradient>

        {/* 2. TARJETA FLOTANTE DE ESTADÍSTICAS */}
        <View style={styles.statsCardWrapper}>
          <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{matchesPlayed}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>JUG</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{team.wins}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>GAN</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{team.losses}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>PER</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: team.colorHex }]}>{points}</Text>
              <Text style={[styles.statLabel, { color: team.colorHex }]}>PTS</Text>
            </View>
          </View>
        </View>

        {/* 3. ROSTER / JUGADORES */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Plantilla ({team.players.length})</Text>
          
          <View style={styles.playersGrid}>
            {team.players.map((player) => (
              <View 
                key={player.id || player.name} 
                style={[styles.playerCard, { backgroundColor: colors.elevated, borderColor: colors.border }]}
              >
                <Image
                  source={{ uri: player.image || "https://i.pravatar.cc/150?u=placeholder" }}
                  style={styles.playerImage}
                  contentFit="cover"
                  transition={200}
                />
                <View style={styles.playerInfo}>
                  <Text style={[styles.playerName, { color: colors.foreground }]} numberOfLines={1}>
                    {player.name}
                  </Text>
                  <View style={styles.playerTags}>
                    <View style={[styles.tag, { backgroundColor: `${team.colorHex}20` }]}>
                      <Text style={[styles.tagText, { color: team.colorHex }]}>{player.position}</Text>
                    </View>
                    <Text style={[styles.playerNumber, { color: colors.mutedForeground }]}>#{player.number}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 4. ÚLTIMOS RESULTADOS */}
        <View style={[styles.section, { paddingBottom: 40 }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Últimos Resultados</Text>
          {team.recent.map((match, i) => {
            const isWin = match.result === "W";
            const isLoss = match.result === "L";
            const resultColor = isWin ? colors.sportSoccer : isLoss ? colors.destuctive : colors.mutedForeground;

            return (
              <View key={i} style={[styles.recentRow, { borderBottomColor: colors.border }]}>
                <View style={[styles.resultBadge, { backgroundColor: `${resultColor}15` }]}>
                  <Text style={[styles.resultText, { color: resultColor }]}>{match.result}</Text>
                </View>
                <Text style={[styles.recentOpponent, { color: colors.foreground }]}>vs {match.opponent}</Text>
                <Text style={[styles.recentScore, { color: colors.foreground }]}>{match.score}</Text>
              </View>
            );
          })}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: { flex: 1 },
  headerGradient: {
    paddingHorizontal: 20,
    paddingBottom: 60, // Espacio extra para que flote la tarjeta
  },
  headerNav: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  teamHero: {
    alignItems: "center",
    gap: 12,
  },
  teamName: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: "#FFF",
    textAlign: "center",
  },
  teamCity: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  statsCardWrapper: {
    paddingHorizontal: 20,
    marginTop: -40, // Esto hace el efecto de tarjeta flotante
    zIndex: 10,
  },
  statsCard: {
    flexDirection: "row",
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(150,150,150,0.2)",
    height: "80%",
    alignSelf: "center",
  },
  statValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
  },
  statLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    marginBottom: 16,
  },
  playersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  playerCard: {
    width: "48%", // 2 columnas
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  playerImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  playerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  playerName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    marginBottom: 4,
  },
  playerTags: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
  },
  playerNumber: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  resultBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  resultText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
  },
  recentOpponent: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 15,
  },
  recentScore: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
});