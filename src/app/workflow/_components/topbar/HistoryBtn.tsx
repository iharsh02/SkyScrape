import { Button } from "@/components/ui/button"
import { LucideHistory } from "lucide-react"
import { useRouter } from "next/navigation"

export const HistoryBtn = ({ workflowId }: { workflowId: string }) => {
  const router = useRouter()
  
  const handleHistoryView = () => {
    router.push(`/workflow/editor/${workflowId}/history`)
  }
  
  return (
    <Button 
      variant={"outline"} 
      size={"icon"}
      onClick={handleHistoryView}
    >
      <LucideHistory />
    </Button>
  )
}
