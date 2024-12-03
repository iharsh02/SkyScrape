import { TaskParamType, TaskType } from "@/types/taskType";
import { LucideProps, TextIcon } from "lucide-react";

export const ExtractTextFromElement = {
  types: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
  label: "Extract text from Element",
  icon: (props: LucideProps) => {
    return <TextIcon className="stroke-rose-400" {...props} />
  },
  isEntryPoint: false,
  inputs: [
    {
      name: 'HTML',
      type: TaskParamType.STRING,
      required: true,
      varient : "textarea"
    },
    {
      name: 'Selector',
      type: TaskParamType.STRING,
      required: true,
    },

  ],
  outputs: [
    {
      name: 'Extracted text',
      type: TaskParamType.STRING
    },
  ]
}
