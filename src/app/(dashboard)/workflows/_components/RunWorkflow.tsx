'use client';

import RunWorkflow from '@/actions/workflows/runWorkflow';
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query';
import { PlayIcon } from 'lucide-react';
import { toast } from 'sonner';

export const RunBtn = ({ workflowId }: { workflowId: string }) => {
  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success("Execution started", { id: "flow-execution" });
    },
    onError: () => {
      toast.error("Something went wrong", { id: "flow-execution" });
    }
  })
  return (
    <Button
      variant={"outline"}
      className='flex items-center gap-2'
      onClick={() => {
        toast.loading("Scheduling run....", { id: "flow-execution" })
        mutation.mutate({
          workflowId
        })
      }}
    >
      <PlayIcon size={16} className='stroke-orange-400' />
      Run
    </Button>
  )
}

