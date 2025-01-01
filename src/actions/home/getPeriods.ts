"use server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { Period } from "@/types/analytics";

export default async function getPeriods() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const firstExecution = await db.workflowExecution.findFirst({
      where: { userId },
      orderBy: { startedAt: 'asc' },
      select: { startedAt: true }
    });

    const currentDate = new Date();
    const startDate = firstExecution?.startedAt || currentDate;
    
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const periods: Period[] = [];

    for (let year = startYear; year <= currentYear; year++) {
      const monthStart = year === startYear ? startMonth : 0;
      const monthEnd = year === currentYear ? currentMonth : 11;

      for (let month = monthStart; month <= monthEnd; month++) {
        periods.unshift({
          year,
          month,
        });
      }
    }

    return periods;
  } catch (error) {
    console.error('Error fetching periods:', error);
    throw new Error('Failed to fetch periods');
  }
}
