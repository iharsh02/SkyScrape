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

export async function ExecuteWorkflow(executionId: string) {
  const execution = await db.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: true, phases: true },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }

  // const environment = { phases: {} }; // Retained for potential use

  try {
    await initializeWorkflowExecution(executionId, execution.workflow.id);
    await initializeWorkflowPhaseStatus(execution);

    
    const creditsConsumed = 0;
    let executionFailed = false;

    try {
      for (const phase of execution.phases) {
        const phaseExecution = await executionWorkflowPhase(phase);
        if (!phaseExecution.success) {
          executionFailed = true;
          break;
        }
      }
    } catch (error) {
      executionFailed = true;
      console.error("Error during workflow phase execution:", error);
      throw error;
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
    try {
      revalidatePath("/workflow/editor");
    } catch (error) {
      console.error("Failed to revalidate path:", error);
    }
  }
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string,
) {
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
  } catch (err) {
    console.error("Failed to initialize workflow execution:", err);
    throw err;
  }
}

async function initializeWorkflowPhaseStatus(execution: {
  phases: { id: string }[];
}) {
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
) {
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

async function executionWorkflowPhase(phase: ExecutionPhase) {
  const startedAt = new Date();

  const node = JSON.parse(phase.node) as AppNode;

  await db.executionPhase.update({
    where: {
      id: phase.id,
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
    },
  });

  const creditsRquired = TaskRegistry[node.data.type].credits;
  console.log(
    `Executing phase ${phase.name} with ${creditsRquired} credits required`,
  );

  // decrement user balance (with credits)

  const success = await executePhase(phase, node);

  await finalizePhase(phase.id, success);
  return { success };
}

async function finalizePhase(phaseId: string, success: boolean) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await db.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
    },
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
): Promise<boolean> {
  const runFn : any = ExecutorRegistry[node.data.type];

  if (!runFn) {
    return false;
  }

  return await runFn;
}
