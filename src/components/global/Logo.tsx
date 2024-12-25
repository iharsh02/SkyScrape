"use client";
import { cn } from "@/lib/utils";
import { BotMessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const Logo = ({
  fontSize = "2xl",
  iconSize = 20,
}: {
  fontSize?: string;
  iconSize?: number;
}) => {
  const router = useRouter();
  return (
    <Link
      href="/"
      className={cn(
        "text-2xl font-extrabold  flex items-center justify-center p-4 gap-2",
        fontSize
      )}
    >
      <Button
        size={"icon"}
        onClick={() => router.push("/")}
      >
        <BotMessageSquare size={iconSize} />
      </Button>

      <div className="hidden md:flex md:gap-1">
        <span>Sky</span>

        <span>Scrape</span>
      </div>
    </Link>
  );
};

export default Logo;
