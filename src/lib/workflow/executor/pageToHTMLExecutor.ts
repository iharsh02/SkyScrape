import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtmlTask } from "../tasks/pageToHtml";

export async function PageToHTMLExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>,
): Promise<boolean> {
  try {
    const HTML = await environment.getPage()!.content();
    environment.setOutput("HTML", HTML);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
