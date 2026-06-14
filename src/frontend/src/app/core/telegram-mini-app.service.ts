import { Injectable } from '@angular/core';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData?: string;
        ready: () => void;
        expand: () => void;
        HapticFeedback?: { impactOccurred: (style: 'light' | 'medium' | 'heavy') => void };
      };
    };
  }
}

@Injectable({ providedIn: 'root' })
export class TelegramMiniAppService {
  get initData(): string {
    return window.Telegram?.WebApp?.initData ?? 'dev-init-data';
  }

  ready(): void {
    window.Telegram?.WebApp?.ready();
    window.Telegram?.WebApp?.expand();
  }

  impact(): void {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
  }
}
