import { TopBar } from "@/app/workflow/_components/topbar/topBar";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import { WorkflowExecutionHistory } from "./_components/workflowExecutionHistory";
import GetWorkflowExecutionHistory from "@/actions/workflows/getWorkflowExectutionHistory";

export default async function HistoryPage({
  params,
}: {
  params: { workflowId: string };
}) {
  const executionHistory = await GetWorkflowExecutionHistory(params.workflowId);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <TopBar
        workFlowId={params.workflowId}
        title="Workflow Run Details"
        subtitle={`Workflow ID: ${params.workflowId}`}
        hideButtons
      />
      <section className="flex h-full overflow-hidden p-4">
        <Suspense
          fallback={
            <div className="flex w-full items-center justify-center">
              <Loader2Icon className="h-10 w-10 animate-spin" />
            </div>
          }
        >
          <WorkflowExecutionHistory
            workflowId={params.workflowId}
            executionHistory={executionHistory}
          />
        </Suspense>
      </section>
    </div>
  );
}

