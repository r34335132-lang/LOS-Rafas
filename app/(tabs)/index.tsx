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
  Dimensions
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LiveTicker } from "@/components/LiveTicker";
import { MatchCard } from "@/components/MatchCard";
import { NewsCard } from "@/components/NewsCard";
import { NEWS, SPORTS, TICKER_ITEMS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";
import { useLiveScores } from "@/hooks/useLiveScores";

const { width } = Dimensions.get("window");

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

  return (
    // FONDO NEGRO ABSOLUTO ROCA SPORTS (#0B0B0B)
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* 1. HEADER MODERNO CON "STAGE LIGHTING" */}
      <View style={[styles.modernHeader, { paddingTop: insets.top + 10 }]}>
        {/* Luz de neón roja difuminada de fondo para que el logo resalte */}
        <LinearGradient
          colors={[`${colors.primary}25`, 'transparent']}
          style={StyleSheet.absoluteFillObject}
        />
        
        <View style={styles.headerTopRow}>
           <View style={[styles.liveIndicator, { backgroundColor: 'rgba(225, 6, 0, 0.15)', borderColor: 'rgba(225, 6, 0, 0.3)' }]}>
             <View style={[styles.liveDot, { backgroundColor: colors.live }]} />
             <Text style={[styles.liveText, { color: colors.live }]}>DURANGO, MX</Text>
           </View>
           <Pressable style={styles.profileBtn}>
             <Ionicons name="person-circle" size={32} color={colors.mutedForeground} />
           </Pressable>
        </View>

        {/* LOGO TIPOGRÁFICO "ROCA SPORTS" TEMPORAL (PERO IMPACTANTE) */}
        <View style={styles.brandLockup}>
          <Text style={styles.brandRoca}>ROCA</Text>
          <View style={styles.brandSportsWrapper}>
            <Text style={[styles.brandSports, { color: colors.primary }]}>SPORTS</Text>
            {/* El punto le da un toque de marca registrada/minimalista */}
            <View style={[styles.brandDot, { backgroundColor: colors.primary }]} />
          </View>
        </View>
      </View>

      <LiveTicker items={TICKER_ITEMS} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* 2. PARTIDO DESTACADO */}
        <Animated.View entering={FadeInDown.duration(700).springify()}>
          <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.modernSectionTitle}>ESTELAR</Text>
              <Feather name="zap" size={16} color={colors.primary} />
            </View>
             <MatchCard
               match={featured}
               variant="hero"
               flashKey={flashKeys[featured.id]}
             />
          </View>
        </Animated.View>

        {/* 3. MÁS EN VIVO */}
        {liveOthers.length > 0 && (
          <Animated.View entering={FadeInDown.duration(700).delay(150).springify()}>
            <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.modernSectionTitle}>EN JUEGO</Text>
                <Pressable onPress={() => router.push("/scores")}>
                  <Text style={[styles.seeAllText, { color: colors.primary }]}>Ver todos</Text>
                </Pressable>
              </View>
              <View style={{ gap: 16 }}>
                {liveOthers.map((m) => (
                  <MatchCard key={m.id} match={m} flashKey={flashKeys[m.id]} />
                ))}
              </View>
            </View>
          </Animated.View>
        )}

        {/* 4. NOTICIAS CAROUSEL */}
        <Animated.View entering={FadeInRight.duration(700).delay(300).springify()}>
          <View style={styles.sectionTitleRowPad}>
            <Text style={styles.modernSectionTitle}>ÚLTIMA HORA</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            snapToInterval={width * 0.75 + 16} 
            decelerationRate="fast"
          >
            {NEWS.slice(0, 5).map((item) => (
              <View key={item.id} style={{ width: width * 0.75 }}>
                <NewsCard item={item} variant="carousel" />
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* 5. SPORTS BENTO GRID */}
        <Animated.View entering={FadeInDown.duration(700).delay(450).springify()}>
          <View style={[styles.sectionTitleRowPad, { marginTop: 20 }]}>
            <Text style={styles.modernSectionTitle}>LIGAS</Text>
          </View>
          <View style={styles.sportGrid}>
            {SPORTS.map((s) => {
              const accent = (colors as any)[s.accent] || colors.border;
              const isHero = s.highlighted;

              return (
                <Pressable
                  key={s.key}
                  onPress={() => router.push(`/sports?sport=${s.key}`)}
                  style={({ pressed }) => [
                    styles.sportTile,
                    isHero ? styles.sportTileHero : styles.sportTileStandard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      borderWidth: 1,
                      transform: [{ scale: pressed ? 0.95 : 1 }], 
                    },
                  ]}
                >
                  {isHero && (
                     <LinearGradient
                       colors={[`${accent}20`, 'transparent']}
                       style={StyleSheet.absoluteFillObject}
                     />
                  )}
                  
                  <View style={styles.sportTileHeader}>
                    <View style={[styles.sportIcon, { backgroundColor: `${accent}15`, borderColor: `${accent}30`, borderWidth: 1 }]}>
                      <Feather name={s.icon as keyof typeof Feather.glyphMap} size={22} color={accent} />
                    </View>
                    {isHero && (
                      <View style={[styles.highlightTag, { backgroundColor: accent }]}>
                        <Text style={[styles.highlightTagText, { color: '#0B0B0B' }]}>DESTACADO</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.sportTileBody}>
                    <Text style={[styles.sportName, { color: colors.foreground, fontSize: isHero ? 24 : 18 }]}>
                      {s.name}
                    </Text>
                    {isHero && (
                      <Text style={[styles.sportDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
                        {s.description}
                      </Text>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  modernHeader: {
    paddingHorizontal: 20,
    paddingBottom: 16, // Un poco más de espacio debajo del logo
    overflow: 'hidden', // Asegura que el gradiente no se salga
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  liveText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.5 },
  profileBtn: { opacity: 0.8 },
  
  // --- NUEVO LOGOTIPO TIPOGRÁFICO ---
  brandLockup: {
    marginBottom: 10,
  },
  brandRoca: {
    fontFamily: 'Inter_900Black',
    fontSize: 54, // Gigante
    lineHeight: 54, // Line height exacto para que no haya espacios en blanco
    letterSpacing: -2.5, // Letras apretadas, look moderno
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  brandSportsWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: -8, // Este margen negativo "monta" la palabra SPORTS casi encima de ROCA
  },
  brandSports: {
    fontFamily: 'Inter_900Black',
    fontSize: 54,
    lineHeight: 54,
    letterSpacing: -2.5,
    textTransform: 'uppercase',
  },
  brandDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: 6,
    marginBottom: 4, // Lo alineamos ópticamente con la base de las letras
  },
  // -----------------------------------

  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleRowPad: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  modernSectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: '#8E8E93',
    letterSpacing: 2,
  },
  seeAllText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },

  carousel: { paddingHorizontal: 20, paddingBottom: 20, gap: 16 },
  
  sportGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20, 
    gap: 16, 
    paddingBottom: 20,
  },
  sportTile: {
    borderRadius: 28,
    padding: 20,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  sportTileHero: { width: "100%", minHeight: 180 },
  sportTileStandard: { width: "47%", flexGrow: 1, minHeight: 160 },
  sportTileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  sportTileBody: { gap: 8 },
  sportName: {
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
  },
  sportDesc: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    lineHeight: 18,
  },
  highlightTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  highlightTagText: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 9,
    letterSpacing: 1,
  },
});