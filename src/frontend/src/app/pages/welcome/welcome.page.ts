import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent } from '@ionic/angular/standalone';

type Lang = 'ru' | 'uk' | 'en';

@Component({
  selector: 'gb-welcome',
  standalone: true,
  imports: [IonButton, IonContent],
  host: { class: 'ion-page' },
  templateUrl: './welcome.page.html',
  styleUrl: './welcome.page.scss'
})
export class WelcomePage {
  private readonly router = inject(Router);
  private readonly lang: Lang = this.detectLanguage();

  readonly t = translations[this.lang];

  start(): void {
    void this.router.navigateByUrl('/avatar-select');
  }

  private detectLanguage(): Lang {
    const language = navigator.language.toLowerCase();

    if (language.startsWith('uk')) {
      return 'uk';
    }

    if (language.startsWith('ru')) {
      return 'ru';
    }

    return 'en';
  }
}

const translations = {
  ru: {
    titleTop: '\u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c \u0432',
    subtitle: '\u0412\u044b\u0440\u0430\u0449\u0438\u0432\u0430\u0439 \u043e\u0432\u043e\u0449\u0438, \u0441\u043e\u0431\u0438\u0440\u0430\u0439 \u043a\u043e\u043c\u0430\u043d\u0434\u0443 \u0438 \u0441\u0440\u0430\u0436\u0430\u0439\u0441\u044f \u0441 \u0438\u0433\u0440\u043e\u043a\u0430\u043c\u0438 \u0437\u0430 \u043f\u043e\u0431\u0435\u0434\u0443.',
    startButton: '\u041d\u0410\u0427\u0410\u0422\u042c',
    cards: {
      grow: {
        title: '\u0412\u044b\u0440\u0430\u0449\u0438\u0432\u0430\u0439',
        text: '\u0421\u043e\u0431\u0438\u0440\u0430\u0439 \u0443\u0440\u043e\u0436\u0430\u0439 \u0438 \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0439 \u043d\u043e\u0432\u044b\u0435 \u043a\u0443\u043b\u044c\u0442\u0443\u0440\u044b.'
      },
      team: {
        title: '\u0421\u043e\u0431\u0438\u0440\u0430\u0439 \u043a\u043e\u043c\u0430\u043d\u0434\u0443',
        text: '\u0412\u044b\u0431\u0438\u0440\u0430\u0439 \u0431\u043e\u0439\u0446\u043e\u0432 \u0438 \u0441\u043e\u0437\u0434\u0430\u0432\u0430\u0439 \u0441\u0438\u043b\u044c\u043d\u0443\u044e \u0442\u0430\u043a\u0442\u0438\u043a\u0443.'
      },
      battle: {
        title: '\u0421\u0440\u0430\u0436\u0430\u0439\u0441\u044f',
        text: '\u041f\u043e\u0431\u0435\u0436\u0434\u0430\u0439 \u0432 PvP \u0431\u043e\u044f\u0445 \u0438 \u0442\u0443\u0440\u043d\u0438\u0440\u0430\u0445.'
      }
    }
  },
  uk: {
    titleTop: '\u041b\u0430\u0441\u043a\u0430\u0432\u043e \u043f\u0440\u043e\u0441\u0438\u043c\u043e \u0434\u043e',
    subtitle: '\u0412\u0438\u0440\u043e\u0449\u0443\u0439 \u043e\u0432\u043e\u0447\u0456, \u0437\u0431\u0438\u0440\u0430\u0439 \u043a\u043e\u043c\u0430\u043d\u0434\u0443 \u0442\u0430 \u0431\u0438\u0439\u0441\u044f \u0437 \u0433\u0440\u0430\u0432\u0446\u044f\u043c\u0438 \u0437\u0430 \u043f\u0435\u0440\u0435\u043c\u043e\u0433\u0443.',
    startButton: '\u041f\u041e\u0427\u0410\u0422\u0418',
    cards: {
      grow: {
        title: '\u0412\u0438\u0440\u043e\u0449\u0443\u0439',
        text: '\u0417\u0431\u0438\u0440\u0430\u0439 \u0443\u0440\u043e\u0436\u0430\u0439 \u0456 \u0432\u0456\u0434\u043a\u0440\u0438\u0432\u0430\u0439 \u043d\u043e\u0432\u0456 \u043a\u0443\u043b\u044c\u0442\u0443\u0440\u0438.'
      },
      team: {
        title: '\u0417\u0431\u0438\u0440\u0430\u0439 \u043a\u043e\u043c\u0430\u043d\u0434\u0443',
        text: '\u041e\u0431\u0438\u0440\u0430\u0439 \u0431\u0456\u0439\u0446\u0456\u0432 \u0456 \u0441\u0442\u0432\u043e\u0440\u044e\u0439 \u0441\u0438\u043b\u044c\u043d\u0443 \u0442\u0430\u043a\u0442\u0438\u043a\u0443.'
      },
      battle: {
        title: '\u0411\u0438\u0439\u0441\u044f',
        text: '\u041f\u0435\u0440\u0435\u043c\u0430\u0433\u0430\u0439 \u0443 PvP \u0431\u043e\u044f\u0445 \u0456 \u0442\u0443\u0440\u043d\u0456\u0440\u0430\u0445.'
      }
    }
  },
  en: {
    titleTop: 'Welcome to',
    subtitle: 'Grow vegetables, build your team and fight players for victory.',
    startButton: 'START',
    cards: {
      grow: {
        title: 'Grow',
        text: 'Harvest crops and unlock new cultures.'
      },
      team: {
        title: 'Build team',
        text: 'Choose fighters and create strong tactics.'
      },
      battle: {
        title: 'Fight',
        text: 'Win PvP battles and tournaments.'
      }
    }
  }
} satisfies Record<Lang, {
  titleTop: string;
  subtitle: string;
  startButton: string;
  cards: Record<'grow' | 'team' | 'battle', { title: string; text: string }>;
}>;
