"use server";

import db from "@/lib/db"
import { WorkflowStatus } from "@/schema/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function UpdateWorkflow({ id, definition }: { id: string, definition: string }) {


  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const workflow = await db.workflow.findUnique({
    where: {
      id,
      userId
    }
  })
  if (!workflow) throw new Error('workflow not found')
  if (workflow.status !== WorkflowStatus.DRAFT) throw new Error('Workflow is not draft');

  await db.workflow.update({
    data: {
      definition,
    },
    where: {
      id,
      userId
    }
  });

  revalidatePath("/workflow");
}

