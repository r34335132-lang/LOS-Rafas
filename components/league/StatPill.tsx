import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function StatPill({ label, value, accent }: { label: string; value: number | string; accent: string }) {
  return (
    <View style={[styles.container, { borderColor: `${accent}35`, backgroundColor: `${accent}10` }]}>
      <Text style={[styles.value, { color: accent }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 72,
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  value: { fontFamily: "Inter_900Black", fontSize: 20 },
  label: {
    color: "rgba(255,255,255,0.42)",
    fontFamily: "Inter_800ExtraBold",
    fontSize: 8,
    letterSpacing: 0.7,
    marginTop: 2,
    textAlign: "center",
  },
});
