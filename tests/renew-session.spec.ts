import { test, chromium, BrowserContext, expect } from "@playwright/test";
import { LoginPage } from "./page-objects/login.page";
import { get2FACode } from "./page-objects/two-factor-authenticator.page";
import { getClipBoardText, runStepsInNewTab } from "./utility/utils";
import * as dotenv from "dotenv";
import { DashboardPage } from "./page-objects/dashboard.page";

dotenv.config();

const user = process.env.user || "";
const password = process.env.password || "";
const issuer = process.env.issuer || "";
const secret = process.env.secret || "";
const extensionId = process.env.extensionId || "";

test.describe("Renew session", () => {
  test("login", async () => {
    const pathToExtension = require("path").join(__dirname, "chrome");
    const userDataDir = "user-data-dir";
    const browserContext = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await runStepsInNewTab(browserContext, login);
  });
});

const login = async (
  page,
  parameters: { params?: { [key: string]: any }; context?: BrowserContext }
) => {
  if (!parameters?.context) {
    throw new Error("No context provided");
  }
  await runStepsInNewTab(parameters.context, get2FACode, {
    issuer,
    secret,
    extensionId,
  });
  const loginPage = new LoginPage(page);
  await loginPage.login(user, password);
  await loginPage.submit2FA();
  await expect(page).toHaveURL(/dashboard/);
  const dasboardPage = new DashboardPage(page);
  do {
    await dasboardPage.navigateTo();
  } while (!(await dasboardPage.subjectRegister.isVisible()));
  await page.waitForTimeout(28800000);
};
