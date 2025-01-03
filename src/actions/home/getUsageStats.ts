"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { WorkflowExecutionStatus } from "@/types/workflow";

export type UsageStats = {
  success: number;
  failed: number;
};

export default async function getWorkflowExecutionStatus(): Promise<UsageStats> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const executions = await db.workflowExecution.findMany({
      where: { userId },
      select: {
        status: true,
        creditsConsumed: true,
      },
    });

    return executions.reduce(
      (acc, execution) => {
        const credits = execution.creditsConsumed || 0;
        
        if (execution.status === WorkflowExecutionStatus.COMPLETED) {
          acc.success += credits;
        } else if (execution.status === WorkflowExecutionStatus.FAILED) {
          acc.failed += credits;
        }
        
        return acc;
      },
      { success: 0, failed: 0 }
    );
  } catch (error) {
    console.error("Error fetching execution stats:", error);
    throw new Error("Failed to fetch execution stats");
  }
}
