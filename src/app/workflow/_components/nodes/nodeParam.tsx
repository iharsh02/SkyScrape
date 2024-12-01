import { TaskParam, TaskParamType } from "@/types/taskType"
import { StringParam } from "./param/StringParam";
import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/appNode";
import { useCallback } from "react";

export const NodeParamField = ({ param, nodeId }: {
  param: TaskParam,
  nodeId: string
}) => {

  const { updateNodeData, getNode } = useReactFlow();

  const node = getNode(nodeId) as AppNode;
  const value = node?.data.inputs?.[param.name];

  const updateNodeparamValue = useCallback((newValue: string) => {
    updateNodeData(nodeId, {
      inputs: {
        ...node?.data.inputs,
        [param.name]: newValue
      }
    })
  }, [updateNodeData, param.name, node?.data.inputs, nodeId])

  switch (param.type) {
    case TaskParamType.STRING:
      return <StringParam param={param} value={value} updateNodeparamValue={updateNodeparamValue} />;

    default:
      return (
        <div className="w-full">
          <p className="text-xs
            text-muted-foreground">
            Not implemented
          </p>
        </div>)
  }
}

