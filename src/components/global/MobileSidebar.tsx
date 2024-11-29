'use client';

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Logo from "./Logo";
import { Sidebar } from "./Sidebar";

export function MobileSidebar() {

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size={'icon'} className="dark:text-white">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col items-center ">
        <SheetHeader>
          <SheetTitle><Logo /></SheetTitle>
          <SheetDescription>SkyScraper</SheetDescription>
        </SheetHeader>

        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}

