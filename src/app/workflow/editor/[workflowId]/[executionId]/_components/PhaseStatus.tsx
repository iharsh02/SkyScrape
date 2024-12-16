import { ExecutionPhaseStatus } from "@/types/workflow"
import { CircleCheckIcon, CircleDashedIcon, CircleXIcon, Loader2Icon } from "lucide-react"

export const PhaseStatus = ({ status }: {
  status: ExecutionPhaseStatus
}) => {
  switch (status) {
    case ExecutionPhaseStatus.PENDING:
      return <CircleDashedIcon size={20} className="text-muted-foreground" />;

    case ExecutionPhaseStatus.RUNNING:
      return <Loader2Icon size={20} className="text-yellow-500 animate-spin" />;

    case ExecutionPhaseStatus.FAILED:
      return <CircleXIcon size={20} className="text-destructive" />;


    case ExecutionPhaseStatus.COMPLETED:
      return <CircleCheckIcon size={20} className="text-green-500" />;
  }
}

