import { TaskType } from "@/types/taskType";
import { ExtractTextFromElement } from "./ExtractTextFromElement";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHtmlTask } from "./pageToHtml";
import { WorkflowTask } from "@/types/workflow";

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElement
};
