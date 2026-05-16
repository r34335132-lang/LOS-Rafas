import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInDown, withRepeat, withTiming, useSharedValue, useAnimatedStyle } from "react-native-reanimated";

import { useApp } from "@/context/AppContext";
import { useColors } from "hooks/useColors";

export default function AuthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signIn } = useApp();
  
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // --- MODO ESPÍA: EFECTO DE CÓDIGO (TYPEWRITER) ---
  const [terminalText, setTerminalText] = useState("");
  const textToType = mode === "login" 
    ? "> ESTABLECIENDO CONEXIÓN SEGURA...\n> ENCRIPTACIÓN NIVEL 4: ACTIVA.\n> ESPERANDO CREDENCIALES DE ACCESO..."
    : "> INICIANDO PROTOCOLO DE RECLUTAMIENTO...\n> GENERANDO NUEVO ID EN BASE DE DATOS...\n> ESPERANDO DATOS DEL OPERADOR...";

  useEffect(() => {
    setTerminalText("");
    let currentText = "";
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentText += textToType[currentIndex];
      setTerminalText(currentText);
      currentIndex++;
      if (currentIndex >= textToType.length) clearInterval(interval);
    }, 25); // Velocidad de escritura (milisegundos)

    return () => clearInterval(interval);
  }, [mode]);

  // --- ANIMACIÓN DEL CURSOR PARPADEANTE ---
  const cursorOpacity = useSharedValue(1);
  useEffect(() => {
    cursorOpacity.value = withRepeat(withTiming(0, { duration: 500 }), -1, true);
  }, []);
  const cursorStyle = useAnimatedStyle(() => ({ opacity: cursorOpacity.value }));

  // --- LÓGICA DE LOGIN ---
  const submit = async () => {
    setError(null);
    if (!email.includes("@") || password.length < 4) {
      setError("> ERROR 403: CREDENCIALES INVÁLIDAS.");
      return;
    }
    const display = mode === "register" && name.trim() ? name.trim() : email.split("@")[0]!;
    await signIn(email.trim(), display);
    router.back();
  };

  const activeAccent = colors.primary; // O puedes forzar un "#00FF41" para que parezca Matrix

  return (
    <View style={[styles.container, { backgroundColor: '#050505' }]}>
      <KeyboardAwareScrollView
        bottomOffset={20}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom + 24,
        }}
      >
        {/* TOP BAR - COMMAND ABORT */}
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.abortBtn}>
            <Text style={styles.abortText}>[ ABORTAR ]</Text>
          </Pressable>
        </View>

        {/* LOGO SYSTEM */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.brandWrap}>
          <Feather name="shield" size={48} color={activeAccent} style={{ marginBottom: 10 }} />
          <Text style={[styles.brandTitle, { color: '#FFF' }]}>SYS.RUGIDO.CORE</Text>
          <Text style={[styles.brandSub, { color: activeAccent }]}>V 1.0.4 // ACCESO RESTRINGIDO</Text>
        </Animated.View>

        {/* TERMINAL SCREEN (CONSOLA) */}
        <Animated.View entering={FadeIn.delay(300).duration(800)} style={styles.terminalBox}>
          <Text style={[styles.terminalText, { color: activeAccent }]}>
            {terminalText}
            <Animated.Text style={cursorStyle}>_</Animated.Text>
          </Text>
        </Animated.View>

        {/* FORMULARIO ESTILO TERMINAL */}
        <View style={styles.form}>
          
          {mode === "register" && (
            <View style={styles.inputWrap}>
              <Text style={[styles.prompt, { color: activeAccent }]}>{">"} ALIAS:</Text>
              <TextInput
                style={[styles.input, { color: '#FFF' }]}
                placeholder="[ INGRESE NOMBRE ]"
                placeholderTextColor="rgba(255,255,255,0.2)"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                selectionColor={activeAccent}
              />
            </View>
          )}

          <View style={styles.inputWrap}>
            <Text style={[styles.prompt, { color: activeAccent }]}>{">"} IDENTIFICADOR:</Text>
            <TextInput
              style={[styles.input, { color: '#FFF' }]}
              placeholder="[ CORREO ELECTRÓNICO ]"
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              selectionColor={activeAccent}
            />
          </View>

          <View style={styles.inputWrap}>
            <Text style={[styles.prompt, { color: activeAccent }]}>{">"} CLAVE:</Text>
            <TextInput
              style={[styles.input, { color: '#FFF' }]}
              placeholder="[ CONTRASEÑA ]"
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              selectionColor={activeAccent}
            />
          </View>

          {error && (
            <Animated.Text entering={FadeIn} style={styles.error}>
              {error}
            </Animated.Text>
          )}

          {/* BOTONES DE COMANDO */}
          <View style={{ marginTop: 20, gap: 16 }}>
            <Pressable
              onPress={submit}
              style={({ pressed }) => [
                styles.submit,
                { 
                  backgroundColor: pressed ? activeAccent : 'transparent',
                  borderColor: activeAccent 
                },
              ]}
            >
              {({ pressed }) => (
                <Text style={[styles.submitText, { color: pressed ? '#000' : activeAccent }]}>
                  {mode === "login" ? ">> EJECUTAR ACCESO" : ">> INICIAR REGISTRO"}
                </Text>
              )}
            </Pressable>

            <Pressable onPress={() => setMode(mode === "login" ? "register" : "login")} style={styles.toggle}>
              <Text style={styles.toggleText}>
                {mode === "login" ? "CMD: RECLUTAR_NUEVO_AGENTE" : "CMD: VOLVER_A_LOGIN"}
              </Text>
            </Pressable>
          </View>

        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // ABORT BUTTON
  topBar: { flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 24, paddingTop: 10 },
  abortBtn: { paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: 'rgba(255,0,0,0.5)', borderRadius: 4, backgroundColor: 'rgba(255,0,0,0.1)' },
  abortText: { fontFamily: 'Inter_800ExtraBold', fontSize: 10, color: '#FF3333', letterSpacing: 2 },

  // BRAND SECURE
  brandWrap: { alignItems: "center", paddingTop: 40, paddingBottom: 20 },
  brandTitle: { fontFamily: "Inter_900Black", fontSize: 28, letterSpacing: 6 },
  brandSub: { fontFamily: "Inter_700Bold", fontSize: 10, letterSpacing: 4, marginTop: 4 },

  // TERMINAL SCREEN
  terminalBox: {
    marginHorizontal: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 16,
    minHeight: 100, // Para que no brinque cuando escribe
    marginBottom: 20,
  },
  terminalText: {
    fontFamily: "monospace", // Usa fuente de código real del sistema
    fontSize: 12,
    lineHeight: 20,
    letterSpacing: 0.5,
  },

  // FORMULARIO TÁCTICO
  form: { paddingHorizontal: 24, gap: 16 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    paddingBottom: 8,
  },
  prompt: {
    fontFamily: "Inter_900Black",
    fontSize: 12,
    letterSpacing: 2,
    width: 140, // Ancho fijo para alinear los inputs como tabla
  },
  input: {
    flex: 1,
    fontFamily: "monospace", // La contraseña y el correo se ven como código
    fontSize: 14,
    paddingVertical: 0,
    letterSpacing: 1,
  },
  
  error: { fontFamily: "monospace", fontSize: 11, color: '#FF3333', marginTop: 10 },
  
  // COMMAND BUTTONS
  submit: {
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: "center",
  },
  submitText: { fontFamily: "Inter_900Black", fontSize: 14, letterSpacing: 3 },
  
  toggle: { alignItems: "center", paddingVertical: 12 },
  toggleText: { fontFamily: "monospace", fontSize: 11, color: 'rgba(255,255,255,0.5)', textDecorationLine: 'underline' },
});