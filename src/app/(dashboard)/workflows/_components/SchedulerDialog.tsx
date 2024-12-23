"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { CalendarIcon, AlertTriangle, ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomDialogHeader } from "@/components/global/CustomDialogHeader";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpdateWorkflowCron } from "@/actions/workflows/updateWorkflowCrons";
import { useMemo, useState } from "react";
import cronstrue from "cronstrue";
import parser from "cron-parser";

export function SchedulerDialog(props: { workflowId: string; cron: string | null }) {
  const [cron, setCron] = useState(props.cron || "");
  const [validCron, setValidCron] = useState(false);
  const [readableCron, setReadableCron] = useState<string | null>(props.cron || null);

  const mutation = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success("Schedule updated successfully", { id: "cron" });
    },
    onError: () => {
      toast.error("Something went wrong", { id: "cron" });
    },
  });

  useMemo(() => {
    if (cron.trim() === "") {
      setValidCron(false);
      setReadableCron(null);
      return;
    }
    try {
      parser.parseExpression(cron);
      const userCronStr = cronstrue.toString(cron);
      setValidCron(true);
      setReadableCron(userCronStr);
    } catch {
      setValidCron(false);
      setReadableCron(null);
    }
  }, [cron]);

  const handleSave = () => {
    toast.loading("Saving...", { id: "cron" });
    mutation.mutate({
      id: props.workflowId,
      cron,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className={cn("text-sm p-0 h-auto")}>
          {validCron ? (
            <div className="flex items-center gap-1 text-green-500">
              <ClockIcon />
              {readableCron}
            </div>
          ) : (
            <div className="flex items-center gap-1 text-orange-500">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Set schedule
            </div>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="px-0">
        <CustomDialogHeader title="Schedule Workflow Execution" icon={CalendarIcon} />

        <div className="p-6 space-y-4">
          <p className="text-muted-foreground text-sm">
            Specify a cron expression to schedule Workflow execution
          </p>
          <Input
            value={cron}
            placeholder="E.g. * * * * *"
            onChange={(e) => setCron(e.target.value)}
          />
          <div
            className={cn(
              "rounded-md p-4 border text-sm",
              validCron
                ? "border-green-500 text-green-500"
                : "border-destructive text-destructive"
            )}
          >
            {validCron ? readableCron : "Not a valid cron expression"}
          </div>
        </div>

        <DialogFooter className="px-6 gap-2">
          <DialogClose asChild>
            <Button className="w-full" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="w-full"
            disabled={mutation.isPending || !validCron}
            onClick={handleSave}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

