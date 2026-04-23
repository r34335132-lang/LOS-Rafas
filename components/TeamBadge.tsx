import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function TeamBadge({
  short,
  color,
  size = 40,
}: {
  short: string;
  color: string;
  size?: number;
}) {
  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { fontSize: size * 0.36, color: "#fff" },
        ]}
      >
        {short}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
});
