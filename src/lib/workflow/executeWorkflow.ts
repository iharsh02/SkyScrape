import "server-only";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./tasks/registry";
import { ExecutorRegistry } from "./executor/registry";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { TaskParamType } from "@/types/taskType";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { LogCollector } from "@/types/log";
import { CreateLogCollector } from "../log";

export async function ExecuteWorkflow(executionId: string): Promise<void> {
  const execution = await db.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: true, phases: true },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }

  const edges: Edge[] = JSON.parse(execution.workflow.definition)
    .edges as Edge[];
  const environment: Environment = { phase: {} };

  try {
    await initializeWorkflowExecution(executionId, execution.workflow.id);
    await initializeWorkflowPhaseStatus(execution);

    const creditsConsumed = 0;
    let executionFailed = false;

    for (const phase of execution.phases) {
      const phaseExecution = await executeWorkflowPhase(
        phase,
        environment,
        edges,
      );
      if (!phaseExecution.success) {
        executionFailed = true;
        break;
      }
    }

    await finalizeWorkflowExecution(
      executionId,
      execution.workflow.id,
      executionFailed,
      creditsConsumed,
    );
  } catch (error) {
    console.error("Error in workflow execution:", error);
    await finalizeWorkflowExecution(
      executionId,
      execution.workflow.id,
      true,
      0,
    );
    throw error;
  } finally {
    await cleanUpEnvironment(environment);
    revalidatePath("/workflow/editor");
  }
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string,
): Promise<void> {
  try {
    await db.$transaction([
      db.workflowExecution.update({
        where: { id: executionId },
        data: {
          startedAt: new Date(),
          status: WorkflowExecutionStatus.RUNNING,
        },
      }),
      db.workflow.update({
        where: { id: workflowId },
        data: {
          lastRunAt: new Date(),
          lastRunStatus: WorkflowExecutionStatus.RUNNING,
          lastRunId: executionId,
        },
      }),
    ]);
  } catch (error) {
    console.error("Failed to initialize workflow execution:", error);
    throw error;
  }
}

async function initializeWorkflowPhaseStatus(execution: {
  phases: { id: string }[];
}): Promise<void> {
  try {
    await db.executionPhase.updateMany({
      where: { id: { in: execution.phases.map((phase) => phase.id) } },
      data: { status: ExecutionPhaseStatus.PENDING },
    });
  } catch (error) {
    console.error("Failed to initialize workflow phase status:", error);
    throw error;
  }
}

async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number,
): Promise<void> {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  try {
    await db.$transaction([
      db.workflowExecution.update({
        where: { id: executionId },
        data: {
          status: finalStatus,
          completedAt: new Date(),
          creditsConsumed,
        },
      }),
      db.workflow.update({
        where: { id: workflowId },
        data: { lastRunStatus: finalStatus },
      }),
    ]);
  } catch (error) {
    console.error("Failed to finalize workflow execution:", error);
    throw error;
  }
}

async function executeWorkflowPhase(
  phase: ExecutionPhase,
  environment: Environment,
  edges: Edge[],
): Promise<{ success: boolean }> {
  const logCollector = CreateLogCollector();
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;

  setupEnvironmentForPhase(node, environment, edges);

  await db.executionPhase.update({
    where: { id: phase.id },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(environment.phase[node.id]?.inputs || {}),
    },
  });

  const creditsRequired = TaskRegistry[node.data.type]?.credits || 0;
  console.log(
    `Executing phase ${phase.name} with ${creditsRequired} credits required`,
  );

  const success = await executePhase(phase, node, environment, logCollector);
  const outputs = environment.phase[node.id]?.outputs || {};

  await finalizePhase(phase.id, success, outputs, logCollector);
  return { success };
}

async function finalizePhase(
  phaseId: string,
  success: boolean,
  outputs: any,
  logCollector: LogCollector,
): Promise<void> {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await db.executionPhase.update({
    where: { id: phaseId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      ExecutionLog: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            message: log.message,
            timestamp: log.timestamp,
            logLevel: log.level,
          })),
        },
      },
    },
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment,
  log: LogCollector,
): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type];

  if (!runFn) {
    console.error(`No executor found for node type: ${node.data.type}`);
    return false;
  }

  const executionEnvironment: ExecutionEnvironment<any> =
    createExecutionEnvironment(node, environment, log);

  return runFn(executionEnvironment);
}

function setupEnvironmentForPhase(
  node: AppNode,
  environment: Environment,
  edges: Edge[],
): void {
  environment.phase[node.id] = { inputs: {}, outputs: {} };

  const inputs = TaskRegistry[node.data.type]?.inputs || [];

  for (const input of inputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue;

    const inputValue = node.data.inputs?.[input.name];
    if (inputValue) {
      environment.phase[node.id].inputs[input.name] = inputValue;
      continue;
    }

    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name,
    );

    if (!connectedEdge) {
      console.error("Missing Edge for input", input.name, "node id", node.id);
      continue;
    }

    const outputValue =
      environment.phase[connectedEdge.source]?.outputs[
      connectedEdge.sourceHandle!
      ];
    environment.phase[node.id].inputs[input.name] = outputValue;
  }
}

function createExecutionEnvironment(
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector,
): ExecutionEnvironment<any> {
  return {
    getInput: (name: string) => environment.phase[node.id]?.inputs[name],
    setOutput: (name: string, value: string) => {
      environment.phase[node.id].outputs[name] = value;
    },
    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => {
      environment.browser = browser;
    },
    getPage: () => environment.page,
    setPage: (page: Page) => {
      environment.page = page;
    },
    log: logCollector,
  };
}

async function cleanUpEnvironment(environment: Environment): Promise<void> {
  if (environment.browser) {
    try {
      await environment.browser.close();
    } catch (error) {
      console.error("Failed to close the browser:", error);
    }
  }
}
