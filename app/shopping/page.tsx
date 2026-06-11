"use client"
import { useEffect, useState } from "react"
import { Plus, Trash2, CheckCircle, Circle, Share2 } from "lucide-react"
import { store, ShoppingItem } from "@/lib/store"

const card = "bg-white rounded-2xl shadow-sm ring-1 ring-black/[0.04]"

const CATEGORIES = ["Fruit & Veg", "Meat & Fish", "Dairy", "Bakery", "Tins & Jars", "Frozen", "Drinks", "Snacks", "Household", "Other"]

const CAT_COLORS: Record<string, string> = {
  "Fruit & Veg": "text-green-600 bg-green-50",
  "Meat & Fish": "text-red-600 bg-red-50",
  "Dairy": "text-blue-600 bg-blue-50",
  "Bakery": "text-amber-600 bg-amber-50",
  "Tins & Jars": "text-stone-600 bg-stone-100",
  "Frozen": "text-sky-600 bg-sky-50",
  "Drinks": "text-indigo-600 bg-indigo-50",
  "Snacks": "text-orange-600 bg-orange-50",
  "Household": "text-purple-600 bg-purple-50",
  "Other": "text-stone-500 bg-stone-100",
}

export default function ShoppingPage() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [name, setName] = useState("")
  const [qty, setQty] = useState("1")
  const [unit, setUnit] = useState("units")
  const [category, setCategory] = useState("Other")
  const [copied, setCopied] = useState(false)

  useEffect(() => { setItems(store.getShoppingList()) }, [])

  function addItem() {
    if (!name.trim()) return
    const item: ShoppingItem = {
      id: Date.now().toString(),
      name: name.trim(),
      quantity: Number(qty),
      unit,
      category,
      checked: false,
      addedAt: new Date().toISOString(),
    }
    store.addShoppingItem(item)
    setItems(store.getShoppingList())
    setName("")
    setQty("1")
  }

  function toggle(id: string) {
    const updated = items.map(i => i.id === id ? { ...i, checked: !i.checked } : i)
    store.saveShoppingList(updated)
    setItems(updated)
  }

  function remove(id: string) {
    const updated = items.filter(i => i.id !== id)
    store.saveShoppingList(updated)
    setItems(updated)
  }

  function clearChecked() {
    const updated = items.filter(i => !i.checked)
    store.saveShoppingList(updated)
    setItems(updated)
  }

  function shareList() {
    const text = items.filter(i => !i.checked)
      .map(i => `• ${i.quantity} ${i.unit} ${i.name}`)
      .join("\n")
    navigator.clipboard.writeText(`Shopping list:\n${text}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const byCategory = CATEGORIES.reduce((acc, cat) => {
    const catItems = items.filter(i => i.category === cat)
    if (catItems.length > 0) acc[cat] = catItems
    return acc
  }, {} as Record<string, ShoppingItem[]>)

  const uncheckedCount = items.filter(i => !i.checked).length

  return (
    <div className="min-h-screen">
      <div className="px-6 pt-8 pb-5" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">This week</p>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Shopping List</h1>
            <p className="text-white/60 text-sm mt-1">{uncheckedCount} items to buy</p>
          </div>
          <div className="flex gap-2">
            {items.some(i => i.checked) && (
              <button onClick={clearChecked}
                className="text-xs text-white/70 hover:text-white font-semibold px-3 py-1.5 bg-white/10 rounded-xl transition-colors">
                Clear done
              </button>
            )}
            <button onClick={shareList}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors">
              <Share2 size={12} />
              {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-3 space-y-4 pb-8">
        {/* Add item */}
        <div className={`${card} p-4`}>
          <div className="flex gap-2 mb-3">
            <input value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addItem()}
              placeholder="Add an item..."
              className="flex-1 px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-colors" />
            <input value={qty} onChange={e => setQty(e.target.value)} type="number" min="1"
              className="w-14 px-2 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 text-center transition-colors" />
            <button onClick={addItem}
              className="bg-blue-600 text-white px-3 py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
              <Plus size={16} />
            </button>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                  category === c ? "bg-blue-600 text-white" : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* List by category */}
        {Object.keys(byCategory).length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <p className="font-medium">Your shopping list is empty</p>
            <p className="text-sm mt-1 text-stone-300">Add items above or plan meals to auto-fill</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(byCategory).map(([cat, catItems]) => (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${CAT_COLORS[cat] || "bg-stone-100 text-stone-500"}`}>
                    {cat}
                  </span>
                  <span className="text-xs text-stone-300 font-medium">{catItems.filter(i => !i.checked).length} left</span>
                </div>
                <div className="space-y-1.5">
                  {catItems.map(item => (
                    <div key={item.id}
                      className={`${card} px-4 py-3 flex items-center gap-3 transition-all ${item.checked ? "opacity-45" : ""}`}>
                      <button onClick={() => toggle(item.id)} className="shrink-0">
                        {item.checked
                          ? <CheckCircle size={20} className="text-green-500" />
                          : <Circle size={20} className="text-stone-200" />}
                      </button>
                      <span className={`flex-1 text-sm font-medium ${item.checked ? "line-through text-stone-300" : "text-stone-800"}`}>
                        {item.quantity} {item.unit} {item.name}
                      </span>
                      <button onClick={() => remove(item.id)} className="text-stone-200 hover:text-red-400 p-1 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Money saving */}
        <div className={`${card} overflow-hidden`}>
          <div className="px-4 pt-4 pb-3 border-b border-stone-100">
            <p className="font-bold text-stone-900">💰 Money saving swaps</p>
            <p className="text-xs text-stone-400 mt-0.5">Simple switches to cut your weekly bill</p>
          </div>
          <div className="p-3 space-y-1.5">
            {[
              { swap: "Aldi own-brand pasta", save: "~£0.60/week" },
              { swap: "Tesco Value tinned tomatoes vs Heinz", save: "~£0.40/week" },
              { swap: "Own-brand washing up liquid vs Fairy", save: "~£0.80/week" },
              { swap: "Frozen veg instead of fresh for cooked meals", save: "~£1.50/week" },
              { swap: "Batch cook soups & stews (cuts food waste)", save: "~£2.00/week" },
            ].map(s => (
              <div key={s.swap} className="flex items-center justify-between bg-stone-50 rounded-xl px-3 py-2.5">
                <p className="text-sm text-stone-700 flex-1">{s.swap}</p>
                <span className="text-xs font-bold text-green-700 ml-3 shrink-0">{s.save}</span>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 bg-green-50 flex justify-between items-center">
            <p className="text-sm font-semibold text-green-900">All swaps combined</p>
            <p className="text-sm font-bold text-green-700">~£21.20/month saved</p>
          </div>
        </div>
      </div>
    </div>
  )
}
