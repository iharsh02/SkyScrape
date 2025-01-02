import deleteWorkflow from "@/actions/workflows/deleteWorkflow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteWorkflowDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  workflowName: string;
  workflowId: string;
}

export function DeleteWorkflowDialog({
  open,
  setOpen,
  workflowName,
  workflowId,
}: DeleteWorkflowDialogProps) {

  const deleteMutation = useMutation({
    mutationFn: () => deleteWorkflow({ id: workflowId }),
    onSuccess: () => {
      toast.success("Workflow deleted successfully", { id: workflowId });
      setOpen(false);
    },
    onError: () => {
      toast.error(`Failed to delete workflow`, { id: workflowId });
    },
  });

  const handleDelete = () => {
    toast.loading("Deleting workflow...", { id: workflowId });
    deleteMutation.mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the workflow{" "}
            <span className="font-medium text-destructive">{workflowName}</span>{" "}
            and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


