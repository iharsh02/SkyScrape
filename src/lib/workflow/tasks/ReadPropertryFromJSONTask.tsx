import { TaskParamType, TaskType } from "@/types/taskType";
import { WorkflowTask } from "@/types/workflow";
import { FileIcon, LucideProps } from "lucide-react";

export const ReadPropertyFromJSONTask = {
  label: "Read property from JSON",
  icon: (props: LucideProps) => {
    return <FileIcon className="dark:stroke-white" {...props} />
  },
  type: TaskType.READ_PROPERTY_FROM_JSON,
  isEntryPoint: false,
  inputs: [
    {
      name: 'JSON',
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: 'Property name',
      type: TaskParamType.STRING,
      required: true,
    },

  ] as const,
  outputs: [
    {
      name: 'Property value',
      type: TaskParamType.STRING
    },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
