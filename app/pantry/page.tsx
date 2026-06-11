"use client"
import { useEffect, useState } from "react"
import { Plus, Search, Trash2, AlertTriangle, CheckCircle, ScanLine } from "lucide-react"
import { store, PantryItem } from "@/lib/store"
import { lookupBarcode } from "@/lib/openfoodfacts"
import { cn } from "@/lib/utils"

function daysUntilExpiry(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
}

function ExpiryBadge({ date }: { date?: string }) {
  if (!date) return null
  const days = daysUntilExpiry(date)
  if (days < 0) return <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Expired</span>
  if (days <= 3) return <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Expires in {days}d</span>
  return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{days}d left</span>
}

export default function PantryPage() {
  const [items, setItems] = useState<PantryItem[]>([])
  const [search, setSearch] = useState("")
  const [showAdd, setShowAdd] = useState(false)
  const [barcode, setBarcode] = useState("")
  const [loading, setLoading] = useState(false)
  const [found, setFound] = useState<Partial<PantryItem> | null>(null)
  const [form, setForm] = useState({ name: "", brand: "", quantity: "1", unit: "units", category: "General", expiryDate: "" })

  useEffect(() => { setItems(store.getPantry()) }, [])

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.brand.toLowerCase().includes(search.toLowerCase())
  )

  async function lookupCode() {
    if (!barcode.trim()) return
    setLoading(true)
    const product = await lookupBarcode(barcode.trim())
    setLoading(false)
    if (product) {
      setFound(product)
      setForm(f => ({ ...f, name: product.name, brand: product.brand, category: product.categories[0] || "General" }))
    } else {
      alert("Product not found — fill in manually")
    }
  }

  function addItem() {
    const item: PantryItem = {
      id: Date.now().toString(),
      barcode: barcode || undefined,
      name: form.name,
      brand: form.brand,
      quantity: Number(form.quantity),
      unit: form.unit,
      category: form.category,
      expiryDate: form.expiryDate || undefined,
      imageUrl: (found as PantryItem)?.imageUrl,
      addedAt: new Date().toISOString(),
      nutriments: (found as PantryItem)?.nutriments,
    }
    store.addPantryItem(item)
    setItems(store.getPantry())
    setShowAdd(false)
    setBarcode("")
    setFound(null)
    setForm({ name: "", brand: "", quantity: "1", unit: "units", category: "General", expiryDate: "" })
  }

  function removeItem(id: string) {
    store.removePantryItem(id)
    setItems(store.getPantry())
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pantry</h1>
          <p className="text-gray-500 text-sm">{items.length} items tracked</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-green-700">
          <Plus size={16} /> Add item
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search pantry..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-green-300" />
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Add to pantry</h2>

            {/* Barcode lookup */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <ScanLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={barcode} onChange={e => setBarcode(e.target.value)}
                  placeholder="Barcode (optional)"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-300" />
              </div>
              <button onClick={lookupCode} disabled={loading}
                className="px-3 py-2 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200 disabled:opacity-50">
                {loading ? "..." : "Lookup"}
              </button>
            </div>

            {found && (
              <div className="flex items-center gap-2 mb-3 bg-green-50 rounded-xl p-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-sm text-green-700">Found: {(found as PantryItem).name}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Product name *"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-300" />
              </div>
              <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                placeholder="Brand"
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-300" />
              <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                placeholder="Category"
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-300" />
              <input value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                placeholder="Quantity" type="number" min="0"
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-300" />
              <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-300">
                {["units","g","kg","ml","L","slices","cans","bottles","bags"].map(u => (
                  <option key={u}>{u}</option>
                ))}
              </select>
              <div className="col-span-2">
                <label className="text-xs text-gray-500 mb-1 block">Expiry date (optional)</label>
                <input value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))}
                  type="date"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-300" />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={addItem} disabled={!form.name}
                className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                Add to pantry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Package size={40} className="mx-auto mb-3 opacity-30" />
          <p>{search ? "No items match your search" : "Your pantry is empty — add your first item!"}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => (
            <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-contain rounded-lg bg-gray-50" />
              ) : (
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">🥫</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-sm text-gray-500">{item.brand} · {item.quantity} {item.unit}</p>
                <div className="mt-1">
                  <ExpiryBadge date={item.expiryDate} />
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
