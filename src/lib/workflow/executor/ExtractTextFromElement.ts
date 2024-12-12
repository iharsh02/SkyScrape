import * as cheerio from "cheerio";
import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElement } from "../tasks/ExtractTextFromElement";

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElement>,
): Promise<boolean> {
  try {
    const Selector = environment.getInput("Selector");
    if (!Selector) {
      environment.log.error("Selector not defined");
      return false;
    }

    const html = environment.getInput("HTML");
    if (!html) {
      environment.log.error("HTML not defined");
      return false;
    }

    const $ = cheerio.load(html);
    const element = $(Selector);
    if (!element) {
      environment.log.error("element not found");
      return false;
    }

    const extractedText = $.text(element);

    if (!extractedText) {
      environment.log.error("Element has no text");
      return false;
    }

    environment.setOutput("Extracted text", extractedText);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
