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
              {/* Escudo/Badge minimalista de ROCA */}
              <View
                style={[
                  styles.logoBadge,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.logoBadgeText}>R</Text>
              </View>
              <View style={styles.brandTextContainer}>
                <Text style={[styles.brandTop, { color: colors.foreground }]}>
                  ROCA
                </Text>
                <Text style={[styles.brandBottom, { color: colors.primary }]}>
                  SPORTS
                </Text>
              </View>
            </View>
          ) : (
            <>
              {/* Títulos de secciones cuando no se muestra el logo */}
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
            style={[styles.iconBtn, { backgroundColor: colors.elevated }]}
          >
            <Feather name="search" size={18} color={colors.foreground} />
          </View>
          <View
            style={[styles.iconBtn, { backgroundColor: colors.elevated }]}
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
    fontFamily: "BebasNeue_400Regular", // Tipografía agresiva para los títulos de vista
    fontSize: 32,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  subtitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    marginTop: -4, // Compensa la altura de Bebas Neue
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoBadge: {
    width: 42, // Ligeramente más grande para dar presencia
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  logoBadgeText: {
    color: "#fff",
    fontFamily: "BebasNeue_400Regular",
    fontSize: 30,
    marginTop: 4, // Bebas Neue necesita un ligero empuje hacia abajo para verse centrado
  },
  brandTextContainer: {
    justifyContent: "center",
  },
  brandTop: {
    fontFamily: "BebasNeue_400Regular",
    fontSize: 32,
    letterSpacing: 1.5,
    lineHeight: 32,
  },
  brandBottom: {
    fontFamily: "BebasNeue_400Regular",
    fontSize: 18,
    letterSpacing: 3,
    lineHeight: 18,
    marginTop: -4, // Pega la palabra "SPORTS" a "ROCA" para que se vea como un solo bloque sólido
  },
  actions: { flexDirection: "row", gap: 10 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1C1C1E", // Borde sutil para integrarse al fondo oscuro
  },
});