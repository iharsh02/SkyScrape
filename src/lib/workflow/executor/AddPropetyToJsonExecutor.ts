import { ExecutionEnvironment } from "@/types/executor";
import { AddPropertyToJsonTask } from "../tasks/AddPropertyToJsonTask";
export async function AddPropertyToJsonExecutor(
  environment: ExecutionEnvironment<typeof AddPropertyToJsonTask>,
): Promise<boolean> {
  try {
    const jsonData = environment.getInput("JSON");
    if (!jsonData) {
      environment.log.error("Input JSON not defined");
      return false;
    }

    const propertyName = environment.getInput("Property name");
    if (!propertyName) {
      environment.log.error("Input property name is not defined");
      return false;
    }

    const propertyValue = environment.getInput("Property value");
    if (!propertyValue) {
      environment.log.error("Input property value is not defined");
      return false;
    }

    const json = JSON.parse(jsonData);
    json[propertyValue] = propertyValue;

    environment.setOutput("Updated JSON", JSON.stringify(json));
    return true;
  } catch (error: any) {
    environment.log.error(error?.message || "An unknown error occurred");
    return false;
  }
}
