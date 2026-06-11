"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Package, UtensilsCrossed, ShoppingCart, Heart, AlertTriangle, Award, BookOpen, Store, Sparkles } from "lucide-react"
import { store, HEALTH_MODES } from "@/lib/store"
import { getStreak, updateStreak, getTotalPoints, calculateAchievements, getCurrentLevel } from "@/lib/gamification"

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning! 👋"
  if (h < 17) return "Good afternoon! 👋"
  return "Good evening! 👋"
}

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default function Home() {
  const [stats, setStats] = useState({ total: 0, expiringSoon: 0, expired: 0 })
  const [activeMode, setActiveMode] = useState("balanced")
  const [shoppingCount, setShoppingCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [points, setPoints] = useState(0)
  const [levelName, setLevelName] = useState("Bronze")
  const [nextVisit, setNextVisit] = useState<{ name: string; days: number } | null>(null)

  useEffect(() => {
    setStats(store.getStats())
    setActiveMode(store.getActiveHealthMode())
    setShoppingCount(store.getShoppingList().filter(i => !i.checked).length)

    const streakData = updateStreak()
    setStreak(streakData.currentStreak)

    const earned = calculateAchievements()
    const pts = getTotalPoints(earned)
    setPoints(pts)
    setLevelName(getCurrentLevel(pts).name)

    // Next guest visit
    const guests: { name: string; visitDate?: string }[] = JSON.parse(localStorage.getItem("pantri_guests") || "[]")
    const upcoming = guests
      .filter(g => g.visitDate)
      .map(g => ({ name: g.name, days: Math.ceil((new Date(g.visitDate!).getTime() - Date.now()) / 86400000) }))
      .filter(g => g.days >= 0 && g.days <= 7)
      .sort((a, b) => a.days - b.days)
    setNextVisit(upcoming[0] || null)
  }, [])

  const mode = HEALTH_MODES.find(m => m.id === activeMode) || HEALTH_MODES[0]
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{getGreeting()}</h1>
        <p className="text-gray-500 mt-1">Here's your household food snapshot</p>
      </div>

      {/* Guest visit alert */}
      {nextVisit && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-4 flex items-center justify-between">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">{nextVisit.name}</span> visiting {nextVisit.days === 0 ? "today!" : `in ${nextVisit.days} day${nextVisit.days > 1 ? "s" : ""}!`}
          </p>
          <Link href="/family" className="text-xs text-amber-700 font-medium underline">View →</Link>
        </div>
      )}

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

      {/* Expiry alert */}
      {(stats.expiringSoon > 0 || stats.expired > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={18} className="text-amber-600" />
            <span className="font-semibold text-amber-800">Food alerts</span>
          </div>
          {stats.expired > 0 && <p className="text-sm text-amber-700">{stats.expired} item{stats.expired > 1 ? "s" : ""} have expired</p>}
          {stats.expiringSoon > 0 && <p className="text-sm text-amber-700">{stats.expiringSoon} item{stats.expiringSoon > 1 ? "s" : ""} expiring within 3 days — use them up!</p>}
          <Link href="/pantry" className="text-sm text-amber-800 font-medium underline mt-1 block">View pantry →</Link>
        </div>
      )}

      {/* Quick actions */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick actions</h2>
      <div className="grid grid-cols-1 gap-3 mb-6">
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
            <p className="text-gray-500 text-sm">Add ingredients straight to your shopping list</p>
          </div>
        </Link>
        <Link href="/cookbooks" className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:border-green-200 transition-colors">
          <BookOpen size={20} className="text-purple-500" />
          <div>
            <p className="font-semibold text-gray-900">Scan a cookbook</p>
            <p className="text-gray-500 text-sm">Browse recipes & add ingredients to basket</p>
          </div>
        </Link>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/supermarkets" className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:border-blue-200 transition-colors">
            <Store size={20} className="text-blue-500" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">Shops</p>
              <p className="text-gray-500 text-xs">Connect & push list</p>
            </div>
          </Link>
          <Link href="/community" className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:border-pink-200 transition-colors">
            <Sparkles size={20} className="text-pink-500" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">Community</p>
              <p className="text-gray-500 text-xs">Food discoveries</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Streak & level */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-purple-600" />
            <span className="font-semibold text-purple-900">This week's streak</span>
          </div>
          <Link href="/achievements" className="text-xs text-purple-600 font-medium">
            {levelName} · {points} pts →
          </Link>
        </div>
        <div className="flex gap-1">
          {WEEK_DAYS.map((d, i) => (
            <div key={d} className={`flex-1 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors
              ${i <= todayIdx && streak > todayIdx - i ? "bg-purple-500 text-white" : "bg-white text-gray-400 border border-gray-100"}`}>
              {d[0]}
            </div>
          ))}
        </div>
        <p className="text-xs text-purple-700 mt-2">
          {streak > 0 ? `${streak} day streak 🔥 Keep it up!` : "Log your first activity to start a streak!"}
        </p>
      </div>
    </div>
  )
}
