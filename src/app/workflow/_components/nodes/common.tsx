import { TaskParamType } from "@/types/taskType";
import { Record } from "@prisma/client/runtime/library";

export const ColorForHandel: Record<TaskParamType, string> = {
  BROWSER_INSTANCE: "!bg-sky-400",
  STRING: "!bg-amber-400"

}
