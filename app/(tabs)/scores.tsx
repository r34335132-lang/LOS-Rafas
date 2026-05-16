import { Feather, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useCallback, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions
} from "react-native";
import Animated, { FadeInDown, FadeIn, LinearTransition, ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { MatchCard } from "@/components/MatchCard";
import { SPORTS, SportKey } from "@/constants/data";
import { useColors } from "@/hooks/useColors";
import { useLiveScores } from "@/hooks/useLiveScores";

const { width } = Dimensions.get("window");

const FILTERS: { key: "all" | SportKey; label: string }[] = [
  { key: "all", label: "GLOBAL" },
  { key: "flag", label: "FLAG" },
  { key: "soccer", label: "FÚTBOL" },
  { key: "basketball", label: "BÁSQUET" },
  { key: "fitness", label: "FITNESS" },
];

const TOURNAMENTS: Record<string, string[]> = {
  all: ["Todos", "Destacados", "Finales"],
  soccer: ["Dominical", "Nocturno", "Copa DGO"],
  flag: ["Tocho DGO", "Femenil", "Mixto"],
  basketball: ["Liga Mayor", "2da Fuerza"],
  fitness: ["Reto 30", "Cross Games"],
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

  const handleSportChange = (sportKey: "all" | SportKey) => {
    setFilter(sportKey);
    setActiveTournament(TOURNAMENTS[sportKey]![0]);
  };

  const sportFilteredMatches = useMemo(
    () => filter === "all" ? matches : matches.filter((m) => m.sport === filter),
    [filter, matches],
  );

  const tournamentFilteredMatches = useMemo(() => {
    if (activeTournament === "Todos" || activeTournament === "Destacados") return sportFilteredMatches;
    if (activeTournament.includes("Femenil") || activeTournament.includes("Fuerza")) return sportFilteredMatches.slice(0, 2);
    if (activeTournament.includes("Nocturno")) return sportFilteredMatches.slice(1, 4);
    return sportFilteredMatches.slice(0, 3); 
  }, [sportFilteredMatches, activeTournament]);

  const live = tournamentFilteredMatches.filter((m) => m.status === "live");
  const upcoming = tournamentFilteredMatches.filter((m) => m.status === "scheduled");
  const finals = tournamentFilteredMatches.filter((m) => m.status === "final");

  const activeColor = useMemo(() => {
    if (filter === "all") return colors.primary;
    const sport = SPORTS.find((s) => s.key === filter)!;
    return (colors as any)[sport.accent] || colors.primary;
  }, [filter, colors]);

  return (
    <View style={[styles.container, { backgroundColor: '#050505' }]}>
      
      {/* GLOW DE FONDO DINÁMICO (Cambia de color según el deporte seleccionado) */}
      <Animated.View style={styles.ambientGlow} entering={FadeIn.duration(500)}>
        <LinearGradient
          colors={[`${activeColor}30`, 'transparent']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={activeColor} progressViewOffset={60} />
        }
        stickyHeaderIndices={[1]} // El BlurView es el índice 1 ahora
      >
        {/* 1. HEADER MASIVO DE COMANDO */}
        <View style={[styles.modernHeader, { paddingTop: insets.top + 10 }]}>
          <Text style={styles.telemetryText}>// SYS.TRACKER.ONLINE</Text>
          <Text style={styles.massiveTitle}>
            WAR<Text style={{ color: activeColor }}>ROOM.</Text>
          </Text>
        </View>

        {/* 2. CONSOLA DE FILTROS FIJA (STICKY) */}
        <View style={{ zIndex: 10 }}>
          <BlurView intensity={80} tint="dark" style={styles.stickyHeader}>
            {/* LÍNEA DE ENERGÍA SUPERIOR */}
            <View style={[styles.energyLine, { backgroundColor: activeColor, shadowColor: activeColor }]} />
            
            {/* TABS DE DEPORTES */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
              {FILTERS.map((f) => {
                const isActive = filter === f.key;
                const fAccent = f.key === "all" ? colors.primary : ((colors as any)[SPORTS.find(s => s.key === f.key)?.accent!] || colors.primary);
                
                return (
                  <Pressable
                    key={f.key}
                    onPress={() => handleSportChange(f.key)}
                    style={[
                      styles.chip,
                      isActive ? { backgroundColor: fAccent } : { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }
                    ]}
                  >
                    {isActive && (
                      <View style={[styles.chipGlow, { backgroundColor: fAccent }]} />
                    )}
                    <Text style={[styles.chipText, { color: isActive ? "#000" : "#888" }]}>
                      {f.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* SUB-TABS TÁCTICOS (TORNEOS) */}
            <Animated.View entering={FadeInDown.duration(300)}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tournamentFilters}>
                {TOURNAMENTS[filter]?.map((tourney) => {
                  const isActive = tourney === activeTournament;
                  return (
                    <Pressable
                      key={tourney}
                      onPress={() => setActiveTournament(tourney)}
                      style={styles.tourneyChip}
                    >
                      <Text style={[styles.tourneyChipText, { color: isActive ? activeColor : 'rgba(255,255,255,0.3)' }]}>
                        {isActive ? `[ ${tourney.toUpperCase()} ]` : tourney.toUpperCase()}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Animated.View>
          </BlurView>
        </View>

        {/* 3. ZONAS DE BATALLA (CONTENIDO) */}
        <View style={styles.content}>
          
          {/* SECCIÓN: EN JUEGO (ESTILO URGENTE/NEÓN) */}
          {live.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.livePulseWrap}>
                  <View style={[styles.liveDot, { backgroundColor: colors.live || '#E10600' }]} />
                  <View style={[styles.liveDotPulse, { backgroundColor: colors.live || '#E10600' }]} />
                </View>
                <Text style={[styles.modernSectionTitle, { color: '#FFF' }]}>EN CONFRONTACIÓN</Text>
              </View>
              
              <Animated.View layout={LinearTransition.springify()} style={{ gap: 20 }}>
                {live.map((m, index) => (
                  <Animated.View key={m.id} entering={FadeInDown.delay(index * 100).springify()}>
                    {/* Borde Neón para Partidos en Vivo */}
                    <View style={styles.liveCardWrapper}>
                      <LinearGradient
                        colors={[`${activeColor}80`, 'rgba(0,0,0,0)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.liveCardGradient}
                      />
                      <View style={styles.cardInner}>
                        <MatchCard match={m} flashKey={flashKeys[m.id]} />
                      </View>
                    </View>
                  </Animated.View>
                ))}
              </Animated.View>
            </View>
          )}

          {/* SECCIÓN: PRÓXIMOS (ESTILO TIMELINE) */}
          {upcoming.length > 0 && (
            <View style={[styles.section, { marginTop: 10 }]}>
              <View style={styles.sectionTitleRow}>
                <Feather name="target" size={16} color={activeColor} style={{ marginRight: 8 }} />
                <Text style={styles.modernSectionTitle}>OBJETIVOS PRÓXIMOS</Text>
              </View>
              
              <Animated.View layout={LinearTransition.springify()}>
                {upcoming.map((m, index) => (
                  <Animated.View key={m.id} entering={FadeInDown.delay((live.length + index) * 100).springify()} style={styles.timelineRow}>
                    
                    {/* Eje del Timeline */}
                    <View style={styles.timelineAxis}>
                      <View style={[styles.timelineNode, { borderColor: activeColor }]} />
                      {index !== upcoming.length - 1 && <View style={[styles.timelineLine, { backgroundColor: activeColor }]} />}
                    </View>

                    {/* Tarjeta del Partido */}
                    <View style={styles.timelineContent}>
                      <MatchCard match={m} />
                    </View>

                  </Animated.View>
                ))}
              </Animated.View>
            </View>
          )}

          {/* SECCIÓN: FINALIZADOS (ESTILO ARCHIVO/HACKED) */}
          {finals.length > 0 && (
            <View style={[styles.section, { marginTop: 20 }]}>
              <View style={styles.sectionTitleRow}>
                <Feather name="database" size={16} color="rgba(255,255,255,0.3)" style={{ marginRight: 8 }} />
                <Text style={[styles.modernSectionTitle, { color: 'rgba(255,255,255,0.3)' }]}>REGISTROS FINALIZADOS</Text>
              </View>
              
              <Animated.View layout={LinearTransition.springify()} style={{ gap: 16 }}>
                {finals.map((m, index) => (
                  <Animated.View key={m.id} entering={FadeInDown.delay((live.length + upcoming.length + index) * 100).springify()}>
                    <View style={styles.archivedCard}>
                      <MatchCard match={m} />
                      {/* Overlay oscuro para darle look de "Finalizado/Apagado" */}
                      <View style={styles.archivedOverlay} pointerEvents="none" />
                    </View>
                  </Animated.View>
                ))}
              </Animated.View>
            </View>
          )}

          {/* 4. ESTADO VACÍO (RADAR ESCANEANDO) */}
          {tournamentFilteredMatches.length === 0 && (
            <Animated.View entering={ZoomIn.springify()} style={styles.empty}>
              <View style={styles.radarContainer}>
                <View style={[styles.radarCircle, { borderColor: `${activeColor}30` }]} />
                <View style={[styles.radarCircle2, { borderColor: `${activeColor}15` }]} />
                <Feather name="crosshair" size={40} color={activeColor} style={{ opacity: 0.8 }} />
              </View>
              <Text style={styles.emptyTitle}>SECTOR DESPEJADO</Text>
              <Text style={styles.emptyText}>
                Los sensores no detectan actividad actual en el cuadrante de {activeTournament}.
              </Text>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  ambientGlow: {
    position: 'absolute',
    top: 0, width: '100%', height: 300,
    zIndex: 0,
  },
  
  // HEADER
  modernHeader: { paddingHorizontal: 20, paddingBottom: 15, zIndex: 2 },
  telemetryText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, marginBottom: 5 },
  massiveTitle: { fontFamily: 'Inter_900Black', fontSize: 52, lineHeight: 52, letterSpacing: -2, color: '#FFF' },

  // STICKY HEADER & FILTERS
  stickyHeader: { backgroundColor: 'rgba(5,5,5,0.7)', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  energyLine: { height: 2, width: '100%', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 5 },
  
  filters: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 12, gap: 10 },
  chip: { 
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24, 
    justifyContent: 'center', alignItems: 'center', position: 'relative'
  },
  chipGlow: { position: 'absolute', width: '100%', height: '100%', borderRadius: 24, filter: 'blur(8px)', opacity: 0.6, zIndex: -1 },
  chipText: { fontFamily: 'Inter_900Black', fontSize: 11, letterSpacing: 1.5 },

  tournamentFilters: { paddingHorizontal: 20, paddingBottom: 15, gap: 20 },
  tourneyChip: { paddingVertical: 4 },
  tourneyChipText: { fontFamily: 'Inter_800ExtraBold', fontSize: 11, letterSpacing: 2 },

  content: { paddingTop: 30, paddingHorizontal: 20 },
  
  // SECCIONES
  section: { marginBottom: 40 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  
  livePulseWrap: { width: 14, height: 14, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  liveDot: { width: 8, height: 8, borderRadius: 4, zIndex: 2 },
  liveDotPulse: { position: 'absolute', width: 14, height: 14, borderRadius: 7, opacity: 0.4 },
  
  modernSectionTitle: { fontFamily: 'Inter_900Black', fontSize: 13, letterSpacing: 2 },

  // WRAPPERS DE MATCHCARDS (TÁCTICOS)
  liveCardWrapper: {
    position: 'relative',
    borderRadius: 20,
    paddingTop: 2, // Borde superior luminoso
    backgroundColor: '#111',
  },
  liveCardGradient: {
    position: 'absolute',
    top: 0, left: 0, right: 0, height: 40,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    opacity: 0.5,
  },
  cardInner: {
    backgroundColor: '#0B0B0B', // Más oscuro que el card normal
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  // TIMELINE
  timelineRow: { flexDirection: 'row', marginBottom: 20 },
  timelineAxis: { width: 20, alignItems: 'center', marginRight: 15 },
  timelineNode: { width: 12, height: 12, borderRadius: 6, borderWidth: 3, backgroundColor: '#050505', marginTop: 30 },
  timelineLine: { position: 'absolute', top: 42, bottom: -50, width: 2, opacity: 0.3 },
  timelineContent: { flex: 1 },

  // FINALIZADOS
  archivedCard: { position: 'relative', borderRadius: 20, overflow: 'hidden' },
  archivedOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },

  // EMPTY STATE (RADAR)
  empty: { padding: 40, alignItems: "center", justifyContent: "center", marginTop: 40 },
  radarContainer: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center', marginBottom: 24, position: 'relative' },
  radarCircle: { position: 'absolute', width: 120, height: 120, borderRadius: 60, borderWidth: 1, borderStyle: 'dashed' },
  radarCircle2: { position: 'absolute', width: 80, height: 80, borderRadius: 40, borderWidth: 1 },
  emptyTitle: { fontFamily: "Inter_900Black", fontSize: 20, color: '#FFF', letterSpacing: 2, marginBottom: 10 },
  emptyText: { fontFamily: "Inter_500Medium", fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: "center", lineHeight: 22 },
});