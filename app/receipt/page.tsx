"use client"
import { useState, useRef } from "react"
import { Upload, CheckCircle, Circle, ScanLine } from "lucide-react"
import { store } from "@/lib/store"

const MOCK_ITEMS = [
  { name: "Warburtons Wholemeal Bread 800g", price: "£1.39", category: "Bakery", quantity: 1, unit: "units" },
  { name: "Semi-Skimmed Milk 2L", price: "£1.29", category: "Dairy", quantity: 1, unit: "units" },
  { name: "Free Range Eggs x6", price: "£1.89", category: "Dairy", quantity: 6, unit: "units" },
  { name: "Heinz Baked Beans 415g", price: "£0.89", category: "Tins & Jars", quantity: 1, unit: "cans" },
  { name: "Tesco Chicken Breast 500g", price: "£3.50", category: "Meat & Fish", quantity: 500, unit: "g" },
  { name: "Broccoli 400g", price: "£0.65", category: "Fruit & Veg", quantity: 400, unit: "g" },
  { name: "Cheddar Cheese 400g", price: "£2.50", category: "Dairy", quantity: 400, unit: "g" },
  { name: "Basmati Rice 1kg", price: "£1.49", category: "Tins & Jars", quantity: 1, unit: "kg" },
]

export default function ReceiptPage() {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [parsed, setParsed] = useState(false)
  const [selected, setSelected] = useState<Set<number>>(new Set(MOCK_ITEMS.map((_, i) => i)))
  const [added, setAdded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(f: File) {
    setFile(f)
    setProcessing(true)
    setParsed(false)
    setAdded(false)
    setTimeout(() => {
      setProcessing(false)
      setParsed(true)
    }, 2000)
  }

  function toggleItem(i: number) {
    setSelected(s => {
      const next = new Set(s)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  function addToP() {
    MOCK_ITEMS.forEach((item, i) => {
      if (!selected.has(i)) return
      store.addPantryItem({
        id: Date.now().toString() + i,
        name: item.name,
        brand: "",
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        addedAt: new Date().toISOString(),
      })
    })
    setAdded(true)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Scan Receipt</h1>
        <p className="text-gray-500 text-sm">Upload a receipt photo to bulk-add items to your pantry</p>
      </div>

      {/* Upload area */}
      {!parsed && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
          className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer hover:border-green-300 hover:bg-green-50 transition-colors mb-4">
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
          {processing ? (
            <div>
              <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="font-medium text-gray-700">Reading your receipt...</p>
              <p className="text-sm text-gray-400 mt-1">Identifying items and prices</p>
            </div>
          ) : (
            <div>
              <Upload size={32} className="mx-auto mb-3 text-gray-300" />
              <p className="font-medium text-gray-700">Drop your receipt here</p>
              <p className="text-sm text-gray-400 mt-1">or click to browse · JPG, PNG, HEIC</p>
            </div>
          )}
        </div>
      )}

      {/* Parsed results */}
      {parsed && !added && (
        <div>
          <div className="flex items-center gap-2 mb-4 bg-green-50 border border-green-100 rounded-xl p-3">
            <CheckCircle size={18} className="text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Receipt scanned — {MOCK_ITEMS.length} items found</p>
              <p className="text-xs text-green-700">From: {file?.name}</p>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-3">Select the items you want to add to your pantry:</p>

          <div className="space-y-2 mb-4">
            {MOCK_ITEMS.map((item, i) => (
              <div key={i} onClick={() => toggleItem(i)}
                className={`bg-white rounded-xl border px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors ${selected.has(i) ? "border-green-200 bg-green-50" : "border-gray-100"}`}>
                {selected.has(i)
                  ? <CheckCircle size={18} className="text-green-500 shrink-0" />
                  : <Circle size={18} className="text-gray-300 shrink-0" />}
                <span className={`flex-1 text-sm ${selected.has(i) ? "text-gray-900" : "text-gray-400 line-through"}`}>
                  {item.name}
                </span>
                <span className="text-sm text-gray-500 shrink-0">{item.price}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setFile(null); setParsed(false) }}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
              Scan another
            </button>
            <button onClick={addToP} disabled={selected.size === 0}
              className="flex-1 py-3 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50">
              Add {selected.size} item{selected.size !== 1 ? "s" : ""} to pantry
            </button>
          </div>
        </div>
      )}

      {added && (
        <div className="text-center py-12">
          <CheckCircle size={48} className="mx-auto mb-3 text-green-500" />
          <p className="text-xl font-bold text-gray-900">Added to pantry!</p>
          <p className="text-gray-500 mt-1">{selected.size} items added successfully</p>
          <button onClick={() => { setFile(null); setParsed(false); setAdded(false) }}
            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700">
            Scan another receipt
          </button>
        </div>
      )}

      {/* Info note */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <div className="flex gap-2">
          <ScanLine size={16} className="text-blue-500 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-700">
            Full OCR integration using Google Vision API is coming soon — this will automatically read real receipt text and match products to the Open Food Facts database.
          </p>
        </div>
      </div>
    </div>
  )
}
