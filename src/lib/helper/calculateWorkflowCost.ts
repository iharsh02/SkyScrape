import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "../workflow/tasks/registry";

export function CalculateWorkflowCost(nodes: AppNode[]) {
  return nodes.reduce((acc, nodes) => {
    return acc + TaskRegistry[nodes.data.type].credits;
  }, 0);
}
