"use client"
import { useEffect, useState } from "react"
import { store, PantryItem, HEALTH_MODES } from "@/lib/store"

const card = "bg-white rounded-2xl shadow-sm ring-1 ring-black/[0.04]"

const TARGETS: Record<string, { calories: number; protein: number; carbs: number; fat: number }> = {
  balanced:      { calories: 2000, protein: 50,  carbs: 250, fat: 70  },
  trim:          { calories: 1500, protein: 80,  carbs: 150, fat: 50  },
  highprotein:   { calories: 2200, protein: 150, carbs: 200, fat: 60  },
  mediterranean: { calories: 2000, protein: 60,  carbs: 230, fat: 80  },
  doctors:       { calories: 1800, protein: 55,  carbs: 220, fat: 60  },
  recovery:      { calories: 1600, protein: 50,  carbs: 200, fat: 55  },
}

const SWAPS = [
  { from: "White bread", to: "Wholemeal bread", why: "More fibre, lower GI", save: "~£0.10/loaf" },
  { from: "Full-fat milk", to: "Semi-skimmed milk", why: "Less saturated fat", save: "~£0.05/pint" },
  { from: "Crisps", to: "Rice cakes", why: "Much lower in fat", save: "~£0.50/week" },
  { from: "Sugary cereal", to: "Porridge oats", why: "Sustained energy, high fibre", save: "~£1.00/week" },
  { from: "Fizzy drinks", to: "Sparkling water", why: "Zero sugar", save: "~£2.00/week" },
]

function MacroBar({ label, value, target, color }: { label: string; value: number; target: number; color: string }) {
  const pct = Math.min(100, Math.round((value / target) * 100))
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-semibold text-stone-700">{label}</span>
        <span className="text-stone-400 text-xs">{Math.round(value)}g / {target}g target</span>
      </div>
      <div className="bg-stone-100 rounded-full h-2.5">
        <div className={`${color} rounded-full h-2.5 transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-stone-300 mt-1">{pct}% of daily target</p>
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

  const caloriePct = Math.min(100, Math.round((totals.calories / targets.calories) * 100))

  const gaps: string[] = []
  if (totals.protein < targets.protein * 0.5) gaps.push("Low protein — add eggs, chicken, fish, or legumes")
  if (totals.fat < 20) gaps.push("Very low fat — your body needs healthy fats")
  if (itemsWithNutrition.length < 5) gaps.push("Scan more pantry items to get accurate nutrition data")

  return (
    <div className="min-h-screen">
      <div className="px-6 pt-8 pb-16" style={{ background: "linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Daily overview</p>
        <h1 className="text-3xl font-bold text-white">Nutrition</h1>
        <p className="text-white/60 text-sm mt-1">{mode.emoji} {mode.name} targets active</p>
      </div>

      <div className="px-5 -mt-10 space-y-4 pb-8">
        {/* Calorie ring card */}
        <div className="rounded-2xl p-5 text-white shadow-lg" style={{ background: "linear-gradient(135deg, #075985 0%, #0369a1 100%)" }}>
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8"/>
                <circle cx="40" cy="40" r="32" fill="none" stroke="#fbbf24" strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - caloriePct / 100)}`}
                  strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{caloriePct}%</span>
              </div>
            </div>
            <div>
              <p className="text-sky-200 text-xs font-semibold uppercase tracking-wide">Calories (from pantry)</p>
              <p className="text-4xl font-bold mt-1">{Math.round(totals.calories)}</p>
              <p className="text-sky-300 text-sm">of {targets.calories} kcal target</p>
            </div>
          </div>
        </div>

        {/* Macros */}
        <div className={`${card} p-5`}>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">Macros</p>
          <MacroBar label="Protein" value={totals.protein} target={targets.protein} color="bg-blue-500" />
          <MacroBar label="Carbohydrates" value={totals.carbs} target={targets.carbs} color="bg-amber-400" />
          <MacroBar label="Fat" value={totals.fat} target={targets.fat} color="bg-rose-400" />
        </div>

        {/* Gaps */}
        {gaps.length > 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <p className="font-bold text-amber-900 mb-2">⚠️ Nutritional gaps</p>
            {gaps.map(g => <p key={g} className="text-sm text-amber-700 mt-1">• {g}</p>)}
          </div>
        )}

        {/* Top calorie items */}
        {topCalories.length > 0 && (
          <div className={card}>
            <div className="px-5 pt-5 pb-4 border-b border-stone-100">
              <p className="font-bold text-stone-900">🔥 Highest calorie items in your pantry</p>
            </div>
            <div className="px-5 py-3 divide-y divide-stone-50">
              {topCalories.map(item => (
                <div key={item.id} className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-stone-700 font-medium">{item.name}</span>
                  <span className="text-sm font-bold text-stone-900">{Math.round(item.nutriments?.calories || 0)} kcal/100g</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Healthy swaps */}
        <div className={`${card} overflow-hidden`}>
          <div className="px-5 pt-5 pb-4 border-b border-stone-100">
            <p className="font-bold text-stone-900">💡 Healthy switches</p>
          </div>
          <div className="p-3 space-y-2">
            {SWAPS.map(s => (
              <div key={s.from} className="bg-stone-50 rounded-xl p-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-red-500 line-through">{s.from}</span>
                  <span className="text-stone-300">→</span>
                  <span className="font-semibold text-green-700">{s.to}</span>
                </div>
                <div className="flex justify-between mt-0.5">
                  <p className="text-xs text-stone-400">{s.why}</p>
                  <p className="text-xs font-bold text-green-600">{s.save}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
