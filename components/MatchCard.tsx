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
          useNativeDriver: false,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [flashKey]);

  // Colores de la paleta ROCA Sports
  const safeCardColor = colors?.card || "#1C1C1E";
  const safeFlashColor = colors?.liveFlash || "#B00400"; // El rojo oscuro de ROCA

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
        {/* HEADER DE LA TARJETA (Minuto o Estado) */}
        <View style={styles.header}>
          <View style={styles.statusBadge}>
            {match.status === "live" && (
              <View style={[styles.liveIndicator, { backgroundColor: colors.primary }]} />
            )}
            <Text style={[
              styles.statusText, 
              match.status === "live" && { color: colors.primary }
            ]}>
              {match.status === "live"
                ? match.minute || "EN JUEGO"
                : match.status === "final"
                ? "FINALIZADO"
                : match.startTime}
            </Text>
          </View>
        </View>

        {/* CONTENIDO PRINCIPAL (Equipos y Marcador) */}
        <View style={styles.teamsContainer}>
          {/* LOCAL */}
          <View style={styles.teamColumn}>
            <TeamBadge short={homeTeam.short} color="#FFF" size={isHero ? 64 : 48} />
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
            <TeamBadge short={awayTeam.short} color="#FFF" size={isHero ? 64 : 48} />
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
    borderRadius: 16, // Bordes un poco más duros, menos redondos (estilo más deportivo/tech)
    overflow: "hidden",
    borderWidth: 1,
  },
  pressableArea: {
    padding: 20,
    paddingTop: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.3)", // Fondo translúcido oscuro para la píldora de tiempo
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 1.5,
    color: '#8E8E93',
  },
  teamsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  teamColumn: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  teamName: {
    fontFamily: "BebasNeue_400Regular", // <-- FUENTE DEPORTIVA
    fontSize: 22,
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 1,
  },
  teamNameHero: {
    fontSize: 28, // Nombres gigantes si es el partido principal
  },
  scoreColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  vsText: {
    fontFamily: "BebasNeue_400Regular",
    fontSize: 28,
    color: '#3A3A3C',
    letterSpacing: 2,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  scoreText: {
    fontFamily: "BebasNeue_400Regular", // <-- NÚMEROS ESTILO ESTADIO
    fontSize: 48,
    color: "#FFFFFF",
    marginTop: 6, // Compensación óptica para Bebas Neue
  },
  scoreTextHero: {
    fontSize: 68, // Marcador colosal para la vista principal
  },
  scoreDivider: {
    fontFamily: "BebasNeue_400Regular",
    fontSize: 32,
    color: '#3A3A3C', 
    marginTop: 4,
  },
  scoreDividerHero: {
    fontSize: 42,
  },
});