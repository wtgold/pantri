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

const mobileLinks = [...mainLinks, { href: "/cookbooks", label: "Cookbooks", icon: BookOpen }, { href: "/supermarkets", label: "Shops", icon: Store }, { href: "/community", label: "Community", icon: Sparkles }, { href: "/achievements", label: "Badges", icon: Trophy }]

export function Nav() {
  const path = usePathname()
  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex flex-col w-56 min-h-screen bg-white border-r border-gray-100 p-4 gap-1 fixed left-0 top-0 overflow-y-auto">
        <div className="mb-4 px-2">
          <span className="text-2xl font-bold text-green-600">🥦 Pantri</span>
          <p className="text-xs text-gray-400 mt-1">Your family food OS</p>
        </div>
        {mainLinks.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
              path === href ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"
            )}>
            <Icon size={18} />
            {label}
          </Link>
        ))}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mt-4 mb-1">Discover</p>
        {discoverLinks.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
              path === href ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"
            )}>
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Mobile bottom bar — show core links only, scrollable */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex overflow-x-auto py-2 z-50 gap-1 px-1">
        {mobileLinks.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={cn("flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs shrink-0 min-w-[52px]",
              path === href ? "text-green-600" : "text-gray-400"
            )}>
            <Icon size={20} />
            <span className="truncate max-w-[52px] text-center">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}
