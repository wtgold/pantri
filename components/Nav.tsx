"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, UtensilsCrossed, Package, Heart, Users, Home, Trophy, Apple, ScanLine } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/pantry", label: "Pantry", icon: Package },
  { href: "/meals", label: "Meals", icon: UtensilsCrossed },
  { href: "/shopping", label: "Shopping", icon: ShoppingCart },
  { href: "/health", label: "Health", icon: Heart },
  { href: "/nutrition", label: "Nutrition", icon: Apple },
  { href: "/family", label: "Family", icon: Users },
  { href: "/receipt", label: "Scan Receipt", icon: ScanLine },
  { href: "/achievements", label: "Achievements", icon: Trophy },
]

export function Nav() {
  const path = usePathname()
  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex flex-col w-56 min-h-screen bg-white border-r border-gray-100 p-4 gap-1 fixed left-0 top-0">
        <div className="mb-6 px-2">
          <span className="text-2xl font-bold text-green-600">🥦 Pantri</span>
          <p className="text-xs text-gray-400 mt-1">Your family food OS</p>
        </div>
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
              path === href ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"
            )}>
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-2 z-50">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={cn("flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs",
              path === href ? "text-green-600" : "text-gray-400"
            )}>
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>
    </>
  )
}
