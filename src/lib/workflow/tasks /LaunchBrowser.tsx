import { TaskParamType, TaskType } from "@/types/taskType";
import { GlobeIcon, LucideProps } from "lucide-react";

export const LaunchBrowserTask = {
  types: TaskType.LAUNCH_BROWSER,
  label: "Launch Browser",
  icon: (props: LucideProps) => {
    return <GlobeIcon className="stroke-pink-400" {...props} />
  },
  isEntryPoint: true,
  inputs: [
    {
      name: 'Website url',
      type: TaskParamType.STRING,
      helperText: "eg : https://google.com",
      required: true,
      hideHandel: true
    },
  ]
}
