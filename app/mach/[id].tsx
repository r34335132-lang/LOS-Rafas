import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

import { TeamBadge } from "@/components/TeamBadge";
import { LiveBadge } from "@/components/LiveBadge";
import { MATCHES, TEAMS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

type TabType = "resumen" | "stats" | "alineacion";

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<TabType>("resumen");

  const match = MATCHES.find((m) => m.id === id);
  const homeTeam = TEAMS.find((t) => t.id === match?.homeId);
  const awayTeam = TEAMS.find((t) => t.id === match?.awayId);

  if (!match || !homeTeam || !awayTeam) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground }}>Partido no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* 1. HEADER DINÁMICO (SPLIT COLORS) */}
      <View style={{ height: 320 }}>
        {/* Fondo dividido */}
        <View style={StyleSheet.absoluteFill}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, backgroundColor: homeTeam.colorHex }} />
            <View style={{ flex: 1, backgroundColor: awayTeam.colorHex }} />
          </View>
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', colors.background]}
            style={StyleSheet.absoluteFill}
          />
        </View>

        <View style={[styles.headerContent, { paddingTop: insets.top + 10 }]}>
          <View style={styles.navBar}>
            <Pressable onPress={() => router.back()} style={styles.iconBtn}>
              <Feather name="chevron-left" size={26} color="#FFF" />
            </Pressable>
            <Text style={styles.venueText} numberOfLines={1}>{match.venue}</Text>
            <Pressable style={styles.iconBtn}>
              <Feather name="share-2" size={20} color="#FFF" />
            </Pressable>
          </View>

          {/* MARCADOR PRINCIPAL */}
          <View style={styles.scoreboard}>
            <View style={styles.teamSide}>
              <TeamBadge short={homeTeam.short} color="#FFF" size={70} />
              <Text style={styles.teamNameHero}>{homeTeam.name}</Text>
            </View>

            <View style={styles.scoreContainer}>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreText}>{match.homeScore}</Text>
                <Text style={styles.scoreDivider}>-</Text>
                <Text style={styles.scoreText}>{match.awayScore}</Text>
              </View>
              {match.status === "live" ? (
                <LiveBadge />
              ) : (
                <View style={styles.finalBadge}>
                  <Text style={styles.finalText}>{match.status === "final" ? "FINAL" : match.startTime}</Text>
                </View>
              )}
              {match.minute && <Text style={styles.timeText}>{match.minute}</Text>}
            </View>

            <View style={styles.teamSide}>
              <TeamBadge short={awayTeam.short} color="#FFF" size={70} />
              <Text style={styles.teamNameHero}>{awayTeam.name}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 2. SELECTOR DE PESTAÑAS (TABS) */}
      <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
        {(["resumen", "stats", "alineacion"] as TabType[]).map((tab) => (
          <Pressable 
            key={tab} 
            onPress={() => setActiveTab(tab)}
            style={[styles.tabItem, activeTab === tab && { borderBottomColor: colors.primary }]}
          >
            <Text style={[
              styles.tabLabel, 
              { color: activeTab === tab ? colors.foreground : colors.mutedForeground }
            ]}>
              {tab.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {activeTab === "resumen" && (
          <Animated.View entering={FadeInDown} style={styles.tabContent}>
            {/* LÍNEA DE TIEMPO (Simulada) */}
            <SectionHeader title="Eventos del partido" accent={colors.primary} />
            <TimelineItem minute="12'" event="Touchdown Pumas" player="Diego Ramírez" teamColor={homeTeam.colorHex} />
            <TimelineItem minute="44'" event="Intercepción" player="Luis Cárdenas" teamColor={homeTeam.colorHex} isLast />
          </Animated.View>
        )}

        {activeTab === "stats" && (
          <Animated.View entering={FadeInDown} style={styles.tabContent}>
            <SectionHeader title="Estadísticas de equipo" accent={colors.primary} />
            <StatBar label="Posesión" homeValue={65} awayValue={35} homeColor={homeTeam.colorHex} awayColor={awayTeam.colorHex} />
            <StatBar label="Ataques" homeValue={12} awayValue={8} homeColor={homeTeam.colorHex} awayColor={awayTeam.colorHex} />
            <StatBar label="Faltas" homeValue={3} awayValue={5} homeColor={homeTeam.colorHex} awayColor={awayTeam.colorHex} />
          </Animated.View>
        )}

        {activeTab === "alineacion" && (
          <Animated.View entering={FadeInDown} style={styles.tabContent}>
            <View style={[styles.fieldContainer, { backgroundColor: '#2D5A27', borderColor: '#FFF' }]}>
               {/* Simulación de formación */}
               <View style={styles.fieldLine} />
               <View style={styles.fieldCircle} />
               {/* Jugadores destacados */}
               <Text style={{color: '#FFF', textAlign: 'center', marginTop: 100, fontFamily: 'Inter_700Bold'}}>VISTA DE CAMPO PRÓXIMAMENTE</Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

// COMPONENTES AUXILIARES
function TimelineItem({ minute, event, player, teamColor, isLast = false }: any) {
  const colors = useColors();
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineIndicator}>
        <Text style={[styles.timelineMin, { color: colors.mutedForeground }]}>{minute}</Text>
        <View style={[styles.timelineDot, { backgroundColor: teamColor }]} />
        {!isLast && <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />}
      </View>
      <View style={[styles.timelineCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.timelineEvent, { color: colors.foreground }]}>{event}</Text>
        <Text style={[styles.timelinePlayer, { color: colors.mutedForeground }]}>{player}</Text>
      </View>
    </View>
  );
}

function StatBar({ label, homeValue, awayValue, homeColor, awayColor }: any) {
  const colors = useColors();
  const total = homeValue + awayValue;
  const homeWidth = (homeValue / total) * 100;

  return (
    <View style={styles.statBarContainer}>
      <View style={styles.statLabelsRow}>
        <Text style={[styles.statNum, { color: colors.foreground }]}>{homeValue}</Text>
        <Text style={[styles.statName, { color: colors.mutedForeground }]}>{label.toUpperCase()}</Text>
        <Text style={[styles.statNum, { color: colors.foreground }]}>{awayValue}</Text>
      </View>
      <View style={[styles.statTrack, { backgroundColor: colors.border }]}>
        <View style={{ width: `${homeWidth}%`, height: '100%', backgroundColor: homeColor, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }} />
        <View style={{ flex: 1, height: '100%', backgroundColor: awayColor, borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />
      </View>
    </View>
  );
}

function SectionHeader({ title, accent }: any) {
  const colors = useColors();
  return (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionIndicator, { backgroundColor: accent }]} />
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContent: { flex: 1, paddingHorizontal: 20 },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  venueText: { color: '#FFF', fontFamily: 'Inter_600SemiBold', fontSize: 12, flex: 1, textAlign: 'center', marginHorizontal: 10 },
  scoreboard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  teamSide: { alignItems: 'center', width: '30%', gap: 8 },
  teamNameHero: { color: '#FFF', fontFamily: 'Inter_700Bold', fontSize: 14, textAlign: 'center' },
  scoreContainer: { alignItems: 'center', width: '35%' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  scoreText: { color: '#FFF', fontFamily: 'Inter_700Bold', fontSize: 48 },
  scoreDivider: { color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter_400Regular', fontSize: 32 },
  finalBadge: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 6, marginTop: 4 },
  finalText: { color: '#FFF', fontFamily: 'Inter_700Bold', fontSize: 10 },
  timeText: { color: '#FFF', fontFamily: 'Inter_600SemiBold', fontSize: 12, marginTop: 8 },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 20, borderBottomWidth: StyleSheet.hairlineWidth },
  tabItem: { paddingVertical: 16, marginRight: 24, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabLabel: { fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 0.5 },
  tabContent: { paddingHorizontal: 20, paddingTop: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  sectionIndicator: { width: 4, height: 20, borderRadius: 2 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  timelineRow: { flexDirection: 'row', gap: 16, marginBottom: 4 },
  timelineIndicator: { alignItems: 'center', width: 40 },
  timelineMin: { fontSize: 12, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, zIndex: 2 },
  timelineLine: { width: 2, flex: 1, marginTop: -2 },
  timelineCard: { flex: 1, padding: 12, borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, marginBottom: 20 },
  timelineEvent: { fontFamily: 'Inter_700Bold', fontSize: 14, marginBottom: 2 },
  timelinePlayer: { fontFamily: 'Inter_500Medium', fontSize: 12 },
  statBarContainer: { marginBottom: 24 },
  statLabelsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  statNum: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  statName: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  statTrack: { height: 8, borderRadius: 4, flexDirection: 'row', overflow: 'hidden' },
  fieldContainer: { height: 300, borderRadius: 20, borderWidth: 2, padding: 10, overflow: 'hidden' },
  fieldLine: { position: 'absolute', top: '50%', left: 0, right: 0, height: 2, backgroundColor: 'rgba(255,255,255,0.5)' },
  fieldCircle: { position: 'absolute', top: '50%', left: '50%', width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', marginLeft: -40, marginTop: -40 },
});