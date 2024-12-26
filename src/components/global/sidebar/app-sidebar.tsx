"use client";

import { BotMessageSquare, Coins, HomeIcon, Layers2, ShieldCheck } from "lucide-react";
import * as React from "react";
import { NavMain } from "@/components/global/sidebar/nav-main";
import { NavUser } from "@/components/global/sidebar/nav-user";
import { TeamSwitcher } from "@/components/global/sidebar/SidebarHeader";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";



const data = {
  teams:
  {
    name: "Sky Scrape",
    logo: BotMessageSquare,
    plan: "Enterprise",
  },
  navMain: [
    {
      href: "/",
      label: "Home",
      icon: HomeIcon,
    },
    {
      href: "/workflows",
      label: "Workflows",
      icon: Layers2,
    },
    {
      href: "/credentials",
      label: "Credentials",
      icon: ShieldCheck,
    },
    {
      href: "/billing",
      label: "Billing",
      icon: Coins,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

