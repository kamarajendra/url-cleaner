import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "URL Cleaner",
  description: "Strip tracking parameters from any URL",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-dvh bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
