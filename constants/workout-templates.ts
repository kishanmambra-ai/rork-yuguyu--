import { Exercise } from "@/types/workout";

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  exercises: Omit<Exercise, 'id'>[];
}

const workoutTemplates: WorkoutTemplate[] = [
  {
    id: "push-1",
    name: "Push Day",
    description: "Chest, shoulders, and triceps focused workout",
    category: "Push/Pull/Legs",
    exercises: [
      {
        name: "Flat Barbell Bench Press",
        muscleGroup: "CHEST",
        sets: [
          { id: "1", reps: 8, weight: 0, completed: false },
          { id: "2", reps: 8, weight: 0, completed: false },
          { id: "3", reps: 8, weight: 0, completed: false },
          { id: "4", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        name: "Incline Dumbbell Press",
        muscleGroup: "CHEST",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
          { id: "3", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Dumbbell Shoulder Press",
        muscleGroup: "SHOULDERS",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
          { id: "3", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Dumbbell Lateral Raise",
        muscleGroup: "SHOULDERS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Rope Pushdown",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Overhead Dumbbell Extension",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
    ],
  },
  {
    id: "pull-1",
    name: "Pull Day",
    description: "Back and biceps focused workout",
    category: "Push/Pull/Legs",
    exercises: [
      {
        name: "Deadlift",
        muscleGroup: "BACK",
        sets: [
          { id: "1", reps: 5, weight: 0, completed: false },
          { id: "2", reps: 5, weight: 0, completed: false },
          { id: "3", reps: 5, weight: 0, completed: false },
          { id: "4", reps: 5, weight: 0, completed: false },
        ],
      },
      {
        name: "Pull-Ups (Wide Grip)",
        muscleGroup: "BACK",
        sets: [
          { id: "1", reps: 8, weight: 0, completed: false },
          { id: "2", reps: 8, weight: 0, completed: false },
          { id: "3", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        name: "Bent-Over Barbell Row",
        muscleGroup: "BACK",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
          { id: "3", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Seated Cable Row",
        muscleGroup: "BACK",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Barbell Curl",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
          { id: "3", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Hammer Curl",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
    ],
  },
  {
    id: "legs-1",
    name: "Leg Day",
    description: "Quads, hamstrings, and glutes focused workout",
    category: "Push/Pull/Legs",
    exercises: [
      {
        name: "Back Squat",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 8, weight: 0, completed: false },
          { id: "2", reps: 8, weight: 0, completed: false },
          { id: "3", reps: 8, weight: 0, completed: false },
          { id: "4", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        name: "Romanian Deadlift",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
          { id: "3", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Leg Press",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Leg Extension",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Lying Leg Curl Machine",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Standing Calf Raise Machine",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 15, weight: 0, completed: false },
          { id: "2", reps: 15, weight: 0, completed: false },
          { id: "3", reps: 15, weight: 0, completed: false },
        ],
      },
    ],
  },
  {
    id: "upper-1",
    name: "Upper Body",
    description: "Complete upper body workout",
    category: "Upper/Lower",
    exercises: [
      {
        name: "Flat Barbell Bench Press",
        muscleGroup: "CHEST",
        sets: [
          { id: "1", reps: 8, weight: 0, completed: false },
          { id: "2", reps: 8, weight: 0, completed: false },
          { id: "3", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        name: "Bent-Over Barbell Row",
        muscleGroup: "BACK",
        sets: [
          { id: "1", reps: 8, weight: 0, completed: false },
          { id: "2", reps: 8, weight: 0, completed: false },
          { id: "3", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        name: "Dumbbell Shoulder Press",
        muscleGroup: "SHOULDERS",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
          { id: "3", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Lat Pulldown (Wide Grip)",
        muscleGroup: "BACK",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
          { id: "3", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Dumbbell Curl",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Rope Pushdown",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
        ],
      },
    ],
  },
  {
    id: "lower-1",
    name: "Lower Body",
    description: "Complete lower body workout",
    category: "Upper/Lower",
    exercises: [
      {
        name: "Back Squat",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 8, weight: 0, completed: false },
          { id: "2", reps: 8, weight: 0, completed: false },
          { id: "3", reps: 8, weight: 0, completed: false },
          { id: "4", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        name: "Romanian Deadlift",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
          { id: "3", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Dumbbell Bulgarian Split Squat",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
          { id: "3", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Lying Leg Curl Machine",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Standing Calf Raise Machine",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 15, weight: 0, completed: false },
          { id: "2", reps: 15, weight: 0, completed: false },
          { id: "3", reps: 15, weight: 0, completed: false },
        ],
      },
    ],
  },
  {
    id: "full-body-1",
    name: "Full Body Strength",
    description: "Complete full body workout for all muscle groups",
    category: "Full Body",
    exercises: [
      {
        name: "Back Squat",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 8, weight: 0, completed: false },
          { id: "2", reps: 8, weight: 0, completed: false },
          { id: "3", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        name: "Flat Barbell Bench Press",
        muscleGroup: "CHEST",
        sets: [
          { id: "1", reps: 8, weight: 0, completed: false },
          { id: "2", reps: 8, weight: 0, completed: false },
          { id: "3", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        name: "Bent-Over Barbell Row",
        muscleGroup: "BACK",
        sets: [
          { id: "1", reps: 8, weight: 0, completed: false },
          { id: "2", reps: 8, weight: 0, completed: false },
          { id: "3", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        name: "Dumbbell Shoulder Press",
        muscleGroup: "SHOULDERS",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Romanian Deadlift",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Plank",
        muscleGroup: "CORE",
        sets: [
          { id: "1", time: 60, completed: false },
          { id: "2", time: 60, completed: false },
        ],
      },
    ],
  },
  {
    id: "beginner-1",
    name: "Beginner Full Body",
    description: "Perfect for those starting their fitness journey",
    category: "Beginner",
    exercises: [
      {
        name: "Goblet Squat",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
          { id: "3", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Standard Push-up",
        muscleGroup: "CHEST",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
          { id: "3", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Dumbbell Row (Both Arms)",
        muscleGroup: "BACK",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
          { id: "3", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Dumbbell Shoulder Press",
        muscleGroup: "SHOULDERS",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Plank",
        muscleGroup: "CORE",
        sets: [
          { id: "1", time: 30, completed: false },
          { id: "2", time: 30, completed: false },
          { id: "3", time: 30, completed: false },
        ],
      },
    ],
  },
  {
    id: "beginner-2",
    name: "Beginner Upper Body",
    description: "Build upper body strength with simple movements",
    category: "Beginner",
    exercises: [
      {
        name: "Incline Push-Up",
        muscleGroup: "CHEST",
        sets: [
          { id: "1", reps: 12, completed: false },
          { id: "2", reps: 12, completed: false },
          { id: "3", reps: 12, completed: false },
        ],
      },
      {
        name: "Assisted Pull-Up Machine",
        muscleGroup: "BACK",
        sets: [
          { id: "1", reps: 8, weight: 0, completed: false },
          { id: "2", reps: 8, weight: 0, completed: false },
          { id: "3", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        name: "Dumbbell Shoulder Press",
        muscleGroup: "SHOULDERS",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
          { id: "3", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Dumbbell Curl",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Rope Pushdown",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Plank",
        muscleGroup: "CORE",
        sets: [
          { id: "1", time: 30, completed: false },
          { id: "2", time: 30, completed: false },
        ],
      },
    ],
  },
  {
    id: "beginner-3",
    name: "Beginner Lower Body",
    description: "Strengthen legs and glutes with beginner-friendly exercises",
    category: "Beginner",
    exercises: [
      {
        name: "Bodyweight Squat",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 15, completed: false },
          { id: "2", reps: 15, completed: false },
          { id: "3", reps: 15, completed: false },
        ],
      },
      {
        name: "Walking Lunge",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 10, completed: false },
          { id: "2", reps: 10, completed: false },
          { id: "3", reps: 10, completed: false },
        ],
      },
      {
        name: "Leg Press",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Leg Extension",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Lying Leg Curl Machine",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Glute Bridge",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 15, completed: false },
          { id: "2", reps: 15, completed: false },
          { id: "3", reps: 15, completed: false },
        ],
      },
    ],
  },
  {
    id: "beginner-4",
    name: "Beginner Cardio & Conditioning",
    description: "Build endurance and burn calories with simple movements",
    category: "Beginner",
    exercises: [
      {
        name: "Jumping Jacks",
        muscleGroup: "CARDIO",
        sets: [
          { id: "1", reps: 30, completed: false },
          { id: "2", reps: 30, completed: false },
          { id: "3", reps: 30, completed: false },
        ],
      },
      {
        name: "High Knees",
        muscleGroup: "CARDIO",
        sets: [
          { id: "1", time: 30, completed: false },
          { id: "2", time: 30, completed: false },
          { id: "3", time: 30, completed: false },
        ],
      },
      {
        name: "Mountain Climbers",
        muscleGroup: "CARDIO",
        sets: [
          { id: "1", reps: 20, completed: false },
          { id: "2", reps: 20, completed: false },
          { id: "3", reps: 20, completed: false },
        ],
      },
      {
        name: "Bodyweight Squat",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 15, completed: false },
          { id: "2", reps: 15, completed: false },
        ],
      },
      {
        name: "Standard Push-up",
        muscleGroup: "CHEST",
        sets: [
          { id: "1", reps: 10, completed: false },
          { id: "2", reps: 10, completed: false },
        ],
      },
      {
        name: "Burpees",
        muscleGroup: "CARDIO",
        sets: [
          { id: "1", reps: 10, completed: false },
          { id: "2", reps: 10, completed: false },
        ],
      },
      {
        name: "Plank",
        muscleGroup: "CORE",
        sets: [
          { id: "1", time: 30, completed: false },
          { id: "2", time: 30, completed: false },
        ],
      },
    ],
  },
  {
    id: "calisthenics-1",
    name: "Calisthenics Basics",
    description: "Bodyweight movements for strength and control",
    category: "Calisthenics",
    exercises: [
      {
        name: "Pull-Up",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", reps: 8, completed: false },
          { id: "2", reps: 8, completed: false },
          { id: "3", reps: 8, completed: false },
        ],
      },
      {
        name: "Push-Up",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", reps: 15, completed: false },
          { id: "2", reps: 15, completed: false },
          { id: "3", reps: 15, completed: false },
        ],
      },
      {
        name: "Dips",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", reps: 10, completed: false },
          { id: "2", reps: 10, completed: false },
          { id: "3", reps: 10, completed: false },
        ],
      },
      {
        name: "Bodyweight Squat",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", reps: 20, completed: false },
          { id: "2", reps: 20, completed: false },
          { id: "3", reps: 20, completed: false },
        ],
      },
      {
        name: "Hanging Leg Raise",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", reps: 10, completed: false },
          { id: "2", reps: 10, completed: false },
          { id: "3", reps: 10, completed: false },
        ],
      },
      {
        name: "Plank",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", time: 60, completed: false },
          { id: "2", time: 60, completed: false },
        ],
      },
    ],
  },
  {
    id: "calisthenics-2",
    name: "Upper Body Power",
    description: "Advanced upper body calisthenics movements",
    category: "Calisthenics",
    exercises: [
      {
        name: "Muscle-Up",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", reps: 5, completed: false },
          { id: "2", reps: 5, completed: false },
          { id: "3", reps: 5, completed: false },
        ],
      },
      {
        name: "Archer Push-Up",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", reps: 8, completed: false },
          { id: "2", reps: 8, completed: false },
          { id: "3", reps: 8, completed: false },
        ],
      },
      {
        name: "Wide Grip Pull-Up",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", reps: 10, completed: false },
          { id: "2", reps: 10, completed: false },
          { id: "3", reps: 10, completed: false },
        ],
      },
      {
        name: "Decline Push-Up",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", reps: 15, completed: false },
          { id: "2", reps: 15, completed: false },
          { id: "3", reps: 15, completed: false },
        ],
      },
      {
        name: "Ring Dips",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", reps: 8, completed: false },
          { id: "2", reps: 8, completed: false },
          { id: "3", reps: 8, completed: false },
        ],
      },
      {
        name: "Pike Push-Up",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", reps: 12, completed: false },
          { id: "2", reps: 12, completed: false },
          { id: "3", reps: 12, completed: false },
        ],
      },
    ],
  },
  {
    id: "calisthenics-3",
    name: "Core Domination",
    description: "Intense core and abs calisthenics workout",
    category: "Calisthenics",
    exercises: [
      {
        name: "Hanging Leg Raise",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", reps: 12, completed: false },
          { id: "2", reps: 12, completed: false },
          { id: "3", reps: 12, completed: false },
        ],
      },
      {
        name: "L-Sit Hold",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", time: 30, completed: false },
          { id: "2", time: 30, completed: false },
          { id: "3", time: 30, completed: false },
        ],
      },
      {
        name: "Dragon Flag",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", reps: 6, completed: false },
          { id: "2", reps: 6, completed: false },
          { id: "3", reps: 6, completed: false },
        ],
      },
      {
        name: "Windshield Wipers",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", reps: 10, completed: false },
          { id: "2", reps: 10, completed: false },
          { id: "3", reps: 10, completed: false },
        ],
      },
      {
        name: "Ab Wheel Rollout",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", reps: 12, completed: false },
          { id: "2", reps: 12, completed: false },
          { id: "3", reps: 12, completed: false },
        ],
      },
      {
        name: "Hollow Body Hold",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", time: 45, completed: false },
          { id: "2", time: 45, completed: false },
        ],
      },
    ],
  },
  {
    id: "calisthenics-4",
    name: "Skills & Balance",
    description: "Work on advanced calisthenics skills and balance",
    category: "Calisthenics",
    exercises: [
      {
        name: "Handstand Hold",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", time: 30, completed: false },
          { id: "2", time: 30, completed: false },
          { id: "3", time: 30, completed: false },
        ],
      },
      {
        name: "Handstand Push-Up",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", reps: 5, completed: false },
          { id: "2", reps: 5, completed: false },
          { id: "3", reps: 5, completed: false },
        ],
      },
      {
        name: "Front Lever Hold",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", time: 15, completed: false },
          { id: "2", time: 15, completed: false },
          { id: "3", time: 15, completed: false },
        ],
      },
      {
        name: "Back Lever Hold",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", time: 15, completed: false },
          { id: "2", time: 15, completed: false },
          { id: "3", time: 15, completed: false },
        ],
      },
      {
        name: "Planche Lean",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", time: 20, completed: false },
          { id: "2", time: 20, completed: false },
          { id: "3", time: 20, completed: false },
        ],
      },
      {
        name: "Human Flag Hold",
        muscleGroup: "CALISTHENICS",
        sets: [
          { id: "1", time: 10, completed: false },
          { id: "2", time: 10, completed: false },
          { id: "3", time: 10, completed: false },
        ],
      },
    ],
  },
  {
    id: "yoga-1",
    name: "Beginner Yoga Flow",
    description: "Gentle yoga sequence for flexibility and mindfulness",
    category: "Yoga",
    exercises: [
      {
        name: "Sun Salutation A (Surya Namaskar A)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", reps: 5, completed: false },
        ],
      },
      {
        name: "Warrior I (Virabhadrasana I)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 1, completed: false },
          { id: "2", time: 1, completed: false },
        ],
      },
      {
        name: "Warrior II (Virabhadrasana II)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 1, completed: false },
          { id: "2", time: 1, completed: false },
        ],
      },
      {
        name: "Triangle Pose (Trikonasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 1, completed: false },
          { id: "2", time: 1, completed: false },
        ],
      },
      {
        name: "Downward Facing Dog (Adho Mukha Svanasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 2, completed: false },
        ],
      },
      {
        name: "Child's Pose (Balasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 2, completed: false },
        ],
      },
      {
        name: "Corpse Pose (Savasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 5, completed: false },
        ],
      },
    ],
  },
  {
    id: "yoga-2",
    name: "Power Yoga",
    description: "Dynamic yoga sequence for strength and flexibility",
    category: "Yoga",
    exercises: [
      {
        name: "Sun Salutation B (Surya Namaskar B)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", reps: 5, completed: false },
        ],
      },
      {
        name: "Warrior III (Virabhadrasana III)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 1, completed: false },
          { id: "2", time: 1, completed: false },
        ],
      },
      {
        name: "Chair Pose (Utkatasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 1, completed: false },
          { id: "2", time: 1, completed: false },
        ],
      },
      {
        name: "Plank",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 1, completed: false },
          { id: "2", time: 1, completed: false },
        ],
      },
      {
        name: "Boat Pose (Navasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 1, completed: false },
          { id: "2", time: 1, completed: false },
        ],
      },
      {
        name: "Crow Pose (Kakasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 1, completed: false },
          { id: "2", time: 1, completed: false },
        ],
      },
      {
        name: "Corpse Pose (Savasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 5, completed: false },
        ],
      },
    ],
  },
  {
    id: "yoga-3",
    name: "Flexibility & Stretch",
    description: "Deep stretching for improved flexibility and recovery",
    category: "Yoga",
    exercises: [
      {
        name: "Cat-Cow Pose (Marjaryasana-Bitilasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 2, completed: false },
        ],
      },
      {
        name: "Seated Forward Fold (Paschimottanasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 2, completed: false },
        ],
      },
      {
        name: "Pigeon Pose (Eka Pada Rajakapotasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 2, completed: false },
          { id: "2", time: 2, completed: false },
        ],
      },
      {
        name: "Supine Spinal Twist (Supta Matsyendrasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 2, completed: false },
          { id: "2", time: 2, completed: false },
        ],
      },
      {
        name: "Butterfly Pose (Baddha Konasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 2, completed: false },
        ],
      },
      {
        name: "Lizard Pose (Utthan Pristhasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 2, completed: false },
          { id: "2", time: 2, completed: false },
        ],
      },
      {
        name: "Happy Baby Pose (Ananda Balasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 2, completed: false },
        ],
      },
      {
        name: "Corpse Pose (Savasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 5, completed: false },
        ],
      },
    ],
  },
  {
    id: "yoga-4",
    name: "Morning Energizer",
    description: "Invigorating flow to start your day with energy",
    category: "Yoga",
    exercises: [
      {
        name: "Sun Salutation A (Surya Namaskar A)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", reps: 3, completed: false },
        ],
      },
      {
        name: "Standing Forward Fold (Uttanasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 1, completed: false },
        ],
      },
      {
        name: "Low Lunge (Anjaneyasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 1, completed: false },
          { id: "2", time: 1, completed: false },
        ],
      },
      {
        name: "Warrior I (Virabhadrasana I)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 1, completed: false },
          { id: "2", time: 1, completed: false },
        ],
      },
      {
        name: "Tree Pose (Vrksasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 1, completed: false },
          { id: "2", time: 1, completed: false },
        ],
      },
      {
        name: "Camel Pose (Ustrasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 1, completed: false },
        ],
      },
      {
        name: "Bridge Pose (Setu Bandhasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 1, completed: false },
          { id: "2", time: 1, completed: false },
        ],
      },
      {
        name: "Corpse Pose (Savasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 3, completed: false },
        ],
      },
    ],
  },
  {
    id: "yoga-5",
    name: "Evening Relaxation",
    description: "Calming sequence for unwinding and better sleep",
    category: "Yoga",
    exercises: [
      {
        name: "Easy Pose (Sukhasana) with Breathing",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 3, completed: false },
        ],
      },
      {
        name: "Seated Side Stretch",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 1, completed: false },
          { id: "2", time: 1, completed: false },
        ],
      },
      {
        name: "Seated Forward Fold (Paschimottanasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 2, completed: false },
        ],
      },
      {
        name: "Supine Spinal Twist (Supta Matsyendrasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 2, completed: false },
          { id: "2", time: 2, completed: false },
        ],
      },
      {
        name: "Legs Up The Wall (Viparita Karani)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 5, completed: false },
        ],
      },
      {
        name: "Child's Pose (Balasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 3, completed: false },
        ],
      },
      {
        name: "Corpse Pose (Savasana)",
        muscleGroup: "YOGA",
        sets: [
          { id: "1", time: 10, completed: false },
        ],
      },
    ],
  },
  {
    id: "arms-1",
    name: "Arm Blast",
    description: "Intense biceps and triceps workout",
    category: "Specialty",
    exercises: [
      {
        name: "Barbell Curl",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
          { id: "3", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Close-Grip Bench Press",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
          { id: "3", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Hammer Curl",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Skull Crushers",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Cable Curl",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 15, weight: 0, completed: false },
          { id: "2", reps: 15, weight: 0, completed: false },
        ],
      },
      {
        name: "Rope Pushdown",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 15, weight: 0, completed: false },
          { id: "2", reps: 15, weight: 0, completed: false },
        ],
      },
    ],
  },
  {
    id: "core-1",
    name: "Core Crusher",
    description: "Comprehensive core and abs workout",
    category: "Specialty",
    exercises: [
      {
        name: "Plank",
        muscleGroup: "CORE",
        sets: [
          { id: "1", time: 60, completed: false },
          { id: "2", time: 60, completed: false },
          { id: "3", time: 60, completed: false },
        ],
      },
      {
        name: "Hanging Leg Raise",
        muscleGroup: "CORE",
        sets: [
          { id: "1", reps: 12, completed: false },
          { id: "2", reps: 12, completed: false },
          { id: "3", reps: 12, completed: false },
        ],
      },
      {
        name: "Russian Twist",
        muscleGroup: "CORE",
        sets: [
          { id: "1", reps: 20, completed: false },
          { id: "2", reps: 20, completed: false },
          { id: "3", reps: 20, completed: false },
        ],
      },
      {
        name: "Cable Crunch",
        muscleGroup: "CORE",
        sets: [
          { id: "1", reps: 15, weight: 0, completed: false },
          { id: "2", reps: 15, weight: 0, completed: false },
          { id: "3", reps: 15, weight: 0, completed: false },
        ],
      },
      {
        name: "Side Plank",
        muscleGroup: "CORE",
        sets: [
          { id: "1", time: 45, completed: false },
          { id: "2", time: 45, completed: false },
        ],
      },
      {
        name: "Bicycle Crunch",
        muscleGroup: "CORE",
        sets: [
          { id: "1", reps: 20, completed: false },
          { id: "2", reps: 20, completed: false },
        ],
      },
    ],
  },
  {
    id: "bro-chest-1",
    name: "Chest Day",
    description: "Complete chest workout with volume for hypertrophy",
    category: "Bro Split",
    exercises: [
      {
        name: "Flat Barbell Bench Press",
        muscleGroup: "CHEST",
        sets: [
          { id: "1", reps: 8, weight: 0, completed: false },
          { id: "2", reps: 8, weight: 0, completed: false },
          { id: "3", reps: 8, weight: 0, completed: false },
          { id: "4", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        name: "Incline Dumbbell Press",
        muscleGroup: "CHEST",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
          { id: "3", reps: 10, weight: 0, completed: false },
          { id: "4", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Cable Fly (High to Low)",
        muscleGroup: "CHEST",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Dumbbell Fly (Flat Bench)",
        muscleGroup: "CHEST",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Dips (Chest Focused)",
        muscleGroup: "CHEST",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
          { id: "3", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Machine Press",
        muscleGroup: "CHEST",
        sets: [
          { id: "1", reps: 15, weight: 0, completed: false },
          { id: "2", reps: 15, weight: 0, completed: false },
          { id: "3", reps: 15, weight: 0, completed: false },
        ],
      },
    ],
  },
  {
    id: "bro-back-1",
    name: "Back Day",
    description: "Complete back workout for thickness and width",
    category: "Bro Split",
    exercises: [
      {
        name: "Deadlift",
        muscleGroup: "BACK",
        sets: [
          { id: "1", reps: 5, weight: 0, completed: false },
          { id: "2", reps: 5, weight: 0, completed: false },
          { id: "3", reps: 5, weight: 0, completed: false },
          { id: "4", reps: 5, weight: 0, completed: false },
        ],
      },
      {
        name: "Pull-Ups (Wide Grip)",
        muscleGroup: "BACK",
        sets: [
          { id: "1", reps: 8, weight: 0, completed: false },
          { id: "2", reps: 8, weight: 0, completed: false },
          { id: "3", reps: 8, weight: 0, completed: false },
          { id: "4", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        name: "Bent-Over Barbell Row",
        muscleGroup: "BACK",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
          { id: "3", reps: 10, weight: 0, completed: false },
          { id: "4", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Seated Cable Row",
        muscleGroup: "BACK",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Lat Pulldown (Wide Grip)",
        muscleGroup: "BACK",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Dumbbell Row (Single Arm)",
        muscleGroup: "BACK",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
    ],
  },
  {
    id: "bro-shoulders-1",
    name: "Shoulder Day",
    description: "Complete shoulder workout for all three heads",
    category: "Bro Split",
    exercises: [
      {
        name: "Dumbbell Shoulder Press",
        muscleGroup: "SHOULDERS",
        sets: [
          { id: "1", reps: 8, weight: 0, completed: false },
          { id: "2", reps: 8, weight: 0, completed: false },
          { id: "3", reps: 8, weight: 0, completed: false },
          { id: "4", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        name: "Barbell Overhead Press",
        muscleGroup: "SHOULDERS",
        sets: [
          { id: "1", reps: 8, weight: 0, completed: false },
          { id: "2", reps: 8, weight: 0, completed: false },
          { id: "3", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        name: "Dumbbell Lateral Raise",
        muscleGroup: "SHOULDERS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
          { id: "4", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Bent-Over Rear Delt Fly",
        muscleGroup: "SHOULDERS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Cable Face Pull",
        muscleGroup: "SHOULDERS",
        sets: [
          { id: "1", reps: 15, weight: 0, completed: false },
          { id: "2", reps: 15, weight: 0, completed: false },
          { id: "3", reps: 15, weight: 0, completed: false },
        ],
      },
      {
        name: "Barbell Shrug",
        muscleGroup: "SHOULDERS",
        sets: [
          { id: "1", reps: 15, weight: 0, completed: false },
          { id: "2", reps: 15, weight: 0, completed: false },
          { id: "3", reps: 15, weight: 0, completed: false },
        ],
      },
    ],
  },
  {
    id: "bro-arms-1",
    name: "Arms Day",
    description: "Biceps and triceps focused workout for arm growth",
    category: "Bro Split",
    exercises: [
      {
        name: "Barbell Curl",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
          { id: "3", reps: 10, weight: 0, completed: false },
          { id: "4", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Close-Grip Bench Press",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
          { id: "3", reps: 10, weight: 0, completed: false },
          { id: "4", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Hammer Curl",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Skull Crushers",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Cable Curl",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 15, weight: 0, completed: false },
          { id: "2", reps: 15, weight: 0, completed: false },
          { id: "3", reps: 15, weight: 0, completed: false },
        ],
      },
      {
        name: "Rope Pushdown",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 15, weight: 0, completed: false },
          { id: "2", reps: 15, weight: 0, completed: false },
          { id: "3", reps: 15, weight: 0, completed: false },
        ],
      },
      {
        name: "Preacher Curl",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Overhead Dumbbell Extension",
        muscleGroup: "ARMS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
        ],
      },
    ],
  },
  {
    id: "bro-legs-1",
    name: "Leg Day",
    description: "Complete lower body workout for legs and glutes",
    category: "Bro Split",
    exercises: [
      {
        name: "Back Squat",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 8, weight: 0, completed: false },
          { id: "2", reps: 8, weight: 0, completed: false },
          { id: "3", reps: 8, weight: 0, completed: false },
          { id: "4", reps: 8, weight: 0, completed: false },
        ],
      },
      {
        name: "Romanian Deadlift",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 10, weight: 0, completed: false },
          { id: "2", reps: 10, weight: 0, completed: false },
          { id: "3", reps: 10, weight: 0, completed: false },
          { id: "4", reps: 10, weight: 0, completed: false },
        ],
      },
      {
        name: "Leg Press",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Walking Lunge",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 12, weight: 0, completed: false },
          { id: "2", reps: 12, weight: 0, completed: false },
          { id: "3", reps: 12, weight: 0, completed: false },
        ],
      },
      {
        name: "Leg Extension",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 15, weight: 0, completed: false },
          { id: "2", reps: 15, weight: 0, completed: false },
          { id: "3", reps: 15, weight: 0, completed: false },
        ],
      },
      {
        name: "Lying Leg Curl Machine",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 15, weight: 0, completed: false },
          { id: "2", reps: 15, weight: 0, completed: false },
          { id: "3", reps: 15, weight: 0, completed: false },
        ],
      },
      {
        name: "Standing Calf Raise Machine",
        muscleGroup: "LEGS",
        sets: [
          { id: "1", reps: 20, weight: 0, completed: false },
          { id: "2", reps: 20, weight: 0, completed: false },
          { id: "3", reps: 20, weight: 0, completed: false },
        ],
      },
    ],
  },
];

export const templateCategories = [
  "Bro Split",
  "Push/Pull/Legs",
  "Upper/Lower",
  "Full Body",
  "Beginner",
  "Calisthenics",
  "Yoga",
  "Specialty",
];

export default workoutTemplates;
