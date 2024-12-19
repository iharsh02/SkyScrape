'use client';

import PublishWorkflow from '@/actions/workflows/PublishWorkflow';
import useExecutionPlan from '@/components/hooks/useExecutionPlan';
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { UploadIcon } from 'lucide-react';
import { toast } from 'sonner';

export const PublishBtn = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const mutation = useMutation({
    mutationFn: PublishWorkflow,
    onSuccess: () => {
      toast.success("workflow pulished", { id: workflowId });
    },
    onError: () => {
      toast.error("Somthing went wrong", { id: workflowId });
    }
  })
  return (
    <Button
      variant={"outline"}
      className='flex items-center gap-2'
      onClick={() => {
        const plan = generate();
        if (!plan) {
          return;
        }
        toast.loading("Publishing workflow....", { id: workflowId })
        mutation.mutate({
          id: workflowId,
          flowDefinition: JSON.stringify(toObject()),
        })
      }}
    >
      <UploadIcon size={16} className='stroke-blue-500' />
      Publish
    </Button>
  )
}

