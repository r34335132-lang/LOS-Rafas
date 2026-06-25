import { LinearGradient } from "expo-linear-gradient";
import type { ColorValue } from "react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function MetallicBadge({ label, tone = "gold" }: { label: string; tone?: "gold" | "silver" | "green" }) {
  const colors: [ColorValue, ColorValue, ColorValue] =
    tone === "silver"
      ? ["#F5F7FA", "#8B96A5", "#F5F7FA"]
      : tone === "green"
        ? ["#D6FFD0", "#39FF14", "#0B5F12"]
        : ["#FFF4B8", "#FFD600", "#8A6500"];

  return (
    <View style={styles.wrap}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.badge}>
        <Text style={styles.text}>{label}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 8, overflow: "hidden" },
  badge: { paddingHorizontal: 9, paddingVertical: 5 },
  text: {
    color: "#050505",
    fontFamily: "Inter_900Black",
    fontSize: 8,
    letterSpacing: 1,
  },
});
