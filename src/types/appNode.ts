import { Node } from "@xyflow/react"
import { TaskParam, TaskType } from "./taskType";


export interface AppNodeData {
  type: TaskType;
  inputs: Record<string, string>;
  [key: string]: any;
}

export interface AppNode extends Node {
  data: AppNodeData;
}

export interface ParamProps {
  param: TaskParam;
  value: string;
  updateNodeparamValue: (newValue: string) => void
}

