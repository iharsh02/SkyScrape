"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileTextIcon, PlayIcon, MoreVerticalIcon, TrashIcon, CornerDownRight, MoveRightIcon, CoinsIcon, ChevronRightIcon } from 'lucide-react';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Workflow } from '@prisma/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import TooltipWrapper from '@/components/global/TooltipWrapper';
import { DeleteWorkflowDialog } from './DeleteWorkflowDialog';
import { RunBtn } from './RunWorkflow';
import { SchedulerDialog } from './SchedulerDialog';
import { Badge } from '@/components/ui/badge';
import { PhaseStatus } from '@/app/workflow/editor/[workflowId]/[executionId]/_components/PhaseStatus';
import { ExecutionPhaseStatus } from '@/types/workflow';
import { formatDistanceToNow } from "date-fns";

const WorkflowStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED"
} as const;

type WorkflowStatusType = typeof WorkflowStatus[keyof typeof WorkflowStatus];

interface WorkflowCardProps {
  workflow: Workflow;
}

export const WorkflowCard = ({ workflow }: WorkflowCardProps) => {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;

  const statusColors = {
    [WorkflowStatus.DRAFT]: "bg-amber-200",
    [WorkflowStatus.PUBLISHED]: "bg-sky-200"
  };

  const iconColors = {
    [WorkflowStatus.DRAFT]: "text-amber-700",
    [WorkflowStatus.PUBLISHED]: "text-sky-700"
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 ">
      <CardContent className="p-4 md:p-6 flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center shadow-md",
              statusColors[workflow.status as WorkflowStatusType]
            )}
          >
            {isDraft ? (
              <FileTextIcon className={cn("h-6 w-6", iconColors[workflow.status as WorkflowStatusType])} />
            ) : (
              <PlayIcon className={cn("h-6 w-6", iconColors[workflow.status as WorkflowStatusType])} />
            )}
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/workflow/editor/${workflow.id}`}
                  className="hover:underline"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-primary transition-colors duration-200">
                    {workflow.name}
                  </h3>
                </Link>
                <Badge variant="outline" className={cn(
                  "text-xs capitalize",
                  isDraft ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
                )}>
                  {workflow.status.toLowerCase()}
                </Badge>
              </div>
              
              <div className="flex-shrink-0 flex items-center gap-2">
                {!isDraft && <RunBtn workflowId={workflow.id} />}
                <WorkflowActions workflowName={workflow.name} workflowId={workflow.id} />
              </div>
            </div>

            {workflow.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 md:line-clamp-1">
                {workflow.description}
              </p>
            )}
          </div>
        </div>

        {!isDraft && (
          <div className="flex flex-col space-y-4">
            <ScheduleSection 
              isDraft={isDraft}
              creditsCost={workflow.creditsCost}
              workflowId={workflow.id}
              cron={workflow.cron}
            />
            <LastRunDetails workflow={workflow} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface WorkflowActionsProps {
  workflowName: string;
  workflowId: string;
}

export function WorkflowActions({ workflowName, workflowId }: WorkflowActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DeleteWorkflowDialog 
        open={showDeleteDialog} 
        setOpen={setShowDeleteDialog} 
        workflowName={workflowName}
        workflowId={workflowId} 
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <TooltipWrapper content="More Actions">
              <MoreVerticalIcon size={16} />
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive flex items-center gap-2 cursor-pointer"
          >
            <TrashIcon size={16} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

interface ScheduleSectionProps {
  isDraft: boolean;
  creditsCost: number;
  workflowId: string;
  cron: string | null;
}

function ScheduleSection({ isDraft, creditsCost, workflowId, cron }: ScheduleSectionProps) {
  if (isDraft) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm bg-gray-100 dark:bg-neutral-900 rounded-md px-3 py-1.5">
      <CornerDownRight className="h-4 w-4 text-muted-foreground" />
      <SchedulerDialog workflowId={workflowId} cron={cron} />
      <MoveRightIcon className="h-4 w-4 text-muted-foreground" />
      <TooltipWrapper content="Credit consumption for full run">
        <Badge
          variant="outline"
          className="flex items-center gap-1 text-muted-foreground rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors py-0.5 h-6"
        >
          <CoinsIcon className="h-3 w-3" />
          <span>{creditsCost}</span>
        </Badge>
      </TooltipWrapper>
    </div>
  );
}

interface LastRunDetailsProps {
  workflow: Workflow;
}

export function LastRunDetails({ workflow }: LastRunDetailsProps) {
  const { lastRunStatus, lastRunAt, id: workflowId } = workflow;

  if (!lastRunAt || !lastRunStatus) return null;

  const formattedStartedAt = formatDistanceToNow(new Date(lastRunAt), { addSuffix: true });

  return (
    <div className="bg-gray-100 dark:bg-neutral-900 rounded-md px-4 py-2 shadow-inner">
      <Link
        href={`/workflow/editor/${workflowId}/history`}
        className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <div className="flex items-center gap-2">
          <span>Last Run</span>
          <PhaseStatus status={lastRunStatus as ExecutionPhaseStatus} />
          <span className="capitalize">{lastRunStatus.toLowerCase()}</span>
          <span className="text-xs text-gray-500">{formattedStartedAt}</span>
        </div>
        <ChevronRightIcon size={14} />
      </Link>
    </div>
  );
}
