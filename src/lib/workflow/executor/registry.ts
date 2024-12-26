import { TaskType } from "@/types/taskType";
import { ExtractTextFromElementExecutor } from "./ExtractTextFromElement";
import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { PageToHTMLExecutor } from "./pageToHTMLExecutor";
import { ExecutionEnvironment } from "@/types/executor";
import { WorkflowTask } from "@/types/workflow";
import { FillInputExecutor } from "./fillInputsExecutor";
import { ClickElementExecutor } from "./ClickElementExecutor";
import { WaitForTaskExecutor } from "./WaitForElemetExecutor";
import { DeliverViaWebhookExecutor } from "./DeliverViaWebhookExecutor";

type ExecutorFn<T extends WorkflowTask> = (
  Environment: ExecutionEnvironment<T>,
) => Promise<boolean>;

type RegistryType = {
  [k in TaskType]: ExecutorFn<WorkflowTask & { type: k }>;
};

export const ExecutorRegistry: RegistryType = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHTMLExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
  FILL_INPUT: FillInputExecutor,
  CLICK_ELEMENT: ClickElementExecutor,
  WAIT_FOR_ELEMENT: WaitForTaskExecutor,
  DELIVER_VIA_WEBHOOK: DeliverViaWebhookExecutor,
};
