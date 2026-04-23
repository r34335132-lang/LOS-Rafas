import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { SectionHeader } from "@/components/SectionHeader";
import { SportPill } from "@/components/SportPill";
import { StandingsTable } from "@/components/StandingsTable";
import { SPORTS, SportKey, TEAMS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

export default function SportsScreen() {
  const colors = useColors();
  const params = useLocalSearchParams<{ sport?: string }>();
  const initial = (params.sport as SportKey) ?? "flag";
  const [active, setActive] = useState<SportKey>(initial);

  const sport = useMemo(
    () => SPORTS.find((s) => s.key === active) ?? SPORTS[0]!,
    [active],
  );
  const accent = colors[sport.accent];
  const teams = TEAMS.filter((t) => t.sport === sport.key);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Deportes" subtitle="Categorías locales" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {SPORTS.map((s) => (
            <SportPill
              key={s.key}
              label={s.name}
              active={s.key === active}
              accent={colors[s.accent]}
              onPress={() => setActive(s.key)}
            />
          ))}
        </ScrollView>

        <View
          style={[
            styles.banner,
            {
              backgroundColor: colors.elevated,
              borderColor: accent,
            },
          ]}
        >
          <View style={[styles.bannerStripe, { backgroundColor: accent }]} />
          <View style={{ flex: 1, gap: 6 }}>
            <Text
              style={[styles.bannerLabel, { color: accent }]}
            >
              {sport.highlighted ? "LIGA DESTACADA" : "CATEGORÍA"}
            </Text>
            <Text style={[styles.bannerTitle, { color: colors.foreground }]}>
              {sport.name}
            </Text>
            <Text
              style={[styles.bannerDesc, { color: colors.mutedForeground }]}
            >
              {sport.description}
            </Text>
          </View>
          <View style={[styles.bannerIcon, { backgroundColor: accent }]}>
            <Feather
              name={sport.icon as keyof typeof Feather.glyphMap}
              size={26}
              color="#fff"
            />
          </View>
        </View>

        <SectionHeader title="Tabla de Posiciones" accent={accent} />

        {teams.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Aún no hay equipos registrados en esta categoría.
            </Text>
          </View>
        ) : (
          <StandingsTable teams={teams} accentColor={accent} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filters: { paddingHorizontal: 18, paddingVertical: 14 },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 18,
    marginTop: 4,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    gap: 12,
    overflow: "hidden",
  },
  bannerStripe: {
    width: 4,
    alignSelf: "stretch",
    borderRadius: 2,
  },
  bannerLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 1.2,
  },
  bannerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    letterSpacing: -0.5,
  },
  bannerDesc: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  bannerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: { padding: 40, alignItems: "center" },
  emptyText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    textAlign: "center",
  },
});