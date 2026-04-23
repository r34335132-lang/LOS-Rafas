import React, { useCallback, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { NewsCard } from "@/components/NewsCard";
import { SectionHeader } from "@/components/SectionHeader";
import { SportPill } from "@/components/SportPill";
import { NEWS, SPORTS, SportKey } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const FILTERS: { key: "all" | SportKey | "general"; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "flag", label: "Flag" },
  { key: "soccer", label: "Fútbol" },
  { key: "basketball", label: "Basquet" },
  { key: "fitness", label: "Fitness" },
  { key: "general", label: "General" },
];

export default function NewsScreen() {
  const colors = useColors();
  const { isSavedNews, toggleSavedNews } = useApp();
  const [filter, setFilter] = useState<"all" | SportKey | "general">("all");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const filtered = useMemo(
    () =>
      filter === "all" ? NEWS : NEWS.filter((n) => n.sport === filter),
    [filter],
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const accentForFilter = (key: "all" | SportKey | "general") => {
    if (key === "all") return colors.primary;
    if (key === "general") return colors.sportNews;
    const sport = SPORTS.find((s) => s.key === key);
    return sport ? colors[sport.accent] : colors.primary;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Noticias" subtitle="Lo último de Durango" />

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

        {featured ? (
          <>
            <SectionHeader title="Destacada" accent={colors.primary} />
            <NewsCard item={featured} variant="hero" />
          </>
        ) : null}

        {rest.length > 0 ? (
          <>
            <SectionHeader title="Más noticias" accent={colors.foreground} />
            {rest.map((item) => (
              <NewsCard
                key={item.id}
                item={item}
                saved={isSavedNews(item.id)}
                onToggleSave={() => toggleSavedNews(item.id)}
              />
            ))}
          </>
        ) : null}

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Sin noticias en esta categoría.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filters: { paddingHorizontal: 18, paddingVertical: 14 },
  empty: { padding: 40, alignItems: "center" },
  emptyText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    textAlign: "center",
  },
});
