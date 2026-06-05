import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
} from "react-native";
import Animated, { FadeIn, FadeInDown, FadeOut, LinearTransition, ZoomIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

import { SPORTS, SportKey, TEAMS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

// ¡CORRECCIÓN AQUÍ! Se agregó 'height'
const { width, height } = Dimensions.get("window");

// --- MOCK DE TORNEOS ---
const TOURNAMENTS: Record<string, string[]> = {
  soccer: ["Liga Dominical", "Torneo Nocturno", "Copa Durango"],
  flag: ["Tocho Durango Dominical", "Liga Femenil", "Torneo Mixto"],
  basketball: ["Liga Mayor", "2da Fuerza"],
  fitness: ["Reto 30 Días", "Crossfit Games"],
  all: ["General"]
};

// --- IMÁGENES DE FONDO POR DEPORTE ---
const SPORT_BACKGROUNDS: Record<string, string> = {
  soccer: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop",
  flag: "https://images.unsplash.com/photo-1563705534608-895101a9df86?q=80&w=800&auto=format&fit=crop",
  basketball: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop",
  fitness: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1525914813433-886dc8183afa?q=80&w=1000&auto=format&fit=crop",
};

export default function SportsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ sport?: string }>();
  const initial = (params.sport as SportKey) ?? "flag";
  
  const [activeSport, setActiveSport] = useState<SportKey>(initial);
  const [activeTournament, setActiveTournament] = useState<string>(TOURNAMENTS[initial]?.[0] || "General");

  const sport = useMemo(() => SPORTS.find((s) => s.key === activeSport) ?? SPORTS[0]!, [activeSport]);
  // Si el deporte no tiene color definido, usamos un verde neón base
  const activeColor = (colors as any)[sport.accent] || "#39FF14"; 
  const sportBgImage = SPORT_BACKGROUNDS[sport.key] || SPORT_BACKGROUNDS.default;
  
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
            <View style={[styles.tdHighlightWrap, { backgroundColor: `${activeColor}15`, borderColor: `${activeColor}30` }]}>
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
            <View style={[styles.tdHighlightWrap, { width: 50, backgroundColor: `${activeColor}15`, borderColor: `${activeColor}30` }]}>
              <Text style={[styles.tdPts, { color: activeColor, fontSize: 13 }]}>{PCT}</Text>
            </View>
          </>
        );
      default:
        return (
          <View style={[styles.tdHighlightWrap, { backgroundColor: `${activeColor}15`, borderColor: `${activeColor}30` }]}>
            <Text style={[styles.tdPts, { color: activeColor }]}>{PTS}</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      
      {/* ── FONDO AMBIENTAL INMERSIVO (Cambia con el deporte) ── */}
      <Animated.View key={`bg-${activeSport}`} entering={FadeIn.duration(800)} exiting={FadeOut} style={StyleSheet.absoluteFillObject}>
        <Image source={{ uri: sportBgImage }} style={styles.ambientImage} blurRadius={40} />
        <LinearGradient
          colors={[`rgba(5,5,5,0.4)`, `rgba(5,5,5,0.95)`, `#050505`]}
          locations={[0, 0.4, 0.7]}
          style={StyleSheet.absoluteFillObject}
        />
        {/* Capa de color de acento muy sutil */}
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: activeColor, opacity: 0.05 }]} />
      </Animated.View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 140 }} 
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        
        {/* ── 1. HEADER ── */}
        <Animated.View entering={FadeInDown.duration(600)} style={[styles.modernHeader, { paddingTop: insets.top + 10 }]}>
          <Text style={[styles.telemetryText, { color: activeColor }]}>// {sport.key.toUpperCase()}.DIRECTIVE</Text>
          <Text style={styles.massiveTitle}>
            DATA<Text style={{ color: activeColor }}>HUB.</Text>
          </Text>
        </Animated.View>

        {/* ── 2. CONSOLA DE FILTROS TÁCTICOS ── */}
        <View style={{ zIndex: 10 }}>
          <BlurView intensity={80} tint="dark" style={styles.stickyHeader}>
            <Animated.View style={[styles.energyLine, { backgroundColor: activeColor, shadowColor: activeColor }]} />
            
            {/* Chips de Deportes */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
              {SPORTS.map((s) => {
                const isActive = s.key === activeSport;
                const sAccent = (colors as any)[s.accent] || "#39FF14";
                return (
                  <Pressable
                    key={s.key}
                    onPress={() => handleSportChange(s.key)}
                    style={[
                      styles.chip,
                      isActive ? { backgroundColor: sAccent, borderColor: sAccent } : { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }
                    ]}
                  >
                    {isActive && <View style={[styles.chipGlow, { backgroundColor: sAccent }]} />}
                    <MaterialCommunityIcons 
                      name={s.icon as any} 
                      size={16} 
                      color={isActive ? "#000" : "#888"} 
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.chipText, { color: isActive ? "#000" : "#888" }]}>
                      {s.name.toUpperCase()}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Sub-Tabs de Torneos */}
            <Animated.View key={`tourneys-${activeSport}`} entering={FadeInDown.duration(300)}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tournamentFilters}>
                {TOURNAMENTS[activeSport]?.map((tourney) => {
                  const isActive = tourney === activeTournament;
                  return (
                    <Pressable
                      key={tourney}
                      onPress={() => setActiveTournament(tourney)}
                      style={[styles.tourneyChip, isActive && { borderBottomColor: activeColor }]}
                    >
                      <Text style={[styles.tourneyChipText, { color: isActive ? activeColor : 'rgba(255,255,255,0.4)' }]}>
                        {tourney.toUpperCase()}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Animated.View>
          </BlurView>
        </View>

        {/* ── 3. BANNER "SEASON INTEL" PERSONALIZADO ── */}
        <Animated.View key={`banner-${activeTournament}-${activeSport}`} entering={FadeIn.duration(500)} style={styles.bannerContainer}>
          <View style={[styles.bannerCard, { borderColor: `${activeColor}40`, shadowColor: activeColor }]}>
            {/* Imagen real del deporte de fondo en el banner */}
            <Image source={{ uri: sportBgImage }} style={StyleSheet.absoluteFillObject} />
            <LinearGradient colors={['rgba(0,0,0,0.5)', '#050505']} style={StyleSheet.absoluteFillObject} />
            
            <MaterialCommunityIcons name={sport.icon as any} size={180} color={activeColor} style={styles.bannerBgIcon} />

            <View style={styles.bannerContent}>
              <View style={styles.bannerTopRow}>
                <View style={[styles.highlightTag, { backgroundColor: activeColor }]}>
                  <Text style={styles.highlightTagText}>
                    SEASON INTEL
                  </Text>
                </View>
                <Feather name="activity" size={20} color={activeColor} />
              </View>
              
              <View style={{ marginTop: 'auto' }}>
                <Text style={styles.bannerTitle} numberOfLines={2}>{activeTournament}</Text>
                <Text style={[styles.bannerDesc, { color: activeColor }]} numberOfLines={1}>LIGA ACTIVA // {sport.name.toUpperCase()}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ── 4. STANDINGS (TABLA DE TELEMETRÍA) ── */}
        <View style={styles.tableSection}>
          <View style={styles.sectionHeaderWrap}>
            <View style={[styles.verticalAccent, { backgroundColor: activeColor }]} />
            <Text style={styles.sectionTitle}>CLASIFICACIÓN OFICIAL</Text>
          </View>
          
          <View style={[styles.tableCard, { borderColor: `${activeColor}20` }]}>
            {/* Header de la Tabla */}
            <View style={[styles.tableHeader, { backgroundColor: 'rgba(255,255,255,0.02)' }]}>
              <Text style={[styles.th, { width: 35 }]}>#</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'left' }]}>ESCUADRÓN</Text>
              {renderTableHeaders()}
            </View>

            {/* Cuerpo de la Tabla */}
            {teams.length === 0 ? (
              <Animated.View entering={ZoomIn.springify()} style={styles.empty}>
                <View style={styles.radarContainer}>
                  <View style={[styles.radarCircle, { borderColor: `${activeColor}40` }]} />
                  <MaterialCommunityIcons name={sport.icon as any} size={48} color={activeColor} style={{ opacity: 0.8 }} />
                </View>
                <Text style={styles.emptyTitle}>SISTEMA EN ESPERA</Text>
                <Text style={styles.emptyText}>Los registros para {activeTournament} se están procesando.</Text>
              </Animated.View>
            ) : (
              <Animated.View layout={LinearTransition.springify()}>
                {teams.map((team, index) => {
                  const isTop = index < 3; 
                  return (
                    <Animated.View key={team.id} entering={FadeInDown.delay(index * 60).springify()}>
                      <Pressable style={({ pressed }) => [
                        styles.tableRow, 
                        pressed && { backgroundColor: 'rgba(255,255,255,0.05)' },
                        index === teams.length - 1 && { borderBottomWidth: 0 }
                      ]}>
                        
                        {/* Glow para los 3 primeros (Podio) */}
                        {isTop && (
                          <LinearGradient
                            colors={[`${activeColor}15`, 'transparent']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0.8, y: 0 }}
                            style={StyleSheet.absoluteFillObject}
                          />
                        )}

                        {/* Barra Neón Izquierda para el Podio */}
                        {isTop && <View style={[styles.qualifyBar, { backgroundColor: activeColor, shadowColor: activeColor }]} />}
                        
                        {/* Posición */}
                        <Text style={[styles.tdPos, isTop ? { color: activeColor, textShadowColor: activeColor, textShadowRadius: 8 } : { color: 'rgba(255,255,255,0.3)' }]}>
                          0{index + 1}
                        </Text>
                        
                        {/* Escudo y Nombre */}
                        <View style={styles.tdTeam}>
                          <View style={[styles.teamBadgeBadge, { backgroundColor: team.colorHex || '#222', borderColor: isTop ? activeColor : '#333' }]}>
                            <Text style={styles.teamBadgeText}>{team.short?.substring(0, 2) || 'TM'}</Text>
                          </View>
                          <Text style={[styles.tdTeamName, isTop && { color: '#FFF' }]} numberOfLines={1}>{team.name}</Text>
                        </View>

                        {/* Estadísticas */}
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
  container: { flex: 1, backgroundColor: '#050505', position: 'relative' },
  
  // FONDO AMBIENTAL
  ambientImage: { width: '100%', height: height * 0.5, opacity: 0.6 },
  
  // HEADER
  modernHeader: { paddingHorizontal: 24, paddingBottom: 15, zIndex: 2 },
  telemetryText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 2, marginBottom: 5 },
  massiveTitle: { fontFamily: 'Inter_900Black', fontSize: 56, lineHeight: 56, letterSpacing: -2, color: '#FFF' },

  // STICKY HEADER & FILTERS
  stickyHeader: { backgroundColor: 'rgba(5,5,5,0.75)', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  energyLine: { height: 2, width: '100%', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8, elevation: 5 },
  
  filters: { paddingHorizontal: 24, paddingTop: 15, paddingBottom: 10, gap: 10 },
  chip: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' },
  chipGlow: { position: 'absolute', width: '150%', height: '150%', borderRadius: 24, opacity: 0.3, zIndex: -1 },
  chipText: { fontFamily: 'Inter_800ExtraBold', fontSize: 11, letterSpacing: 1 },

  tournamentFilters: { paddingHorizontal: 24, paddingBottom: 12, gap: 24 },
  tourneyChip: { paddingVertical: 6, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tourneyChipText: { fontFamily: 'Inter_800ExtraBold', fontSize: 12, letterSpacing: 1 },

  // BANNER SEASON INTEL
  bannerContainer: { paddingHorizontal: 24, paddingTop: 30, marginBottom: 30 },
  bannerCard: { 
    height: 180, borderRadius: 16, overflow: 'hidden', 
    backgroundColor: '#0A0A0A', borderWidth: 1, position: 'relative',
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 10
  },
  bannerBgIcon: { position: 'absolute', right: -20, bottom: -20, opacity: 0.15, transform: [{ rotate: '-10deg' }] },
  bannerContent: { flex: 1, padding: 20, zIndex: 2 },
  bannerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  highlightTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, transform: [{ skewX: '-10deg' }] },
  highlightTagText: { color: "#000", fontFamily: "Inter_900Black", fontSize: 10, letterSpacing: 1 },
  bannerTitle: { color: '#FFF', fontFamily: 'Inter_900Black', fontSize: 32, lineHeight: 34, letterSpacing: -1, marginBottom: 4 },
  bannerDesc: { fontFamily: "Inter_700Bold", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },

  // STANDINGS TABLE
  tableSection: { paddingHorizontal: 24 },
  sectionHeaderWrap: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  verticalAccent: { width: 4, height: 18, borderRadius: 2, marginRight: 10, transform: [{ skewX: '-10deg' }] },
  sectionTitle: { fontFamily: 'Inter_900Black', fontSize: 15, color: '#FFF', letterSpacing: 1.5 },
  
  tableCard: { backgroundColor: '#0A0A0A', borderRadius: 16, paddingBottom: 4, overflow: 'hidden', borderWidth: 1 },
  tableHeader: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  th: { color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter_800ExtraBold', fontSize: 10, letterSpacing: 1, textAlign: 'center' },
  thHighlight: { fontFamily: 'Inter_900Black', fontSize: 10, letterSpacing: 1, textAlign: 'center' },
  
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.05)', position: 'relative' },
  qualifyBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, shadowOffset: { width: 2, height: 0 }, shadowOpacity: 1, shadowRadius: 6 },
  
  tdPos: { width: 35, fontFamily: 'Inter_900Black', fontSize: 14 },
  tdTeam: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, paddingRight: 10 },
  teamBadgeBadge: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, transform: [{ rotate: '-5deg' }] },
  teamBadgeText: { color: '#FFF', fontFamily: 'Inter_800ExtraBold', fontSize: 11 },
  tdTeamName: { flex: 1, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_700Bold', fontSize: 14, letterSpacing: -0.5 },
  
  tdStat: { width: 25, textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  tdHighlightWrap: { paddingVertical: 6, borderRadius: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  tdPts: { fontFamily: 'Inter_900Black', fontSize: 13 },

  // EMPTY STATE
  empty: { padding: 40, alignItems: "center", justifyContent: "center", marginTop: 20, marginBottom: 20 },
  radarContainer: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative' },
  radarCircle: { position: 'absolute', width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderStyle: 'dashed' },
  emptyTitle: { fontFamily: "Inter_900Black", fontSize: 16, color: '#FFF', letterSpacing: 1.5, marginBottom: 8 },
  emptyText: { fontFamily: "Inter_500Medium", fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: "center", lineHeight: 20 },
});