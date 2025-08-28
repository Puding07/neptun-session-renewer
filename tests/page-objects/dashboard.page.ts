import { Locator } from "@playwright/test";

export class DashboardPage {
  public readonly url = "https://neptun-hweb.sze.hu/hallgato_ng/dashboard";

  constructor(private page) {}

  public get menuButton() {
    return this.page.locator(
      "button[id='menu-btn']:has-text('Menü'):nth-of-type(1)"
    );
  }

  public get homeButton() {
    return this.page.locator("a:has-text('Kezdőoldal')");
  }

  public get calendarButton() {
    return this.page.locator("a:has-text('Naptár')");
  }

  public get headerTitle() {
    return this.page.locator("h3[class='header__title']");
  }

  public get calendarTitle() {
    return this.page.locator("h1[class='break-text-with-hyphen']");
  }

  public get subjectRegister(): Locator {
    return this.page.locator(
      "h3[class='header__middle-title']:has-text('Tárgyfelvétel')"
    );
  }

  public async navigateTo() {
    if (await this.calendarTitle.isVisible()) {
      await this.navigateToHome();
    } else {
      await this.navigateToCalendar();
    }
  }

  public async navigateToCalendar() {
    await this.menuButton.click();
    await this.calendarButton.click();
    await this.calendarTitle.waitFor({ state: "visible", timeout: 5000 });
    await this.page.waitForTimeout(6000);
  }

  public async navigateToHome() {
    await this.menuButton.click();
    await this.homeButton.click();
    await this.headerTitle.waitFor({ state: "visible", timeout: 5000 });
    await this.page.waitForTimeout(6000);
  }
}
