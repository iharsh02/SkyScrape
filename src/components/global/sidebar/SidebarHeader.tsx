"use client"

import * as React from "react"
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
  }}) {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black dark:bg-white text-sidebar-primary-foreground">
            <teams.logo className="size-5 dark:text-black" />
          </div>
          <span className="truncate font-semibold">{teams.name}</span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
