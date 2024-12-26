import { TaskParamType, TaskType } from "@/types/taskType";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, SendIcon } from "lucide-react";

export const DeliverViaWebbhookTask = {
  label: "Deliver Via Webhook",
  icon: (props: LucideProps) => {
    return <SendIcon className="dark:stroke-white" {...props} />
  },
  type: TaskType.DELIVER_VIA_WEBHOOK,
  isEntryPoint: false,
  inputs: [
    {
      name: 'URL',
      type: TaskParamType.STRING,
      required: true,
      varient: "textarea"
    },
    {
      name: 'Body',
      type: TaskParamType.STRING,
      required: true,
    },

  ] as const,
  outputs: [] as const,
  credits: 1,
} satisfies WorkflowTask;
