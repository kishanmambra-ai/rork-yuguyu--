import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useEffect } from "react";

import Colors from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { isAuthenticated, startTracking } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)/diet");
    }
  }, [isAuthenticated]);

  const handleStartTracking = async () => {
    await startTracking();
    router.replace("/(tabs)/diet");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>yuguyu</Text>
        
        <TouchableOpacity 
          style={styles.startButton}
          onPress={handleStartTracking}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 48,
  },
  title: {
    fontSize: 56,
    fontWeight: "800" as const,
    color: Colors.text,
  },
  startButton: {
    width: "100%",
    height: 56,
    backgroundColor: Colors.primaryAccent,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.background,
  },
});
