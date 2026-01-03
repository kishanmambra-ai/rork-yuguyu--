import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  Image as RNImage,
} from "react-native";
import { Audio } from "expo-av";
import {
  Camera,
  Mic,
  Plus,
  X,
  Check,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Edit2,
  Droplets,
  Minus,
  Scale,
  ImageIcon,
} from "lucide-react-native";
import { router } from "expo-router";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { generateObject } from "@rork-ai/toolkit-sdk";
import { z } from "zod";

import Colors from "@/constants/colors";
import { useDiet } from "@/contexts/DietContext";
import { FoodItem, MealType } from "@/types/diet";

const MEAL_TYPES: { type: MealType; label: string; emoji: string }[] = [
  { type: "breakfast", label: "Breakfast", emoji: "🌅" },
  { type: "lunch", label: "Lunch", emoji: "☀️" },
  { type: "dinner", label: "Dinner", emoji: "🌙" },
  { type: "snacks", label: "Snacks", emoji: "🍎" },
];



export default function DietScreen() {
  const {
    getTodayNutrition,
    getDateNutrition,
    loadDateData,
    getDailyInsights,
    addFoodToMeal,
    removeFoodFromMeal,
    updateFoodInMeal,
    updateMood,
    updateEnergyLevel,
    updateGoals,
    goals,
    mood,
    energyLevel,
    waterGlasses,
    updateWaterIntake,
    isLoading,
    addWeightEntry,
    getLatestWeight,
  } = useDiet();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [editCalories, setEditCalories] = useState("");
  const [editProtein, setEditProtein] = useState("");
  const [editCarbs, setEditCarbs] = useState("");
  const [editFat, setEditFat] = useState("");
  const [editWaterGoal, setEditWaterGoal] = useState("");
  const [editBottleSize, setEditBottleSize] = useState("");
  const [weightInput, setWeightInput] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(
    null,
  );
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [foodName, setFoodName] = useState("");
  const [portion, setPortion] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const nutrition = isToday ? getTodayNutrition() : getDateNutrition(selectedDate);
  const insights = getDailyInsights();

  const handlePreviousDay = async () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
    await loadDateData(newDate);
  };

  const handleNextDay = async () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    const today = new Date();
    if (newDate <= today) {
      setSelectedDate(newDate);
      await loadDateData(newDate);
    }
  };

  const formatDate = (date: Date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return {
      dayName: days[date.getDay()],
      fullDate: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    };
  };

  const { dayName, fullDate } = formatDate(selectedDate);
  const canGoNext = selectedDate.toDateString() !== new Date().toDateString();

  const handleAddFood = async () => {
    if (!selectedMealType || !foodName || !calories) {
      Alert.alert("Missing Info", "Please fill in at least food name and calories");
      return;
    }

    const newFood: FoodItem = {
      id: Date.now().toString(),
      name: foodName,
      portion: portion || "1 serving",
      calories: parseInt(calories) || 0,
      macros: {
        protein: parseInt(protein) || 0,
        carbs: parseInt(carbs) || 0,
        fat: parseInt(fat) || 0,
      },
    };

    await addFoodToMeal(selectedMealType, newFood);

    setFoodName("");
    setPortion("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setShowAddModal(false);
    setSelectedMealType(null);
  };

  const openAddModal = (mealType: MealType) => {
    setSelectedMealType(mealType);
    setFoodName("");
    setPortion("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setShowAddModal(true);
  };

  const openPhotoModal = (mealType: MealType) => {
    setSelectedMealType(mealType);
    setPhotoUri(null);
    setFoodName("");
    setPortion("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setShowPhotoModal(true);
  };

  const openVoiceModal = (mealType: MealType) => {
    setSelectedMealType(mealType);
    setTranscribedText("");
    setFoodName("");
    setPortion("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setShowVoiceModal(true);
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Required", "Camera permission is needed to take photos");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images" as any,
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
        await analyzePhoto(result.assets[0].base64!);
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const handleSelectPhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Required", "Photo library permission is needed");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images" as any,
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
        await analyzePhoto(result.assets[0].base64!);
      }
    } catch (error) {
      console.error("Photo picker error:", error);
      Alert.alert("Error", "Failed to select photo");
    }
  };

  const analyzePhoto = async (base64Image: string) => {
    setIsAnalyzingPhoto(true);
    try {
      const nutritionSchema = z.object({
        name: z.string().describe("Name of the food item(s) - be specific about ingredients and preparation method"),
        portion: z.string().describe("Precise portion size using weight (g/oz) or volume (cups/ml) measurements based on visual analysis"),
        calories: z.number().describe("Total calories - use USDA database values and account for cooking methods, oils, and visible fats"),
        protein: z.number().describe("Protein in grams - analyze meat portions, dairy, legumes carefully"),
        carbs: z.number().describe("Carbohydrates in grams - include all starches, sugars, and fiber from visible ingredients"),
        fat: z.number().describe("Fat in grams - account for cooking oils, visible fats, cheese, nuts, and dressings"),
      });

      const result = await generateObject({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are a professional nutritionist analyzing food photos. Provide accurate nutritional information using these guidelines:

1. PORTION SIZE: Estimate weight/volume by comparing to standard objects (a fist = 200g, palm = 100g, deck of cards = 85g). Be conservative.

2. CALORIES: Use USDA FoodData Central values. Account for:
   - Cooking methods (fried adds 50-100 kcal, grilled adds minimal)
   - Visible oils/butter (1 tbsp = 120 kcal)
   - Hidden ingredients (sauces, dressings, cheese)
   - Portion density (rice: 200 kcal/cup, pasta: 220 kcal/cup)

3. MACROS: Break down accurately:
   - Protein: Chicken breast (31g/100g), tofu (8g/100g), eggs (13g/100g)
   - Carbs: Rice (28g/100g), bread (49g/100g), potato (17g/100g)
   - Fat: Visible oils, nuts, cheese, fatty meats - do not underestimate

4. MULTIPLE ITEMS: Combine all visible items into one comprehensive entry with total nutrition.

5. UNCERTAINTY: If unclear, provide conservative estimates. Better to underestimate hidden fats than overestimate.

Analyze this food photo with precision:`,
              },
              {
                type: "image",
                image: `data:image/jpeg;base64,${base64Image}`,
              },
            ],
          },
        ],
        schema: nutritionSchema,
      });

      setFoodName(result.name);
      setPortion(result.portion);
      setCalories(result.calories.toString());
      setProtein(result.protein.toString());
      setCarbs(result.carbs.toString());
      setFat(result.fat.toString());
    } catch (error) {
      console.error("AI analysis error:", error);
      Alert.alert("Analysis Failed", "Could not analyze the photo. Please enter details manually.");
    } finally {
      setIsAnalyzingPhoto(false);
    }
  };

  const handleAddPhotoFood = async () => {
    if (!selectedMealType || !foodName || !calories) {
      Alert.alert("Missing Info", "Please fill in at least food name and calories");
      return;
    }

    const newFood: FoodItem = {
      id: Date.now().toString(),
      name: foodName,
      portion: portion || "1 serving",
      calories: parseInt(calories) || 0,
      macros: {
        protein: parseInt(protein) || 0,
        carbs: parseInt(carbs) || 0,
        fat: parseInt(fat) || 0,
      },
    };

    await addFoodToMeal(selectedMealType, newFood);

    setFoodName("");
    setPortion("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setPhotoUri(null);
    setShowPhotoModal(false);
    setSelectedMealType(null);
  };

  const openEditModal = (mealType: MealType, item: FoodItem) => {
    setSelectedMealType(mealType);
    setEditingFood(item);
    setFoodName(item.name);
    setPortion(item.portion);
    setCalories(item.calories.toString());
    setProtein(item.macros.protein.toString());
    setCarbs(item.macros.carbs.toString());
    setFat(item.macros.fat.toString());
    setShowEditModal(true);
  };

  const handleEditFood = async () => {
    if (!selectedMealType || !editingFood || !foodName || !calories) {
      Alert.alert("Missing Info", "Please fill in at least food name and calories");
      return;
    }

    const updatedFood: FoodItem = {
      id: editingFood.id,
      name: foodName,
      portion: portion || "1 serving",
      calories: parseInt(calories) || 0,
      macros: {
        protein: parseInt(protein) || 0,
        carbs: parseInt(carbs) || 0,
        fat: parseInt(fat) || 0,
      },
    };

    await updateFoodInMeal(selectedMealType, editingFood.id, updatedFood);

    setFoodName("");
    setPortion("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setShowEditModal(false);
    setSelectedMealType(null);
    setEditingFood(null);
  };

  const openGoalsModal = () => {
    setEditCalories(goals.targetCalories.toString());
    setEditProtein(goals.targetProtein.toString());
    setEditCarbs(goals.targetCarbs.toString());
    setEditFat(goals.targetFat.toString());
    setShowGoalsModal(true);
  };

  const handleSaveGoals = async () => {
    const newCalories = parseInt(editCalories);
    const newProtein = parseInt(editProtein);
    const newCarbs = parseInt(editCarbs);
    const newFat = parseInt(editFat);

    if (!newCalories || newCalories <= 0) {
      Alert.alert("Invalid Input", "Calories must be greater than 0");
      return;
    }

    if (newProtein < 0 || newCarbs < 0 || newFat < 0) {
      Alert.alert("Invalid Input", "Macros cannot be negative");
      return;
    }

    await updateGoals({
      targetCalories: newCalories,
      targetProtein: newProtein,
      targetCarbs: newCarbs,
      targetFat: newFat,
      waterGoal: goals.waterGoal,
      bottleSize: goals.bottleSize,
    });

    setShowGoalsModal(false);
    Alert.alert("Success", "Nutrition goals updated!");
  };

  const openWaterModal = () => {
    setEditWaterGoal(goals.waterGoal.toString());
    setEditBottleSize(goals.bottleSize.toString());
    setShowWaterModal(true);
  };

  const handleSaveWaterGoals = async () => {
    const newWaterGoal = parseInt(editWaterGoal);
    const newBottleSize = parseInt(editBottleSize);

    if (!newWaterGoal || newWaterGoal <= 0) {
      Alert.alert("Invalid Input", "Water goal must be greater than 0");
      return;
    }

    if (!newBottleSize || newBottleSize <= 0) {
      Alert.alert("Invalid Input", "Bottle size must be greater than 0");
      return;
    }

    await updateGoals({
      targetCalories: goals.targetCalories,
      targetProtein: goals.targetProtein,
      targetCarbs: goals.targetCarbs,
      targetFat: goals.targetFat,
      waterGoal: newWaterGoal,
      bottleSize: newBottleSize,
    });

    setShowWaterModal(false);
    Alert.alert("Success", "Water goals updated!");
  };

  const handleAddGlass = async () => {
    if (waterGlasses < goals.waterGoal) {
      await updateWaterIntake(waterGlasses + 1);
    }
  };

  const handleRemoveGlass = async () => {
    if (waterGlasses > 0) {
      await updateWaterIntake(waterGlasses - 1);
    }
  };

  const openWeightModal = () => {
    const latestWeight = getLatestWeight();
    if (latestWeight) {
      setWeightInput("");
      setWeightUnit(latestWeight.unit);
    } else {
      setWeightInput("");
      setWeightUnit("kg");
    }
    setShowWeightModal(true);
  };

  const handleLogWeight = async () => {
    const weight = parseFloat(weightInput);
    if (!weight || weight <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid weight");
      return;
    }
    await addWeightEntry(weight, weightUnit);
    setShowWeightModal(false);
    Alert.alert("Success", "Weight logged successfully!");
  };

  const startRecording = async () => {
    try {
      if (Platform.OS === "web") {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: "audio/webm" });
          await transcribeAudio(audioBlob);
          stream.getTracks().forEach((track) => track.stop());
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      } else {
        const permission = await Audio.requestPermissionsAsync();
        if (!permission.granted) {
          Alert.alert(
            "Permission Required",
            "Microphone permission is needed to record audio",
          );
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording: newRecording } = await Audio.Recording.createAsync({
          android: {
            extension: ".m4a",
            outputFormat: Audio.AndroidOutputFormat.MPEG_4,
            audioEncoder: Audio.AndroidAudioEncoder.AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
          ios: {
            extension: ".wav",
            outputFormat: Audio.IOSOutputFormat.LINEARPCM,
            audioQuality: Audio.IOSAudioQuality.HIGH,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
          web: {
            mimeType: "audio/webm",
            bitsPerSecond: 128000,
          },
        });

        setRecording(newRecording);
        setIsRecording(true);
      }
    } catch (error) {
      console.error("Failed to start recording:", error);
      Alert.alert("Error", "Failed to start recording");
    }
  };

  const stopRecording = async () => {
    try {
      if (Platform.OS === "web") {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
          setMediaRecorder(null);
        }
        setIsRecording(false);
      } else {
        if (!recording) return;

        setIsRecording(false);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

        const uri = recording.getURI();
        if (uri) {
          await transcribeAudio(uri);
        }
        setRecording(null);
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
      Alert.alert("Error", "Failed to stop recording");
    }
  };

  const transcribeAudio = async (audioSource: string | Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();

      if (Platform.OS === "web" && audioSource instanceof Blob) {
        formData.append("audio", audioSource, "recording.webm");
      } else if (typeof audioSource === "string") {
        const uriParts = audioSource.split(".");
        const fileType = uriParts[uriParts.length - 1];

        const audioFile = {
          uri: audioSource,
          name: "recording." + fileType,
          type: "audio/" + fileType,
        } as any;

        formData.append("audio", audioFile);
      }

      const response = await fetch(
        "https://toolkit.rork.com/stt/transcribe/",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Transcription failed");
      }

      const data = await response.json();
      setTranscribedText(data.text);
      await analyzeVoiceInput(data.text);
    } catch (error) {
      console.error("Transcription error:", error);
      Alert.alert(
        "Transcription Failed",
        "Could not transcribe audio. Please try again.",
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  const analyzeVoiceInput = async (text: string) => {
    try {
      const nutritionSchema = z.object({
        name: z.string().describe("Name of the food item(s) - be specific about ingredients and preparation method"),
        portion: z
          .string()
          .describe("Precise portion size using weight (g/oz) or volume (cups/ml) based on user description"),
        calories: z.number().describe("Total calories - use USDA database values and account for cooking methods"),
        protein: z.number().describe("Protein in grams - use accurate values for each ingredient"),
        carbs: z.number().describe("Carbohydrates in grams - include all sources from the description"),
        fat: z.number().describe("Fat in grams - account for cooking oils, butter, and high-fat ingredients"),
      });

      const result = await generateObject({
        messages: [
          {
            role: "user",
            content: `You are a professional nutritionist extracting nutritional data from user descriptions. Use these guidelines for accuracy:

1. INTERPRET PORTIONS:
   - "1 bowl" of rice = 200g = 260 kcal
   - "1 plate" of food = 300-400g total
   - "2 eggs" = 100g = 140 kcal
   - "1 cup" = 240ml or 150-200g solid
   - "handful" of nuts = 30g = 170 kcal
   - "small/medium/large" = 0.75x, 1x, 1.5x standard portions

2. STANDARD FOOD VALUES (per 100g unless noted):
   - Chicken breast: 165 kcal, 31g protein, 0g carbs, 3.6g fat
   - White rice (cooked): 130 kcal, 2.7g protein, 28g carbs, 0.3g fat
   - Salmon: 208 kcal, 20g protein, 0g carbs, 13g fat
   - Broccoli: 34 kcal, 2.8g protein, 7g carbs, 0.4g fat
   - Whole wheat bread (1 slice = 30g): 80 kcal, 4g protein, 13g carbs, 1g fat
   - Olive oil (1 tbsp): 120 kcal, 0g protein, 0g carbs, 14g fat

3. COOKING ADDITIONS:
   - "Fried" = add 80-120 kcal from oil
   - "Butter on toast" = add 100 kcal (1 tbsp)
   - "With cheese" = add 110 kcal per oz
   - "Salad with dressing" = add 80-150 kcal

4. MULTIPLE ITEMS: Combine all mentioned foods with accurate totals.

5. UNCLEAR DESCRIPTIONS: Use most common standard serving sizes.

User said: "${text}"

Provide accurate nutritional breakdown:`,
          },
        ],
        schema: nutritionSchema,
      });

      setFoodName(result.name);
      setPortion(result.portion);
      setCalories(result.calories.toString());
      setProtein(result.protein.toString());
      setCarbs(result.carbs.toString());
      setFat(result.fat.toString());
    } catch (error) {
      console.error("AI analysis error:", error);
      Alert.alert(
        "Analysis Failed",
        "Could not analyze the voice input. Please enter details manually.",
      );
    }
  };

  const handleAddVoiceFood = async () => {
    if (!selectedMealType || !foodName || !calories) {
      Alert.alert("Missing Info", "Please fill in at least food name and calories");
      return;
    }

    const newFood: FoodItem = {
      id: Date.now().toString(),
      name: foodName,
      portion: portion || "1 serving",
      calories: parseInt(calories) || 0,
      macros: {
        protein: parseInt(protein) || 0,
        carbs: parseInt(carbs) || 0,
        fat: parseInt(fat) || 0,
      },
    };

    await addFoodToMeal(selectedMealType, newFood);

    setFoodName("");
    setPortion("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setTranscribedText("");
    setShowVoiceModal(false);
    setSelectedMealType(null);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primaryAccent} />
      </View>
    );
  }

  const proteinPercent = Math.round(
    (nutrition.totalMacros.protein / (nutrition.targetMacros.protein || 1)) * 100,
  ) || 0;
  const carbsPercent = Math.round(
    (nutrition.totalMacros.carbs / (nutrition.targetMacros.carbs || 1)) * 100,
  ) || 0;
  const fatPercent = Math.round(
    (nutrition.totalMacros.fat / (nutrition.targetMacros.fat || 1)) * 100,
  ) || 0;

  const caloriesLeft = (nutrition.targetCalories || 0) - (nutrition.totalCalories || 0);
  const caloriesProgress = ((nutrition.totalCalories || 0) / (nutrition.targetCalories || 1)) * 100;
  const latestWeight = getLatestWeight();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          <View style={styles.dateNavigation}>
            <Pressable
              onPress={handlePreviousDay}
              style={styles.dateNavButton}
            >
              <ChevronLeft size={20} color="#212121" />
            </Pressable>
            <View style={styles.dateDisplay}>
              <Text style={styles.dayName}>{dayName}</Text>
              <Text style={styles.fullDate}>{fullDate}</Text>
            </View>
            <Pressable
              onPress={handleNextDay}
              style={[styles.dateNavButton, !canGoNext && styles.dateNavButtonDisabled]}
              disabled={!canGoNext}
            >
              <ChevronRight size={20} color={canGoNext ? "#212121" : "#E0E0E0"} />
            </Pressable>
          </View>

          <Pressable 
            style={styles.editGoalsButton}
            onPress={openGoalsModal}
          >
            <Settings size={16} color="#4CAF50" />
            <Text style={styles.editGoalsText}>Edit Goals</Text>
          </Pressable>

          <View style={styles.caloriesDisplay}>
            <View style={styles.caloriesRow}>
              <Text style={styles.caloriesConsumed}>{nutrition.totalCalories}</Text>
              <Text style={styles.caloriesSeparator}> / </Text>
              <Text style={styles.caloriesTarget}>{nutrition.targetCalories} kcal</Text>
            </View>
            <Text style={styles.caloriesLeft}>{caloriesLeft} kcal left</Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${Math.min(caloriesProgress, 100)}%` }]} />
            </View>
          </View>

          <View style={styles.macrosGrid}>
            <View style={styles.macroCard}>
              <View style={styles.macroRingContainer}>
                <View style={[styles.macroRing, { borderColor: proteinPercent > 0 ? '#4CAF50' : '#E0E0E0' }]}>
                  <Text style={styles.macroPercent}>{proteinPercent}%</Text>
                </View>
              </View>
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={styles.macroValue}>
                {Math.round(nutrition.totalMacros.protein)}g/{nutrition.targetMacros.protein}g
              </Text>
            </View>

            <View style={styles.macroCard}>
              <View style={styles.macroRingContainer}>
                <View style={[styles.macroRing, { borderColor: carbsPercent > 0 ? '#4CAF50' : '#E0E0E0' }]}>
                  <Text style={styles.macroPercent}>{carbsPercent}%</Text>
                </View>
              </View>
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={styles.macroValue}>
                {Math.round(nutrition.totalMacros.carbs)}g/{nutrition.targetMacros.carbs}g
              </Text>
            </View>

            <View style={styles.macroCard}>
              <View style={styles.macroRingContainer}>
                <View style={[styles.macroRing, { borderColor: fatPercent > 0 ? '#4CAF50' : '#E0E0E0' }]}>
                  <Text style={styles.macroPercent}>{fatPercent}%</Text>
                </View>
              </View>
              <Text style={styles.macroLabel}>Fat</Text>
              <Text style={styles.macroValue}>
                {Math.round(nutrition.totalMacros.fat)}g/{nutrition.targetMacros.fat}g
              </Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <Pressable
              style={styles.statusItem}
              onPress={() => {
                const levels: ("low" | "medium" | "high")[] = ["low", "medium", "high"];
                const currentIndex = levels.indexOf(energyLevel);
                const nextLevel = levels[(currentIndex + 1) % levels.length];
                updateEnergyLevel(nextLevel);
              }}
            >
              <Zap size={26} color="#FFA726" fill="#FFA726" />
              <Text style={styles.statusLabel}>Energy</Text>
            </Pressable>

            <Pressable
              style={styles.statusItem}
              onPress={() => {
                const moods: ("bad" | "okay" | "good" | "great")[] = ["bad", "okay", "good", "great"];
                const currentIndex = moods.indexOf(mood);
                const nextMood = moods[(currentIndex + 1) % moods.length];
                updateMood(nextMood);
              }}
            >
              <Text style={styles.moodEmoji}>
                {mood === "bad" ? "😞" : mood === "okay" ? "😐" : mood === "good" ? "😊" : "😄"}
              </Text>
              <Text style={styles.statusLabel}>Mood</Text>
            </Pressable>

            <Pressable
              style={styles.statusItem}
              onPress={openWeightModal}
            >
              <Scale size={26} color="#5E35B1" />
              <Text style={styles.statusLabel}>Weight</Text>
              {latestWeight && (
                <Text style={styles.weightValue}>
                  {latestWeight.weight}{latestWeight.unit}
                </Text>
              )}
            </Pressable>
          </View>
        </View>

        <View style={styles.waterSection}>
          <View style={styles.waterHeader}>
            <View style={styles.waterTitleRow}>
              <Droplets size={20} color="#007AFF" />
              <Text style={styles.waterTitle}>Water Intake</Text>
            </View>
            <Pressable onPress={openWaterModal} style={styles.waterEditButton}>
              <Settings size={16} color="#8E8E93" />
            </Pressable>
          </View>

          <View style={styles.waterContent}>
            <View style={styles.waterBottleContainer}>
              <View style={styles.waterBottle}>
                <View style={[styles.waterFill, { height: `${Math.min(((waterGlasses || 0) / (goals.waterGoal || 1)) * 100, 100)}%` }]} />
              </View>
            </View>

            <View style={styles.waterInfoContainer}>
              <Text style={styles.waterAmount}>
                {(((waterGlasses || 0) * (goals.bottleSize || 250)) / 1000).toFixed(2) || "0.00"}L
              </Text>
              <Text style={styles.waterGoalText}>
                Goal: {(((goals.waterGoal || 8) * (goals.bottleSize || 250)) / 1000).toFixed(2) || "2.00"}L ({goals.waterGoal || 8} × {goals.bottleSize || 250}ml glasses)
              </Text>

              <View style={styles.waterButtonsRow}>
                <Pressable
                  onPress={handleRemoveGlass}
                  style={[styles.waterButton, styles.waterButtonRemove]}
                  disabled={waterGlasses === 0}
                >
                  <Minus size={16} color={waterGlasses === 0 ? "#C7C7CC" : "#3A3A3C"} />
                  <Text style={[styles.waterButtonText, waterGlasses === 0 && styles.waterButtonTextDisabled]}>
                    Remove
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleAddGlass}
                  style={[styles.waterButton, styles.waterButtonAdd]}
                  disabled={waterGlasses >= goals.waterGoal}
                >
                  <Plus size={16} color="#FFFFFF" />
                  <Text style={styles.waterButtonTextAdd}>Add Glass</Text>
                </Pressable>
              </View>

              <View style={styles.waterProgressInfo}>
                <Text style={styles.waterProgressText}>{waterGlasses || 0}/{goals.waterGoal || 8} glasses</Text>
              </View>

              <View style={styles.waterProgressBarContainer}>
                <View style={styles.waterProgressBarBg}>
                  <View
                    style={[styles.waterProgressBarFill, { width: `${Math.min(((waterGlasses || 0) / (goals.waterGoal || 1)) * 100, 100)}%` }]}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {insights.length > 0 && (
          <View style={styles.insightsSection}>
            <Text style={styles.sectionTitle}>💡 Daily Insights</Text>
            {insights.map((insight) => (
              <View key={insight.id} style={styles.insightCard}>
                <Text style={styles.insightText}>{insight.message}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.mealsSection}>
          <Text style={styles.sectionTitle}>Today&apos;s Meals</Text>

          {MEAL_TYPES.map(({ type, label, emoji }) => {
            const meal = nutrition.meals.find((m) => m.mealType === type);

            return (
              <View key={type} style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTitle}>
                    {emoji} {label}
                  </Text>
                  {meal && (
                    <Text style={styles.mealTotal}>
                      {meal.calories} kcal
                    </Text>
                  )}
                </View>

                {meal && meal.items.length > 0 ? (
                  <>
                    {meal.items.map((item) => (
                      <View key={item.id} style={styles.foodItem}>
                        <View style={styles.foodInfo}>
                          <Text style={styles.foodName}>{item.name}</Text>
                          <Text style={styles.foodPortion}>{item.portion}</Text>
                        </View>
                        <View style={styles.foodStats}>
                          <Text style={styles.foodCalories}>
                            {item.calories} kcal
                          </Text>
                          <Text style={styles.foodMacros}>
                            P:{item.macros.protein}g C:{item.macros.carbs}g F:
                            {item.macros.fat}g
                          </Text>
                        </View>
                        <View style={styles.foodActions}>
                          <Pressable
                            onPress={() => openEditModal(type, item)}
                            style={styles.editButton}
                          >
                            <Edit2 size={14} color="#4CAF50" />
                          </Pressable>
                          <Pressable
                            onPress={() => removeFoodFromMeal(type, item.id)}
                            style={styles.removeButton}
                          >
                            <X size={14} color={Colors.textSecondary} />
                          </Pressable>
                        </View>
                      </View>
                    ))}
                  </>
                ) : (
                  <Text style={styles.emptyMeal}>
                    No meal added yet 🍽️ Tap + to log
                  </Text>
                )}

                <View style={styles.mealActions}>
                  <Pressable
                    onPress={() => openAddModal(type)}
                    style={styles.actionButton}
                  >
                    <Plus size={14} color={Colors.primaryAccent} />
                    <Text style={styles.actionButtonText}>Add Food</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => router.push(`/meal-library?mealType=${type}` as any)}
                    style={styles.actionButton}
                  >
                    <BookOpen size={14} color={Colors.primaryAccent} />
                    <Text style={styles.actionButtonText}>From Library</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => openPhotoModal(type)}
                    style={styles.actionButton}
                  >
                    <Camera size={14} color={Colors.primaryAccent} />
                    <Text style={styles.actionButtonText}>Photo</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => openVoiceModal(type)}
                    style={styles.actionButton}
                  >
                    <Mic size={14} color={Colors.primaryAccent} />
                    <Text style={styles.actionButtonText}>Voice</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>



        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Add Food to{" "}
                  {selectedMealType
                    ? MEAL_TYPES.find((m) => m.type === selectedMealType)?.label
                    : "Meal"}
                </Text>
                <Pressable
                  onPress={() => setShowAddModal(false)}
                  style={styles.modalClose}
                >
                  <X size={24} color={Colors.text} />
                </Pressable>
              </View>

              <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
                <Text style={styles.inputLabel}>Food Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Paneer Tikka"
                  value={foodName}
                  onChangeText={setFoodName}
                  placeholderTextColor={Colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Portion</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 1 bowl, 200g"
                  value={portion}
                  onChangeText={setPortion}
                  placeholderTextColor={Colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Calories *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 320"
                  value={calories}
                  onChangeText={setCalories}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Protein (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 25"
                  value={protein}
                  onChangeText={setProtein}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Carbs (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 40"
                  value={carbs}
                  onChangeText={setCarbs}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Fat (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 12"
                  value={fat}
                  onChangeText={setFat}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textSecondary}
                />

                <Pressable
                  onPress={handleAddFood}
                  style={styles.addButton}
                  testID="add-food-button"
                >
                  <Check size={20} color={Colors.background} />
                  <Text style={styles.addButtonText}>Add Food</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowEditModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Edit Food in{" "}
                  {selectedMealType
                    ? MEAL_TYPES.find((m) => m.type === selectedMealType)?.label
                    : "Meal"}
                </Text>
                <Pressable
                  onPress={() => setShowEditModal(false)}
                  style={styles.modalClose}
                >
                  <X size={24} color={Colors.text} />
                </Pressable>
              </View>

              <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
                <Text style={styles.inputLabel}>Food Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Paneer Tikka"
                  value={foodName}
                  onChangeText={setFoodName}
                  placeholderTextColor={Colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Portion</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 1 bowl, 200g"
                  value={portion}
                  onChangeText={setPortion}
                  placeholderTextColor={Colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Calories *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 320"
                  value={calories}
                  onChangeText={setCalories}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Protein (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 25"
                  value={protein}
                  onChangeText={setProtein}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Carbs (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 40"
                  value={carbs}
                  onChangeText={setCarbs}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Fat (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 12"
                  value={fat}
                  onChangeText={setFat}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textSecondary}
                />

                <Pressable
                  onPress={handleEditFood}
                  style={styles.addButton}
                  testID="edit-food-button"
                >
                  <Check size={20} color={Colors.background} />
                  <Text style={styles.addButtonText}>Save Changes</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={showGoalsModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowGoalsModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Nutrition Goals</Text>
                <Pressable
                  onPress={() => setShowGoalsModal(false)}
                  style={styles.modalClose}
                >
                  <X size={24} color={Colors.text} />
                </Pressable>
              </View>

              <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
                <Text style={styles.inputLabel}>Target Calories *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 2000"
                  value={editCalories}
                  onChangeText={setEditCalories}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Target Protein (g) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 150"
                  value={editProtein}
                  onChangeText={setEditProtein}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Target Carbs (g) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 200"
                  value={editCarbs}
                  onChangeText={setEditCarbs}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Target Fat (g) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 65"
                  value={editFat}
                  onChangeText={setEditFat}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textSecondary}
                />

                <Pressable
                  onPress={handleSaveGoals}
                  style={styles.addButton}
                  testID="save-goals-button"
                >
                  <Check size={20} color={Colors.background} />
                  <Text style={styles.addButtonText}>Save Goals</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={showWaterModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowWaterModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Water Goals</Text>
                <Pressable
                  onPress={() => setShowWaterModal(false)}
                  style={styles.modalClose}>
                  <X size={24} color={Colors.text} />
                </Pressable>
              </View>

              <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
                <Text style={styles.inputLabel}>Daily Water Goal (glasses) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 8"
                  value={editWaterGoal}
                  onChangeText={setEditWaterGoal}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Bottle Size (ml) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 250"
                  value={editBottleSize}
                  onChangeText={setEditBottleSize}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textSecondary}
                />

                <View style={styles.waterGoalPreview}>
                  <Text style={styles.waterGoalPreviewText}>
                    Total Daily Goal: {(((parseInt(editWaterGoal || '0') || 0) * (parseInt(editBottleSize || '0') || 0)) / 1000).toFixed(2) || "0.00"}L
                  </Text>
                </View>

                <Pressable
                  onPress={handleSaveWaterGoals}
                  style={styles.addButton}
                  testID="save-water-goals-button">
                  <Check size={20} color={Colors.background} />
                  <Text style={styles.addButtonText}>Save Goals</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={showWeightModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowWeightModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Log Weight</Text>
                <Pressable
                  onPress={() => setShowWeightModal(false)}
                  style={styles.modalClose}>
                  <X size={24} color={Colors.text} />
                </Pressable>
              </View>

              <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
                {latestWeight && (
                  <View style={styles.latestWeightCard}>
                    <Text style={styles.latestWeightLabel}>Last recorded:</Text>
                    <Text style={styles.latestWeightText}>
                      {latestWeight.weight} {latestWeight.unit}
                    </Text>
                    <Text style={styles.latestWeightDate}>
                      {new Date(latestWeight.loggedAt).toLocaleDateString()}
                    </Text>
                  </View>
                )}

                <Text style={styles.inputLabel}>Weight *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 75"
                  value={weightInput}
                  onChangeText={setWeightInput}
                  keyboardType="decimal-pad"
                  placeholderTextColor={Colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Unit</Text>
                <View style={styles.unitSelector}>
                  <Pressable
                    onPress={() => setWeightUnit("kg")}
                    style={[
                      styles.unitButton,
                      weightUnit === "kg" && styles.unitButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        weightUnit === "kg" && styles.unitButtonTextActive,
                      ]}
                    >
                      kg
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setWeightUnit("lbs")}
                    style={[
                      styles.unitButton,
                      weightUnit === "lbs" && styles.unitButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        weightUnit === "lbs" && styles.unitButtonTextActive,
                      ]}
                    >
                      lbs
                    </Text>
                  </Pressable>
                </View>

                <Pressable
                  onPress={handleLogWeight}
                  style={styles.addButton}
                  testID="log-weight-button">
                  <Check size={20} color={Colors.background} />
                  <Text style={styles.addButtonText}>Log Weight</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={showPhotoModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Photo Log -{" "}
                  {selectedMealType
                    ? MEAL_TYPES.find((m) => m.type === selectedMealType)?.label
                    : "Meal"}
                </Text>
                <Pressable
                  onPress={() => setShowPhotoModal(false)}
                  style={styles.modalClose}
                >
                  <X size={24} color={Colors.text} />
                </Pressable>
              </View>

              <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
                {!photoUri && (
                  <View style={styles.photoPickerSection}>
                    <Text style={styles.photoPickerTitle}>Take or select a photo of your food</Text>
                    <View style={styles.photoPickerButtons}>
                      <Pressable
                        onPress={handleTakePhoto}
                        style={styles.photoPickerButton}
                      >
                        <Camera size={32} color="#FFFFFF" />
                        <Text style={styles.photoPickerButtonText}>Take Photo</Text>
                      </Pressable>
                      <Pressable
                        onPress={handleSelectPhoto}
                        style={styles.photoPickerButton}
                      >
                        <ImageIcon size={32} color="#FFFFFF" />
                        <Text style={styles.photoPickerButtonText}>Select Photo</Text>
                      </Pressable>
                    </View>
                  </View>
                )}

                {photoUri && (
                  <View style={styles.photoPreviewSection}>
                    <RNImage source={{ uri: photoUri }} style={styles.photoPreview} />
                    <Pressable
                      onPress={() => {
                        setPhotoUri(null);
                        setFoodName("");
                        setPortion("");
                        setCalories("");
                        setProtein("");
                        setCarbs("");
                        setFat("");
                      }}
                      style={styles.changePhotoButton}
                    >
                      <Text style={styles.changePhotoButtonText}>Change Photo</Text>
                    </Pressable>
                  </View>
                )}

                {isAnalyzingPhoto && (
                  <View style={styles.analyzingContainer}>
                    <ActivityIndicator size="large" color={Colors.primaryAccent} />
                    <Text style={styles.analyzingText}>Analyzing food with AI...</Text>
                  </View>
                )}

                {photoUri && !isAnalyzingPhoto && (
                  <>
                    <Text style={styles.aiResultsTitle}>✨ AI Detected Nutrition</Text>
                    <Text style={styles.aiResultsSubtitle}>Review and edit if needed</Text>

                    <Text style={styles.inputLabel}>Food Name *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Paneer Tikka"
                      value={foodName}
                      onChangeText={setFoodName}
                      placeholderTextColor={Colors.textSecondary}
                    />

                    <Text style={styles.inputLabel}>Portion</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 1 bowl, 200g"
                      value={portion}
                      onChangeText={setPortion}
                      placeholderTextColor={Colors.textSecondary}
                    />

                    <Text style={styles.inputLabel}>Calories *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 320"
                      value={calories}
                      onChangeText={setCalories}
                      keyboardType="numeric"
                      placeholderTextColor={Colors.textSecondary}
                    />

                    <Text style={styles.inputLabel}>Protein (g)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 25"
                      value={protein}
                      onChangeText={setProtein}
                      keyboardType="numeric"
                      placeholderTextColor={Colors.textSecondary}
                    />

                    <Text style={styles.inputLabel}>Carbs (g)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 40"
                      value={carbs}
                      onChangeText={setCarbs}
                      keyboardType="numeric"
                      placeholderTextColor={Colors.textSecondary}
                    />

                    <Text style={styles.inputLabel}>Fat (g)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 12"
                      value={fat}
                      onChangeText={setFat}
                      keyboardType="numeric"
                      placeholderTextColor={Colors.textSecondary}
                    />

                    <Pressable
                      onPress={handleAddPhotoFood}
                      style={styles.addButton}
                      testID="add-photo-food-button"
                    >
                      <Check size={20} color={Colors.background} />
                      <Text style={styles.addButtonText}>Add Food</Text>
                    </Pressable>
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={showVoiceModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowVoiceModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Voice Log -{" "}
                  {selectedMealType
                    ? MEAL_TYPES.find((m) => m.type === selectedMealType)?.label
                    : "Meal"}
                </Text>
                <Pressable
                  onPress={() => setShowVoiceModal(false)}
                  style={styles.modalClose}
                >
                  <X size={24} color={Colors.text} />
                </Pressable>
              </View>

              <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
                {!transcribedText && (
                  <View style={styles.voiceRecordSection}>
                    <Text style={styles.voiceRecordTitle}>
                      Describe your food verbally
                    </Text>
                    <Text style={styles.voiceRecordSubtitle}>
                      Say something like: {"\"I had two eggs, toast with butter, and a glass of orange juice\""}
                    </Text>
                    <View style={styles.voiceRecordButtonContainer}>
                      <Pressable
                        onPress={isRecording ? stopRecording : startRecording}
                        style={[
                          styles.voiceRecordButton,
                          isRecording && styles.voiceRecordButtonActive,
                        ]}
                      >
                        <Mic
                          size={48}
                          color="#FFFFFF"
                          fill={isRecording ? "#FFFFFF" : "transparent"}
                        />
                      </Pressable>
                    </View>
                    <Text style={styles.voiceRecordStatus}>
                      {isRecording
                        ? "🔴 Recording... Tap to stop"
                        : "Tap microphone to start recording"}
                    </Text>
                  </View>
                )}

                {isTranscribing && (
                  <View style={styles.analyzingContainer}>
                    <ActivityIndicator size="large" color={Colors.primaryAccent} />
                    <Text style={styles.analyzingText}>Transcribing audio...</Text>
                  </View>
                )}

                {transcribedText && !isTranscribing && (
                  <>
                    <View style={styles.transcribedSection}>
                      <Text style={styles.transcribedTitle}>📝 What you said:</Text>
                      <Text style={styles.transcribedText}>{"\""}{ transcribedText}{"\""}</Text>
                      <Pressable
                        onPress={() => {
                          setTranscribedText("");
                          setFoodName("");
                          setPortion("");
                          setCalories("");
                          setProtein("");
                          setCarbs("");
                          setFat("");
                        }}
                        style={styles.retryRecordButton}
                      >
                        <Text style={styles.retryRecordButtonText}>Record Again</Text>
                      </Pressable>
                    </View>

                    <Text style={styles.aiResultsTitle}>✨ AI Detected Nutrition</Text>
                    <Text style={styles.aiResultsSubtitle}>Review and edit if needed</Text>

                    <Text style={styles.inputLabel}>Food Name *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Paneer Tikka"
                      value={foodName}
                      onChangeText={setFoodName}
                      placeholderTextColor={Colors.textSecondary}
                    />

                    <Text style={styles.inputLabel}>Portion</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 1 bowl, 200g"
                      value={portion}
                      onChangeText={setPortion}
                      placeholderTextColor={Colors.textSecondary}
                    />

                    <Text style={styles.inputLabel}>Calories *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 320"
                      value={calories}
                      onChangeText={setCalories}
                      keyboardType="numeric"
                      placeholderTextColor={Colors.textSecondary}
                    />

                    <Text style={styles.inputLabel}>Protein (g)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 25"
                      value={protein}
                      onChangeText={setProtein}
                      keyboardType="numeric"
                      placeholderTextColor={Colors.textSecondary}
                    />

                    <Text style={styles.inputLabel}>Carbs (g)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 40"
                      value={carbs}
                      onChangeText={setCarbs}
                      keyboardType="numeric"
                      placeholderTextColor={Colors.textSecondary}
                    />

                    <Text style={styles.inputLabel}>Fat (g)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 12"
                      value={fat}
                      onChangeText={setFat}
                      keyboardType="numeric"
                      placeholderTextColor={Colors.textSecondary}
                    />

                    <Pressable
                      onPress={handleAddVoiceFood}
                      style={styles.addButton}
                      testID="add-voice-food-button"
                    >
                      <Check size={20} color={Colors.background} />
                      <Text style={styles.addButtonText}>Add Food</Text>
                    </Pressable>
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  topSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomLeftRadius: Platform.OS === 'android' ? 16 : 24,
    borderBottomRightRadius: Platform.OS === 'android' ? 16 : 24,
    shadowColor: "#FFC107",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: Platform.OS === 'android' ? 6 : 4,
  },
  dateNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  dateNavButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
  },
  dateNavButtonDisabled: {
    opacity: 0.3,
  },
  dateDisplay: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 8,
  },
  dayName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFC107",
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  fullDate: {
    fontSize: 11,
    color: "#B0B0B0",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  editGoalsButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    gap: 4,
    marginBottom: 16,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    shadowColor: "#FFC107",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  editGoalsText: {
    fontSize: 12,
    color: "#FFC107",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  caloriesDisplay: {
    alignItems: "center",
    marginBottom: 12,
  },
  caloriesRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginBottom: 6,
  },
  caloriesConsumed: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFC107",
    letterSpacing: -2,
  },
  caloriesSeparator: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "400",
    marginHorizontal: 3,
  },
  caloriesTarget: {
    fontSize: 16,
    color: "#B0B0B0",
    fontWeight: "700",
  },
  caloriesLeft: {
    fontSize: 12,
    color: "#FFC107",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  progressBarContainer: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  progressBarBg: {
    height: 5,
    backgroundColor: "#F5F5F5",
    borderRadius: 2.5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FFC107",
    borderRadius: 2.5,
  },
  macrosGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  macroCard: {
    alignItems: "center",
    flex: 1,
  },
  macroRingContainer: {
    marginBottom: 8,
  },
  macroRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    shadowColor: "#FFC107",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  macroPercent: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFC107",
    letterSpacing: -0.5,
  },
  macroLabel: {
    fontSize: 10,
    color: "#B0B0B0",
    marginBottom: 3,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  macroValue: {
    fontSize: 11,
    color: "#666666",
    fontWeight: "600",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 10,
  },
  statusItem: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    shadowColor: "#FFC107",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,
  },
  statusLabel: {
    fontSize: 10,
    color: "#B0B0B0",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  moodEmoji: {
    fontSize: 26,
  },
  insightsSection: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFC107",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  insightCard: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
    shadowColor: "#FFC107",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  insightText: {
    fontSize: 13,
    color: "#333333",
    lineHeight: 18,
  },
  mealsSection: {
    marginHorizontal: 16,
    marginTop: 18,
  },
  mealCard: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#FFC107",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  mealTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333333",
  },
  mealTotal: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFC107",
  },
  foodItem: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 3,
  },
  foodPortion: {
    fontSize: 12,
    color: "#B0B0B0",
    fontWeight: "500",
  },
  foodStats: {
    alignItems: "flex-end",
    marginRight: 8,
  },
  foodCalories: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFC107",
    marginBottom: 2,
  },
  foodMacros: {
    fontSize: 10,
    color: "#B0B0B0",
    fontWeight: "500",
  },
  foodActions: {
    flexDirection: "row",
    gap: 4,
  },
  editButton: {
    padding: 5,
    borderRadius: 6,
    backgroundColor: "#F5F5F5",
  },
  removeButton: {
    padding: 5,
    borderRadius: 6,
    backgroundColor: "#F5F5F5",
  },
  emptyMeal: {
    fontSize: 13,
    color: "#B0B0B0",
    textAlign: "center",
    paddingVertical: 18,
    fontWeight: "500",
  },
  mealActions: {
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
    flexWrap: "wrap",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFC107",
  },
  actionButtonTextSecondary: {
    fontSize: 12,
    fontWeight: "600",
    color: "#B0B0B0",
  },
  bottomSpacer: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: Platform.OS === 'android' ? 20 : 24,
    borderTopRightRadius: Platform.OS === 'android' ? 20 : 24,
    maxHeight: "85%",
    elevation: Platform.OS === 'android' ? 16 : 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFC107",
  },
  modalClose: {
    padding: 4,
  },
  modalScroll: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'android' ? 12 : 14,
    fontSize: 16,
    color: "#333333",
    marginBottom: 18,
    borderRadius: Platform.OS === 'android' ? 8 : 12,
    backgroundColor: "#F5F5F5",
    textAlignVertical: Platform.OS === 'android' ? 'top' : 'auto',
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#FFC107",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    borderRadius: 14,
  },
  addButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000000",
  },
  waterSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#FFC107",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  waterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  waterTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  waterTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFC107",
  },
  waterEditButton: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
  },
  waterContent: {
    flexDirection: "row",
    gap: 16,
  },
  waterBottleContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  waterBottle: {
    width: 60,
    height: 140,
    borderWidth: 3,
    borderColor: "#FFC107",
    borderRadius: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
    position: "relative",
  },
  waterFill: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFC107",
  },
  waterInfoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  waterAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFC107",
    marginBottom: 4,
    letterSpacing: -1,
  },
  waterGoalText: {
    fontSize: 11,
    color: "#B0B0B0",
    marginBottom: 12,
    fontWeight: "500",
  },
  waterButtonsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  waterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
  },
  waterButtonRemove: {
    backgroundColor: "#F5F5F5",
  },
  waterButtonAdd: {
    backgroundColor: "#FFC107",
  },
  waterButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333333",
  },
  waterButtonTextDisabled: {
    color: "#666666",
  },
  waterButtonTextAdd: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000000",
  },
  waterProgressInfo: {
    marginBottom: 6,
  },
  waterProgressText: {
    fontSize: 11,
    color: "#B0B0B0",
    fontWeight: "600",
  },
  waterProgressBarContainer: {
    marginTop: 4,
  },
  waterProgressBarBg: {
    height: 6,
    backgroundColor: "#F5F5F5",
    borderRadius: 3,
    overflow: "hidden",
  },
  waterProgressBarFill: {
    height: "100%",
    backgroundColor: "#FFC107",
    borderRadius: 3,
  },
  waterGoalPreview: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FFC107",
  },
  waterGoalPreviewText: {
    fontSize: 14,
    color: "#FFC107",
    fontWeight: "600",
    textAlign: "center",
  },
  weightValue: {
    fontSize: 10,
    color: "#FFC107",
    fontWeight: "700",
    marginTop: 2,
  },
  latestWeightCard: {
    backgroundColor: "#F5F5F5",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFC107",
  },
  latestWeightLabel: {
    fontSize: 11,
    color: "#B0B0B0",
    fontWeight: "600",
    marginBottom: 4,
  },
  latestWeightText: {
    fontSize: 28,
    color: "#FFC107",
    fontWeight: "800",
    marginBottom: 4,
  },
  latestWeightDate: {
    fontSize: 11,
    color: "#B0B0B0",
    fontWeight: "500",
  },
  unitSelector: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  unitButtonActive: {
    backgroundColor: "#3A3A00",
    borderColor: "#FFC107",
  },
  unitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#B0B0B0",
  },
  unitButtonTextActive: {
    color: "#FFC107",
    fontWeight: "700",
  },
  photoPickerSection: {
    paddingVertical: 20,
  },
  photoPickerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 20,
    textAlign: "center",
  },
  photoPickerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  photoPickerButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    backgroundColor: "#FFC107",
    borderRadius: 16,
    gap: 8,
  },
  photoPickerButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
  },
  photoPreviewSection: {
    marginBottom: 20,
  },
  photoPreview: {
    width: "100%",
    height: 240,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
  },
  changePhotoButton: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
  },
  changePhotoButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B0B0B0",
  },
  analyzingContainer: {
    paddingVertical: 40,
    alignItems: "center",
    gap: 16,
  },
  analyzingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFC107",
  },
  aiResultsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFC107",
    marginBottom: 4,
  },
  aiResultsSubtitle: {
    fontSize: 13,
    color: "#B0B0B0",
    marginBottom: 20,
  },
  voiceRecordSection: {
    paddingVertical: 20,
    alignItems: "center",
  },
  voiceRecordTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
    textAlign: "center",
  },
  voiceRecordSubtitle: {
    fontSize: 13,
    color: "#B0B0B0",
    marginBottom: 24,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  voiceRecordButtonContainer: {
    marginVertical: 20,
  },
  voiceRecordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFC107",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FFC107",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  voiceRecordButtonActive: {
    backgroundColor: "#FF3B30",
    shadowColor: "#FF3B30",
  },
  voiceRecordStatus: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B0B0B0",
    textAlign: "center",
  },
  transcribedSection: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFC107",
  },
  transcribedTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFC107",
    marginBottom: 8,
  },
  transcribedText: {
    fontSize: 15,
    color: "#666666",
    lineHeight: 22,
    fontStyle: "italic",
    marginBottom: 12,
  },
  retryRecordButton: {
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FFC107",
  },
  retryRecordButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFC107",
  },
});
