import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

import { LiveBadge } from "@/components/LiveBadge";
import { TeamBadge } from "@/components/TeamBadge";
import { Match, TEAMS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

export function MatchCard({
  match,
  variant = "row",
  flashKey,
}: {
  match: Match;
  variant?: "row" | "hero";
  flashKey?: string | number;
}) {
  const colors = useColors();
  const home = TEAMS.find((t) => t.id === match.homeId)!;
  const away = TEAMS.find((t) => t.id === match.awayId)!;

  // Yellow flash animation when scores change
  const flashAnim = useRef(new Animated.Value(0)).current;
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    flashAnim.setValue(1);
    Animated.timing(flashAnim, {
      toValue: 0,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [flashKey, flashAnim]);

  const scoreBg = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", colors.liveFlash],
  });
  const scoreColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.foreground, "#000"],
  });

  if (variant === "hero") {
    return (
      <Pressable
        onPress={() => router.push(`/team/${home.id}`)}
        style={({ pressed }) => [
          styles.hero,
          {
            backgroundColor: colors.elevated,
            borderColor: colors.border,
            opacity: pressed ? 0.92 : 1,
          },
        ]}
      >
        <View style={styles.heroTop}>
          {match.status === "live" ? (
            <LiveBadge />
          ) : (
            <Text style={[styles.heroStatus, { color: colors.mutedForeground }]}>
              {match.status === "final" ? "FINAL" : (match.startTime ?? "PROX")}
            </Text>
          )}
          <Text style={[styles.heroVenue, { color: colors.mutedForeground }]}>
            {match.venue}
          </Text>
        </View>

        <View style={styles.heroRow}>
          <View style={styles.heroSide}>
            <TeamBadge short={home.short} color={home.colorHex} size={56} />
            <Text style={[styles.heroName, { color: colors.foreground }]}>
              {home.name}
            </Text>
            <Text style={[styles.heroRecord, { color: colors.mutedForeground }]}>
              {home.wins}-{home.losses}
              {home.ties ? `-${home.ties}` : ""}
            </Text>
          </View>

          <View style={styles.heroScore}>
            <Animated.View
              style={[
                styles.heroScoreBox,
                { backgroundColor: scoreBg },
              ]}
            >
              <Animated.Text
                style={[styles.heroScoreText, { color: scoreColor }]}
              >
                {match.homeScore}
              </Animated.Text>
              <Text style={[styles.heroScoreSep, { color: colors.mutedForeground }]}>
                :
              </Text>
              <Animated.Text
                style={[styles.heroScoreText, { color: scoreColor }]}
              >
                {match.awayScore}
              </Animated.Text>
            </Animated.View>
            {match.minute ? (
              <Text style={[styles.heroMinute, { color: colors.live }]}>
                {match.minute}
              </Text>
            ) : null}
          </View>

          <View style={styles.heroSide}>
            <TeamBadge short={away.short} color={away.colorHex} size={56} />
            <Text style={[styles.heroName, { color: colors.foreground }]}>
              {away.name}
            </Text>
            <Text style={[styles.heroRecord, { color: colors.mutedForeground }]}>
              {away.wins}-{away.losses}
              {away.ties ? `-${away.ties}` : ""}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.heroFooter,
            { borderTopColor: colors.border },
          ]}
        >
          <View style={styles.heroFooterLeft}>
            <Feather name="bar-chart-2" size={14} color={colors.mutedForeground} />
            <Text
              style={[styles.heroFooterText, { color: colors.mutedForeground }]}
            >
              Ver detalle del equipo
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => router.push(`/team/${home.id}`)}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={styles.rowHeader}>
        {match.status === "live" ? (
          <LiveBadge small />
        ) : (
          <Text
            style={[
              styles.rowStatus,
              {
                color:
                  match.status === "final"
                    ? colors.mutedForeground
                    : colors.accent,
              },
            ]}
          >
            {match.status === "final" ? "FINAL" : (match.startTime ?? "PROX")}
          </Text>
        )}
        <Text style={[styles.rowMinute, { color: colors.mutedForeground }]}>
          {match.minute ?? match.venue}
        </Text>
      </View>

      <View style={styles.teamLine}>
        <View style={styles.teamLineLeft}>
          <TeamBadge short={home.short} color={home.colorHex} size={32} />
          <Text style={[styles.teamLineName, { color: colors.foreground }]}>
            {home.name}
          </Text>
        </View>
        <Animated.Text
          style={[
            styles.teamLineScore,
            { color: scoreColor, backgroundColor: scoreBg, paddingHorizontal: 6, borderRadius: 4 },
          ]}
        >
          {match.homeScore}
        </Animated.Text>
      </View>
      <View style={styles.teamLine}>
        <View style={styles.teamLineLeft}>
          <TeamBadge short={away.short} color={away.colorHex} size={32} />
          <Text style={[styles.teamLineName, { color: colors.foreground }]}>
            {away.name}
          </Text>
        </View>
        <Animated.Text
          style={[
            styles.teamLineScore,
            { color: scoreColor, backgroundColor: scoreBg, paddingHorizontal: 6, borderRadius: 4 },
          ]}
        >
          {match.awayScore}
        </Animated.Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginHorizontal: 18,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 18,
    overflow: "hidden",
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  heroStatus: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 1,
  },
  heroVenue: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  heroSide: {
    alignItems: "center",
    flex: 1,
    gap: 6,
  },
  heroName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    textAlign: "center",
  },
  heroRecord: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },
  heroScore: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  heroScoreBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  heroScoreText: {
    fontFamily: "Inter_700Bold",
    fontSize: 36,
    letterSpacing: -1,
  },
  heroScoreSep: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
  },
  heroMinute: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  heroFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  heroFooterLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  heroFooterText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },

  row: {
    marginHorizontal: 18,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 8,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  rowStatus: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 0.8,
  },
  rowMinute: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },
  teamLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  teamLineLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  teamLineName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    flex: 1,
  },
  teamLineScore: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    minWidth: 28,
    textAlign: "right",
  },
});
