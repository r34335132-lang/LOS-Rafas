import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";

import { PlayerCardPreview } from "@/components/league/PlayerCardPreview";
import { PlayerCredentialCard } from "@/components/league/PlayerCredentialCard";
import { useCardTemplates, usePlayerProfile } from "@/hooks/leagues/useLeagues";

const FALLBACK_ACCENT = "#39FF14";

export default function PlayerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const cardRef = useRef<View>(null);
  const [sharing, setSharing] = useState(false);
  const profileQuery = usePlayerProfile(id);
  const profile = profileQuery.data;
  const templatesQuery = useCardTemplates(profile?.league_id);
  const template = templatesQuery.data?.find((item) => item.is_default) ?? templatesQuery.data?.[0] ?? null;
  const accent = profile?.league.accent_color ?? FALLBACK_ACCENT;

  const flipValue = useSharedValue(0);
  const flipCard = () => {
    flipValue.value = withSpring(flipValue.value === 0 ? 180 : 0, {
      damping: 16,
      stiffness: 110,
    });
  };

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1200 }, { rotateY: `${flipValue.value}deg` }],
    backfaceVisibility: "hidden",
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1200 }, { rotateY: `${flipValue.value + 180}deg` }],
    backfaceVisibility: "hidden",
  }));

  const shareCredential = async () => {
    if (!profile) return;
    setSharing(true);
    try {
      if (cardRef.current) {
        const uri = await captureRef(cardRef.current, { format: "png", quality: 1 });
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
          return;
        }
      }
      await Share.share({
        message: `${profile.full_name} · ${profile.credential_code}`,
      });
    } finally {
      setSharing(false);
    }
  };

  if (profileQuery.isLoading) {
    return <StateScreen accent={accent} title="Cargando jugador" text="Consultando perfil en Supabase..." />;
  }

  if (profileQuery.isError || !profile) {
    return (
      <StateScreen
        accent={accent}
        title="Jugador no encontrado"
        text="El perfil no existe o las políticas RLS no permiten leerlo."
        action="REGRESAR"
        onAction={() => router.back()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[`${accent}22`, "#050505", "#050505"]}
        locations={[0, 0.34, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Regresar" onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={20} color="#FFF" />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={[styles.headerEyebrow, { color: accent }]}>PERFIL DE JUGADOR</Text>
          <Text style={styles.headerTitle}>CREDENCIAL OFICIAL</Text>
        </View>
        <MaterialCommunityIcons name="soccer" size={30} color={accent} />
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.playerIntro}>
          <View style={[styles.statusBadge, { borderColor: `${accent}44`, backgroundColor: `${accent}12` }]}>
            <View style={[styles.statusDot, { backgroundColor: accent }]} />
            <Text style={[styles.statusText, { color: accent }]}>{profile.status.toUpperCase()}</Text>
          </View>
          <Text style={styles.playerName}>{profile.full_name}</Text>
          <Text style={styles.playerMeta}>
            #{profile.number} · {profile.position.toUpperCase()} · {(profile.team?.name ?? "SIN EQUIPO").toUpperCase()}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(150).duration(500)} style={styles.cardArea}>
          <View style={styles.lanyard}>
            <View style={styles.lanyardSlot} />
          </View>

          <Pressable accessibilityRole="button" accessibilityLabel="Voltear credencial" onPress={flipCard} style={styles.cardPressable}>
            <Animated.View ref={cardRef} style={[styles.flipFace, frontStyle]}>
              <PlayerCredentialCard profile={profile} />
            </Animated.View>
            <Animated.View style={[styles.flipFace, styles.backFace, backStyle]}>
              <PlayerCardPreview profile={profile} template={template} />
            </Animated.View>
          </Pressable>
        </Animated.View>

        <View style={styles.actions}>
          <Pressable onPress={shareCredential} disabled={sharing} style={[styles.primaryAction, { backgroundColor: accent }]}>
            {sharing ? <ActivityIndicator color="#050505" /> : <Feather name="share-2" size={16} color="#050505" />}
            <Text style={styles.primaryActionText}>{sharing ? "PREPARANDO..." : "COMPARTIR / GUARDAR IMAGEN"}</Text>
          </Pressable>
        </View>

        <Animated.View entering={FadeInDown.delay(250).duration(500)} style={styles.hint}>
          <MaterialCommunityIcons name="gesture-tap" size={18} color={accent} />
          <Text style={styles.hintText}>Toca la credencial para alternar entre credencial y tarjeta premium</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function StateScreen({
  accent,
  title,
  text,
  action,
  onAction,
}: {
  accent: string;
  title: string;
  text: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.stateScreen}>
      <MaterialCommunityIcons name="card-account-details-star-outline" size={54} color={accent} />
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateText}>{text}</Text>
      {action ? (
        <Pressable onPress={onAction} style={[styles.stateButton, { backgroundColor: accent }]}>
          <Text style={styles.stateButtonText}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505" },
  stateScreen: { flex: 1, backgroundColor: "#050505", alignItems: "center", justifyContent: "center", padding: 24 },
  stateTitle: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 22, textAlign: "center", marginTop: 16 },
  stateText: { color: "rgba(255,255,255,0.5)", fontFamily: "Inter_500Medium", fontSize: 13, textAlign: "center", lineHeight: 20, marginTop: 8 },
  stateButton: { borderRadius: 14, paddingHorizontal: 18, paddingVertical: 12, marginTop: 18 },
  stateButtonText: { color: "#050505", fontFamily: "Inter_900Black", fontSize: 11, letterSpacing: 1 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 14, gap: 12 },
  backButton: { width: 42, height: 42, borderRadius: 13, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" },
  headerCopy: { flex: 1 },
  headerEyebrow: { fontFamily: "Inter_800ExtraBold", fontSize: 8, letterSpacing: 1.6 },
  headerTitle: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 17, letterSpacing: 0.4, marginTop: 2 },
  scrollContent: { paddingHorizontal: 20 },
  playerIntro: { alignItems: "center", paddingTop: 12, paddingBottom: 22 },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontFamily: "Inter_800ExtraBold", fontSize: 8, letterSpacing: 1.2 },
  playerName: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 33, letterSpacing: -1.3, marginTop: 10, textAlign: "center" },
  playerMeta: { color: "rgba(255,255,255,0.45)", fontFamily: "Inter_700Bold", fontSize: 9, letterSpacing: 1, marginTop: 5, textAlign: "center" },
  cardArea: { width: "100%", maxWidth: 570, alignSelf: "center", alignItems: "center" },
  lanyard: { width: 66, height: 20, borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: "#1A1A1A", borderWidth: 1, borderBottomWidth: 0, borderColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center", zIndex: 2 },
  lanyardSlot: { width: 33, height: 6, borderRadius: 5, backgroundColor: "#050505" },
  cardPressable: { width: "100%", minHeight: 545, position: "relative" },
  flipFace: { width: "100%" },
  backFace: { position: "absolute", top: 0, left: 0 },
  actions: { maxWidth: 570, width: "100%", alignSelf: "center", marginTop: 18 },
  primaryAction: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 16, paddingVertical: 15 },
  primaryActionText: { color: "#050505", fontFamily: "Inter_900Black", fontSize: 11, letterSpacing: 1 },
  hint: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 18, padding: 12 },
  hintText: { color: "rgba(255,255,255,0.45)", fontFamily: "Inter_600SemiBold", fontSize: 10, textAlign: "center" },
});
