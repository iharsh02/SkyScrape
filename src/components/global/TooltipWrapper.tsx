import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Props {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "bottom" | "right"
}

export default function TooltipWrapper({ children, content, side }: Props) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side}
        className="bg-blue-500 dark:text-white ">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
