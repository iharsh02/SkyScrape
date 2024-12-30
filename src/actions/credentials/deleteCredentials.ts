"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";


export default async function deleteCredentials({ id }: { id: string }) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    await db.credential.delete({
      where: {
        id,
        userId,
      }
    });

    revalidatePath("/credentials");
    return { success: true };
  } catch (error) {
    return { success: false, error: error };
  }
}
