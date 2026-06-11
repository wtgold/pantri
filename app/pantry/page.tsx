"use client"
import { useEffect, useState } from "react"
import { Plus, Search, Trash2, AlertTriangle, CheckCircle, ScanLine, Package } from "lucide-react"
import { store, PantryItem } from "@/lib/store"
import { lookupBarcode } from "@/lib/openfoodfacts"

const card = "bg-white rounded-2xl shadow-sm ring-1 ring-black/[0.04]"
const input = "w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:bg-white transition-colors"

function daysUntilExpiry(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
}

function ExpiryBadge({ date }: { date?: string }) {
  if (!date) return null
  const days = daysUntilExpiry(date)
  if (days < 0) return <span className="text-[11px] font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Expired</span>
  if (days <= 3) return <span className="text-[11px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Expires in {days}d</span>
  return <span className="text-[11px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{days}d left</span>
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
      setFound(product as unknown as Partial<PantryItem>)
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-6 pt-8 pb-5" style={{ background: "linear-gradient(135deg, #14532d 0%, #15803d 100%)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Your pantry</p>
        <h1 className="text-3xl font-bold text-white">Pantry</h1>
        <p className="text-white/60 text-sm mt-1">{items.length} items tracked</p>
      </div>

      <div className="px-5 -mt-3 space-y-4 pb-8">
        {/* Search + add */}
        <div className={`${card} p-3 flex gap-2`}>
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search pantry..."
              className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:bg-white transition-colors" />
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "var(--brand)" }}>
            <Plus size={15} /> Add
          </button>
        </div>

        {/* Add modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-lg font-bold text-stone-900 mb-4">Add to pantry</h2>

              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <ScanLine size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input value={barcode} onChange={e => setBarcode(e.target.value)}
                    placeholder="Scan or enter barcode"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-400" />
                </div>
                <button onClick={lookupCode} disabled={loading}
                  className="px-3 py-2 bg-stone-100 rounded-xl text-sm font-medium hover:bg-stone-200 disabled:opacity-50">
                  {loading ? "..." : "Look up"}
                </button>
              </div>

              {found && (
                <div className="flex items-center gap-2 mb-3 bg-green-50 rounded-xl p-2.5">
                  <CheckCircle size={15} className="text-green-600" />
                  <span className="text-sm text-green-700 font-medium">Found: {(found as PantryItem).name}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Product name *"
                    className={input} />
                </div>
                <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                  placeholder="Brand" className={input} />
                <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  placeholder="Category" className={input} />
                <input value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                  placeholder="Qty" type="number" min="0" className={input} />
                <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                  className={input}>
                  {["units","g","kg","ml","L","slices","cans","bottles","bags"].map(u => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
                <div className="col-span-2">
                  <label className="text-xs text-stone-400 mb-1.5 block font-medium">Expiry date (optional)</label>
                  <input value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))}
                    type="date" className={input} />
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowAdd(false)}
                  className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm font-medium hover:bg-stone-50">
                  Cancel
                </button>
                <button onClick={addItem} disabled={!form.name}
                  className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold disabled:opacity-40 transition-opacity"
                  style={{ background: "var(--brand)" }}>
                  Add to pantry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Items list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <Package size={40} className="mx-auto mb-3 opacity-25" />
            <p className="font-medium">{search ? "No items match your search" : "Your pantry is empty"}</p>
            <p className="text-sm mt-1 text-stone-300">{!search && "Add your first item to get started"}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(item => (
              <div key={item.id} className={`${card} p-4 flex items-center gap-3`}>
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-contain rounded-xl bg-stone-50" />
                ) : (
                  <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center text-xl shrink-0">🥫</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-900 truncate">{item.name}</p>
                  <p className="text-sm text-stone-400">{item.brand} · {item.quantity} {item.unit}</p>
                  <div className="mt-1.5">
                    <ExpiryBadge date={item.expiryDate} />
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-stone-200 hover:text-red-400 transition-colors p-1.5">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
