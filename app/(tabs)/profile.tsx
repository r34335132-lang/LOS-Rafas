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
  Image
} from "react-native";
import Animated, { 
  FadeIn, 
  FadeInDown, 
  LinearTransition, 
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { NewsCard } from "@/components/NewsCard";
import { TeamBadge } from "@/components/TeamBadge";
import { NEWS, TEAMS } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");

// Imagen random de un atleta/usuario para el perfil
const RANDOM_USER_IMG = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=400";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    isAuthenticated,
    username,
    email,
    favoriteTeams,
    savedNews,
    signOut,
    toggleSavedNews,
    isSavedNews,
    toggleFavoriteTeam,
  } = useApp();

  const favTeams = TEAMS.filter((t) => favoriteTeams.includes(t.id));
  const saved = NEWS.filter((n) => savedNews.includes(n.id));

  // Color principal para la credencial
  const userAccent = colors.primary;

  // ─── LÓGICA DE ANIMACIÓN 3D (FLIP) ──────────────────────────────────────────
  const flipValue = useSharedValue(0);

  const handleFlip = () => {
    flipValue.value = withSpring(flipValue.value === 0 ? 180 : 0, {
      damping: 15,
      stiffness: 100,
    });
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${flipValue.value}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${flipValue.value + 180}deg` }],
      backfaceVisibility: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: '#050505' }]}>
      
      {/* GLOW AMBIENTAL DEL PERFIL */}
      <Animated.View style={styles.ambientGlow} entering={FadeIn.duration(500)}>
        <LinearGradient
          colors={[`${userAccent}20`, 'transparent']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. HEADER DEL PORTAL */}
        <View style={[styles.modernHeader, { paddingTop: insets.top + 10 }]}>
          <Text style={styles.telemetryText}>// LIGA OFICIAL · PORTAL WEB</Text>
          <Text style={styles.massiveTitle}>
            MI<Text style={{ color: userAccent }}>PERFIL.</Text>
          </Text>
        </View>

        {/* 2. CREDENCIAL DE TORNEO (GAFETE DEPORTIVO INTERACTIVO) */}
        <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.credentialContainer}>
          
          <Pressable onPress={handleFlip} style={styles.credentialWrapper}>
            
            {/* El "Hoyo" para colgar la credencial (Efecto físico) */}
            <View style={styles.lanyardHoleBase}>
              <View style={styles.lanyardHole} />
            </View>

            {/* ─── CARA FRONTAL DE LA CREDENCIAL ─── */}
            <Animated.View style={[styles.credentialCard, { borderColor: `${userAccent}50` }, frontAnimatedStyle]}>
              <LinearGradient colors={['#1A1A1A', '#0A0A0A']} style={StyleSheet.absoluteFillObject} />
              <Text style={styles.watermarkBg} numberOfLines={1}>ROCA</Text>
              <Ionicons name="finger-print" size={140} color="rgba(255,255,255,0.03)" style={styles.fingerprintBg} />

              <View style={[styles.credHeader, { backgroundColor: userAccent }]}>
                <Text style={styles.credHeaderText}>CREDENCIAL OFICIAL</Text>
                <Text style={styles.credHeaderYear}>2026</Text>
              </View>

              <View style={styles.credBody}>
                <View style={styles.photoContainer}>
                  {isAuthenticated ? (
                    <Image source={{ uri: RANDOM_USER_IMG }} style={styles.profilePhoto} />
                  ) : (
                    <View style={styles.placeholderPhoto}>
                      <Ionicons name="person" size={40} color="#333" />
                    </View>
                  )}
                  <View style={[styles.roleTag, { backgroundColor: isAuthenticated ? '#E10600' : '#555' }]}>
                    <Text style={styles.roleTagText}>
                      {isAuthenticated ? "JUGADOR" : "INVITADO"}
                    </Text>
                  </View>
                </View>

                <View style={styles.credInfo}>
                  <Text style={styles.infoLabel}>NOMBRE / NAME</Text>
                  <Text style={styles.infoName} numberOfLines={2}>
                    {isAuthenticated ? username : "AGENTE DESCONOCIDO"}
                  </Text>
                  
                  <Text style={[styles.infoLabel, { marginTop: 8 }]}>ID ASOCIACIÓN</Text>
                  <Text style={styles.infoId}>
                    {isAuthenticated ? "RCA-8492-X7" : "NO REGISTRADO"}
                  </Text>

                  <Text style={[styles.infoLabel, { marginTop: 8 }]}>NIVEL DE ACCESO</Text>
                  <View style={styles.accessLevelRow}>
                    <Text style={[styles.accessLevel, { color: isAuthenticated ? '#00C853' : '#FF9800' }]}>
                      {isAuthenticated ? "ALL ACCESS" : "RESTRINGIDO"}
                    </Text>
                    {isAuthenticated && <Feather name="check-circle" size={14} color="#00C853" />}
                  </View>
                </View>
              </View>

              <View style={styles.credFooter}>
                <View>
                  <Text style={styles.footerLabel}>TOCA PARA VOLTEAR</Text>
                  <Text style={styles.footerCode}>{email || "Esperando conexión..."}</Text>
                </View>
                <Ionicons name="qr-code" size={42} color="#FFF" style={{ opacity: 0.8 }} />
              </View>
            </Animated.View>

            {/* ─── CARA TRASERA DE LA CREDENCIAL (ESTADÍSTICAS) ─── */}
            <Animated.View style={[styles.credentialCard, { borderColor: `${userAccent}50` }, backAnimatedStyle]}>
              <LinearGradient colors={['#0F0F0F', '#050505']} style={StyleSheet.absoluteFillObject} />
              
              <View style={[styles.credHeader, { backgroundColor: '#333' }]}>
                <Text style={[styles.credHeaderText, { color: '#FFF' }]}>TELEMETRÍA DEL JUGADOR</Text>
                <MaterialCommunityIcons name="rotate-3d-variant" size={16} color="#FFF" />
              </View>

              <View style={styles.backBody}>
                {isAuthenticated ? (
                  <>
                    <View style={styles.backStatsGrid}>
                      <View style={styles.backStatItem}>
                        <Text style={[styles.backStatValue, { color: userAccent }]}>42</Text>
                        <Text style={styles.backStatLabel}>PARTIDOS</Text>
                      </View>
                      <View style={styles.backStatItem}>
                        <Text style={[styles.backStatValue, { color: userAccent }]}>18</Text>
                        <Text style={styles.backStatLabel}>ANOTACIONES</Text>
                      </View>
                      <View style={styles.backStatItem}>
                        <Text style={[styles.backStatValue, { color: userAccent }]}>7</Text>
                        <Text style={styles.backStatLabel}>ASISTENCIAS</Text>
                      </View>
                      <View style={styles.backStatItem}>
                        <Text style={[styles.backStatValue, { color: userAccent }]}>3</Text>
                        <Text style={styles.backStatLabel}>MVP</Text>
                      </View>
                    </View>
                    
                    <View style={styles.barcodeContainer}>
                      {/* Simulación de código de barras */}
                      {[...Array(25)].map((_, i) => (
                        <View key={i} style={[styles.barcodeLine, { width: Math.random() * 4 + 1 }]} />
                      ))}
                    </View>
                    <Text style={styles.barcodeText}>JUGADOR CONFIRMADO - ACTIVO</Text>
                  </>
                ) : (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Feather name="lock" size={40} color="#555" style={{ marginBottom: 10 }} />
                    <Text style={[styles.infoLabel, { textAlign: 'center' }]}>INICIA SESIÓN PARA VER ESTADÍSTICAS</Text>
                  </View>
                )}
              </View>
            </Animated.View>

          </Pressable>

          {/* Botón CTA Integrado abajo de la credencial */}
          <Pressable
            onPress={() => (isAuthenticated ? signOut() : router.push("/auth"))}
            style={({ pressed }) => [
              styles.ctaBtn,
              {
                backgroundColor: isAuthenticated ? 'rgba(255,255,255,0.05)' : userAccent,
                borderColor: isAuthenticated ? 'rgba(255,255,255,0.1)' : userAccent,
                transform: [{ scale: pressed ? 0.96 : 1 }],
              },
            ]}
          >
            <Feather
              name={isAuthenticated ? "log-out" : "log-in"}
              size={16}
              color={isAuthenticated ? '#FFF' : '#000'}
            />
            <Text style={[styles.ctaText, { color: isAuthenticated ? '#FFF' : '#000' }]}>
              {isAuthenticated ? "REVOCAR ACCESO (CERRAR SESIÓN)" : "SOLICITAR GAFETE (INICIAR SESIÓN)"}
            </Text>
          </Pressable>
        </Animated.View>

        {/* 3. PANEL DE ESTADÍSTICAS GENERALES */}
        <Animated.View entering={FadeInDown.duration(600).delay(150).springify()} style={styles.statsPanel}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: userAccent }]}>{favTeams.length}</Text>
            <Text style={styles.statLabel}>ESCUADRONES</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: userAccent }]}>{saved.length}</Text>
            <Text style={styles.statLabel}>NOTICIAS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: userAccent }]}>0</Text>
            <Text style={styles.statLabel}>SANCIONES</Text>
          </View>
        </Animated.View>

        {/* 4. EQUIPOS FAVORITOS */}
        <View style={styles.section}>
          <SectionTitle title="MIS CLUBES" accent={userAccent} icon="shield" />
          
          {favTeams.length === 0 ? (
            <Animated.View entering={ZoomIn.springify()} style={styles.empty}>
              <View style={styles.radarContainer}>
                <View style={[styles.radarCircle, { borderColor: `${userAccent}30` }]} />
                <Feather name="shield-off" size={32} color={userAccent} style={{ opacity: 0.8 }} />
              </View>
              <Text style={styles.emptyTitle}>AGENTE LIBRE</Text>
              <Text style={styles.emptyText}>No perteneces ni sigues a ningún club actualmente.</Text>
            </Animated.View>
          ) : (
            <Animated.View layout={LinearTransition.springify()}>
              {favTeams.map((team, index) => (
                <Animated.View key={team.id} entering={FadeInDown.delay(index * 100).springify()}>
                  <Pressable
                    onPress={() => router.push(`/team/${team.id}`)}
                    style={({ pressed }) => [
                      styles.teamRow,
                      pressed && { backgroundColor: 'rgba(255,255,255,0.05)' }
                    ]}
                  >
                    <View style={[styles.teamAccentLine, { backgroundColor: team.colorHex }]} />
                    <TeamBadge short={team.short} color={team.colorHex} size={42} />
                    
                    <View style={{ flex: 1, marginLeft: 14 }}>
                      <Text style={styles.teamName}>{team.name}</Text>
                      <Text style={styles.teamMeta}>
                        SEDE: {team.city.toUpperCase()}  |  PTS: {team.wins * 3}
                      </Text>
                    </View>

                    <Pressable hitSlop={15} onPress={() => toggleFavoriteTeam(team.id)} style={styles.untrackBtn}>
                      <Feather name="x" size={16} color="rgba(255,255,255,0.4)" />
                    </Pressable>
                  </Pressable>
                </Animated.View>
              ))}
            </Animated.View>
          )}
        </View>

        {/* 5. NOTICIAS GUARDADAS */}
        <View style={styles.section}>
          <SectionTitle title="RECORTES DE PRENSA" accent={userAccent} icon="bookmark" />
          
          {saved.length === 0 ? (
            <Animated.View entering={ZoomIn.springify()} style={styles.empty}>
              <View style={styles.radarContainer}>
                <View style={[styles.radarCircle, { borderColor: `${userAccent}30` }]} />
                <Feather name="file-minus" size={32} color={userAccent} style={{ opacity: 0.8 }} />
              </View>
              <Text style={styles.emptyTitle}>SIN RECORTES</Text>
              <Text style={styles.emptyText}>Guarda las noticias importantes de la liga para leerlas después.</Text>
            </Animated.View>
          ) : (
            <Animated.View layout={LinearTransition.springify()} style={{ gap: 16 }}>
              {saved.map((item, index) => (
                <Animated.View key={item.id} entering={FadeInDown.delay(index * 100).springify()}>
                  <NewsCard
                    item={item}
                    saved={isSavedNews(item.id)}
                    onToggleSave={() => toggleSavedNews(item.id)}
                  />
                </Animated.View>
              ))}
            </Animated.View>
          )}
        </View>

        {/* FOOTER SYSTEM */}
        <View style={styles.footer}>
          <Text style={styles.footerLine}>LICENCIA DEPORTIVA OFICIAL</Text>
          <Text style={styles.footerLine}>ROCA SPORTS V1.0</Text>
        </View>

      </ScrollView>
    </View>
  );
}

// Subcomponente estético para títulos de sección
const SectionTitle = ({ title, accent, icon }: { title: string, accent: string, icon: any }) => (
  <View style={styles.sectionTitleWrap}>
    <Feather name={icon} size={16} color={accent} style={{ marginRight: 8 }} />
    <Text style={styles.sectionTitleText}>{title}</Text>
    <View style={[styles.titleLine, { backgroundColor: accent }]} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  ambientGlow: { position: 'absolute', top: 0, width: '100%', height: 300, zIndex: 0 },
  
  modernHeader: { paddingHorizontal: 20, paddingBottom: 10, zIndex: 2 },
  telemetryText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, marginBottom: 5 },
  massiveTitle: { fontFamily: 'Inter_900Black', fontSize: 52, lineHeight: 52, letterSpacing: -2, color: '#FFF' },

  // --- DISEÑO DE LA CREDENCIAL DEPORTIVA ---
  credentialContainer: { paddingHorizontal: 20, marginBottom: 20, zIndex: 3, alignItems: 'center' },
  credentialWrapper: { width: '100%', alignItems: 'center', position: 'relative' },
  
  lanyardHoleBase: { 
    width: 60, height: 20, 
    backgroundColor: '#1A1A1A', 
    borderTopLeftRadius: 10, borderTopRightRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: -2, zIndex: 2,
    borderWidth: 1, borderBottomWidth: 0, borderColor: 'rgba(255,255,255,0.2)'
  },
  lanyardHole: { width: 30, height: 6, backgroundColor: '#000', borderRadius: 10 },

  credentialCard: {
    width: '100%',
    backgroundColor: '#111',
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.8, shadowRadius: 20, elevation: 15,
  },
  watermarkBg: { position: 'absolute', top: 60, left: -20, fontFamily: 'Inter_900Black', fontSize: 90, color: 'rgba(255,255,255,0.02)', transform: [{ rotate: '-10deg' }] },
  fingerprintBg: { position: 'absolute', right: -20, top: 40 },

  credHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8 },
  credHeaderText: { fontFamily: 'Inter_900Black', fontSize: 11, color: '#000', letterSpacing: 2 },
  credHeaderYear: { fontFamily: 'Inter_900Black', fontSize: 11, color: '#000', letterSpacing: 1 },

  // Frente
  credBody: { flexDirection: 'row', padding: 16, gap: 16 },
  photoContainer: { width: 90, height: 120, borderRadius: 8, borderWidth: 3, borderColor: '#FFF', position: 'relative', backgroundColor: '#222' },
  profilePhoto: { width: '100%', height: '100%', borderRadius: 4 },
  placeholderPhoto: { width: '100%', height: '100%', borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  roleTag: { position: 'absolute', bottom: -10, left: -5, right: -5, paddingVertical: 4, borderRadius: 4, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 4, shadowOffset: { width:0, height: 2 } },
  roleTagText: { fontFamily: 'Inter_900Black', fontSize: 9, color: '#FFF', letterSpacing: 1 },

  credInfo: { flex: 1, justifyContent: 'center' },
  infoLabel: { fontFamily: 'Inter_700Bold', fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 },
  infoName: { fontFamily: 'Inter_900Black', fontSize: 22, color: '#FFF', lineHeight: 24, textTransform: 'uppercase' },
  infoId: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#FFF', letterSpacing: 2 },
  accessLevelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  accessLevel: { fontFamily: 'Inter_900Black', fontSize: 13, letterSpacing: 1 },

  credFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.2)' },
  footerLabel: { fontFamily: 'Inter_700Bold', fontSize: 8, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 2 },
  footerCode: { fontFamily: 'Inter_500Medium', fontSize: 11, color: '#FFF' },

  // Reverso de la Tarjeta
  backBody: { flex: 1, padding: 20, justifyContent: 'center' },
  backStatsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, marginBottom: 20 },
  backStatItem: { width: '47%', backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  backStatValue: { fontFamily: 'Inter_900Black', fontSize: 28, marginBottom: 4 },
  backStatLabel: { fontFamily: 'Inter_800ExtraBold', fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 },
  barcodeContainer: { flexDirection: 'row', height: 40, alignItems: 'center', justifyContent: 'space-between', opacity: 0.6, marginBottom: 8 },
  barcodeLine: { height: '100%', backgroundColor: '#FFF' },
  barcodeText: { fontFamily: 'Inter_600SemiBold', fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, textAlign: 'center' },

  // CTA Button
  ctaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14, borderRadius: 16, borderWidth: 1, marginTop: 20, width: '100%' },
  ctaText: { fontFamily: 'Inter_900Black', fontSize: 11, letterSpacing: 1 },

  // ESTADÍSTICAS
  statsPanel: { flexDirection: 'row', backgroundColor: '#111', borderRadius: 16, padding: 16, marginHorizontal: 20, marginBottom: 40, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statBox: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontFamily: 'Inter_900Black', fontSize: 22, textShadowColor: 'rgba(255,255,255,0.2)', textShadowRadius: 10 },
  statLabel: { fontFamily: 'Inter_800ExtraBold', fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)' },

  // SECCIONES
  section: { paddingHorizontal: 20, marginBottom: 40 },
  sectionTitleWrap: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  sectionTitleText: { fontFamily: 'Inter_900Black', fontSize: 14, color: '#FFF', letterSpacing: 2 },
  titleLine: { flex: 1, height: 1, opacity: 0.3, marginLeft: 12 },

  // EQUIPOS (Squadrons)
  teamRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    padding: 12, paddingRight: 16,
    marginBottom: 12,
    position: 'relative', overflow: 'hidden'
  },
  teamAccentLine: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  teamName: { fontFamily: 'Inter_900Black', fontSize: 16, color: '#FFF', letterSpacing: -0.5, textTransform: 'uppercase' },
  teamMeta: { fontFamily: 'Inter_600SemiBold', fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginTop: 4 },
  untrackBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20 },

  // EMPTY STATES
  empty: { paddingVertical: 40, alignItems: "center", justifyContent: "center" },
  radarContainer: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center', marginBottom: 16, position: 'relative' },
  radarCircle: { position: 'absolute', width: 80, height: 80, borderRadius: 40, borderWidth: 1, borderStyle: 'dashed' },
  emptyTitle: { fontFamily: "Inter_900Black", fontSize: 14, color: '#FFF', letterSpacing: 2, marginBottom: 8 },
  emptyText: { fontFamily: "Inter_500Medium", fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: "center", paddingHorizontal: 40 },

  // FOOTER
  footer: { alignItems: 'center', marginTop: 10, marginBottom: 40, gap: 4 },
  footerLine: { fontFamily: 'Inter_600SemiBold', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 2 },
});