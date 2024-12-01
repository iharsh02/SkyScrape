"use client";

import UpdateWorkflow from "@/actions/workflows/updateWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";

export const SaveBtn = ({ workFlowId }: { workFlowId: string }) => {
  const { toObject } = useReactFlow();
  const saveMutation = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => {
      toast.success("Flow saved successfully ", { id: "save-workflow" })
    },
    onError: () => {
      toast.error("Something went wrong", { id: "save-workflow" })
    },
  });
  return (
    <Button
      disabled={saveMutation.isPending}
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const workflowDefination = JSON.stringify(toObject())
        toast.loading("Saving workflow", { id: "save-workflow" })
        saveMutation.mutate({
          id: workFlowId,
          definition: workflowDefination,
        })
      }}
    >Save</Button>
  )
}

