import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { LiveTicker } from "@/components/LiveTicker";
import { MatchCard } from "@/components/MatchCard";
import { NewsCard } from "@/components/NewsCard";
import { SectionHeader } from "@/components/SectionHeader";
import { NEWS, SPORTS, TICKER_ITEMS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";
import { useLiveScores } from "@/hooks/useLiveScores";

export default function HomeScreen() {
  const colors = useColors();
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Home" showLogo />
      <LiveTicker items={TICKER_ITEMS} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.heroBanner}>
          <View style={[styles.heroPill, { backgroundColor: colors.primary }]}>
            <View style={styles.heroPillDot} />
            <Text style={styles.heroPillText}>EN VIVO DESDE DURANGO</Text>
          </View>
          <Text style={[styles.heroHeadline, { color: colors.foreground }]}>
            El deporte local{"\n"}
            <Text style={{ color: colors.primary }}>en tiempo real.</Text>
          </Text>
          <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
            Marcadores, jugadas y noticias de tus equipos favoritos.
          </Text>
        </View>

        <SectionHeader
          title="Partido destacado"
          accent={colors.primary}
        />
        <MatchCard
          match={featured}
          variant="hero"
          flashKey={flashKeys[featured.id]}
        />

        {liveOthers.length > 0 ? (
          <>
            <SectionHeader
              title="Más en vivo"
              accent={colors.live}
              action="Ver todos"
              onAction={() => router.push("/scores")}
            />
            {liveOthers.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                flashKey={flashKeys[m.id]}
              />
            ))}
          </>
        ) : null}

        <SectionHeader
          title="Últimas noticias"
          accent={colors.sportNews}
          action="Ver todas"
          onAction={() => router.push("/news")}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
        >
          {NEWS.slice(0, 5).map((item) => (
            <NewsCard key={item.id} item={item} variant="carousel" />
          ))}
        </ScrollView>

        <SectionHeader title="Explora deportes" accent={colors.accent} />
        <View style={styles.sportGrid}>
          {SPORTS.map((s) => {
            const accent = colors[s.accent];
            return (
              <Pressable
                key={s.key}
                onPress={() => router.push(`/sports?sport=${s.key}`)}
                style={({ pressed }) => [
                  styles.sportTile,
                  {
                    backgroundColor: colors.card,
                    borderColor: s.highlighted ? accent : colors.border,
                    borderWidth: s.highlighted ? 1.5 : StyleSheet.hairlineWidth,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.sportIcon,
                    { backgroundColor: accent },
                  ]}
                >
                  <Feather
                    name={s.icon as keyof typeof Feather.glyphMap}
                    size={20}
                    color="#fff"
                  />
                </View>
                <Text style={[styles.sportName, { color: colors.foreground }]}>
                  {s.name}
                </Text>
                <Text
                  style={[
                    styles.sportDesc,
                    { color: colors.mutedForeground },
                  ]}
                  numberOfLines={2}
                >
                  {s.description}
                </Text>
                {s.highlighted ? (
                  <View
                    style={[
                      styles.highlightTag,
                      { backgroundColor: accent },
                    ]}
                  >
                    <Text style={styles.highlightTagText}>DESTACADO</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroBanner: {
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 4,
    gap: 12,
  },
  heroPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  heroPillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  heroPillText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 1.2,
  },
  heroHeadline: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -1,
  },
  heroSub: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    lineHeight: 20,
  },
  carousel: {
    paddingHorizontal: 18,
    paddingBottom: 4,
  },
  sportGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    gap: 0,
  },
  sportTile: {
    width: "48%",
    margin: "1%",
    padding: 14,
    borderRadius: 16,
    gap: 8,
    minHeight: 130,
  },
  sportIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sportName: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    letterSpacing: -0.2,
  },
  sportDesc: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
  },
  highlightTag: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  highlightTagText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 8,
    letterSpacing: 0.8,
  },
});
