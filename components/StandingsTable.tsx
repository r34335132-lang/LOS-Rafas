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
    <View style={[styles.container, { backgroundColor: colors.background, borderColor: colors.border }]}>
      {/* HEADER DE LA TABLA */}
      <View style={[styles.headerRow, { backgroundColor: colors.elevated, borderBottomColor: colors.border }]}>
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
        
        // Efecto de cebra: alternar el fondo de las filas para el look deportivo
        const isEven = index % 2 === 0;
        const rowBgColor = isEven ? colors.background : colors.card;
        
        return (
          <View 
            key={team.id} 
            style={[styles.row, { backgroundColor: rowBgColor, borderBottomColor: colors.border }]}
          >
            {/* Indicador de Liguilla agresivo */}
            <View 
              style={[
                styles.playoffIndicator, 
                { backgroundColor: isPlayoffZone ? accentColor : "transparent" }
              ]} 
            />

            <Text style={[styles.colPosNumber, { color: isPlayoffZone ? colors.foreground : colors.mutedForeground }]}>
              {index + 1}
            </Text>

            <View style={styles.colTeam}>
              <TeamBadge short={team.short} color={team.colorHex} size={28} />
              <Text style={[styles.teamName, { color: colors.foreground }]} numberOfLines={1}>
                {team.name.toUpperCase()}
              </Text>
            </View>

            <Text style={[styles.colStatNumber, { color: colors.mutedForeground }]}>{team.played}</Text>
            <Text style={[styles.colStatNumber, { color: colors.mutedForeground }]}>{team.wins}</Text>
            <Text style={[styles.colStatNumber, { color: colors.mutedForeground }]}>{team.ties}</Text>
            <Text style={[styles.colStatNumber, { color: colors.mutedForeground }]}>{team.losses}</Text>
            
            {/* PUNTOS DESTACADOS */}
            <View style={[styles.ptsBadge, { backgroundColor: isPlayoffZone ? `${accentColor}20` : 'transparent' }]}>
              <Text style={[styles.colPtsNumber, { color: isPlayoffZone ? accentColor : colors.foreground }]}>
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
    borderRadius: 12, // Bordes menos redondos para el look rudo
    borderWidth: 1, // Borde sólido en lugar de hairlineWidth para definir bien la caja
    overflow: "hidden",
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingRight: 12,
    borderBottomWidth: 1,
  },
  headerText: {
    fontFamily: "BebasNeue_400Regular", // Bebas para los títulos
    fontSize: 16,
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingRight: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  playoffIndicator: {
    width: 4, // Más grueso
    height: "100%",
    position: "absolute",
    left: 0,
    // Quitamos los border-radius para que sea una línea dura y directa
  },
  colPos: {
    width: 36,
    textAlign: "center",
  },
  colPosNumber: {
    width: 36,
    textAlign: "center",
    fontFamily: "BebasNeue_400Regular",
    fontSize: 22, // Números grandes de posición
    marginTop: 2, // Ajuste óptico
  },
  colTeam: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // Un poco más de espacio entre logo y texto
  },
  teamName: {
    fontFamily: "BebasNeue_400Regular",
    fontSize: 20, // Nombres imponentes
    letterSpacing: 0.5,
    flexShrink: 1,
    marginTop: 2,
  },
  colStat: {
    width: 30,
    textAlign: "center",
  },
  colStatNumber: {
    width: 30,
    textAlign: "center",
    fontFamily: "BebasNeue_400Regular",
    fontSize: 20, // Estadísticas claras y cuadradas
    marginTop: 2,
  },
  ptsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4, // Borde sutil
    marginLeft: 4,
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  colPts: {
    width: 44, // Ancho fijo para el título PTS para alinear con el badge
    textAlign: "center",
  },
  colPtsNumber: {
    fontFamily: "BebasNeue_400Regular",
    fontSize: 24, // Los puntos resaltan más que todo lo demás
    marginTop: 2,
  },
});