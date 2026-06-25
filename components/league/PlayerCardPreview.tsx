import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { MetallicBadge } from "@/components/league/MetallicBadge";
import { PremiumFrame } from "@/components/league/PremiumFrame";
import { QRCredentialBlock } from "@/components/league/QRCredentialBlock";
import { StatPill } from "@/components/league/StatPill";
import type { CardTemplate, League, PlayerProfile } from "@/lib/types";

export function PlayerCardPreview({
  profile,
  template,
}: {
  profile: PlayerProfile;
  template?: CardTemplate | null;
}) {
  const league = profile.league;
  const accent = league.accent_color ?? "#39FF14";
  const primary = league.primary_color ?? "#101010";
  const secondary = league.secondary_color ?? "#050505";
  const stats = profile.stats;
  const templateType = template?.template_type ?? "upper_deck_elite";
  const isMvp = templateType === "mvp_edition";
  const isRookie = templateType === "rookie_card";

  return (
    <PremiumFrame accent={accent}>
      <View style={styles.card}>
        <LinearGradient
          colors={isMvp ? ["#4A3300", "#0A0A0A", "#1D1600"] : [`${primary}EE`, secondary, "#050505"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <Text style={styles.texture}>{template?.name ?? "UPPER DECK"}</Text>

        <View style={styles.topRow}>
          <View style={styles.leagueLogo}>
            {league.logo_url ? (
              <Image source={{ uri: league.logo_url }} style={styles.logoImage} resizeMode="cover" />
            ) : (
              <MaterialCommunityIcons name="shield-star" size={24} color={accent} />
            )}
          </View>
          <MetallicBadge label={isMvp ? "MVP" : isRookie ? "ROOKIE" : "ELITE"} tone={isMvp ? "gold" : "green"} />
        </View>

        <View style={styles.photoStage}>
          {profile.photo_url ? (
            <Image source={{ uri: profile.photo_url }} style={styles.playerPhoto} resizeMode="cover" />
          ) : (
            <View style={styles.photoFallback}>
              <Ionicons name="person" size={92} color="rgba(255,255,255,0.28)" />
            </View>
          )}
          <Text style={[styles.bigNumber, { color: `${accent}33` }]}>{profile.number}</Text>
        </View>

        <View style={styles.namePlate}>
          <Text style={styles.playerName} numberOfLines={1}>{profile.full_name.toUpperCase()}</Text>
          <Text style={styles.playerMeta} numberOfLines={1}>
            #{profile.number} · {profile.position.toUpperCase()} · {profile.team?.name?.toUpperCase() ?? "SIN EQUIPO"}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <StatPill label="PJ" value={stats?.games ?? 0} accent={accent} />
          <StatPill label="GOLES" value={stats?.goals ?? 0} accent={accent} />
          <StatPill label="AST" value={stats?.assists ?? 0} accent={accent} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.season}>{league.season}</Text>
          <QRCredentialBlock code={profile.credential_code} accent={accent} />
        </View>
      </View>
    </PremiumFrame>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 540, padding: 16, overflow: "hidden" },
  texture: { position: "absolute", top: 190, left: -40, color: "rgba(255,255,255,0.035)", fontFamily: "Inter_900Black", fontSize: 62, transform: [{ rotate: "-18deg" }] },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  leagueLogo: { width: 52, height: 52, borderRadius: 16, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  logoImage: { width: "100%", height: "100%" },
  photoStage: { height: 245, alignItems: "center", justifyContent: "flex-end", marginTop: 12, position: "relative" },
  playerPhoto: { width: "86%", height: "100%", borderRadius: 26 },
  photoFallback: { width: "86%", height: "100%", borderRadius: 26, backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center" },
  bigNumber: { position: "absolute", right: 0, bottom: -34, fontFamily: "Inter_900Black", fontSize: 142 },
  namePlate: { marginTop: 22, paddingVertical: 14, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  playerName: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 25, letterSpacing: -0.9 },
  playerMeta: { color: "rgba(255,255,255,0.56)", fontFamily: "Inter_700Bold", fontSize: 10, letterSpacing: 1, marginTop: 4 },
  statsRow: { flexDirection: "row", gap: 8, marginTop: 14 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 16 },
  season: { color: "rgba(255,255,255,0.42)", fontFamily: "Inter_800ExtraBold", fontSize: 11, letterSpacing: 2 },
});
