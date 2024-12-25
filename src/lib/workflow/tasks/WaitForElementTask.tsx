import { TaskParamType, TaskType } from "@/types/taskType";
import { WorkflowTask } from "@/types/workflow";
import { EyeIcon, LucideProps } from "lucide-react";

export const WaitForElementTask = {
  label: "Wait for Element Task",
  icon: (props: LucideProps) => {
    return <EyeIcon className="stroke-orange-400" {...props} />
  },
  type: TaskType.WAIT_FOR_ELEMENT,
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
    {
      name: 'Visibility',
      type: TaskParamType.SELECT,
      required: true,
      hideHandel: true,
      options: [{
        label: "Visible", value: "visible"
      },
      {
        label: "Hidden", value: "hidden"
      }]
    },


  ] as const,
  outputs: [
    {
      name: 'Web page',
      type: TaskParamType.BROWSER_INSTANCE
    },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
