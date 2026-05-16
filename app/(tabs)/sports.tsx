import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions
} from "react-native";
import Animated, { FadeIn, FadeInDown, LinearTransition, ZoomIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

import { SPORTS, SportKey, TEAMS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");

// --- MOCK DE TORNEOS ---
const TOURNAMENTS: Record<string, string[]> = {
  soccer: ["Liga Dominical", "Torneo Nocturno", "Copa Durango"],
  flag: ["Tocho Durango Dominical", "Liga Femenil", "Torneo Mixto"],
  basketball: ["Liga Mayor", "2da Fuerza"],
  fitness: ["Reto 30 Días", "Crossfit Games"],
  all: ["General"]
};

export default function SportsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ sport?: string }>();
  const initial = (params.sport as SportKey) ?? "flag";
  
  const [activeSport, setActiveSport] = useState<SportKey>(initial);
  const [activeTournament, setActiveTournament] = useState<string>(TOURNAMENTS[initial]?.[0] || "General");

  const sport = useMemo(() => SPORTS.find((s) => s.key === activeSport) ?? SPORTS[0]!, [activeSport]);
  const activeColor = (colors as any)[sport.accent] || colors.primary;
  
  const handleSportChange = (sportKey: SportKey) => {
    setActiveSport(sportKey);
    setActiveTournament(TOURNAMENTS[sportKey]?.[0] || "General");
  };

  const allSportTeams = TEAMS.filter((t) => t.sport === sport.key);
  const teams = activeTournament.includes("Femenil") 
    ? allSportTeams.slice(0, 3) 
    : activeTournament.includes("Nocturno") 
      ? allSportTeams.slice(2, 6) 
      : allSportTeams;

  // --- RENDERIZADOR DE COLUMNAS DE TELEMETRÍA ---
  const renderTableHeaders = () => {
    switch (sport.key) {
      case "soccer":
        return (
          <>
            <Text style={[styles.th, { width: 25 }]}>J</Text>
            <Text style={[styles.th, { width: 25 }]}>G</Text>
            <Text style={[styles.th, { width: 25 }]}>E</Text>
            <Text style={[styles.th, { width: 25 }]}>P</Text>
            <Text style={[styles.thHighlight, { width: 40, color: activeColor }]}>PTS</Text>
          </>
        );
      case "flag":
      case "basketball":
        return (
          <>
            <Text style={[styles.th, { width: 30 }]}>J</Text>
            <Text style={[styles.th, { width: 30 }]}>G</Text>
            <Text style={[styles.th, { width: 30 }]}>P</Text>
            <Text style={[styles.thHighlight, { width: 50, color: activeColor }]}>PCT</Text>
          </>
        );
      default:
        return <Text style={[styles.thHighlight, { width: 50, color: activeColor }]}>PTS</Text>;
    }
  };

  const renderTeamStats = (team: any, index: number) => {
    const J = 10;
    const G = 10 - index;
    const E = index % 2 === 0 ? 1 : 0;
    const P = J - G - E;
    const PTS = (G * 3) + (E * 1);
    const PCT = (G / J).toFixed(3).replace('0.', '.'); 

    switch (sport.key) {
      case "soccer":
        return (
          <>
            <Text style={styles.tdStat}>{J}</Text>
            <Text style={styles.tdStat}>{G}</Text>
            <Text style={styles.tdStat}>{E}</Text>
            <Text style={styles.tdStat}>{P}</Text>
            <View style={[styles.tdHighlightWrap, { backgroundColor: `${activeColor}15` }]}>
              <Text style={[styles.tdPts, { color: activeColor }]}>{PTS}</Text>
            </View>
          </>
        );
      case "flag":
      case "basketball":
        return (
          <>
            <Text style={[styles.tdStat, { width: 30 }]}>{J}</Text>
            <Text style={[styles.tdStat, { width: 30 }]}>{G}</Text>
            <Text style={[styles.tdStat, { width: 30 }]}>{P}</Text>
            <View style={[styles.tdHighlightWrap, { width: 50, backgroundColor: `${activeColor}15` }]}>
              <Text style={[styles.tdPts, { color: activeColor, fontSize: 13 }]}>{PCT}</Text>
            </View>
          </>
        );
      default:
        return (
          <View style={[styles.tdHighlightWrap, { backgroundColor: `${activeColor}15` }]}>
            <Text style={[styles.tdPts, { color: activeColor }]}>{PTS}</Text>
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#050505' }]}>
      
      {/* GLOW AMBIENTAL DINÁMICO */}
      <Animated.View style={styles.ambientGlow} entering={FadeIn.duration(500)}>
        <LinearGradient
          colors={[`${activeColor}25`, 'transparent']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 140 }} 
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]} // El BlurView es el índice 1
      >
        
        {/* 1. HEADER DE DATOS */}
        <View style={[styles.modernHeader, { paddingTop: insets.top + 10 }]}>
          <Text style={styles.telemetryText}>// LEAGUE.DIRECTIVE</Text>
          <Text style={styles.massiveTitle}>
            DATA<Text style={{ color: activeColor }}>HUB.</Text>
          </Text>
        </View>

        {/* 2. CONSOLA DE FILTROS TÁCTICOS (STICKY) */}
        <View style={{ zIndex: 10 }}>
          <BlurView intensity={80} tint="dark" style={styles.stickyHeader}>
            <View style={[styles.energyLine, { backgroundColor: activeColor, shadowColor: activeColor }]} />
            
            {/* Chips de Deportes */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
              {SPORTS.map((s) => {
                const isActive = s.key === activeSport;
                const sAccent = (colors as any)[s.accent] || colors.primary;
                return (
                  <Pressable
                    key={s.key}
                    onPress={() => handleSportChange(s.key)}
                    style={[
                      styles.chip,
                      isActive ? { backgroundColor: sAccent } : { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }
                    ]}
                  >
                    {isActive && <View style={[styles.chipGlow, { backgroundColor: sAccent }]} />}
                    <Feather name={s.icon as keyof typeof Feather.glyphMap} size={14} color={isActive ? "#000" : "#888"} style={{ marginRight: 6 }}/>
                    <Text style={[styles.chipText, { color: isActive ? "#000" : "#888" }]}>{s.name.toUpperCase()}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Sub-Tabs de Torneos */}
            <Animated.View entering={FadeInDown.duration(300)}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tournamentFilters}>
                {TOURNAMENTS[activeSport]?.map((tourney) => {
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

        {/* 3. BANNER "SEASON INTEL" */}
        <Animated.View key={`banner-${activeTournament}`} entering={FadeIn.duration(500)} style={styles.bannerContainer}>
          <View style={[styles.bannerCard, { borderColor: `${activeColor}40` }]}>
            <LinearGradient colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFillObject} />
            
            <Feather name={sport.icon as keyof typeof Feather.glyphMap} size={160} color={activeColor} style={styles.bannerBgIcon} />
            <Text style={[styles.bannerWatermark, { color: `${activeColor}10` }]} numberOfLines={1}>
              {sport.key.toUpperCase()}
            </Text>

            <View style={styles.bannerContent}>
              <View style={styles.bannerTopRow}>
                <View style={[styles.highlightTag, { backgroundColor: activeColor }]}>
                  <Text style={styles.highlightTagText}>
                    {sport.highlighted ? "ESTATUS: ESTELAR" : "SEASON INTEL"}
                  </Text>
                </View>
                <Feather name="bar-chart-2" size={20} color={activeColor} />
              </View>
              
              <View style={{ marginTop: 'auto' }}>
                <Text style={styles.bannerTitle} numberOfLines={2}>{activeTournament}</Text>
                <Text style={styles.bannerDesc} numberOfLines={1}>ADMIN: {sport.name.toUpperCase()} LEAGUE</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* 4. STANDINGS (TABLA DE TELEMETRÍA) */}
        <View style={styles.tableSection}>
          <View style={styles.sectionHeaderWrap}>
            <View style={[styles.verticalAccent, { backgroundColor: activeColor }]} />
            <Text style={styles.sectionTitle}>CLASIFICACIÓN GENERAL</Text>
          </View>
          
          <View style={styles.tableCard}>
            {/* Header de la Tabla */}
            <View style={styles.tableHeader}>
              <Text style={[styles.th, { width: 35 }]}>#</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'left' }]}>ESCUADRÓN</Text>
              {renderTableHeaders()}
            </View>

            {/* Cuerpo de la Tabla */}
            {teams.length === 0 ? (
              <Animated.View entering={ZoomIn.springify()} style={styles.empty}>
                <View style={styles.radarContainer}>
                  <View style={[styles.radarCircle, { borderColor: `${activeColor}30` }]} />
                  <Ionicons name="shield-half-outline" size={40} color={activeColor} style={{ opacity: 0.8 }} />
                </View>
                <Text style={styles.emptyTitle}>SISTEMA EN ESPERA</Text>
                <Text style={styles.emptyText}>La fase de inscripción de escuadrones está activa.</Text>
              </Animated.View>
            ) : (
              <Animated.View layout={LinearTransition.springify()}>
                {teams.map((team, index) => {
                  const isTop = index < 3; 
                  return (
                    <Animated.View key={team.id} entering={FadeInDown.delay(index * 80).springify()}>
                      <Pressable style={({ pressed }) => [
                        styles.tableRow, 
                        pressed && { backgroundColor: 'rgba(255,255,255,0.05)' },
                        index === teams.length - 1 && { borderBottomWidth: 0 }
                      ]}>
                        
                        {/* Fondo Glow para los Clasificados (Top 3) */}
                        {isTop && (
                          <LinearGradient
                            colors={[`${activeColor}15`, 'transparent']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0.8, y: 0 }}
                            style={StyleSheet.absoluteFillObject}
                          />
                        )}

                        {/* Barra Izquierda Neón */}
                        {isTop && <View style={[styles.qualifyBar, { backgroundColor: activeColor, shadowColor: activeColor }]} />}
                        
                        {/* Posición */}
                        <Text style={[styles.tdPos, isTop ? { color: activeColor, textShadowColor: activeColor, textShadowRadius: 8 } : { color: 'rgba(255,255,255,0.3)' }]}>
                          0{index + 1}
                        </Text>
                        
                        {/* Equipo */}
                        <View style={styles.tdTeam}>
                          <View style={[styles.teamBadgeBadge, { backgroundColor: team.colorHex || '#333' }]}>
                            <Text style={styles.teamBadgeText}>{team.short?.substring(0, 2) || 'TM'}</Text>
                          </View>
                          <Text style={[styles.tdTeamName, isTop && { color: '#FFF' }]} numberOfLines={1}>{team.name}</Text>
                        </View>

                        {/* Stats */}
                        {renderTeamStats(team, index)}
                      </Pressable>
                    </Animated.View>
                  );
                })}
              </Animated.View>
            )}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  ambientGlow: { position: 'absolute', top: 0, width: '100%', height: 350, zIndex: 0 },
  
  // HEADER
  modernHeader: { paddingHorizontal: 20, paddingBottom: 15, zIndex: 2 },
  telemetryText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, marginBottom: 5 },
  massiveTitle: { fontFamily: 'Inter_900Black', fontSize: 52, lineHeight: 52, letterSpacing: -2, color: '#FFF' },

  // STICKY HEADER & FILTERS
  stickyHeader: { backgroundColor: 'rgba(5,5,5,0.7)', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  energyLine: { height: 2, width: '100%', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 5 },
  
  filters: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 12, gap: 10 },
  chip: { flexDirection: 'row', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  chipGlow: { position: 'absolute', width: '100%', height: '100%', borderRadius: 24, filter: 'blur(8px)', opacity: 0.6, zIndex: -1 },
  chipText: { fontFamily: 'Inter_900Black', fontSize: 11, letterSpacing: 1.5 },

  tournamentFilters: { paddingHorizontal: 20, paddingBottom: 15, gap: 20 },
  tourneyChip: { paddingVertical: 4 },
  tourneyChipText: { fontFamily: 'Inter_800ExtraBold', fontSize: 11, letterSpacing: 2 },

  // BANNER SEASON INTEL
  bannerContainer: { paddingHorizontal: 20, paddingTop: 30, marginBottom: 30 },
  bannerCard: { 
    height: 180, borderRadius: 28, overflow: 'hidden', 
    backgroundColor: '#111', borderWidth: 1, position: 'relative',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 15
  },
  bannerBgIcon: { position: 'absolute', right: -30, bottom: -30, opacity: 0.1, transform: [{ rotate: '-15deg' }] },
  bannerWatermark: { position: 'absolute', top: 40, left: -10, fontFamily: 'Inter_900Black', fontSize: 72, letterSpacing: -3, zIndex: 0 },
  bannerContent: { flex: 1, padding: 20, zIndex: 2 },
  bannerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  highlightTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, transform: [{ skewX: '-10deg' }] },
  highlightTagText: { color: "#000", fontFamily: "Inter_900Black", fontSize: 10, letterSpacing: 1 },
  bannerTitle: { color: '#FFF', fontFamily: 'Inter_900Black', fontSize: 32, lineHeight: 32, letterSpacing: -1, marginBottom: 4 },
  bannerDesc: { color: 'rgba(255,255,255,0.6)', fontFamily: "Inter_600SemiBold", fontSize: 11, letterSpacing: 1 },

  // STANDINGS TABLE
  tableSection: { paddingHorizontal: 20 },
  sectionHeaderWrap: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  verticalAccent: { width: 4, height: 16, borderRadius: 2, marginRight: 8, transform: [{ skewX: '-10deg' }] },
  sectionTitle: { fontFamily: 'Inter_900Black', fontSize: 14, color: '#FFF', letterSpacing: 2, textTransform: 'uppercase' },
  
  tableCard: { backgroundColor: '#0A0A0A', borderRadius: 24, paddingVertical: 4, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  
  tableHeader: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  th: { color: 'rgba(255,255,255,0.3)', fontFamily: 'Inter_800ExtraBold', fontSize: 10, letterSpacing: 1, textAlign: 'center' },
  thHighlight: { fontFamily: 'Inter_900Black', fontSize: 10, letterSpacing: 1, textAlign: 'center' },
  
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.05)', position: 'relative' },
  qualifyBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, shadowOffset: { width: 2, height: 0 }, shadowOpacity: 1, shadowRadius: 4 },
  
  tdPos: { width: 35, fontFamily: 'Inter_900Black', fontSize: 14 },
  tdTeam: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, paddingRight: 10 },
  teamBadgeBadge: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-5deg' }] },
  teamBadgeText: { color: '#FFF', fontFamily: 'Inter_800ExtraBold', fontSize: 10 },
  tdTeamName: { flex: 1, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_700Bold', fontSize: 14, letterSpacing: -0.5 },
  
  tdStat: { width: 25, textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  tdHighlightWrap: { paddingVertical: 4, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  tdPts: { fontFamily: 'Inter_900Black', fontSize: 14 },

  // EMPTY STATE
  empty: { padding: 40, alignItems: "center", justifyContent: "center", marginTop: 20 },
  radarContainer: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative' },
  radarCircle: { position: 'absolute', width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderStyle: 'dashed' },
  emptyTitle: { fontFamily: "Inter_900Black", fontSize: 16, color: '#FFF', letterSpacing: 2, marginBottom: 8 },
  emptyText: { fontFamily: "Inter_500Medium", fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: "center", lineHeight: 20 },
});