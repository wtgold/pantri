"use client"
import { useEffect, useState } from "react"
import { store, PantryItem, HEALTH_MODES } from "@/lib/store"

const TARGETS: Record<string, { calories: number; protein: number; carbs: number; fat: number }> = {
  balanced:    { calories: 2000, protein: 50,  carbs: 250, fat: 70  },
  trim:        { calories: 1500, protein: 80,  carbs: 150, fat: 50  },
  highprotein: { calories: 2200, protein: 150, carbs: 200, fat: 60  },
  mediterranean: { calories: 2000, protein: 60, carbs: 230, fat: 80 },
  doctors:     { calories: 1800, protein: 55,  carbs: 220, fat: 60  },
  recovery:    { calories: 1600, protein: 50,  carbs: 200, fat: 55  },
}

const SWAPS = [
  { from: "White bread", to: "Wholemeal bread", why: "More fibre, lower GI", save: "~£0.10/loaf" },
  { from: "Full-fat milk", to: "Semi-skimmed milk", why: "Less saturated fat", save: "~£0.05/pint" },
  { from: "Crisps", to: "Rice cakes", why: "Much lower in fat", save: "~£0.50/week" },
  { from: "Sugary cereal", to: "Porridge oats", why: "Sustained energy, high fibre", save: "~£1.00/week" },
  { from: "Butter", to: "Olive spread", why: "Heart-healthy fats", save: "~£0.20/week" },
  { from: "White rice", to: "Brown rice", why: "Higher fibre and nutrients", save: "~£0.00" },
  { from: "Fizzy drinks", to: "Sparkling water", why: "Zero sugar", save: "~£2.00/week" },
  { from: "Processed ham", to: "Roast chicken", why: "Less sodium, less processed", save: "~£0.50/week" },
  { from: "Mayonnaise", to: "Greek yogurt", why: "Lower fat, more protein", save: "~£0.30/week" },
  { from: "Chocolate biscuits", to: "Dark chocolate (70%+)", why: "Antioxidants, less sugar", save: "~£0.20/week" },
]

function MacroBar({ label, value, target, color }: { label: string; value: number; target: number; color: string }) {
  const pct = Math.min(100, Math.round((value / target) * 100))
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{Math.round(value)}g / {target}g</span>
      </div>
      <div className="bg-gray-100 rounded-full h-3">
        <div className={`${color} rounded-full h-3 transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-gray-400 mt-0.5">{pct}% of target</p>
    </div>
  )
}

export default function NutritionPage() {
  const [pantry, setPantry] = useState<PantryItem[]>([])
  const [activeMode, setActiveMode] = useState("balanced")

  useEffect(() => {
    setPantry(store.getPantry())
    setActiveMode(store.getActiveHealthMode())
  }, [])

  const targets = TARGETS[activeMode] || TARGETS.balanced
  const mode = HEALTH_MODES.find(m => m.id === activeMode) || HEALTH_MODES[0]

  const itemsWithNutrition = pantry.filter(i => i.nutriments)
  const totals = itemsWithNutrition.reduce(
    (acc, item) => ({
      calories: acc.calories + (item.nutriments?.calories || 0),
      protein: acc.protein + (item.nutriments?.protein || 0),
      carbs: acc.carbs + (item.nutriments?.carbs || 0),
      fat: acc.fat + (item.nutriments?.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const topCalories = [...itemsWithNutrition]
    .sort((a, b) => (b.nutriments?.calories || 0) - (a.nutriments?.calories || 0))
    .slice(0, 5)

  const gaps: string[] = []
  if (totals.protein < targets.protein * 0.5) gaps.push("Low protein — add eggs, chicken, fish, or legumes")
  if (totals.fat < 20) gaps.push("Very low fat — your body needs healthy fats")
  if (itemsWithNutrition.length < 5) gaps.push("Scan more items to get accurate nutrition data")

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nutrition</h1>
        <p className="text-gray-500 text-sm">Based on your pantry · {mode.emoji} {mode.name} targets</p>
      </div>

      {/* Calorie summary */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <div className="flex items-end gap-2 mb-4">
          <span className="text-4xl font-bold text-gray-900">{Math.round(totals.calories)}</span>
          <span className="text-gray-400 mb-1">/ {targets.calories} kcal</span>
        </div>
        <MacroBar label="Protein" value={totals.protein} target={targets.protein} color="bg-blue-500" />
        <MacroBar label="Carbohydrates" value={totals.carbs} target={targets.carbs} color="bg-amber-400" />
        <MacroBar label="Fat" value={totals.fat} target={targets.fat} color="bg-red-400" />
      </div>

      {/* Gaps */}
      {gaps.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-4">
          <h2 className="font-semibold text-amber-900 mb-2">⚠️ Nutritional gaps</h2>
          {gaps.map(g => <p key={g} className="text-sm text-amber-700 mb-1">• {g}</p>)}
        </div>
      )}

      {/* Top calorie items */}
      {topCalories.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">🔥 Highest calorie items in your pantry</h2>
          {topCalories.map(item => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-700">{item.name}</span>
              <span className="text-sm font-medium text-gray-900">{Math.round(item.nutriments?.calories || 0)} kcal/100g</span>
            </div>
          ))}
        </div>
      )}

      {/* Healthy swaps */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
        <h2 className="font-semibold text-green-900 mb-3">💡 Healthy switches</h2>
        <div className="space-y-2">
          {SWAPS.map(s => (
            <div key={s.from} className="bg-white rounded-xl p-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-red-500 font-medium">{s.from}</span>
                <span className="text-gray-400">→</span>
                <span className="text-green-600 font-medium">{s.to}</span>
              </div>
              <div className="flex justify-between mt-0.5">
                <p className="text-xs text-gray-500">{s.why}</p>
                <p className="text-xs text-green-600 font-medium">{s.save}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
