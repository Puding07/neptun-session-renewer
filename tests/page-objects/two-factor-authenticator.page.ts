import { BrowserContext, Page } from "@playwright/test";

export class TwoFactorAuthenticatorPage {
  constructor(private readonly page: Page, private readonly url: string) {}

  private get base() {
    return this.page.locator(".theme-normal");
  }

  private get code() {
    return this.base.locator(".code");
  }

  private get editButton() {
    return this.base.locator("#i-edit");
  }

  private get plusButton() {
    return this.base.locator("#i-plus");
  }

  private get manualEntryButton() {
    return this.base.locator('button:has-text("Manual Entry")');
  }

  private get infoContainer() {
    return this.base.locator("#infoContent");
  }

  private get issuerInput() {
    return this.page.locator("#infoContent > div:nth-of-type(1) input");
  }

  private get secretInput() {
    return this.page.locator("#infoContent > div:nth-of-type(2) input");
  }

  private get submitButton() {
    return this.infoContainer.locator("button");
  }

  public async getCode(issuer: string, secret: string): Promise<void> {
    await this.page.goto(this.url);
    await this.base.waitFor({ state: "visible", timeout: 5000 });
    if (!(await this.code.isVisible())) {
      this.addAccount(issuer, secret);
    }
    await this.code.click();
    await this.page.waitForTimeout(2000);
  }

  public async addAccount(issuer: string, secret: string): Promise<void> {
    await this.editButton.click();
    await this.page.waitForTimeout(5000);
    await this.plusButton.click();
    await this.manualEntryButton.click();
    await this.issuerInput.fill(issuer);
    await this.secretInput.fill(secret);
    await this.submitButton.click();
    await this.page.waitForTimeout(2000);
  }
}

export const get2FACode = async (
  page: Page,
  parameters: { params?: { [key: string]: any } }
): Promise<void> => {
  if (
    parameters?.params?.issuer &&
    parameters?.params?.secret &&
    parameters?.params?.extensionId
  ) {
    const twoFaPage = new TwoFactorAuthenticatorPage(
      page,
      `chrome-extension://${parameters.params.extensionId}/view/popup.html`
    );
    await twoFaPage.getCode(parameters.params.issuer, parameters.params.secret);
  }
};
