import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function QRCredentialBlock({ code, accent }: { code: string; accent: string }) {
  const bits = Array.from(code).map((char) => char.charCodeAt(0));

  return (
    <View style={styles.wrap}>
      <View style={[styles.qr, { borderColor: accent }]}>
        {Array.from({ length: 49 }).map((_, index) => {
          const active = (bits[index % bits.length] + index) % 3 !== 0;
          return <View key={index} style={[styles.dot, active && { backgroundColor: accent }]} />;
        })}
      </View>
      <Text style={styles.code} numberOfLines={1}>{code}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: 7 },
  qr: {
    width: 74,
    height: 74,
    borderRadius: 12,
    borderWidth: 1,
    padding: 7,
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#060606",
  },
  dot: {
    width: 8,
    height: 8,
    margin: 1,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  code: {
    maxWidth: 120,
    color: "rgba(255,255,255,0.55)",
    fontFamily: "Inter_700Bold",
    fontSize: 8,
    letterSpacing: 0.8,
  },
});
