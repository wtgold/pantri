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
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shops & Delivery</h1>
        <p className="text-gray-500 text-sm">Connect your supermarkets to push shopping lists directly to your basket</p>
      </div>

      {/* Tab selector */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
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
        <>
          {/* Connected banner */}
          {connected.length > 0 && (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="font-semibold text-green-900">{connected.length} supermarket{connected.length > 1 ? "s" : ""} connected</span>
              </div>
              <p className="text-sm text-green-700">Your shopping list will be pushed to {connected.map(s => s.name).join(", ")} when ready.</p>
            </div>
          )}

          {/* Push to basket CTA */}
          {connected.length > 0 && (
            <button className="w-full mb-4 py-3 bg-green-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700">
              <ShoppingCart size={18} /> Push shopping list to basket
            </button>
          )}

          {/* Supermarket list */}
          <div className="space-y-3">
            {supermarkets.map(sm => (
              <div key={sm.id} className={`bg-white rounded-2xl border p-4 ${sm.connected ? "border-green-300" : "border-gray-100"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{sm.logo}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{sm.name}</p>
                      {sm.connected && <p className="text-xs text-green-600">Connected ✓</p>}
                    </div>
                  </div>
                  <button onClick={() => toggleConnect(sm.id)}
                    className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                      sm.connected
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}>
                    {sm.connected ? "Disconnect" : sm.status === "coming_soon" ? "Coming soon" : "Connect"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {sm.features.map(f => (
                    <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{f}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Price comparison note */}
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} className="text-blue-600" />
              <span className="font-semibold text-blue-900">Price comparison — coming soon</span>
            </div>
            <p className="text-sm text-blue-700">Once connected, Pantri will automatically compare prices across your connected supermarkets and highlight the cheapest option for each item on your shopping list.</p>
          </div>
        </>
      )}

      {activeTab === "mealkits" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Import recipes directly into your meal planner and auto-populate your shopping list.</p>
          {MEAL_KITS.map(kit => (
            <div key={kit.id} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{kit.emoji}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{kit.name}</p>
                    <p className="text-sm text-gray-500">{kit.description}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-center">Coming soon</span>
                  <a href={kit.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                    <Globe size={11} /> Visit site
                  </a>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {kit.perks.map(p => (
                  <span key={p} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{p}</span>
                ))}
              </div>
            </div>
          ))}

          {/* Influencer/PT meals teaser */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-4">
            <p className="font-semibold text-purple-900 mb-1">🌟 Creator & PT Meals — coming soon</p>
            <p className="text-sm text-purple-700 mb-2">Follow your favourite fitness creators and chefs. Their meal plans appear in your planner — tap to add ingredients to your basket.</p>
            <div className="flex flex-wrap gap-2">
              {["Joe Wicks", "Deliciously Ella", "Jamie Oliver", "Ottolenghi"].map(c => (
                <span key={c} className="text-xs bg-white border border-purple-200 text-purple-700 px-2.5 py-1 rounded-full">{c}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
