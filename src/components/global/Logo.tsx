import { cn } from "@/lib/utils";
import { BotMessageSquare } from "lucide-react";
import Link from "next/link";

const Logo = ({ fontSize = "2xl", iconSize = 20 }: { fontSize?: string, iconSize?: number }) => {
  return (
    <Link href="/" className={cn(
      "text-2xl font-extrabold  flex items-center justify-center py-4 gap-2", fontSize
    )}
    >
      <div className="rounded-xl bg-gradient-to-r 
        from-blue-500 to-blue-600 p-2">
        <BotMessageSquare className="text-white" size={iconSize} />
      </div>
      
      <div className="flex gap-1">
        <span className="bg-gradient-to-r from-blue-500 to-blue-600
          bg-clip-text text-transparent
          ">Sky
        </span>
       
        <span className="text-stone-700 dark:text-stone-300">Scrape
        </span>

      </div>
    </Link>
  )
}

export default Logo;
