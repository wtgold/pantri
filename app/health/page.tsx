"use client"
import { useState, useEffect } from "react"
import { store, HEALTH_MODES } from "@/lib/store"
import { CheckCircle } from "lucide-react"

const modeDetails: Record<string, { tips: string[], foods: string[], avoid: string[] }> = {
  balanced: {
    tips: ["Eat a rainbow of vegetables", "Stay hydrated — 8 glasses a day", "Limit processed foods"],
    foods: ["Whole grains", "Lean proteins", "Fresh fruit & veg", "Dairy or alternatives"],
    avoid: ["Excessive sugar", "Ultra-processed snacks", "Too much salt"],
  },
  trim: {
    tips: ["Aim for a 500 calorie deficit daily", "High protein keeps you full", "Prioritise sleep — it affects hunger hormones"],
    foods: ["Chicken breast", "Greek yogurt", "Leafy greens", "Eggs", "Fish"],
    avoid: ["White bread & pasta", "Sugary drinks", "Alcohol", "Crisps & snacks"],
  },
  highprotein: {
    tips: ["Target 1.6–2.2g protein per kg bodyweight", "Spread protein across all meals", "Don't skip post-workout nutrition"],
    foods: ["Chicken", "Tuna", "Eggs", "Cottage cheese", "Lentils", "Tofu"],
    avoid: ["Empty calorie foods", "Skipping meals"],
  },
  mediterranean: {
    tips: ["Olive oil is your friend", "Eat fish twice a week", "Legumes daily"],
    foods: ["Olive oil", "Oily fish", "Nuts", "Whole grains", "Tomatoes", "Garlic"],
    avoid: ["Red meat daily", "Processed foods", "Refined sugars"],
  },
  doctors: {
    tips: ["Follow your GP's specific advice", "Track sodium if managing blood pressure", "Monitor blood sugar if diabetic"],
    foods: ["Low-sodium options", "High-fibre foods", "Heart-healthy fats"],
    avoid: ["Foods your GP has flagged", "High-sodium processed foods", "Excessive saturated fat"],
  },
  recovery: {
    tips: ["Stay hydrated — sip fluids constantly", "Small meals more often", "Rest is as important as food"],
    foods: ["Chicken soup", "Toast", "Bananas", "Rice", "Ginger tea", "Honey & lemon"],
    avoid: ["Dairy if congested", "Heavy fatty meals", "Alcohol", "Caffeine"],
  },
}

export default function HealthPage() {
  const [activeMode, setActiveMode] = useState("balanced")

  useEffect(() => { setActiveMode(store.getActiveHealthMode()) }, [])

  function selectMode(id: string) {
    store.setHealthMode(id)
    setActiveMode(id)
  }

  const details = modeDetails[activeMode] || modeDetails.balanced

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Health Modes</h1>
        <p className="text-gray-500 text-sm">Choose a mode to tailor your meal suggestions</p>
      </div>

      {/* Mode selector */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {HEALTH_MODES.map(mode => (
          <button key={mode.id} onClick={() => selectMode(mode.id)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeMode === mode.id
                ? "border-green-500 bg-green-50"
                : "border-gray-100 bg-white hover:border-gray-200"
            }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">{mode.emoji}</span>
              {activeMode === mode.id && <CheckCircle size={16} className="text-green-600" />}
            </div>
            <p className="font-semibold text-gray-900 text-sm">{mode.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{mode.description}</p>
          </button>
        ))}
      </div>

      {/* Active mode detail */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-bold text-gray-900 mb-4">
          {HEALTH_MODES.find(m => m.id === activeMode)?.emoji} {HEALTH_MODES.find(m => m.id === activeMode)?.name} guidance
        </h2>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Tips</h3>
          <ul className="space-y-1">
            {details.tips.map(t => (
              <li key={t} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Eat more of</h3>
          <div className="flex flex-wrap gap-2">
            {details.foods.map(f => (
              <span key={f} className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">{f}</span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Limit or avoid</h3>
          <div className="flex flex-wrap gap-2">
            {details.avoid.map(a => (
              <span key={a} className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full">{a}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Healthy switches */}
      <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <h2 className="font-bold text-blue-900 mb-3">💡 Healthy switches</h2>
        <div className="space-y-2">
          {[
            { from: "White bread", to: "Wholemeal or rye bread", saving: "More fibre & slower energy release" },
            { from: "Full-fat crisps", to: "Rice cakes or nuts", saving: "Less saturated fat" },
            { from: "Sugary cereal", to: "Porridge with fruit", saving: "Sustained energy, less sugar" },
            { from: "Fizzy drinks", to: "Sparkling water with lemon", saving: "Zero sugar, still refreshing" },
          ].map(s => (
            <div key={s.from} className="bg-white rounded-xl p-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-red-500 font-medium">{s.from}</span>
                <span className="text-gray-400">→</span>
                <span className="text-green-600 font-medium">{s.to}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{s.saving}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
