"use server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export default async function GetDemoCredits() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const userBalance = await db.userBalance.findUnique({
      where: { userId },
    });

    if (!userBalance) {
      const newBalance = await db.userBalance.create({
        data: {
          userId,
          credits: 1000,
          demoClaimed: true,
        },
      });

      return newBalance.credits;
    }

    if (userBalance.demoClaimed) {
      throw new Error("Demo credits already claimed");
    }

    const updatedBalance = await db.userBalance.update({
      where: { userId },
      data: {
        credits: userBalance.credits + 1000,
        demoClaimed: true,
      },
    });

    return updatedBalance.credits;
  } catch (err) {
    throw err;
  }
}
