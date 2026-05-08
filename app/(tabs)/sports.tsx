import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown, LinearTransition } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SPORTS, SportKey, TEAMS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

// --- MOCK DE TORNEOS POR DEPORTE ---
// Esto simula tu base de datos donde cada deporte tiene múltiples ligas
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
  // Nuevo estado para controlar qué torneo estamos viendo
  const [activeTournament, setActiveTournament] = useState<string>(TOURNAMENTS[initial]?.[0] || "General");

  const sport = useMemo(() => SPORTS.find((s) => s.key === activeSport) ?? SPORTS[0]!, [activeSport]);
  const accent = colors[sport.accent] || colors.primary;
  
  // Cambiar el torneo activo automáticamente cuando cambiamos de deporte
  const handleSportChange = (sportKey: SportKey) => {
    setActiveSport(sportKey);
    setActiveTournament(TOURNAMENTS[sportKey]?.[0] || "General");
  };

  // Filtramos equipos. En un caso real, filtrarías por `team.tournamentId`
  // Aquí hacemos un pequeño truco para que parezca que los equipos cambian por torneo
  const allSportTeams = TEAMS.filter((t) => t.sport === sport.key);
  const teams = activeTournament.includes("Femenil") 
    ? allSportTeams.slice(0, 3) 
    : activeTournament.includes("Nocturno") 
      ? allSportTeams.slice(2, 6) 
      : allSportTeams;

  // --- RENDERIZADOR DE COLUMNAS DINÁMICAS ---
  // Dependiendo del deporte, los administradores quieren ver estadísticas diferentes
  const renderTableHeaders = () => {
    switch (sport.key) {
      case "soccer":
        return (
          <>
            <Text style={[styles.th, { width: 25, textAlign: 'center' }]}>J</Text>
            <Text style={[styles.th, { width: 25, textAlign: 'center' }]}>G</Text>
            <Text style={[styles.th, { width: 25, textAlign: 'center' }]}>E</Text>
            <Text style={[styles.th, { width: 25, textAlign: 'center' }]}>P</Text>
            <Text style={[styles.th, { width: 35, textAlign: 'center', color: '#FFF' }]}>PTS</Text>
          </>
        );
      case "flag":
      case "basketball":
        return (
          <>
            <Text style={[styles.th, { width: 30, textAlign: 'center' }]}>J</Text>
            <Text style={[styles.th, { width: 30, textAlign: 'center' }]}>G</Text>
            <Text style={[styles.th, { width: 30, textAlign: 'center' }]}>P</Text>
            <Text style={[styles.th, { width: 45, textAlign: 'center', color: '#FFF' }]}>PCT</Text>
          </>
        );
      default:
        return <Text style={[styles.th, { width: 45, textAlign: 'center', color: '#FFF' }]}>PTS</Text>;
    }
  };

  const renderTeamStats = (team: any, index: number) => {
    const J = 10;
    const G = 10 - index;
    const E = index % 2 === 0 ? 1 : 0;
    const P = J - G - E;
    const PTS = (G * 3) + (E * 1);
    const PCT = (G / J).toFixed(3).replace('0.', '.'); // Ej: .800

    switch (sport.key) {
      case "soccer":
        return (
          <>
            <Text style={styles.tdStat}>{J}</Text>
            <Text style={styles.tdStat}>{G}</Text>
            <Text style={styles.tdStat}>{E}</Text>
            <Text style={styles.tdStat}>{P}</Text>
            <Text style={[styles.tdStat, styles.tdPts]}>{PTS}</Text>
          </>
        );
      case "flag":
      case "basketball":
        return (
          <>
            <Text style={[styles.tdStat, { width: 30 }]}>{J}</Text>
            <Text style={[styles.tdStat, { width: 30 }]}>{G}</Text>
            <Text style={[styles.tdStat, { width: 30 }]}>{P}</Text>
            <Text style={[styles.tdStat, styles.tdPts, { width: 45, fontSize: 13 }]}>{PCT}</Text>
          </>
        );
      default:
        return <Text style={[styles.tdStat, styles.tdPts]}>{PTS}</Text>;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#000000' }]}>
      
      {/* 1. HEADER MASIVO */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.massiveTitle}>
          Ligas &{"\n"}
          <Text style={{ color: accent }}>Torneos.</Text>
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        
        {/* 2. CHIPS DE DEPORTES */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {SPORTS.map((s) => {
            const isActive = s.key === activeSport;
            const sAccent = colors[s.accent] || colors.primary;
            return (
              <Pressable
                key={s.key}
                onPress={() => handleSportChange(s.key)}
                style={[styles.chip, { backgroundColor: isActive ? sAccent : '#1A1A1A' }]}
              >
                <Feather name={s.icon as keyof typeof Feather.glyphMap} size={16} color={isActive ? "#000" : "#888"} style={{ marginRight: 6 }}/>
                <Text style={[styles.chipText, { color: isActive ? "#000" : "#888" }]}>{s.name.toUpperCase()}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* 3. SUB-SELECTOR DE TORNEOS (El secreto para personalizar) */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tournamentFilters}>
            {TOURNAMENTS[activeSport]?.map((tourney) => {
              const isActive = tourney === activeTournament;
              return (
                <Pressable
                  key={tourney}
                  onPress={() => setActiveTournament(tourney)}
                  style={[styles.tourneyChip, isActive && { borderBottomColor: accent }]}
                >
                  <Text style={[styles.tourneyChipText, { color: isActive ? '#FFF' : 'rgba(255,255,255,0.4)' }]}>
                    {tourney.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* 4. BANNER DEL TORNEO ACTIVO */}
        <Animated.View key={activeTournament} entering={FadeIn.duration(400)} style={styles.bannerContainer}>
          <LinearGradient colors={[`${accent}40`, 'transparent']} style={styles.bannerGradient}>
            <Feather name={sport.icon as keyof typeof Feather.glyphMap} size={120} color={accent} style={styles.bannerBgIcon} />
            <View style={styles.bannerContent}>
              <View style={[styles.highlightTag, { backgroundColor: accent }]}>
                <Text style={styles.highlightTagText}>
                  {sport.highlighted ? "TORNEO ESTELAR" : "TEMPORADA 2026"}
                </Text>
              </View>
              <Text style={styles.bannerTitle} numberOfLines={1}>{activeTournament}</Text>
              <Text style={styles.bannerDesc} numberOfLines={1}>Administrado por {sport.name} Durango</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* 5. TABLA DE POSICIONES ULTRA MODERNA Y DINÁMICA */}
        <View style={styles.tableSection}>
          <Text style={styles.sectionTitle}>CLASIFICACIÓN GENERAL</Text>
          
          <View style={styles.tableCard}>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, { width: 30 }]}>#</Text>
              <Text style={[styles.th, { flex: 1 }]}>EQUIPO</Text>
              {renderTableHeaders()}
            </View>

            {teams.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons name="shield-half-outline" size={48} color="#333" />
                <Text style={styles.emptyText}>Torneo en fase de inscripción</Text>
              </View>
            ) : (
              <Animated.View layout={LinearTransition.springify()}>
                {teams.map((team, index) => {
                  const isTop = index < 3; 
                  return (
                    <Animated.View key={team.id} entering={FadeInDown.delay(index * 50).springify()} style={[styles.tableRow, index === teams.length - 1 && { borderBottomWidth: 0 }]}>
                      {isTop && <View style={[styles.qualifyBar, { backgroundColor: accent }]} />}
                      <Text style={[styles.tdPos, isTop && { color: accent }]}>{index + 1}</Text>
                      
                      <Pressable style={styles.tdTeam} onPress={() => console.log('Ir a equipo', team.id)}>
                        <View style={[styles.teamBadgeBadge, { backgroundColor: team.colorHex || '#333' }]}>
                          <Text style={styles.teamBadgeText}>{team.short?.substring(0, 2) || 'TM'}</Text>
                        </View>
                        <Text style={styles.tdTeamName} numberOfLines={1}>{team.name}</Text>
                      </Pressable>

                      {renderTeamStats(team, index)}
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
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 10 },
  massiveTitle: { fontFamily: 'Inter_900Black', fontSize: 40, lineHeight: 42, letterSpacing: -1.5, color: '#FFF' },
  
  filters: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 4, gap: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 24 },
  chipText: { fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 1 },

  // ESTILOS DEL NUEVO SELECTOR DE TORNEOS
  tournamentFilters: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 10, gap: 24 },
  tourneyChip: { paddingBottom: 8, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tourneyChipText: { fontFamily: 'Inter_800ExtraBold', fontSize: 12, letterSpacing: 1 },
  
  bannerContainer: { paddingHorizontal: 20, marginBottom: 30 },
  bannerGradient: { borderRadius: 32, padding: 24, minHeight: 140, justifyContent: 'flex-end', overflow: 'hidden' },
  bannerBgIcon: { position: 'absolute', right: -20, top: -20, opacity: 0.2, transform: [{ rotate: '15deg' }] },
  bannerContent: { gap: 8 },
  highlightTag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 4 },
  highlightTagText: { color: "#000", fontFamily: "Inter_800ExtraBold", fontSize: 10, letterSpacing: 1 },
  bannerTitle: { color: '#FFF', fontFamily: 'Inter_900Black', fontSize: 24, letterSpacing: -0.5 },
  bannerDesc: { color: 'rgba(255,255,255,0.6)', fontFamily: "Inter_500Medium", fontSize: 13 },
  
  tableSection: { paddingHorizontal: 20 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, marginBottom: 16 },
  tableCard: { backgroundColor: '#111111', borderRadius: 32, paddingVertical: 10, overflow: 'hidden' },
  
  tableHeader: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  th: { color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1 },
  
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.05)' },
  qualifyBar: { position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 4, borderTopRightRadius: 4, borderBottomRightRadius: 4 },
  
  tdPos: { width: 30, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter_700Bold', fontSize: 14 },
  tdTeam: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, paddingRight: 10 },
  
  teamBadgeBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  teamBadgeText: { color: '#FFF', fontFamily: 'Inter_800ExtraBold', fontSize: 10 },
  tdTeamName: { flex: 1, color: '#FFF', fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  
  tdStat: { width: 25, textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter_500Medium', fontSize: 13 },
  tdPts: { width: 35, color: '#FFF', fontFamily: 'Inter_800ExtraBold', fontSize: 15 },
  
  empty: { padding: 40, alignItems: 'center', gap: 12 },
  emptyText: { fontFamily: "Inter_500Medium", fontSize: 15, color: 'rgba(255,255,255,0.4)' },
});