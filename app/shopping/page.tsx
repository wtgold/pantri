"use client"
import { useEffect, useState } from "react"
import { Plus, Trash2, CheckCircle, Circle, Share2 } from "lucide-react"
import { store, ShoppingItem } from "@/lib/store"

const CATEGORIES = ["Fruit & Veg", "Meat & Fish", "Dairy", "Bakery", "Tins & Jars", "Frozen", "Drinks", "Snacks", "Household", "Other"]

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
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shopping List</h1>
          <p className="text-gray-500 text-sm">{uncheckedCount} items to buy</p>
        </div>
        <div className="flex gap-2">
          {items.some(i => i.checked) && (
            <button onClick={clearChecked}
              className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-1.5 rounded-xl hover:bg-red-50">
              Clear done
            </button>
          )}
          <button onClick={shareList}
            className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 bg-gray-100 rounded-xl hover:bg-gray-200">
            <Share2 size={14} />
            {copied ? "Copied!" : "Share"}
          </button>
        </div>
      </div>

      {/* Add item */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
        <div className="flex gap-2 mb-3">
          <input value={name} onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addItem()}
            placeholder="Add item..."
            className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-300" />
          <input value={qty} onChange={e => setQty(e.target.value)} type="number" min="1"
            className="w-16 px-2 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-300 text-center" />
          <button onClick={addItem}
            className="bg-green-600 text-white px-3 py-2.5 rounded-xl hover:bg-green-700">
            <Plus size={16} />
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                category === c ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* List by category */}
      {Object.keys(byCategory).length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>Your shopping list is empty</p>
          <p className="text-sm mt-1">Add items above or plan a meal to auto-populate</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(byCategory).map(([cat, catItems]) => (
            <div key={cat}>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{cat}</h3>
              <div className="space-y-1">
                {catItems.map(item => (
                  <div key={item.id}
                    className={`bg-white rounded-xl px-4 py-3 border border-gray-100 flex items-center gap-3 transition-opacity ${item.checked ? "opacity-50" : ""}`}>
                    <button onClick={() => toggle(item.id)}>
                      {item.checked
                        ? <CheckCircle size={20} className="text-green-500" />
                        : <Circle size={20} className="text-gray-300" />}
                    </button>
                    <span className={`flex-1 text-sm ${item.checked ? "line-through text-gray-400" : "text-gray-900"}`}>
                      {item.quantity} {item.unit} {item.name}
                    </span>
                    <button onClick={() => remove(item.id)} className="text-gray-300 hover:text-red-500 p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Money saving tips */}
      <div className="mt-6 bg-green-50 border border-green-100 rounded-2xl overflow-hidden">
        <div className="p-4">
          <h2 className="font-semibold text-green-900 mb-3">💰 Money saving swaps</h2>
          <div className="space-y-2">
            {[
              { swap: "Switch to Aldi own-brand pasta", save: "~£0.60/week", total: 2.40 },
              { swap: "Tesco Everyday Value tinned tomatoes vs Heinz", save: "~£0.40/week", total: 1.60 },
              { swap: "Own-brand washing up liquid vs Fairy", save: "~£0.80/week", total: 3.20 },
              { swap: "Frozen veg instead of fresh for cooked meals", save: "~£1.50/week", total: 6.00 },
              { swap: "Batch cook soups/stews (halves food waste)", save: "~£2.00/week", total: 8.00 },
            ].map(s => (
              <div key={s.swap} className="bg-white rounded-xl p-3 flex items-center justify-between">
                <p className="text-sm text-gray-700 flex-1">{s.swap}</p>
                <span className="text-sm font-semibold text-green-700 ml-3 shrink-0">{s.save}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-green-100 flex justify-between">
            <p className="text-sm font-medium text-green-900">If you adopt all swaps</p>
            <p className="text-sm font-bold text-green-700">~£21.20/month saved</p>
          </div>
        </div>
      </div>
    </div>
  )
}
