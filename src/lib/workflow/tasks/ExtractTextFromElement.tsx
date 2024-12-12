import { TaskParamType, TaskType } from "@/types/taskType";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, TextIcon } from "lucide-react";

export const ExtractTextFromElement = {
  label: "Extract text from Element",
  icon: (props: LucideProps) => {
    return <TextIcon className="stroke-rose-400" {...props} />
  },
  type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
  isEntryPoint: false,
  inputs: [
    {
      name: 'HTML',
      type: TaskParamType.STRING,
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
      name: 'Extracted text',
      type: TaskParamType.STRING
    },
  ] as const,
  credits: 2,
} satisfies WorkflowTask;
