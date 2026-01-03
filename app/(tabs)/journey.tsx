import { useDiet } from "@/contexts/DietContext";
import { useWorkouts } from "@/contexts/WorkoutContext";
import Colors from "@/constants/colors";
import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Dumbbell, Clock, CheckCircle, TrendingUp, Award, Zap, MapPin, TrendingDown, Minus, Target, Calendar } from "lucide-react-native";
import { calculatePersonalBests, getTopExercises } from "@/utils/workout-stats";

type TimeRange = "7d" | "14d" | "30d" | "90d" | "6mo" | "1y";

interface GraphData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  weight?: number;
}

export default function JourneyScreen() {
  const { getHistoricalData } = useDiet();
  const { history: workoutHistory, cardioHistory } = useWorkouts();
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [data, setData] = useState<GraphData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'nutrition' | 'workouts'>('nutrition');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const days = 
        timeRange === "7d" ? 7 : 
        timeRange === "14d" ? 14 : 
        timeRange === "30d" ? 30 : 
        timeRange === "90d" ? 90 : 
        timeRange === "6mo" ? 180 : 
        365;
      const historicalData = await getHistoricalData(days);
      setData(Array.isArray(historicalData) ? historicalData : []);
    } catch (error) {
      console.error('Failed to load journey data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [timeRange, getHistoricalData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const hasData = data.some(
    (d) => d.calories > 0 || d.protein > 0 || d.carbs > 0 || d.fat > 0 || d.water > 0 || d.weight
  );

  const daysAgo = 
    timeRange === "7d" ? 7 : 
    timeRange === "14d" ? 14 : 
    timeRange === "30d" ? 30 : 
    timeRange === "90d" ? 90 : 
    timeRange === "6mo" ? 180 : 
    365;

  const filteredWorkoutHistory = workoutHistory.filter((workout) => {
    const completedDate = new Date(workout.completedAt);
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return completedDate >= cutoffDate;
  });

  const filteredCardioHistory = cardioHistory.filter((activity) => {
    const completedDate = new Date(activity.completedAt || activity.startedAt);
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return completedDate >= cutoffDate;
  });

  const totalWorkouts = filteredWorkoutHistory.length;
  const totalCardioActivities = filteredCardioHistory.length;
  const totalActivities = totalWorkouts + totalCardioActivities;
  const totalVolume = filteredWorkoutHistory.reduce((sum, workout) => {
    return sum + workout.exercises.reduce((exerciseSum, exercise) => {
      return exerciseSum + exercise.sets.reduce((setSum, set) => {
        if (set.completed && set.weight && set.reps) {
          return setSum + set.weight * set.reps;
        }
        return setSum;
      }, 0);
    }, 0);
  }, 0);

  const totalDuration = filteredWorkoutHistory.reduce((sum, workout) => {
    return sum + (new Date(workout.completedAt).getTime() - new Date(workout.startedAt).getTime());
  }, 0);

  const totalMinutes = Math.floor(totalDuration / 60000);
  const avgDuration = totalWorkouts > 0 ? Math.floor(totalMinutes / totalWorkouts) : 0;

  const personalBests = calculatePersonalBests(filteredWorkoutHistory);
  const topExercises = getTopExercises(filteredWorkoutHistory, 3);

  console.log('Personal Bests Count:', personalBests.length);
  console.log('Personal Bests:', personalBests);
  console.log('Filtered Workout History:', filteredWorkoutHistory.length);

  const workoutsByDate = filteredWorkoutHistory.reduce((acc, workout) => {
    const date = new Date(workout.completedAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(workout);
    return acc;
  }, {} as Record<string, typeof workoutHistory>);

  const cardioByDate = filteredCardioHistory.reduce((acc, activity) => {
    const date = new Date(activity.completedAt || activity.startedAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, typeof cardioHistory>);

  const allDates = Array.from(new Set([...Object.keys(workoutsByDate), ...Object.keys(cardioByDate)])).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const formatDuration = (startedAt: string, completedAt: string) => {
    const duration = new Date(completedAt).getTime() - new Date(startedAt).getTime();
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  const formatCardioDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters.toFixed(0)}m`;
    }
    return `${(meters / 1000).toFixed(2)}km`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'running': return '🏃';
      case 'cycling': return '🚴';
      case 'walking': return '🚶';
      case 'hiking': return '🥾';
      default: return '🏃';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
        <View style={styles.tabButtons}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "nutrition" && styles.tabButtonActive]}
            onPress={() => setActiveTab("nutrition")}
          >
            <Text style={[styles.tabButtonText, activeTab === "nutrition" && styles.tabButtonTextActive]}>
              Nutrition
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "workouts" && styles.tabButtonActive]}
            onPress={() => setActiveTab("workouts")}
          >
            <Text style={[styles.tabButtonText, activeTab === "workouts" && styles.tabButtonTextActive]}>
              Workouts
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.timeRangeButtons}>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === "7d" && styles.timeRangeButtonActive]}
            onPress={() => setTimeRange("7d")}
          >
            <Text
              style={[
                styles.timeRangeButtonText,
                timeRange === "7d" && styles.timeRangeButtonTextActive,
              ]}
            >
              7D
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === "14d" && styles.timeRangeButtonActive]}
            onPress={() => setTimeRange("14d")}
          >
            <Text
              style={[
                styles.timeRangeButtonText,
                timeRange === "14d" && styles.timeRangeButtonTextActive,
              ]}
            >
              14D
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === "30d" && styles.timeRangeButtonActive]}
            onPress={() => setTimeRange("30d")}
          >
            <Text
              style={[
                styles.timeRangeButtonText,
                timeRange === "30d" && styles.timeRangeButtonTextActive,
              ]}
            >
              30D
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === "90d" && styles.timeRangeButtonActive]}
            onPress={() => setTimeRange("90d")}
          >
            <Text
              style={[
                styles.timeRangeButtonText,
                timeRange === "90d" && styles.timeRangeButtonTextActive,
              ]}
            >
              90D
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === "6mo" && styles.timeRangeButtonActive]}
            onPress={() => setTimeRange("6mo")}
          >
            <Text
              style={[
                styles.timeRangeButtonText,
                timeRange === "6mo" && styles.timeRangeButtonTextActive,
              ]}
            >
              6M
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeRangeButton, timeRange === "1y" && styles.timeRangeButtonActive]}
            onPress={() => setTimeRange("1y")}
          >
            <Text
              style={[
                styles.timeRangeButtonText,
                timeRange === "1y" && styles.timeRangeButtonTextActive,
              ]}
            >
              1Y
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primaryAccent} />
        </View>
      ) : activeTab === 'nutrition' && !hasData ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No Data Yet</Text>
          <Text style={styles.emptyText}>
            Start logging your meals to see your journey here!
          </Text>
        </View>
      ) : activeTab === 'nutrition' ? (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {(() => {
            const calorieValues = data.map(d => d.calories).filter(v => v > 0);
            const proteinValues = data.map(d => d.protein).filter(v => v > 0);
            const carbsValues = data.map(d => d.carbs).filter(v => v > 0);
            const fatValues = data.map(d => d.fat).filter(v => v > 0);
            const waterValues = data.map(d => d.water).filter(v => v > 0);
            const weightValues = data.map(d => d.weight).filter(v => v && v > 0) as number[];

            const avgCalories = calorieValues.length > 0 ? calorieValues.reduce((a, b) => a + b, 0) / calorieValues.length : 0;
            const avgProtein = proteinValues.length > 0 ? proteinValues.reduce((a, b) => a + b, 0) / proteinValues.length : 0;
            const avgCarbs = carbsValues.length > 0 ? carbsValues.reduce((a, b) => a + b, 0) / carbsValues.length : 0;
            const avgFat = fatValues.length > 0 ? fatValues.reduce((a, b) => a + b, 0) / fatValues.length : 0;
            const avgWater = waterValues.length > 0 ? waterValues.reduce((a, b) => a + b, 0) / waterValues.length : 0;

            const maxCalories = calorieValues.length > 0 ? Math.max(...calorieValues) : 0;
            const minCalories = calorieValues.length > 0 ? Math.min(...calorieValues) : 0;
            const maxProtein = proteinValues.length > 0 ? Math.max(...proteinValues) : 0;
            const maxWater = waterValues.length > 0 ? Math.max(...waterValues) : 0;

            const daysLogged = data.filter(d => d.calories > 0 || d.protein > 0 || d.carbs > 0).length;
            const consistencyRate = data.length > 0 ? (daysLogged / data.length) * 100 : 0;

            const weightTrend = weightValues.length >= 2 ? weightValues[weightValues.length - 1] - weightValues[0] : 0;
            const latestWeight = weightValues.length > 0 ? weightValues[weightValues.length - 1] : null;
            const startWeight = weightValues.length > 0 ? weightValues[0] : null;

            const getTrendIcon = (trend: number) => {
              if (trend > 0.5) return <TrendingUp size={16} color="#FF6B6B" />;
              if (trend < -0.5) return <TrendingDown size={16} color="#34C759" />;
              return <Minus size={16} color="#FFE66D" />;
            };

            const getTrendText = (trend: number) => {
              if (trend > 0.5) return `+${trend.toFixed(1)} kg`;
              if (trend < -0.5) return `${trend.toFixed(1)} kg`;
              return 'Stable';
            };

            return (
              <View style={styles.nutritionInsightsContainer}>
                <View style={styles.insightsOverview}>
                  <View style={styles.insightCard}>
                    <View style={[styles.insightIconContainer, { backgroundColor: '#FF6B6B15' }]}>
                      <Calendar size={20} color="#FF6B6B" />
                    </View>
                    <Text style={styles.insightValue}>{daysLogged}</Text>
                    <Text style={styles.insightLabel}>Days Logged</Text>
                  </View>
                  <View style={styles.insightCard}>
                    <View style={[styles.insightIconContainer, { backgroundColor: '#4ECDC415' }]}>
                      <Target size={20} color="#4ECDC4" />
                    </View>
                    <Text style={styles.insightValue}>{consistencyRate.toFixed(0)}%</Text>
                    <Text style={styles.insightLabel}>Consistency</Text>
                  </View>
                </View>

                <View style={styles.nutritionMetricsSection}>
                  <View style={styles.sectionTitleRow}>
                    <Text style={styles.metricsIcon}>🔥</Text>
                    <Text style={styles.sectionSubtitle}>Calories</Text>
                  </View>
                  <View style={styles.metricInsightCard}>
                    <View style={styles.metricInsightRow}>
                      <View style={styles.metricInsightItem}>
                        <Text style={styles.metricInsightLabel}>Average</Text>
                        <Text style={styles.metricInsightValue}>{avgCalories.toFixed(0)}</Text>
                        <Text style={styles.metricInsightUnit}>kcal/day</Text>
                      </View>
                      <View style={styles.metricDividerVertical} />
                      <View style={styles.metricInsightItem}>
                        <Text style={styles.metricInsightLabel}>Highest</Text>
                        <Text style={styles.metricInsightValue}>{maxCalories.toFixed(0)}</Text>
                        <Text style={styles.metricInsightUnit}>kcal</Text>
                      </View>
                      <View style={styles.metricDividerVertical} />
                      <View style={styles.metricInsightItem}>
                        <Text style={styles.metricInsightLabel}>Lowest</Text>
                        <Text style={styles.metricInsightValue}>{minCalories.toFixed(0)}</Text>
                        <Text style={styles.metricInsightUnit}>kcal</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.nutritionMetricsSection}>
                  <View style={styles.sectionTitleRow}>
                    <Text style={styles.metricsIcon}>💪</Text>
                    <Text style={styles.sectionSubtitle}>Protein</Text>
                  </View>
                  <View style={styles.metricInsightCard}>
                    <View style={styles.metricInsightRow}>
                      <View style={styles.metricInsightItem}>
                        <Text style={styles.metricInsightLabel}>Average</Text>
                        <Text style={styles.metricInsightValue}>{avgProtein.toFixed(0)}</Text>
                        <Text style={styles.metricInsightUnit}>g/day</Text>
                      </View>
                      <View style={styles.metricDividerVertical} />
                      <View style={styles.metricInsightItem}>
                        <Text style={styles.metricInsightLabel}>Best Day</Text>
                        <Text style={styles.metricInsightValue}>{maxProtein.toFixed(0)}</Text>
                        <Text style={styles.metricInsightUnit}>g</Text>
                      </View>
                      <View style={styles.metricDividerVertical} />
                      <View style={styles.metricInsightItem}>
                        <Text style={styles.metricInsightLabel}>Per 1000 cal</Text>
                        <Text style={styles.metricInsightValue}>{avgCalories > 0 ? ((avgProtein / avgCalories) * 1000).toFixed(0) : 0}</Text>
                        <Text style={styles.metricInsightUnit}>g</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.macrosSection}>
                  <View style={styles.sectionTitleRow}>
                    <Text style={styles.metricsIcon}>🍽️</Text>
                    <Text style={styles.sectionSubtitle}>Macronutrients</Text>
                  </View>
                  <View style={styles.macroInsightCard}>
                    <View style={styles.macroRow}>
                      <View style={styles.macroItem}>
                        <Text style={styles.macroEmoji}>🌾</Text>
                        <Text style={styles.macroLabel}>Carbs</Text>
                        <Text style={styles.macroValue}>{avgCarbs.toFixed(0)} g</Text>
                        <Text style={styles.macroPercentage}>{avgCalories > 0 ? ((avgCarbs * 4 / avgCalories) * 100).toFixed(0) : 0}%</Text>
                      </View>
                      <View style={styles.macroItem}>
                        <Text style={styles.macroEmoji}>🥑</Text>
                        <Text style={styles.macroLabel}>Fat</Text>
                        <Text style={styles.macroValue}>{avgFat.toFixed(0)} g</Text>
                        <Text style={styles.macroPercentage}>{avgCalories > 0 ? ((avgFat * 9 / avgCalories) * 100).toFixed(0) : 0}%</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.nutritionMetricsSection}>
                  <View style={styles.sectionTitleRow}>
                    <Text style={styles.metricsIcon}>💧</Text>
                    <Text style={styles.sectionSubtitle}>Hydration</Text>
                  </View>
                  <View style={styles.metricInsightCard}>
                    <View style={styles.metricInsightRow}>
                      <View style={styles.metricInsightItem}>
                        <Text style={styles.metricInsightLabel}>Daily Average</Text>
                        <Text style={styles.metricInsightValue}>{avgWater.toFixed(1)}</Text>
                        <Text style={styles.metricInsightUnit}>glasses</Text>
                      </View>
                      <View style={styles.metricDividerVertical} />
                      <View style={styles.metricInsightItem}>
                        <Text style={styles.metricInsightLabel}>Best Day</Text>
                        <Text style={styles.metricInsightValue}>{maxWater.toFixed(0)}</Text>
                        <Text style={styles.metricInsightUnit}>glasses</Text>
                      </View>
                      <View style={styles.metricDividerVertical} />
                      <View style={styles.metricInsightItem}>
                        <Text style={styles.metricInsightLabel}>Total</Text>
                        <Text style={styles.metricInsightValue}>{(waterValues.reduce((a, b) => a + b, 0)).toFixed(0)}</Text>
                        <Text style={styles.metricInsightUnit}>glasses</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {weightValues.length > 0 && (
                  <View style={styles.nutritionMetricsSection}>
                    <View style={styles.sectionTitleRow}>
                      <Text style={styles.metricsIcon}>⚖️</Text>
                      <Text style={styles.sectionSubtitle}>Weight</Text>
                    </View>
                    <View style={styles.weightInsightCard}>
                      <View style={styles.weightTrendHeader}>
                        <View style={styles.weightTrendIcon}>
                          {getTrendIcon(weightTrend)}
                        </View>
                        <View style={styles.weightTrendInfo}>
                          <Text style={styles.weightTrendLabel}>Progress</Text>
                          <Text style={styles.weightTrendValue}>{getTrendText(weightTrend)}</Text>
                        </View>
                      </View>
                      <View style={styles.weightDetailsRow}>
                        <View style={styles.weightDetail}>
                          <Text style={styles.weightDetailLabel}>Start</Text>
                          <Text style={styles.weightDetailValue}>{startWeight?.toFixed(1)} kg</Text>
                        </View>
                        <View style={styles.metricDividerVertical} />
                        <View style={styles.weightDetail}>
                          <Text style={styles.weightDetailLabel}>Current</Text>
                          <Text style={styles.weightDetailValue}>{latestWeight?.toFixed(1)} kg</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}

                <View style={styles.bottomSpacer} />
              </View>
            );
          })()}
        </ScrollView>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {filteredWorkoutHistory.length === 0 && filteredCardioHistory.length === 0 ? (
            <View style={styles.emptyWorkoutContainer}>
              <Dumbbell size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyWorkoutTitle}>No Workouts Yet</Text>
              <Text style={styles.emptyWorkoutText}>
                Complete workouts to see your history here!
              </Text>
            </View>
          ) : (
            <View style={styles.workoutHistoryContainer}>
              <View style={styles.statsOverview}>
                <View style={styles.statsRow}>
                  <View style={styles.statCard}>
                    <View style={[styles.statIconContainer, { backgroundColor: '#FF6B6B15' }]}>
                      <Dumbbell size={20} color="#FF6B6B" />
                    </View>
                    <Text style={styles.statValue}>{totalActivities}</Text>
                    <Text style={styles.statLabel}>Total Activities</Text>
                  </View>
                  <View style={styles.statCard}>
                    <View style={[styles.statIconContainer, { backgroundColor: '#4ECDC415' }]}>
                      <TrendingUp size={20} color="#4ECDC4" />
                    </View>
                    <Text style={styles.statValue}>{(totalVolume / 1000).toFixed(1)}k</Text>
                    <Text style={styles.statLabel}>Volume (kg)</Text>
                  </View>
                </View>
                <View style={styles.statsRow}>
                  <View style={styles.statCard}>
                    <View style={[styles.statIconContainer, { backgroundColor: '#FFE66D15' }]}>
                      <Clock size={20} color="#FFE66D" />
                    </View>
                    <Text style={styles.statValue}>{totalMinutes}</Text>
                    <Text style={styles.statLabel}>Minutes</Text>
                  </View>
                  <View style={styles.statCard}>
                    <View style={[styles.statIconContainer, { backgroundColor: '#A29BFE15' }]}>
                      <Zap size={20} color="#A29BFE" />
                    </View>
                    <Text style={styles.statValue}>{avgDuration}</Text>
                    <Text style={styles.statLabel}>Avg Duration</Text>
                  </View>
                </View>
              </View>

              <View style={styles.personalBestsSection}>
                <View style={styles.sectionTitleRow}>
                  <Award size={18} color={Colors.primaryAccent} />
                  <Text style={styles.sectionSubtitle}>Personal Records</Text>
                </View>
                {personalBests.length > 0 ? (
                  personalBests.slice(0, 5).map((pb, index) => (
                    <View key={index} style={styles.personalBestCard}>
                      <View style={styles.pbLeft}>
                        <Text style={styles.pbExercise}>{pb.exerciseName}</Text>
                        <Text style={styles.pbDate}>
                          {new Date(pb.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Text>
                      </View>
                      <View style={styles.pbRight}>
                        <Text style={styles.pbWeight}>{pb.weight} kg × {pb.reps}</Text>
                        <Text style={styles.pbVolume}>{pb.volume.toFixed(0)} kg total</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyPRCard}>
                    <Text style={styles.emptyPRText}>Complete workouts with weights to track your PRs</Text>
                  </View>
                )}
              </View>

              {topExercises.length > 0 && (
                <View style={styles.topExercisesSection}>
                  <View style={styles.sectionTitleRow}>
                    <TrendingUp size={18} color={Colors.primaryAccent} />
                    <Text style={styles.sectionSubtitle}>Most Performed</Text>
                  </View>
                  <View style={styles.topExercisesList}>
                    {topExercises.map((exercise, index) => (
                      <View key={index} style={styles.topExerciseItem}>
                        <View style={styles.topExerciseRank}>
                          <Text style={styles.topExerciseRankText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.topExerciseName}>{exercise.name}</Text>
                        <Text style={styles.topExerciseCount}>{exercise.count}×</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.workoutHistorySectionHeader}>
                <Text style={styles.sectionSubtitle}>Activity History</Text>
              </View>
              {allDates.map((date) => (
                  <View key={date} style={styles.dateSection}>
                    <Text style={styles.dateHeader}>{date}</Text>
                    {workoutsByDate[date]?.map((workout) => (
                      <View key={workout.id} style={styles.workoutCard}>
                        <View style={styles.workoutHeader}>
                          <View style={styles.workoutTitleRow}>
                            <Dumbbell size={18} color={Colors.primaryAccent} />
                            <Text style={styles.workoutName}>{workout.routineName}</Text>
                          </View>
                          <View style={styles.workoutBadge}>
                            <CheckCircle size={14} color="#34C759" />
                            <Text style={styles.workoutBadgeText}>Completed</Text>
                          </View>
                        </View>
                        <View style={styles.workoutStats}>
                          <View style={styles.workoutStat}>
                            <Clock size={14} color={Colors.textSecondary} />
                            <Text style={styles.workoutStatText}>
                              {formatDuration(workout.startedAt, workout.completedAt)}
                            </Text>
                          </View>
                          <View style={styles.workoutStatDivider} />
                          <View style={styles.workoutStat}>
                            <Text style={styles.workoutStatText}>
                              {workout.totalSets} {"sets"}
                            </Text>
                          </View>
                          <View style={styles.workoutStatDivider} />
                          <View style={styles.workoutStat}>
                            <Text style={styles.workoutStatText}>
                              {workout.totalReps} {"reps"}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.exercisesList}>
                          {workout.exercises.slice(0, 3).map((exercise, idx) => (
                            <Text key={exercise.id} style={styles.exerciseItem}>
                              • {exercise.name}
                            </Text>
                          ))}
                          {workout.exercises.length > 3 && (
                            <Text style={styles.moreExercises}>
                              {`+${workout.exercises.length - 3} more`}
                            </Text>
                          )}
                        </View>
                      </View>
                    ))}
                    {cardioByDate[date]?.map((activity) => (
                      <View key={activity.id} style={styles.workoutCard}>
                        <View style={styles.workoutHeader}>
                          <View style={styles.workoutTitleRow}>
                            <MapPin size={18} color={Colors.primaryAccent} />
                            <Text style={styles.workoutName}>
                              {getActivityIcon(activity.type)} {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                            </Text>
                          </View>
                          <View style={styles.workoutBadge}>
                            <CheckCircle size={14} color="#34C759" />
                            <Text style={styles.workoutBadgeText}>Completed</Text>
                          </View>
                        </View>
                        <View style={styles.workoutStats}>
                          <View style={styles.workoutStat}>
                            <Clock size={14} color={Colors.textSecondary} />
                            <Text style={styles.workoutStatText}>
                              {formatCardioDuration(activity.duration)}
                            </Text>
                          </View>
                          <View style={styles.workoutStatDivider} />
                          <View style={styles.workoutStat}>
                            <Text style={styles.workoutStatText}>
                              {formatDistance(activity.distance)}
                            </Text>
                          </View>
                          {activity.averageSpeed && activity.averageSpeed > 0 && (
                            <>
                              <View style={styles.workoutStatDivider} />
                              <View style={styles.workoutStat}>
                                <Text style={styles.workoutStatText}>
                                  {activity.averageSpeed.toFixed(1)} km/h
                                </Text>
                              </View>
                            </>
                          )}
                        </View>
                        {activity.steps && activity.steps > 0 && (
                          <View style={styles.cardioDetails}>
                            <Text style={styles.cardioDetailText}>{`👣 ${activity.steps.toLocaleString()} steps`}</Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                ))}
              <View style={styles.bottomSpacer} />
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
  },
  timeRangeButtons: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  timeRangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeRangeButtonActive: {
    backgroundColor: Colors.primaryAccent,
    borderColor: Colors.primaryAccent,
  },
  timeRangeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  timeRangeButtonTextActive: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  nutritionInsightsContainer: {
    paddingTop: 16,
  },
  insightsOverview: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  insightCard: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: Platform.OS === 'android' ? 8 : 12,
    padding: 16,
    alignItems: "center",
    borderWidth: Platform.OS === 'ios' ? 0 : 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: Platform.OS === 'ios' ? 1 : 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.08 : 0.05,
    shadowRadius: Platform.OS === 'ios' ? 4 : 8,
    elevation: Platform.OS === 'android' ? 3 : 0,
  },
  insightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  insightValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 2,
  },
  insightLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
    textAlign: "center",
  },
  nutritionMetricsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  metricsIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  metricInsightCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Platform.OS === 'android' ? 8 : 12,
    padding: 16,
    borderWidth: Platform.OS === 'ios' ? 0 : 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: Platform.OS === 'ios' ? 1 : 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.08 : 0.05,
    shadowRadius: Platform.OS === 'ios' ? 4 : 8,
    elevation: Platform.OS === 'android' ? 3 : 0,
  },
  metricInsightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricInsightItem: {
    flex: 1,
    alignItems: "center",
  },
  metricInsightLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 6,
    fontWeight: "500",
  },
  metricInsightValue: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 2,
  },
  metricInsightUnit: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  metricDividerVertical: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  macrosSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  macroInsightCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Platform.OS === 'android' ? 8 : 12,
    padding: 16,
    borderWidth: Platform.OS === 'ios' ? 0 : 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: Platform.OS === 'ios' ? 1 : 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.08 : 0.05,
    shadowRadius: Platform.OS === 'ios' ? 4 : 8,
    elevation: Platform.OS === 'android' ? 3 : 0,
  },
  macroRow: {
    flexDirection: "row",
    gap: 12,
  },
  macroItem: {
    flex: 1,
    alignItems: "center",
  },
  macroEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  macroLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
    fontWeight: "600",
  },
  macroValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  macroPercentage: {
    fontSize: 12,
    color: Colors.primaryAccent,
    fontWeight: "600",
  },
  weightInsightCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Platform.OS === 'android' ? 8 : 12,
    padding: 16,
    borderWidth: Platform.OS === 'ios' ? 0 : 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: Platform.OS === 'ios' ? 1 : 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.08 : 0.05,
    shadowRadius: Platform.OS === 'ios' ? 4 : 8,
    elevation: Platform.OS === 'android' ? 3 : 0,
  },
  weightTrendHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  weightTrendIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryAccent + '15',
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  weightTrendInfo: {
    flex: 1,
  },
  weightTrendLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: "500",
  },
  weightTrendValue: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  weightDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  weightDetail: {
    flex: 1,
    alignItems: "center",
  },
  weightDetailLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 6,
    fontWeight: "500",
  },
  weightDetailValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },

  bottomSpacer: {
    height: 24,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  tabButtons: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: Colors.primaryAccent,
    borderColor: Colors.primaryAccent,
  },
  tabButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  tabButtonTextActive: {
    color: "#FFFFFF",
  },
  emptyWorkoutContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyWorkoutTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyWorkoutText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  workoutHistoryContainer: {
    paddingTop: 8,
  },
  dateSection: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginLeft: 16,
    marginBottom: 10,
    marginTop: 8,
  },
  workoutCard: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 16,
    borderRadius: Platform.OS === 'android' ? 8 : 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: Platform.OS === 'ios' ? 0 : 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: Platform.OS === 'ios' ? 1 : 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.08 : 0.05,
    shadowRadius: Platform.OS === 'ios' ? 4 : 8,
    elevation: Platform.OS === 'android' ? 3 : 0,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  workoutTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    flex: 1,
  },
  workoutBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#34C75915",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  workoutBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#34C759",
  },
  workoutStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  workoutStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  workoutStatText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  workoutStatDivider: {
    width: 1,
    height: 12,
    backgroundColor: Colors.border,
  },
  exercisesList: {
    gap: 4,
  },
  exerciseItem: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  moreExercises: {
    fontSize: 13,
    color: Colors.primaryAccent,
    fontWeight: "600",
    marginTop: 2,
  },
  statsOverview: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: Platform.OS === 'android' ? 8 : 12,
    padding: 16,
    borderWidth: Platform.OS === 'ios' ? 0 : 1,
    borderColor: Colors.border,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: Platform.OS === 'ios' ? 1 : 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.08 : 0.05,
    shadowRadius: Platform.OS === 'ios' ? 4 : 8,
    elevation: Platform.OS === 'android' ? 3 : 0,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
    textAlign: "center",
  },
  personalBestsSection: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  personalBestCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pbLeft: {
    flex: 1,
  },
  pbExercise: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  pbDate: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  pbRight: {
    alignItems: "flex-end",
  },
  pbWeight: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primaryAccent,
    marginBottom: 4,
  },
  pbVolume: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  emptyPRCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed" as const,
  },
  emptyPRText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  topExercisesSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  topExercisesList: {
    gap: 8,
  },
  topExerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topExerciseRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryAccent,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  topExerciseRankText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  topExerciseName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  topExerciseCount: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  workoutHistorySectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  cardioDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cardioDetailText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
});
