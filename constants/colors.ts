// constants/colors.ts

const palette = {
  neonGreen: "#39FF14", // Verde neón principal
  neonGreenDark: "#2DB30F",
  black: "#050505", // Negro ultra profundo
  blackElevated: "#111111",
  blackCard: "#1A1A1A",
  white: "#FFFFFF",
  blue: "#0057FF",
  orange: "#FF6A00",
  yellow: "#FFD600",
  gray: "#8E8E93",
  grayLight: "#3A3A3C",
  grayDark: "#222222",
};

const sharedDark = {
  text: palette.white,
  tint: palette.neonGreen, // <-- Cambiado a verde neón

  background: palette.black,
  foreground: palette.white,

  card: palette.blackCard,
  cardForeground: palette.white,

  elevated: palette.blackElevated,

  primary: palette.neonGreen, // <-- Cambiado a verde neón
  primaryForeground: palette.black, // Texto negro sobre botones verdes para máximo contraste

  secondary: palette.grayDark,
  secondaryForeground: palette.white,

  muted: palette.grayDark,
  mutedForeground: palette.gray,

  accent: palette.yellow,
  accentForeground: palette.black,

  border: palette.grayLight,
  input: palette.grayDark,

  // Status
  live: palette.neonGreen,
  liveFlash: palette.neonGreenDark,

  // Brand
  brandPrimary: palette.neonGreen,
  brandBlack: palette.black,
};

const colors = {
  light: sharedDark, // Forzamos el tema oscuro inmersivo
  dark: sharedDark,
  radius: 14,
};

export default colors;