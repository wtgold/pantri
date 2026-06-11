"use client"
import { useState } from "react"
import { Plus, Users, ShoppingCart, CheckCircle, ChevronDown, ChevronUp } from "lucide-react"
import { store, ShoppingItem } from "@/lib/store"

interface Meal {
  name: string
  time: string
  servings: number
  tags: string[]
  emoji: string
  lastHad: string
  ingredients: { name: string; amount: string; unit: string; category: string }[]
}

const SUGGESTED_MEALS: Meal[] = [
  {
    name: "Spaghetti Bolognese", time: "30 min", servings: 4, tags: ["Italian", "Pasta"], emoji: "🍝", lastHad: "8 days ago",
    ingredients: [
      { name: "Spaghetti", amount: "400", unit: "g", category: "Tins & Jars" },
      { name: "Beef mince", amount: "500", unit: "g", category: "Meat & Fish" },
      { name: "Tinned tomatoes", amount: "2", unit: "cans", category: "Tins & Jars" },
      { name: "Onion", amount: "1", unit: "units", category: "Fruit & Veg" },
      { name: "Garlic", amount: "3", unit: "units", category: "Fruit & Veg" },
    ],
  },
  {
    name: "Chicken Stir Fry", time: "20 min", servings: 2, tags: ["Asian", "Quick"], emoji: "🥘", lastHad: "2 weeks ago",
    ingredients: [
      { name: "Chicken breast", amount: "400", unit: "g", category: "Meat & Fish" },
      { name: "Mixed stir fry veg", amount: "300", unit: "g", category: "Fruit & Veg" },
      { name: "Soy sauce", amount: "3", unit: "tbsp", category: "Tins & Jars" },
      { name: "Egg noodles", amount: "200", unit: "g", category: "Tins & Jars" },
    ],
  },
  {
    name: "Tomato Soup & Toast", time: "15 min", servings: 2, tags: ["Soup", "Quick"], emoji: "🍲", lastHad: "3 days ago",
    ingredients: [
      { name: "Tinned tomatoes", amount: "2", unit: "cans", category: "Tins & Jars" },
      { name: "Bread", amount: "4", unit: "slices", category: "Bakery" },
      { name: "Onion", amount: "1", unit: "units", category: "Fruit & Veg" },
      { name: "Vegetable stock", amount: "500", unit: "ml", category: "Tins & Jars" },
    ],
  },
  {
    name: "Salmon & Veg", time: "25 min", servings: 2, tags: ["Fish", "Healthy"], emoji: "🐟", lastHad: "5 days ago",
    ingredients: [
      { name: "Salmon fillets", amount: "2", unit: "units", category: "Meat & Fish" },
      { name: "Broccoli", amount: "200", unit: "g", category: "Fruit & Veg" },
      { name: "New potatoes", amount: "300", unit: "g", category: "Fruit & Veg" },
      { name: "Lemon", amount: "1", unit: "units", category: "Fruit & Veg" },
    ],
  },
  {
    name: "Chicken Curry", time: "45 min", servings: 4, tags: ["Indian", "Batch"], emoji: "🍛", lastHad: "10 days ago",
    ingredients: [
      { name: "Chicken thighs", amount: "600", unit: "g", category: "Meat & Fish" },
      { name: "Curry paste", amount: "3", unit: "tbsp", category: "Tins & Jars" },
      { name: "Coconut milk", amount: "1", unit: "cans", category: "Tins & Jars" },
      { name: "Basmati rice", amount: "300", unit: "g", category: "Tins & Jars" },
      { name: "Onion", amount: "2", unit: "units", category: "Fruit & Veg" },
    ],
  },
  {
    name: "Omelette", time: "10 min", servings: 1, tags: ["Eggs", "Quick"], emoji: "🍳", lastHad: "Yesterday",
    ingredients: [
      { name: "Eggs", amount: "3", unit: "units", category: "Dairy" },
      { name: "Cheddar cheese", amount: "50", unit: "g", category: "Dairy" },
      { name: "Butter", amount: "1", unit: "tbsp", category: "Dairy" },
    ],
  },
]

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function MealsPage() {
  const [servings, setServings] = useState(2)
  const [rota, setRota] = useState<Record<string, string>>({})
  const [showPicker, setShowPicker] = useState<string | null>(null)
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null)
  const [addedToast, setAddedToast] = useState("")

  function assignMeal(day: string, meal: string) {
    setRota(r => ({ ...r, [day]: meal }))
    setShowPicker(null)
  }

  function addIngredientsToShopping(meal: Meal) {
    const scale = servings / meal.servings
    meal.ingredients.forEach((ing, i) => {
      const item: ShoppingItem = {
        id: `${Date.now()}-${i}`,
        name: ing.name,
        quantity: Math.ceil(parseFloat(ing.amount) * scale),
        unit: ing.unit,
        category: ing.category,
        checked: false,
        addedAt: new Date().toISOString(),
      }
      store.addShoppingItem(item)
    })
    setAddedToast(`${meal.name} ingredients added to shopping list!`)
    setTimeout(() => setAddedToast(""), 3000)
  }

  function addWeekToShopping() {
    const planned = Object.values(rota)
    if (planned.length === 0) return
    planned.forEach(mealName => {
      const meal = SUGGESTED_MEALS.find(m => m.name === mealName)
      if (meal) addIngredientsToShopping(meal)
    })
    setAddedToast("All week's ingredients added to shopping list!")
    setTimeout(() => setAddedToast(""), 3000)
  }

  const plannedCount = Object.keys(rota).length

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Toast */}
      {addedToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium">
          <CheckCircle size={16} /> {addedToast}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meal Planner</h1>
        <p className="text-gray-500 text-sm">Plan your week, reduce waste</p>
      </div>

      {/* Servings */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 flex items-center gap-3">
        <Users size={18} className="text-gray-400" />
        <span className="text-sm font-medium text-gray-700">Cooking for</span>
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={() => setServings(s => Math.max(1, s - 1))}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg hover:bg-gray-200">−</button>
          <span className="w-6 text-center font-semibold">{servings}</span>
          <button onClick={() => setServings(s => s + 1)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg hover:bg-gray-200">+</button>
        </div>
        <span className="text-sm text-gray-500">people</span>
      </div>

      {/* Weekly rota */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">This week</h2>
        {plannedCount > 0 && (
          <button onClick={addWeekToShopping}
            className="flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-xl hover:bg-green-100">
            <ShoppingCart size={14} /> Add all to shopping
          </button>
        )}
      </div>
      <div className="space-y-2 mb-6">
        {DAYS.map(day => {
          const meal = SUGGESTED_MEALS.find(m => m.name === rota[day])
          return (
            <div key={day} className="bg-white rounded-xl border border-gray-100 p-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500 w-24">{day}</span>
                {meal ? (
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{meal.emoji} {meal.name}</span>
                    <span className="text-xs text-gray-400">(×{servings})</span>
                  </div>
                ) : (
                  <span className="flex-1 text-sm text-gray-300">No meal planned</span>
                )}
                <div className="flex items-center gap-2">
                  {meal && (
                    <button onClick={() => addIngredientsToShopping(meal)}
                      title="Add ingredients to shopping list"
                      className="text-green-500 hover:text-green-700 p-1">
                      <ShoppingCart size={14} />
                    </button>
                  )}
                  <button onClick={() => setShowPicker(day)}
                    className="text-xs text-green-600 font-medium hover:text-green-700 flex items-center gap-1">
                    <Plus size={12} /> {rota[day] ? "Change" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Meal suggestions */}
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Suggested meals</h2>
      <p className="text-xs text-gray-400 mb-3">Based on your pantry • tap to see ingredients</p>
      <div className="grid grid-cols-1 gap-3">
        {[...SUGGESTED_MEALS].sort((a, b) => (parseInt(b.lastHad) || 0) - (parseInt(a.lastHad) || 0)).map(meal => (
          <div key={meal.name} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span className="text-2xl shrink-0">{meal.emoji}</span>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">{meal.name}</p>
                  <p className="text-xs text-gray-400">{meal.time} · serves {meal.servings} · last had {meal.lastHad}</p>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {meal.tags.map(t => (
                      <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <button onClick={() => setShowPicker(`__${meal.name}`)}
                  className="text-xs text-green-600 font-medium hover:text-green-700 whitespace-nowrap">
                  Add to week
                </button>
                <button onClick={() => addIngredientsToShopping(meal)}
                  className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-700 whitespace-nowrap">
                  <ShoppingCart size={11} /> Shopping list
                </button>
                <button onClick={() => setExpandedMeal(expandedMeal === meal.name ? null : meal.name)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
                  Ingredients {expandedMeal === meal.name ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                </button>
              </div>
            </div>

            {expandedMeal === meal.name && (
              <div className="border-t border-gray-50 px-4 py-3 bg-gray-50">
                <p className="text-xs font-semibold text-gray-500 mb-2">Ingredients (scaled for {servings} people):</p>
                <div className="grid grid-cols-2 gap-1">
                  {meal.ingredients.map(ing => {
                    const scale = servings / meal.servings
                    const qty = Math.ceil(parseFloat(ing.amount) * scale)
                    return (
                      <div key={ing.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full shrink-0" />
                        {qty} {ing.unit} {ing.name}
                      </div>
                    )
                  })}
                </div>
                <button onClick={() => addIngredientsToShopping(meal)}
                  className="mt-3 w-full py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 flex items-center justify-center gap-1.5">
                  <ShoppingCart size={13} /> Add all ingredients to shopping list
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Day picker modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">
              {showPicker.startsWith("__") ? `Add ${showPicker.slice(2)} to...` : `Pick meal for ${showPicker}`}
            </h2>
            {showPicker.startsWith("__") ? (
              <div className="space-y-2">
                {DAYS.map(day => (
                  <button key={day} onClick={() => assignMeal(day, showPicker.slice(2))}
                    className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-green-50 text-sm font-medium text-gray-700 flex items-center justify-between">
                    {day}
                    {rota[day] && <span className="text-xs text-gray-400">{rota[day]}</span>}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {SUGGESTED_MEALS.map(meal => (
                  <button key={meal.name} onClick={() => assignMeal(showPicker, meal.name)}
                    className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-green-50 text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span>{meal.emoji}</span> {meal.name}
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setShowPicker(null)}
              className="mt-4 w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
