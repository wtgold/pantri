"use client"
import { useState } from "react"
import { ThumbsUp, ThumbsDown, MessageCircle, Star, RefreshCw, Plus } from "lucide-react"

interface DiscoveryPost {
  id: string
  user: string
  avatar: string
  item: string
  brand: string
  category: string
  emoji: string
  note: string
  timestamp: string
  ratings: { love: number; meh: number; skip: number }
  userRating: "love" | "meh" | "skip" | null
  suggestions: string[]
}

const SAMPLE_POSTS: DiscoveryPost[] = [
  {
    id: "1", user: "Sarah M.", avatar: "S", item: "Mango & Passion Fruit Kefir", brand: "Biotiful", category: "Dairy",
    emoji: "🥭", note: "Tried this on a whim — absolutely delicious and so good for your gut! Found it in the chilled section at Waitrose.",
    timestamp: "2h ago", ratings: { love: 14, meh: 2, skip: 0 }, userRating: null, suggestions: ["Stroh Kefir", "Yeo Valley Kefir"],
  },
  {
    id: "2", user: "James K.", avatar: "J", item: "Spicy Korean Rice Cakes (Tteok-bokki)", brand: "Yopokki", category: "Snacks",
    emoji: "🌶️", note: "Spotted these in the Asian aisle at Tesco. Genuinely addictive — great alternative to crisps if you like heat.",
    timestamp: "5h ago", ratings: { love: 9, meh: 3, skip: 1 }, userRating: null, suggestions: ["Ottogi Korean Rice Cake"],
  },
  {
    id: "3", user: "Emma R.", avatar: "E", item: "Pea & Mint Hummus", brand: "Sainsbury's Taste the Difference", category: "Dips",
    emoji: "🫛", note: "Was on promotion so gave it a go. Really fresh taste, much lighter than regular hummus. Perfect for summer.",
    timestamp: "1d ago", ratings: { love: 21, meh: 4, skip: 2 }, userRating: null, suggestions: ["M&S Pea Hummus", "Make it at home — so easy"],
  },
  {
    id: "4", user: "Tom B.", avatar: "T", item: "Oat & Honey Granola Clusters", brand: "Lizi's", category: "Cereals",
    emoji: "🌾", note: "Got these from Aldi at half the usual price. Genuinely better than the supermarket own brands I've tried.",
    timestamp: "2d ago", ratings: { love: 31, meh: 5, skip: 1 }, userRating: null, suggestions: ["Dorset Cereals", "Aldi own-brand granola"],
  },
  {
    id: "5", user: "Priya S.", avatar: "P", item: "Coconut & Lemongrass Noodle Soup", brand: "Itsu", category: "Meals",
    emoji: "🍜", note: "Quick lunch sorted. Takes 3 minutes, actually tastes fresh. Found at most supermarkets now.",
    timestamp: "3d ago", ratings: { love: 18, meh: 6, skip: 3 }, userRating: null, suggestions: ["Itsu Ramen", "Wagamama at Home"],
  },
]

const CATEGORIES = ["All", "Dairy", "Snacks", "Dips", "Cereals", "Meals", "Drinks", "Fruit & Veg", "Bakery"]

export default function CommunityPage() {
  const [posts, setPosts] = useState(SAMPLE_POSTS)
  const [filter, setFilter] = useState("All")
  const [showShare, setShowShare] = useState(false)
  const [newPost, setNewPost] = useState({ item: "", brand: "", category: "Snacks", note: "" })

  function rate(postId: string, rating: "love" | "meh" | "skip") {
    setPosts(ps => ps.map(p => {
      if (p.id !== postId) return p
      const prev = p.userRating
      const updated = { ...p.ratings }
      if (prev) updated[prev] = Math.max(0, updated[prev] - 1)
      if (prev !== rating) updated[rating] = updated[rating] + 1
      return { ...p, ratings: updated, userRating: prev === rating ? null : rating }
    }))
  }

  const filtered = filter === "All" ? posts : posts.filter(p => p.category === filter)

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Food Discoveries</h1>
          <p className="text-gray-500 text-sm">What the community is trying & loving</p>
        </div>
        <button onClick={() => setShowShare(true)}
          className="bg-green-600 text-white px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 hover:bg-green-700">
          <Plus size={15} /> Share find
        </button>
      </div>

      {/* Privacy note */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 text-xs text-blue-700">
        🔒 This feed only shows food & drink discoveries. Health items, hygiene products, and anything age-restricted are never shown. Sharing is always opt-in.
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === cat ? "bg-green-600 text-white" : "bg-white border border-gray-100 text-gray-600 hover:border-gray-200"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filtered.map(post => (
          <div key={post.id} className="bg-white rounded-2xl border border-gray-100 p-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
                {post.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{post.user}</p>
                <p className="text-xs text-gray-400">{post.timestamp}</p>
              </div>
              <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{post.category}</span>
            </div>

            {/* Product */}
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">{post.emoji}</span>
              <div>
                <p className="font-semibold text-gray-900">{post.item}</p>
                <p className="text-sm text-gray-500">{post.brand}</p>
              </div>
            </div>

            {/* Note */}
            <p className="text-sm text-gray-700 mb-3 leading-relaxed">"{post.note}"</p>

            {/* Suggestions */}
            {post.suggestions.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1">
                  <RefreshCw size={10} /> Community alternatives:
                </p>
                <div className="flex flex-wrap gap-1">
                  {post.suggestions.map(s => (
                    <span key={s} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Ratings */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
              <button onClick={() => rate(post.id, "love")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-colors ${
                  post.userRating === "love" ? "bg-green-100 text-green-700" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}>
                <ThumbsUp size={13} /> {post.ratings.love} Love it
              </button>
              <button onClick={() => rate(post.id, "meh")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-colors ${
                  post.userRating === "meh" ? "bg-amber-100 text-amber-700" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}>
                <Star size={13} /> {post.ratings.meh} It's OK
              </button>
              <button onClick={() => rate(post.id, "skip")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-colors ${
                  post.userRating === "skip" ? "bg-red-100 text-red-700" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}>
                <ThumbsDown size={13} /> {post.ratings.skip} Skip
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Share modal */}
      {showShare && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-1">Share a food discovery</h2>
            <p className="text-sm text-gray-500 mb-4">Only food & drink — no health, hygiene or restricted products.</p>
            <div className="space-y-3">
              <input value={newPost.item} onChange={e => setNewPost(p => ({ ...p, item: e.target.value }))}
                placeholder="Product name *"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-300" />
              <input value={newPost.brand} onChange={e => setNewPost(p => ({ ...p, brand: e.target.value }))}
                placeholder="Brand"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-300" />
              <select value={newPost.category} onChange={e => setNewPost(p => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-300">
                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
              </select>
              <textarea value={newPost.note} onChange={e => setNewPost(p => ({ ...p, note: e.target.value }))}
                placeholder="Tell the community about it — where you found it, what you thought..."
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-300 resize-none" />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowShare(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium">Cancel</button>
              <button onClick={() => {
                if (!newPost.item) return
                setPosts(ps => [{
                  id: Date.now().toString(), user: "You", avatar: "Y",
                  item: newPost.item, brand: newPost.brand, category: newPost.category,
                  emoji: "🆕", note: newPost.note, timestamp: "Just now",
                  ratings: { love: 0, meh: 0, skip: 0 }, userRating: null, suggestions: [],
                }, ...ps])
                setShowShare(false)
                setNewPost({ item: "", brand: "", category: "Snacks", note: "" })
              }} disabled={!newPost.item}
                className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                Share discovery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
