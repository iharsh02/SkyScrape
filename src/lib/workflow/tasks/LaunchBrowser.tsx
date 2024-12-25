import { TaskParamType, TaskType } from "@/types/taskType";
import { WorkflowTask } from "@/types/workflow";
import { GlobeIcon, LucideProps } from "lucide-react";

export const LaunchBrowserTask = {
  label: "Launch Browser",
  icon: (props: LucideProps) => {
    return <GlobeIcon className="stroke-orange-400" {...props} />;
  },
  type: TaskType.LAUNCH_BROWSER,
  isEntryPoint: true,
  credits: 5,
  inputs: [
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
