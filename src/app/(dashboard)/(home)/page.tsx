import getPeriods from "@/actions/home/getPeriods";
import { Suspense } from "react";
import { PeriodSelector } from "./_components/PeriodSelector";
import { Period } from "@/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import GetStatsCardValues from "@/actions/home/getStatsCardsValue";
import { StatsCard, StatsCardGridSkeleton } from "./_components/statusCard";
import { Activity, CreditCard, ListChecks } from "lucide-react";
import getWorkflowExecutionStatus from "@/actions/home/getWorkflowExecutionStatus";
import ExecutionStatusChart from "./_components/executionStatusChart";

export default function HomePage({
  searchParams
}: {
  searchParams: {
    month?: string,
    year?: string
  }
}) {
  const currentDate = new Date();
  const { month, year } = searchParams;
  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear(),
  };
  return (
    <div className="flex flex-col flex-1 gap-4 h-full p-8">
      <div className="flex items-center  justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Home</h1>
        <Suspense fallback={
          <Skeleton className="w-[180px] h-10" />
        }>
          <PeriodSelectorWrapper selectedPeriod={period} />
        </Suspense>
      </div>
      <Suspense fallback={<StatsCardGridSkeleton />}>
        <StatsCards selectedPeriod={period} />
      </Suspense>

      <Suspense>
        <StatusExecutionStatus selectedPeriod={period} />
      </Suspense>
    </div>
  )
}

async function PeriodSelectorWrapper({
  selectedPeriod
}: {
  selectedPeriod: Period
}) {
  const periods = await getPeriods();
  return (
    <div className="w-[180px]">
      <PeriodSelector periods={periods} selectedPeriod={selectedPeriod} />
    </div>
  );
}

async function StatsCards({
  selectedPeriod
}: {
  selectedPeriod: Period
}) {
  const data = await GetStatsCardValues(selectedPeriod)
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="Total Executions"
        value={data.workflowExecutions}
        icon={Activity}
      />
      <StatsCard
        title="Credits Consumed"
        value={data.creditsConsumed}
        icon={CreditCard}
      />
      <StatsCard
        title="Phase Executions"
        value={data.phaseExecutions}
        icon={ListChecks}
      />
    </div>
  )
}


async function StatusExecutionStatus({
  selectedPeriod
}: {
  selectedPeriod: Period;
}) {
  const data = await getWorkflowExecutionStatus(selectedPeriod);

  return <ExecutionStatusChart data={data} />
}
