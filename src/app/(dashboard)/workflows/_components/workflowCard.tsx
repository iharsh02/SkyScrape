"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileTextIcon, PlayIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
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

const WorkflowStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED"
}

export const WorkflowCard = ({ workflow }: { workflow: Workflow }) => {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;

  const statusColors = {
    [WorkflowStatus.DRAFT]: "bg-yellow-100",
    [WorkflowStatus.PUBLISHED]: "bg-blue-100"
  };

  const iconColors = {
    [WorkflowStatus.DRAFT]: "text-yellow-600",
    [WorkflowStatus.PUBLISHED]: "text-blue-600"
  };

  return (
    <Card className="cursor-pointer flex items-center justify-between pr-5">
      <Link href={`/workflow/editor/${workflow.id}`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                statusColors[workflow.status]
              )}
            >
              {isDraft ? (
                <FileTextIcon className={cn("h-6 w-6", iconColors[workflow.status])} />
              ) : (
                <PlayIcon className={cn("h-6 w-6", iconColors[workflow.status])} />
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {workflow.name}
              </h3>

              <div className="flex items-center mt-1">
                <span
                  className={cn(
                    "text-sm px-3 py-1 rounded-full font-medium",
                    isDraft ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
                  )}
                >
                  {workflow.status.toLowerCase()}
                </span>
                {workflow.description && (
                  <p className="hidden md:block text-wrap w-1/2 lg:w-full ml-3 text-sm text-gray-500 dark:text-gray-400 truncate">
                    {workflow.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
      <div className='flex gap-2 items-center px-5'>
        {!isDraft && (
          <RunBtn workflowId={workflow.id} />
        )}
        <WorkflowActions workflowName={workflow.name} workflowId={workflow.id} />
      </div>
    </Card>
  );
};

export function WorkflowActions({ workflowName, workflowId }: { workflowName: string, workflowId: string }) {

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (<>
    <DeleteWorkflowDialog open={showDeleteDialog} setOpen={setShowDeleteDialog} workflowName={workflowName}
      workflowId={workflowId} />
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size="icon">
          <TooltipWrapper content="More Actions">
            <div className='flex items-center justify-center'>
              <MoreVerticalIcon size={16} />
            </div>
          </TooltipWrapper>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            setShowDeleteDialog((prev) => !prev)
          }}
          className="text-destructive flex items-center gap-2 cursor-pointer">
          <TrashIcon size={16} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </>
  );
}
