import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function AuthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signIn } = useApp();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!email.includes("@") || password.length < 4) {
      setError("Verifica tu correo y contraseña.");
      return;
    }
    const display =
      mode === "register" && name.trim()
        ? name.trim()
        : email.split("@")[0]!;
    await signIn(email.trim(), display);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAwareScrollView
        bottomOffset={20}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            style={[styles.iconBtn, { backgroundColor: colors.card }]}
          >
            <Feather name="x" size={18} color={colors.foreground} />
          </Pressable>
        </View>

        <View style={styles.brandWrap}>
          <View style={[styles.brandBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.brandBadgeText}>R</Text>
          </View>
          <Text style={[styles.brandTitle, { color: colors.foreground }]}>
            RUGIDO
          </Text>
          <Text style={[styles.brandSub, { color: colors.primary }]}>
            DEPORTIVO DURANGO
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={[styles.heading, { color: colors.foreground }]}>
            {mode === "login" ? "Bienvenido de vuelta" : "Crea tu cuenta"}
          </Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            Sigue a tus equipos y guarda tus noticias favoritas.
          </Text>

          {mode === "register" ? (
            <View
              style={[
                styles.inputWrap,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name="user" size={16} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Nombre"
                placeholderTextColor={colors.mutedForeground}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          ) : null}

          <View
            style={[
              styles.inputWrap,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Feather name="mail" size={16} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Correo"
              placeholderTextColor={colors.mutedForeground}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View
            style={[
              styles.inputWrap,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Feather name="lock" size={16} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Contraseña"
              placeholderTextColor={colors.mutedForeground}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error ? (
            <Text style={[styles.error, { color: colors.destructive }]}>
              {error}
            </Text>
          ) : null}

          <Pressable
            onPress={submit}
            style={({ pressed }) => [
              styles.submit,
              { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Text style={styles.submitText}>
              {mode === "login" ? "Entrar" : "Crear cuenta"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setMode(mode === "login" ? "register" : "login")}
            style={styles.toggle}
          >
            <Text
              style={[
                styles.toggleText,
                { color: colors.mutedForeground },
              ]}
            >
              {mode === "login"
                ? "¿Aún sin cuenta? "
                : "¿Ya tienes cuenta? "}
              <Text
                style={{
                  color: colors.foreground,
                  fontFamily: "Inter_700Bold",
                }}
              >
                {mode === "login" ? "Regístrate" : "Inicia sesión"}
              </Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 18,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  brandWrap: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 12,
    gap: 6,
  },
  brandBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  brandBadgeText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 28,
  },
  brandTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    letterSpacing: 4,
  },
  brandSub: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 3,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
  },
  heading: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    letterSpacing: -0.5,
  },
  sub: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    paddingVertical: 0,
  },
  error: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  submit: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  submitText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  toggle: {
    alignItems: "center",
    paddingVertical: 12,
  },
  toggleText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
});
