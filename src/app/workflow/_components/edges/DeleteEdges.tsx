"use client";
import { Button } from "@/components/ui/button";
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, useReactFlow } from "@xyflow/react";
import { TrashIcon } from "lucide-react";

export const DeleteEdges = (props: EdgeProps) => {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getSmoothStepPath(props)
  return (
    <>
      <BaseEdge path={edgePath} markerEnd={props.markerEnd} style={props.style} />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan pointer-events-auto absolute"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <Button
            onClick={() => {
              setEdges((eds => eds.filter((eds) => eds.id !== props.id)))
            }}
            size="icon"
            variant="outline">
            <TrashIcon size={20} className="text-destructive" />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

