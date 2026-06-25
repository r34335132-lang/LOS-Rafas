import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";

export function PremiumFrame({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <View style={[styles.outer, { borderColor: `${accent}66` }]}>
      <LinearGradient
        colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.02)", `${accent}22`]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: 24,
    borderWidth: 2,
    padding: 7,
    overflow: "hidden",
    backgroundColor: "#0A0A0A",
  },
  inner: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#090909",
  },
});
