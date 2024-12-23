"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import parser from "cron-parser";
import { revalidatePath } from "next/cache";

export async function UpdateWorkflowCron({
  id,
  cron,
}: {
  id: string;
  cron: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("unauthorized");
  }

  try {

    const interval = parser.parseExpression(cron, { utc: true });
     await db.workflow.update({
      where: {
        id,
        userId,
      },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    });

    revalidatePath("/workflows")
  } catch (error) {
    console.error(error);
    throw new Error("somthing went wrong");
  }
}
