"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
export async function GetWorkflowExecutionPhase(executionId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  return db.workflowExecution.findUnique({
    where: {
      id: executionId,
      userId,
    },
    include: {
      phases: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });
}
