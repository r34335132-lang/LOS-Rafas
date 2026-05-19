import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

export function LiveTicker({ items }: { items: string[] }) {
  const colors = useColors();
  const translate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(translate, {
        toValue: -1,
        duration: 20000, // Ligeramente más lento para poder leer bien las mayúsculas grandes
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [translate]);

  const TRACK_WIDTH = 1800; // Aumentamos el ancho de pista porque la fuente es más grande
  const x = translate.interpolate({
    inputRange: [-1, 0],
    outputRange: [-TRACK_WIDTH, 0],
  });

  const sequence = [...items, ...items, ...items];

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.elevated,
          borderTopColor: colors.border,
          borderBottomColor: colors.border,
        },
      ]}
    >
      {/* Etiqueta tipo "Broadcast Bug" de TV */}
      <View style={[styles.label, { backgroundColor: colors.primary }]}>
        <Text style={styles.labelText}>EN VIVO</Text>
      </View>

      <View style={styles.trackWrap}>
        <Animated.View
          style={[styles.track, { transform: [{ translateX: x }] }]}
        >
          {sequence.map((item, i) => (
            <View key={i} style={styles.item}>
              {/* Cuadro separador agresivo en lugar de un círculo */}
              <View
                style={[
                  styles.squareSeparator,
                  { backgroundColor: colors.primary },
                ]}
              />
              <Text style={[styles.itemText, { color: colors.foreground }]}>
                {item.toUpperCase()}
              </Text>
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    height: 44, // Más alto para acomodar la tipografía estilo estadio
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  label: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 12,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10, // Asegura que la etiqueta siempre esté por encima del texto que corre
    // Sombra para separarlo del fondo
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  labelText: {
    color: "#fff",
    fontFamily: "BebasNeue_400Regular", // Fuente deportiva
    fontSize: 18,
    letterSpacing: 1.5,
    marginTop: 2, // Ajuste óptico para Bebas Neue
  },
  trackWrap: {
    flex: 1,
    overflow: "hidden",
    height: "100%",
    justifyContent: "center",
  },
  track: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    height: "100%",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginRight: 32, // Más espacio entre noticias
  },
  squareSeparator: {
    width: 6,
    height: 6,
    // Eliminamos el border-radius para que sea un cuadrado agresivo
  },
  itemText: {
    fontFamily: "BebasNeue_400Regular",
    fontSize: 20, // Letra grande y legible
    letterSpacing: 1,
    marginTop: 4, // Ajuste óptico para Bebas Neue
  },
});