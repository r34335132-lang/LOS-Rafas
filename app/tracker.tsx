import { Feather, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Location from "expo-location";
import * as Sharing from "expo-sharing";
import * as ImagePicker from "expo-image-picker"; 
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";
import { LinearGradient } from "expo-linear-gradient";

import { useColors } from "@/hooks/useColors";

function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

function formatTime(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function TrackerScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const viewShotRef = useRef<ViewShot>(null);

  const [isTracking, setIsTracking] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false); 
  const [photoBg, setPhotoBg] = useState<string | null>(null); 

  const [route, setRoute] = useState<Location.LocationObjectCoords[]>([]);
  const [distance, setDistance] = useState(0); 
  const [duration, setDuration] = useState(0); 
  const [currentSpeed, setCurrentSpeed] = useState(0); 

  const avgSpeedKmh = duration > 0 ? distance / (duration / 3600) : 0;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      mapRef.current?.animateToRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1500);
    })();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTracking) {
      timer = setInterval(() => setDuration((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isTracking]);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    const startTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos tu ubicación.');
        setIsTracking(false);
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation, 
          timeInterval: 1000, 
          distanceInterval: 2, 
        },
        (location) => {
          if (location.coords.accuracy && location.coords.accuracy > 15) return; 

          const speedKmh = location.coords.speed && location.coords.speed > 0 
            ? location.coords.speed * 3.6 : 0;
          setCurrentSpeed(speedKmh);

          setRoute((prev) => {
            const newRoute = [...prev, location.coords];
            if (prev.length > 0) {
              const lastPoint = prev[prev.length - 1];
              const dist = getDistanceInKm(
                lastPoint.latitude, lastPoint.longitude,
                location.coords.latitude, location.coords.longitude
              );
              setDistance((d) => d + dist);
            }
            
            mapRef.current?.animateCamera({
              center: location.coords,
              pitch: 50,
              zoom: 18.5,
              heading: speedKmh > 2 ? location.coords.heading : undefined, 
            }, { duration: 1000 }); 

            return newRoute;
          });
        }
      );
    };

    if (isTracking) startTracking();
    else {
      subscription?.remove();
      setCurrentSpeed(0); 
    }
    return () => { subscription?.remove(); };
  }, [isTracking]);

  const toggleTracking = () => setIsTracking(!isTracking);

  const shareRoute = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso necesario', 'Necesitamos acceso a tu cámara para tomar la foto.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoBg(result.assets[0].uri);
      setIsCapturing(true);
      
      setTimeout(async () => {
        try {
          if (viewShotRef.current && viewShotRef.current.capture) {
            const uri = await viewShotRef.current.capture();
            
            setIsCapturing(false);
            setPhotoBg(null);
            
            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
              await Sharing.shareAsync(uri, {
                dialogTitle: 'Mi ruta en Rugido Deportivo',
                mimeType: 'image/jpeg',
              });
            }
          }
        } catch (error) {
          console.error("Error al compartir:", error);
          setIsCapturing(false);
          setPhotoBg(null);
        }
      }, 500); 
    }
  };

  const dateString = new Date().toLocaleDateString('es-MX', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();

  return (
    <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 1.0 }} style={styles.container}>
      
      {/* 1. EL MAPA NUNCA SE DESMONTA. SIEMPRE ESTÁ DE FONDO */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_DEFAULT}
        showsUserLocation={!isCapturing} 
        showsMyLocationButton={false}
        showsCompass={false}
        showsBuildings={true}
        userInterfaceStyle={colors.background === '#000000' ? "dark" : "light"}
      >
        {route.length > 0 && (
          <Polyline coordinates={route} strokeColor={colors.primary} strokeWidth={8} lineCap="round" lineJoin="round" />
        )}
      </MapView>

      {/* 2. LA FOTO SE PONE ENCIMA DEL MAPA CUANDO SE TOMA */}
      {photoBg && (
        <Image 
          source={{ uri: photoBg }} 
          style={[StyleSheet.absoluteFillObject, { zIndex: 5 }]} 
          resizeMode="cover" 
        />
      )}

      {/* HEADER WATERMARK */}
      {isCapturing && (
        <View style={[styles.brandingTop, { paddingTop: insets.top + 20 }]}>
          <Text style={[styles.brandingAppName, { color: colors.primary }]}>RUGIDO DEPORTIVO</Text>
          <Text style={styles.brandingDate}>{dateString}</Text>
        </View>
      )}

      {/* BOTÓN REGRESAR */}
      {!isCapturing && (
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { top: insets.top + 10 }]}>
          <Feather name="x" size={24} color="#FFF" />
        </Pressable>
      )}

      {/* PANEL INFERIOR */}
      <View style={styles.bottomWrapper}>
        {isCapturing ? (
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)', '#000']} style={[styles.capturePanel, { paddingBottom: 40 }]}>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>DISTANCIA</Text>
                <Text style={styles.statValueBig}>{distance.toFixed(2)} <Text style={styles.statUnit}>km</Text></Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>TIEMPO</Text>
                <Text style={styles.statValueBig}>{formatTime(duration)}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>VEL. MEDIA</Text>
                <Text style={styles.statValueBig}>{avgSpeedKmh.toFixed(1)} <Text style={styles.statUnit}>km/h</Text></Text>
              </View>
            </View>
          </LinearGradient>
        ) : (
          <View style={{ paddingBottom: insets.bottom + 20, paddingHorizontal: 20 }}>
            <BlurView intensity={80} tint="dark" style={styles.glassPanel}>
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>TIEMPO</Text>
                  <Text style={styles.statValueBig}>{formatTime(duration)}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>DISTANCIA</Text>
                  <Text style={styles.statValueBig}>{distance.toFixed(2)} <Text style={styles.statUnit}>km</Text></Text>
                </View>
              </View>

              <View style={styles.statsRowMini}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>VEL. ACTUAL</Text>
                  <Text style={styles.statValueSmall}>{currentSpeed.toFixed(1)} <Text style={styles.statUnitSmall}>km/h</Text></Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>VEL. MEDIA</Text>
                  <Text style={styles.statValueSmall}>{avgSpeedKmh.toFixed(1)} <Text style={styles.statUnitSmall}>km/h</Text></Text>
                </View>
                <View style={styles.statBox}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                    <Ionicons name="heart" size={12} color={colors.destuctive} />
                    <Text style={[styles.statLabel, { marginBottom: 0 }]}>PULSO</Text>
                  </View>
                  <Text style={styles.statValueSmall}>-- <Text style={styles.statUnitSmall}>bpm</Text></Text>
                </View>
              </View>

              {!isTracking && route.length > 0 ? (
                <View style={styles.actionRow}>
                  <Pressable onPress={toggleTracking} style={({pressed}) => [styles.actionBtn, styles.flexBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }]}>
                    <Text style={styles.actionBtnText}>REANUDAR</Text>
                  </Pressable>
                  {/* BOTÓN CON ICONO DE CÁMARA CENTRADO Y SIN DESBORDARSE */}
                  <Pressable onPress={shareRoute} style={({pressed}) => [styles.actionBtn, styles.flexBtn, { backgroundColor: '#FFF', opacity: pressed ? 0.8 : 1 }]}>
                    <Feather name="camera" size={18} color="#000" style={{ marginRight: 6 }} />
                    <Text style={[styles.actionBtnText, { color: '#000', fontSize: 13 }]}>COMPARTIR</Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable onPress={toggleTracking} style={({pressed}) => [styles.actionBtn, { backgroundColor: isTracking ? colors.destuctive : colors.primary, transform: [{ scale: pressed ? 0.95 : 1 }] }]}>
                  <Text style={styles.actionBtnText}>{isTracking ? "PAUSAR RECORRIDO" : "INICIAR RUTA"}</Text>
                </Pressable>
              )}
            </BlurView>
          </View>
        )}
      </View>
    </ViewShot>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  brandingTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    alignItems: 'center',
    zIndex: 20,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  brandingAppName: { fontFamily: 'Inter_700Bold', fontSize: 24, letterSpacing: 2 },
  brandingDate: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#FFF', letterSpacing: 1, marginTop: 4 },
  backBtn: {
    position: 'absolute', left: 20, width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 10,
  },
  bottomWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 },
  glassPanel: { borderRadius: 32, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  capturePanel: { paddingTop: 80, paddingHorizontal: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  statBox: { flex: 1, alignItems: 'center' },
  statLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, marginBottom: 4 },
  statValueBig: { fontFamily: 'Inter_700Bold', fontSize: 32, color: '#FFF' },
  statUnit: { fontSize: 18, color: 'rgba(255,255,255,0.7)' },
  statsRowMini: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 30, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  statValueSmall: { fontFamily: 'Inter_700Bold', fontSize: 18, color: '#FFF' },
  statUnitSmall: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_500Medium' },
  actionRow: { flexDirection: 'row', gap: 10 },
  flexBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, // Centrado perfecto
  actionBtn: { height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
  actionBtnText: { fontFamily: 'Inter_700Bold', fontSize: 15, color: '#FFF', letterSpacing: 1 },
});