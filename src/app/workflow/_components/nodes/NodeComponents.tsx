import { NodeProps } from "@xyflow/react";
import { NodeCard } from "./nodeCard";
import { memo } from "react";
import { NodeHeader } from "./NodeHeader";
import { AppNodeData } from "@/types/appNode";
import { TaskRegistry } from "@/lib/workflow/tasks /registry";
import { NodeInput, NodeInputs } from "./nodeInputs";

const NodeComponent = memo((props: NodeProps) => {

  const nodeData = props.data as AppNodeData;
  const task = TaskRegistry[nodeData.type];
  return <NodeCard nodeId={props.id} isSelected={!!props.selected}>
    <NodeHeader taskType={nodeData.type} />
    <NodeInputs>
      {task.inputs.map((input) => (
        <NodeInput input={input} key={input.name} nodeId={props.id} />
      ))}
    </NodeInputs>
  </NodeCard>;
});

export default NodeComponent;

NodeComponent.displayName = "Node Component"
