import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

export function AppHeader({
  title,
  subtitle,
  showLogo = false,
}: {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset =
    Platform.OS === "web" ? Math.max(insets.top, 24) : insets.top;

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: topInset + 10,
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          {showLogo ? (
            <View style={styles.logoRow}>
              <View
                style={[
                  styles.logoBadge,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.logoBadgeText}>R</Text>
              </View>
              <View>
                <Text style={[styles.brandTop, { color: colors.foreground }]}>
                  RUGIDO
                </Text>
                <Text style={[styles.brandBottom, { color: colors.primary }]}>
                  DEPORTIVO DGO
                </Text>
              </View>
            </View>
          ) : (
            <>
              <Text style={[styles.title, { color: colors.foreground }]}>
                {title}
              </Text>
              {subtitle ? (
                <Text
                  style={[styles.subtitle, { color: colors.mutedForeground }]}
                >
                  {subtitle}
                </Text>
              ) : null}
            </>
          )}
        </View>

        <View style={styles.actions}>
          <View
            style={[styles.iconBtn, { backgroundColor: colors.card }]}
          >
            <Feather name="search" size={18} color={colors.foreground} />
          </View>
          <View
            style={[styles.iconBtn, { backgroundColor: colors.card }]}
          >
            <Feather name="bell" size={18} color={colors.foreground} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  logoBadgeText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 20,
  },
  brandTop: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    letterSpacing: 1.5,
    lineHeight: 18,
  },
  brandBottom: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 1.8,
    lineHeight: 13,
    marginTop: 1,
  },
  actions: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
