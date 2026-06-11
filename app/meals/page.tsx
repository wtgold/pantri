"use client"
import { useState } from "react"
import { Plus, Users, ShoppingCart, CheckCircle, ChevronDown, ChevronUp } from "lucide-react"
import { store, ShoppingItem } from "@/lib/store"

const card = "bg-white rounded-2xl shadow-sm ring-1 ring-black/[0.04]"

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
    setAddedToast(`${meal.name} added to shopping!`)
    setTimeout(() => setAddedToast(""), 3000)
  }

  function addWeekToShopping() {
    const planned = Object.values(rota)
    if (planned.length === 0) return
    planned.forEach(mealName => {
      const meal = SUGGESTED_MEALS.find(m => m.name === mealName)
      if (meal) addIngredientsToShopping(meal)
    })
    setAddedToast("All week's ingredients added!")
    setTimeout(() => setAddedToast(""), 3000)
  }

  const plannedCount = Object.keys(rota).length

  return (
    <div className="min-h-screen">
      {addedToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-700 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold">
          <CheckCircle size={15} /> {addedToast}
        </div>
      )}

      <div className="px-6 pt-8 pb-5" style={{ background: "linear-gradient(135deg, #431407 0%, #c2410c 100%)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Weekly plan</p>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Meal Planner</h1>
            <p className="text-white/60 text-sm mt-1">Plan your week, reduce waste</p>
          </div>
          {plannedCount > 0 && (
            <button onClick={addWeekToShopping}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl transition-colors">
              <ShoppingCart size={13} /> Add all
            </button>
          )}
        </div>
      </div>

      <div className="px-5 -mt-3 space-y-4 pb-8">
        {/* Servings */}
        <div className={`${card} p-4 flex items-center gap-3`}>
          <Users size={17} className="text-stone-400" />
          <span className="text-sm font-medium text-stone-700">Cooking for</span>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => setServings(s => Math.max(1, s - 1))}
              className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-lg font-bold hover:bg-stone-200 transition-colors">−</button>
            <span className="w-7 text-center font-bold text-stone-900">{servings}</span>
            <button onClick={() => setServings(s => s + 1)}
              className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-lg font-bold hover:bg-stone-200 transition-colors">+</button>
          </div>
          <span className="text-sm text-stone-400">people</span>
        </div>

        {/* Weekly rota */}
        <div>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">This week</p>
          <div className="space-y-2">
            {DAYS.map(day => {
              const meal = SUGGESTED_MEALS.find(m => m.name === rota[day])
              return (
                <div key={day} className={`${card} px-4 py-3 flex items-center gap-3`}>
                  <span className="text-xs font-bold text-stone-400 w-20 shrink-0">{day.slice(0,3).toUpperCase()}</span>
                  {meal ? (
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <span className="text-base">{meal.emoji}</span>
                      <span className="text-sm font-semibold text-stone-900 truncate">{meal.name}</span>
                      <span className="text-xs text-stone-300 shrink-0">×{servings}</span>
                    </div>
                  ) : (
                    <span className="flex-1 text-sm text-stone-300">No meal planned</span>
                  )}
                  <div className="flex items-center gap-2 shrink-0">
                    {meal && (
                      <button onClick={() => addIngredientsToShopping(meal)}
                        className="text-orange-400 hover:text-orange-600 p-1 transition-colors">
                        <ShoppingCart size={14} />
                      </button>
                    )}
                    <button onClick={() => setShowPicker(day)}
                      className="text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg transition-colors">
                      {rota[day] ? "Change" : "+ Add"}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Suggestions */}
        <div>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1">Suggested meals</p>
          <p className="text-xs text-stone-300 mb-3">Based on your pantry · tap ingredients to expand</p>
          <div className="space-y-2.5">
            {[...SUGGESTED_MEALS].map(meal => (
              <div key={meal.name} className={`${card} overflow-hidden`}>
                <div className="p-4 flex items-start gap-3">
                  <span className="text-2xl shrink-0">{meal.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 text-sm">{meal.name}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{meal.time} · serves {meal.servings} · {meal.lastHad}</p>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {meal.tags.map(t => (
                        <span key={t} className="text-[11px] font-medium bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0 items-end">
                    <button onClick={() => setShowPicker(`__${meal.name}`)}
                      className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1.5 rounded-lg hover:bg-orange-100 transition-colors whitespace-nowrap">
                      Add to week
                    </button>
                    <button onClick={() => addIngredientsToShopping(meal)}
                      className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap">
                      <ShoppingCart size={11} /> To list
                    </button>
                    <button onClick={() => setExpandedMeal(expandedMeal === meal.name ? null : meal.name)}
                      className="flex items-center gap-0.5 text-xs text-stone-300 hover:text-stone-500 transition-colors">
                      Ingredients {expandedMeal === meal.name ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                    </button>
                  </div>
                </div>

                {expandedMeal === meal.name && (
                  <div className="border-t border-stone-50 px-4 py-3" style={{ background: "var(--bg)" }}>
                    <p className="text-xs font-semibold text-stone-400 mb-2">Scaled for {servings} people:</p>
                    <div className="grid grid-cols-2 gap-1 mb-3">
                      {meal.ingredients.map(ing => {
                        const qty = Math.ceil(parseFloat(ing.amount) * (servings / meal.servings))
                        return (
                          <div key={ing.name} className="flex items-center gap-1.5 text-xs text-stone-600">
                            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full shrink-0" />
                            {qty} {ing.unit} {ing.name}
                          </div>
                        )
                      })}
                    </div>
                    <button onClick={() => addIngredientsToShopping(meal)}
                      className="w-full py-2 bg-orange-600 text-white rounded-xl text-xs font-semibold hover:bg-orange-700 flex items-center justify-center gap-1.5 transition-colors">
                      <ShoppingCart size={13} /> Add all ingredients to shopping list
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Picker modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-lg font-bold text-stone-900 mb-4">
              {showPicker.startsWith("__") ? `Add ${showPicker.slice(2)} to...` : `Pick meal for ${showPicker}`}
            </h2>
            {showPicker.startsWith("__") ? (
              <div className="space-y-1.5">
                {DAYS.map(day => (
                  <button key={day} onClick={() => assignMeal(day, showPicker.slice(2))}
                    className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-orange-50 text-sm font-medium text-stone-700 flex items-center justify-between transition-colors">
                    {day}
                    {rota[day] && <span className="text-xs text-stone-300">{rota[day]}</span>}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-1.5">
                {SUGGESTED_MEALS.map(meal => (
                  <button key={meal.name} onClick={() => assignMeal(showPicker, meal.name)}
                    className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-orange-50 text-sm font-medium text-stone-700 flex items-center gap-2 transition-colors">
                    <span>{meal.emoji}</span> {meal.name}
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setShowPicker(null)}
              className="mt-4 w-full py-2.5 border border-stone-200 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
