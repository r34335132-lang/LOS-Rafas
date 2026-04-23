import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { TeamBadge } from "@/components/TeamBadge";
import { Team } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

type Props = {
  teams: Team[];
  accentColor: string;
};

export function StandingsTable({ teams, accentColor }: Props) {
  const colors = useColors();

  // 1. Calcular puntos y ordenar equipos
  const sortedTeams = useMemo(() => {
    return [...teams]
      .map((team) => ({
        ...team,
        points: team.wins * 3 + team.ties * 1, // 3 pts victoria, 1 pt empate
        played: team.wins + team.losses + team.ties,
      }))
      .sort((a, b) => b.points - a.points || b.wins - a.wins); // Desempate por victorias
  }, [teams]);

  if (sortedTeams.length === 0) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* HEADER DE LA TABLA */}
      <View style={[styles.headerRow, { borderBottomColor: colors.border }]}>
        <Text style={[styles.colPos, styles.headerText, { color: colors.mutedForeground }]}>#</Text>
        <Text style={[styles.colTeam, styles.headerText, { color: colors.mutedForeground }]}>EQUIPO</Text>
        <Text style={[styles.colStat, styles.headerText, { color: colors.mutedForeground }]}>JJ</Text>
        <Text style={[styles.colStat, styles.headerText, { color: colors.mutedForeground }]}>JG</Text>
        <Text style={[styles.colStat, styles.headerText, { color: colors.mutedForeground }]}>JE</Text>
        <Text style={[styles.colStat, styles.headerText, { color: colors.mutedForeground }]}>JP</Text>
        <Text style={[styles.colPts, styles.headerText, { color: colors.foreground }]}>PTS</Text>
      </View>

      {/* FILAS DE EQUIPOS */}
      {sortedTeams.map((team, index) => {
        // Asumimos que los primeros 4 pasan a playoffs
        const isPlayoffZone = index < 4; 
        
        return (
          <View 
            key={team.id} 
            style={[styles.row, { borderBottomColor: colors.border }]}
          >
            {/* Indicador de Liguilla */}
            <View 
              style={[
                styles.playoffIndicator, 
                { backgroundColor: isPlayoffZone ? accentColor : "transparent" }
              ]} 
            />

            <Text style={[styles.colPos, { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>
              {index + 1}
            </Text>

            <View style={styles.colTeam}>
              <TeamBadge short={team.short} color={team.colorHex} size={26} />
              <Text style={[styles.teamName, { color: colors.foreground }]} numberOfLines={1}>
                {team.name}
              </Text>
            </View>

            <Text style={[styles.colStat, { color: colors.mutedForeground }]}>{team.played}</Text>
            <Text style={[styles.colStat, { color: colors.mutedForeground }]}>{team.wins}</Text>
            <Text style={[styles.colStat, { color: colors.mutedForeground }]}>{team.ties}</Text>
            <Text style={[styles.colStat, { color: colors.mutedForeground }]}>{team.losses}</Text>
            
            {/* PUNTOS DESTACADOS */}
            <View style={[styles.ptsBadge, { backgroundColor: isPlayoffZone ? `${accentColor}15` : colors.elevated }]}>
              <Text style={[styles.colPts, { color: isPlayoffZone ? accentColor : colors.foreground }]}>
                {team.points}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 18,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingRight: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(0,0,0,0.2)", // Le da un toque distinto al header
  },
  headerText: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingRight: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  playoffIndicator: {
    width: 3,
    height: "100%",
    position: "absolute",
    left: 0,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  colPos: {
    width: 32,
    textAlign: "center",
    fontSize: 13,
  },
  colTeam: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  teamName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    flexShrink: 1, // Evita que nombres largos rompan el layout
  },
  colStat: {
    width: 28,
    textAlign: "center",
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  ptsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 4,
    minWidth: 36,
    alignItems: "center",
  },
  colPts: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
});