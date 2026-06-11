"use client"
import { useState } from "react"
import { ExternalLink, CheckCircle, ShoppingCart, Zap, Globe } from "lucide-react"

interface Supermarket {
  id: string
  name: string
  logo: string
  color: string
  connected: boolean
  features: string[]
  url: string
  status: "live" | "coming_soon"
}

const SUPERMARKETS: Supermarket[] = [
  {
    id: "tesco", name: "Tesco", logo: "🔵", color: "bg-blue-50 border-blue-200",
    connected: false, url: "https://www.tesco.com",
    features: ["Push shopping list to basket", "Clubcard price tracking", "Order history import"],
    status: "coming_soon",
  },
  {
    id: "ocado", name: "Ocado", logo: "🟠", color: "bg-orange-50 border-orange-200",
    connected: false, url: "https://www.ocado.com",
    features: ["Push shopping list to basket", "Smart Pass integration", "Order history import"],
    status: "coming_soon",
  },
  {
    id: "asda", name: "Asda", logo: "🟢", color: "bg-green-50 border-green-200",
    connected: false, url: "https://www.asda.com",
    features: ["Push shopping list to basket", "Rollback price alerts"],
    status: "coming_soon",
  },
  {
    id: "sainsburys", name: "Sainsbury's", logo: "🟡", color: "bg-yellow-50 border-yellow-200",
    connected: false, url: "https://www.sainsburys.co.uk",
    features: ["Push shopping list to basket", "Nectar points tracking", "Order history import"],
    status: "coming_soon",
  },
  {
    id: "aldi", name: "Aldi", logo: "🔷", color: "bg-sky-50 border-sky-200",
    connected: false, url: "https://www.aldi.co.uk",
    features: ["Browse Specialbuys", "Price comparison"],
    status: "coming_soon",
  },
  {
    id: "morrisons", name: "Morrisons", logo: "🟡", color: "bg-yellow-50 border-yellow-200",
    connected: false, url: "https://www.morrisons.com",
    features: ["Push shopping list to basket", "More Card rewards"],
    status: "coming_soon",
  },
]

const MEAL_KITS = [
  {
    id: "hellofresh", name: "HelloFresh", emoji: "🥗", description: "Recipe kits delivered weekly",
    url: "https://www.hellofresh.co.uk", status: "coming_soon",
    perks: ["Import recipes to meal planner", "Auto-add ingredients to shopping", "Skip weeks from app"],
  },
  {
    id: "gusto", name: "Gusto", emoji: "🍽️", description: "Fresh ingredients & chef recipes",
    url: "https://www.gustocooking.com", status: "coming_soon",
    perks: ["Import recipes to meal planner", "Nutritional data auto-filled", "Pause/manage subscription"],
  },
  {
    id: "greenchef", name: "Green Chef", emoji: "🌿", description: "Organic & specialist diet kits",
    url: "https://www.greenchef.co.uk", status: "coming_soon",
    perks: ["Keto, vegan & paleo options", "Syncs with your health mode", "Ingredient tracking"],
  },
  {
    id: "mindful", name: "Mindful Chef", emoji: "🧘", description: "Healthy, gluten-free recipes",
    url: "https://www.mindfulchef.com", status: "coming_soon",
    perks: ["NHS-endorsed healthy meals", "Syncs with Doctor's Orders mode", "Nutritional breakdown"],
  },
]

export default function SupermarketsPage() {
  const [supermarkets, setSupermarkets] = useState(SUPERMARKETS)
  const [activeTab, setActiveTab] = useState<"supermarkets" | "mealkits">("supermarkets")

  function toggleConnect(id: string) {
    setSupermarkets(s => s.map(m => m.id === id ? { ...m, connected: !m.connected } : m))
  }

  const connected = supermarkets.filter(s => s.connected)

  return (
    <div className="min-h-screen">
      <div className="px-6 pt-8 pb-5" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Connect</p>
        <h1 className="text-3xl font-bold text-white">Shops & Delivery</h1>
        <p className="text-white/60 text-sm mt-1">Push your shopping list straight to your basket</p>
      </div>

      <div className="px-5 -mt-3 pb-8">
      {/* Tab selector */}
      <div className="flex gap-2 mb-5 bg-stone-100 p-1 rounded-xl mt-4">
        <button onClick={() => setActiveTab("supermarkets")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "supermarkets" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
          Supermarkets
        </button>
        <button onClick={() => setActiveTab("mealkits")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "mealkits" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
          Meal Kit Services
        </button>
      </div>

      {activeTab === "supermarkets" && (
        <div className="space-y-3">
          {connected.length > 0 && (
            <>
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle size={15} className="text-green-600" />
                  <span className="font-bold text-green-900">{connected.length} supermarket{connected.length > 1 ? "s" : ""} connected</span>
                </div>
                <p className="text-sm text-green-700">Push your list to {connected.map(s => s.name).join(", ")}.</p>
              </div>
              <button className="w-full py-3 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{ background: "var(--brand)" }}>
                <ShoppingCart size={17} /> Push shopping list to basket
              </button>
            </>
          )}

          {supermarkets.map(sm => (
            <div key={sm.id} className={`bg-white rounded-2xl p-4 shadow-sm ring-1 ${sm.connected ? "ring-green-300" : "ring-black/[0.04]"}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{sm.logo}</span>
                  <div>
                    <p className="font-bold text-stone-900">{sm.name}</p>
                    {sm.connected && <p className="text-xs font-semibold text-green-600">Connected ✓</p>}
                  </div>
                </div>
                <button onClick={() => toggleConnect(sm.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    sm.connected ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                  }`}>
                  {sm.connected ? "Disconnect" : "Coming soon"}
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {sm.features.map(f => (
                  <span key={f} className="text-[11px] font-medium bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{f}</span>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={15} className="text-blue-600" />
              <span className="font-bold text-blue-900">Price comparison — coming soon</span>
            </div>
            <p className="text-sm text-blue-700">Pantri will compare your full basket across connected supermarkets and show which store is cheapest overall.</p>
          </div>
        </div>
      )}

      {activeTab === "mealkits" && (
        <div className="space-y-3 mt-1">
          <p className="text-sm text-stone-400">Import recipes into your meal planner and auto-fill your shopping list.</p>
          {MEAL_KITS.map(kit => (
            <div key={kit.id} className="bg-white rounded-2xl shadow-sm ring-1 ring-black/[0.04] p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{kit.emoji}</span>
                  <div>
                    <p className="font-bold text-stone-900">{kit.name}</p>
                    <p className="text-sm text-stone-400">{kit.description}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0 items-end">
                  <span className="text-[11px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Coming soon</span>
                  <a href={kit.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700">
                    <Globe size={11} /> Visit site
                  </a>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {kit.perks.map(p => (
                  <span key={p} className="text-[11px] font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{p}</span>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #fdf2f8 100%)", border: "1px solid #e9d5ff" }}>
            <p className="font-bold text-purple-900 mb-1">🌟 Creator & PT Meals — coming soon</p>
            <p className="text-sm text-purple-700 mb-3">Follow your favourite chefs and PTs. Their meal plans appear in your planner — tap to add to basket.</p>
            <div className="flex flex-wrap gap-2">
              {["Joe Wicks", "Deliciously Ella", "Jamie Oliver", "Ottolenghi"].map(c => (
                <span key={c} className="text-xs font-semibold bg-white border border-purple-200 text-purple-700 px-2.5 py-1 rounded-full">{c}</span>
              ))}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
