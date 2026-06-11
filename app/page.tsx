"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Package, UtensilsCrossed, ShoppingCart, AlertTriangle, Award, BookOpen, Store, Sparkles, ChevronRight } from "lucide-react"
import { store, HEALTH_MODES } from "@/lib/store"
import { getStreak, updateStreak, getTotalPoints, calculateAchievements, getCurrentLevel } from "@/lib/gamification"

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const card = "bg-white rounded-2xl shadow-sm ring-1 ring-black/[0.04]"

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
    <div className="min-h-screen">
      {/* Hero header */}
      <div className="px-6 pt-8 pb-6" style={{ background: "linear-gradient(135deg, #0D2118 0%, #1A4731 60%, #166534 100%)" }}>
        <p className="text-white/50 text-sm font-medium mb-1 tracking-wide uppercase text-[11px]">
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        <h1 className="text-3xl font-bold text-white mb-1">{getGreeting()} 👋</h1>
        <p className="text-white/60 text-sm">Here's your household food snapshot</p>

        {nextVisit && (
          <div className="mt-4 bg-white/10 backdrop-blur rounded-xl px-4 py-3 flex items-center justify-between">
            <p className="text-white/90 text-sm">
              <span className="font-semibold">{nextVisit.name}</span> visiting {nextVisit.days === 0 ? "today!" : `in ${nextVisit.days} day${nextVisit.days > 1 ? "s" : ""}!`}
            </p>
            <Link href="/family" className="text-amber-300 text-xs font-semibold">View →</Link>
          </div>
        )}
      </div>

      <div className="px-5 -mt-4 space-y-4 pb-8">
        {/* Health mode */}
        <div className={`${card} p-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-xl">
              {mode.emoji}
            </div>
            <div>
              <p className="font-semibold text-stone-900 text-sm">{mode.name} mode</p>
              <p className="text-xs text-stone-400">{mode.description}</p>
            </div>
          </div>
          <Link href="/health" className="text-xs font-semibold px-3 py-1.5 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors">
            Change
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/pantry" className={`${card} p-4 hover:shadow-md transition-shadow`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Package size={15} className="text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-stone-400">Pantry</span>
            </div>
            <p className="text-3xl font-bold text-stone-900">{stats.total}</p>
            <p className="text-xs text-stone-400 mt-0.5">items tracked</p>
          </Link>
          <Link href="/shopping" className={`${card} p-4 hover:shadow-md transition-shadow`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <ShoppingCart size={15} className="text-blue-600" />
              </div>
              <span className="text-xs font-medium text-stone-400">Shopping</span>
            </div>
            <p className="text-3xl font-bold text-stone-900">{shoppingCount}</p>
            <p className="text-xs text-stone-400 mt-0.5">to buy</p>
          </Link>
        </div>

        {/* Expiry alert */}
        {(stats.expiringSoon > 0 || stats.expired > 0) && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle size={15} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-amber-900 text-sm">Food alerts</p>
              {stats.expired > 0 && <p className="text-xs text-amber-700 mt-0.5">{stats.expired} item{stats.expired > 1 ? "s" : ""} expired</p>}
              {stats.expiringSoon > 0 && <p className="text-xs text-amber-700">{stats.expiringSoon} expiring within 3 days</p>}
            </div>
            <Link href="/pantry" className="text-amber-700 text-xs font-semibold shrink-0">View →</Link>
          </div>
        )}

        {/* Quick actions */}
        <div>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Quick actions</p>
          <div className="space-y-2.5">
            <Link href="/pantry"
              className="flex items-center gap-4 p-4 rounded-2xl text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #15803d 0%, #16a34a 100%)" }}>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Package size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Add to pantry</p>
                <p className="text-white/70 text-xs">Scan barcode or search manually</p>
              </div>
              <ChevronRight size={16} className="text-white/50" />
            </Link>

            <Link href="/meals" className={`${card} flex items-center gap-4 p-4 hover:shadow-md transition-all active:scale-[0.98]`}>
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <UtensilsCrossed size={18} className="text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-stone-900 text-sm">Plan this week's meals</p>
                <p className="text-stone-400 text-xs">Add ingredients straight to your list</p>
              </div>
              <ChevronRight size={16} className="text-stone-200" />
            </Link>

            <Link href="/cookbooks" className={`${card} flex items-center gap-4 p-4 hover:shadow-md transition-all active:scale-[0.98]`}>
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <BookOpen size={18} className="text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-stone-900 text-sm">Scan a cookbook</p>
                <p className="text-stone-400 text-xs">Browse recipes & add to basket</p>
              </div>
              <ChevronRight size={16} className="text-stone-200" />
            </Link>

            <div className="grid grid-cols-2 gap-2.5">
              <Link href="/supermarkets" className={`${card} flex items-center gap-3 p-4 hover:shadow-md transition-all active:scale-[0.98]`}>
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Store size={16} className="text-blue-500" />
                </div>
                <div>
                  <p className="font-semibold text-stone-900 text-sm">Shops</p>
                  <p className="text-stone-400 text-xs">Connect & push</p>
                </div>
              </Link>
              <Link href="/community" className={`${card} flex items-center gap-3 p-4 hover:shadow-md transition-all active:scale-[0.98]`}>
                <div className="w-9 h-9 bg-pink-50 rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles size={16} className="text-pink-500" />
                </div>
                <div>
                  <p className="font-semibold text-stone-900 text-sm">Community</p>
                  <p className="text-stone-400 text-xs">Discoveries</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className={`${card} p-4`} style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award size={16} className="text-amber-400" />
              <span className="font-semibold text-white text-sm">This week's streak</span>
            </div>
            <Link href="/achievements" className="text-xs text-amber-300 font-semibold">
              {levelName} · {points} pts →
            </Link>
          </div>
          <div className="flex gap-1.5">
            {WEEK_DAYS.map((d, i) => (
              <div key={d} className={`flex-1 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all
                ${i <= todayIdx && streak > todayIdx - i
                  ? "bg-amber-400 text-amber-900 shadow-sm"
                  : i === todayIdx
                    ? "bg-white/10 text-white ring-1 ring-white/20"
                    : "bg-white/5 text-white/30"}`}>
                {d[0]}
              </div>
            ))}
          </div>
          <p className="text-xs text-white/60 mt-3">
            {streak > 0 ? `🔥 ${streak} day streak — keep it up!` : "Log your first activity to start a streak!"}
          </p>
        </div>
      </div>
    </div>
  )
}
