"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { createCredentialsSchema, createCredentialsSchemaType } from "@/schema/credentails";
import createCredentials from "@/actions/credentials/CreateCredentials";

export function CreateCredentialsDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<createCredentialsSchemaType>({
    resolver: zodResolver(createCredentialsSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createCredentials,
    onSuccess: () => {
      toast.success("Credential created successfully");
      form.reset();
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to create credential");
    },
  });

  const onSubmit = useCallback(
    (values: createCredentialsSchemaType) => {
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          Create Credential
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="space-y-6">
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold">
              Create Credential
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Add a new credential to use in your workflows
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credential Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., OpenAI API Key"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a unique name for your credential. This name will be used to identify the credential in your workflows.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credential Value</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your credential value here"
                        className="resize-none h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the credential value (e.g., API key, access token). This value will be securely encrypted and stored.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isPending}
                className="w-full mt-6"
              >
                {isPending ? "Creating..." : "Create Credential"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}


