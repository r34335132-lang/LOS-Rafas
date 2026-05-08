import { Feather, Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { TeamBadge } from "@/components/TeamBadge";
import { LiveBadge } from "@/components/LiveBadge";
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
      <View style={[styles.center, { backgroundColor: '#000' }]}>
        <Feather name="alert-circle" size={48} color={colors.mutedForeground} style={{ marginBottom: 16 }} />
        <Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold' }}>Partido no encontrado</Text>
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
            <TimelineItem minute="45'" event="AMARILLA" player="Carlos Méndez" teamColor={homeTeam.colorHex} icon="square" iconColor="#FFD700" />
            <TimelineItem minute="67'" event="GOL" player="Daniel Pérez" teamColor={awayTeam.colorHex} isLast icon="aperture" />
          </View>
        );
      case "basketball":
        return (
          <View style={styles.timelineWrapper}>
            <TimelineItem minute="Q1 08:30" event="TRIPLE" player="Jorge Pineda" teamColor={homeTeam.colorHex} icon="disc" />
            <TimelineItem minute="Q3 02:15" event="TÉCNICA" player="Andrés Quiroz" teamColor={homeTeam.colorHex} icon="alert-octagon" />
            <TimelineItem minute="Q4 00:12" event="TIRO LIBRE" player="Emilio Núñez" teamColor={awayTeam.colorHex} isLast icon="disc" />
          </View>
        );
      case "flag":
      default:
        return (
          <View style={styles.timelineWrapper}>
            <TimelineItem minute="Q1 12:00" event="TOUCHDOWN" player="Diego Ramírez" teamColor={homeTeam.colorHex} icon="chevrons-up" />
            <TimelineItem minute="Q2 04:12" event="INTERCEPCIÓN" player="Luis Cárdenas" teamColor={homeTeam.colorHex} icon="shield" />
            <TimelineItem minute="Q4 01:30" event="TOUCHDOWN" player="Alex Vidal" teamColor={awayTeam.colorHex} isLast icon="chevrons-up" />
          </View>
        );
    }
  };

  const renderStats = () => {
    switch (match.sport) {
      case "soccer":
        return (
          <View style={{ gap: 24 }}>
            <StatBar label="POSESIÓN %" homeValue={60} awayValue={40} homeColor={homeTeam.colorHex} awayColor={awayTeam.colorHex} />
            <StatBar label="TIROS AL ARCO" homeValue={8} awayValue={3} homeColor={homeTeam.colorHex} awayColor={awayTeam.colorHex} />
            <StatBar label="FALTAS" homeValue={12} awayValue={15} homeColor={homeTeam.colorHex} awayColor={awayTeam.colorHex} />
          </View>
        );
      case "basketball":
        return (
          <View style={{ gap: 24 }}>
            <StatBar label="TIROS DE CAMPO %" homeValue={45} awayValue={42} homeColor={homeTeam.colorHex} awayColor={awayTeam.colorHex} />
            <StatBar label="REBOTES" homeValue={38} awayValue={32} homeColor={homeTeam.colorHex} awayColor={awayTeam.colorHex} />
            <StatBar label="PÉRDIDAS" homeValue={14} awayValue={11} homeColor={homeTeam.colorHex} awayColor={awayTeam.colorHex} />
          </View>
        );
      case "flag":
      default:
        return (
          <View style={{ gap: 24 }}>
            <StatBar label="YARDAS TOTALES" homeValue={315} awayValue={280} homeColor={homeTeam.colorHex} awayColor={awayTeam.colorHex} />
            <StatBar label="1ER Y DIEZ" homeValue={18} awayValue={14} homeColor={homeTeam.colorHex} awayColor={awayTeam.colorHex} />
            <StatBar label="CASTIGOS" homeValue={4} awayValue={6} homeColor={homeTeam.colorHex} awayColor={awayTeam.colorHex} />
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#000000' }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* 1. HEADER ULTRA PREMIUM (DIAGONAL SPLIT) */}
      <View style={{ height: 340 }}>
        
        {/* Fondo Diagonal Animado */}
        <Animated.View entering={FadeIn.duration(800)} style={StyleSheet.absoluteFill}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={[styles.diagonalBg, { backgroundColor: homeTeam.colorHex, right: width / 2 - 40 }]} />
            <View style={[styles.diagonalBg, { backgroundColor: awayTeam.colorHex, left: width / 2 - 40 }]} />
          </View>
          {/* El gradiente oscuro encima le da el toque cinematográfico */}
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', '#000000']}
            locations={[0, 1]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <View style={[styles.headerContent, { paddingTop: insets.top + 10 }]}>
          
          {/* NAV BAR */}
          <View style={styles.navBar}>
            <Pressable onPress={() => router.back()} style={styles.iconBtn}>
              <Feather name="chevron-left" size={24} color="#FFF" />
            </Pressable>
            
            <View style={styles.venuePill}>
              <Ionicons name="location" size={12} color="#FFF" />
              <Text style={styles.venueText} numberOfLines={1}>{match.venue.toUpperCase()}</Text>
            </View>
            
            <Pressable style={styles.iconBtn}>
              <Feather name="share" size={20} color="#FFF" />
            </Pressable>
          </View>

          {/* MARCADOR HERO */}
          <View style={styles.scoreboard}>
            {/* Local */}
            <Pressable 
              onPress={() => router.push(`/team/${homeTeam.id}`)}
              style={({ pressed }) => [styles.teamSide, { transform: [{ scale: pressed ? 0.95 : 1 }] }]}
            >
              <View style={[styles.badgeGlow, { shadowColor: homeTeam.colorHex }]}>
                <TeamBadge short={homeTeam.short} color="#FFF" size={80} />
              </View>
              <Text style={styles.teamNameHero}>{homeTeam.name.toUpperCase()}</Text>
            </Pressable>

            {/* Centro / Marcador */}
            <View style={styles.scoreContainer}>
              {match.status === "live" && (
                <View style={styles.liveTagContainer}>
                  <View style={styles.liveTagDot} />
                  <Text style={styles.liveTagText}>VIVO</Text>
                </View>
              )}
              
              <View style={styles.scoreRow}>
                <Text style={styles.scoreText}>{match.homeScore}</Text>
                <Text style={styles.scoreDivider}>:</Text>
                <Text style={styles.scoreText}>{match.awayScore}</Text>
              </View>
              
              {match.status === "final" ? (
                <Text style={styles.finalText}>FINALIZADO</Text>
              ) : (
                <Text style={styles.timeText}>{match.minute || match.startTime}</Text>
              )}
            </View>

            {/* Visitante */}
            <Pressable 
              onPress={() => router.push(`/team/${awayTeam.id}`)}
              style={({ pressed }) => [styles.teamSide, { transform: [{ scale: pressed ? 0.95 : 1 }] }]}
            >
               <View style={[styles.badgeGlow, { shadowColor: awayTeam.colorHex }]}>
                <TeamBadge short={awayTeam.short} color="#FFF" size={80} />
              </View>
              <Text style={styles.teamNameHero}>{awayTeam.name.toUpperCase()}</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* 2. TABS ESTILO iOS (Segmented Control) */}
      <View style={styles.tabsWrapper}>
        <View style={styles.tabsContainer}>
          {(["resumen", "stats", "alineacion"] as TabType[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <Pressable 
                key={tab} 
                onPress={() => setActiveTab(tab)}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
              >
                <Text style={[styles.tabLabel, { color: isActive ? '#000' : 'rgba(255,255,255,0.5)' }]}>
                  {tab.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        
        {/* TAB 1: RESUMEN (Línea de tiempo) */}
        {activeTab === "resumen" && (
          <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.tabContent}>
             {renderTimeline()}
          </Animated.View>
        )}

        {/* TAB 2: STATS */}
        {activeTab === "stats" && (
          <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.tabContent}>
            {renderStats()}
          </Animated.View>
        )}

        {/* TAB 3: ALINEACIÓN / CAMPO TÁCTICO 3D */}
        {activeTab === "alineacion" && (
          <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.tabContent}>
            <View style={styles.fieldPerspectiveContainer}>
              <View style={[
                styles.field, 
                { backgroundColor: match.sport === 'basketball' ? '#C27A4D' : '#1A3C16' }
              ]}>
                {/* Líneas del campo para darle realismo */}
                <View style={styles.fieldCenterLine} />
                <View style={styles.fieldCenterCircle} />
                
                <View style={styles.comingSoonOverlay}>
                  <Ionicons name="body-outline" size={32} color="#FFF" style={{ marginBottom: 10 }} />
                  <Text style={styles.comingSoonText}>ZONA TÁCTICA</Text>
                  <Text style={styles.comingSoonSub}>Alineaciones en desarrollo</Text>
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
        <View style={[styles.timelineDot, { backgroundColor: teamColor }]}>
           <Feather name={icon as any} size={8} color={teamColor === '#FFF' ? '#000' : '#FFF'} />
        </View>
        {!isLast && <View style={styles.timelineLine} />}
      </View>
      
      <View style={styles.timelineCard}>
        <View style={styles.timelineEventRow}>
           <Feather name={icon as any} size={14} color={iconColor === '#FFF' ? teamColor : iconColor} />
           <Text style={[styles.timelineEvent, { color: teamColor }]}>{event}</Text>
        </View>
        <Text style={styles.timelinePlayer}>{player}</Text>
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
        <Text style={styles.statNum}>{homeValue}</Text>
        <Text style={styles.statName}>{label}</Text>
        <Text style={styles.statNum}>{awayValue}</Text>
      </View>
      
      {/* Barra Track Background */}
      <View style={styles.statTrackBg}>
        {/* Local Bar */}
        <Animated.View style={[styles.statFill, { width: `${homeWidth}%`, backgroundColor: homeColor, borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }]} />
        {/* Separador negro en medio */}
        <View style={{ width: 4, backgroundColor: '#000' }} />
        {/* Visitante Bar */}
        <Animated.View style={[styles.statFill, { flex: 1, backgroundColor: awayColor, borderTopRightRadius: 6, borderBottomRightRadius: 6 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // HEADER DIAGONAL MAGIC
  diagonalBg: { position: 'absolute', top: -100, bottom: -100, width: width * 1.5, transform: [{ skewX: '-20deg' }] },
  headerContent: { flex: 1, paddingHorizontal: 20 },
  
  // NAVBAR
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  venuePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, gap: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  venueText: { color: '#FFF', fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1 },
  
  // SCOREBOARD HERO
  scoreboard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  teamSide: { alignItems: 'center', width: '32%', gap: 12 },
  badgeGlow: { shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 20, elevation: 10 },
  teamNameHero: { color: '#FFF', fontFamily: 'Inter_900Black', fontSize: 12, textAlign: 'center', letterSpacing: 0.5 },
  
  scoreContainer: { alignItems: 'center', width: '36%' },
  liveTagContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,59,48,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 6, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,59,48,0.5)' },
  liveTagDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF3B30' },
  liveTagText: { color: '#FF3B30', fontFamily: 'Inter_800ExtraBold', fontSize: 9, letterSpacing: 1 },
  
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  scoreText: { color: '#FFF', fontFamily: 'Inter_900Black', fontSize: 56, letterSpacing: -2 },
  scoreDivider: { color: 'rgba(255,255,255,0.3)', fontFamily: 'Inter_400Regular', fontSize: 40, marginTop: -6 },
  
  finalText: { color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter_800ExtraBold', fontSize: 11, letterSpacing: 2, marginTop: 4 },
  timeText: { color: '#FFF', fontFamily: 'Inter_700Bold', fontSize: 14, marginTop: 8 },

  // TABS SEGMENTADOS MODERNOS
  tabsWrapper: { paddingHorizontal: 20, marginTop: -10, marginBottom: 10, zIndex: 10 },
  tabsContainer: { flexDirection: 'row', backgroundColor: '#111', borderRadius: 12, padding: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  tabItem: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  tabItemActive: { backgroundColor: '#FFF', shadowColor: '#FFF', shadowOpacity: 0.2, shadowRadius: 10 },
  tabLabel: { fontFamily: 'Inter_800ExtraBold', fontSize: 11, letterSpacing: 1 },
  
  tabContent: { paddingHorizontal: 20, paddingTop: 20 },

  // TIMELINE ESTILO "TWEET / FEED"
  timelineWrapper: { paddingLeft: 10 },
  timelineRow: { flexDirection: 'row', gap: 20, marginBottom: 0 },
  timelineIndicator: { alignItems: 'center', width: 30 },
  timelineMin: { fontSize: 11, fontFamily: 'Inter_800ExtraBold', color: 'rgba(255,255,255,0.5)', marginBottom: 8 },
  timelineDot: { width: 20, height: 20, borderRadius: 10, zIndex: 2, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#000' },
  timelineLine: { width: 2, flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginTop: -2 },
  timelineCard: { flex: 1, backgroundColor: '#111', padding: 16, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  timelineEventRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  timelineEvent: { fontFamily: 'Inter_900Black', fontSize: 12, letterSpacing: 1 },
  timelinePlayer: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },

  // STATS BARS
  statBarContainer: { marginBottom: 0 },
  statLabelsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' },
  statNum: { fontFamily: 'Inter_900Black', fontSize: 20, color: '#FFF' },
  statName: { fontFamily: 'Inter_800ExtraBold', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5 },
  statTrackBg: { height: 12, borderRadius: 6, flexDirection: 'row', backgroundColor: '#222', overflow: 'hidden' },
  statFill: { height: '100%' },

  // CANCHA TÁCTICA 3D (ISOMÉTRICA)
  fieldPerspectiveContainer: { transform: [{ perspective: 800 }, { rotateX: '20deg' }], marginTop: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.5, shadowRadius: 20 },
  field: { height: 400, borderRadius: 16, borderWidth: 3, borderColor: 'rgba(255,255,255,0.6)', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  fieldCenterLine: { position: 'absolute', top: '50%', left: 0, right: 0, height: 3, backgroundColor: 'rgba(255,255,255,0.6)' },
  fieldCenterCircle: { position: 'absolute', top: '50%', left: '50%', width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: 'rgba(255,255,255,0.6)', marginLeft: -50, marginTop: -50 },
  comingSoonOverlay: { backgroundColor: 'rgba(0,0,0,0.7)', padding: 24, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  comingSoonText: { color: '#FFF', fontFamily: 'Inter_900Black', fontSize: 16, letterSpacing: 2 },
  comingSoonSub: { color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter_500Medium', fontSize: 12, marginTop: 4 },
});