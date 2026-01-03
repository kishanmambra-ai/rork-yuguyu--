import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import createContextHook from "@nkzw/create-context-hook";

export interface User {
  id: string;
  name: string;
  profilePicture?: string;
}

const USER_KEY = "user_data";

export const [AuthContext, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_KEY);

      if (storedUser && 
          storedUser !== 'undefined' && 
          storedUser !== 'null' && 
          storedUser.trim().length > 0) {
        try {
          const trimmed = storedUser.trim();
          if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
            const parsed = JSON.parse(trimmed);
            if (parsed && typeof parsed === 'object' && parsed.id && parsed.name) {
              setUser(parsed);
            } else {
              console.log('Invalid user data structure, clearing...');
              await AsyncStorage.removeItem(USER_KEY);
            }
          } else {
            console.log('Stored data is not valid JSON, clearing...');
            await AsyncStorage.removeItem(USER_KEY);
          }
        } catch (parseError) {
          console.error('Failed to parse user data:', parseError);
          await AsyncStorage.removeItem(USER_KEY);
        }
      }
    } catch (error) {
      console.error("Failed to load stored auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startTracking = async () => {
    try {
      const newUser: User = {
        id: Date.now().toString(),
        name: "yuguyu",
      };
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error("Failed to start tracking:", error);
    }
  };

  const updateProfile = async (updates: Partial<Omit<User, 'id'>>) => {
    try {
      if (!user) return;
      
      const updatedUser = { ...user, ...updates };
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    startTracking,
    updateProfile,
  };
});
