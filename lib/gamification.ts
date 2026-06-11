import { store, PantryItem, MealPlan } from "./store"

export interface Achievement {
  id: string
  name: string
  description: string
  emoji: string
  points: number
  condition: (data: AchievementData) => boolean
}

export interface EarnedAchievement {
  id: string
  earnedAt: string
}

export interface AchievementData {
  pantry: PantryItem[]
  mealPlan: MealPlan[]
  guests: Guest[]
  shoppingList: { id: string; checked: boolean }[]
  streak: number
  healthMode: string
}

export interface Guest {
  id: string
  name: string
  visitDate?: string
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "zero_waste_week",
    name: "Zero Waste Week",
    description: "No items expired in the last 7 days",
    emoji: "🌿",
    points: 50,
    condition: ({ pantry }) => {
      const sevenDaysAgo = Date.now() - 7 * 86400000
      return !pantry.some(i => i.expiryDate && new Date(i.expiryDate).getTime() < Date.now() && new Date(i.expiryDate).getTime() > sevenDaysAgo)
    },
  },
  {
    id: "five_a_day_streak",
    name: "5-a-Day Streak",
    description: "Maintained a healthy eating streak for 3+ days",
    emoji: "🥦",
    points: 30,
    condition: ({ streak }) => streak >= 3,
  },
  {
    id: "pantry_pro",
    name: "Pantry Pro",
    description: "Tracking 20 or more items in your pantry",
    emoji: "🏆",
    points: 40,
    condition: ({ pantry }) => pantry.length >= 20,
  },
  {
    id: "meal_planner",
    name: "Meal Planner",
    description: "Planned meals for a full week",
    emoji: "📅",
    points: 60,
    condition: ({ mealPlan }) => {
      const uniqueDates = new Set(mealPlan.map(m => m.date))
      return uniqueDates.size >= 7
    },
  },
  {
    id: "social_butterfly",
    name: "Social Butterfly",
    description: "Added 3 or more guests to the family list",
    emoji: "🦋",
    points: 25,
    condition: ({ guests }) => guests.length >= 3,
  },
  {
    id: "fridge_clear",
    name: "Fridge Clear",
    description: "Used items before they expired (no expired items)",
    emoji: "🧊",
    points: 35,
    condition: ({ pantry }) => {
      return !pantry.some(i => i.expiryDate && new Date(i.expiryDate) < new Date())
    },
  },
  {
    id: "first_scan",
    name: "First Scan",
    description: "Added your first barcode-scanned item",
    emoji: "📷",
    points: 20,
    condition: ({ pantry }) => pantry.some(i => !!i.barcode),
  },
  {
    id: "shopping_hero",
    name: "Shopping Hero",
    description: "Completed your full shopping list",
    emoji: "🛒",
    points: 30,
    condition: ({ shoppingList }) => shoppingList.length > 0 && shoppingList.every(i => i.checked),
  },
]

const STREAK_KEY = "pantri_streak"

export interface StreakData {
  currentStreak: number
  lastCheckedDate: string
  longestStreak: number
}

export function getStreak(): StreakData {
  if (typeof window === "undefined") return { currentStreak: 0, lastCheckedDate: "", longestStreak: 0 }
  const raw = localStorage.getItem(STREAK_KEY)
  if (!raw) return { currentStreak: 0, lastCheckedDate: "", longestStreak: 0 }
  return JSON.parse(raw)
}

export function updateStreak(): StreakData {
  if (typeof window === "undefined") return { currentStreak: 0, lastCheckedDate: "", longestStreak: 0 }
  const today = new Date().toISOString().split("T")[0]
  const data = getStreak()

  if (data.lastCheckedDate === today) return data

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]
  const newStreak = data.lastCheckedDate === yesterday ? data.currentStreak + 1 : 1
  const newData: StreakData = {
    currentStreak: newStreak,
    lastCheckedDate: today,
    longestStreak: Math.max(data.longestStreak, newStreak),
  }
  localStorage.setItem(STREAK_KEY, JSON.stringify(newData))
  return newData
}

const EARNED_KEY = "pantri_achievements"

export function getEarnedAchievements(): EarnedAchievement[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(EARNED_KEY) || "[]")
}

export function calculateAchievements(): EarnedAchievement[] {
  if (typeof window === "undefined") return []
  const pantry = store.getPantry()
  const mealPlan = store.getMealPlan()
  const shoppingList = store.getShoppingList()
  const guestsRaw = localStorage.getItem("pantri_guests")
  const guests: Guest[] = guestsRaw ? JSON.parse(guestsRaw) : []
  const streak = getStreak().currentStreak

  const data: AchievementData = { pantry, mealPlan, guests, shoppingList, streak, healthMode: store.getActiveHealthMode() }

  const existing = getEarnedAchievements()
  const existingIds = new Set(existing.map(e => e.id))

  const newlyEarned: EarnedAchievement[] = []
  for (const ach of ACHIEVEMENTS) {
    if (!existingIds.has(ach.id) && ach.condition(data)) {
      newlyEarned.push({ id: ach.id, earnedAt: new Date().toISOString() })
    }
  }

  const all = [...existing, ...newlyEarned]
  localStorage.setItem(EARNED_KEY, JSON.stringify(all))
  return all
}

export interface Level {
  name: string
  color: string
  minPoints: number
  maxPoints: number | null
}

export const LEVELS: Level[] = [
  { name: "Bronze", color: "#CD7F32", minPoints: 0, maxPoints: 100 },
  { name: "Silver", color: "#C0C0C0", minPoints: 100, maxPoints: 300 },
  { name: "Gold", color: "#FFD700", minPoints: 300, maxPoints: 700 },
  { name: "Platinum", color: "#E5E4E2", minPoints: 700, maxPoints: null },
]

export function getTotalPoints(earned: EarnedAchievement[]): number {
  const earnedIds = new Set(earned.map(e => e.id))
  return ACHIEVEMENTS.filter(a => earnedIds.has(a.id)).reduce((sum, a) => sum + a.points, 0)
}

export function getCurrentLevel(points: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) return LEVELS[i]
  }
  return LEVELS[0]
}

export function getLevelProgress(points: number): { level: Level; progress: number; nextLevel: Level | null } {
  const level = getCurrentLevel(points)
  const nextLevel = LEVELS.find(l => l.minPoints > level.minPoints) || null
  const progress = nextLevel
    ? ((points - level.minPoints) / (nextLevel.minPoints - level.minPoints)) * 100
    : 100
  return { level, progress, nextLevel }
}
