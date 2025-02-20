import { TaskType } from "@/types/taskType";
import { ExtractTextFromElement } from "./ExtractTextFromElement";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { PageToHtmlTask } from "./pageToHtml";
import { WorkflowTask } from "@/types/workflow";
import { FillInputTask } from "./fillInputs";
import { ClickElementTask } from "./ClickElementTask";
import { WaitForElementTask } from "./WaitForElementTask";
import { DeliverViaWebbhookTask } from "./DeliverViaWebhookTask";
import { ExtractDataWithAITask } from "./ExtractDataWithAI";
import { ReadPropertyFromJSONTask } from "./ReadPropertryFromJSONTask";
import { AddPropertyToJsonTask } from "./AddPropertyToJsonTask"
import { NavigateUrlTask } from "./NavigateUrlTask"
import { ScrollToElementTask } from "./ScrollToElementTask";
type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElement,
  FILL_INPUT: FillInputTask,
  CLICK_ELEMENT: ClickElementTask,
  WAIT_FOR_ELEMENT: WaitForElementTask,
  DELIVER_VIA_WEBHOOK: DeliverViaWebbhookTask,
  EXTRACT_DATA_WITH_AI: ExtractDataWithAITask,
  READ_PROPERTY_FROM_JSON: ReadPropertyFromJSONTask,
  ADD_PROPERTY_TO_JSON: AddPropertyToJsonTask,
  NAVIGATE_URL: NavigateUrlTask,
  SCROLL_TO_ELEMENT: ScrollToElementTask
};
