import { TaskParamType, TaskType } from "@/types/taskType";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, MousePointerClick } from "lucide-react";

export const ClickElementTask = {
  label: "Mouse Click",
  icon: (props: LucideProps) => {
    return <MousePointerClick className="dark:stroke-white" {...props} />
  },
  type: TaskType.CLICK_ELEMENT,
  isEntryPoint: false,
  inputs: [
    {
      name: 'web page',
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
      varient: "textarea"
    },
    {
      name: 'Selector',
      type: TaskParamType.STRING,
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
      type: TaskParamType.BROWSER_INSTANCE
    },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
