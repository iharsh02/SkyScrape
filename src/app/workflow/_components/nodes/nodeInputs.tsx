import { Handle, Position, useEdges } from "@xyflow/react"
import { cn } from "@/lib/utils"
import { TaskParam } from "@/types/taskType"
import { NodeParamField } from "./nodeParam"
import { ColorForHandel } from "./common"

export function NodeInputs({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col divide-y gap-2">
      {children}
    </div>
  )
}

export function NodeInput({ input, nodeId }: { input: TaskParam, nodeId: string }) {

  const edges = useEdges();
  const isConnected = edges.some(edges => edges.target === nodeId && edges.targetHandle === input.name);
  return <div
    className="flex justify-start relative p-3 bg-secondary w-full">
    <NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
    {!input.hideHandel && (
      <Handle
        id={input.name}
        isConnectable={!isConnected}
        type="target"
        position={Position.Left}
        className={cn(" !bg-muted-foreground !border-2 !border-backgound !-left-2 !-w-4 !-h-4",
          ColorForHandel[input.type])}
      />
    )}
  </div>
}