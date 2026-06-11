"use client"
import { useState } from "react"
import { UtensilsCrossed, Plus, Users } from "lucide-react"

const SUGGESTED_MEALS = [
  { name: "Spaghetti Bolognese", time: "30 min", servings: 4, tags: ["Italian", "Pasta"], emoji: "🍝", lastHad: "8 days ago" },
  { name: "Chicken Stir Fry", time: "20 min", servings: 2, tags: ["Asian", "Quick"], emoji: "🥘", lastHad: "2 weeks ago" },
  { name: "Tomato Soup & Toast", time: "15 min", servings: 2, tags: ["Soup", "Quick"], emoji: "🍲", lastHad: "3 days ago" },
  { name: "Salmon & Veg", time: "25 min", servings: 2, tags: ["Fish", "Healthy"], emoji: "🐟", lastHad: "5 days ago" },
  { name: "Chicken Curry", time: "45 min", servings: 4, tags: ["Indian", "Batch"], emoji: "🍛", lastHad: "10 days ago" },
  { name: "Omelette", time: "10 min", servings: 1, tags: ["Eggs", "Quick"], emoji: "🍳", lastHad: "Yesterday" },
]

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function MealsPage() {
  const [servings, setServings] = useState(2)
  const [rota, setRota] = useState<Record<string, string>>({})
  const [showPicker, setShowPicker] = useState<string | null>(null)

  function assignMeal(day: string, meal: string) {
    setRota(r => ({ ...r, [day]: meal }))
    setShowPicker(null)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
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
      <h2 className="text-lg font-semibold text-gray-800 mb-3">This week</h2>
      <div className="space-y-2 mb-6">
        {DAYS.map(day => (
          <div key={day} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 w-24">{day}</span>
            {rota[day] ? (
              <div className="flex-1 flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {SUGGESTED_MEALS.find(m => m.name === rota[day])?.emoji} {rota[day]}
                </span>
                <span className="text-xs text-gray-400">(×{servings})</span>
              </div>
            ) : (
              <span className="flex-1 text-sm text-gray-300">No meal planned</span>
            )}
            <button onClick={() => setShowPicker(day)}
              className="text-xs text-green-600 font-medium hover:text-green-700 flex items-center gap-1">
              <Plus size={12} /> {rota[day] ? "Change" : "Add"}
            </button>
          </div>
        ))}
      </div>

      {/* Meal suggestions */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Suggested meals</h2>
      <p className="text-xs text-gray-400 mb-3">Based on your pantry • sorted by how long since you last had them</p>
      <div className="grid grid-cols-1 gap-3">
        {SUGGESTED_MEALS.sort((a, b) => {
          const aNum = parseInt(a.lastHad) || 0
          const bNum = parseInt(b.lastHad) || 0
          return bNum - aNum
        }).map(meal => (
          <div key={meal.name} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{meal.emoji}</span>
                <div>
                  <p className="font-medium text-gray-900">{meal.name}</p>
                  <p className="text-xs text-gray-400">{meal.time} · serves {meal.servings} · last had {meal.lastHad}</p>
                  <div className="flex gap-1 mt-1.5">
                    {meal.tags.map(t => (
                      <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={() => setShowPicker(`__${meal.name}`)}
                className="text-sm text-green-600 font-medium whitespace-nowrap hover:text-green-700">
                Add to week
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Day picker modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">
              {showPicker.startsWith("__")
                ? `Add ${showPicker.slice(2)} to...`
                : `Pick meal for ${showPicker}`}
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
