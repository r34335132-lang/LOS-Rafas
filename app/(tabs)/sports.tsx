import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState, useEffect } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import Animated, { FadeIn, FadeInDown, FadeOut, LinearTransition, ZoomIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

import { SPORTS, SportKey, TEAMS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";
import { supabase } from "@/lib/supabase"; // Importamos nuestro cliente de Supabase

const { width, height } = Dimensions.get("window");

// --- TORNEOS REALES Y MOCKS ---
const TOURNAMENTS: Record<string, string[]> = {
  flag: ["Varonil Libre", "Femenil Cooper", "Femenil Silver", "Femenil Gold", "Mixto Silver", "Mixto Gold"],
  soccer: ["Liga Dominical", "Torneo Nocturno", "Copa Durango"],
  basketball: ["Liga Mayor", "2da Fuerza"],
  fitness: ["Reto 30 Días", "Crossfit Games"],
  all: ["General"]
};

// --- IMÁGENES DE FONDO POR DEPORTE ---
const SPORT_BACKGROUNDS: Record<string, string> = {
  soccer: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop",
  flag: "https://images.unsplash.com/photo-1563705534608-895101a9df86?q=80&w=800&auto=format&fit=crop",
  basketball: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop",
  fitness: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1525914813433-886dc8183afa?q=80&w=1000&auto=format&fit=crop",
};

type StatType = "touchdowns_totales" | "pases_completos" | "sacks" | "intercepciones";
type StatCategory = "ofensiva" | "defensa";

export default function SportsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ sport?: string }>();
  const initial = (params.sport as SportKey) ?? "flag";
  
  const [activeSport, setActiveSport] = useState<SportKey>(initial);
  const [activeTournament, setActiveTournament] = useState<string>(TOURNAMENTS[initial]?.[0] || "General");

  const [viewMode, setViewMode] = useState<"teams" | "players">("teams");
  const [activeStatCategory, setActiveStatCategory] = useState<StatCategory>("ofensiva");
  const [statType, setStatType] = useState<StatType>("touchdowns_totales");

  // --- ESTADOS PARA LA DB ---
  const [dbTeamStats, setDbTeamStats] = useState<any[]>([]);
  const [dbPlayerStats, setDbPlayerStats] = useState<any[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(false);

  const sport = useMemo(() => SPORTS.find((s) => s.key === activeSport) ?? SPORTS[0]!, [activeSport]);
  const activeColor = (colors as any)[sport.accent] || "#39FF14"; 
  const sportBgImage = SPORT_BACKGROUNDS[sport.key] || SPORT_BACKGROUNDS.default;
  const isRealData = activeSport === "flag";
  
  const handleSportChange = (sportKey: SportKey) => {
    setActiveSport(sportKey);
    setActiveTournament(TOURNAMENTS[sportKey]?.[0] || "General");
    setViewMode("teams");
  };

  const handleCategoryPress = (category: StatCategory) => {
    setActiveStatCategory(category);
    if (category === "ofensiva") setStatType("touchdowns_totales");
    if (category === "defensa") setStatType("sacks");
  };

  // --- EFECTO PARA CONSUMIR SUPABASE DIRECTAMENTE ---
  useEffect(() => {
    if (isRealData) {
      const fetchDatabase = async () => {
        setIsLoadingDb(true);
        try {
          // Consultamos directamente a la tabla o vista de estadísticas
          const { data: teamsData, error: teamsError } = await supabase
            .from('team_stats')
            .select('*')
            .limit(1500)
            .order('points', { ascending: false });

          if (teamsError) throw teamsError;
          setDbTeamStats(teamsData || []);

          // Si en el futuro tienes tabla de players, puedes agregar la consulta aquí
          setDbPlayerStats([]); 

        } catch (error: any) {
          console.error("Error conectando a Supabase:", error.message);
          setDbTeamStats([]);
        } finally {
          setIsLoadingDb(false);
        }
      };

      fetchDatabase();
    }
  }, [activeSport]);

  // --- LÓGICA DE DATOS: EQUIPOS ---
  let displayTeams: any[] = [];
  if (isRealData) {
    displayTeams = dbTeamStats.filter(
      (t) => t.team_category?.toLowerCase() === activeTournament.toLowerCase()
    );
  } else {
    const allSportTeams = TEAMS.filter((t) => t.sport === sport.key);
    displayTeams = activeTournament.includes("Femenil") 
      ? allSportTeams.slice(0, 3) 
      : activeTournament.includes("Nocturno") 
        ? allSportTeams.slice(2, 6) 
        : allSportTeams;
  }

  // --- LÓGICA DE DATOS: JUGADORES ---
  let displayPlayers: any[] = [];
  if (isRealData) {
    displayPlayers = dbPlayerStats
      .filter((p) => p.categories?.some((c: string) => c.toLowerCase().includes(activeTournament.toLowerCase())))
      .map(m => ({
        id: m.player_id,
        name: m.player_name,
        photo_url: m.photo_url,
        team_name: m.team_name,
        touchdowns_totales: m.touchdowns || Math.floor(Math.random() * 20), 
        pases_completos: m.passes || Math.floor(Math.random() * 50),
        sacks: m.sacks || Math.floor(Math.random() * 10),
        intercepciones: m.interceptions || Math.floor(Math.random() * 8),
      }))
      .sort((a, b) => (b[statType] || 0) - (a[statType] || 0))
      .slice(0, 20);
  } else {
    displayPlayers = TEAMS.filter(t => t.sport === sport.key).flatMap(team => 
      team.players.map(p => ({
        id: p.id,
        name: p.name,
        photo_url: p.image,
        team_name: team.name,
        team_color: team.colorHex,
        touchdowns_totales: p.stats.touchdowns || Math.floor(Math.random() * 15),
        pases_completos: Math.floor(Math.random() * 80),
        sacks: Math.floor(Math.random() * 5),
        intercepciones: p.stats.interceptions || Math.floor(Math.random() * 4),
      }))
    ).sort((a, b) => (b[statType] || 0) - (a[statType] || 0)).slice(0, 10);
  }

  const renderTableHeaders = () => {
    switch (sport.key) {
      case "flag":
        return (
          <>
            <Text style={[styles.th, { width: 30 }]}>J</Text>
            <Text style={[styles.th, { width: 30 }]}>G</Text>
            <Text style={[styles.th, { width: 30 }]}>P</Text>
            <Text style={[styles.thHighlight, { width: 50, color: activeColor }]}>PTS</Text>
          </>
        );
      case "soccer":
        return (
          <>
            <Text style={[styles.th, { width: 25 }]}>J</Text>
            <Text style={[styles.th, { width: 25 }]}>G</Text>
            <Text style={[styles.th, { width: 25 }]}>E</Text>
            <Text style={[styles.thHighlight, { width: 40, color: activeColor }]}>PTS</Text>
          </>
        );
      default:
        return <Text style={[styles.thHighlight, { width: 50, color: activeColor }]}>PTS</Text>;
    }
  };

  const renderTeamStats = (team: any, index: number) => {
    if (isRealData && sport.key === "flag") {
      return (
        <>
          <Text style={[styles.tdStat, { width: 30 }]}>{team.games_played || 0}</Text>
          <Text style={[styles.tdStat, { width: 30 }]}>{team.games_won || 0}</Text>
          <Text style={[styles.tdStat, { width: 30 }]}>{team.games_lost || 0}</Text>
          <View style={[styles.tdHighlightWrap, { width: 50, backgroundColor: `${activeColor}15`, borderColor: `${activeColor}30` }]}>
            <Text style={[styles.tdPts, { color: activeColor }]}>{team.points || 0}</Text>
          </View>
        </>
      );
    }
    
    const J = 10; const G = 10 - index; const E = index % 2 === 0 ? 1 : 0; const P = J - G - E;
    const PTS = (G * 3) + (E * 1);
    return (
      <View style={[styles.tdHighlightWrap, { backgroundColor: `${activeColor}15`, borderColor: `${activeColor}30` }]}>
        <Text style={[styles.tdPts, { color: activeColor }]}>{PTS}</Text>
      </View>
    );
  };

  const getStatLabel = (type: StatType) => {
    switch(type) {
      case 'touchdowns_totales': return 'TDs';
      case 'pases_completos': return 'COMP';
      case 'sacks': return 'SACKS';
      case 'intercepciones': return 'INTs';
      default: return 'VAL';
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View key={`bg-${activeSport}`} entering={FadeIn.duration(800)} exiting={FadeOut} style={StyleSheet.absoluteFillObject}>
        <Image source={{ uri: sportBgImage }} style={styles.ambientImage} blurRadius={40} />
        <LinearGradient
          colors={[`rgba(5,5,5,0.4)`, `rgba(5,5,5,0.95)`, `#050505`]}
          locations={[0, 0.4, 0.7]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: activeColor, opacity: 0.05 }]} />
      </Animated.View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 140 }} 
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        <Animated.View entering={FadeInDown.duration(600)} style={[styles.modernHeader, { paddingTop: insets.top + 10 }]}>
          <Text style={[styles.telemetryText, { color: activeColor }]}>// {sport.key.toUpperCase()}.DIRECTIVE</Text>
          <Text style={styles.massiveTitle}>
            DATA<Text style={{ color: activeColor }}>HUB.</Text>
          </Text>
        </Animated.View>

        <View style={{ zIndex: 10 }}>
          <BlurView intensity={80} tint="dark" style={styles.stickyHeader}>
            <Animated.View style={[styles.energyLine, { backgroundColor: activeColor, shadowColor: activeColor }]} />
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
              {SPORTS.map((s) => {
                const isActive = s.key === activeSport;
                const sAccent = (colors as any)[s.accent] || "#39FF14";
                return (
                  <Pressable
                    key={s.key}
                    onPress={() => handleSportChange(s.key)}
                    style={[
                      styles.chip,
                      isActive ? { backgroundColor: sAccent, borderColor: sAccent } : { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }
                    ]}
                  >
                    {isActive && <View style={[styles.chipGlow, { backgroundColor: sAccent }]} />}
                    <MaterialCommunityIcons name={s.icon as any} size={16} color={isActive ? "#000" : "#888"} style={{ marginRight: 6 }} />
                    <Text style={[styles.chipText, { color: isActive ? "#000" : "#888" }]}>{s.name.toUpperCase()}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.toggleContainer}>
              <Pressable 
                style={[styles.toggleBtn, viewMode === "teams" && { backgroundColor: 'rgba(255,255,255,0.1)' }]}
                onPress={() => setViewMode("teams")}
              >
                <Ionicons name="shield" size={14} color={viewMode === "teams" ? activeColor : "rgba(255,255,255,0.5)"} />
                <Text style={[styles.toggleText, { color: viewMode === "teams" ? "#FFF" : "rgba(255,255,255,0.5)" }]}>ESCUADRONES</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.toggleBtn, viewMode === "players" && { backgroundColor: 'rgba(255,255,255,0.1)' }]}
                onPress={() => setViewMode("players")}
              >
                <Ionicons name="people" size={14} color={viewMode === "players" ? activeColor : "rgba(255,255,255,0.5)"} />
                <Text style={[styles.toggleText, { color: viewMode === "players" ? "#FFF" : "rgba(255,255,255,0.5)" }]}>ATLETAS</Text>
              </Pressable>
            </View>

            <Animated.View key={`tourneys-${activeSport}`} entering={FadeInDown.duration(300)}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tournamentFilters}>
                {TOURNAMENTS[activeSport]?.map((tourney) => {
                  const isActive = tourney === activeTournament;
                  return (
                    <Pressable
                      key={tourney}
                      onPress={() => setActiveTournament(tourney)}
                      style={[styles.tourneyChip, isActive && { borderBottomColor: activeColor }]}
                    >
                      <Text style={[styles.tourneyChipText, { color: isActive ? activeColor : 'rgba(255,255,255,0.4)' }]}>
                        {tourney.toUpperCase()}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Animated.View>

            {viewMode === "players" && (
              <Animated.View entering={FadeInDown.duration(400)} style={styles.playerFiltersWrapper}>
                <View style={styles.filterMainRow}>
                  <Pressable 
                    style={[styles.filterMainBtn, activeStatCategory === "ofensiva" && { backgroundColor: 'rgba(57,255,20,0.1)', borderColor: activeColor }]} 
                    onPress={() => handleCategoryPress("ofensiva")}
                  >
                    <Text style={[styles.filterMainText, { color: activeStatCategory === "ofensiva" ? activeColor : 'rgba(255,255,255,0.5)' }]}>⚔️ OFENSIVA</Text> 
                  </Pressable>
                  <Pressable 
                    style={[styles.filterMainBtn, activeStatCategory === "defensa" && { backgroundColor: 'rgba(255,57,57,0.1)', borderColor: '#FF3939' }]} 
                    onPress={() => handleCategoryPress("defensa")}
                  >
                    <Text style={[styles.filterMainText, { color: activeStatCategory === "defensa" ? '#FF3939' : 'rgba(255,255,255,0.5)' }]}>🛡️ DEFENSA</Text>
                  </Pressable>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterSubScroll}>
                  {activeStatCategory === "ofensiva" && (
                    <>
                      <StatChip type="touchdowns_totales" label="🏈 Anotaciones" active={statType} onPress={setStatType} accent={activeColor} />
                      <StatChip type="pases_completos" label="🎯 QB Pass" active={statType} onPress={setStatType} accent={activeColor} />
                    </>
                  )}
                  {activeStatCategory === "defensa" && (
                    <>
                      <StatChip type="sacks" label="🛑 Sacks" active={statType} onPress={setStatType} accent="#FF3939" />
                      <StatChip type="intercepciones" label="🤲 Intercepciones" active={statType} onPress={setStatType} accent="#FF3939" />
                    </>
                  )}
                </ScrollView>
              </Animated.View>
            )}
          </BlurView>
        </View>

        <Animated.View key={`banner-${activeTournament}-${activeSport}`} entering={FadeIn.duration(500)} style={styles.bannerContainer}>
          <View style={[styles.bannerCard, { borderColor: `${activeColor}40`, shadowColor: activeColor }]}>
            <Image source={{ uri: sportBgImage }} style={StyleSheet.absoluteFillObject} />
            <LinearGradient colors={['rgba(0,0,0,0.5)', '#050505']} style={StyleSheet.absoluteFillObject} />
            
            <MaterialCommunityIcons name={sport.icon as any} size={180} color={activeColor} style={styles.bannerBgIcon} />

            <View style={styles.bannerContent}>
              <View style={styles.bannerTopRow}>
                <View style={[styles.highlightTag, { backgroundColor: activeColor }]}>
                  <Text style={styles.highlightTagText}>
                    SEASON INTEL
                  </Text>
                </View>
                <Feather name="activity" size={20} color={activeColor} />
              </View>
              
              <View style={{ marginTop: 'auto' }}>
                <Text style={styles.bannerTitle} numberOfLines={2}>{activeTournament}</Text>
                <Text style={[styles.bannerDesc, { color: activeColor }]} numberOfLines={1}>
                  {isRealData ? "DATOS EN VIVO" : "LIGA ACTIVA"} // {sport.name.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={styles.tableSection}>
          <View style={styles.sectionHeaderWrap}>
            <View style={[styles.verticalAccent, { backgroundColor: activeColor }]} />
            <Text style={styles.sectionTitle}>
              {viewMode === "teams" ? "CLASIFICACIÓN OFICIAL" : "RÁNKING INDIVIDUAL"}
            </Text>
          </View>
          
          {isLoadingDb ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={activeColor} />
              <Text style={{ color: activeColor, marginTop: 15, fontFamily: 'Inter_700Bold' }}>CONECTANDO A BASE DE DATOS...</Text>
            </View>
          ) : viewMode === "teams" ? (
            
            <View style={[styles.tableCard, { borderColor: `${activeColor}20` }]}>
              <View style={[styles.tableHeader, { backgroundColor: 'rgba(255,255,255,0.02)' }]}>
                <Text style={[styles.th, { width: 35 }]}>#</Text>
                <Text style={[styles.th, { flex: 1, textAlign: 'left' }]}>ESCUADRÓN</Text>
                {renderTableHeaders()}
              </View>

              {displayTeams.length === 0 ? (
                <Animated.View entering={ZoomIn.springify()} style={styles.empty}>
                  <View style={styles.radarContainer}>
                    <View style={[styles.radarCircle, { borderColor: `${activeColor}40` }]} />
                    <MaterialCommunityIcons name={sport.icon as any} size={48} color={activeColor} style={{ opacity: 0.8 }} />
                  </View>
                  <Text style={styles.emptyTitle}>SISTEMA EN ESPERA</Text>
                  <Text style={styles.emptyText}>Los registros para {activeTournament} se están procesando.</Text>
                </Animated.View>
              ) : (
                <Animated.View layout={LinearTransition.springify()}>
                  {displayTeams.map((team, index) => {
                    const isTop = index < 3; 
                    const teamName = isRealData ? team.team_name : team.name;
                    const keyId = isRealData ? `api-${teamName}-${index}` : team.id;
                    
                    return (
                      <Animated.View key={keyId} entering={FadeInDown.delay(index * 60).springify()}>
                        <Pressable style={({ pressed }) => [
                          styles.tableRow, 
                          pressed && { backgroundColor: 'rgba(255,255,255,0.05)' },
                          index === displayTeams.length - 1 && { borderBottomWidth: 0 }
                        ]}>
                          
                          {isTop && (
                            <LinearGradient colors={[`${activeColor}15`, 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0.8, y: 0 }} style={StyleSheet.absoluteFillObject} />
                          )}
                          {isTop && <View style={[styles.qualifyBar, { backgroundColor: activeColor, shadowColor: activeColor }]} />}
                          
                          <Text style={[styles.tdPos, isTop ? { color: activeColor, textShadowColor: activeColor, textShadowRadius: 8 } : { color: 'rgba(255,255,255,0.3)' }]}>
                            0{index + 1}
                          </Text>
                          
                          <View style={styles.tdTeam}>
                            <View style={[styles.teamBadgeBadge, { backgroundColor: !isRealData ? team.colorHex : '#222', borderColor: isTop ? activeColor : '#333' }]}>
                              <Text style={styles.teamBadgeText}>
                                {!isRealData ? (team.short?.substring(0, 2) || 'TM') : teamName.substring(0, 2).toUpperCase()}
                              </Text>
                            </View>
                            <Text style={[styles.tdTeamName, isTop && { color: '#FFF' }]} numberOfLines={1}>{teamName}</Text>
                          </View>

                          {renderTeamStats(team, index)}
                        </Pressable>
                      </Animated.View>
                    );
                  })}
                </Animated.View>
              )}
            </View>

          ) : (

            <View style={styles.playersList}>
              {displayPlayers.length === 0 ? (
                <Animated.View entering={ZoomIn.springify()} style={[styles.empty, { borderWidth: 1, borderColor: `${activeColor}30`, borderRadius: 16 }]}>
                  <Ionicons name="medal-outline" size={48} color={activeColor} style={{ opacity: 0.5 }} />
                  <Text style={styles.emptyTitle}>SIN REGISTROS</Text>
                  <Text style={styles.emptyText}>Aún no hay atletas procesados en esta categoría.</Text>
                </Animated.View>
              ) : (
                displayPlayers.map((player, index) => {
                  const isPodium = index < 3;
                  const rankColor = index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : index === 2 ? "#CD7F32" : activeColor;
                  const hasPhoto = player.photo_url && player.photo_url.trim() !== "" && !player.photo_url.startsWith("blob:");

                  return (
                    <Animated.View key={player.id || `p-${index}`} entering={FadeInDown.delay(index * 50).springify()}>
                      <Pressable style={({pressed}) => [
                        styles.playerCard,
                        { borderColor: isPodium ? rankColor : 'rgba(255,255,255,0.05)' },
                        pressed && { backgroundColor: 'rgba(255,255,255,0.05)' }
                      ]}>
                        
                        {isPodium && (
                          <LinearGradient colors={[`${rankColor}10`, 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFillObject} />
                        )}

                        <View style={[styles.playerRankBadge, { backgroundColor: isPodium ? rankColor : 'rgba(255,255,255,0.1)' }]}>
                          <Text style={[styles.playerRankText, { color: isPodium ? '#000' : '#FFF' }]}>{index + 1}</Text>
                        </View>

                        <View style={styles.playerAvatarWrapper}>
                          {hasPhoto ? (
                            <Image source={{ uri: player.photo_url }} style={[styles.playerAvatar, { borderColor: isPodium ? rankColor : '#333' }]} />
                          ) : (
                            <View style={[styles.playerAvatar, { backgroundColor: '#111', borderColor: isPodium ? rankColor : '#333', justifyContent: 'center', alignItems: 'center' }]}>
                              <Ionicons name="person" size={20} color="rgba(255,255,255,0.3)" />
                            </View>
                          )}
                        </View>

                        <View style={styles.playerInfo}>
                          <Text style={[styles.playerName, isPodium && { color: '#FFF' }]} numberOfLines={1}>{player.name}</Text>
                          <Text style={styles.playerTeamName} numberOfLines={1}>{player.team_name}</Text>
                        </View>

                        <View style={[styles.playerStatBox, { borderColor: isPodium ? rankColor : activeColor }]}>
                          <Text style={[styles.playerStatNum, { color: isPodium ? rankColor : activeColor }]}>{player[statType] || 0}</Text>
                          <Text style={styles.playerStatLabel}>{getStatLabel(statType)}</Text>
                        </View>

                      </Pressable>
                    </Animated.View>
                  );
                })
              )}
            </View>
          )}

        </View>

      </ScrollView>
    </View>
  );
}

const StatChip = ({ type, label, active, onPress, accent }: any) => {
  const isActive = active === type;
  return (
    <Pressable 
      style={[
        styles.statChip, 
        isActive ? { backgroundColor: `${accent}20`, borderColor: accent } : { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }
      ]} 
      onPress={() => onPress(type)}
    >
      <Text style={[
        styles.statChipText, 
        { color: isActive ? accent : 'rgba(255,255,255,0.5)' }
      ]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', position: 'relative' },
  
  ambientImage: { width: '100%', height: height * 0.5, opacity: 0.6 },
  modernHeader: { paddingHorizontal: 24, paddingBottom: 15, zIndex: 2 },
  telemetryText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 2, marginBottom: 5 },
  massiveTitle: { fontFamily: 'Inter_900Black', fontSize: 56, lineHeight: 56, letterSpacing: -2, color: '#FFF' },

  stickyHeader: { backgroundColor: 'rgba(5,5,5,0.85)', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  energyLine: { height: 2, width: '100%', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8, elevation: 5 },
  
  filters: { paddingHorizontal: 24, paddingTop: 15, paddingBottom: 10, gap: 10 },
  chip: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' },
  chipGlow: { position: 'absolute', width: '150%', height: '150%', borderRadius: 24, opacity: 0.3, zIndex: -1 },
  chipText: { fontFamily: 'Inter_800ExtraBold', fontSize: 11, letterSpacing: 1 },

  toggleContainer: { flexDirection: 'row', marginHorizontal: 24, marginVertical: 10, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 4 },
  toggleBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderRadius: 6, gap: 8 },
  toggleText: { fontFamily: 'Inter_800ExtraBold', fontSize: 10, letterSpacing: 1 },

  tournamentFilters: { paddingHorizontal: 24, paddingBottom: 12, gap: 24 },
  tourneyChip: { paddingVertical: 6, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tourneyChipText: { fontFamily: 'Inter_800ExtraBold', fontSize: 12, letterSpacing: 1 },

  playerFiltersWrapper: { paddingBottom: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  filterMainRow: { flexDirection: 'row', paddingHorizontal: 24, paddingTop: 12, gap: 10, marginBottom: 12 },
  filterMainBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.02)' },
  filterMainText: { fontFamily: 'Inter_900Black', fontSize: 10, letterSpacing: 0.5 },
  
  filterSubScroll: { paddingHorizontal: 24, gap: 10 },
  statChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  statChipText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.5 },

  bannerContainer: { paddingHorizontal: 24, paddingTop: 30, marginBottom: 30 },
  bannerCard: { height: 180, borderRadius: 16, overflow: 'hidden', backgroundColor: '#0A0A0A', borderWidth: 1, position: 'relative', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 10 },
  bannerBgIcon: { position: 'absolute', right: -20, bottom: -20, opacity: 0.15, transform: [{ rotate: '-10deg' }] },
  bannerContent: { flex: 1, padding: 20, zIndex: 2 },
  bannerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  highlightTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, transform: [{ skewX: '-10deg' }] },
  highlightTagText: { color: "#000", fontFamily: "Inter_900Black", fontSize: 10, letterSpacing: 1 },
  bannerTitle: { color: '#FFF', fontFamily: 'Inter_900Black', fontSize: 32, lineHeight: 34, letterSpacing: -1, marginBottom: 4 },
  bannerDesc: { fontFamily: "Inter_700Bold", fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },

  tableSection: { paddingHorizontal: 24 },
  sectionHeaderWrap: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  verticalAccent: { width: 4, height: 18, borderRadius: 2, marginRight: 10, transform: [{ skewX: '-10deg' }] },
  sectionTitle: { fontFamily: 'Inter_900Black', fontSize: 15, color: '#FFF', letterSpacing: 1.5 },
  
  tableCard: { backgroundColor: '#0A0A0A', borderRadius: 16, paddingBottom: 4, overflow: 'hidden', borderWidth: 1 },
  tableHeader: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  th: { color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter_800ExtraBold', fontSize: 10, letterSpacing: 1, textAlign: 'center' },
  thHighlight: { fontFamily: 'Inter_900Black', fontSize: 10, letterSpacing: 1, textAlign: 'center' },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.05)', position: 'relative' },
  qualifyBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, shadowOffset: { width: 2, height: 0 }, shadowOpacity: 1, shadowRadius: 6 },
  tdPos: { width: 35, fontFamily: 'Inter_900Black', fontSize: 14 },
  tdTeam: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, paddingRight: 10 },
  teamBadgeBadge: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, transform: [{ rotate: '-5deg' }] },
  teamBadgeText: { color: '#FFF', fontFamily: 'Inter_800ExtraBold', fontSize: 11 },
  tdTeamName: { flex: 1, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_700Bold', fontSize: 14, letterSpacing: -0.5 },
  tdStat: { width: 25, textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  tdHighlightWrap: { paddingVertical: 6, borderRadius: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  tdPts: { fontFamily: 'Inter_900Black', fontSize: 13 },

  playersList: { gap: 12 },
  playerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0A0A0A', padding: 14, borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  playerRankBadge: { width: 30, height: 30, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12, transform: [{ skewX: '-5deg' }] },
  playerRankText: { fontFamily: 'Inter_900Black', fontSize: 13 },
  playerAvatarWrapper: { marginRight: 14 },
  playerAvatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2 },
  playerInfo: { flex: 1, justifyContent: 'center', paddingRight: 10 },
  playerName: { fontFamily: 'Inter_800ExtraBold', fontSize: 15, color: 'rgba(255,255,255,0.8)', letterSpacing: -0.5, marginBottom: 2 },
  playerTeamName: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  playerStatBox: { minWidth: 50, alignItems: 'flex-end', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.02)' },
  playerStatNum: { fontFamily: 'Inter_900Black', fontSize: 18, letterSpacing: -1 },
  playerStatLabel: { fontFamily: 'Inter_800ExtraBold', fontSize: 8, color: 'rgba(255,255,255,0.4)', marginTop: -2 },

  empty: { padding: 40, alignItems: "center", justifyContent: "center", marginTop: 20, marginBottom: 20 },
  radarContainer: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative' },
  radarCircle: { position: 'absolute', width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderStyle: 'dashed' },
  emptyTitle: { fontFamily: "Inter_900Black", fontSize: 16, color: '#FFF', letterSpacing: 1.5, marginBottom: 8 },
  emptyText: { fontFamily: "Inter_500Medium", fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: "center", lineHeight: 20 },
});