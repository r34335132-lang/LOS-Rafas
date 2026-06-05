import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const ROCK_TEXTURE = "https://images.unsplash.com/photo-1525914813433-886dc8183afa?q=80&w=1000&auto=format&fit=crop";

const SPORTS = [
  { id: "soccer", name: "Fútbol", icon: "soccer" },
  { id: "basketball", name: "Básquet", icon: "basketball" },
  { id: "volleyball", name: "Vóley", icon: "volleyball" },
  { id: "flag", name: "Flag Football", icon: "football" },
  { id: "padel", name: "Pádel", icon: "tennis" },
];

const STATS_OPTIONS = [
  "Puntos / Goles",
  "Asistencias",
  "Tarjetas / Faltas",
  "MVP del Partido",
  "Rebotes / Intercepciones",
  "Estadísticas Defensivas"
];

const BRAND_COLORS = ["#39FF14", "#FF0000", "#0057FF", "#FFD600", "#FF00FF", "#FFFFFF"];

// --- Componente de línea neón ---
function NeonLine({ style }: { style?: any }) {
  return (
    <View
      style={[
        {
          height: 2,
          backgroundColor: "#39FF14",
          shadowColor: "#39FF14",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 8,
          elevation: 5,
        },
        style,
      ]}
    />
  );
}

export default function CreateLeagueScreen() {
  const insets = useSafeAreaInsets();
  const [selectedSport, setSelectedSport] = useState("soccer");
  const [selectedStats, setSelectedStats] = useState<string[]>(["Puntos / Goles"]);
  const [selectedColor, setSelectedColor] = useState("#39FF14");

  const toggleStat = (stat: string) => {
    if (selectedStats.includes(stat)) {
      setSelectedStats(selectedStats.filter(s => s !== stat));
    } else {
      setSelectedStats([...selectedStats, stat]);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: "#020202" }} 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* ── HEADER FIJO ────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <LinearGradient
          colors={["rgba(2,2,2,0.95)", "rgba(2,2,2,0)"]}
          style={StyleSheet.absoluteFillObject}
        />
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </Pressable>
        <View style={{ alignItems: "center", flex: 1, marginRight: 40 }}>
          <Text style={styles.headerTitle}>REGISTRAR LIGA</Text>
          <NeonLine style={{ width: 40, marginTop: 4 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* TEXTURA DE FONDO GLOBAL */}
        <Image source={{ uri: ROCK_TEXTURE }} style={styles.globalTexture} />
        
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.pageSubtitle}>Forja tu imperio deportivo. Configura las reglas, la imagen y el presupuesto.</Text>
        </Animated.View>

        {/* ── SECCIÓN 1: IDENTIDAD ──────────────────────────────── */}
        <Animated.View entering={FadeInUp.duration(600).delay(100)} style={styles.section}>
          <Text style={styles.sectionTitle}>1. IDENTIDAD VISUAL</Text>
          
          <View style={styles.card}>
            {/* Foto de Logo */}
            <View style={styles.logoUploadContainer}>
              <Pressable style={styles.logoUploadBtn}>
                <MaterialCommunityIcons name="camera-plus" size={32} color="rgba(255,255,255,0.4)" />
                <Text style={styles.logoUploadText}>Subir Escudo / Logo</Text>
              </Pressable>
            </View>

            {/* Nombre */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>NOMBRE DE LA LIGA</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ej. Liga Premier..." 
                placeholderTextColor="rgba(255,255,255,0.3)"
              />
            </View>

            {/* Colores */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>COLOR PRINCIPAL</Text>
              <View style={styles.colorRow}>
                {BRAND_COLORS.map(color => (
                  <Pressable 
                    key={color} 
                    onPress={() => setSelectedColor(color)}
                    style={[
                      styles.colorCircle, 
                      { backgroundColor: color },
                      selectedColor === color && styles.colorCircleSelected
                    ]} 
                  />
                ))}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ── SECCIÓN 2: DISCIPLINA Y REGLAS ────────────────────── */}
        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>2. DISCIPLINA Y REGLAS</Text>
          
          <View style={styles.card}>
            <Text style={styles.inputLabel}>DEPORTE / CATEGORÍA</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 10 }}>
              {SPORTS.map(sport => {
                const isSelected = selectedSport === sport.id;
                return (
                  <Pressable 
                    key={sport.id} 
                    onPress={() => setSelectedSport(sport.id)}
                    style={[styles.sportPill, isSelected && styles.sportPillSelected]}
                  >
                    <MaterialCommunityIcons 
                      name={sport.icon as any} 
                      size={20} 
                      color={isSelected ? "#000" : "#FFF"} 
                    />
                    <Text style={[styles.sportPillText, isSelected && styles.sportPillTextSelected]}>
                      {sport.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={{ height: 20 }} />

            <Text style={styles.inputLabel}>ESTADÍSTICAS A RASTREAR</Text>
            <View style={styles.statsGrid}>
              {STATS_OPTIONS.map(stat => {
                const isSelected = selectedStats.includes(stat);
                return (
                  <Pressable 
                    key={stat} 
                    onPress={() => toggleStat(stat)}
                    style={[styles.statBox, isSelected && styles.statBoxSelected]}
                  >
                    <MaterialCommunityIcons 
                      name={isSelected ? "check-box-outline" : "checkbox-blank-outline"} 
                      size={20} 
                      color={isSelected ? "#39FF14" : "rgba(255,255,255,0.4)"} 
                    />
                    <Text style={[styles.statText, isSelected && styles.statTextSelected]}>
                      {stat}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Animated.View>

        {/* ── SECCIÓN 3: FINANZAS ───────────────────────────────── */}
        <Animated.View entering={FadeInUp.duration(600).delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>3. CONFIGURACIÓN FINANCIERA</Text>
          
          <View style={styles.card}>
            <View style={styles.financeRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.inputLabel}>PRESUPUESTO APP</Text>
                <View style={styles.moneyInputContainer}>
                  <Text style={styles.moneyPrefix}>$</Text>
                  <TextInput 
                    style={styles.moneyInput} 
                    placeholder="0.00" 
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    keyboardType="numeric"
                  />
                </View>
                <Text style={styles.helpText}>Destinado al sistema</Text>
              </View>

              <View style={styles.financeDivider} />

              <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={styles.inputLabel}>COBRO JUGADOR</Text>
                <View style={styles.moneyInputContainer}>
                  <Text style={styles.moneyPrefix}>$</Text>
                  <TextInput 
                    style={styles.moneyInput} 
                    placeholder="0.00" 
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    keyboardType="numeric"
                  />
                </View>
                <Text style={styles.helpText}>Inscripción/Arbitraje</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ── BOTÓN FINAL ───────────────────────────────────────── */}
        <Animated.View entering={FadeInUp.duration(600).delay(400)} style={styles.submitSection}>
          <Pressable style={styles.submitBtn}>
            <LinearGradient
              colors={["#0D3B03", "#39FF14", "#0D3B03"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[StyleSheet.absoluteFillObject, { opacity: 0.9 }]}
            />
            <Text style={styles.submitBtnText}>INICIALIZAR LIGA</Text>
            <MaterialCommunityIcons name="lightning-bolt" size={20} color="#000" />
          </Pressable>
        </Animated.View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
    zIndex: 10,
    position: "absolute",
    top: 0,
    width: "100%"
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Inter_900Black",
    fontSize: 18,
    color: "#FFF",
    letterSpacing: 2,
  },
  scrollContent: {
    paddingTop: 100, // Espacio para el header
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  globalTexture: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
    resizeMode: "cover",
  },
  pageSubtitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    lineHeight: 22,
    marginBottom: 30,
    textAlign: "center",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontFamily: "Inter_900Black",
    fontSize: 16,
    color: "#39FF14",
    marginBottom: 10,
    letterSpacing: 1,
    borderLeftWidth: 3,
    borderLeftColor: "#39FF14",
    paddingLeft: 10,
  },
  card: {
    backgroundColor: "#0A0A0A",
    borderWidth: 1,
    borderColor: "rgba(57,255,20,0.2)",
    borderRadius: 8,
    padding: 20,
  },
  
  // Inputs
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#FFF",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  
  // Logo Upload
  logoUploadContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  logoUploadBtn: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(57,255,20,0.4)",
    backgroundColor: "rgba(57,255,20,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoUploadText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: "rgba(255,255,255,0.5)",
    marginTop: 8,
    textAlign: "center",
    width: "70%",
  },

  // Color Picker
  colorRow: {
    flexDirection: "row",
    gap: 15,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorCircleSelected: {
    borderColor: "#FFF",
    transform: [{ scale: 1.15 }],
  },

  // Sports Selector
  sportPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
  },
  sportPillSelected: {
    backgroundColor: "#39FF14",
    borderColor: "#39FF14",
  },
  sportPillText: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: "#FFF",
  },
  sportPillTextSelected: {
    color: "#000",
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  statBoxSelected: {
    backgroundColor: "rgba(57,255,20,0.05)",
    borderColor: "rgba(57,255,20,0.3)",
  },
  statText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    flex: 1,
  },
  statTextSelected: {
    color: "#39FF14",
    fontFamily: "Inter_700Bold",
  },

  // Finances
  financeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  financeDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 5,
  },
  moneyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  moneyPrefix: {
    fontFamily: "Inter_900Black",
    fontSize: 18,
    color: "#39FF14",
    marginRight: 5,
  },
  moneyInput: {
    flex: 1,
    color: "#FFF",
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    paddingVertical: 12,
  },
  helpText: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
    marginTop: 6,
  },

  // Submit Button
  submitSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#39FF14",
    overflow: "hidden",
  },
  submitBtnText: {
    fontFamily: "Inter_900Black",
    fontSize: 16,
    color: "#000",
    letterSpacing: 2,
    zIndex: 1,
  }
});