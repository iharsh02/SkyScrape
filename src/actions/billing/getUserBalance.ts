"use server";
import { auth } from "@clerk/nextjs/server";

import db from "@/lib/db";

export default async function GetUserBalance() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }
  try {
    const balance = await db.userBalance.findUnique({
      where: {
        userId,
      },
    });

    if (!balance) {
      return -1;
    }

    return balance.credits;
  } catch (err) {
    throw err;
  }
}
