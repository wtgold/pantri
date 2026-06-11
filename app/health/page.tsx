"use client"
import { useState, useEffect } from "react"
import { store, HEALTH_MODES } from "@/lib/store"
import { CheckCircle } from "lucide-react"

const card = "bg-white rounded-2xl shadow-sm ring-1 ring-black/[0.04]"

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
  const activeModeDef = HEALTH_MODES.find(m => m.id === activeMode) || HEALTH_MODES[0]

  return (
    <div className="min-h-screen">
      <div className="px-6 pt-8 pb-5" style={{ background: "linear-gradient(135deg, #701a75 0%, #a21caf 100%)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Personalise</p>
        <h1 className="text-3xl font-bold text-white">Health Modes</h1>
        <p className="text-white/60 text-sm mt-1">Tailor your meal suggestions & nutrition</p>
      </div>

      <div className="px-5 -mt-3 space-y-4 pb-8">
        {/* Mode grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {HEALTH_MODES.map(mode => (
            <button key={mode.id} onClick={() => selectMode(mode.id)}
              className={`p-4 rounded-2xl text-left transition-all shadow-sm ring-1 ${
                activeMode === mode.id
                  ? "ring-purple-400 bg-purple-50"
                  : "ring-black/[0.04] bg-white hover:ring-purple-200"
              }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{mode.emoji}</span>
                {activeMode === mode.id && <CheckCircle size={15} className="text-purple-600" />}
              </div>
              <p className="font-semibold text-stone-900 text-sm">{mode.name}</p>
              <p className="text-xs text-stone-400 mt-0.5 leading-snug">{mode.description}</p>
            </button>
          ))}
        </div>

        {/* Active mode detail */}
        <div className={card}>
          <div className="px-5 pt-5 pb-4 border-b border-stone-100">
            <p className="font-bold text-stone-900 text-base">
              {activeModeDef.emoji} {activeModeDef.name} guidance
            </p>
          </div>
          <div className="p-5 space-y-5">
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Tips</p>
              <ul className="space-y-1.5">
                {details.tips.map(t => (
                  <li key={t} className="text-sm text-stone-700 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5 shrink-0">✓</span> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Eat more of</p>
              <div className="flex flex-wrap gap-1.5">
                {details.foods.map(f => (
                  <span key={f} className="text-xs font-medium bg-green-100 text-green-700 px-2.5 py-1 rounded-full">{f}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Limit or avoid</p>
              <div className="flex flex-wrap gap-1.5">
                {details.avoid.map(a => (
                  <span key={a} className="text-xs font-medium bg-red-100 text-red-700 px-2.5 py-1 rounded-full">{a}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Healthy switches */}
        <div className={`${card} overflow-hidden`}>
          <div className="px-5 pt-5 pb-4 border-b border-stone-100">
            <p className="font-bold text-stone-900">💡 Healthy switches</p>
            <p className="text-xs text-stone-400 mt-0.5">Small swaps, big difference</p>
          </div>
          <div className="p-3 space-y-2">
            {[
              { from: "White bread", to: "Wholemeal or rye bread", benefit: "More fibre & slower energy release" },
              { from: "Full-fat crisps", to: "Rice cakes or nuts", benefit: "Less saturated fat" },
              { from: "Sugary cereal", to: "Porridge with fruit", benefit: "Sustained energy, less sugar" },
              { from: "Fizzy drinks", to: "Sparkling water with lemon", benefit: "Zero sugar, still refreshing" },
            ].map(s => (
              <div key={s.from} className="bg-stone-50 rounded-xl p-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-red-500 line-through">{s.from}</span>
                  <span className="text-stone-300">→</span>
                  <span className="font-semibold text-green-700">{s.to}</span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">{s.benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
