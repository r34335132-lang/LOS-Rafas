import { Feather, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // <-- Importamos los Insets

import { useColors } from "@/hooks/useColors";

export default function TabLayout() {
  const colors = useColors();
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";
  const router = useRouter();
  
  // Detecta el espacio que ocupan los botones de Android o la barra de iOS
  const insets = useSafeAreaInsets(); 
  
  // Calculamos márgenes dinámicos. Si no hay botones/barra (insets = 0), dejamos 10px de gracia.
  const bottomPadding = insets.bottom > 0 ? insets.bottom : 10;
  // La altura será de 60px (base de los iconos) + el espacio de los botones del teléfono
  const tabHeight = isWeb ? 84 : 60 + bottomPadding;

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
          height: tabHeight, // <-- Altura dinámica
          paddingBottom: bottomPadding, // <-- Padding dinámico
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={95}
              tint="dark"
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
          title: "Inicio",
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

      <Tabs.Screen
        name="rodar"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => (
            <View style={styles.fabContainer}>
              <View style={[
                styles.fab, 
                { 
                  backgroundColor: colors.primary,
                  borderColor: colors.background
                }
              ]}>
                <Ionicons 
                  name="bicycle" 
                  size={32} 
                  color={colors.background}
                  style={styles.bikeIcon} 
                />
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
      
      <Tabs.Screen name="news" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    top: -12, 
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#E10600",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
  },
  bikeIcon: {
    marginLeft: 2, 
  }
});