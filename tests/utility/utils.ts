import { BrowserContext, Page } from "@playwright/test";

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
  return clipBoardText;
};
