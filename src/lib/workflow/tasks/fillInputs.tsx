import { TaskParamType, TaskType } from "@/types/taskType";
import { WorkflowTask } from "@/types/workflow";
import { Edit3Icon, LucideProps } from "lucide-react";

export const FillInputTask = {
  label: "Fill Input",
  icon: (props: LucideProps) => {
    return <Edit3Icon className="stroke-orange-400" {...props} />
  },
  type: TaskType.FILL_INPUT,
  isEntryPoint: false,
  inputs: [
    {
      name: 'web page',
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
    {
      name: 'Selector',
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: 'value',
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: 'web page',
      type: TaskParamType.BROWSER_INSTANCE,
    }
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
