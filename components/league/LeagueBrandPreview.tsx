import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import type { League } from "@/lib/types";

export function LeagueBrandPreview({ league }: { league: Partial<League> }) {
  const primary = league.primary_color ?? "#39FF14";
  const secondary = league.secondary_color ?? "#101010";
  const accent = league.accent_color ?? "#FFD600";

  return (
    <View style={[styles.card, { borderColor: `${primary}55` }]}>
      <LinearGradient colors={[`${primary}36`, secondary, "#050505"]} style={StyleSheet.absoluteFillObject} />
      {league.banner_url ? <Image source={{ uri: league.banner_url }} style={styles.banner} resizeMode="cover" /> : null}
      <View style={styles.content}>
        <View style={[styles.logo, { borderColor: accent }]}>
          {league.logo_url ? (
            <Image source={{ uri: league.logo_url }} style={styles.logoImage} resizeMode="cover" />
          ) : (
            <MaterialCommunityIcons name="shield-star" size={34} color={primary} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>{(league.visual_style ?? "upper_deck").toString().toUpperCase()}</Text>
          <Text style={styles.name} numberOfLines={2}>{league.name || "Nombre de tu liga"}</Text>
          <Text style={styles.meta} numberOfLines={1}>
            {[league.city, league.state, league.season].filter(Boolean).join(" · ") || "Ciudad · Temporada"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 168, borderRadius: 22, overflow: "hidden", borderWidth: 1, backgroundColor: "#090909" },
  banner: { ...StyleSheet.absoluteFillObject, opacity: 0.22 },
  content: { flex: 1, flexDirection: "row", alignItems: "flex-end", gap: 14, padding: 18 },
  logo: { width: 74, height: 74, borderRadius: 20, borderWidth: 2, backgroundColor: "rgba(0,0,0,0.55)", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  logoImage: { width: "100%", height: "100%" },
  eyebrow: { color: "rgba(255,255,255,0.5)", fontFamily: "Inter_800ExtraBold", fontSize: 9, letterSpacing: 1.4 },
  name: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 28, letterSpacing: -1, marginTop: 2 },
  meta: { color: "rgba(255,255,255,0.54)", fontFamily: "Inter_600SemiBold", fontSize: 11, marginTop: 4 },
});
