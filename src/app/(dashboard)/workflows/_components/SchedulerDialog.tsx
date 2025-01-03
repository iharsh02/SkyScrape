"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ClockIcon, AlertTriangle, Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UpdateWorkflowCron } from "@/actions/workflows/updateWorkflowCrons";
import cronstrue from "cronstrue";

const ScheduleType = z.enum(["everyMinute", "hourly", "daily", "weekly", "monthly"]);
type ScheduleType = z.infer<typeof ScheduleType>;

const scheduleSchema = z.object({
  scheduleType: ScheduleType
});

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

interface SchedulerDialogProps {
  workflowId: string;
  cron: string | null;
}

const CRON_MAP: Record<ScheduleType, string> = {
  everyMinute: "* * * * *",
  hourly: "0 * * * *",
  daily: "0 0 * * *",
  weekly: "0 0 * * 0",
  monthly: "0 0 1 * *"
};

const CRON_TO_TYPE: Record<string, ScheduleType> = Object.entries(CRON_MAP)
  .reduce((acc, [key, value]) => ({ ...acc, [value]: key as ScheduleType }), {});

export function SchedulerDialog({ workflowId, cron }: SchedulerDialogProps) {
  const [open, setOpen] = useState(false);

  const getCronFromScheduleType = (type: ScheduleType): string => {
    return CRON_MAP[type];
  };

  const getScheduleTypeFromCron = (cron: string | null): ScheduleType => {
    if (!cron) return "everyMinute";
    return CRON_TO_TYPE[cron] || "everyMinute";
  };

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      scheduleType: getScheduleTypeFromCron(cron)
    }
  });

  const readableCron = cron ? cronstrue.toString(cron) : null;
  const validCron = !!cron;

  const mutation = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success("Schedule updated successfully");
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to update schedule");
    },
  });

  const onSubmit = useCallback(
    (values: ScheduleFormValues) => {
      const cronValue = getCronFromScheduleType(values.scheduleType);
      mutation.mutate({
        id: workflowId,
        cron: cronValue,
      });
    },
    [mutation, workflowId]
  );

  const removeCron = useCallback(() => {
    mutation.mutate({
      id: workflowId,
      cron: "",
    });
  }, [mutation, workflowId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={cn("text-sm")}>
          {validCron ? (
            <div className="flex items-center gap-1 text-green-500">
              <ClockIcon className="h-4 w-4" />
              {readableCron}
            </div>
          ) : (
            <div className="flex items-center gap-1 text-orange-500">
              <AlertTriangle className="h-4 w-4" />
              Set schedule
            </div>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <div className="space-y-6">
          <div className="space-y-2">
            <DialogTitle className="text-xl font-semibold">
              Schedule Workflow
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Choose how often this workflow should run
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="scheduleType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="everyMinute" />
                          </FormControl>
                          <FormLabel className="font-normal">Every minute</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="hourly" />
                          </FormControl>
                          <FormLabel className="font-normal">Hourly</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="daily" />
                          </FormControl>
                          <FormLabel className="font-normal">Daily</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="weekly" />
                          </FormControl>
                          <FormLabel className="font-normal">Weekly</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="monthly" />
                          </FormControl>
                          <FormLabel className="font-normal">Monthly</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex-1"
                >
                  {mutation.isPending ? "Saving..." : "Save Schedule"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={removeCron}
                  disabled={mutation.isPending || !validCron}
                  className="flex-none"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
