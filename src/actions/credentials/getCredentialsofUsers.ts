"use server ";

import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
export async function GetCredentialsofUsers() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  return db.credential.findMany({
    where: {
      userId,
    },
    orderBy: {
      name: "asc",
    },
  });
}
