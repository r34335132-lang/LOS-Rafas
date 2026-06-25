import { Feather } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { NEWS } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const FEATURED_BY_SPORT: Record<string, ImageSourcePropType> = {
  flag: require("../../assets/images/featured-flag.png"),
  soccer: require("../../assets/images/featured-soccer.png"),
  basketball: require("../../assets/images/featured-basketball.png"),
  fitness: require("../../assets/images/featured-flag.png"),
  general: require("../../assets/images/featured-soccer.png"),
};

const ACCENT_BY_SPORT: Record<string, "sportFlag" | "sportSoccer" | "sportBasketball" | "sportFitness" | "sportNews"> = {
  flag: "sportFlag",
  soccer: "sportSoccer",
  basketball: "sportBasketball",
  fitness: "sportFitness",
  general: "sportNews",
};

export default function NewsDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = NEWS.find((n) => n.id === id);
  const { isSavedNews, toggleSavedNews } = useApp();

  if (!item) {
    return (
      <View
        style={[
          styles.notFound,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={{ color: colors.foreground }}>Noticia no encontrada</Text>
      </View>
    );
  }

  const saved = isSavedNews(item.id);
  const accent = colors[ACCENT_BY_SPORT[item.sport]];

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable hitSlop={10} onPress={() => toggleSavedNews(item.id)}>
              <Feather
                name="bookmark"
                size={20}
                color="#fff"
                style={{ opacity: saved ? 1 : 0.6 }}
              />
            </Pressable>
          ),
        }}
      />

      <View style={styles.heroWrap}>
        <Image
          source={FEATURED_BY_SPORT[item.sport]}
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <View style={[styles.tag, { backgroundColor: accent }]}>
            <Text style={styles.tagText}>{item.tag}</Text>
          </View>
          <Text style={styles.heroTitle}>{item.title}</Text>
          <Text style={styles.heroMeta}>
            {item.author} · {item.publishedAt}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={[styles.lead, { color: colors.foreground }]}>
          {item.excerpt}
        </Text>
        <Text style={[styles.paragraph, { color: colors.foreground }]}>
          {item.body}
        </Text>

        <Pressable
          onPress={() => toggleSavedNews(item.id)}
          style={({ pressed }) => [
            styles.saveBtn,
            {
              backgroundColor: saved ? colors.accent : colors.card,
              borderColor: saved ? colors.accent : colors.border,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Feather
            name="bookmark"
            size={16}
            color={saved ? "#000" : colors.foreground}
          />
          <Text
            style={[
              styles.saveBtnText,
              { color: saved ? "#000" : colors.foreground },
            ]}
          >
            {saved ? "Guardada" : "Guardar nota"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  heroWrap: { height: 320 },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  heroContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 18,
    gap: 10,
  },
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 1,
  },
  heroTitle: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  heroMeta: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  body: { padding: 18, gap: 16 },
  lead: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.1,
  },
  paragraph: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 23,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 8,
  },
  saveBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
});
