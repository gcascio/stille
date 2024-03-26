import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarNav } from "@/components/sidebar-nav"
import { CreateGroupButton } from "@/components/create-group-button"
import { SettingsButton } from "@/components/settings-button"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
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
  )
}
