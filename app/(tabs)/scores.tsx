import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
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
            // Evita que el spinner se esconda detrás del BlurView
            progressViewOffset={60} 
          />
        }
        // El índice 0 es nuestro BlurView, lo hacemos pegajoso
        stickyHeaderIndices={[0]}
      >
        {/* 1. EFECTO CRISTAL EN LOS FILTROS */}
        <BlurView
          intensity={80}
          tint="dark" // Cambia a "light" si tu app no es siempre oscura
          style={[
            styles.stickyHeader,
            { borderBottomColor: colors.border }
          ]}
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
        </BlurView>

        {/* 2. SECCIONES CON MEJOR ESPACIADO */}
        <View style={styles.content}>
          {live.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="En vivo" accent={colors.live} />
              {live.map((m) => (
                <MatchCard
                  key={m.id}
                  match={m}
                  flashKey={flashKeys[m.id]}
                />
              ))}
            </View>
          )}

          {upcoming.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Próximos" accent={colors.accent} />
              {upcoming.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </View>
          )}

          {finals.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Finales" accent={colors.mutedForeground} />
              {finals.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </View>
          )}

          {/* 3. ESTADO VACÍO (EMPTY STATE) MODERNO */}
          {filtered.length === 0 && (
            <View style={styles.empty}>
              <View style={[styles.emptyIconCircle, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="calendar" size={32} color={colors.mutedForeground} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                Día de descanso
              </Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No hay encuentros programados para esta categoría en este momento.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  stickyHeader: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    // Un color base muy transparente por si el blur tarda en cargar
    backgroundColor: "rgba(0,0,0,0.4)", 
  },
  filters: { 
    paddingHorizontal: 18,
    gap: 8 // Da una separación perfecta entre píldoras si React Native soporta gap aquí, o el SportPill ya tiene margen
  },
  content: {
    paddingTop: 8, // Espacio después de los filtros
  },
  section: {
    marginBottom: 16, // Separación clara entre En Vivo, Próximos y Finales
  },
  empty: { 
    padding: 40, 
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
  },
  emptyTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});