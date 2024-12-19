"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { WorkflowStatus } from "@/schema/workflow";
import { revalidatePath } from "next/cache";

export default async function UnpublishWorkflow(id : string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthrized");
  }

  const workflow = await db.workflow.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!workflow) {
    throw new Error("workflow not found");
  }

  if (workflow.status !== WorkflowStatus.PUBLISHED) {
    throw new Error("workflow is not draft");
  }

  await db.workflow.update({
    where: {
      id,
      userId,
    },
    data: {
      status: WorkflowStatus.DRAFT,
      executionPlan: null,
      creditsCost: 0,
    },
  });

  revalidatePath(`/workflow/editor/${id}`);
}
