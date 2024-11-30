"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

interface DeleteWorkflowParams {
  id: string;
}

export default async function deleteWorkflow({ id }: DeleteWorkflowParams) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    await db.workflow.delete({
      where: {
        id,
        userId,
      }
    });

    revalidatePath("/workflows");
    return { success: true };
  } catch (error) {
    return { success: false, error: error };
  }
}
