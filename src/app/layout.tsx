import "@/styles/globals.css"
import type { Metadata, Viewport } from "next"

import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Analytics } from "@/components/analytics"
import { Providers } from "@/components/providers"
import { SiteHeader } from "@/components/site-header"
import { config } from "@/lib/config"

export const metadata: Metadata = {
  title: {
    default: config.name,
    template: `%s - ${config.name}`,
  },
  metadataBase: new URL(config.url),
  description: config.description,
  keywords: [
    "RSS",
    "RSS Reader",
  ],
  authors: [
    {
      name: "gcascio",
      url: "https://gcasc.io",
    },
  ],
  creator: "gcascio",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: config.url,
    title: config.name,
    description: config.description,
    siteName: config.name,
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.className
          )}
        >
          <Providers
            defaultTheme="read"
            themes={['read', 'light', 'dark']}
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col bg-background">
              <SiteHeader />
              <main className="flex flex-1">
                {children}
              </main>
            </div>
            <Analytics />
          </Providers>
        </body>
      </html>
    </>
  )
}
