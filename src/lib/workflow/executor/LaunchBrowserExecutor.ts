import { ExecutionEnvironment } from "@/types/executor";
import { LaunchBrowserTask } from "../tasks/LaunchBrowser";
import * as puppeteer from "puppeteer";
const DEV_MODE = process.env.NODE_ENV === "development";
export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  let browser: puppeteer.Browser | null = null;
  let page: puppeteer.Page | null = null;

  try {
    const URL = environment.getInput("Website url");

    environment.log.info("Starting browser launch...");

    browser = await puppeteer.launch({
      headless: !DEV_MODE,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-software-rasterizer",
        "--disable-gpu",
        "--disable-extensions",
        "--single-process",
        "--no-zygote",
        "--no-first-run",
        "--window-size=1920,1080",
        "--ignore-certificate-errors",
        "--disable-features=site-per-process",
        "--disable-web-security",
      ],
      timeout: 30000,
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
    });

    environment.log.info("Browser launched successfully");
    environment.setBrowser(browser);

    browser.on("disconnected", () => {
      environment.log.error("Browser disconnected unexpectedly");
    });

    environment.log.info("Creating new page...");
    page = await browser.newPage();

    await page.setDefaultNavigationTimeout(30000);
    await page.setDefaultTimeout(30000);

    try {
      environment.log.info(`Attempting to navigate to: ${URL}`);
      await page.goto(URL, {
        waitUntil: ["load", "domcontentloaded", "networkidle0"],
        timeout: 30000,
      });
      environment.log.info(`Successfully navigated to: ${URL}`);
    } catch (navigationError: any) {
      environment.log.error(`Navigation failed: ${navigationError.message}`);
      if (browser) await browser.close();
      return false;
    }

    environment.setPage(page);
    return true;
  } catch (error: any) {
    environment.log.error(`Browser launch failed: ${error.message}`);
    environment.log.error(`Stack trace: ${error.stack}`);

    try {
      if (browser) {
        await browser.close();
      }
    } catch (closeError: any) {
      environment.log.error(`Failed to close browser: ${closeError.message}`);
    }

    return false;
  }
}
