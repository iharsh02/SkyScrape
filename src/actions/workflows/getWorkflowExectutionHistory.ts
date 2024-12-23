"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export default async function GetWorkflowExecutionHistory(workflowId: string) {

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }
  if(!workflowId){
    throw new Error("workflowId not found");
  }

  return db.workflowExecution.findMany({
    where: {
      workflowId,
      userId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}
