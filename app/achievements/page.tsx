"use client"
import { useEffect, useState } from "react"
import { Flame, Star } from "lucide-react"
import {
  ACHIEVEMENTS, LEVELS, getEarnedAchievements, getTotalPoints,
  getCurrentLevel, getLevelProgress, getStreak, updateStreak, calculateAchievements,
  EarnedAchievement
} from "@/lib/gamification"

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
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Achievements</h1>
        <p className="text-gray-500 text-sm">Track your healthy habits</p>
      </div>

      {/* Level card */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-5 mb-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-purple-200 text-sm">Current level</p>
            <p className="text-2xl font-bold">{level.name}</p>
          </div>
          <div className="text-right">
            <p className="text-purple-200 text-sm">Total points</p>
            <p className="text-2xl font-bold">{points} pts</p>
          </div>
        </div>
        <div className="bg-white/20 rounded-full h-2 mb-1">
          <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${progress}%` }} />
        </div>
        {nextLevel && (
          <p className="text-purple-200 text-xs">{nextLevel.minPoints - points} pts to {nextLevel.name}</p>
        )}
      </div>

      {/* Streak */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-6 flex items-center gap-3">
        <Flame size={24} className="text-orange-500" />
        <div>
          <p className="font-bold text-orange-900">{streak} day streak</p>
          <p className="text-sm text-orange-700">Keep logging daily to maintain your streak!</p>
        </div>
      </div>

      {/* Level progress */}
      <div className="flex gap-2 mb-6">
        {LEVELS.map(l => (
          <div key={l.name}
            className={`flex-1 rounded-xl p-3 text-center border-2 transition-opacity ${points >= l.minPoints ? "opacity-100" : "opacity-30 border-gray-100"}`}
            style={{ borderColor: points >= l.minPoints ? l.color : undefined, color: l.color }}>
            <Star size={16} className="mx-auto mb-1" />
            <p className="text-xs font-bold">{l.name}</p>
            <p className="text-xs">{l.minPoints}+</p>
          </div>
        ))}
      </div>

      {/* Achievements grid */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Achievements ({earned.length}/{ACHIEVEMENTS.length})
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {ACHIEVEMENTS.map(ach => {
          const isUnlocked = earnedMap.has(ach.id)
          return (
            <div key={ach.id}
              className={`rounded-2xl p-4 border transition-all ${isUnlocked ? "bg-white border-green-100" : "bg-gray-50 border-gray-100 opacity-50"}`}>
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{ach.emoji}</span>
                <span className="text-xs font-bold text-green-600">+{ach.points} pts</span>
              </div>
              <p className="font-semibold text-gray-900 text-sm">{ach.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{ach.description}</p>
              {isUnlocked && (
                <p className="text-xs text-green-600 mt-1.5">
                  ✓ {new Date(earnedMap.get(ach.id)!).toLocaleDateString("en-GB")}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
