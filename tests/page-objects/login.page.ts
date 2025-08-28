import { Locator } from "@playwright/test";
import { time } from "console";
import { pasteFromClipboard } from "../utility/utils";

export class LoginPage {
  public readonly url = "https://neptun-hweb.sze.hu/hallgato_ng/login";

  constructor(private page) {}

  public get loginForm() {
    return this.page.locator("neptun-login-form");
  }

  public get twoFaForm() {
    return this.page.locator("mat-dialog-container");
  }

  public get emailInput(): Locator {
    return this.loginForm.locator("#userName");
  }

  public get passwordInput() {
    return this.loginForm.locator("#password-form-password");
  }

  public getSubmitButton(form: Locator) {
    return form.locator("#login-button");
  }

  public async login(username: string, password: string) {
    await this.page.goto(this.url);
    await this.emailInput.waitFor({ state: "visible", timeout: 5000 });
    await this.emailInput.fill(username, { timeout: 5000, force: true });
    await this.passwordInput.fill(password);
    await this.getSubmitButton(this.loginForm).click();
    await this.twoFaForm.waitFor({ state: "visible", timeout: 5000 });
  }

  public async submit2FA() {
    pasteFromClipboard(
      this.page,
      this.twoFaForm.locator("#two-factor-qr-code-input-form-input")
    );
    await this.getSubmitButton(this.twoFaForm).click();
  }
}
