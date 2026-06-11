"use client"
import { useState } from "react"
import { BookOpen, ScanLine, ShoppingCart, Plus, CheckCircle, Search } from "lucide-react"
import { store, ShoppingItem } from "@/lib/store"

interface Cookbook {
  id: string
  isbn: string
  title: string
  author: string
  emoji: string
  cover: string
  totalRecipes: number
  tags: string[]
  recipes: Recipe[]
}

interface Recipe {
  name: string
  time: string
  servings: number
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  ingredients: { name: string; amount: string; unit: string; category: string }[]
}

const SAMPLE_COOKBOOKS: Cookbook[] = [
  {
    id: "1", isbn: "9781509892099", title: "Lean in 15", author: "Joe Wicks", emoji: "💪", cover: "🟦",
    totalRecipes: 100, tags: ["High Protein", "Quick", "Healthy"],
    recipes: [
      {
        name: "Peri Peri Chicken with Sweet Potato", time: "15 min", servings: 1, difficulty: "Easy", tags: ["High Protein", "Gluten Free"],
        ingredients: [
          { name: "Chicken breast", amount: "200", unit: "g", category: "Meat & Fish" },
          { name: "Sweet potato", amount: "200", unit: "g", category: "Fruit & Veg" },
          { name: "Peri peri sauce", amount: "2", unit: "tbsp", category: "Tins & Jars" },
          { name: "Olive oil", amount: "1", unit: "tbsp", category: "Tins & Jars" },
        ],
      },
      {
        name: "Greek Salad Omelette", time: "10 min", servings: 1, difficulty: "Easy", tags: ["Vegetarian", "Low Carb"],
        ingredients: [
          { name: "Eggs", amount: "3", unit: "units", category: "Dairy" },
          { name: "Feta cheese", amount: "50", unit: "g", category: "Dairy" },
          { name: "Cherry tomatoes", amount: "80", unit: "g", category: "Fruit & Veg" },
          { name: "Olives", amount: "30", unit: "g", category: "Tins & Jars" },
        ],
      },
      {
        name: "Salmon Teriyaki Rice Bowl", time: "15 min", servings: 1, difficulty: "Easy", tags: ["Fish", "High Protein"],
        ingredients: [
          { name: "Salmon fillet", amount: "180", unit: "g", category: "Meat & Fish" },
          { name: "Basmati rice", amount: "80", unit: "g", category: "Tins & Jars" },
          { name: "Teriyaki sauce", amount: "2", unit: "tbsp", category: "Tins & Jars" },
          { name: "Edamame beans", amount: "80", unit: "g", category: "Frozen" },
        ],
      },
    ],
  },
  {
    id: "2", isbn: "9780718187729", title: "BOSH! Healthy Vegan", author: "Ian Theasby & Henry Firth", emoji: "🌱", cover: "🟩",
    totalRecipes: 80, tags: ["Vegan", "Plant-based", "Healthy"],
    recipes: [
      {
        name: "Thai Green Curry", time: "35 min", servings: 4, difficulty: "Medium", tags: ["Vegan", "Thai"],
        ingredients: [
          { name: "Coconut milk", amount: "2", unit: "cans", category: "Tins & Jars" },
          { name: "Green curry paste", amount: "3", unit: "tbsp", category: "Tins & Jars" },
          { name: "Tofu", amount: "400", unit: "g", category: "Meat & Fish" },
          { name: "Mixed veg", amount: "400", unit: "g", category: "Fruit & Veg" },
          { name: "Basmati rice", amount: "300", unit: "g", category: "Tins & Jars" },
        ],
      },
    ],
  },
  {
    id: "3", isbn: "9780241956885", title: "Plenty More", author: "Yotam Ottolenghi", emoji: "🫒", cover: "🟨",
    totalRecipes: 150, tags: ["Vegetarian", "Mediterranean", "Gourmet"],
    recipes: [
      {
        name: "Roasted Aubergine with Yoghurt", time: "40 min", servings: 4, difficulty: "Medium", tags: ["Vegetarian", "Mediterranean"],
        ingredients: [
          { name: "Aubergine", amount: "2", unit: "units", category: "Fruit & Veg" },
          { name: "Greek yoghurt", amount: "200", unit: "g", category: "Dairy" },
          { name: "Pomegranate seeds", amount: "50", unit: "g", category: "Fruit & Veg" },
          { name: "Tahini", amount: "3", unit: "tbsp", category: "Tins & Jars" },
        ],
      },
    ],
  },
]

export default function CookbooksPage() {
  const [books, setBooks] = useState(SAMPLE_COOKBOOKS)
  const [selected, setSelected] = useState<string | null>(null)
  const [showScanner, setShowScanner] = useState(false)
  const [isbn, setIsbn] = useState("")
  const [scanning, setScanning] = useState(false)
  const [servings, setServings] = useState(2)
  const [toast, setToast] = useState("")
  const [search, setSearch] = useState("")

  const selectedBook = books.find(b => b.id === selected)

  function addIngredientsToShopping(recipe: Recipe) {
    const scale = servings / recipe.servings
    recipe.ingredients.forEach((ing, i) => {
      const item: ShoppingItem = {
        id: `${Date.now()}-${i}`,
        name: ing.name,
        quantity: Math.ceil(parseFloat(ing.amount) * scale),
        unit: ing.unit,
        category: ing.category,
        checked: false,
        addedAt: new Date().toISOString(),
      }
      store.addShoppingItem(item)
    })
    setToast(`${recipe.name} ingredients added to shopping list!`)
    setTimeout(() => setToast(""), 3000)
  }

  function scanIsbn() {
    if (!isbn.trim()) return
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      setToast("Cookbook not in our library yet — we've logged it for addition!")
      setTimeout(() => setToast(""), 3000)
      setShowScanner(false)
      setIsbn("")
    }, 1500)
  }

  const filteredRecipes = selectedBook?.recipes.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  ) ?? []

  return (
    <div className="min-h-screen">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-700 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold">
          <CheckCircle size={15} /> {toast}
        </div>
      )}

      <div className="px-6 pt-8 pb-5" style={{ background: "linear-gradient(135deg, #3b0764 0%, #7c3aed 100%)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Your library</p>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Cookbooks</h1>
            <p className="text-white/60 text-sm mt-1">Scan a book or browse your collection</p>
          </div>
          <button onClick={() => setShowScanner(true)}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl transition-colors">
            <ScanLine size={13} /> Scan book
          </button>
        </div>
      </div>

      <div className="px-5 -mt-3 pb-8">
      {!selected ? (
        <>
          {/* How it works */}
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 mt-4 mb-4">
            <p className="font-semibold text-purple-900 mb-2">📚 How it works</p>
            <div className="space-y-1.5">
              {[
                "Scan the barcode on the back of any cookbook",
                "Browse recipes from the book in the app",
                "Tap a recipe to see ingredients scaled for your household",
                "Add ingredients straight to your shopping list",
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-purple-700">
                  <span className="font-bold text-purple-400 shrink-0">{i + 1}.</span> {s}
                </div>
              ))}
            </div>
          </div>

          {/* Serving size */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Cooking for</span>
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={() => setServings(s => Math.max(1, s - 1))}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">−</button>
              <span className="w-6 text-center font-semibold">{servings}</span>
              <button onClick={() => setServings(s => s + 1)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">+</button>
            </div>
            <span className="text-sm text-gray-500">people</span>
          </div>

          {/* Book grid */}
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Your collection</h2>
          <div className="grid grid-cols-1 gap-3">
            {books.map(book => (
              <button key={book.id} onClick={() => setSelected(book.id)}
                className="bg-white rounded-2xl border border-gray-100 p-4 text-left hover:border-green-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-18 bg-gray-100 rounded-xl flex items-center justify-center text-3xl shrink-0">
                    {book.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{book.title}</p>
                    <p className="text-sm text-gray-500">{book.author}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{book.recipes.length} recipes available · {book.totalRecipes} total</p>
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {book.tags.map(t => (
                        <span key={t} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                  <span className="text-gray-300 text-lg">›</span>
                </div>
              </button>
            ))}
          </div>

          {/* Add more */}
          <button onClick={() => setShowScanner(true)}
            className="mt-3 w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 hover:border-green-300 hover:text-green-600 transition-colors flex items-center justify-center gap-2">
            <Plus size={16} /> Add a cookbook by scanning its barcode
          </button>
        </>
      ) : (
        <>
          {/* Book detail */}
          <button onClick={() => { setSelected(null); setSearch("") }}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
            ← Back to collection
          </button>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selectedBook!.emoji}</span>
              <div>
                <p className="font-bold text-gray-900">{selectedBook!.title}</p>
                <p className="text-gray-500 text-sm">{selectedBook!.author}</p>
              </div>
            </div>
          </div>

          {/* Search recipes */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search recipes..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-green-300" />
          </div>

          <div className="space-y-3">
            {filteredRecipes.map(recipe => (
              <div key={recipe.name} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{recipe.name}</p>
                      <p className="text-xs text-gray-400">{recipe.time} · serves {recipe.servings} · {recipe.difficulty}</p>
                    </div>
                    <button onClick={() => addIngredientsToShopping(recipe)}
                      className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-green-700 shrink-0">
                      <ShoppingCart size={12} /> Add to list
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {recipe.tags.map(t => (
                      <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-1">
                    {recipe.ingredients.map(ing => {
                      const scale = servings / recipe.servings
                      return (
                        <div key={ing.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full shrink-0" />
                          {Math.ceil(parseFloat(ing.amount) * scale)} {ing.unit} {ing.name}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
            {filteredRecipes.length === 0 && (
              <p className="text-center py-8 text-gray-400 text-sm">No recipes match your search</p>
            )}
          </div>
        </>
      )}
      </div>

      {/* Scanner modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-lg font-bold text-stone-900 mb-1">Scan a cookbook</h2>
            <p className="text-sm text-stone-400 mb-4">Enter the ISBN from the back of the book</p>
            <div className="flex gap-2 mb-4">
              <input value={isbn} onChange={e => setIsbn(e.target.value)}
                placeholder="e.g. 9781509892099"
                className="flex-1 px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:bg-white transition-colors" />
              <button onClick={scanIsbn} disabled={scanning || !isbn}
                className="px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 disabled:opacity-40 transition-colors">
                {scanning ? "..." : "Look up"}
              </button>
            </div>
            <p className="text-xs font-medium text-stone-400 mb-3">In our library:</p>
            <div className="space-y-1.5">
              {SAMPLE_COOKBOOKS.map(book => (
                <button key={book.id} onClick={() => { setSelected(book.id); setShowScanner(false) }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-purple-50 text-sm flex items-center gap-2 transition-colors">
                  <span>{book.emoji}</span>
                  <span className="font-semibold text-stone-900">{book.title}</span>
                  <span className="text-stone-400 text-xs">— {book.author}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowScanner(false)}
              className="mt-4 w-full py-2.5 border border-stone-200 rounded-xl text-sm font-medium hover:bg-stone-50">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
