"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, formatDistance } from 'date-fns';
import { useRouter } from "next/navigation";
import { ClockIcon, PlayCircleIcon, CheckCircleIcon, TimerIcon, CreditCardIcon } from "lucide-react";
import { ExecutionPhaseStatus } from "@/types/workflow";

export function WorkflowExecutionHistory({
  executionHistory,
  workflowId,
}: {
  executionHistory: any[];
  workflowId: string;
}) {
  const router = useRouter();

  if (!executionHistory || executionHistory.length === 0) {
    return (
      <div className="w-full text-center text-muted-foreground">
        No execution history found
      </div>
    );
  }

  return (
    <ScrollArea className="w-full h-full">
      <div className="grid gap-4">
        {executionHistory.map((execution) => (
          <Card
            key={execution.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() =>
              router.push(`/workflow/editor/${workflowId}/${execution.id}`)
            }
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Execution Run
              </CardTitle>
              <Badge
                variant="outline"
                className={getStatusBadgeClass(
                  execution.status as ExecutionPhaseStatus
                )}
              >
                {execution.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">
                      Created: {format(new Date(execution.createdAt), "PPp")}
                    </span>
                  </div>
                  {execution.startedAt && (
                    <div className="flex items-center space-x-2">
                      <PlayCircleIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">
                        Started: {format(new Date(execution.startedAt), "PPp")}
                      </span>
                    </div>
                  )}
                  {execution.completedAt && (
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">
                        Completed: {format(new Date(execution.completedAt), "PPp")}
                      </span>
                    </div>
                  )}
                  {execution.startedAt && execution.completedAt && (
                    <div className="flex items-center space-x-2">
                      <TimerIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">
                        Duration:{" "}
                        {formatDistance(
                          new Date(execution.startedAt),
                          new Date(execution.completedAt)
                        )}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 border-t pt-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">
                      Credits Consumed: {execution.creditsConsumed || 0}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <PlayCircleIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">
                      Trigger: {execution.trigger || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

function getStatusBadgeClass(status: ExecutionPhaseStatus) {
  switch (status) {
    case ExecutionPhaseStatus.COMPLETED:
      return "bg-green-100 text-green-800";
    case ExecutionPhaseStatus.FAILED:
      return "bg-red-100 text-red-800";
    case ExecutionPhaseStatus.RUNNING:
      return "bg-yellow-100 text-yellow-800";

    case ExecutionPhaseStatus.PENDING:
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

