import "@/styles/globals.css"
import type { Metadata, Viewport } from "next"

import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Analytics } from "@/components/analytics"
import { Providers } from "@/components/providers"
import { SiteHeader } from "@/components/site-header"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarNav } from "@/components/sidebar-nav"
import { CreateGroupButton } from "@/components/create-group-button"
import { config } from "@/lib/config"
import { SettingsButton } from "@/components/settings-button"

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
                <div className="border-b bg-background container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
                  <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r border-border/40">
                    <div className="flex flex-col h-full py-6 lg:py-8">
                      <ScrollArea className="flex-1 mb-4 pr-6">
                        <SidebarNav />
                      </ScrollArea>
                      <div className="flex gap-2 pr-6">
                        <SettingsButton />
                        <CreateGroupButton />
                      </div>
                    </div>
                  </aside>
                  {children}
                </div>
              </main>
            </div>
            <Analytics />
          </Providers>
        </body>
      </html>
    </>
  )
}
