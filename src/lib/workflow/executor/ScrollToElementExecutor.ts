import { ExecutionEnvironment } from "@/types/executor";
import { ScrollToElementTask } from "../tasks/ScrollToElementTask";

export async function ScrollToElementExecutor(
  environment: ExecutionEnvironment<typeof ScrollToElementTask>,
): Promise<boolean> {
  try {
    const webPage = environment.getInput("Web Page");
    if (webPage) {
      environment.log.error("Input webPage is not defined");
      return false;
    }

    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error(`Input selector is not defined`);
      return false;
    }

    await environment.getPage()!.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error("element not found");
      }
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top });
    }, selector);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
