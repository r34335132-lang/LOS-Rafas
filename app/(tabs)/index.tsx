import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
} from "react-native";
import Animated, { FadeInDown, FadeInRight, ZoomIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LiveTicker } from "@/components/LiveTicker";
import { MatchCard } from "@/components/MatchCard";
import { SPORTS, TICKER_ITEMS, TEAMS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";
import { useLiveScores } from "@/hooks/useLiveScores";

const { width, height } = Dimensions.get("window");
const LOGO_URL = "https://bjgcwoyzmmltdpehpwrc.supabase.co/storage/v1/object/public/dfds/ChatGPT%20Image%2015%20may%202026,%2009_28_43%20p.m..png";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { matches, flashKeys } = useLiveScores();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  const featured = matches.find((m) => m.status === "live") ?? matches[0]!;
  const liveOthers = matches
    .filter((m) => m.status === "live" && m.id !== featured.id)
    .slice(0, 3);

  const featuredHomeTeam = TEAMS.find(t => t.id === featured.homeId);
  const featuredAwayTeam = TEAMS.find(t => t.id === featured.awayId);

  // Mapeo de imágenes locales
  const getSportImage = (key: string) => {
    switch (key) {
      case "flag": return require("@/assets/images/featured-flag.png");
      case "soccer": return require("@/assets/images/featured-soccer.png");
      case "basketball": return require("@/assets/images/featured-basketball.png");
      case "fitness":
      default:
        return { uri: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop" };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#000000' }]}>
      
      {/* HEADER FLOTANTE CON TU LOGO */}
      <Animated.View entering={FadeInDown.duration(600)} style={[styles.modernHeader, { paddingTop: insets.top + 10 }]}>
        <LinearGradient
          colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0)']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.headerTopRow}>
           <Image 
             source={{ uri: LOGO_URL }} 
             style={styles.logoImage} 
             resizeMode="contain" 
           />
           <View style={styles.headerActions}>
             <View style={styles.liveIndicator}>
               <View style={styles.liveDot} />
               <Text style={styles.liveText}>DGO</Text>
             </View>
             <Pressable style={styles.profileBtn}>
               <Ionicons name="menu" size={32} color="#FFF" />
             </Pressable>
           </View>
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* MATCH ESTELAR - DISEÑO DE MARCADOR GIGANTE (CERO CAJAS) */}
        <View style={styles.heroSection}>
          {/* Fondo cinemático del partido estelar */}
          <Image source={getSportImage(featured.sport)} style={styles.heroBgImage} blurRadius={10} />
          <LinearGradient colors={['rgba(0,0,0,0.3)', '#000000']} locations={[0, 1]} style={StyleSheet.absoluteFillObject} />
          
          <Animated.View entering={ZoomIn.duration(800).springify()} style={styles.heroScoreboard}>
            <View style={styles.heroTopTag}>
              <Feather name="zap" size={14} color={colors.primary} />
              <Text style={[styles.heroTopTagText, { color: colors.primary }]}>MAIN EVENT</Text>
            </View>

            <View style={styles.scoreRow}>
              {/* Equipo Local */}
              <View style={styles.teamSide}>
                <Text style={[styles.teamShort, { color: featuredHomeTeam?.colorHex || '#FFF' }]}>{featuredHomeTeam?.short}</Text>
                <Text style={styles.giantScore}>{featured.homeScore}</Text>
              </View>

              {/* Separador VS */}
              <View style={styles.vsContainer}>
                <Text style={styles.vsText}>VS</Text>
                <Text style={styles.minuteText}>{featured.minute || featured.startTime}</Text>
              </View>

              {/* Equipo Visitante */}
              <View style={styles.teamSide}>
                <Text style={[styles.teamShort, { color: featuredAwayTeam?.colorHex || '#FFF' }]}>{featuredAwayTeam?.short}</Text>
                <Text style={styles.giantScore}>{featured.awayScore}</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* TICKER QUE CRUZA LA PANTALLA */}
        <View style={{ marginTop: -20, marginBottom: 30 }}>
           <LiveTicker items={TICKER_ITEMS} />
        </View>

        {/* OTROS PARTIDOS EN VIVO - SCROLL HORIZONTAL (NO MÁS LISTA VERTICAL ABURRIDA) */}
        {liveOthers.length > 0 && (
          <Animated.View entering={FadeInRight.duration(700).delay(200).springify()} style={{ marginBottom: 40 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>EN JUEGO</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={{ paddingHorizontal: 20, gap: 15 }}
              snapToInterval={width * 0.85 + 15}
              decelerationRate="fast"
            >
              {liveOthers.map((m) => (
                <View key={m.id} style={{ width: width * 0.85 }}>
                  <MatchCard match={m} flashKey={flashKeys[m.id]} />
                </View>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* ARENAS DEPORTIVAS - SELECCIÓN ESTILO VIDEOJUEGO */}
        <Animated.View entering={FadeInDown.duration(700).delay(400).springify()}>
          <View style={[styles.sectionHeader, { marginBottom: 20 }]}>
             <Text style={styles.sectionTitle}>ARENAS</Text>
             <Feather name="arrow-right" size={24} color="#FFF" style={{ opacity: 0.5 }} />
          </View>
          
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 20 }}
            snapToInterval={width * 0.75 + 20}
            decelerationRate="fast"
          >
            {SPORTS.map((s, index) => {
              const accent = (colors as any)[s.accent] || colors.border;
              const imageSource = getSportImage(s.key);

              return (
                <Pressable
                  key={s.key}
                  onPress={() => router.push(`/sports?sport=${s.key}`)}
                  style={({ pressed }) => [
                    styles.arenaPoster,
                    { transform: [{ scale: pressed ? 0.95 : 1 }] }
                  ]}
                >
                  <Image source={imageSource} style={styles.arenaImage} resizeMode="cover" />
                  
                  {/* Gradiente agresivo inferior */}
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)', '#000000']}
                    locations={[0.3, 0.7, 1]}
                    style={StyleSheet.absoluteFillObject}
                  />
                  
                  {/* Efecto de luz de neón del color del deporte */}
                  <LinearGradient
                    colors={[`${accent}80`, 'transparent']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0.4 }}
                    style={StyleSheet.absoluteFillObject}
                  />

                  {/* Textos y contenido */}
                  <View style={styles.arenaContent}>
                    <View style={[styles.arenaIconBadge, { backgroundColor: `${accent}30`, borderColor: accent }]}>
                      <Feather name={s.icon as keyof typeof Feather.glyphMap} size={24} color="#FFF" />
                    </View>

                    <View>
                      {/* Texto de fondo enorme que se corta */}
                      <Text style={[styles.arenaBgText, { color: 'rgba(255,255,255,0.05)' }]} numberOfLines={1}>
                        {s.key.toUpperCase()}
                      </Text>
                      
                      <Text style={styles.arenaTitle}>{s.name}</Text>
                      <View style={styles.arenaFooterRow}>
                        <Text style={styles.arenaDesc}>{s.description}</Text>
                        <View style={[styles.enterBtn, { backgroundColor: accent }]}>
                          <Feather name="play" size={16} color="#000" />
                        </View>
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // HEADER
  modernHeader: { 
    position: 'absolute', 
    top: 0, width: '100%', 
    paddingHorizontal: 20, 
    paddingBottom: 20, 
    zIndex: 100 
  },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoImage: { 
    width: 140, 
    height: 50, // Ajustado para que luzca tu imagen PNG
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  liveIndicator: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: 'rgba(255,0,0,0.2)', 
    paddingHorizontal: 12, paddingVertical: 6, 
    borderRadius: 30, borderWidth: 1, borderColor: 'rgba(255,0,0,0.5)' 
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF0000', marginRight: 6 },
  liveText: { fontFamily: 'Inter_900Black', fontSize: 10, color: '#FFF', letterSpacing: 1 },
  profileBtn: { opacity: 0.8 },

  // HERO SECTION (Marcador)
  heroSection: {
    width: '100%',
    height: height * 0.45, // Toma casi la mitad de la pantalla
    justifyContent: 'flex-end',
    paddingBottom: 40,
    position: 'relative',
  },
  heroBgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  heroScoreboard: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  heroTopTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  heroTopTagText: { fontFamily: 'Inter_900Black', fontSize: 12, letterSpacing: 2, marginLeft: 6 },
  
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  teamSide: {
    alignItems: 'center',
    flex: 1,
  },
  teamShort: {
    fontFamily: 'Inter_900Black',
    fontSize: 24,
    letterSpacing: -1,
    marginBottom: -10,
    zIndex: 2,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  giantScore: {
    fontFamily: 'Inter_900Black',
    fontSize: 84, // TAMAÑO MONUMENTAL
    color: '#FFF',
    letterSpacing: -4,
    lineHeight: 90,
  },
  vsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  vsText: {
    fontFamily: 'Inter_900Black',
    fontSize: 16,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 4,
  },
  minuteText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#E10600', // Rojo de alerta
    backgroundColor: 'rgba(225,6,0,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden'
  },

  // TÍTULOS DE SECCIÓN
  sectionHeader: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: 'Inter_900Black',
    fontSize: 22,
    color: '#FFF',
    letterSpacing: -1,
    textTransform: 'uppercase',
  },

  // ARENAS POSTERS (El nuevo diseño de ligas)
  arenaPoster: {
    width: width * 0.75, // Ocupa el 75% de la pantalla para invitar al scroll
    height: 420, // Altura inmersiva de póster
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#111',
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  arenaImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  arenaContent: {
    padding: 24,
    zIndex: 2,
  },
  arenaIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    backdropFilter: 'blur(10px)',
  },
  arenaBgText: {
    position: 'absolute',
    bottom: 30,
    left: -10,
    fontFamily: 'Inter_900Black',
    fontSize: 80,
    letterSpacing: -4,
    zIndex: -1,
  },
  arenaTitle: {
    fontFamily: 'Inter_900Black',
    fontSize: 36,
    color: '#FFF',
    letterSpacing: -1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  arenaFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arenaDesc: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    maxWidth: '70%',
  },
  enterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  }
});