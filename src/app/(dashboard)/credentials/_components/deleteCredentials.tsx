import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
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
import deleteCredentials from "@/actions/credentials/deleteCredentials";

interface DeleteCredentialsProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  credentialId: string;
  credentialName: string;
}

export function DeleteCredentials({
  open,
  setOpen,
  credentialName,
  credentialId,
}: DeleteCredentialsProps) {

  const deleteMutation = useMutation({
    mutationFn: () => deleteCredentials({ id: credentialId }),
    onSuccess: () => {
      toast.success("Credential deleted successfully", { id: credentialId })
      setOpen(false);
    },
    onError: () => {
      toast.error(`Failed to delete credential`, { id: credentialId });
    },
  });

  const handleDelete = () => {
    toast.loading("Deleting credential...", { id: credentialId });
    deleteMutation.mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Credential</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the credential{" "}
            <span className="font-medium text-destructive">{credentialName}</span>{" "}
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


