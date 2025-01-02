import { TaskParamType, TaskType } from "@/types/taskType";
import { WorkflowTask } from "@/types/workflow";
import { ArrowUpIcon, LucideProps } from "lucide-react";

export const ScrollToElementTask = {
  label: "Scroll to element",
  icon: (props: LucideProps) => {
    return <ArrowUpIcon className="dark:stroke-white" {...props} />;
  },
  type: TaskType.SCROLL_TO_ELEMENT,
  isEntryPoint: false,
  credits: 1,
  inputs: [
    {
      name: 'Web Page',
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true
    }
  ] as const,
  outputs: [
    {
      name: "Web Page",
      type: TaskParamType.BROWSER_INSTANCE,
    }
  ] as const,
} satisfies WorkflowTask;
