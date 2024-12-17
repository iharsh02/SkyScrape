"use client";

import { Coins, HomeIcon, Layers2, ShieldCheck } from "lucide-react";
import Logo from "./Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserAvailCreditsBadge } from "../billing/UserAvailCreditsBadge";
const routes = [
  {
    href: "/",
    label: "Home",
    icons: HomeIcon,
  },
  {
    href: "/workflows",
    label: "Workflows",
    icons: Layers2,
  },
  {
    href: "/credentials",
    label: "Credentials",
    icons: ShieldCheck,
  },
  {
    href: "/billing",
    label: "Billing",
    icons: Coins,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="relative md:block  md:min-w-[280px] md:max-w-[280px] h-screen overflow-hidden w-full md:bg-primary/5 md:dark:bg-secondary/30 dark:text-foreground text-muted-foreground md:border-r-2 border-separate">
      <div className="hidden md:block">
        <Logo />
      </div>
      <div className="flex items-center justify-center">
        <UserAvailCreditsBadge />
      </div>
      <div className="flex flex-col md:p-2">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              href={route.href}
              key={route.href}
              className={`flex items-center gap-2 p-2 rounded ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-600/10 text-muted-foreground"
              }`}
            >
              <route.icons size={20} />
              <span>{route.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
