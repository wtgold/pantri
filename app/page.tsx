"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Package, UtensilsCrossed, ShoppingCart, Heart, AlertTriangle, Award } from "lucide-react"
import { store, HEALTH_MODES } from "@/lib/store"

export default function Home() {
  const [stats, setStats] = useState({ total: 0, expiringSoon: 0, expired: 0 })
  const [activeMode, setActiveMode] = useState("balanced")
  const [shoppingCount, setShoppingCount] = useState(0)

  useEffect(() => {
    setStats(store.getStats())
    setActiveMode(store.getActiveHealthMode())
    setShoppingCount(store.getShoppingList().filter(i => !i.checked).length)
  }, [])

  const mode = HEALTH_MODES.find(m => m.id === activeMode) || HEALTH_MODES[0]

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Good morning! 👋</h1>
        <p className="text-gray-500 mt-1">Here's your household food snapshot</p>
      </div>

      {/* Health mode badge */}
      <div className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{mode.emoji}</span>
          <div>
            <p className="font-semibold text-gray-900">{mode.name} mode active</p>
            <p className="text-sm text-gray-500">{mode.description}</p>
          </div>
        </div>
        <Link href="/health" className="text-sm text-green-600 font-medium">Change</Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Link href="/pantry" className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-green-200 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Package size={18} className="text-green-600" />
            <span className="text-sm font-medium text-gray-600">In Pantry</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-400">items tracked</p>
        </Link>

        <Link href="/shopping" className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-blue-200 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart size={18} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Shopping List</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{shoppingCount}</p>
          <p className="text-xs text-gray-400">items to buy</p>
        </Link>
      </div>

      {/* Alerts */}
      {(stats.expiringSoon > 0 || stats.expired > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-amber-600" />
            <span className="font-semibold text-amber-800">Food alerts</span>
          </div>
          {stats.expired > 0 && (
            <p className="text-sm text-amber-700">{stats.expired} item{stats.expired > 1 ? "s" : ""} have expired</p>
          )}
          {stats.expiringSoon > 0 && (
            <p className="text-sm text-amber-700">{stats.expiringSoon} item{stats.expiringSoon > 1 ? "s" : ""} expiring within 3 days</p>
          )}
          <Link href="/pantry" className="text-sm text-amber-800 font-medium underline mt-1 block">View pantry →</Link>
        </div>
      )}

      {/* Quick actions */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick actions</h2>
      <div className="grid grid-cols-1 gap-3">
        <Link href="/pantry" className="bg-green-600 text-white rounded-2xl p-4 flex items-center gap-3 hover:bg-green-700 transition-colors">
          <Package size={20} />
          <div>
            <p className="font-semibold">Add to pantry</p>
            <p className="text-green-100 text-sm">Scan barcode or search manually</p>
          </div>
        </Link>
        <Link href="/meals" className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:border-green-200 transition-colors">
          <UtensilsCrossed size={20} className="text-orange-500" />
          <div>
            <p className="font-semibold text-gray-900">Plan this week's meals</p>
            <p className="text-gray-500 text-sm">Based on what you have in stock</p>
          </div>
        </Link>
        <Link href="/health" className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:border-green-200 transition-colors">
          <Heart size={20} className="text-red-500" />
          <div>
            <p className="font-semibold text-gray-900">Health & nutrition</p>
            <p className="text-gray-500 text-sm">Switch modes, track goals</p>
          </div>
        </Link>
      </div>

      {/* Gamification */}
      <div className="mt-6 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <Award size={18} className="text-purple-600" />
          <span className="font-semibold text-purple-900">This week's streak</span>
        </div>
        <div className="flex gap-1 mt-2">
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => (
            <div key={d} className={`flex-1 h-8 rounded-lg flex items-center justify-center text-xs font-medium
              ${i < 3 ? "bg-purple-500 text-white" : "bg-white text-gray-400 border border-gray-100"}`}>
              {d[0]}
            </div>
          ))}
        </div>
        <p className="text-xs text-purple-700 mt-2">3 day healthy eating streak 🔥 Keep it up!</p>
      </div>
    </div>
  )
}
