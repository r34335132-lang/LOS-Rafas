import { Feather, Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeIn, LinearTransition, withRepeat, withTiming, useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { TeamBadge } from "@/components/TeamBadge";
import { MATCHES, TEAMS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get('window');

type TabType = "resumen" | "stats" | "alineacion";

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>("resumen");

  const match = MATCHES.find((m) => m.id === id);
  const homeTeam = TEAMS.find((t) => t.id === match?.homeId);
  const awayTeam = TEAMS.find((t) => t.id === match?.awayId);

  if (!match || !homeTeam || !awayTeam) {
    return (
      <View style={[styles.center, { backgroundColor: '#050505' }]}>
        <Feather name="alert-triangle" size={48} color="#FF3333" style={{ marginBottom: 16 }} />
        <Text style={{ color: '#FFF', fontFamily: 'Inter_900Black', fontSize: 18, letterSpacing: 2 }}>ENLACE PERDIDO</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 20, borderWidth: 1, borderColor: '#FF3333', padding: 10, borderRadius: 4 }}>
          <Text style={{ color: '#FF3333', fontFamily: 'Inter_700Bold' }}>[ ABORTAR ]</Text>
        </Pressable>
      </View>
    );
  }

  // --- RENDERS DINÁMICOS SEGÚN EL DEPORTE ---
  const renderTimeline = () => {
    switch (match.sport) {
      case "soccer":
        return (
          <View style={styles.timelineWrapper}>
            <TimelineItem minute="23'" event="GOLAZO" player="Pablo Ortiz" teamColor={homeTeam.colorHex} icon="aperture" />
            <TimelineItem minute="45'" event="INFRACCIÓN" player="Carlos Méndez" teamColor={homeTeam.colorHex} icon="square" iconColor="#FFD700" />
            <TimelineItem minute="67'" event="GOL" player="Daniel Pérez" teamColor={awayTeam.colorHex} isLast icon="aperture" />
          </View>
        );
      case "basketball":
        return (
          <View style={styles.timelineWrapper}>
            <TimelineItem minute="Q1 08:30" event="TRIPLE" player="Jorge Pineda" teamColor={homeTeam.colorHex} icon="disc" />
            <TimelineItem minute="Q3 02:15" event="FALTA TÉCNICA" player="Andrés Quiroz" teamColor={homeTeam.colorHex} icon="alert-octagon" />
            <TimelineItem minute="Q4 00:12" event="TIRO LIBRE" player="Emilio Núñez" teamColor={awayTeam.colorHex} isLast icon="disc" />
          </View>
        );
      case "flag":
      default:
        return (
          <View style={styles.timelineWrapper}>
            <TimelineItem minute="Q1 12:00" event="INCURSIÓN (TD)" player="Diego Ramírez" teamColor={homeTeam.colorHex} icon="chevrons-up" />
            <TimelineItem minute="Q2 04:12" event="INTERCEPCIÓN" player="Luis Cárdenas" teamColor={homeTeam.colorHex} icon="shield" />
            <TimelineItem minute="Q4 01:30" event="INCURSIÓN (TD)" player="Alex Vidal" teamColor={awayTeam.colorHex} isLast icon="chevrons-up" />
          </View>
        );
    }
  };

  const renderStats = () => {
    switch (match.sport) {
      case "soccer":
        return (
          <View style={{ gap: 24 }}>
            <StatBar label="DOMINIO TERRENO (%)" homeValue={60} awayValue={40} homeColor={homeTeam.colorHex} awayColor={awayTeam.colorHex} />
            <StatBar label="IMPACTOS A OBJETIVO" homeValue={8} awayValue={3} homeColor={homeTeam.colorHex} awayColor={awayTeam.colorHex} />
            <StatBar label="INFRACCIONES" homeValue={12} awayValue={15} homeColor={homeTeam.colorHex} awayColor={awayTeam.colorHex} />
          </View>
        );
      case "basketball":
        return (
          <View style={{ gap: 24 }}>
            <StatBar label="EFECTIVIDAD DE TIRO (%)" homeValue={45} awayValue={42} homeColor={homeTeam.colorHex} awayColor={awayTeam.colorHex} />
            <StatBar label="RECUPERACIONES" homeValue={38} awayValue={32} homeColor={homeTeam.colorHex} awayColor={awayTeam.colorHex} />
            <StatBar label="PÉRDIDAS TÁCTICAS" homeValue={14} awayValue={11} homeColor={homeTeam.colorHex} awayColor={awayTeam.colorHex} />
          </View>
        );
      case "flag":
      default:
        return (
          <View style={{ gap: 24 }}>
            <StatBar label="AVANCE TOTAL (YDS)" homeValue={315} awayValue={280} homeColor={homeTeam.colorHex} awayColor={awayTeam.colorHex} />
            <StatBar label="PRIMEROS INTENTOS" homeValue={18} awayValue={14} homeColor={homeTeam.colorHex} awayColor={awayTeam.colorHex} />
            <StatBar label="SANCIONES" homeValue={4} awayValue={6} homeColor={homeTeam.colorHex} awayColor={awayTeam.colorHex} />
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#050505' }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* 1. HEADER DE CONFRONTACIÓN (VS BATTLE) */}
      <View style={{ height: 360, position: 'relative' }}>
        
        {/* Glow Colisionando (Izquierda vs Derecha) */}
        <Animated.View entering={FadeIn.duration(800)} style={StyleSheet.absoluteFill}>
          <LinearGradient colors={[`${homeTeam.colorHex}40`, 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0.5, y: 1 }} style={StyleSheet.absoluteFillObject} />
          <LinearGradient colors={[`${awayTeam.colorHex}40`, 'transparent']} start={{ x: 1, y: 0 }} end={{ x: 0.5, y: 1 }} style={StyleSheet.absoluteFillObject} />
          <LinearGradient colors={['rgba(0,0,0,0)', '#050505']} locations={[0.5, 1]} style={StyleSheet.absoluteFillObject} />
        </Animated.View>

        <View style={[styles.headerContent, { paddingTop: insets.top + 10 }]}>
          
          {/* NAV BAR */}
          <View style={styles.navBar}>
            <Pressable onPress={() => router.back()} style={styles.iconBtn}>
              <Feather name="chevron-left" size={20} color="#FFF" />
            </Pressable>
            
            <View style={styles.sysTextContainer}>
              <Text style={styles.sysText}>// SYS.MATCH_LINK</Text>
            </View>
            
            <Pressable style={styles.iconBtn}>
              <Feather name="share" size={16} color="#FFF" />
            </Pressable>
          </View>

          {/* ESTATUS DE CONEXIÓN (Sede y Vivo) */}
          <View style={styles.matchStatusRow}>
            <View style={styles.venuePill}>
              <Feather name="map-pin" size={10} color="rgba(255,255,255,0.5)" />
              <Text style={styles.venueText} numberOfLines={1}>SEDE: {match.venue.toUpperCase()}</Text>
            </View>

            {match.status === "live" && (
              <View style={styles.liveTagContainer}>
                <View style={styles.liveTagDot} />
                <Text style={styles.liveTagText}>LINK ACTIVO</Text>
              </View>
            )}
          </View>

          {/* MARCADOR HERO GIGANTE */}
          <View style={styles.scoreboard}>
            {/* Local */}
            <Pressable onPress={() => router.push(`/team/${homeTeam.id}`)} style={styles.teamSide}>
              <View style={[styles.badgeGlow, { shadowColor: homeTeam.colorHex }]}>
                <TeamBadge short={homeTeam.short} color={homeTeam.colorHex} size={84} />
              </View>
              <Text style={styles.teamNameHero} numberOfLines={1}>{homeTeam.name.toUpperCase()}</Text>
            </Pressable>

            {/* Centro / Marcador */}
            <View style={styles.scoreContainer}>
              <View style={styles.scoreRow}>
                <Text style={[styles.scoreText, { color: match.homeScore > match.awayScore ? '#FFF' : 'rgba(255,255,255,0.7)' }]}>
                  {match.homeScore}
                </Text>
                <View style={styles.vsDivider}>
                  <Text style={styles.vsText}>VS</Text>
                </View>
                <Text style={[styles.scoreText, { color: match.awayScore > match.homeScore ? '#FFF' : 'rgba(255,255,255,0.7)' }]}>
                  {match.awayScore}
                </Text>
              </View>
              
              <View style={[styles.timePill, { borderColor: match.status === 'live' ? '#E10600' : 'rgba(255,255,255,0.2)' }]}>
                <Text style={[styles.timeText, { color: match.status === 'live' ? '#FFF' : 'rgba(255,255,255,0.5)' }]}>
                  {match.status === "final" ? "DESCONECTADO (FINAL)" : match.minute || match.startTime}
                </Text>
              </View>
            </View>

            {/* Visitante */}
            <Pressable onPress={() => router.push(`/team/${awayTeam.id}`)} style={styles.teamSide}>
               <View style={[styles.badgeGlow, { shadowColor: awayTeam.colorHex }]}>
                <TeamBadge short={awayTeam.short} color={awayTeam.colorHex} size={84} />
              </View>
              <Text style={styles.teamNameHero} numberOfLines={1}>{awayTeam.name.toUpperCase()}</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* 2. TABS ESTILO CONSOLA (Terminal Brackets) */}
      <View style={styles.tabsWrapper}>
        <View style={styles.tabsContainer}>
          {[
            { id: "resumen", label: "LOG" },
            { id: "stats", label: "TELEMETRÍA" },
            { id: "alineacion", label: "MAPA" }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Pressable 
                key={tab.id} 
                onPress={() => setActiveTab(tab.id as TabType)}
                style={[styles.tabItem, isActive && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
              >
                <Text style={[styles.tabLabel, { color: isActive ? '#FFF' : 'rgba(255,255,255,0.3)' }]}>
                  {isActive ? `[ ${tab.label} ]` : tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        
        {/* TAB 1: RESUMEN (Log de Eventos) */}
        {activeTab === "resumen" && (
          <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.tabContent}>
            <View style={styles.tabHeaderBox}>
              <Text style={styles.tabHeaderTitle}>REGISTRO DE INCIDENCIAS</Text>
            </View>
             {renderTimeline()}
          </Animated.View>
        )}

        {/* TAB 2: STATS (Matriz Comparativa) */}
        {activeTab === "stats" && (
          <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.tabContent}>
            <View style={styles.tabHeaderBox}>
              <Text style={styles.tabHeaderTitle}>MATRIZ COMPARATIVA</Text>
            </View>
            <View style={styles.statsPanel}>
              {renderStats()}
            </View>
          </Animated.View>
        )}

        {/* TAB 3: MAPA TÁCTICO (Holo-Cancha) */}
        {activeTab === "alineacion" && (
          <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.tabContent}>
             <View style={styles.tabHeaderBox}>
              <Text style={styles.tabHeaderTitle}>MAPA TÁCTICO DE SUPERFICIE</Text>
            </View>
            
            <View style={styles.fieldPerspectiveContainer}>
              <View style={styles.field}>
                {/* Cuadrícula holográfica (Grid) */}
                <View style={styles.gridOverlay} />
                
                {/* Líneas del campo (Neón wireframe) */}
                <View style={[styles.fieldCenterLine, { borderColor: colors.primary }]} />
                <View style={[styles.fieldCenterCircle, { borderColor: colors.primary }]} />
                
                {/* Overlay de Sistema Apagado */}
                <View style={styles.offlineOverlay}>
                  <Feather name="radio" size={40} color="rgba(255,255,255,0.2)" style={{ marginBottom: 16 }} />
                  <Text style={styles.offlineText}>SISTEMA RADAR OFFLINE</Text>
                  <Text style={styles.offlineSub}>Esperando datos de posicionamiento del escuadrón.</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

// --- COMPONENTES AUXILIARES ---

function TimelineItem({ minute, event, player, teamColor, isLast = false, icon = "activity", iconColor = "#FFF" }: any) {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineIndicator}>
        <Text style={styles.timelineMin}>{minute}</Text>
        <View style={[styles.timelineDot, { borderColor: teamColor }]}>
           <Feather name={icon as any} size={10} color={teamColor} />
        </View>
        {!isLast && <View style={[styles.timelineLine, { backgroundColor: `${teamColor}40` }]} />}
      </View>
      
      <View style={[styles.timelineCard, { borderLeftColor: teamColor, borderLeftWidth: 3 }]}>
        <View style={styles.timelineEventRow}>
           <Text style={styles.consoleArrow}>{">"}</Text>
           <Text style={[styles.timelineEvent, { color: teamColor }]}>[ {event} ]</Text>
        </View>
        <Text style={styles.timelinePlayer}>OP: {player.toUpperCase()}</Text>
      </View>
    </View>
  );
}

function StatBar({ label, homeValue, awayValue, homeColor, awayColor }: any) {
  const total = homeValue + awayValue;
  const homeWidth = total === 0 ? 50 : (homeValue / total) * 100;

  return (
    <View style={styles.statBarContainer}>
      <View style={styles.statLabelsRow}>
        <Text style={[styles.statNum, { color: homeColor }]}>{homeValue}</Text>
        <Text style={styles.statName}>{label}</Text>
        <Text style={[styles.statNum, { color: awayColor }]}>{awayValue}</Text>
      </View>
      
      {/* Barra Estilo Telemetría */}
      <View style={styles.statTrackBg}>
        <Animated.View style={[styles.statFill, { width: `${homeWidth}%`, backgroundColor: homeColor }]} />
        <View style={styles.statGap} />
        <Animated.View style={[styles.statFill, { flex: 1, backgroundColor: awayColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // HEADER
  headerContent: { flex: 1, paddingHorizontal: 20 },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  iconBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  sysTextContainer: { paddingHorizontal: 12, paddingVertical: 4, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  sysText: { color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: 10, letterSpacing: 2 },
  
  matchStatusRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 24 },
  venuePill: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  venueText: { color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1 },
  
  liveTagContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(225,6,0,0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, gap: 6, borderWidth: 1, borderColor: '#E10600' },
  liveTagDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FF3B30' },
  liveTagText: { color: '#FF3B30', fontFamily: 'monospace', fontSize: 9, letterSpacing: 1 },
  
  // SCOREBOARD HERO (BATTLE)
  scoreboard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  teamSide: { alignItems: 'center', width: '30%', gap: 16 },
  badgeGlow: { shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 25, elevation: 15 },
  teamNameHero: { color: '#FFF', fontFamily: 'Inter_900Black', fontSize: 13, textAlign: 'center', letterSpacing: -0.5 },
  
  scoreContainer: { alignItems: 'center', width: '40%' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  scoreText: { fontFamily: 'Inter_900Black', fontSize: 64, letterSpacing: -4, textShadowColor: 'rgba(255,255,255,0.3)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 10 },
  vsDivider: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginHorizontal: -5, zIndex: 2 },
  vsText: { color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter_900Black', fontSize: 10 },
  
  timePill: { marginTop: 10, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12, borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  timeText: { fontFamily: 'monospace', fontSize: 12, letterSpacing: 1 },

  // TABS CYBER TÁCTICOS
  tabsWrapper: { paddingHorizontal: 20, marginBottom: 20 },
  tabsContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  tabItem: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabLabel: { fontFamily: 'Inter_900Black', fontSize: 11, letterSpacing: 2 },
  
  tabContent: { paddingHorizontal: 20 },
  tabHeaderBox: { marginBottom: 24, borderLeftWidth: 2, borderLeftColor: 'rgba(255,255,255,0.5)', paddingLeft: 10 },
  tabHeaderTitle: { fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 2 },

  // TIMELINE (LOG DE EVENTOS TERMINAL)
  timelineWrapper: { paddingLeft: 5 },
  timelineRow: { flexDirection: 'row', gap: 16, marginBottom: 0 },
  timelineIndicator: { alignItems: 'center', width: 40 },
  timelineMin: { fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', marginBottom: 8 },
  timelineDot: { width: 24, height: 24, borderRadius: 12, zIndex: 2, alignItems: 'center', justifyContent: 'center', borderWidth: 1, backgroundColor: '#0A0A0A' },
  timelineLine: { width: 1, flex: 1, borderStyle: 'dashed', marginTop: -2 },
  
  timelineCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 8, marginBottom: 20 },
  timelineEventRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  consoleArrow: { fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.3)' },
  timelineEvent: { fontFamily: 'Inter_900Black', fontSize: 11, letterSpacing: 2 },
  timelinePlayer: { fontFamily: 'monospace', fontSize: 12, color: '#FFF', marginLeft: 16 },

  // STATS (TELEMETRÍA)
  statsPanel: { backgroundColor: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statBarContainer: { marginBottom: 0 },
  statLabelsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' },
  statNum: { fontFamily: 'Inter_900Black', fontSize: 20 },
  statName: { fontFamily: 'Inter_800ExtraBold', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 2 },
  statTrackBg: { height: 6, flexDirection: 'row', backgroundColor: '#1A1A1A', overflow: 'hidden' },
  statFill: { height: '100%' },
  statGap: { width: 2, backgroundColor: '#050505' },

  // MAPA TÁCTICO 3D (WIRE-FRAME)
  fieldPerspectiveContainer: { transform: [{ perspective: 1000 }, { rotateX: '35deg' }], marginTop: 10, shadowColor: '#FFF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.1, shadowRadius: 30 },
  field: { height: 450, backgroundColor: '#050505', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  gridOverlay: { ...StyleSheet.absoluteFillObject, opacity: 0.1 }, 
  fieldCenterLine: { position: 'absolute', top: '50%', left: 0, right: 0, height: 2, borderStyle: 'dashed', borderWidth: 1 },
  fieldCenterCircle: { position: 'absolute', top: '50%', left: '50%', width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderStyle: 'dashed', marginLeft: -60, marginTop: -60 },
  
  offlineOverlay: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)', padding: 30, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  offlineText: { color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_900Black', fontSize: 16, letterSpacing: 2 },
  offlineSub: { color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontSize: 10, marginTop: 8, textAlign: 'center' },
});
