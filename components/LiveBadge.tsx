import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useColors } from "@/hooks/useColors";

export function LiveBadge({ small = false }: { small?: boolean }) {
  const colors = useColors();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.25, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const dotStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.live,
          paddingHorizontal: small ? 6 : 8,
          paddingVertical: small ? 2 : 3,
        },
      ]}
    >
      <Animated.View
        style={[styles.dot, { backgroundColor: "#fff" }, dotStyle]}
      />
      <Text
        style={[
          styles.text,
          { color: "#fff", fontSize: small ? 10 : 11 },
        ]}
      >
        EN VIVO
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.8,
  },
});
