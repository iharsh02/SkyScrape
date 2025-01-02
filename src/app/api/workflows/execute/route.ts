export const dynamic = 'force-dynamic';

import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflow";
import { TaskRegistry } from "@/lib/workflow/tasks/registry";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import parser from "cron-parser";

function isValidSecret(secret: string): boolean {
  const API_SECRET = process.env.API_SECRET;
  if (!API_SECRET) {
    return false;
  }
  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
  } catch (error) {
    console.error(error)
    return false;
  }
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = authHeader.split(" ")[1];
    if (!isValidSecret(secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const workflowId = url.searchParams.get("workflowId");
    if (!workflowId) {
      return NextResponse.json(
        { error: "Missing workflowId parameter" },
        { status: 400 },
      );
    }

    const workflow = await db.workflow.findUnique({
      where: { id: workflowId },
    });

    if (!workflow) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 },
      );
    }

    let executionPlan: WorkflowExecutionPlan;
    try {
      executionPlan = JSON.parse(workflow.executionPlan || "");
    } catch (error) {
      console.error(error)
      return NextResponse.json(
        { error: "Invalid execution plan" },
        { status: 400 },
      );
    }

    if (!executionPlan?.length) {
      return NextResponse.json(
        { error: "Empty execution plan" },
        { status: 400 },
      );
    }

    try {
      const cron = parser.parseExpression(workflow.cron!, { utc: true });
      const nextRun = cron.next().toDate();

      const execution = await db.workflowExecution.create({
        data: {
          workflowId,
          userId: workflow.userId,
          definition: workflow.definition,
          status: WorkflowExecutionStatus.PENDING,
          startedAt: new Date(),
          trigger: WorkflowExecutionTrigger.CRON,
          phases: {
            create: executionPlan.flatMap((phase) =>
              phase.nodes.map((node) => ({
                userId: workflow.userId,
                status: ExecutionPhaseStatus.CREATED,
                number: phase.phase,
                node: JSON.stringify(node),
                name: TaskRegistry[node.data.type].label,
              })),
            ),
          },
        },
      });

      await ExecuteWorkflow(execution.id, nextRun);

      return NextResponse.json(
        { success: true, executionId: execution.id },
        { status: 200 },
      );
    } catch (error) {
      console.error(error); 
      return NextResponse.json(
        { error: "internal server error" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Workflow execution error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
