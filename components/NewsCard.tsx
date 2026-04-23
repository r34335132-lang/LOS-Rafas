import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { NewsItem } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

const SPORT_ACCENT: Record<string, "sportFlag" | "sportSoccer" | "sportBasketball" | "sportFitness" | "sportNews"> = {
  flag: "sportFlag",
  soccer: "sportSoccer",
  basketball: "sportBasketball",
  fitness: "sportFitness",
  general: "sportNews",
};

const FEATURED_BY_SPORT: Record<string, ReturnType<typeof require>> = {
  flag: require("../assets/images/featured-flag.png"),
  soccer: require("../assets/images/featured-soccer.png"),
  basketball: require("../assets/images/featured-basketball.png"),
  fitness: require("../assets/images/featured-flag.png"),
  general: require("../assets/images/featured-soccer.png"),
};

export function NewsCard({
  item,
  variant = "list",
  saved,
  onToggleSave,
}: {
  item: NewsItem;
  variant?: "list" | "hero" | "carousel";
  saved?: boolean;
  onToggleSave?: () => void;
}) {
  const colors = useColors();
  const accentKey = SPORT_ACCENT[item.sport];
  const accent = colors[accentKey];
  const image = FEATURED_BY_SPORT[item.sport];

  if (variant === "carousel") {
    return (
      <Pressable
        onPress={() => router.push(`/news/${item.id}`)}
        style={({ pressed }) => [
          styles.carouselCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <Image source={image} style={styles.carouselImage} />
        <View style={styles.carouselOverlay} />
        <View style={styles.carouselContent}>
          <View style={[styles.tag, { backgroundColor: accent }]}>
            <Text style={styles.tagText}>{item.tag}</Text>
          </View>
          <Text style={styles.carouselTitle} numberOfLines={3}>
            {item.title}
          </Text>
          <Text style={styles.carouselMeta}>{item.publishedAt}</Text>
        </View>
      </Pressable>
    );
  }

  if (variant === "hero") {
    return (
      <Pressable
        onPress={() => router.push(`/news/${item.id}`)}
        style={({ pressed }) => [
          styles.heroCard,
          { opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <Image source={image} style={styles.heroImage} />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <View style={[styles.tag, { backgroundColor: accent }]}>
            <Text style={styles.tagText}>{item.tag}</Text>
          </View>
          <Text style={styles.heroTitle} numberOfLines={3}>
            {item.title}
          </Text>
          <Text style={styles.heroExcerpt} numberOfLines={2}>
            {item.excerpt}
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => router.push(`/news/${item.id}`)}
      style={({ pressed }) => [
        styles.list,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={styles.listLeft}>
        <View style={[styles.listAccent, { backgroundColor: accent }]} />
        <View style={styles.listBody}>
          <Text style={[styles.listTag, { color: accent }]}>{item.tag}</Text>
          <Text
            style={[styles.listTitle, { color: colors.foreground }]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <Text style={[styles.listMeta, { color: colors.mutedForeground }]}>
            {item.author} · {item.publishedAt}
          </Text>
        </View>
      </View>
      {onToggleSave ? (
        <Pressable
          onPress={onToggleSave}
          hitSlop={10}
          style={styles.bookmark}
        >
          <Feather
            name={saved ? "bookmark" : "bookmark"}
            size={18}
            color={saved ? colors.accent : colors.mutedForeground}
            style={{ opacity: saved ? 1 : 0.6 }}
          />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  carouselCard: {
    width: 260,
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: 12,
  },
  carouselImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  carouselOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  carouselContent: {
    flex: 1,
    padding: 14,
    justifyContent: "flex-end",
    gap: 6,
  },
  carouselTitle: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    lineHeight: 19,
  },
  carouselMeta: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },

  heroCard: {
    marginHorizontal: 18,
    height: 220,
    borderRadius: 18,
    overflow: "hidden",
  },
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
    padding: 18,
    justifyContent: "flex-end",
    gap: 8,
  },
  heroTitle: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  heroExcerpt: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    lineHeight: 18,
  },

  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
  },

  list: {
    marginHorizontal: 18,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  listLeft: { flexDirection: "row", flex: 1, gap: 12 },
  listAccent: {
    width: 4,
    borderRadius: 2,
  },
  listBody: { flex: 1, gap: 4 },
  listTag: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 1,
  },
  listTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    lineHeight: 19,
  },
  listMeta: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },
  bookmark: {
    paddingHorizontal: 4,
  },
});
