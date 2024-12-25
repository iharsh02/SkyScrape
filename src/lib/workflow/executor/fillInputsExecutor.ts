import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "../tasks/fillInputs";

export async function FillInputExecutor(
  environment: ExecutionEnvironment<typeof FillInputTask>,
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Input selector not defined");
    }

    const value = environment.getInput("value");
    if (!value) {
      environment.log.error("Input Value is not defined");
    }
    await environment.getPage()!.type(selector, value);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
