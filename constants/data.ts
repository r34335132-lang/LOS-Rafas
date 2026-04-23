export type SportKey = "flag" | "soccer" | "basketball" | "fitness";

export type Sport = {
  key: SportKey;
  name: string;
  accent:
    | "sportFlag"
    | "sportSoccer"
    | "sportBasketball"
    | "sportFitness";
  icon: string;
  highlighted?: boolean;
  description: string;
};

export const SPORTS: Sport[] = [
  {
    key: "flag",
    name: "Flag Football",
    accent: "sportFlag",
    icon: "flag",
    highlighted: true,
    description: "La liga estrella de Durango",
  },
  {
    key: "soccer",
    name: "Fútbol",
    accent: "sportSoccer",
    icon: "circle",
    description: "Liga local y juveniles",
  },
  {
    key: "basketball",
    name: "Basquetbol",
    accent: "sportBasketball",
    icon: "disc",
    description: "Duela ardiente todo el año",
  },
  {
    key: "fitness",
    name: "Fitness",
    accent: "sportFitness",
    icon: "activity",
    description: "Crossfit, running y más",
  },
];

export type PlayerStats = {
  // Flag Football
  touchdowns?: number;
  yards?: number;
  interceptions?: number;
  // Soccer
  goals?: number;
  assists?: number;
  yellowCards?: number;
  // Basketball
  pointsPerGame?: number;
  rebounds?: number;
  assistsBb?: number;
};

export type Player = {
  id: string;
  name: string;
  position: string;
  number: number;
  image: string;
  stats: PlayerStats;
};

export type Team = {
  id: string;
  name: string;
  short: string;
  city: string;
  sport: SportKey;
  founded: number;
  colorHex: string;
  wins: number;
  losses: number;
  ties: number;
  players: Player[];
  recent: { opponent: string; result: "W" | "L" | "T"; score: string }[];
};

export const TEAMS: Team[] = [
  {
    id: "pumas-durango",
    name: "Pumas de Durango",
    short: "PUM",
    city: "Durango",
    sport: "flag",
    founded: 2014,
    colorHex: "#FF6A00",
    wins: 9,
    losses: 2,
    ties: 0,
    players: [
      { id: "p1", name: "Diego Ramírez", position: "QB", number: 7, image: "https://i.pravatar.cc/150?u=diego", stats: { touchdowns: 18, yards: 1250, interceptions: 2 } },
      { id: "p2", name: "Angel Gonzalez", position: "WR", number: 11, image: "https://i.pravatar.cc/150?u=angel", stats: { touchdowns: 12, yards: 890 } },
      { id: "p3", name: "Mateo Vega", position: "RB", number: 22, image: "https://i.pravatar.cc/150?u=mateo", stats: { touchdowns: 5, yards: 450 } },
      { id: "p4", name: "Iván Estrada", position: "LB", number: 55, image: "https://i.pravatar.cc/150?u=ivan", stats: { interceptions: 4 } },
      { id: "p5", name: "Luis Cárdenas", position: "DB", number: 24, image: "https://i.pravatar.cc/150?u=luis", stats: { interceptions: 6 } },
    ],
    recent: [
      { opponent: "Halcones FC", result: "W", score: "28-14" },
      { opponent: "Lobos del Guadiana", result: "W", score: "35-21" },
      { opponent: "Toros de Gómez", result: "L", score: "17-24" },
    ],
  },
  {
    id: "alacranes-fc",
    name: "Alacranes FC",
    short: "ALA",
    city: "Durango",
    sport: "soccer",
    founded: 2009,
    colorHex: "#E10600",
    wins: 12,
    losses: 4,
    ties: 3,
    players: [
      { id: "p6", name: "Carlos Méndez", position: "POR", number: 1, image: "https://i.pravatar.cc/150?u=carlos", stats: { yellowCards: 1 } },
      { id: "p7", name: "Bruno Tavares", position: "DEF", number: 4, image: "https://i.pravatar.cc/150?u=bruno", stats: { goals: 2, yellowCards: 4 } },
      { id: "p8", name: "Hugo Rentería", position: "MED", number: 8, image: "https://i.pravatar.cc/150?u=hugo", stats: { goals: 4, assists: 8 } },
      { id: "p9", name: "Sergio Lara", position: "DEL", number: 9, image: "https://i.pravatar.cc/150?u=sergio", stats: { goals: 14, assists: 2 } },
      { id: "p10", name: "Pablo Ortiz", position: "DEL", number: 10, image: "https://i.pravatar.cc/150?u=pablo", stats: { goals: 9, assists: 6 } },
    ],
    recent: [
      { opponent: "Mineros JR", result: "W", score: "3-1" },
      { opponent: "Ciervos Durango", result: "T", score: "2-2" },
      { opponent: "Coras Locales", result: "W", score: "4-0" },
    ],
  },
  {
    id: "lobos-guadiana",
    name: "Lobos del Guadiana",
    short: "LOB",
    city: "Durango",
    sport: "basketball",
    founded: 2017,
    colorHex: "#0057FF",
    wins: 14,
    losses: 6,
    ties: 0,
    players: [
      { id: "p11", name: "Jorge Pineda", position: "PG", number: 3, image: "https://i.pravatar.cc/150?u=jorge", stats: { pointsPerGame: 22.5, assistsBb: 8.2 } },
      { id: "p12", name: "Andrés Quiroz", position: "SG", number: 14, image: "https://i.pravatar.cc/150?u=andres", stats: { pointsPerGame: 18.0, rebounds: 4.1 } },
      { id: "p13", name: "Tomás Bravo", position: "SF", number: 21, image: "https://i.pravatar.cc/150?u=tomas", stats: { pointsPerGame: 14.3, rebounds: 6.5 } },
      { id: "p14", name: "Iker Salinas", position: "PF", number: 32, image: "https://i.pravatar.cc/150?u=iker", stats: { pointsPerGame: 10.1, rebounds: 9.8 } },
      { id: "p15", name: "Marco Téllez", position: "C", number: 50, image: "https://i.pravatar.cc/150?u=marco", stats: { pointsPerGame: 16.8, rebounds: 12.4 } },
    ],
    recent: [
      { opponent: "Halcones BBC", result: "W", score: "88-79" },
      { opponent: "Búhos GP", result: "W", score: "102-91" },
      { opponent: "Tigres Norte", result: "L", score: "76-84" },
    ],
  },
  {
    id: "halcones-fc",
    name: "Halcones FC",
    short: "HAL",
    city: "Gómez Palacio",
    sport: "flag",
    founded: 2016,
    colorHex: "#FFD600",
    wins: 7,
    losses: 4,
    ties: 0,
    players: [
      { id: "p16", name: "Emilio Núñez", position: "QB", number: 12, image: "https://i.pravatar.cc/150?u=emilio", stats: { touchdowns: 14, yards: 1100, interceptions: 5 } },
      { id: "p17", name: "Rafa Cortés", position: "WR", number: 19, image: "https://i.pravatar.cc/150?u=rafa", stats: { touchdowns: 8, yards: 720 } },
      { id: "p18", name: "Alex Vidal", position: "RB", number: 33, image: "https://i.pravatar.cc/150?u=alex", stats: { touchdowns: 6, yards: 510 } },
    ],
    recent: [
      { opponent: "Pumas de Durango", result: "L", score: "14-28" },
      { opponent: "Toros de Gómez", result: "W", score: "21-13" },
    ],
  },
  {
    id: "ciervos-durango",
    name: "Ciervos Durango",
    short: "CIE",
    city: "Durango",
    sport: "soccer",
    founded: 2011,
    colorHex: "#00C853",
    wins: 10,
    losses: 5,
    ties: 4,
    players: [
      { id: "p19", name: "Raúl Aguilar", position: "POR", number: 1, image: "https://i.pravatar.cc/150?u=raul", stats: { yellowCards: 0 } },
      { id: "p20", name: "Daniel Pérez", position: "DEL", number: 9, image: "https://i.pravatar.cc/150?u=daniel", stats: { goals: 11, assists: 3 } },
    ],
    recent: [
      { opponent: "Alacranes FC", result: "T", score: "2-2" },
      { opponent: "Mineros JR", result: "W", score: "1-0" },
    ],
  },
  {
    id: "crossfit-victoria",
    name: "CrossFit Victoria",
    short: "CFV",
    city: "Durango",
    sport: "fitness",
    founded: 2019,
    colorHex: "#00C853",
    wins: 0,
    losses: 0,
    ties: 0,
    players: [
      { id: "p21", name: "Sofía Bañuelos", position: "RX", number: 1, image: "https://i.pravatar.cc/150?u=sofia", stats: {} },
      { id: "p22", name: "Karla Mejía", position: "RX", number: 2, image: "https://i.pravatar.cc/150?u=karla", stats: {} },
    ],
    recent: [],
  },
];

export type Match = {
  id: string;
  sport: SportKey;
  homeId: string;
  awayId: string;
  homeScore: number;
  awayScore: number;
  status: "live" | "scheduled" | "final";
  minute?: string;
  startTime?: string;
  venue: string;
};

export const MATCHES: Match[] = [
  {
    id: "m1",
    sport: "flag",
    homeId: "pumas-durango",
    awayId: "halcones-fc",
    homeScore: 21,
    awayScore: 14,
    status: "live",
    minute: "Q3 04:12",
    venue: "Estadio Francisco Villa",
  },
  {
    id: "m2",
    sport: "soccer",
    homeId: "alacranes-fc",
    awayId: "ciervos-durango",
    homeScore: 2,
    awayScore: 1,
    status: "live",
    minute: "67'",
    venue: "Cancha El Mezquital",
  },
  {
    id: "m3",
    sport: "basketball",
    homeId: "lobos-guadiana",
    awayId: "halcones-fc",
    homeScore: 64,
    awayScore: 58,
    status: "live",
    minute: "Q3 02:45",
    venue: "Auditorio del Pueblo",
  },
  {
    id: "m4",
    sport: "soccer",
    homeId: "ciervos-durango",
    awayId: "alacranes-fc",
    homeScore: 0,
    awayScore: 0,
    status: "scheduled",
    startTime: "Sáb 19:00",
    venue: "Cancha El Mezquital",
  },
  {
    id: "m5",
    sport: "flag",
    homeId: "halcones-fc",
    awayId: "pumas-durango",
    homeScore: 0,
    awayScore: 0,
    status: "scheduled",
    startTime: "Dom 11:00",
    venue: "Campo La Forestal",
  },
  {
    id: "m6",
    sport: "basketball",
    homeId: "lobos-guadiana",
    awayId: "halcones-fc",
    homeScore: 92,
    awayScore: 88,
    status: "final",
    venue: "Auditorio del Pueblo",
  },
];

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  sport: SportKey | "general";
  author: string;
  publishedAt: string;
  image?: string;
  tag: string;
};

export const NEWS: NewsItem[] = [
  {
    id: "n1",
    title: "Pumas se imponen en el clásico de Flag Football",
    excerpt:
      "Diego Ramírez lanza para 3 anotaciones y los Pumas vencen a Halcones 28-14.",
    body: "En una noche eléctrica en el Estadio Francisco Villa, los Pumas de Durango lograron una victoria contundente sobre los Halcones FC con marcador final de 28-14. El mariscal Diego Ramírez fue la figura del encuentro al conectar tres pases de anotación, dos de ellos hacia el receptor Angel Gonzalez. La defensiva, comandada por Iván Estrada, forzó tres pérdidas de balón claves. Con este resultado, los Pumas amplían su racha ganadora a cinco partidos y se colocan como líderes solitarios de la conferencia norte de la liga local.",
    sport: "flag",
    author: "Redacción Rugido",
    publishedAt: "Hace 2 h",
    tag: "FLAG FOOTBALL",
  },
  {
    id: "n2",
    title: "Alacranes FC vuelve a la cima del fútbol durangueño",
    excerpt:
      "Tras vencer 4-0 a Coras, el equipo rojo recupera el liderato general.",
    body: "El Alacranes FC firmó una de sus mejores actuaciones de la temporada al golear 4-0 a Coras Locales en la cancha El Mezquital. Pablo Ortiz se llevó los reflectores con un doblete, mientras que Sergio Lara y Hugo Rentería completaron la cuenta. El conjunto rojo recupera el liderato general con 39 puntos y se perfila como serio candidato al título.",
    sport: "soccer",
    author: "Mariana Llanos",
    publishedAt: "Hace 5 h",
    tag: "FÚTBOL",
  },
  {
    id: "n3",
    title: "Lobos del Guadiana sigue invicto en casa",
    excerpt:
      "El quinteto azul ha ganado todos sus partidos como local esta temporada.",
    body: "Lobos del Guadiana mantiene una marca perfecta de 8-0 en el Auditorio del Pueblo tras superar a Búhos GP 102-91. El base Jorge Pineda terminó con 27 puntos y 9 asistencias, mientras que el pívot Marco Téllez aportó un doble-doble de 18 puntos y 12 rebotes. La afición ha respondido con récord de asistencia en cinco de sus últimas seis presentaciones.",
    sport: "basketball",
    author: "Eduardo Carrasco",
    publishedAt: "Hace 8 h",
    tag: "BASQUET",
  },
  {
    id: "n4",
    title: "CrossFit Victoria abre su segunda sucursal en Durango",
    excerpt:
      "El gimnasio fundado por Sofía Bañuelos se expande hacia el oriente de la ciudad.",
    body: "CrossFit Victoria inauguró su segunda sucursal en la zona oriente de Durango, ofreciendo clases de strength, metabolic conditioning y movilidad. Su fundadora, la atleta Sofía Bañuelos, anunció también un programa juvenil gratuito para preparar a futuros competidores estatales.",
    sport: "fitness",
    author: "Redacción Rugido",
    publishedAt: "Hace 1 día",
    tag: "FITNESS",
  },
  {
    id: "n5",
    title: "Calendario completo de la jornada del fin de semana",
    excerpt:
      "Revisa todos los partidos confirmados sábado y domingo en Durango.",
    body: "La jornada deportiva en Durango estará cargada este fin de semana. El sábado abre a las 17:00 con el duelo de Ciervos vs. Alacranes en El Mezquital, seguido del clásico de Flag Football a las 11:00 del domingo entre Halcones y Pumas en Campo La Forestal. El cierre dominical será en el Auditorio del Pueblo con Lobos vs. Tigres Norte.",
    sport: "general",
    author: "Redacción Rugido",
    publishedAt: "Hace 1 día",
    tag: "AGENDA",
  },
  {
    id: "n6",
    title: "Angel Gonzalez, la nueva sensación del receptor durangueño",
    excerpt:
      "El receptor de 22 años promedia 2 anotaciones por partido esta temporada.",
    body: "Con apenas 22 años, Angel Gonzalez se ha convertido en la principal arma ofensiva de los Pumas de Durango. El receptor sumó otra noche brillante con 142 yardas y dos anotaciones frente a Halcones, llevando su total temporal a 18 touchdowns en sólo nueve juegos. Cazatalentos de la liga estatal ya han iniciado conversaciones con su representante.",
    sport: "flag",
    author: "Redacción Rugido",
    publishedAt: "Hace 3 h",
    tag: "PERFIL",
  },
];

export const TICKER_ITEMS = [
  "PUM 21 — HAL 14 · Q3",
  "ALA 2 — CIE 1 · 67'",
  "LOB 64 — HAL 58 · Q3",
  "FINAL · LOB 92 — HAL 88",
  "PROX · CIE vs ALA · Sáb 19:00",
];

export type LeaderboardEntry = {
  player: Player;
  teamShort: string;
  teamColor: string;
  statValue: number | string;
};

export const LEADERBOARDS = {
  soccer: {
    title: "Tabla de Goleo",
    statLabel: "GOLES",
    leaders: [
      { player: TEAMS.find(t => t.id === "alacranes-fc")!.players.find(p => p.name === "Sergio Lara")!, teamShort: "ALA", teamColor: "#E10600", statValue: 14 },
      { player: TEAMS.find(t => t.id === "ciervos-durango")!.players.find(p => p.name === "Daniel Pérez")!, teamShort: "CIE", teamColor: "#00C853", statValue: 11 },
      { player: TEAMS.find(t => t.id === "alacranes-fc")!.players.find(p => p.name === "Pablo Ortiz")!, teamShort: "ALA", teamColor: "#E10600", statValue: 9 },
    ] as LeaderboardEntry[]
  },
  flag: {
    title: "Líderes de Yardas (Pase)",
    statLabel: "YARDAS",
    leaders: [
      { player: TEAMS.find(t => t.id === "pumas-durango")!.players.find(p => p.name === "Diego Ramírez")!, teamShort: "PUM", teamColor: "#FF6A00", statValue: 1250 },
      { player: TEAMS.find(t => t.id === "halcones-fc")!.players.find(p => p.name === "Emilio Núñez")!, teamShort: "HAL", teamColor: "#FFD600", statValue: 1100 },
    ] as LeaderboardEntry[]
  },
  basketball: {
    title: "Puntos por Partido",
    statLabel: "PPP",
    leaders: [
      { player: TEAMS.find(t => t.id === "lobos-guadiana")!.players.find(p => p.name === "Jorge Pineda")!, teamShort: "LOB", teamColor: "#0057FF", statValue: 22.5 },
      { player: TEAMS.find(t => t.id === "lobos-guadiana")!.players.find(p => p.name === "Andrés Quiroz")!, teamShort: "LOB", teamColor: "#0057FF", statValue: 18.0 },
      { player: TEAMS.find(t => t.id === "lobos-guadiana")!.players.find(p => p.name === "Marco Téllez")!, teamShort: "LOB", teamColor: "#0057FF", statValue: 16.8 },
    ] as LeaderboardEntry[]
  }
};