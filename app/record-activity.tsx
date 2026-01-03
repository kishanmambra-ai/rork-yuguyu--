import { router } from "expo-router";
import * as Location from "expo-location";
import { Pedometer } from "expo-sensors";
import { Check, Pause, Play, X } from "lucide-react-native";
import { useEffect, useState, useRef } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { useWorkouts } from "@/contexts/WorkoutContext";

export default function RecordActivityScreen() {
  const {
    activeCardio,
    pauseCardioActivity,
    resumeCardioActivity,
    completeCardioActivity,
    cancelCardioActivity,
    updateCardioLocation,
    updateCardioSteps,
  } = useWorkouts();

  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [pedometerAvailable, setPedometerAvailable] = useState<boolean>(false);
  const mapRef = useRef<MapView>(null);
  const isTrackingRef = useRef<boolean>(true);
  const updateLocationRef = useRef(updateCardioLocation);
  const updateStepsRef = useRef(updateCardioSteps);

  useEffect(() => {
    updateLocationRef.current = updateCardioLocation;
    updateStepsRef.current = updateCardioSteps;
  }, [updateCardioLocation, updateCardioSteps]);

  useEffect(() => {
    if (activeCardio) {
      isTrackingRef.current = activeCardio.isTracking;
    }
  }, [activeCardio]);

  useEffect(() => {
    if (Platform.OS !== "web") {
      Pedometer.isAvailableAsync().then(setPedometerAvailable);
    }
  }, []);

  useEffect(() => {
    if (!activeCardio) {
      router.replace("/(tabs)/workouts" as any);
      return;
    }

    let pedometerSubscription: any = null;
    let locationSubscription: Location.LocationSubscription | null = null;

    const setupPedometer = async () => {
      if (Platform.OS === "web" || !pedometerAvailable) return;

      try {
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const currentSteps = await Pedometer.getStepCountAsync(start, end);
        const baseline = currentSteps.steps;
        
        console.log('Pedometer baseline:', baseline);

        pedometerSubscription = Pedometer.watchStepCount((result) => {
          const totalSteps = result.steps;
          const stepsDuringActivity = totalSteps - baseline;
          console.log('Steps during activity:', stepsDuringActivity);
          updateStepsRef.current(Math.max(0, stepsDuringActivity));
        });
      } catch (error) {
        console.error("Pedometer error:", error);
      }
    };

    const setupLocationTracking = async () => {
      if (Platform.OS === "web") {
        setLocationError("GPS tracking not available on web");
        return;
      }

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationError("Location permission denied");
          return;
        }

        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 2000,
            distanceInterval: 3,
          },
          (location) => {
            if (isTrackingRef.current) {
              updateLocationRef.current(
                location.coords.latitude,
                location.coords.longitude,
                location.coords.speed || undefined,
                location.coords.accuracy ?? undefined
              );
            }
          }
        );
      } catch (error) {
        console.error("Location tracking error:", error);
        setLocationError("Failed to start location tracking");
      }
    };

    setupPedometer();
    setupLocationTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
      if (pedometerSubscription) {
        pedometerSubscription.remove();
      }
    };
  }, [activeCardio, pedometerAvailable]);

  useEffect(() => {
    if (!activeCardio) return;

    if (!activeCardio.isTracking) {
      const totalTime = Date.now() - new Date(activeCardio.startedAt).getTime();
      const pausedTime = activeCardio.pausedAt
        ? activeCardio.totalPausedDuration +
          (Date.now() - new Date(activeCardio.pausedAt).getTime())
        : activeCardio.totalPausedDuration;
      setElapsedTime(totalTime - pausedTime);
      return;
    }

    const interval = setInterval(() => {
      const totalTime = Date.now() - new Date(activeCardio.startedAt).getTime();
      const pausedTime = activeCardio.totalPausedDuration;

      setElapsedTime(totalTime - pausedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCardio, activeCardio?.isTracking]);

  if (!activeCardio) {
    return null;
  }

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${meters.toFixed(0)}m`;
    }
    return `${(meters / 1000).toFixed(2)}km`;
  };

  const getStepCount = (): number => {
    if (Platform.OS !== "web" && pedometerAvailable && activeCardio.steps !== undefined) {
      return activeCardio.steps;
    }
    
    const distance = activeCardio.distance;
    const activityType = activeCardio.type;
    const speedKmh = currentSpeed;
    let strideLength: number;
    
    if (activityType === "walking") {
      strideLength = speedKmh < 3 ? 0.65 : speedKmh < 5 ? 0.75 : 0.85;
    } else if (activityType === "running") {
      strideLength = speedKmh < 8 ? 1.0 : speedKmh < 12 ? 1.2 : 1.4;
    } else if (activityType === "hiking") {
      strideLength = 0.7;
    } else {
      strideLength = 0.75;
    }
    
    return Math.floor(distance / strideLength);
  };

  const currentSpeed = activeCardio.distance > 0 && elapsedTime > 0
    ? ((activeCardio.distance / 1000) / (elapsedTime / 3600000))
    : 0;

  const showSteps = activeCardio.type === "walking" || 
                     activeCardio.type === "running" || 
                     activeCardio.type === "hiking";

  const handlePause = () => {
    if (activeCardio.isTracking) {
      pauseCardioActivity();
    } else {
      resumeCardioActivity();
    }
  };

  const handleComplete = () => {
    Alert.alert(
      "Complete Activity",
      `Distance: ${formatDistance(activeCardio.distance)}\nTime: ${formatTime(elapsedTime)}`,
      [
        { text: "Keep Going", style: "cancel" },
        {
          text: "Complete",
          onPress: () => {
            completeCardioActivity();
            router.replace("/(tabs)/workouts" as any);
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Activity",
      "Are you sure you want to cancel? Your activity will not be saved.",
      [
        { text: "Keep Going", style: "cancel" },
        {
          text: "Cancel",
          style: "destructive",
          onPress: () => {
            cancelCardioActivity();
            router.replace("/(tabs)/workouts" as any);
          },
        },
      ]
    );
  };

  const activityName = activeCardio.type.charAt(0).toUpperCase() + activeCardio.type.slice(1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{activityName}</Text>
      </View>

      {locationError && Platform.OS === "web" && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>Simulated mode - GPS not available on web</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.mainStats}>
          <View style={styles.primaryStat}>
            <Text style={styles.primaryLabel}>Distance</Text>
            <Text style={styles.primaryValue}>
              {formatDistance(activeCardio.distance)}
            </Text>
          </View>

          <View style={styles.primaryStat}>
            <Text style={styles.primaryLabel}>Time</Text>
            <Text style={styles.primaryValue}>{formatTime(elapsedTime)}</Text>
          </View>
        </View>

        <View style={styles.secondaryStats}>
          {showSteps ? (
            <>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Steps</Text>
                <Text style={styles.statValue}>
                  {getStepCount().toLocaleString()}
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Speed</Text>
                <Text style={styles.statValue}>
                  {currentSpeed.toFixed(1)}
                  <Text style={styles.statUnit}> km/h</Text>
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Speed</Text>
              <Text style={styles.statValue}>
                {currentSpeed.toFixed(1)}
                <Text style={styles.statUnit}> km/h</Text>
              </Text>
            </View>
          )}
        </View>

        <View style={styles.mapContainer}>
          {activeCardio.route.length > 0 ? (
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
              initialRegion={{
                latitude: activeCardio.route[0].latitude,
                longitude: activeCardio.route[0].longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsUserLocation
              followsUserLocation
              showsMyLocationButton={false}
            >
              {activeCardio.route.length > 1 && (
                <Polyline
                  coordinates={activeCardio.route.map((point) => ({
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }))}
                  strokeColor="#34C759"
                  strokeWidth={4}
                />
              )}
              {activeCardio.route.length > 0 && (
                <Marker
                  coordinate={{
                    latitude: activeCardio.route[activeCardio.route.length - 1].latitude,
                    longitude: activeCardio.route[activeCardio.route.length - 1].longitude,
                  }}
                  title="Current Location"
                />
              )}
            </MapView>
          ) : (
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>Waiting for GPS...</Text>
              <Text style={styles.mapPlaceholderSubtext}>
                Start moving to track your route
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.controls}>
        <View style={styles.controlsRow}>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              styles.cancelButton,
              pressed && styles.controlButtonPressed,
            ]}
            onPress={handleCancel}
          >
            <X size={24} color="#FFFFFF" />
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.controlButton,
              activeCardio.isTracking
                ? styles.pauseButton
                : styles.resumeButton,
              pressed && styles.controlButtonPressed,
            ]}
            onPress={handlePause}
          >
            {activeCardio.isTracking ? (
              <>
                <Pause size={32} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.controlButtonText}>Pause</Text>
              </>
            ) : (
              <>
                <Play size={32} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.controlButtonText}>Resume</Text>
              </>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              styles.completeButton,
              pressed && styles.controlButtonPressed,
            ]}
            onPress={handleComplete}
          >
            <Check size={24} color="#FFFFFF" />
            <Text style={styles.secondaryButtonText}>Complete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1A1A1A",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  errorBanner: {
    backgroundColor: "#FF9500",
    padding: 12,
    alignItems: "center",
  },
  errorText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000000",
  },
  content: {
    flex: 1,
    paddingTop: 40,
  },
  mainStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 32,
    marginBottom: 40,
  },
  primaryStat: {
    alignItems: "center",
  },
  primaryLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  primaryValue: {
    fontSize: 56,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  secondaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 6,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  statUnit: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: "#666666",
  },
  controls: {
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  controlsRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  controlButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 60,
    gap: 12,
  },
  secondaryButton: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
    minWidth: 80,
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
  },
  completeButton: {
    backgroundColor: "#34C759",
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  pauseButton: {
    backgroundColor: "#FF9500",
  },
  resumeButton: {
    backgroundColor: "#34C759",
  },
  controlButtonPressed: {
    opacity: 0.8,
  },
  controlButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
