"use client";

import { Coins, HomeIcon, Layers2, ShieldCheck } from "lucide-react";
import Logo from "./Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    href: "/",
    label: "Home",
    icons: HomeIcon,
  },
  {
    href: "/workflow",
    label: "Workflow",
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
    <div className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate">
      <Logo />
      <div className="flex flex-col p-2">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              href={route.href}
              key={route.href}
              className={`flex items-center gap-2 p-2 rounded ${isActive
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
