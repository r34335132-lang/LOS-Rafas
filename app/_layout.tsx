import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue"; // <-- Fuente ROCA Sports
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider } from "@/context/AppContext";
import colors from "@/constants/colors";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.dark.background },
        headerTintColor: colors.dark.foreground,
        headerTitleStyle: {
          fontFamily: "BebasNeue_400Regular", // <-- Toque agresivo en los títulos
          fontSize: 26, // Más grande para que impacte
          color: colors.dark.foreground,
        },
        contentStyle: { backgroundColor: colors.dark.background },
        headerBackTitle: "Atrás",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="auth"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen
        name="team/[id]"
        options={{ title: "EQUIPO", headerTransparent: false }}
      />
      <Stack.Screen
        name="news/[id]"
        options={{ title: "", headerTransparent: true }}
      />
      <Stack.Screen
        name="tracker"
        options={{ title: "TRACKER", headerTransparent: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    BebasNeue_400Regular, // <-- Cargamos la nueva fuente
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.dark.background }}>
            <KeyboardProvider>
              <AppProvider>
                <StatusBar style="light" />
                <RootLayoutNav />
              </AppProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}