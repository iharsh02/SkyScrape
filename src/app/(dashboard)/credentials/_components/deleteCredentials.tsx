"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import deleteCredentials from "@/actions/credentials/deleteCredentials";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";

interface DeleteCredentialsProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  credentialId: string;
  credentialName : string;
}

export function DeleteCredentials({ open, setOpen, credentialName, credentialId }: DeleteCredentialsProps) {
  const [confirmText, setConfirmText] = useState("");

  const deleteMutation = useMutation({
    mutationFn: () => deleteCredentials({ id: credentialId }),
    onSuccess: () => {
      toast.success("Credential deleted successfully");
      setConfirmText("");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to delete credential: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
    onSettled: () => {
      toast.dismiss(credentialId);
    }
  });

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (confirmText !== credentialName) {
      toast.error("Credential name doesn't match");
      return;
    }
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
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            To confirm, please enter the credential name below.
          </div>
          <Input
            placeholder={credentialName}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="text-destructive"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
            disabled={confirmText !== credentialName || deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}


