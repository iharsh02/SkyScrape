"use server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { Period } from "@/types/analytics";
import { PeriodToDateRange } from "@/lib/helper/dates";
import { eachDayOfInterval, format } from "date-fns";
import { WorkflowExecutionStatus } from "@/types/workflow";

type Stats = Record<
  string,
  {
    success: number;
    failed: number;
  }
>;

export default async function getWorkflowExecutionStatus(period: Period) {
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
      },
    });

    const dateFormat = "yyyy-MM-dd";

    const stats: Stats = eachDayOfInterval({
      start: dateRange.startDate,
      end: dateRange.endDate,
    })
      .map((date) => format(date, dateFormat))
      .reduce(
        (acc, date) => {
          acc[date] = {
            success: 0,
            failed: 0,
          };
          return acc;
        },
        {} as Record<string, { success: number; failed: number }>,
      );

    executions.forEach((execution) => {
      if (!execution.startedAt) return;
      const date = format(execution.startedAt, dateFormat);
      if (execution.status === WorkflowExecutionStatus.COMPLETED) {
        stats[date].success += 1;
      } else if (execution.status === WorkflowExecutionStatus.FAILED) {
        stats[date].failed += 1;
      }
    });

    return stats;
  } catch (error) {
    console.error("Error fetching periods:", error);
    throw new Error("Failed to fetch periods");
  }
}
