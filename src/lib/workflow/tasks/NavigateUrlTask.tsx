import { TaskParamType, TaskType } from "@/types/taskType";
import { WorkflowTask } from "@/types/workflow";
import { GlobeIcon, LucideProps } from "lucide-react";

export const NavigateUrlTask = {
  label: "NavigateUrlTask",
  icon: (props: LucideProps) => {
    return <GlobeIcon className="dark:stroke-white" {...props} />;
  },
  type: TaskType.NAVIGATE_URL,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
    },
    {
      name: 'Website url',
      type: TaskParamType.STRING,
      helperText: "eg : https://google.com",
      required: true,
      hideHandel: true
    },
  ] as const,
  outputs: [
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
    }
  ] as const,
} satisfies WorkflowTask;
