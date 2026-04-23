import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

export function SectionHeader({
  title,
  accent,
  action,
  onAction,
}: {
  title: string;
  accent?: string;
  action?: string;
  onAction?: () => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View
          style={[
            styles.bar,
            { backgroundColor: accent ?? colors.primary },
          ]}
        />
        <Text style={[styles.title, { color: colors.foreground }]}>
          {title}
        </Text>
      </View>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={[styles.action, { color: colors.mutedForeground }]}>
            {action}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginTop: 22,
    marginBottom: 12,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 10 },
  bar: { width: 4, height: 18, borderRadius: 2 },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    letterSpacing: -0.2,
  },
  action: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
