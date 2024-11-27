'use server';

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db"

export async function GetWorkflowsForUser() {

  const { userId } = await auth();

  if (!userId) {
    throw new Error("unaunthenticated")
  }

  return db.workflow.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc"
    }
  })
}
