import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInDown, LinearTransition } from "react-native-reanimated";

import { TeamBadge } from "@/components/TeamBadge";
import { TEAMS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const team = TEAMS.find((t) => t.id === id);

  if (!team) {
    return (
      <View style={[styles.center, { backgroundColor: '#050505' }]}>
        <Feather name="alert-triangle" size={48} color="#FF3333" style={{ marginBottom: 16 }} />
        <Text style={styles.errorText}>OBJETIVO NO ENCONTRADO</Text>
        <Pressable onPress={() => router.back()} style={styles.abortBtn}>
          <Text style={styles.abortText}>[ ABORTAR BÚSQUEDA ]</Text>
        </Pressable>
      </View>
    );
  }

  // Cálculos rápidos
  const points = team.wins * 3 + team.ties;
  const matchesPlayed = team.wins + team.losses + team.ties;
  const winRate = matchesPlayed > 0 ? ((team.wins / matchesPlayed) * 100).toFixed(0) : 0;

  return (
    <View style={[styles.container, { backgroundColor: '#050505' }]}>
      
      {/* AMBIENT GLOW DEL EQUIPO */}
      <Animated.View style={styles.ambientGlow} entering={FadeIn.duration(800)}>
        <LinearGradient
          colors={[`${team.colorHex}30`, 'transparent']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{ paddingBottom: 60 }}>
        
        {/* 1. CABECERA TÁCTICA (SQUADRON INTEL) */}
        <View style={[styles.headerSection, { paddingTop: insets.top + 10 }]}>
          
          <View style={styles.headerNav}>
            <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
              <Feather name="chevron-left" size={16} color="#FFF" />
              <Text style={styles.backText}>[ VOLVER ]</Text>
            </Pressable>
            <Text style={styles.sysText}>// SYS.SQUAD_INTEL</Text>
          </View>

          <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.heroWrap}>
            {/* Marca de agua gigante atrás del logo */}
            <Text style={[styles.bgWatermark, { color: `${team.colorHex}15` }]}>{team.short}</Text>
            
            <View style={styles.heroBadgeWrapper}>
              {/* Anillos de "Target" alrededor del badge */}
              <View style={[styles.targetRing, { borderColor: `${team.colorHex}30` }]} />
              <View style={[styles.targetRingInner, { borderColor: `${team.colorHex}50` }]} />
              <TeamBadge short={team.short} color={team.colorHex} size={110} />
            </View>

            <View style={styles.heroInfo}>
              <View style={[styles.foundedTag, { backgroundColor: `${team.colorHex}20`, borderColor: team.colorHex }]}>
                <Text style={[styles.foundedTagText, { color: team.colorHex }]}>EST. {team.founded}</Text>
              </View>
              <Text style={styles.teamName}>{team.name.toUpperCase()}</Text>
              <Text style={styles.teamCity}>BASE DE OPERACIONES: {team.city.toUpperCase()}</Text>
            </View>
          </Animated.View>
        </View>

        {/* 2. MATRIZ DE TELEMETRÍA (ESTADÍSTICAS) */}
        <Animated.View entering={FadeInDown.duration(600).delay(150).springify()} style={styles.telemetrySection}>
          <Text style={styles.sectionTitle}>[ MATRIZ DE RENDIMIENTO ]</Text>
          
          <View style={styles.telemetryGrid}>
            <View style={[styles.telemetryBox, { borderColor: 'rgba(255,255,255,0.1)' }]}>
              <Text style={styles.telemetryValue}>{matchesPlayed}</Text>
              <Text style={styles.telemetryLabel}>DESPLIEGUES</Text>
            </View>
            <View style={[styles.telemetryBox, { borderColor: 'rgba(0,200,83,0.3)' }]}>
              <Text style={[styles.telemetryValue, { color: '#00C853' }]}>{team.wins}</Text>
              <Text style={styles.telemetryLabel}>VICTORIAS</Text>
            </View>
            <View style={[styles.telemetryBox, { borderColor: 'rgba(255,51,51,0.3)' }]}>
              <Text style={[styles.telemetryValue, { color: '#FF3333' }]}>{team.losses}</Text>
              <Text style={styles.telemetryLabel}>BAJAS</Text>
            </View>
            <View style={[styles.telemetryBox, { backgroundColor: `${team.colorHex}15`, borderColor: team.colorHex }]}>
              <Text style={[styles.telemetryValue, { color: team.colorHex }]}>{points}</Text>
              <Text style={[styles.telemetryLabel, { color: team.colorHex }]}>PTS TOTALES</Text>
            </View>
          </View>
          
          {/* Barra de Win Rate */}
          <View style={styles.winRateContainer}>
            <View style={styles.winRateHeader}>
              <Text style={styles.winRateLabel}>EFECTIVIDAD DE COMBATE</Text>
              <Text style={[styles.winRateValue, { color: team.colorHex }]}>{winRate}%</Text>
            </View>
            <View style={styles.winRateBarBg}>
              <Animated.View style={[styles.winRateBarFill, { width: `${winRate}%`, backgroundColor: team.colorHex }]} />
            </View>
          </View>
        </Animated.View>

        {/* 3. ROSTER / OPERADORES ACTIVOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>[ OPERADORES ACTIVOS : {team.players.length} ]</Text>
          
          <View style={styles.playersGrid}>
            {team.players.map((player, index) => (
              <Animated.View 
                key={player.id} 
                entering={FadeInDown.delay(300 + (index * 50)).springify()} 
                style={[styles.playerCard, { borderColor: `${team.colorHex}40` }]}
              >
                {/* Marca de agua del número de jugador */}
                <Text style={styles.playerNumberBg}>{player.number}</Text>
                
                <View style={styles.playerImageWrap}>
                  <Image
                    source={{ uri: player.image || "https://i.pravatar.cc/150?u=placeholder" }}
                    style={styles.playerImage}
                    contentFit="cover"
                    transition={200}
                  />
                  {/* Overlay táctico en la foto */}
                  <View style={[styles.playerImageOverlay, { borderColor: team.colorHex }]} />
                </View>

                <View style={styles.playerInfo}>
                  <Text style={styles.playerName} numberOfLines={1}>{player.name.toUpperCase()}</Text>
                  <View style={styles.playerTags}>
                    <Text style={[styles.playerRole, { color: team.colorHex }]}>ROL: {player.position}</Text>
                    <Text style={styles.playerNumber}>NO. {player.number}</Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* 4. REGISTRO DE CONFRONTACIONES (ÚLTIMOS RESULTADOS) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>[ HISTORIAL DE CONFRONTACIONES ]</Text>
          
          <View style={styles.combatLog}>
            {team.recent.map((match, i) => {
              const isWin = match.result === "W";
              const isLoss = match.result === "L";
              const resultColor = isWin ? '#00C853' : isLoss ? '#FF3333' : '#FF9800';
              const resultLabel = isWin ? "VICTORIA" : isLoss ? "DERROTA" : "EMPATE";

              return (
                <Animated.View key={i} entering={FadeInDown.delay(500 + (i * 100)).springify()} style={styles.logRow}>
                  {/* Timeline Node */}
                  <View style={styles.timelineNodeContainer}>
                    <View style={[styles.timelineNode, { backgroundColor: resultColor, shadowColor: resultColor }]} />
                    {i !== team.recent.length - 1 && <View style={styles.timelineLine} />}
                  </View>

                  <View style={styles.logContent}>
                    <View style={styles.logHeader}>
                      <Text style={[styles.logResultText, { color: resultColor }]}>{resultLabel}</Text>
                      <Text style={styles.logScore}>{match.score}</Text>
                    </View>
                    <Text style={styles.logOpponent}>ENFRENTAMIENTO VS {match.opponent.toUpperCase()}</Text>
                  </View>
                </Animated.View>
              );
            })}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  errorText: { fontFamily: 'Inter_900Black', fontSize: 18, color: '#FFF', letterSpacing: 2, marginBottom: 20 },
  
  container: { flex: 1, position: 'relative' },
  ambientGlow: { position: 'absolute', top: 0, width: '100%', height: 400, zIndex: 0 },

  // HEADER SECTION
  headerSection: { paddingHorizontal: 20, zIndex: 2 },
  headerNav: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
  backBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  backText: { fontFamily: 'Inter_800ExtraBold', fontSize: 10, color: '#FFF', letterSpacing: 1, marginLeft: 4 },
  sysText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 2 },
  abortBtn: { paddingVertical: 8, paddingHorizontal: 16, borderWidth: 1, borderColor: '#FF3333', borderRadius: 4 },
  abortText: { fontFamily: 'Inter_800ExtraBold', fontSize: 12, color: '#FF3333', letterSpacing: 1 },

  heroWrap: { alignItems: 'center', position: 'relative', paddingBottom: 20 },
  bgWatermark: { position: 'absolute', top: -20, fontFamily: 'Inter_900Black', fontSize: 140, letterSpacing: -5, zIndex: 0 },
  
  heroBadgeWrapper: { position: 'relative', width: 160, height: 160, alignItems: 'center', justifyContent: 'center', marginBottom: 16, zIndex: 2 },
  targetRing: { position: 'absolute', width: 150, height: 150, borderRadius: 75, borderWidth: 1, borderStyle: 'dashed', opacity: 0.5 },
  targetRingInner: { position: 'absolute', width: 130, height: 130, borderRadius: 65, borderWidth: 1, opacity: 0.3 },

  heroInfo: { alignItems: 'center', zIndex: 2 },
  foundedTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, borderWidth: 1, marginBottom: 12 },
  foundedTagText: { fontFamily: 'Inter_900Black', fontSize: 10, letterSpacing: 2 },
  teamName: { fontFamily: "Inter_900Black", fontSize: 36, color: "#FFF", textAlign: "center", letterSpacing: -1, lineHeight: 38 },
  teamCity: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: 2, marginTop: 8 },

  // SECCIONES
  section: { paddingHorizontal: 20, marginTop: 40 },
  sectionTitle: { fontFamily: 'Inter_800ExtraBold', fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, marginBottom: 16 },

  // TELEMETRÍA (STATS)
  telemetrySection: { paddingHorizontal: 20, marginTop: 20 },
  telemetryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  telemetryBox: { flex: 1, minWidth: '45%', backgroundColor: '#0A0A0A', padding: 16, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  telemetryValue: { fontFamily: 'Inter_900Black', fontSize: 28, color: '#FFF', letterSpacing: -1 },
  telemetryLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginTop: 4 },
  
  winRateContainer: { marginTop: 16, backgroundColor: '#0A0A0A', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  winRateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 },
  winRateLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 },
  winRateValue: { fontFamily: 'Inter_900Black', fontSize: 18 },
  winRateBarBg: { width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  winRateBarFill: { height: '100%', borderRadius: 3 },

  // OPERADORES (ROSTER)
  playersGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "space-between" },
  playerCard: { 
    width: "48%", flexDirection: "column", 
    backgroundColor: '#0A0A0A', borderRadius: 12, borderWidth: 1, 
    padding: 12, position: 'relative', overflow: 'hidden'
  },
  playerNumberBg: { position: 'absolute', right: -10, bottom: -20, fontFamily: 'Inter_900Black', fontSize: 72, color: 'rgba(255,255,255,0.03)', zIndex: 0 },
  playerImageWrap: { position: 'relative', width: 48, height: 48, marginBottom: 12, zIndex: 2 },
  playerImage: { width: '100%', height: '100%', borderRadius: 8, backgroundColor: "rgba(255,255,255,0.1)" },
  playerImageOverlay: { ...StyleSheet.absoluteFillObject, borderWidth: 1, borderRadius: 8, opacity: 0.5 },
  playerInfo: { zIndex: 2 },
  playerName: { fontFamily: "Inter_800ExtraBold", fontSize: 13, color: '#FFF', marginBottom: 6, letterSpacing: -0.5 },
  playerTags: { flexDirection: "column", gap: 2 },
  playerRole: { fontFamily: "Inter_700Bold", fontSize: 9, letterSpacing: 1 },
  playerNumber: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: 'rgba(255,255,255,0.4)' },

  // COMBAT LOG (RECENT RESULTS)
  combatLog: { backgroundColor: '#0A0A0A', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  logRow: { flexDirection: 'row', position: 'relative', marginBottom: 24 },
  timelineNodeContainer: { width: 20, alignItems: 'center', marginRight: 15 },
  timelineNode: { width: 10, height: 10, borderRadius: 5, shadowOffset: { width:0, height:0 }, shadowOpacity: 0.8, shadowRadius: 5, zIndex: 2, marginTop: 4 },
  timelineLine: { position: 'absolute', top: 14, bottom: -30, width: 2, backgroundColor: 'rgba(255,255,255,0.1)', zIndex: 1 },
  
  logContent: { flex: 1 },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  logResultText: { fontFamily: 'Inter_900Black', fontSize: 12, letterSpacing: 1 },
  logScore: { fontFamily: 'Inter_900Black', fontSize: 18, color: '#FFF' },
  logOpponent: { fontFamily: 'Inter_500Medium', fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5 },
});