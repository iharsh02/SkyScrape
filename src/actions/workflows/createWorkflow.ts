"use server";

import { createWorkflowSchema, createWorkflowSchemaType, WorkflowStatus } from "@/schema/workflow";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CreateWorkflow(form: createWorkflowSchemaType) {

  const { success, data } = createWorkflowSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const result = await db.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: "Todo",
      ...data
    },
  });

  if (!result) {
    throw new Error("Failed to create workflow");
  }

  redirect(`/workflow/editor/${result.id}`);
}

