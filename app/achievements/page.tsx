"use client"
import { useEffect, useState } from "react"
import { Flame, Star } from "lucide-react"
import {
  ACHIEVEMENTS, LEVELS, getTotalPoints,
  getCurrentLevel, getLevelProgress, getStreak, updateStreak, calculateAchievements,
  EarnedAchievement
} from "@/lib/gamification"

const card = "bg-white rounded-2xl shadow-sm ring-1 ring-black/[0.04]"

export default function AchievementsPage() {
  const [points, setPoints] = useState(0)
  const [streak, setStreak] = useState(0)
  const [earned, setEarned] = useState<EarnedAchievement[]>([])

  useEffect(() => {
    updateStreak()
    const all = calculateAchievements()
    setEarned(all)
    setPoints(getTotalPoints(all))
    setStreak(getStreak().currentStreak)
  }, [])

  const { level, progress, nextLevel } = getLevelProgress(points)
  const earnedMap = new Map(earned.map(e => [e.id, e.earnedAt]))

  return (
    <div className="min-h-screen">
      <div className="px-6 pt-8 pb-16" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Your progress</p>
        <h1 className="text-3xl font-bold text-white">Achievements</h1>
        <p className="text-white/60 text-sm mt-1">Track your healthy habits</p>
      </div>

      <div className="px-5 -mt-10 space-y-4 pb-8">
        {/* Level card */}
        <div className="rounded-2xl p-5 text-white shadow-lg" style={{ background: "linear-gradient(135deg, #312e81 0%, #4f46e5 100%)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-indigo-300 text-xs font-semibold uppercase tracking-wide">Current level</p>
              <p className="text-2xl font-bold mt-0.5">{level.name}</p>
            </div>
            <div className="text-right">
              <p className="text-indigo-300 text-xs font-semibold uppercase tracking-wide">Points</p>
              <p className="text-2xl font-bold mt-0.5">{points}</p>
            </div>
          </div>
          <div className="bg-white/20 rounded-full h-2 mb-1.5">
            <div className="bg-amber-400 rounded-full h-2 transition-all" style={{ width: `${progress}%` }} />
          </div>
          {nextLevel && (
            <p className="text-indigo-300 text-xs">{nextLevel.minPoints - points} pts to {nextLevel.name}</p>
          )}
        </div>

        {/* Streak */}
        <div className={`${card} p-4 flex items-center gap-4`}>
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
            <Flame size={22} className="text-orange-500" />
          </div>
          <div>
            <p className="font-bold text-stone-900">{streak} day streak 🔥</p>
            <p className="text-sm text-stone-400">Keep logging daily to maintain it!</p>
          </div>
        </div>

        {/* Level ladder */}
        <div className="flex gap-2">
          {LEVELS.map(l => (
            <div key={l.name}
              className={`flex-1 rounded-2xl p-3 text-center shadow-sm ring-1 transition-all ${
                points >= l.minPoints
                  ? "ring-black/[0.06] opacity-100"
                  : "ring-black/[0.04] opacity-30"
              }`}
              style={{ background: points >= l.minPoints ? l.color + "15" : "white", color: l.color }}>
              <Star size={15} className="mx-auto mb-1.5" />
              <p className="text-xs font-bold">{l.name}</p>
              <p className="text-[10px] opacity-70">{l.minPoints}+ pts</p>
            </div>
          ))}
        </div>

        {/* Achievement grid */}
        <div>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">
            Badges ({earned.length}/{ACHIEVEMENTS.length})
          </p>
          <div className="grid grid-cols-2 gap-3">
            {ACHIEVEMENTS.map(ach => {
              const isUnlocked = earnedMap.has(ach.id)
              return (
                <div key={ach.id}
                  className={`rounded-2xl p-4 shadow-sm ring-1 transition-all ${
                    isUnlocked
                      ? "ring-indigo-100 bg-white"
                      : "ring-black/[0.03] bg-stone-50 opacity-40"
                  }`}>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{ach.emoji}</span>
                    <span className="text-[11px] font-bold text-indigo-600">+{ach.points}</span>
                  </div>
                  <p className="font-semibold text-stone-900 text-sm">{ach.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5 leading-snug">{ach.description}</p>
                  {isUnlocked && (
                    <p className="text-xs text-green-600 font-medium mt-2">
                      ✓ {new Date(earnedMap.get(ach.id)!).toLocaleDateString("en-GB")}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
