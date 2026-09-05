import type { Metadata } from "next"
import type { ReactNode } from "react"

import "./globals.css"
import { fontClassName } from "./fonts"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "AI Socratic Design — the AI Socratic design system",
  description: "Tokens, type scale, colour roles and React primitives shared by aisocratic.org, Agora and Atlas.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontClassName} suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
