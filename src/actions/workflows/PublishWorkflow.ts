"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { WorkflowStatus } from "@/schema/workflow";
import { FlowToExecutionPlan } from "@/lib/workflow/ExecutionPlan";
import { CalculateWorkflowCost } from "@/lib/helper/calculateWorkflowCost";
import { revalidatePath } from "next/cache";

export default async function PublishWorkflow({
  id,
  flowDefinition,
}: {
  id: string;
  flowDefinition: string;
}) {
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

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("workflow is not draft");
  }

  const flow = JSON.parse(flowDefinition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);

  if (result.error) {
    throw new Error("flow definition not valid");
  }

  if (!result.executionPlan) {
    throw new Error("no execution plan  generated");
  }

  const creditsCost = CalculateWorkflowCost(flow.nodes);
  await db.workflow.update({
    where: {
      id,
      userId,
    },
    data: {
      definition: flowDefinition,
      executionPlan: JSON.stringify(result.executionPlan),
      creditsCost,
      status: WorkflowStatus.PUBLISHED,
    },
  });

  revalidatePath(`/workflow/editor/${id}`);
}
