import { BredCrumbHeader } from "@/components/global/BredCrumbHeader"
import { ModeToggle } from "@/components/global/ModeToggle"
import { AppSidebar } from "@/components/global/sidebar/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between px-2 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1"/>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BredCrumbHeader />
          </div>
          <ModeToggle />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
