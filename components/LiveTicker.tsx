import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

export function LiveTicker({ items }: { items: string[] }) {
  const colors = useColors();
  const translate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(translate, {
        toValue: -1,
        duration: 18000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [translate]);

  const TRACK_WIDTH = 1600;
  const x = translate.interpolate({
    inputRange: [-1, 0],
    outputRange: [-TRACK_WIDTH, 0],
  });

  const sequence = [...items, ...items, ...items];

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.elevated,
          borderTopColor: colors.border,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={[styles.label, { backgroundColor: colors.primary }]}>
        <Text style={styles.labelText}>EN VIVO</Text>
      </View>
      <View style={styles.trackWrap}>
        <Animated.View
          style={[styles.track, { transform: [{ translateX: x }] }]}
        >
          {sequence.map((item, i) => (
            <View key={i} style={styles.item}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: colors.accent },
                ]}
              />
              <Text style={[styles.itemText, { color: colors.foreground }]}>
                {item}
              </Text>
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  label: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 10,
    borderRadius: 4,
  },
  labelText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 1,
  },
  trackWrap: {
    flex: 1,
    overflow: "hidden",
    height: "100%",
    justifyContent: "center",
  },
  track: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    height: "100%",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginRight: 24,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  itemText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    letterSpacing: 0.3,
  },
});
