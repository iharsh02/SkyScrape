import { ExecutionEnvironment } from "@/types/executor";
import { DeliverViaWebbhookTask } from "../tasks/DeliverViaWebhookTask";

export async function DeliverViaWebhookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebbhookTask>,
): Promise<boolean> {
  try {
    const URL = environment.getInput("URL");
    if (!URL) {
      environment.log.error("Input URL not defined");
    }

    const Body = environment.getInput("Body");
    if (!Body) {
      environment.log.error("Input Body not defined");
    }

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Body),
    });

    const statusCode = response.status;
    if (statusCode != 200) {
      environment.log.error(`status code  : ${statusCode}`);
      return false;
    }

    const responseBody = await response.json();
    environment.log.info(JSON.stringify(responseBody, null, 4));
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
