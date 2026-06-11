"use client"
import { useState, useEffect } from "react"
import { Users, Plus, Heart, Calendar, ShoppingCart } from "lucide-react"

const card = "bg-white rounded-2xl shadow-sm ring-1 ring-black/[0.04]"
const inp = "w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:bg-white transition-colors"

interface Guest {
  id: string
  name: string
  relation: string
  favourites: string[]
  dietary: string[]
  visitDate?: string
}

const SAMPLE_GUESTS: Guest[] = [
  { id: "1", name: "Mum & Dad", relation: "Parents", favourites: ["Roast chicken", "Apple pie", "PG Tips tea"], dietary: [], visitDate: "2026-06-21" },
  { id: "2", name: "Sarah", relation: "Friend", favourites: ["Pineapple juice", "Pasta", "Chocolate cake"], dietary: ["Vegetarian"], visitDate: "" },
]

export default function FamilyPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: "", relation: "", favourites: "", dietary: "", visitDate: "" })

  useEffect(() => {
    const saved = localStorage.getItem("pantri_guests")
    setGuests(saved ? JSON.parse(saved) : SAMPLE_GUESTS)
  }, [])

  function addGuest() {
    const g: Guest = {
      id: Date.now().toString(),
      name: form.name,
      relation: form.relation,
      favourites: form.favourites.split(",").map(s => s.trim()).filter(Boolean),
      dietary: form.dietary.split(",").map(s => s.trim()).filter(Boolean),
      visitDate: form.visitDate || undefined,
    }
    const next = [...guests, g]
    setGuests(next)
    localStorage.setItem("pantri_guests", JSON.stringify(next))
    setShowAdd(false)
    setForm({ name: "", relation: "", favourites: "", dietary: "", visitDate: "" })
  }

  function daysUntilVisit(dateStr: string) {
    if (!dateStr) return null
    return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
  }

  const upcoming = guests.filter(g => g.visitDate && (daysUntilVisit(g.visitDate) ?? -1) >= 0)

  return (
    <div className="min-h-screen">
      <div className="px-6 pt-8 pb-5" style={{ background: "linear-gradient(135deg, #713f12 0%, #d97706 100%)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Your household</p>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Family & Guests</h1>
            <p className="text-white/60 text-sm mt-1">Favourites, visits & dietary needs</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl transition-colors">
            <Plus size={13} /> Add
          </button>
        </div>
      </div>

      <div className="px-5 -mt-3 space-y-4 pb-8">
        {/* Upcoming visits */}
        {upcoming.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Upcoming visits</p>
            {upcoming.map(g => {
              const days = daysUntilVisit(g.visitDate!)
              return (
                <div key={g.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={15} className="text-amber-600" />
                      <span className="font-bold text-amber-900">{g.name}</span>
                    </div>
                    <span className="text-xs font-bold bg-amber-200 text-amber-900 px-2.5 py-1 rounded-full">
                      {days === 0 ? "Today!" : `in ${days} day${days !== 1 ? "s" : ""}`}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-amber-700 mb-1.5">Their favourites:</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {g.favourites.map(f => (
                      <span key={f} className="text-xs bg-white border border-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-medium">{f}</span>
                    ))}
                  </div>
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900">
                    <ShoppingCart size={12} /> Add missing favourites to shopping list
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Profiles */}
        <div>
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Profiles</p>
          <div className="space-y-3">
            {guests.map(g => (
              <div key={g.id} className={card + " p-4"}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700 font-bold text-sm">
                    {g.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-stone-900">{g.name}</p>
                    <p className="text-xs text-stone-400">{g.relation}</p>
                  </div>
                  {g.visitDate && (daysUntilVisit(g.visitDate) ?? -1) >= 0 && (
                    <span className="text-[11px] font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
                      {new Date(g.visitDate!).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </span>
                  )}
                </div>

                {g.favourites.length > 0 && (
                  <div className="mb-2">
                    <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                      <Heart size={9} /> Favourites
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {g.favourites.map(f => (
                        <span key={f} className="text-xs font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{f}</span>
                      ))}
                    </div>
                  </div>
                )}

                {g.dietary.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wide mb-1.5">Dietary</p>
                    <div className="flex flex-wrap gap-1">
                      {g.dietary.map(d => (
                        <span key={d} className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{d}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Household sharing */}
        <div className={card + " p-5"}>
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-stone-400" />
            <span className="font-bold text-stone-700">Household sharing</span>
          </div>
          <p className="text-sm text-stone-400 mb-3">Invite family members to share this pantry, shopping list and meal plan.</p>
          <button className="w-full py-3 border-2 border-dashed border-stone-200 rounded-xl text-sm font-medium text-stone-400 hover:border-green-300 hover:text-green-600 transition-colors">
            + Invite a household member
          </button>
        </div>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold text-stone-900 mb-4">Add person</h2>
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Name *" className={inp} />
              <input value={form.relation} onChange={e => setForm(f => ({ ...f, relation: e.target.value }))}
                placeholder="Relation (e.g. Parent, Friend)" className={inp} />
              <input value={form.favourites} onChange={e => setForm(f => ({ ...f, favourites: e.target.value }))}
                placeholder="Favourite foods (comma separated)" className={inp} />
              <input value={form.dietary} onChange={e => setForm(f => ({ ...f, dietary: e.target.value }))}
                placeholder="Dietary needs (comma separated)" className={inp} />
              <div>
                <label className="text-xs font-medium text-stone-400 mb-1.5 block">Next visit (optional)</label>
                <input value={form.visitDate} onChange={e => setForm(f => ({ ...f, visitDate: e.target.value }))}
                  type="date" className={inp} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm font-medium hover:bg-stone-50">Cancel</button>
              <button onClick={addGuest} disabled={!form.name}
                className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold disabled:opacity-40"
                style={{ background: "var(--brand)" }}>
                Add person
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
