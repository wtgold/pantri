"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, UtensilsCrossed, Package, Heart, Users, Home, Trophy, Apple, ScanLine, Store, BookOpen, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const mainLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/pantry", label: "Pantry", icon: Package },
  { href: "/meals", label: "Meals", icon: UtensilsCrossed },
  { href: "/shopping", label: "Shopping", icon: ShoppingCart },
  { href: "/health", label: "Health", icon: Heart },
  { href: "/nutrition", label: "Nutrition", icon: Apple },
  { href: "/family", label: "Family", icon: Users },
]

const discoverLinks = [
  { href: "/cookbooks", label: "Cookbooks", icon: BookOpen },
  { href: "/supermarkets", label: "Shops & Delivery", icon: Store },
  { href: "/community", label: "Community", icon: Sparkles },
  { href: "/receipt", label: "Scan Receipt", icon: ScanLine },
  { href: "/achievements", label: "Achievements", icon: Trophy },
]

const mobileLinks = [
  ...mainLinks,
  { href: "/cookbooks", label: "Books", icon: BookOpen },
  { href: "/supermarkets", label: "Shops", icon: Store },
  { href: "/community", label: "Community", icon: Sparkles },
  { href: "/achievements", label: "Badges", icon: Trophy },
]

export function Nav() {
  const path = usePathname()
  return (
    <>
      {/* Desktop sidebar — dark forest green */}
      <nav className="hidden md:flex flex-col w-60 min-h-screen fixed left-0 top-0 overflow-y-auto"
        style={{ background: "var(--sidebar)" }}>
        <div className="px-5 py-6 mb-2">
          <span className="text-2xl font-bold text-white tracking-tight">🥦 Pantri</span>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>Your family food OS</p>
        </div>

        <div className="px-3 flex-1">
          {mainLinks.map(({ href, label, icon: Icon }) => {
            const active = path === href
            return (
              <Link key={href} href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5",
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/55 hover:text-white hover:bg-white/8"
                )}>
                <Icon size={17} />
                {label}
              </Link>
            )
          })}

          <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mt-5 mb-2"
            style={{ color: "rgba(255,255,255,0.3)" }}>Discover</p>

          {discoverLinks.map(({ href, label, icon: Icon }) => {
            const active = path === href
            return (
              <Link key={href} href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5",
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/55 hover:text-white hover:bg-white/8"
                )}>
                <Icon size={17} />
                {label}
              </Link>
            )
          })}
        </div>

        <div className="px-5 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>Pantri v0.1 · MVP</p>
        </div>
      </nav>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 flex overflow-x-auto py-1.5 z-50 gap-0.5 px-1 scrollbar-hide"
        style={{ boxShadow: "0 -1px 0 rgba(0,0,0,0.06), 0 -4px 16px rgba(0,0,0,0.06)" }}>
        {mobileLinks.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-[10px] font-medium shrink-0 min-w-[54px] transition-colors",
              path === href ? "text-green-700" : "text-stone-400"
            )}>
            <Icon size={20} strokeWidth={path === href ? 2.5 : 1.8} />
            <span className="truncate max-w-[54px] text-center">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}
