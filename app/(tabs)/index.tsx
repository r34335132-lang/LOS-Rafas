import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ImageBackground,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const { width, height } = Dimensions.get("window");

// ─── CONSTANTES DE DISEÑO (THEME) ─────────────────────────────────────────────
const THEME = {
  bg: "#050505",
  surface: "#121212",
  surfaceLight: "#1E1E1E",
  neon: "#39FF14",
  neonMuted: "rgba(57, 255, 20, 0.15)",
  text: "#FFFFFF",
  textMuted: "rgba(255, 255, 255, 0.6)",
  border: "rgba(255, 255, 255, 0.1)",
};

// ─── CONSTANTES DE IMÁGENES Y TEXTURAS ───────────────────────────────────────
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop";
const ROCK_TEXTURE =
  "https://images.unsplash.com/photo-1525914813433-886dc8183afa?q=80&w=1000&auto=format&fit=crop";

const LEAGUES = [
  {
    id: "futbol",
    name: "Fútbol",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop",
    icon: "soccer" as const,
    tag: "LIGA PRO",
  },
  {
    id: "basquetbol",
    name: "Básquetbol",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop",
    icon: "basketball" as const,
    tag: "TORNEO ELITE",
  },
  {
    id: "voleibol",
    name: "Voleibol",
    image: "https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=800&auto=format&fit=crop",
    icon: "volleyball" as const,
    tag: "COPA INVIERNO",
  },
  {
    id: "crossfit",
    name: "CrossFit",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop",
    icon: "dumbbell" as const,
    tag: "OPEN BOX",
  },
  {
    id: "padel",
    name: "Pádel",
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=800&auto=format&fit=crop",
    icon: "tennis" as const,
    tag: "CIRCUITO",
  },
];

const VALUES = [
  { icon: "account-group" as const, title: "Comunidad", desc: "Forjando alianzas." },
  { icon: "trophy" as const, title: "Competencia", desc: "El más alto nivel." },
  { icon: "calendar-check" as const, title: "Organización", desc: "Gestión impecable." },
  { icon: "shield-check" as const, title: "Seguridad", desc: "Entorno controlado." },
];

const STATS = [
  { number: "+50", label: "Equipos", icon: "shield-half-full" as const },
  { number: "+200", label: "Partidos", icon: "whistle" as const },
  { number: "5", label: "Sedes", icon: "map-marker-path" as const },
  { number: "100%", label: "Pasión", icon: "fire" as const },
];

const SPONSORS = [
  { 
    name: "NIKE", 
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop", 
    desc: "INDUMENTARIA OFICIAL" 
  },
  { 
    name: "SMART FIT", 
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop", 
    desc: "SPONSOR DEPORTIVO" 
  },
  { 
    name: "POWERADE", 
    image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=800&auto=format&fit=crop", 
    desc: "HIDRATACIÓN" 
  },
  { 
    name: "RED BULL", 
    image: "https://images.unsplash.com/photo-1566847420552-f04b2b115eb3?q=80&w=800&auto=format&fit=crop", 
    desc: "ENERGÍA OFICIAL" 
  },
];

// ─── COMPONENTES BASE ────────────────────────────────────────────────────────
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function PressableCard({ children, style, onPress }: { children: React.ReactNode; style?: any; onPress?: () => void; }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressable
      style={[animStyle, style]}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 15, stiffness: 200 });
        opacity.value = withTiming(0.8, { duration: 150 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 200 });
        opacity.value = withTiming(1, { duration: 150 });
      }}
    >
      {children}
    </AnimatedPressable>
  );
}

// ─── TARJETA DE PATROCINADOR ANIMADA ─────────────────────────────────────────
function AnimatedSponsorCard({ sponsor, index }: { sponsor: any, index: number }) {
  const glowOpacity = useSharedValue(0.1);

  useEffect(() => {
    setTimeout(() => {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }, index * 400);
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Animated.View entering={FadeInRight.duration(800).delay(index * 150).springify()}>
      <View style={styles.sponsorWrapper}>
        <Animated.View style={[styles.sponsorGlowBackground, glowStyle]} />
        
        <PressableCard style={styles.sponsorCard}>
          <Image source={{ uri: sponsor.image }} style={styles.sponsorBgImage} />
          
          <LinearGradient
            colors={["transparent", "rgba(5,5,5,0.7)", THEME.bg]}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFillObject}
          />
          
          <View style={styles.sponsorContent}>
            <View>
              <Text style={styles.sponsorName}>{sponsor.name}</Text>
              <View style={[styles.neonLine, { width: 30, marginBottom: 8, marginTop: 4 }]} />
              <Text style={styles.sponsorDesc}>{sponsor.desc}</Text>
            </View>
            <MaterialCommunityIcons name="arrow-top-right" size={20} color={THEME.neon} />
          </View>
        </PressableCard>
      </View>
    </Animated.View>
  );
}

// ─── EFECTOS VISUALES ────────────────────────────────────────────────────────
function DiagonalLines({ color = THEME.neon, opacity = 0.05 }) {
  return (
    <View style={[StyleSheet.absoluteFillObject, { overflow: "hidden" }]} pointerEvents="none">
      {[...Array(12)].map((_, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            width: 1,
            height: "250%",
            backgroundColor: color,
            opacity,
            top: "-50%",
            left: i * 60 - 50,
            transform: [{ rotate: "-30deg" }],
          }}
        />
      ))}
    </View>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.headingAccent} />
      <View>
        {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
    </View>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  
  const heroScale = useSharedValue(1.1);
  useEffect(() => {
    heroScale.value = withTiming(1, { duration: 4000, easing: Easing.out(Easing.cubic) });
  }, []);

  const heroAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heroScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* ── HEADER FLOTANTE ── */}
      <Animated.View entering={FadeInDown.duration(800)} style={[styles.modernHeader, { paddingTop: insets.top + 10 }]}>
        <LinearGradient colors={["rgba(5,5,5,0.95)", "rgba(5,5,5,0)"]} style={StyleSheet.absoluteFillObject} />
        <View style={styles.headerTopRow}>
          <Pressable style={styles.menuBtn}>
            <Ionicons name="menu" size={26} color={THEME.text} />
          </Pressable>

          <View style={{ alignItems: "center" }}>
            <Text style={styles.headerLogo}>
              <Text style={{ color: THEME.neon }}>ROCA</Text>
              <Text style={{ color: THEME.text }}>SPORTS</Text>
            </Text>
          </View>

          <Pressable style={styles.registerBtnHeader} onPress={() => router.push("/create-league")}>
            <Text style={styles.registerBtnTextHeader}>CREAR LIGA</Text>
          </Pressable>
        </View>
      </Animated.View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* ── 1. HERO PRINCIPAL ── */}
        <View style={styles.heroSection}>
          <Animated.Image source={{ uri: HERO_IMAGE }} style={[styles.heroBgImage, heroAnimStyle]} />
          
          <LinearGradient
            colors={["rgba(5,5,5,0.2)", "rgba(5,5,5,0.6)", THEME.bg]}
            locations={[0, 0.5, 1]}
            style={StyleSheet.absoluteFillObject}
          />
          <LinearGradient
            colors={[THEME.neonMuted, "transparent"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0.5, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />

          <DiagonalLines />

          <Animated.View entering={FadeInUp.duration(1000).delay(300).springify()} style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <View style={styles.heroBadgeDot} />
              <Text style={styles.heroBadgeText}>TEMPORADA 2026</Text>
            </View>

            <Text style={styles.heroTitleMain}>
              EL NIVEL{"\n"}
              <Text style={{ color: THEME.neon }}>MÁS ALTO.</Text>
            </Text>

            <Text style={styles.heroDesc}>
              Infraestructura élite, arbitraje profesional y la comunidad deportiva más agresiva de la ciudad.
            </Text>

            <View style={[styles.neonLine, { width: 80, marginBottom: 20 }]} />

            <View style={styles.heroButtons}>
              <PressableCard style={styles.btnPrimary} onPress={() => router.push("/sports")}>
                <LinearGradient
                  colors={[THEME.neon, "#2DB80F"]}
                  style={StyleSheet.absoluteFillObject}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={styles.btnPrimaryText}>EXPLORAR LIGAS</Text>
                  <MaterialCommunityIcons name="arrow-top-right-thick" size={16} color="#000" />
                </View>
              </PressableCard>
            </View>
          </Animated.View>
        </View>

        {/* ── 2. DISCIPLINAS (LIGAS) ── */}
        <Animated.View entering={FadeInDown.duration(800).delay(200).springify()} style={styles.sectionContainer}>
          <SectionHeading title="DISCIPLINAS" subtitle="SELECCIONA TU CAMINO" />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, paddingHorizontal: 24, paddingBottom: 20 }}
            snapToInterval={width * 0.7 + 16}
            decelerationRate="fast"
          >
            {LEAGUES.map((league, index) => (
              <Animated.View key={league.id} entering={FadeInRight.duration(600).delay(index * 150).springify()}>
                <PressableCard 
                  style={styles.leagueCard}
                  onPress={() => router.push({ pathname: "/sports", params: { sportId: league.id } })}
                >
                  <Image source={{ uri: league.image }} style={styles.leagueImage} />
                  
                  <LinearGradient
                    colors={["transparent", "rgba(5,5,5,0.4)", THEME.bg]}
                    locations={[0.2, 0.5, 1]}
                    style={StyleSheet.absoluteFillObject}
                  />

                  <View style={styles.leagueContent}>
                    <View style={styles.leagueTagBox}>
                      <Text style={styles.leagueTagText}>{league.tag}</Text>
                    </View>

                    <View>
                      <Text style={styles.leagueName}>{league.name}</Text>
                      <View style={[styles.neonLine, { width: 40, marginBottom: 16 }]} />
                    </View>
                    
                    <View style={styles.leagueActionRow}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <MaterialCommunityIcons name={league.icon} size={20} color={THEME.neon} />
                        <Text style={styles.leagueSubtext}>Ingresar</Text>
                      </View>
                      <View style={styles.arrowCircle}>
                        <Feather name="arrow-up-right" size={18} color="#000" />
                      </View>
                    </View>
                  </View>
                </PressableCard>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* ── 3. LOS PILARES ── */}
        <Animated.View entering={FadeInDown.duration(800).delay(300).springify()} style={[styles.sectionContainer, { marginTop: 10 }]}>
          <SectionHeading title="NUESTROS PILARES" subtitle="LA BASE DE LA ROCA" />

          <View style={styles.valuesGrid}>
            {VALUES.map((v, i) => (
              <Animated.View key={i} entering={ZoomIn.duration(600).delay(i * 100).springify()} style={styles.valueCardContainer}>
                <View style={styles.valueCard}>
                  <View style={styles.valueIconGlow} />
                  <MaterialCommunityIcons name={v.icon} size={26} color={THEME.text} style={{ marginBottom: 12 }} />
                  <Text style={styles.valueTitle}>{v.title}</Text>
                  <Text style={styles.valueDesc}>{v.desc}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* ── 4. PATROCINADORES CON ANIMACIÓN ── */}
        <Animated.View entering={FadeInDown.duration(800).delay(400).springify()} style={styles.sectionContainer}>
          <SectionHeading title="PARTNERS" subtitle="ALIANZAS ESTRATÉGICAS" />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 24, paddingHorizontal: 24, paddingBottom: 40, paddingTop: 10 }}
            snapToInterval={280 + 24}
            decelerationRate="fast"
          >
            {SPONSORS.map((sponsor, index) => (
              <AnimatedSponsorCard key={index} sponsor={sponsor} index={index} />
            ))}
          </ScrollView>
        </Animated.View>

        {/* ── 5. ADN ROCA ── */}
        <Animated.View entering={FadeInDown.duration(800).delay(500).springify()} style={[styles.sectionContainer, { marginHorizontal: 24 }]}>
          <View style={styles.aboutSection}>
            <Image source={{ uri: ROCK_TEXTURE }} style={[StyleSheet.absoluteFillObject, { opacity: 0.1 }]} />
            <LinearGradient colors={[THEME.surface, THEME.bg]} style={StyleSheet.absoluteFillObject} />
            
            <View style={styles.aboutAccentLine} />

            <View style={{ padding: 24 }}>
              <MaterialCommunityIcons name="shield-crown-outline" size={32} color={THEME.neon} style={{ marginBottom: 10 }} />
              <Text style={styles.aboutTitle}>ADN ROCA</Text>
              <Text style={styles.aboutText}>
                No somos solo ligas. Somos una plataforma de alto rendimiento diseñada para atletas que exigen lo mejor en cada partido.
              </Text>

              <View style={styles.statsGrid}>
                {STATS.map((stat, i) => (
                  <View key={i} style={styles.statItem}>
                    <Text style={styles.statNumber}>{stat.number}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ── 6. CTA FINAL ── */}
        <Animated.View entering={FadeInUp.duration(800).delay(600).springify()} style={[styles.sectionContainer, { marginHorizontal: 24, marginTop: 60 }]}>
          <PressableCard style={styles.ctaBox} onPress={() => router.push("/create-league")}>
            <Image source={{ uri: HERO_IMAGE }} style={[StyleSheet.absoluteFillObject, { opacity: 0.2 }]} />
            <LinearGradient
              colors={["rgba(57,255,20,0.85)", "#188A05"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            <DiagonalLines color="#000" opacity={0.2} />

            <View style={styles.ctaContent}>
              <View>
                <Text style={styles.ctaTitle}>DOMINA LA{"\n"}COMPETENCIA</Text>
                <Text style={styles.ctaDesc}>Inscribe a tu equipo hoy.</Text>
              </View>
              <View style={styles.ctaActionIcon}>
                <MaterialCommunityIcons name="arrow-right" size={32} color={THEME.neon} />
              </View>
            </View>
          </PressableCard>
        </Animated.View>

        {/* ── 7. FOOTER ── */}
        <View style={styles.footer}>
          <View style={styles.footerLogoContainer}>
            <Text style={styles.footerLogo}>
              <Text style={{ color: THEME.neon }}>ROCA</Text> SPORTS
            </Text>
          </View>

          <View style={styles.footerLinks}>
            {["Sedes", "Reglamentos", "Contacto"].map((link) => (
              <Pressable key={link}>
                <Text style={styles.footerLink}>{link}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.socialRow}>
            {(["instagram", "facebook", "twitter"] as const).map((net) => (
              <Pressable key={net} style={styles.socialBtn}>
                <MaterialCommunityIcons name={net} size={20} color={THEME.textMuted} />
              </Pressable>
            ))}
          </View>

          <Text style={styles.copy}>© 2026 ROCA SPORTS. TODOS LOS DERECHOS RESERVADOS.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  
  // LÍNEA NEÓN (NUEVO)
  neonLine: {
    height: 3,
    backgroundColor: THEME.neon,
    shadowColor: THEME.neon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },

  // HEADER
  modernHeader: {
    position: "absolute",
    top: 0,
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 15,
    zIndex: 100,
  },
  headerTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  menuBtn: { padding: 5 },
  headerLogo: { fontFamily: "Inter_900Black", fontSize: 20, letterSpacing: 1 },
  registerBtnHeader: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.neon,
    backgroundColor: "rgba(57, 255, 20, 0.05)",
  },
  registerBtnTextHeader: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: THEME.neon,
    letterSpacing: 1,
  },

  // SECTION HEADING
  sectionHeader: { paddingHorizontal: 24, marginBottom: 20, flexDirection: "row", alignItems: "center" },
  headingAccent: { width: 4, height: 28, backgroundColor: THEME.neon, marginRight: 12, borderRadius: 2 },
  sectionSubtitle: { fontFamily: "Inter_700Bold", fontSize: 10, color: THEME.neon, letterSpacing: 2, marginBottom: 2 },
  sectionTitle: { fontFamily: "Inter_900Black", fontSize: 24, color: THEME.text, letterSpacing: -0.5, textTransform: "uppercase" },
  sectionContainer: { marginTop: 40 },

  // HERO
  heroSection: { width: "100%", height: height * 0.82, justifyContent: "flex-end", overflow: "hidden" },
  heroBgImage: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  heroContent: { padding: 24, paddingBottom: 50 },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  heroBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: THEME.neon, shadowColor: THEME.neon, shadowOpacity: 1, shadowRadius: 5 },
  heroBadgeText: { fontFamily: "Inter_700Bold", fontSize: 10, color: THEME.text, letterSpacing: 1.5 },
  heroTitleMain: { fontFamily: "Inter_900Black", fontSize: 64, letterSpacing: -2.5, lineHeight: 64, color: THEME.text, marginBottom: 16 },
  heroDesc: { fontFamily: "Inter_500Medium", fontSize: 16, color: THEME.textMuted, marginBottom: 35, maxWidth: "90%", lineHeight: 24 },
  heroButtons: { flexDirection: "row" },
  btnPrimary: { paddingVertical: 18, paddingHorizontal: 32, borderRadius: 4, alignItems: "center", overflow: "hidden" },
  btnPrimaryText: { fontFamily: "Inter_900Black", fontSize: 14, color: "#000", letterSpacing: 1 },

  // DISCIPLINAS (LIGAS)
  leagueCard: {
    width: width * 0.7,
    height: 380,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  leagueImage: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  leagueContent: { flex: 1, justifyContent: "space-between", padding: 20 },
  leagueTagBox: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  leagueTagText: { fontFamily: "Inter_700Bold", fontSize: 9, color: THEME.text, letterSpacing: 1 },
  leagueName: { fontFamily: "Inter_900Black", fontSize: 36, color: THEME.text, letterSpacing: -1, marginTop: "auto" },
  leagueActionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: THEME.border, paddingTop: 16 },
  leagueSubtext: { fontFamily: "Inter_700Bold", fontSize: 13, color: THEME.text, textTransform: "uppercase", letterSpacing: 0.5 },
  arrowCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: THEME.neon, alignItems: "center", justifyContent: "center" },

  // PILARES
  valuesGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20, gap: 12, justifyContent: "space-between" },
  valueCardContainer: { width: (width - 52) / 2, marginBottom: 12 },
  valueCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: THEME.surfaceLight,
    minHeight: 140,
    position: "relative",
    overflow: "hidden",
  },
  valueIconGlow: { position: "absolute", top: -20, left: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: THEME.neon, opacity: 0.05 },
  valueTitle: { fontFamily: "Inter_800ExtraBold", fontSize: 14, color: THEME.text, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  valueDesc: { fontFamily: "Inter_500Medium", fontSize: 12, color: THEME.textMuted, lineHeight: 18 },

  // PATROCINADORES CON GLOW ANIMADO
  sponsorWrapper: { position: 'relative', width: 280, height: 160 },
  sponsorGlowBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: THEME.neon,
    borderRadius: 16,
    transform: [{ scale: 1.05 }],
  },
  sponsorCard: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(57,255,20,0.3)",
    backgroundColor: THEME.surface,
    overflow: "hidden",
  },
  sponsorBgImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  sponsorContent: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexDirection: "row",
    padding: 20,
  },
  sponsorName: { fontFamily: "Inter_900Black", fontSize: 24, color: THEME.text, letterSpacing: 1 },
  sponsorDesc: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: THEME.textMuted, letterSpacing: 1.5 },

  // ADN ROCA
  aboutSection: { borderRadius: 12, borderWidth: 1, borderColor: THEME.border, backgroundColor: THEME.surface, overflow: "hidden", position: "relative" },
  aboutAccentLine: { position: "absolute", top: 0, left: 0, width: "100%", height: 3, backgroundColor: THEME.neon },
  aboutTitle: { fontFamily: "Inter_900Black", fontSize: 24, color: THEME.text, letterSpacing: -0.5, marginBottom: 12 },
  aboutText: { fontFamily: "Inter_500Medium", fontSize: 14, color: THEME.textMuted, lineHeight: 22, marginBottom: 24 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 20 },
  statItem: { width: "45%" },
  statNumber: { fontFamily: "Inter_900Black", fontSize: 28, color: THEME.text, letterSpacing: -1, marginBottom: 4 },
  statLabel: { fontFamily: "Inter_700Bold", fontSize: 10, color: THEME.neon, textTransform: "uppercase", letterSpacing: 1 },

  // CTA
  ctaBox: { borderRadius: 12, overflow: "hidden" },
  ctaContent: { padding: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  ctaTitle: { fontFamily: "Inter_900Black", fontSize: 28, color: "#000", letterSpacing: -1, lineHeight: 30, marginBottom: 8 },
  ctaDesc: { fontFamily: "Inter_700Bold", fontSize: 13, color: "rgba(0,0,0,0.7)" },
  ctaActionIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#000", alignItems: "center", justifyContent: "center" },

  // FOOTER
  footer: { marginTop: 80, paddingHorizontal: 24, alignItems: "center" },
  footerLogoContainer: { paddingBottom: 30, borderBottomWidth: 1, borderBottomColor: THEME.border, width: "100%", alignItems: "center", marginBottom: 30 },
  footerLogo: { fontFamily: "Inter_900Black", fontSize: 24, letterSpacing: 2, color: THEME.text },
  footerLinks: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 20, marginBottom: 30 },
  footerLink: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: THEME.textMuted, letterSpacing: 1, textTransform: "uppercase" },
  socialRow: { flexDirection: "row", gap: 20, marginBottom: 40 },
  socialBtn: { padding: 8 },
  copy: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: "rgba(255,255,255,0.3)", textAlign: "center", letterSpacing: 0.5 },
});