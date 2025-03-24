export class TelegramService {
  private telegramWebApp: any;
  private userData: any;

  constructor() {
    // @ts-ignore - o Telegram injeta o objeto WebApp globalmente
    this.telegramWebApp = window.Telegram?.WebApp;
    this.init();
  }

  private init(): void {
    if (this.telegramWebApp) {
      this.telegramWebApp.ready();
      this.telegramWebApp.expand();

      // Obter dados do usuário
      this.userData = this.telegramWebApp.initDataUnsafe?.user || {};

      // Configura o botão de volta
      this.telegramWebApp.BackButton.onClick(() => {
        // Implementar navegação de volta
      });
    } else {
      console.warn(
        "Telegram WebApp não detectado. Executando em ambiente de desenvolvimento."
      );
    }
  }

  public closeWebApp(data?: any): void {
    if (this.telegramWebApp) {
      if (data) {
        this.telegramWebApp.sendData(JSON.stringify(data));
      }
      this.telegramWebApp.close();
    }
  }

  public showMainButton(text: string, callback: () => void): void {
    if (this.telegramWebApp?.MainButton) {
      this.telegramWebApp.MainButton.setText(text);
      this.telegramWebApp.MainButton.show();
      this.telegramWebApp.MainButton.onClick(callback);
    }
  }

  public getUserData(): any {
    return this.userData;
  }

  public hideMainButton(): void {
    if (this.telegramWebApp?.MainButton) {
      this.telegramWebApp.MainButton.hide();
    }
  }

  public isRunningInTelegram(): boolean {
    return !!this.telegramWebApp;
  }
}
