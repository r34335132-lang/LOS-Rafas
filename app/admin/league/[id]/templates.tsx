import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CardTemplateSelector } from "@/components/league/CardTemplateSelector";
import { PlayerCardPreview } from "@/components/league/PlayerCardPreview";
import {
  useCardTemplates,
  useLeague,
  usePlayersByLeague,
  useSaveDefaultCardTemplate,
} from "@/hooks/leagues/useLeagues";
import type { CardTemplate } from "@/lib/types";

export default function TemplateEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const leagueQuery = useLeague(id);
  const league = leagueQuery.data;
  const templatesQuery = useCardTemplates(league?.id);
  const playersQuery = usePlayersByLeague(league?.id);
  const saveDefault = useSaveDefaultCardTemplate(league?.id ?? "");
  const [selected, setSelected] = useState<CardTemplate | null>(null);
  const accent = league?.accent_color ?? "#39FF14";
  const player = playersQuery.data?.[0];
  const profile = useMemo(() => {
    if (!league || !player) return null;
    return {
      ...player,
      league,
      team: player.teams ? {
        id: player.teams.id,
        league_id: league.id,
        name: player.teams.name,
        logo_url: player.teams.logo_url,
        primary_color: player.teams.primary_color,
        secondary_color: player.teams.secondary_color,
        coach_name: null,
        created_at: league.created_at,
      } : null,
      stats: player.player_stats?.[0] ?? null,
    };
  }, [league, player]);
  const activeTemplate = selected ?? templatesQuery.data?.find((item) => item.is_default) ?? templatesQuery.data?.[0] ?? null;

  const save = async () => {
    if (!activeTemplate || !league) return;
    try {
      await saveDefault.mutateAsync(activeTemplate.id);
      Alert.alert("Plantilla guardada", `${activeTemplate.name} ahora es la plantilla default.`);
    } catch (error: any) {
      Alert.alert("No se pudo guardar", error.message ?? "Revisa permisos RLS.");
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <Feather name="arrow-left" size={20} color="#FFF" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.eyebrow, { color: accent }]}>EDITOR VISUAL</Text>
            <Text style={styles.title}>Plantillas de cartas</Text>
          </View>
        </View>

        {templatesQuery.data?.length ? (
          <CardTemplateSelector templates={templatesQuery.data} selectedId={activeTemplate?.id} accent={accent} onSelect={setSelected} />
        ) : (
          <Text style={styles.emptyText}>No hay plantillas. Al crear una liga nueva se generan plantillas default automáticamente.</Text>
        )}

        {profile ? (
          <PlayerCardPreview profile={profile} template={activeTemplate} />
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Sin jugador para preview</Text>
            <Text style={styles.emptyText}>Agrega un jugador real para previsualizar las tarjetas con datos de Supabase.</Text>
          </View>
        )}

        <View style={styles.optionsCard}>
          <Text style={styles.optionsTitle}>Editor básico</Text>
          <Text style={styles.option}>Logo: arriba izquierda / centro / derecha mediante layout_json.</Text>
          <Text style={styles.option}>Foto: circular, recorte vertical o tarjeta completa.</Text>
          <Text style={styles.option}>Fondo: gradiente, patrón deportivo o sólido premium.</Text>
        </View>

        <Pressable onPress={save} disabled={!activeTemplate || saveDefault.isPending} style={[styles.saveBtn, { backgroundColor: accent }]}>
          <Text style={styles.saveText}>{saveDefault.isPending ? "GUARDANDO..." : "GUARDAR COMO DEFAULT"}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#050505" },
  content: { paddingHorizontal: 20, paddingBottom: 44, gap: 18 },
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBtn: { width: 42, height: 42, borderRadius: 13, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.06)", alignItems: "center", justifyContent: "center" },
  eyebrow: { fontFamily: "Inter_800ExtraBold", fontSize: 8, letterSpacing: 1.5 },
  title: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 22 },
  empty: { borderRadius: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.04)", padding: 24 },
  emptyTitle: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 16, textAlign: "center" },
  emptyText: { color: "rgba(255,255,255,0.52)", fontFamily: "Inter_500Medium", fontSize: 12, lineHeight: 19, textAlign: "center" },
  optionsCard: { borderRadius: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", padding: 16, backgroundColor: "#0A0A0A", gap: 8 },
  optionsTitle: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 15 },
  option: { color: "rgba(255,255,255,0.52)", fontFamily: "Inter_600SemiBold", fontSize: 12, lineHeight: 18 },
  saveBtn: { borderRadius: 16, paddingVertical: 15, alignItems: "center" },
  saveText: { color: "#050505", fontFamily: "Inter_900Black", fontSize: 12, letterSpacing: 1 },
});
