"use server";

import { createWorkflowSchema, createWorkflowSchemaType, WorkflowStatus } from "@/schema/workflow";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AppNode } from "@/types/appNode";
import { Edge } from "@xyflow/react";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/taskType";

export default async function CreateWorkflow(form: createWorkflowSchemaType) {

  const { success, data } = createWorkflowSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const intialFlow: { nodes: AppNode[], edges: Edge[] } = {
    nodes: [],
    edges: [],
  };

  intialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));

  const result = await db.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(intialFlow),
      ...data
    },
  });

  if (!result) {
    throw new Error("Failed to create workflow");
  }

  redirect(`/workflow/editor/${result.id}`);
}

