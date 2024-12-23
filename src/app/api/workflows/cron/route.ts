import { WorkflowStatus } from "@/schema/workflow";
import db from "@/lib/db";
import { getAppUrl } from "@/lib/helper/getAppUrl";
import { NextResponse } from "next/server";

async function triggerWorkflow(workflowId: string): Promise<void> {
  const triggerApiUrl = getAppUrl(`api/workflows/execute?workflowId=${workflowId}`);
  const apiSecret = process.env.API_SECRET;
  
  if (!apiSecret) {
    throw new Error("API_SECRET not configured");
  }

  try {
    const response = await fetch(triggerApiUrl, {
      headers: {
        Authorization: `Bearer ${apiSecret}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error triggering workflow ${workflowId}:`, error);
    throw error;
  }
}

export async function GET() {
  try {
    const now = new Date();
    const workflows = await db.workflow.findMany({
      select: { id: true },
      where: {
        status: WorkflowStatus.PUBLISHED,
        cron: { not: null },
        nextRunAt: { lte: now },
      },
    });

    console.log(`Found ${workflows.length} workflows to run`);

    const results = await Promise.allSettled(
      workflows.map(workflow => triggerWorkflow(workflow.id))
    );

    const failed = results.filter(r => r.status === 'rejected').length;
    const succeeded = results.filter(r => r.status === 'fulfilled').length;

    return NextResponse.json({
      total: workflows.length,
      succeeded,
      failed
    }, { status: 200 });

  } catch (error) {
    console.error('Workflow trigger error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
