import { BrowserContext, Locator, Page } from "@playwright/test";

export const runStepsInNewTab = async (
  context: BrowserContext,
  steps: (
    page: Page,
    parameters: { params?: { [key: string]: any }; context?: BrowserContext }
  ) => Promise<void>,
  params?: { [key: string]: any }
) => {
  const page = await context.newPage();
  try {
    await steps(page, { context, params });
  } finally {
    await page.close();
  }
};

export const getClipBoardText = async (page: Page): Promise<string> => {
  let clipBoardText = "";
  page.evaluate(() =>
    navigator.clipboard.readText().then((text) => (clipBoardText = text))
  );
  console.log("Clipboard text:", clipBoardText);
  return clipBoardText;
};

export const pasteFromClipboard = async (
  page: Page,
  inputLocator: Locator
): Promise<void> => {
  await inputLocator.focus();

  // await page.keyboard.press(`Meta+KeyV`);
  await page.keyboard.press(`Control+KeyV`);
};
