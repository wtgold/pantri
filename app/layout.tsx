import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { Nav } from "@/components/Nav"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pantri — Your Family Food OS",
  description: "Smart pantry, meal planning, health modes & family food management",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} min-h-screen`} style={{ background: "var(--bg)" }}>
        <Nav />
        <main className="md:ml-60 pb-24 md:pb-0 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
