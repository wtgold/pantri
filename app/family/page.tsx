"use client"
import { useState } from "react"
import { Users, Plus, Heart, Calendar, ShoppingCart } from "lucide-react"

interface Guest {
  id: string
  name: string
  relation: string
  favourites: string[]
  dietary: string[]
  visitDate?: string
}

const SAMPLE_GUESTS: Guest[] = [
  {
    id: "1",
    name: "Mum & Dad",
    relation: "Parents",
    favourites: ["Roast chicken", "Apple pie", "PG Tips tea"],
    dietary: [],
    visitDate: "2026-06-21",
  },
  {
    id: "2",
    name: "Sarah",
    relation: "Friend",
    favourites: ["Pineapple juice", "Pasta", "Chocolate cake"],
    dietary: ["Vegetarian"],
    visitDate: "",
  },
]

export default function FamilyPage() {
  const [guests, setGuests] = useState<Guest[]>(SAMPLE_GUESTS)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: "", relation: "", favourites: "", dietary: "", visitDate: "" })

  function addGuest() {
    const g: Guest = {
      id: Date.now().toString(),
      name: form.name,
      relation: form.relation,
      favourites: form.favourites.split(",").map(s => s.trim()).filter(Boolean),
      dietary: form.dietary.split(",").map(s => s.trim()).filter(Boolean),
      visitDate: form.visitDate || undefined,
    }
    setGuests(gs => [...gs, g])
    setShowAdd(false)
    setForm({ name: "", relation: "", favourites: "", dietary: "", visitDate: "" })
  }

  function daysUntilVisit(dateStr: string) {
    if (!dateStr) return null
    return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family & Guests</h1>
          <p className="text-gray-500 text-sm">Track favourites, visits & dietary needs</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-green-700">
          <Plus size={16} /> Add person
        </button>
      </div>

      {/* Upcoming visits */}
      {guests.some(g => g.visitDate) && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Upcoming visits</h2>
          {guests.filter(g => g.visitDate && daysUntilVisit(g.visitDate)! >= 0).map(g => {
            const days = daysUntilVisit(g.visitDate!)
            return (
              <div key={g.id} className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-amber-600" />
                    <span className="font-semibold text-amber-900">{g.name} visiting</span>
                  </div>
                  <span className="text-sm text-amber-700 font-medium">
                    {days === 0 ? "Today!" : `in ${days} day${days !== 1 ? "s" : ""}`}
                  </span>
                </div>
                <div className="mb-2">
                  <p className="text-xs font-medium text-amber-700 mb-1">Their favourites:</p>
                  <div className="flex flex-wrap gap-1">
                    {g.favourites.map(f => (
                      <span key={f} className="text-xs bg-white border border-amber-200 text-amber-800 px-2 py-0.5 rounded-full">{f}</span>
                    ))}
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-xs text-amber-800 font-medium hover:text-amber-900">
                  <ShoppingCart size={12} /> Add missing favourites to shopping list
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Guest profiles */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Profiles</h2>
      <div className="space-y-3">
        {guests.map(g => (
          <div key={g.id} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
                {g.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{g.name}</p>
                <p className="text-sm text-gray-500">{g.relation}</p>
              </div>
              {g.visitDate && daysUntilVisit(g.visitDate)! >= 0 && (
                <span className="ml-auto text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                  Visiting {new Date(g.visitDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              )}
            </div>

            <div className="mb-2">
              <p className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1">
                <Heart size={10} /> Favourites
              </p>
              <div className="flex flex-wrap gap-1">
                {g.favourites.map(f => (
                  <span key={f} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{f}</span>
                ))}
              </div>
            </div>

            {g.dietary.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1.5">Dietary needs</p>
                <div className="flex flex-wrap gap-1">
                  {g.dietary.map(d => (
                    <span key={d} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{d}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Household members section */}
      <div className="mt-6 bg-gray-50 rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Users size={16} className="text-gray-400" />
          <span className="font-semibold text-gray-700">Household sharing</span>
        </div>
        <p className="text-sm text-gray-500 mb-3">Invite family members to share this pantry, shopping list and meal plan.</p>
        <button className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-green-300 hover:text-green-600 transition-colors">
          + Invite a household member
        </button>
      </div>

      {/* Add guest modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Add person</h2>
            <div className="space-y-3">
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Name *"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-300" />
              <input value={form.relation} onChange={e => setForm(f => ({ ...f, relation: e.target.value }))}
                placeholder="Relation (e.g. Parent, Friend)"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-300" />
              <input value={form.favourites} onChange={e => setForm(f => ({ ...f, favourites: e.target.value }))}
                placeholder="Favourite foods (comma separated)"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-300" />
              <input value={form.dietary} onChange={e => setForm(f => ({ ...f, dietary: e.target.value }))}
                placeholder="Dietary needs (comma separated)"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-300" />
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Next visit (optional)</label>
                <input value={form.visitDate} onChange={e => setForm(f => ({ ...f, visitDate: e.target.value }))}
                  type="date"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-300" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium">Cancel</button>
              <button onClick={addGuest} disabled={!form.name}
                className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                Add person
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
