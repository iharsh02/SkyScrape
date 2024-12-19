'use client';

import UnpublishWorkflow from '@/actions/workflows/unpublishWorkflow';
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query';
import { DownloadIcon } from 'lucide-react';
import { toast } from 'sonner';

export const UnPublishBtn = ({ workflowId }: { workflowId: string }) => {
  const mutation = useMutation({
    mutationFn: UnpublishWorkflow,
    onSuccess: () => {
      toast.success("workflow unpublished", { id: workflowId });
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
        toast.loading("Unpublishing workflow....", { id: workflowId })
        mutation.mutate(workflowId)
      }}
    >
      <DownloadIcon size={16} className='stroke-destructive' />
      Unpublish
    </Button>
  )
}

