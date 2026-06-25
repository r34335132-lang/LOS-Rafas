import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { QRCredentialBlock } from "@/components/league/QRCredentialBlock";
import type { PlayerProfile } from "@/lib/types";

export function PlayerCredentialCard({ profile }: { profile: PlayerProfile }) {
  const accent = profile.league.accent_color ?? "#39FF14";

  return (
    <View style={[styles.card, { borderColor: `${accent}66` }]}>
      <LinearGradient
        colors={[`${profile.league.primary_color}DD`, profile.league.secondary_color ?? "#050505", "#050505"]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={[styles.header, { backgroundColor: accent }]}>
        <Text style={styles.headerText}>CREDENCIAL DIGITAL</Text>
        <Text style={styles.headerText}>{profile.league.season}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.photoBox}>
          {profile.photo_url ? (
            <Image source={{ uri: profile.photo_url }} style={styles.photo} resizeMode="cover" />
          ) : (
            <MaterialCommunityIcons name="account" size={72} color="rgba(255,255,255,0.28)" />
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.label}>JUGADOR</Text>
          <Text style={styles.name}>{profile.full_name.toUpperCase()}</Text>
          <Text style={styles.meta}>#{profile.number} · {profile.position.toUpperCase()}</Text>
          <Text style={styles.meta}>{profile.team?.name ?? "Sin equipo"}</Text>
          <View style={[styles.status, { borderColor: accent }]}>
            <View style={[styles.dot, { backgroundColor: accent }]} />
            <Text style={[styles.statusText, { color: accent }]}>{profile.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <QRCredentialBlock code={profile.credential_code} accent={accent} />
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>LIGA</Text>
          <Text style={styles.leagueName}>{profile.league.name}</Text>
          <Text style={styles.code}>{profile.credential_code}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 22, borderWidth: 2, overflow: "hidden", backgroundColor: "#101010" },
  header: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 9 },
  headerText: { color: "#050505", fontFamily: "Inter_900Black", fontSize: 10, letterSpacing: 1.4 },
  body: { flexDirection: "row", gap: 14, padding: 16 },
  photoBox: { width: 118, height: 146, borderRadius: 16, borderWidth: 2, borderColor: "#FFF", backgroundColor: "rgba(255,255,255,0.07)", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  photo: { width: "100%", height: "100%" },
  info: { flex: 1, justifyContent: "center" },
  label: { color: "rgba(255,255,255,0.4)", fontFamily: "Inter_800ExtraBold", fontSize: 8, letterSpacing: 1 },
  name: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 22, lineHeight: 24, marginTop: 4 },
  meta: { color: "rgba(255,255,255,0.64)", fontFamily: "Inter_700Bold", fontSize: 11, marginTop: 5 },
  status: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderRadius: 20, paddingHorizontal: 9, paddingVertical: 5, marginTop: 12 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontFamily: "Inter_900Black", fontSize: 8, letterSpacing: 1 },
  footer: { flexDirection: "row", gap: 16, alignItems: "center", padding: 16, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(0,0,0,0.22)" },
  leagueName: { color: "#FFF", fontFamily: "Inter_800ExtraBold", fontSize: 15, marginTop: 4 },
  code: { color: "rgba(255,255,255,0.46)", fontFamily: "Inter_600SemiBold", fontSize: 9, letterSpacing: 1, marginTop: 5 },
});
