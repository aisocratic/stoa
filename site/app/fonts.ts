import { JetBrains_Mono, Newsreader, Space_Grotesk } from "next/font/google"

// next/font must be called in app source; the package only reads these slots.
export const body = Space_Grotesk({ weight: "400", subsets: ["latin"], display: "swap", variable: "--stoa-font-body" })
export const display = Newsreader({ weight: ["200"], style: ["normal", "italic"], subsets: ["latin"], display: "swap", variable: "--stoa-font-display" })
export const code = JetBrains_Mono({ weight: ["400", "500"], subsets: ["latin"], display: "swap", variable: "--stoa-font-code" })

export const fontClassName = `${body.variable} ${display.variable} ${code.variable}`
