import { ExecutionEnvironment } from "@/types/executor";
import { NavigateUrlTask } from "../tasks/NavigateUrlTask";

export async function NavigateUrlExecutor(
  environment: ExecutionEnvironment<typeof NavigateUrlTask>,
): Promise<boolean> {
  try {
    const URL = environment.getInput("Website url");

    if (!URL) {
      environment.log.error(`Input URL is not defined`);
      return false;
    }

    await environment.getPage()!.goto(URL);

    environment.log.info(`Opened page at : ${URL}`);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
