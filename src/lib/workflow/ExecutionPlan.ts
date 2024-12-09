import { AppNode, AppNodeMissingInputs } from "@/types/appNode";
import {
  WorkflowExecutionPlan,
  WorkflowExecutionPlanPhase,
} from "@/types/workflow";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "./tasks/registry";

export enum FlowToExecutionPlanValidationErrors {
  "NO_ENTRY_POINT",
  "INVALID_INPUTS",
}

type FlowToExecutionPlan = {
  executionPlan?: WorkflowExecutionPlan;
  error?: {
    type: FlowToExecutionPlanValidationErrors;
    invalidElements?: AppNodeMissingInputs[];
  };
};

export function FlowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[],
): FlowToExecutionPlan {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint,
  );

  if (!entryPoint) {
    return {
      error: {
        type: FlowToExecutionPlanValidationErrors.NO_ENTRY_POINT,
      },
    };
  }

  const inputsWithErrors: AppNodeMissingInputs[] = [];

  const plannedNodes = new Set<string>();

  const invalidInputs = getInvalidInputs(entryPoint, edges, plannedNodes);

  if (invalidInputs.length > 0) {
    inputsWithErrors.push({
      nodeId: entryPoint.id,
      inputs: invalidInputs,
    });
  }
  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];

  plannedNodes.add(entryPoint.id);

  for (
    let phase = 2;
    phase <= nodes.length && plannedNodes.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };

    for (const currentNode of nodes) {
      if (plannedNodes.has(currentNode.id)) {
        continue; // Node already planned
      }

      const invalidInputs = getInvalidInputs(currentNode, edges, plannedNodes);

      if (invalidInputs.length > 0) {
        const incomers = getIncomers(currentNode, nodes, edges);

        if (incomers.every((incomer) => plannedNodes.has(incomer.id))) {
          // All incomers are planned, but this node still has invalid inputs
          inputsWithErrors.push({
            nodeId: currentNode.id,
            inputs: invalidInputs,
          });
        } else {
          continue;
        }
      }

      nextPhase.nodes.push(currentNode);
    }

    // Mark nodes in this phase as planned
    for (const node of nextPhase.nodes) {
      plannedNodes.add(node.id);
    }

    executionPlan.push(nextPhase);
  }

  if (inputsWithErrors.length > 0) {
    return {
      error: {
        type: FlowToExecutionPlanValidationErrors.INVALID_INPUTS,
        invalidElements: inputsWithErrors,
      },
    };
  }
  return {
    executionPlan,
  };
}

function getInvalidInputs(
  node: AppNode,
  edges: Edge[],
  planned: Set<string>,
): string[] {
  const invalidInputs: string[] = [];
  const inputs = TaskRegistry[node.data.type].inputs;

  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    const inputValueProvided = inputValue?.length > 0;

    if (inputValueProvided) {
      //this input is fine , so we can move on
      continue;
    }
    //if a value is not provided by the user then we need to check
    //if there is an output linked to the current input
    const incomingEdges = edges.filter((edge) => edge.target === node.id);

    const inputLinkedToOutput = incomingEdges.find(
      (edge) => edge.targetHandle === input.name,
    );

    const requiredInputProvidedByVisitedOutput =
      input.required &&
      inputLinkedToOutput &&
      planned.has(inputLinkedToOutput.source);

    if (requiredInputProvidedByVisitedOutput) {
      // the input is required and we have a valid value of it
      // provided by a task that is already planned
      continue;
    } else if (!input.required) {
      //if the input is not required but there is an output linked to it
      //then we need to be sure that the output is already planned

      if (!inputLinkedToOutput) continue;
      if (inputLinkedToOutput && planned.has(inputLinkedToOutput.source)) {
        // The output is providing a value to the input the input is fine
        continue;
      }
    }
    invalidInputs.push(input.name);
  }
  return invalidInputs;
}

function getIncomers(node: AppNode, nodes: AppNode[], edges: Edge[]) {
  if (!node.id) {
    return [];
  }

  const incomersId = new Set();
  edges.forEach((edge) => {
    if (edge.target === node.id) {
      incomersId.add(edge.source);
    }
  });

  return nodes.filter((n) => incomersId.has(n.id));
}
