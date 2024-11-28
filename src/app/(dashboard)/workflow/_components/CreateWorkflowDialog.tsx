'use client';

import { CustomDialogHeader } from "@/components/global/CustomDialogHeader"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Layers2Icon } from "lucide-react"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflow"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import CreateWorkflow from "@/actions/workflows/createWorkflow";
import { toast } from "sonner";
import { useCallback } from "react";
export function CreateWorkflowDialog() {
  const form = useForm<createWorkflowSchemaType>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: {}
  })

  const { mutate, isPending } = useMutation(
    {
      mutationFn: CreateWorkflow,
      onSuccess: () => {
        toast.success("workflow created", { id: "create-workflow" })
      },
      onError: () => {
        toast.error("Failed to create workflow ", { id: "create-workflow" })
      },
    }
  )


  const onSubmit = useCallback((value: createWorkflowSchemaType) => {
    toast.loading("Creating workflow...", { id: "create-workflow" })
    mutate(value);
  }, [mutate])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-400 hover:text-white">
          Create Workflow
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <CustomDialogHeader
          icon={Layers2Icon}
          title="Create workflow"
          subTitle="Start building your workflow"
        />

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input  {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a name for your workflow
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea  {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide the brief description of what your workflow does.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full bg-blue-500 hover:bg-blue-400 dark:text-white">Proceed</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

