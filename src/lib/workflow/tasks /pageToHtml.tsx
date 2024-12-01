import { TaskParamType, TaskType } from "@/types/taskType";
import { CodeIcon, LucideProps } from "lucide-react";

export const PageToHtmlTask = {
  types: TaskType.PAGE_TO_HTML,
  label: "Get HTML form the page",
  icon: (props: LucideProps) => {
    return <CodeIcon className="stroke-rose-400" {...props} />
  },
  isEntryPoint: false,
  inputs: [
    {
      name: 'web page',
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
    },
  ]
}
