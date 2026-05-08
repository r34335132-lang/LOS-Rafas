import { Feather, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useCallback, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable
} from "react-native";
import Animated, { FadeInDown, LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MatchCard } from "@/components/MatchCard";
import { SPORTS, SportKey } from "@/constants/data";
import { useColors } from "@/hooks/useColors";
import { useLiveScores } from "@/hooks/useLiveScores";

const FILTERS: { key: "all" | SportKey; label: string }[] = [
  { key: "all", label: "TODOS" },
  { key: "flag", label: "FLAG" },
  { key: "soccer", label: "FÚTBOL" },
  { key: "basketball", label: "BÁSQUET" },
  { key: "fitness", label: "FITNESS" },
];

// MOCK DE TORNEOS (Igual que en SportsScreen para mantener consistencia)
const TOURNAMENTS: Record<string, string[]> = {
  all: ["Todos los Torneos", "Destacados", "Finales"],
  soccer: ["Liga Dominical", "Torneo Nocturno", "Copa Durango"],
  flag: ["Tocho Durango Dominical", "Liga Femenil", "Torneo Mixto"],
  basketball: ["Liga Mayor", "2da Fuerza"],
  fitness: ["Reto 30 Días", "Crossfit Games"],
};

export default function ScoresScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { matches, flashKeys } = useLiveScores();
  
  const [filter, setFilter] = useState<"all" | SportKey>("all");
  const [activeTournament, setActiveTournament] = useState<string>(TOURNAMENTS["all"]![0]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  // Función para cambiar de deporte y resetear el torneo al primero de su lista
  const handleSportChange = (sportKey: "all" | SportKey) => {
    setFilter(sportKey);
    setActiveTournament(TOURNAMENTS[sportKey]![0]);
  };

  // 1. Filtrar por Deporte
  const sportFilteredMatches = useMemo(
    () => filter === "all" ? matches : matches.filter((m) => m.sport === filter),
    [filter, matches],
  );

  // 2. Filtrar por Torneo (Simulación Visual)
  // En producción real, harías: sportFilteredMatches.filter(m => m.tournamentId === activeTournament)
  const tournamentFilteredMatches = useMemo(() => {
    if (activeTournament === "Todos los Torneos" || activeTournament === "Destacados") return sportFilteredMatches;
    if (activeTournament.includes("Femenil") || activeTournament.includes("Fuerza")) return sportFilteredMatches.slice(0, 2);
    if (activeTournament.includes("Nocturno")) return sportFilteredMatches.slice(1, 4);
    return sportFilteredMatches.slice(0, 3); // Retorno por defecto para la demo
  }, [sportFilteredMatches, activeTournament]);

  const live = tournamentFilteredMatches.filter((m) => m.status === "live");
  const upcoming = tournamentFilteredMatches.filter((m) => m.status === "scheduled");
  const finals = tournamentFilteredMatches.filter((m) => m.status === "final");

  const accentForFilter = (key: "all" | SportKey) => {
    if (key === "all") return colors.primary;
    const sport = SPORTS.find((s) => s.key === key)!;
    return (colors as any)[sport.accent] || colors.primary;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* 1. HEADER MASIVO TIPO APPLE SPORTS */}
      <View style={[styles.modernHeader, { paddingTop: insets.top + 10, backgroundColor: colors.background }]}>
        <Text style={styles.massiveTitle}>
          En Vivo{"\n"}
          <Text style={{ color: colors.live || colors.primary }}>Marcadores.</Text>
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            progressViewOffset={60} 
          />
        }
        stickyHeaderIndices={[0]}
      >
        {/* 2. ZONA FIJA (STICKY HEADER) CON AMBOS FILTROS */}
        <View>
          <BlurView intensity={90} tint="dark" style={[styles.stickyHeader, { backgroundColor: 'rgba(11,11,11,0.85)' }]}>
            
            {/* Fila 1: Filtro de Deportes (Píldoras) */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
              {FILTERS.map((f) => {
                const isActive = filter === f.key;
                const fAccent = accentForFilter(f.key);
                return (
                  <Pressable
                    key={f.key}
                    onPress={() => handleSportChange(f.key)}
                    style={[
                      styles.chip,
                      { backgroundColor: isActive ? fAccent : colors.card } // Usamos el card color (#1C1C1E)
                    ]}
                  >
                    <Text style={[styles.chipText, { color: isActive ? "#000" : "#888" }]}>
                      {f.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Fila 2: Filtro de Torneos (Sub-navegación) */}
            <Animated.View entering={FadeInDown.duration(300)}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tournamentFilters}>
                {TOURNAMENTS[filter]?.map((tourney) => {
                  const isActive = tourney === activeTournament;
                  const fAccent = accentForFilter(filter);
                  return (
                    <Pressable
                      key={tourney}
                      onPress={() => setActiveTournament(tourney)}
                      style={[styles.tourneyChip, isActive && { borderBottomColor: fAccent }]}
                    >
                      <Text style={[styles.tourneyChipText, { color: isActive ? '#FFF' : 'rgba(255,255,255,0.4)' }]}>
                        {tourney.toUpperCase()}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Animated.View>

          </BlurView>
        </View>

        {/* 3. SECCIONES ANIMADAS */}
        <View style={styles.content}>
          {live.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <View style={[styles.liveDot, { backgroundColor: colors.live || '#E10600' }]} />
                <Text style={[styles.modernSectionTitle, { color: colors.live || '#E10600' }]}>AHORA JUGANDO</Text>
              </View>
              <Animated.View layout={LinearTransition.springify()} style={{ gap: 16 }}>
                {live.map((m, index) => (
                  <Animated.View key={m.id} entering={FadeInDown.delay(index * 100).springify()}>
                    <MatchCard
                      match={m}
                      flashKey={flashKeys[m.id]}
                    />
                  </Animated.View>
                ))}
              </Animated.View>
            </View>
          )}

          {upcoming.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Feather name="clock" size={14} color="rgba(255,255,255,0.5)" style={{ marginRight: 6 }} />
                <Text style={styles.modernSectionTitle}>PRÓXIMOS</Text>
              </View>
              <Animated.View layout={LinearTransition.springify()} style={{ gap: 16 }}>
                {upcoming.map((m, index) => (
                  <Animated.View key={m.id} entering={FadeInDown.delay((live.length + index) * 100).springify()}>
                    <MatchCard match={m} />
                  </Animated.View>
                ))}
              </Animated.View>
            </View>
          )}

          {finals.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="flag" size={14} color="rgba(255,255,255,0.3)" style={{ marginRight: 6 }} />
                <Text style={[styles.modernSectionTitle, { color: 'rgba(255,255,255,0.3)' }]}>FINALIZADOS</Text>
              </View>
              <Animated.View layout={LinearTransition.springify()} style={{ gap: 16 }}>
                {finals.map((m, index) => (
                  <Animated.View key={m.id} entering={FadeInDown.delay((live.length + upcoming.length + index) * 100).springify()}>
                    <View style={{ opacity: 0.6 }}>
                      <MatchCard match={m} />
                    </View>
                  </Animated.View>
                ))}
              </Animated.View>
            </View>
          )}

          {/* 4. ESTADO VACÍO EDITORIAL */}
          {tournamentFilteredMatches.length === 0 && (
            <Animated.View entering={FadeInDown.springify()} style={styles.empty}>
              <View style={styles.emptyIconCircle}>
                <Feather name="calendar" size={40} color="#333" />
              </View>
              <Text style={styles.emptyTitle}>
                SIN ACTIVIDAD
              </Text>
              <Text style={styles.emptyText}>
                No hay encuentros de {activeTournament} el día de hoy.
              </Text>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // HEADER
  modernHeader: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  massiveTitle: {
    fontFamily: 'Inter_900Black',
    fontSize: 42,
    lineHeight: 44,
    letterSpacing: -2,
    color: '#FFF',
  },

  // STICKY HEADER & FILTERS
  stickyHeader: {
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  filters: { 
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 10 
  },
  chip: { 
    paddingHorizontal: 18, 
    paddingVertical: 10, 
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  chipText: { 
    fontFamily: 'Inter_700Bold', 
    fontSize: 11, 
    letterSpacing: 1.5 
  },

  // NUEVO SELECTOR DE TORNEOS (Sub-navegación)
  tournamentFilters: { 
    paddingHorizontal: 20, 
    paddingBottom: 12, 
    gap: 20 
  },
  tourneyChip: { 
    paddingBottom: 8, 
    borderBottomWidth: 2, 
    borderBottomColor: 'transparent' 
  },
  tourneyChipText: { 
    fontFamily: 'Inter_800ExtraBold', 
    fontSize: 11, 
    letterSpacing: 1 
  },

  content: {
    paddingTop: 24, 
    paddingHorizontal: 20,
  },
  
  // SECCIONES
  section: {
    marginBottom: 32, 
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  modernSectionTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 12,
    letterSpacing: 2,
  },

  // EMPTY STATE
  empty: { 
    padding: 40, 
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1C1C1E', // Tu card color
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 20,
    color: '#FFF',
    letterSpacing: 1,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: "center",
    lineHeight: 22,
  },
});