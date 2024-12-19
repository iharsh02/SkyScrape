import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../tasks/LaunchBrowser";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>,
): Promise<boolean> {
  try {
    const URL = environment.getInput("Website url");
    const browser = await puppeteer.launch({
      headless: true,
    });
    environment.log.info("Browser started successfully");
    environment.setBrowser(browser);
    const page = await browser.newPage();
    await page.goto(URL);
    environment.setPage(page);
    environment.log.info(`Opened page at : ${URL}`);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
