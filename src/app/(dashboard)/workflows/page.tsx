import { GetWorkflowsForUser } from "@/actions/workflows/getWorkflowsForUser";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, InboxIcon, FileText, Clock } from "lucide-react";
import { Suspense } from "react";
import { CreateWorkflowDialog } from "./_components/CreateWorkflowDialog";
import { WorkflowCard } from "./_components/workflowCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const WorkflowStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED"
} as const;

export default function WorkflowPage() {
  return (
    <div className="flex-1 flex flex-col h-full p-4">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
        <CreateWorkflowDialog />
      </div>
      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowsSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  );
}

function UserWorkflowsSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  );
}

async function UserWorkflows() {
  const workflows = await GetWorkflowsForUser();

  if (!workflows) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong, please try again later
        </AlertDescription>
      </Alert>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="flex flex-col gap-4 h-full items-center justify-center">
        <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
          <InboxIcon size={40}  />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">No workflows created yet</p>
          <p className="text-sm text-muted-foreground">
            Click the button below to create new workflow
          </p>
        </div>
        <CreateWorkflowDialog />
      </div>
    );
  }

  const publishedWorkflows = workflows.filter(
    (workflow) => workflow.status === WorkflowStatus.PUBLISHED
  );
  const draftWorkflows = workflows.filter(
    (workflow) => workflow.status === WorkflowStatus.DRAFT
  );

  return (
    <Tabs defaultValue="published" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="published" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Published ({publishedWorkflows.length})
        </TabsTrigger>
        <TabsTrigger value="drafts" className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Drafts ({draftWorkflows.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="published" className="mt-0">
        <div className="grid grid-cols-1 gap-4">
          {publishedWorkflows.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No published workflows yet
            </div>
          ) : (
            publishedWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="drafts" className="mt-0">
        <div className="grid grid-cols-1 gap-4">
          {draftWorkflows.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No draft workflows yet
            </div>
          ) : (
            draftWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
