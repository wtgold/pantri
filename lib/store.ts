// Simple localStorage-based store for MVP (replace with Supabase later)
export interface PantryItem {
  id: string
  barcode?: string
  name: string
  brand: string
  quantity: number
  unit: string
  category: string
  expiryDate?: string
  imageUrl?: string
  addedAt: string
  nutriments?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export interface ShoppingItem {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  checked: boolean
  addedAt: string
}

export interface MealPlan {
  id: string
  date: string
  mealType: "breakfast" | "lunch" | "dinner" | "snack"
  name: string
  servings: number
  lastHad?: string
}

export interface HealthMode {
  id: string
  name: string
  description: string
  emoji: string
  active: boolean
}

export const HEALTH_MODES: HealthMode[] = [
  { id: "balanced", name: "Balanced", description: "Well-rounded nutrition", emoji: "⚖️", active: true },
  { id: "trim", name: "2 Week Trim", description: "Lower calorie, higher protein", emoji: "🏃", active: false },
  { id: "highprotein", name: "High Protein", description: "Muscle building focus", emoji: "💪", active: false },
  { id: "mediterranean", name: "Mediterranean", description: "Heart-healthy whole foods", emoji: "🫒", active: false },
  { id: "doctors", name: "Doctor's Orders", description: "Condition-specific guidance", emoji: "🩺", active: false },
  { id: "recovery", name: "Under the Weather", description: "Gentle, nourishing meals when unwell", emoji: "🤧", active: false },
]

function key(k: string) { return `pantri_${k}` }

export const store = {
  getPantry(): PantryItem[] {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem(key("pantry")) || "[]")
  },
  savePantry(items: PantryItem[]) {
    localStorage.setItem(key("pantry"), JSON.stringify(items))
  },
  addPantryItem(item: PantryItem) {
    const items = this.getPantry()
    items.push(item)
    this.savePantry(items)
  },
  removePantryItem(id: string) {
    this.savePantry(this.getPantry().filter(i => i.id !== id))
  },

  getShoppingList(): ShoppingItem[] {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem(key("shopping")) || "[]")
  },
  saveShoppingList(items: ShoppingItem[]) {
    localStorage.setItem(key("shopping"), JSON.stringify(items))
  },
  addShoppingItem(item: ShoppingItem) {
    const items = this.getShoppingList()
    items.push(item)
    this.saveShoppingList(items)
  },

  getMealPlan(): MealPlan[] {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem(key("meals")) || "[]")
  },
  saveMealPlan(meals: MealPlan[]) {
    localStorage.setItem(key("meals"), JSON.stringify(meals))
  },

  getActiveHealthMode(): string {
    if (typeof window === "undefined") return "balanced"
    return localStorage.getItem(key("healthmode")) || "balanced"
  },
  setHealthMode(id: string) {
    localStorage.setItem(key("healthmode"), id)
  },

  getStats() {
    const pantry = this.getPantry()
    const expiringSoon = pantry.filter(i => {
      if (!i.expiryDate) return false
      const days = Math.ceil((new Date(i.expiryDate).getTime() - Date.now()) / 86400000)
      return days <= 3 && days >= 0
    })
    const expired = pantry.filter(i => {
      if (!i.expiryDate) return false
      return new Date(i.expiryDate) < new Date()
    })
    return { total: pantry.length, expiringSoon: expiringSoon.length, expired: expired.length }
  }
}
