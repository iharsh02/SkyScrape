import { TaskParamType, TaskType } from "@/types/taskType";
import { WorkflowTask } from "@/types/workflow";
import { CodeIcon, LucideProps } from "lucide-react";

export const PageToHtmlTask = {
  label: "Get HTML form the page",
  icon: (props: LucideProps) => {
    return <CodeIcon className="stroke-rose-400" {...props} />
  },
  type: TaskType.PAGE_TO_HTML,
  isEntryPoint: false,
  inputs: [
    {
      name: 'web page',
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: 'HTML',
      type: TaskParamType.STRING
    },
    {
      name: 'web page',
      type: TaskParamType.BROWSER_INSTANCE,
    }
  ] as const,
  credits: 2,
} satisfies WorkflowTask;
