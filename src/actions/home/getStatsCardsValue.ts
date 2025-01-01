"use server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { Period } from "@/types/analytics";
import { PeriodToDateRange } from "@/lib/helper/dates";
import { WorkflowExecutionStatus } from "@/types/workflow";

const { COMPLETED, FAILED, PENDING } = WorkflowExecutionStatus;

export default async function GetStatsCardValues(period: Period) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const dateRange = PeriodToDateRange(period);

  try {
    const executions = await db.workflowExecution.findMany({
      where: {
        userId,
        startedAt: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
        status: {
          in: [COMPLETED, FAILED, PENDING],
        },
      },
      select: {
        creditsConsumed: true,
        phases: {
          where: {
            creditsConsumed: {
              not: null,
            },
          },
          select: { creditsConsumed: true },
        },
      },
    });

    const stats = {
      workflowExecutions: executions.length,
      creditsConsumed: executions.reduce(
        (sum, execution) => sum + (execution.creditsConsumed || 0),
        0,
      ),
      phaseExecutions: executions.reduce(
        (sum, execution) => sum + execution.phases.length,
        0,
      ),
    };

    return stats;
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw new Error("Failed to fetch workflow statistics");
  }
}
