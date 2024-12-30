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
import { extractDataWithAIExecutor } from "./ExtractDataWithAIExecutor";
import { readPropertyFromJSONExecutor } from "./ReadPropertyFromJSONExecutor";
import { AddPropertyToJsonExecutor } from "./AddPropetyToJsonExecutor";
import { NavigateUrlExecutor } from "./NavigateUrlExecutor";
import { ScrollToElementExecutor } from "./ScrollToElementExecutor";

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
  EXTRACT_DATA_WITH_AI: extractDataWithAIExecutor,
  READ_PROPERTY_FROM_JSON: readPropertyFromJSONExecutor,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonExecutor,
  NAVIGATE_URL: NavigateUrlExecutor,
  SCROLL_TO_ELEMENT: ScrollToElementExecutor,
};
