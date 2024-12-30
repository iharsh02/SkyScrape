import { ExecutionEnvironment } from "@/types/executor";
import { ReadPropertyFromJSONTask } from "../tasks/ReadPropertryFromJSONTask";

export async function readPropertyFromJSONExecutor(
  environment: ExecutionEnvironment<typeof ReadPropertyFromJSONTask>,
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

    let json;
    try {
      json = JSON.parse(jsonData);
    } catch (parseError) {
      environment.log.error("Invalid JSON format");
      return false;
    }

    if (!(propertyName in json)) {
      environment.log.error("Property not found");
      return false;
    }

    const propertyValue = json[propertyName];
    environment.setOutput("Property value", propertyValue);
    return true;
  } catch (error: any) {
    environment.log.error(error?.message || "An unknown error occurred");
    return false;
  }
}
