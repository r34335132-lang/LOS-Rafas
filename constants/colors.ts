const palette = {
  red: "#E10600",
  redDark: "#B00400",
  black: "#0B0B0B",
  blackElevated: "#151515",
  blackCard: "#1C1C1E",
  white: "#FFFFFF",
  blue: "#0057FF",
  orange: "#FF6A00",
  green: "#00C853",
  yellow: "#FFD600",
  gray: "#8E8E93",
  grayLight: "#3A3A3C",
  grayDark: "#2C2C2E",
};

const sharedDark = {
  text: palette.white,
  tint: palette.red,

  background: palette.black,
  foreground: palette.white,

  card: palette.blackCard,
  cardForeground: palette.white,

  elevated: palette.blackElevated,

  primary: palette.red,
  primaryForeground: palette.white,

  secondary: palette.grayDark,
  secondaryForeground: palette.white,

  muted: palette.grayDark,
  mutedForeground: palette.gray,

  accent: palette.yellow,
  accentForeground: palette.black,

  destructive: "#FF3B30",
  destructiveForeground: palette.white,

  border: palette.grayLight,
  input: palette.grayDark,

  // Sport accents
  sportFlag: palette.orange,
  sportSoccer: palette.red,
  sportBasketball: palette.orange,
  sportFitness: palette.green,
  sportNews: palette.blue,

  // Status
  live: palette.red,
  liveFlash: palette.yellow,

  // Brand
  brandRed: palette.red,
  brandRedDark: palette.redDark,
  brandBlack: palette.black,
};

const colors = {
  light: sharedDark,
  dark: sharedDark,
  radius: 14,
};

export default colors;
