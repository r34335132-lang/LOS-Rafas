import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text, View, Animated } from "react-native";

import { TeamBadge } from "@/components/TeamBadge";
import { TEAMS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

interface MatchCardProps {
  match: any;
  variant?: "default" | "hero" | "carousel";
  flashKey?: string | number;
}

export function MatchCard({ match, variant = "default", flashKey }: MatchCardProps) {
  const router = useRouter();
  const colors = useColors();

  const homeTeam = TEAMS.find((t) => t.id === match.homeId);
  const awayTeam = TEAMS.find((t) => t.id === match.awayId);

  // --- ANIMACIÓN A PRUEBA DE BALAS ---
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (flashKey) {
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false, // Debe ser false al animar colores
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [flashKey]);

  // FALLBACKS DE SEGURIDAD (Aquí matamos el error "Invariant Violation")
  // Si colors.card es undefined, usamos tu negro elevado (#1C1C1E)
  // Si colors.liveFlash es undefined, usamos tu rojo oscuro (#B00400)
  const safeCardColor = colors?.card || "#1C1C1E";
  const safeFlashColor = colors?.liveFlash || "#B00400";

  const animatedBg = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [safeCardColor, safeFlashColor],
  });

  if (!homeTeam || !awayTeam) return null;

  const isHero = variant === "hero";
  const safeBorderColor = colors?.border || "#3A3A3C";

  return (
    <Animated.View style={[styles.container, { backgroundColor: animatedBg, borderColor: safeBorderColor }]}>
      <Pressable
        onPress={() => router.push(`/match/${match.id}`)}
        style={({ pressed }) => [
          styles.pressableArea,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        {/* HEADER DE LA TARJETA */}
        <View style={styles.header}>
          <Text style={[styles.statusText, match.status === "live" && { color: colors?.live || '#E10600' }]}>
            {match.status === "live"
              ? match.minute || "EN JUEGO"
              : match.status === "final"
              ? "FINALIZADO"
              : match.startTime}
          </Text>
        </View>

        {/* CONTENIDO PRINCIPAL (Equipos y Marcador) */}
        <View style={styles.teamsContainer}>
          {/* LOCAL */}
          <View style={styles.teamColumn}>
            <TeamBadge short={homeTeam.short} color="#FFF" size={isHero ? 56 : 40} />
            <Text style={[styles.teamName, isHero && styles.teamNameHero]}>
              {homeTeam.name.toUpperCase()}
            </Text>
          </View>

          {/* MARCADOR */}
          <View style={styles.scoreColumn}>
            {match.status === "scheduled" ? (
              <Text style={styles.vsText}>VS</Text>
            ) : (
              <View style={styles.scoreRow}>
                <Text style={[styles.scoreText, isHero && styles.scoreTextHero]}>
                  {match.homeScore}
                </Text>
                <Text style={[styles.scoreDivider, isHero && styles.scoreDividerHero]}>
                  -
                </Text>
                <Text style={[styles.scoreText, isHero && styles.scoreTextHero]}>
                  {match.awayScore}
                </Text>
              </View>
            )}
          </View>

          {/* VISITANTE */}
          <View style={styles.teamColumn}>
            <TeamBadge short={awayTeam.short} color="#FFF" size={isHero ? 56 : 40} />
            <Text style={[styles.teamName, isHero && styles.teamNameHero]}>
              {awayTeam.name.toUpperCase()}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20, 
    overflow: "hidden",
    borderWidth: 1,
  },
  pressableArea: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  statusText: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 10,
    letterSpacing: 2,
    color: '#8E8E93', // Tu gris por defecto
  },
  teamsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teamColumn: {
    flex: 1,
    alignItems: "center",
    gap: 12,
  },
  teamName: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "center",
  },
  teamNameHero: {
    fontSize: 14,
    fontFamily: "Inter_900Black",
  },
  scoreColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  vsText: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 14,
    color: '#8E8E93',
    letterSpacing: 2,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  scoreText: {
    fontFamily: "Inter_900Black",
    fontSize: 28,
    color: "#FFFFFF",
  },
  scoreTextHero: {
    fontSize: 44,
    letterSpacing: -2,
  },
  scoreDivider: {
    fontFamily: "Inter_500Medium",
    fontSize: 20,
    color: '#3A3A3C', // Tu gris claro
  },
  scoreDividerHero: {
    fontSize: 28,
  },
});