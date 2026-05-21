import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const { width, height } = Dimensions.get("window");

// ─── CONSTANTES DE IMÁGENES Y TEXTURAS (IDENTIDAD ROCA) ──────────────────────
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop"; // Atletas de alto rendimiento
const ROCK_TEXTURE =
  "https://images.unsplash.com/photo-1525914813433-886dc8183afa?q=80&w=1000&auto=format&fit=crop"; // Textura oscura de roca basáltica

const LEAGUES = [
  {
    name: "Fútbol",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop",
    icon: "soccer" as const,
    color: "#39FF14",
  },
  {
    name: "Básquetbol",
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop",
    icon: "basketball" as const,
    color: "#39FF14", // Homologado a verde neón para consistencia de marca premium
  },
  {
    name: "Voleibol",
    image:
      "https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=800&auto=format&fit=crop",
    icon: "volleyball" as const,
    color: "#39FF14",
  },
  {
    name: "CrossFit", // Cambiado de Futsal a CrossFit
    image:
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop",
    icon: "dumbbell" as const,
    color: "#39FF14",
  },
  {
    name: "Pádel",
    image:
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=800&auto=format&fit=crop",
    icon: "tennis" as const,
    color: "#39FF14",
  },
];

const VALUES = [
  {
    icon: "account-group" as const,
    title: "Comunidad",
    desc: "Unimos apasionados del deporte.",
  },
  {
    icon: "trophy" as const,
    title: "Competencia",
    desc: "Ligas de alto nivel.",
  },
  {
    icon: "calendar-check" as const,
    title: "Organización",
    desc: "Gestión profesional.",
  },
  {
    icon: "shield-check" as const,
    title: "Seguridad",
    desc: "Entorno seguro y familiar.",
  },
];

const STATS = [
  { number: "+50", label: "Equipos", icon: "account-group" as const },
  { number: "+200", label: "Partidos", icon: "whistle" as const },
  { number: "5", label: "Sedes", icon: "map-marker" as const },
  { number: "100%", label: "Pasión", icon: "fire" as const },
];

// ─── COMPONENTE ANIMATED PRESSABLE ───────────────────────────────────────────
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function PressableCard({
  children,
  style,
  onPress,
}: {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[animStyle, style]}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12 });
      }}
    >
      {children}
    </AnimatedPressable>
  );
}

// ─── DIAGONAL LINES DECORATION (GRIETAS DE ROCA) ─────────────────────────────
function DiagonalLines({ color = "#39FF14", opacity = 0.08 }) {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {[...Array(8)].map((_, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            width: 1.5,
            height: "200%",
            backgroundColor: color,
            opacity,
            top: "-50%",
            left: i * 70 - 20,
            transform: [{ rotate: "-25deg" }],
          }}
        />
      ))}
    </View>
  );
}

// ─── NEON GLOW LINE ───────────────────────────────────────────────────────────
function NeonLine({ style }: { style?: any }) {
  return (
    <View
      style={[
        {
          height: 3,
          backgroundColor: "#39FF14",
          shadowColor: "#39FF14",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 10,
          elevation: 10,
        },
        style,
      ]}
    />
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: "#020202" }]}>
      {/* ── FLOATING HEADER ─────────────────────────────────────── */}
      <Animated.View
        entering={FadeInDown.duration(600)}
        style={[styles.modernHeader, { paddingTop: insets.top + 10 }]}
      >
        <LinearGradient
          colors={["rgba(2,2,2,0.95)", "rgba(2,2,2,0)"]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.headerTopRow}>
          <Pressable style={styles.menuBtn}>
            <Ionicons name="menu" size={28} color="#FFF" />
          </Pressable>

          {/* Logo Premium */}
          <View style={{ alignItems: "center" }}>
            <Text style={styles.headerLogo}>
              <Text style={{ color: "#39FF14" }}>ROCA</Text>
              <Text style={{ color: "#FFF" }}>SPORTS</Text>
            </Text>
          </View>

          <Pressable
            style={[styles.registerBtnHeader, { backgroundColor: "#39FF14" }]}
          >
            <Text style={styles.registerBtnTextHeader}>JUGAR</Text>
          </Pressable>
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. HERO PRINCIPAL (ESTILO MONTAÑA / PREMIUM) ────────────────── */}
        <View style={styles.heroSection}>
          <Image source={{ uri: HERO_IMAGE }} style={styles.heroBgImage} />
          {/* Textura de Roca fusionada */}
          <Image
            source={{ uri: ROCK_TEXTURE }}
            style={[styles.heroBgImage, { opacity: 0.25 }]}
            resizeMode="cover"
          />

          {/* Overlays Agresivos */}
          <LinearGradient
            colors={["rgba(2,2,2,0.2)", "rgba(2,2,2,0.7)", "#020202"]}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFillObject}
          />

          <LinearGradient
            colors={["rgba(57,255,20,0.25)", "transparent"]}
            start={{ x: 0, y: 0.8 }}
            end={{ x: 1, y: 0 }}
            style={[StyleSheet.absoluteFillObject, { opacity: 0.5 }]}
          />

          <DiagonalLines color="#39FF14" opacity={0.1} />

          <Animated.View
            entering={FadeInUp.duration(900).delay(200).springify()}
            style={styles.heroContent}
          >
            {/* Badge superior */}
            <View style={styles.heroBadge}>
              <MaterialCommunityIcons name="lightning-bolt" size={14} color="#000" />
              <Text style={styles.heroBadgeText}>ALTO RENDIMIENTO</Text>
            </View>

            {/* Título principal masivo */}
            <Text style={styles.heroTitleMain}>
              <Text style={{ color: "#39FF14" }}>ROCA</Text>
              {"\n"}
              <Text style={{ color: "#FFF" }}>SPORTS</Text>
            </Text>

            <NeonLine style={{ width: 80, marginBottom: 20 }} />

            <Text style={styles.heroSubtitle}>
              Forjando la mejor{"\n"}competencia deportiva.
            </Text>
            <Text style={styles.heroDesc}>
              Organizamos ligas competitivas y recreativas con infraestructura de primer nivel y pasión por el deporte.
            </Text>

            {/* Botones */}
            <View style={styles.heroButtons}>
              <PressableCard
                style={[
                  styles.btnPrimary,
                  {
                    backgroundColor: "#39FF14",
                    shadowColor: "#39FF14",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.6,
                    shadowRadius: 15,
                  },
                ]}
                onPress={() => router.push("/sports")}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={styles.btnPrimaryText}>Explorar Ligas</Text>
                  <MaterialCommunityIcons name="arrow-top-right-thick" size={18} color="#000" />
                </View>
              </PressableCard>
            </View>
          </Animated.View>
        </View>

        {/* ── 2. VALORES (BLOQUES SÓLIDOS) ─────────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.duration(700).delay(100).springify()}
          style={[styles.sectionContainer, { marginTop: 10 }]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>LOS PILARES</Text>
          </View>

          <View style={styles.valuesGrid}>
            {VALUES.map((v, i) => (
              <Animated.View
                key={i}
                entering={FadeInDown.duration(500).delay(i * 80).springify()}
                style={styles.valueCardContainer}
              >
                <PressableCard style={styles.valueCard}>
                  {/* Fondo textura roca muy sutil */}
                  <Image source={{ uri: ROCK_TEXTURE }} style={styles.cardTexture} />
                  <LinearGradient
                    colors={["rgba(57,255,20,0.05)", "rgba(10,10,10,0.9)"]}
                    style={StyleSheet.absoluteFillObject}
                  />

                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name={v.icon} size={28} color="#39FF14" />
                  </View>

                  <Text style={styles.valueTitle}>{v.title}</Text>
                  <Text style={styles.valueDesc}>{v.desc}</Text>
                </PressableCard>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* ── 3. NUESTRAS LIGAS / DISCIPLINAS ────────────────────────────── */}
        <Animated.View
          entering={FadeInDown.duration(700).delay(200).springify()}
          style={[styles.sectionContainer, { marginTop: 50 }]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>DISCIPLINAS</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, paddingHorizontal: 20, paddingBottom: 20 }}
            snapToInterval={width * 0.7 + 16}
            decelerationRate="fast"
          >
            {LEAGUES.map((league, index) => (
              <Animated.View
                key={index}
                entering={FadeInRight.duration(500).delay(index * 80).springify()}
              >
                <PressableCard style={styles.leagueCard}>
                  <Image source={{ uri: league.image }} style={styles.leagueImage} />
                  
                  {/* Overlay Rock/Dark */}
                  <LinearGradient
                    colors={["transparent", "rgba(2,2,2,0.6)", "rgba(2,2,2,1)"]}
                    locations={[0.2, 0.6, 1]}
                    style={StyleSheet.absoluteFillObject}
                  />

                  <View style={styles.leagueContent}>
                    {/* Badge Angular (Identidad Roca) */}
                    <View style={styles.leagueIconBadge}>
                      <MaterialCommunityIcons name={league.icon} size={24} color="#000" />
                    </View>

                    <Text style={styles.leagueName}>{league.name}</Text>
                    <NeonLine style={{ width: 40, marginBottom: 16, backgroundColor: league.color }} />

                    <View style={styles.leagueFooter}>
                      <Text style={styles.leagueSubtext}>Ver detalles</Text>
                      <Feather name="chevron-right" size={20} color={league.color} />
                    </View>
                  </View>
                </PressableCard>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* ── 4. SOBRE ROCA SPORTS (IDENTIDAD MONTAÑA) ────────────────────── */}
        <Animated.View
          entering={FadeInDown.duration(700).delay(300).springify()}
          style={[styles.sectionContainer, { marginTop: 40, marginHorizontal: 20 }]}
        >
          <View style={styles.aboutSection}>
            <Image source={{ uri: ROCK_TEXTURE }} style={styles.cardTexture} />
            <LinearGradient
              colors={["rgba(57,255,20,0.08)", "rgba(10,10,10,0.9)"]}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Borde izquierdo robusto */}
            <View style={styles.aboutThickBorder} />

            <View style={{ paddingLeft: 16 }}>
              <Text style={styles.sectionTitle}>ADN ROCA</Text>
              
              <Text style={styles.aboutText}>
                Nacimos con la misión de impulsar el deporte y la sana
                competencia. Construimos ligas sólidas como la roca que conectan 
                personas y fortalecen a la comunidad deportiva.
              </Text>

              <View style={styles.statsGrid}>
                {STATS.map((stat, i) => (
                  <Animated.View
                    key={i}
                    entering={ZoomIn.duration(500).delay(i * 100)}
                    style={styles.statItem}
                  >
                    <MaterialCommunityIcons
                      name={stat.icon}
                      size={24}
                      color="rgba(255,255,255,0.2)"
                      style={{ position: "absolute", top: 10, right: 10 }}
                    />
                    <Text style={styles.statNumber}>{stat.number}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </Animated.View>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ── 5. CTA FINAL (BANNER AGRESIVO) ──────────────────────────────── */}
        <Animated.View
          entering={FadeInUp.duration(700).delay(200).springify()}
          style={[styles.sectionContainer, { marginHorizontal: 20, marginTop: 50 }]}
        >
          <View style={styles.ctaBox}>
            <Image source={{ uri: HERO_IMAGE }} style={[styles.cardTexture, { opacity: 0.15 }]} />
            
            <LinearGradient
              colors={["#0D3B03", "#39FF14", "#0D3B03"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[StyleSheet.absoluteFillObject, { opacity: 0.85 }]}
            />
            
            <DiagonalLines color="#000" opacity={0.15} />

            <MaterialCommunityIcons
              name="terrain" // Icono de montaña
              size={120}
              color="rgba(0,0,0,0.15)"
              style={{ position: "absolute", right: -30, bottom: -30 }}
            />

            <Text style={styles.ctaTitle}>ÚNETE A LA ÉLITE</Text>
            <Text style={styles.ctaDesc}>
              El terreno está listo. Inscribe a tu equipo hoy mismo.
            </Text>

            <PressableCard style={styles.ctaBtn}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Text style={styles.ctaBtnText}>INICIAR REGISTRO</Text>
                <MaterialCommunityIcons name="chevron-double-right" size={20} color="#39FF14" />
              </View>
            </PressableCard>
          </View>
        </Animated.View>

        {/* ── 6. FOOTER PREMIUM ──────────────────────────────────────────── */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />

          <Text style={styles.footerLogo}>
            <Text style={{ color: "#39FF14" }}>ROCA</Text>
            <Text style={{ color: "#FFF" }}>SPORTS</Text>
          </Text>

          <View style={styles.footerLinks}>
            {["Nosotros", "Sedes", "Contacto", "Reglamentos"].map((link) => (
              <Pressable key={link}>
                <Text style={styles.footerLink}>{link}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.socialRow}>
            {(["instagram", "facebook", "youtube"] as const).map((net) => (
              <Pressable key={net} style={styles.socialBtn}>
                <MaterialCommunityIcons name={net} size={22} color="#39FF14" />
              </Pressable>
            ))}
          </View>

          <View style={styles.footerContactRow}>
            <MaterialCommunityIcons name="map-marker-radius" size={16} color="#39FF14" />
            <Text style={styles.footerContactText}>Durango, México</Text>
          </View>

          <Text style={styles.copy}>
            © 2026 ROCA SPORTS. TODOS LOS DERECHOS RESERVADOS.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const NEON = "#39FF14";
const BORDER = "#39FF1430";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020202" },

  // HEADER
  modernHeader: {
    position: "absolute",
    top: 0,
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 15,
    zIndex: 100,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuBtn: { padding: 5 },
  headerLogo: {
    fontFamily: "Inter_900Black",
    fontSize: 22,
    letterSpacing: 2,
  },
  registerBtnHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6, // Formas más cuadradas/rocosas
    shadowColor: NEON,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  registerBtnTextHeader: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 12,
    color: "#000",
    letterSpacing: 1,
  },

  // HERO
  heroSection: {
    width: "100%",
    height: height * 0.75,
    justifyContent: "flex-end",
    position: "relative",
  },
  heroBgImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  heroContent: { padding: 24, paddingBottom: 40 },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: NEON,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  heroBadgeText: {
    fontFamily: "Inter_900Black",
    fontSize: 11,
    color: "#000",
    letterSpacing: 1.5,
  },
  heroTitleMain: {
    fontFamily: "Inter_900Black",
    fontSize: 60,
    letterSpacing: -2,
    lineHeight: 60,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  heroSubtitle: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 22,
    color: "#FFF",
    marginBottom: 12,
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  heroDesc: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 30,
    maxWidth: "90%",
    lineHeight: 24,
  },
  heroButtons: { flexDirection: "row", gap: 14 },
  btnPrimary: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 4,
    alignItems: "center",
  },
  btnPrimaryText: {
    fontFamily: "Inter_900Black",
    fontSize: 15,
    color: "#000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // SECCIONES
  sectionContainer: { marginTop: 30 },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Inter_900Black",
    fontSize: 28,
    color: "#FFF",
    letterSpacing: -1,
    textTransform: "uppercase",
    borderLeftWidth: 4,
    borderLeftColor: NEON,
    paddingLeft: 12,
  },

  // VALORES (PILARES)
  valuesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    gap: 12,
    justifyContent: "space-between",
  },
  valueCardContainer: {
    width: (width - 44) / 2,
    marginBottom: 12,
  },
  valueCard: {
    padding: 20,
    borderRadius: 8, // Más cuadrado, simulando piedra
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#0A0A0A",
    overflow: "hidden",
    minHeight: 160,
  },
  cardTexture: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
    resizeMode: "cover",
  },
  iconContainer: {
    marginBottom: 16,
  },
  valueTitle: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 16,
    color: "#FFF",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  valueDesc: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    lineHeight: 18,
  },

  // LIGAS (DISCIPLINAS)
  leagueCard: {
    width: width * 0.7,
    height: 340,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(57,255,20,0.2)",
    backgroundColor: "#0A0A0A",
  },
  leagueImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  leagueContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 24,
  },
  leagueIconBadge: {
    width: 44,
    height: 44,
    backgroundColor: NEON,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    transform: [{ rotate: "-5deg" }], // Toque angular / agresivo
  },
  leagueName: {
    fontFamily: "Inter_900Black",
    fontSize: 32,
    color: "#FFF",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: -1,
  },
  leagueFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leagueSubtext: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    textTransform: "uppercase",
  },

  // SOBRE NOSOTROS (ADN ROCA)
  aboutSection: {
    padding: 28,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(57,255,20,0.15)",
    backgroundColor: "#0A0A0A",
    overflow: "hidden",
    position: "relative",
  },
  aboutThickBorder: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: NEON,
  },
  aboutText: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 24,
    marginBottom: 30,
    marginTop: 10,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
    columnGap: 12,
  },
  statItem: {
    width: "47%",
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
  },
  statNumber: {
    fontFamily: "Inter_900Black",
    fontSize: 34,
    color: NEON,
    letterSpacing: -1,
  },
  statLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 2,
  },

  // CTA FINAL
  ctaBox: {
    padding: 40,
    borderRadius: 12,
    alignItems: "flex-start",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: NEON,
  },
  ctaTitle: {
    fontFamily: "Inter_900Black",
    fontSize: 36,
    color: "#000",
    marginBottom: 8,
    letterSpacing: -1,
    lineHeight: 40,
  },
  ctaDesc: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "rgba(0,0,0,0.8)",
    marginBottom: 30,
  },
  ctaBtn: {
    backgroundColor: "#020202",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(57,255,20,0.3)",
  },
  ctaBtnText: {
    fontFamily: "Inter_900Black",
    fontSize: 15,
    color: NEON,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // FOOTER
  footer: {
    marginTop: 60,
    paddingHorizontal: 30,
    paddingTop: 0,
    alignItems: "center",
  },
  footerDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(57,255,20,0.2)",
    marginBottom: 40,
  },
  footerLogo: {
    fontFamily: "Inter_900Black",
    fontSize: 28,
    letterSpacing: 2,
    marginBottom: 30,
  },
  footerLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 24,
    marginBottom: 30,
  },
  footerLink: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  socialRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 30,
  },
  socialBtn: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: "rgba(57,255,20,0.05)",
    borderWidth: 1,
    borderColor: "rgba(57,255,20,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  footerContactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  footerContactText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 0.5,
  },
  copy: {
    fontFamily: "Inter_800ExtraBold",
    fontSize: 10,
    color: "rgba(255,255,255,0.2)",
    textAlign: "center",
    letterSpacing: 1,
  },
});