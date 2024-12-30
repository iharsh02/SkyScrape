"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function getCredentialsOfUsers() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  try {
    return await db.credential.findMany({
      where: {
        userId,
      },
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    throw new Error("Failed to fetch credentials");
  }
}
