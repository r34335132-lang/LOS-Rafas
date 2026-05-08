import { Feather, Ionicons } from "@expo/vector-icons"; // <-- Agregamos Ionicons para la bici
import { BlurView } from "expo-blur";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";

import { useColors } from "@/hooks/useColors";

export default function TabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme !== "light";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarLabelStyle: {
          fontFamily: "Inter_600SemiBold",
          fontSize: 10,
          letterSpacing: 0.3,
          marginBottom: isIOS ? 0 : 4,
        },
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.elevated,
          borderTopWidth: 0,
          elevation: 0,
          height: isIOS ? 88 : 64,
          paddingBottom: isIOS ? 30 : 10,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={95}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                { 
                  backgroundColor: colors.elevated, 
                  borderTopWidth: StyleSheet.hairlineWidth, 
                  borderTopColor: colors.border 
                },
              ]}
            />
          ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scores"
        options={{
          title: "En Vivo",
          tabBarIcon: ({ color }) => <Feather name="activity" size={22} color={color} />,
        }}
      />

      {/* 🚲 BOTÓN DE CICLISMO (FAB) PULIDO 🚲 */}
      <Tabs.Screen
        name="rodar"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => (
            <View style={styles.fabContainer}>
              <View style={[styles.fab, { backgroundColor: colors.primary }]}>
                {/* Ícono de Bicicleta Moderno */}
                <Ionicons name="bicycle" size={32} color="#000" style={styles.bikeIcon} />
              </View>
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/tracker");
          },
        }}
      />

      <Tabs.Screen
        name="sports"
        options={{
          title: "Ligas",
          tabBarIcon: ({ color }) => <Feather name="award" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} />,
        }}
      />
      
      {/* Ocultamos la pestaña de noticias */}
      <Tabs.Screen name="news" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60, // Contenedor más ajustado
    top: -12,   // Flota lo suficiente pero sin despegarse tanto
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    // Sombras súper suaves y premium estilo Apple
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    // Borde blanco/grisáceo para que resalte del fondo oscuro
    borderWidth: 4,
    borderColor: '#1C1C1C', 
  },
  bikeIcon: {
    marginLeft: 2, // Ajuste óptico para que la bici se vea 100% centrada
  }
});