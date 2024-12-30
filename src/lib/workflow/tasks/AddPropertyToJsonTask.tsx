import { TaskParamType, TaskType } from "@/types/taskType";
import { WorkflowTask } from "@/types/workflow";
import { DatabaseIcon, LucideProps } from "lucide-react";

export const AddPropertyToJsonTask = {
  label: "Add property from JSON",
  icon: (props: LucideProps) => {
    return <DatabaseIcon className="dark:stroke-white" {...props} />
  },
  type: TaskType.ADD_PROPERTY_TO_JSON,
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

    {
      name: 'Property value',
      type: TaskParamType.STRING,
      required: true,
    },


  ] as const,
  outputs: [
    {
      name: 'Updated JSON',
      type: TaskParamType.STRING
    },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
