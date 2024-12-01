import { Button } from "@/components/ui/button"
import { TaskRegistry } from "@/lib/workflow/tasks /registry"
import { TaskType } from "@/types/taskType"
import { CoinsIcon, GripVerticalIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
export const NodeHeader = ({ taskType }: { taskType: TaskType }) => {

  const task = TaskRegistry[taskType]
  return (
    <div className="
      flex items-center
      gap-2 p-2">
      <task.icon size={16} />
      <div className="flex justify-between items-center  w-full">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {task.label}
        </p>
        <div className="flex gap-2 items-center ">
          {task.isEntryPoint && <Badge>Entry point</Badge>}
          <Badge className="gap-2 flex items-center text-xs">
            <CoinsIcon size={16} />
          </Badge>

          <Button variant={"outline"} size={"icon"}
            className="drag-handle cursor-grab" >
            <GripVerticalIcon size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
}
