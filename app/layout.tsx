import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "OpenLaptop Viewer",
  description: "Interactive 3D viewer for open-source laptop CAD models",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-900 text-white">{children}</body>
    </html>
  )
}
