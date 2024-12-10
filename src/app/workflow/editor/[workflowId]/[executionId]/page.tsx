import { TopBar } from "@/app/workflow/_components/topbar/topBar";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import { GetWorkflowExecutionPhase } from "@/actions/workflows/getWorkflowExecutionPhase";
import { ExecutionViewer } from "./_components/executionViewer";
export default function ExecutionPage({
  params,
}: {
  params: {
    executionId: string;
    workflowId: string;
  };
}) {
  return (
    <div
      className="flex flex-col
    h-screen
    w-full
    overflow-hidden"
    >
      <TopBar
        workFlowId={params.workflowId}
        title="Workflow run details"
        subtitle={`Run Id : ${params.executionId}`}
        hideButtons
      />
      <section className="flex h-full overflow-hidden">
        <Suspense
          fallback={
            <div
              className="flex w-full items-center
            justify-center"
            >
              <Loader2Icon
                className="h-10
                w-10
                animate-spin"
              />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={params.executionId} />
        </Suspense>
      </section>
    </div>
  );
}

async function ExecutionViewerWrapper({
  executionId,
}: {
  executionId: string;
}) {
  const workflowExecution = await GetWorkflowExecutionPhase(executionId);
  if (!workflowExecution) {
    return <div>Not Found</div>;
  }
  return <ExecutionViewer initialData={workflowExecution} />;
}
