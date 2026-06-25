import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LeagueBrandPreview } from "@/components/league/LeagueBrandPreview";
import { PlayerCardPreview } from "@/components/league/PlayerCardPreview";
import { useCreateLeague } from "@/hooks/leagues/useLeagues";
import { uploadImageToSupabase } from "@/lib/services/storage";
import type { LeagueInput } from "@/lib/validators";
import { leagueInputSchema } from "@/lib/validators";
import type { League, PlayerProfile } from "@/lib/types";

const SPORTS = [
  { id: "soccer", name: "Fútbol", icon: "soccer" },
  { id: "flag", name: "Flag Football", icon: "football" },
  { id: "basketball", name: "Básquet", icon: "basketball" },
  { id: "baseball", name: "Béisbol", icon: "baseball" },
  { id: "volleyball", name: "Voleibol", icon: "volleyball" },
  { id: "other", name: "Otro", icon: "trophy-outline" },
] as const;

const CATEGORIES = ["varonil", "femenil", "mixto", "infantil", "juvenil", "libre"] as const;
const STYLES = [
  { id: "modern", name: "Deportivo moderno" },
  { id: "upper_deck", name: "Upper Deck premium" },
  { id: "urban", name: "Urbano" },
  { id: "minimal", name: "Minimalista" },
  { id: "classic", name: "Clásico" },
] as const;

const COLORS = ["#39FF14", "#0057FF", "#FFD600", "#FF6A00", "#E10600", "#6C63FF", "#FFFFFF", "#101010"];

const initialForm: LeagueInput = {
  name: "",
  slug: "",
  city: "",
  state: "",
  sport: "soccer",
  category: "libre",
  season: new Date().getFullYear().toString(),
  description: "",
  logo_url: null,
  banner_url: null,
  primary_color: "#39FF14",
  secondary_color: "#101010",
  accent_color: "#FFD600",
  visual_style: "upper_deck",
};

export default function CreateLeagueScreen() {
  const insets = useSafeAreaInsets();
  const createLeague = useCreateLeague();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<LeagueInput>(initialForm);
  const [uploading, setUploading] = useState<"logo" | "banner" | null>(null);

  const previewLeague = useMemo(() => form as Partial<League>, [form]);
  const previewProfile = useMemo(() => makePreviewProfile(form), [form]);

  const update = <K extends keyof LeagueInput>(key: K, value: LeagueInput[K]) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "name" && !current.slug) {
        next.slug = String(value)
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }
      return next;
    });
  };

  const pickImage = async (target: "logo" | "banner") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.88,
      aspect: target === "logo" ? [1, 1] : [16, 9],
    });
    if (result.canceled) return;

    setUploading(target);
    try {
      const url = await uploadImageToSupabase({
        bucket: "league-assets",
        uri: result.assets[0].uri,
        folder: `leagues/${form.slug || "draft"}`,
      });
      update(target === "logo" ? "logo_url" : "banner_url", url);
    } catch (error: any) {
      Alert.alert("No se pudo subir", error.message ?? "Revisa permisos de Storage.");
    } finally {
      setUploading(null);
    }
  };

  const next = () => {
    const partial = step === 0
      ? leagueInputSchema.pick({ name: true, slug: true, city: true, state: true, sport: true, category: true, season: true, description: true }).safeParse(form)
      : step === 1
        ? leagueInputSchema.pick({ primary_color: true, secondary_color: true, accent_color: true, visual_style: true }).safeParse(form)
        : { success: true as const };

    if (!partial.success) {
      Alert.alert("Revisa la información", partial.error.issues[0]?.message ?? "Datos inválidos");
      return;
    }
    setStep((current) => Math.min(current + 1, 3));
  };

  const submit = async () => {
    const parsed = leagueInputSchema.safeParse(form);
    if (!parsed.success) {
      Alert.alert("Revisa la información", parsed.error.issues[0]?.message ?? "Datos inválidos");
      return;
    }
    try {
      const league = await createLeague.mutateAsync(parsed.data);
      router.replace(`/league/${league.id}` as any);
    } catch (error: any) {
      Alert.alert("No se pudo crear la liga", error.message ?? "Revisa Supabase/RLS.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <LinearGradient colors={["rgba(57,255,20,0.18)", "#050505"]} style={StyleSheet.absoluteFillObject} />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerEyebrow}>NUEVA PLATAFORMA</Text>
          <Text style={styles.headerTitle}>CREAR LIGA</Text>
        </View>
        <Text style={styles.stepText}>{step + 1}/4</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Progress step={step} accent={form.accent_color} />
        {step === 0 ? <StepInfo form={form} update={update} /> : null}
        {step === 1 ? <StepBranding form={form} update={update} pickImage={pickImage} uploading={uploading} /> : null}
        {step === 2 ? <StepTemplate form={form} previewProfile={previewProfile} /> : null}
        {step === 3 ? <StepConfirm form={form} previewLeague={previewLeague} previewProfile={previewProfile} /> : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable disabled={step === 0} onPress={() => setStep((current) => Math.max(current - 1, 0))} style={[styles.secondaryBtn, step === 0 && { opacity: 0.35 }]}>
          <Text style={styles.secondaryText}>ATRÁS</Text>
        </Pressable>
        <Pressable onPress={step === 3 ? submit : next} disabled={createLeague.isPending || Boolean(uploading)} style={[styles.primaryBtn, { backgroundColor: form.accent_color }]}>
          {createLeague.isPending ? <ActivityIndicator color="#050505" /> : null}
          <Text style={styles.primaryText}>{step === 3 ? "CREAR LIGA" : "CONTINUAR"}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function Progress({ step, accent }: { step: number; accent: string }) {
  return (
    <View style={styles.progressWrap}>
      {[0, 1, 2, 3].map((item) => (
        <View key={item} style={[styles.progressItem, item <= step && { backgroundColor: accent }]} />
      ))}
    </View>
  );
}

function StepInfo({ form, update }: { form: LeagueInput; update: <K extends keyof LeagueInput>(key: K, value: LeagueInput[K]) => void }) {
  return (
    <Animated.View entering={FadeInDown.duration(350)} style={styles.section}>
      <Text style={styles.sectionTitle}>1. Información general</Text>
      <Field label="Nombre de la liga" value={form.name} onChangeText={(value) => update("name", value)} placeholder="Ej. Liga Premier Durango" />
      <Field label="Slug corto" value={form.slug} onChangeText={(value) => update("slug", value)} placeholder="liga-premier-dgo" autoCapitalize="none" />
      <View style={styles.row}>
        <Field compact label="Ciudad" value={form.city} onChangeText={(value) => update("city", value)} placeholder="Durango" />
        <Field compact label="Estado" value={form.state} onChangeText={(value) => update("state", value)} placeholder="DGO" />
      </View>
      <PickerPills label="Deporte" items={SPORTS.map((item) => ({ id: item.id, name: item.name, icon: item.icon }))} selected={form.sport} onSelect={(value) => update("sport", value as LeagueInput["sport"])} />
      <PickerPills label="Categoría" items={CATEGORIES.map((item) => ({ id: item, name: item }))} selected={form.category} onSelect={(value) => update("category", value as LeagueInput["category"])} />
      <Field label="Temporada actual" value={form.season} onChangeText={(value) => update("season", value)} placeholder="2026" />
      <Field label="Descripción corta" value={form.description ?? ""} onChangeText={(value) => update("description", value)} placeholder="Liga competitiva local..." multiline />
    </Animated.View>
  );
}

function StepBranding({
  form,
  update,
  pickImage,
  uploading,
}: {
  form: LeagueInput;
  update: <K extends keyof LeagueInput>(key: K, value: LeagueInput[K]) => void;
  pickImage: (target: "logo" | "banner") => void;
  uploading: "logo" | "banner" | null;
}) {
  return (
    <Animated.View entering={FadeInDown.duration(350)} style={styles.section}>
      <Text style={styles.sectionTitle}>2. Branding visual</Text>
      <LeagueBrandPreview league={form as Partial<League>} />
      <View style={styles.uploadRow}>
        <UploadButton label="Logo" loading={uploading === "logo"} done={Boolean(form.logo_url)} onPress={() => pickImage("logo")} />
        <UploadButton label="Banner" loading={uploading === "banner"} done={Boolean(form.banner_url)} onPress={() => pickImage("banner")} />
      </View>
      <ColorPicker label="Color primario" selected={form.primary_color} onSelect={(value) => update("primary_color", value)} />
      <ColorPicker label="Color secundario" selected={form.secondary_color} onSelect={(value) => update("secondary_color", value)} />
      <ColorPicker label="Color de acento" selected={form.accent_color} onSelect={(value) => update("accent_color", value)} />
      <PickerPills label="Estilo visual" items={STYLES.map((item) => ({ id: item.id, name: item.name }))} selected={form.visual_style} onSelect={(value) => update("visual_style", value as LeagueInput["visual_style"])} />
      <Text style={styles.help}>Tipografía sugerida: Inter Black para datos, Bebas Neue para títulos deportivos.</Text>
    </Animated.View>
  );
}

function StepTemplate({ form, previewProfile }: { form: LeagueInput; previewProfile: PlayerProfile }) {
  return (
    <Animated.View entering={FadeInDown.duration(350)} style={styles.section}>
      <Text style={styles.sectionTitle}>3. Plantilla base</Text>
      <Text style={styles.help}>Se guardarán automáticamente cuatro plantillas iniciales: Upper Deck Elite, Rookie Card, MVP Edition y Team Identity.</Text>
      <PlayerCardPreview profile={previewProfile} template={null} />
    </Animated.View>
  );
}

function StepConfirm({ form, previewLeague, previewProfile }: { form: LeagueInput; previewLeague: Partial<League>; previewProfile: PlayerProfile }) {
  return (
    <Animated.View entering={FadeInDown.duration(350)} style={styles.section}>
      <Text style={styles.sectionTitle}>4. Confirmación</Text>
      <LeagueBrandPreview league={previewLeague} />
      <View style={{ height: 16 }} />
      <PlayerCardPreview profile={previewProfile} template={null} />
      <Text style={styles.help}>Al crear la liga se insertará el registro en Supabase y se inicializarán las plantillas default.</Text>
    </Animated.View>
  );
}

function Field({
  label,
  compact,
  ...props
}: React.ComponentProps<typeof TextInput> & { label: string; compact?: boolean }) {
  return (
    <View style={[styles.field, compact && { flex: 1 }]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor="rgba(255,255,255,0.28)"
        style={[styles.input, props.multiline && styles.textArea]}
      />
    </View>
  );
}

function PickerPills({
  label,
  items,
  selected,
  onSelect,
}: {
  label: string;
  items: { id: string; name: string; icon?: string }[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
        {items.map((item) => {
          const active = selected === item.id;
          return (
            <Pressable key={item.id} onPress={() => onSelect(item.id)} style={[styles.pill, active && styles.pillActive]}>
              {item.icon ? <MaterialCommunityIcons name={item.icon as any} size={17} color={active ? "#050505" : "#FFF"} /> : null}
              <Text style={[styles.pillText, active && styles.pillTextActive]}>{item.name}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function ColorPicker({ label, selected, onSelect }: { label: string; selected: string; onSelect: (color: string) => void }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.colorRow}>
        {COLORS.map((color) => (
          <Pressable key={color} onPress={() => onSelect(color)} style={[styles.color, { backgroundColor: color }, selected === color && styles.colorActive]} />
        ))}
      </View>
    </View>
  );
}

function UploadButton({ label, loading, done, onPress }: { label: string; loading: boolean; done: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.uploadBtn}>
      {loading ? <ActivityIndicator color="#39FF14" /> : <MaterialCommunityIcons name={done ? "check-circle" : "image-plus"} size={22} color={done ? "#39FF14" : "#FFF"} />}
      <Text style={styles.uploadText}>{done ? `${label} listo` : `Subir ${label}`}</Text>
    </Pressable>
  );
}

function makePreviewProfile(form: LeagueInput): PlayerProfile {
  const now = new Date().toISOString();
  const league = {
    id: "preview",
    owner_id: null,
    name: form.name || "Tu Liga",
    slug: form.slug || "preview",
    city: form.city || "Ciudad",
    state: form.state || "Estado",
    sport: form.sport,
    category: form.category,
    season: form.season || "2026",
    description: form.description ?? "",
    logo_url: form.logo_url ?? null,
    banner_url: form.banner_url ?? null,
    primary_color: form.primary_color,
    secondary_color: form.secondary_color,
    accent_color: form.accent_color,
    visual_style: form.visual_style,
    created_at: now,
    updated_at: now,
  } as League;

  return {
    id: "preview-player",
    league_id: "preview",
    team_id: "preview-team",
    auth_user_id: null,
    full_name: "Jugador Estrella",
    nickname: "Rookie",
    number: "10",
    position: "Delantero",
    birth_date: null,
    photo_url: null,
    status: "active",
    credential_code: "LIGA-PLAYER-2026-0001",
    created_at: now,
    updated_at: now,
    league,
    team: {
      id: "preview-team",
      league_id: "preview",
      name: "Equipo Demo",
      logo_url: null,
      primary_color: form.primary_color,
      secondary_color: form.secondary_color,
      coach_name: null,
      created_at: now,
    },
    stats: {
      id: "preview-stats",
      player_id: "preview-player",
      league_id: "preview",
      season: form.season || "2026",
      games: 8,
      points: 0,
      touchdowns: 0,
      goals: 12,
      assists: 5,
      tackles: 0,
      interceptions: 0,
      mvp_count: 2,
      created_at: now,
      updated_at: now,
    },
  };
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#050505" },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 14 },
  backBtn: { width: 42, height: 42, borderRadius: 13, backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center" },
  headerEyebrow: { color: "#39FF14", fontFamily: "Inter_800ExtraBold", fontSize: 8, letterSpacing: 1.6 },
  headerTitle: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 20, letterSpacing: 1 },
  stepText: { color: "rgba(255,255,255,0.45)", fontFamily: "Inter_900Black", fontSize: 13 },
  content: { paddingHorizontal: 20, paddingBottom: 120 },
  progressWrap: { flexDirection: "row", gap: 8, marginBottom: 18 },
  progressItem: { flex: 1, height: 4, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.12)" },
  section: { gap: 14 },
  sectionTitle: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 22, letterSpacing: -0.6 },
  row: { flexDirection: "row", gap: 12 },
  field: { gap: 8 },
  label: { color: "rgba(255,255,255,0.52)", fontFamily: "Inter_800ExtraBold", fontSize: 10, letterSpacing: 1, textTransform: "uppercase" },
  input: { borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.055)", paddingHorizontal: 14, paddingVertical: 13, color: "#FFF", fontFamily: "Inter_600SemiBold", fontSize: 15 },
  textArea: { minHeight: 86, textAlignVertical: "top" },
  pillRow: { gap: 10 },
  pill: { flexDirection: "row", alignItems: "center", gap: 7, borderRadius: 22, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.05)", paddingHorizontal: 14, paddingVertical: 10 },
  pillActive: { backgroundColor: "#39FF14", borderColor: "#39FF14" },
  pillText: { color: "#FFF", fontFamily: "Inter_800ExtraBold", fontSize: 12 },
  pillTextActive: { color: "#050505" },
  uploadRow: { flexDirection: "row", gap: 10 },
  uploadBtn: { flex: 1, minHeight: 78, borderRadius: 16, borderWidth: 1, borderStyle: "dashed", borderColor: "rgba(57,255,20,0.45)", backgroundColor: "rgba(57,255,20,0.06)", alignItems: "center", justifyContent: "center", gap: 8 },
  uploadText: { color: "rgba(255,255,255,0.72)", fontFamily: "Inter_700Bold", fontSize: 11 },
  colorRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  color: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: "rgba(255,255,255,0.08)" },
  colorActive: { borderColor: "#FFF", transform: [{ scale: 1.12 }] },
  help: { color: "rgba(255,255,255,0.5)", fontFamily: "Inter_500Medium", fontSize: 12, lineHeight: 19 },
  footer: { position: "absolute", left: 0, right: 0, bottom: 0, flexDirection: "row", gap: 10, paddingHorizontal: 20, paddingTop: 12, backgroundColor: "rgba(5,5,5,0.94)", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)" },
  secondaryBtn: { width: 104, borderRadius: 15, borderWidth: 1, borderColor: "rgba(255,255,255,0.13)", alignItems: "center", justifyContent: "center" },
  secondaryText: { color: "#FFF", fontFamily: "Inter_900Black", fontSize: 11, letterSpacing: 1 },
  primaryBtn: { flex: 1, minHeight: 50, borderRadius: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  primaryText: { color: "#050505", fontFamily: "Inter_900Black", fontSize: 12, letterSpacing: 1 },
});
