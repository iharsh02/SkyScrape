import { ExecutionEnvironment } from "@/types/executor";
import { WaitForElementTask } from "../tasks/WaitForElementTask";

export async function WaitForTaskExecutor(
  environment: ExecutionEnvironment<typeof WaitForElementTask>,
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("Input selector not defined");
    }
    
    const visibility = environment.getInput("Visibility");
    if(!visibility){
      environment.log.error("Input->Visibility not defined")
    }


    await environment.getPage()!.waitForSelector(selector , {
      visible : visibility === "visible",
      hidden : visibility === "hidden"
    });

    environment.log.info(`@Element ${selector} became : ${visibility}`)
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
