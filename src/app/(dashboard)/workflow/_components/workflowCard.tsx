"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileTextIcon, PlayIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Workflow } from '@prisma/client';

const WorkflowStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED"
};

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
    <Link href={`/workflow/editor/${workflow.id}`}>
      <Card className="cursor-pointer">
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
                  <p className="ml-3 text-sm text-gray-500 dark:text-gray-400 truncate">
                    {workflow.description}
                  </p>
                )}
              </div>
            </div>

            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default WorkflowCard;
