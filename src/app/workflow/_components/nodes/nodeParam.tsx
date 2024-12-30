import { TaskParam, TaskParamType } from "@/types/taskType"
import { StringParam } from "./param/StringParam";
import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/appNode";
import { useCallback } from "react";
import { BrowserInstanceParam } from "./param/browserInstanceParam";
import { SelectParam } from "./param/SelectParam";
import { CredentialsParam } from "./param/CredentialsParam";

export const NodeParamField = ({ param, nodeId, disabled }: {
  param: TaskParam,
  nodeId: string,
  disabled: boolean
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
      return <StringParam param={param} value={value} updateNodeparamValue={updateNodeparamValue} disabled={disabled} />;

    case TaskParamType.BROWSER_INSTANCE:
      return <BrowserInstanceParam param={param} value="" updateNodeparamValue={updateNodeparamValue} />;

    case TaskParamType.SELECT:
      return <SelectParam param={param} value={value} updateNodeparamValue={updateNodeparamValue} disabled={disabled} />

    case TaskParamType.CREDENTIALS:
      return <CredentialsParam param={param} value={value} updateNodeparamValue={updateNodeparamValue} disabled={disabled} />;

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

