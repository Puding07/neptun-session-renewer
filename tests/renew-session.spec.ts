import { test, chromium, BrowserContext } from "@playwright/test";
import { LoginPage } from "./page-objects/login.page";
import { get2FACode } from "./page-objects/two-factor-authenticator.page";
import { getClipBoardText, runStepsInNewTab } from "./utility/utils";
import * as dotenv from "dotenv";

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
    // await expect(page).toHaveURL(/dashboard/);
  });

  // test("renew session by navigating", async ({ page }) => {});
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
  await page.waitForTimeout(70000);
  const loginPage = new LoginPage(page);
  await loginPage.submit2FA(await getClipBoardText(page));
  await loginPage.login(user, password);
};
