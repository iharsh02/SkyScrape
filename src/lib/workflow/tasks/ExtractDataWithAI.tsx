import { TaskParamType, TaskType } from "@/types/taskType";
import { WorkflowTask } from "@/types/workflow";
import { BrainIcon, LucideProps } from "lucide-react";

export const ExtractDataWithAITask = {
  label: "Extract data with AI",
  icon: (props: LucideProps) => {
    return <BrainIcon className="dark:stroke-white" {...props} />
  },
  type: TaskType.EXTRACT_DATA_WITH_AI,
  isEntryPoint: false,
  inputs: [
    {
      name: 'Content',
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: 'Credentials',
      type: TaskParamType.CREDENTIALS,
      required: true,
    },
    {
      name: 'Prompt',
      type: TaskParamType.STRING,
      required: true,
      varient: "textarea"
    },

  ] as const,
  outputs: [
    {
      name: 'Extracted Data',
      type: TaskParamType.STRING
    },
  ] as const,
  credits: 4,
} satisfies WorkflowTask;
