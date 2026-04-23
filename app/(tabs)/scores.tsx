import React, { useCallback, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { MatchCard } from "@/components/MatchCard";
import { SectionHeader } from "@/components/SectionHeader";
import { SportPill } from "@/components/SportPill";
import { SPORTS, SportKey } from "@/constants/data";
import { useColors } from "@/hooks/useColors";
import { useLiveScores } from "@/hooks/useLiveScores";

const FILTERS: { key: "all" | SportKey; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "flag", label: "Flag" },
  { key: "soccer", label: "Fútbol" },
  { key: "basketball", label: "Basquet" },
  { key: "fitness", label: "Fitness" },
];

export default function ScoresScreen() {
  const colors = useColors();
  const { matches, flashKeys } = useLiveScores();
  const [filter, setFilter] = useState<"all" | SportKey>("all");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const filtered = useMemo(
    () =>
      filter === "all" ? matches : matches.filter((m) => m.sport === filter),
    [filter, matches],
  );

  const live = filtered.filter((m) => m.status === "live");
  const upcoming = filtered.filter((m) => m.status === "scheduled");
  const finals = filtered.filter((m) => m.status === "final");

  const accentForFilter = (key: "all" | SportKey) => {
    if (key === "all") return colors.primary;
    const sport = SPORTS.find((s) => s.key === key)!;
    return colors[sport.accent];
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Marcadores" subtitle="En tiempo real" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        stickyHeaderIndices={[0]}
      >
        <View
          style={{
            backgroundColor: colors.background,
            paddingVertical: 12,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
          >
            {FILTERS.map((f) => (
              <SportPill
                key={f.key}
                label={f.label}
                active={filter === f.key}
                accent={accentForFilter(f.key)}
                onPress={() => setFilter(f.key)}
              />
            ))}
          </ScrollView>
        </View>

        {live.length > 0 ? (
          <>
            <SectionHeader title="En vivo" accent={colors.live} />
            {live.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                flashKey={flashKeys[m.id]}
              />
            ))}
          </>
        ) : null}

        {upcoming.length > 0 ? (
          <>
            <SectionHeader title="Próximos" accent={colors.accent} />
            {upcoming.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </>
        ) : null}

        {finals.length > 0 ? (
          <>
            <SectionHeader title="Finales" accent={colors.mutedForeground} />
            {finals.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </>
        ) : null}

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No hay encuentros para este deporte ahora mismo.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filters: { paddingHorizontal: 18 },
  empty: { padding: 40, alignItems: "center" },
  emptyText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    textAlign: "center",
  },
});
