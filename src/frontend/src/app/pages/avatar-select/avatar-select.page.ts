import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent } from '@ionic/angular/standalone';
import { AvatarCardComponent, GardenAvatar } from '../../components/avatar-card/avatar-card.component';

@Component({
  selector: 'app-avatar-select',
  standalone: true,
  imports: [NgFor, NgIf, IonButton, IonContent, AvatarCardComponent],
  host: { class: 'ion-page' },
  templateUrl: './avatar-select.page.html',
  styleUrl: './avatar-select.page.scss'
})
export class AvatarSelectPage {
  selectedAvatarCode = 'young_gardener';

  avatars: GardenAvatar[] = [
    {
      code: 'young_gardener',
      name: '\u041c\u043e\u043b\u043e\u0434\u043e\u0439 \u0441\u0430\u0434\u043e\u0432\u043d\u0438\u043a',
      shortDescription: '\u041b\u044e\u0431\u0438\u0442 \u0432\u044b\u0440\u0430\u0449\u0438\u0432\u0430\u0442\u044c \u043d\u043e\u0432\u044b\u0435 \u043a\u0443\u043b\u044c\u0442\u0443\u0440\u044b.',
      description:
        '\u042d\u043d\u0442\u0443\u0437\u0438\u0430\u0441\u0442 \u0441\u0432\u043e\u0435\u0433\u043e \u0434\u0435\u043b\u0430, \u043a\u043e\u0442\u043e\u0440\u044b\u0439 \u0432\u0435\u0440\u0438\u0442, \u0447\u0442\u043e \u043b\u044e\u0431\u043e\u0435 \u0441\u0435\u043c\u0435\u0447\u043a\u043e \u043c\u043e\u0436\u0435\u0442 \u0441\u0442\u0430\u0442\u044c \u043b\u0435\u0433\u0435\u043d\u0434\u043e\u0439. \u0412\u0441\u0435\u0433\u0434\u0430 \u0433\u043e\u0442\u043e\u0432 \u043a \u043d\u043e\u0432\u044b\u043c \u0432\u044b\u0437\u043e\u0432\u0430\u043c!',
      imageUrl: 'assets/avatars/young-gardener.png',
      previewUrl: 'assets/avatars/young-gardener-preview.png',
      backgroundUrl: 'assets/avatars/bg-garden.jpg'
    },
    {
      code: 'forest_druid',
      name: '\u041b\u0435\u0441\u043d\u043e\u0439 \u0434\u0440\u0443\u0438\u0434',
      shortDescription: '\u0425\u0440\u0430\u043d\u0438\u0442\u0435\u043b\u044c \u043f\u0440\u0438\u0440\u043e\u0434\u044b \u0438 \u0443\u0440\u043e\u0436\u0430\u044f.',
      description:
        '\u041c\u0443\u0434\u0440\u044b\u0439 \u0434\u0443\u0445 \u043b\u0435\u0441\u0430, \u043a\u043e\u0442\u043e\u0440\u044b\u0439 \u0447\u0443\u0432\u0441\u0442\u0432\u0443\u0435\u0442 \u0441\u0438\u043b\u0443 \u0437\u0435\u043c\u043b\u0438, \u043b\u0438\u0441\u0442\u044c\u0435\u0432 \u0438 \u0434\u0440\u0435\u0432\u043d\u0438\u0445 \u043a\u043e\u0440\u043d\u0435\u0439.',
      imageUrl: 'assets/avatars/forest-druid.png',
      previewUrl: 'assets/avatars/forest-druid-preview.png',
      backgroundUrl: 'assets/avatars/bg-forest.jpg'
    },
    {
      code: 'harvest_guardian',
      name: '\u0425\u0440\u0430\u043d\u0438\u0442\u0435\u043b\u044c \u0443\u0440\u043e\u0436\u0430\u044f',
      shortDescription: '\u0417\u0430\u0449\u0438\u0449\u0430\u0435\u0442 \u043e\u0433\u043e\u0440\u043e\u0434 \u043e\u0442 \u0432\u0440\u0435\u0434\u0438\u0442\u0435\u043b\u0435\u0439.',
      description:
        '\u0421\u0443\u0440\u043e\u0432\u044b\u0439 \u0437\u0430\u0449\u0438\u0442\u043d\u0438\u043a \u0433\u0440\u044f\u0434\u043e\u043a. \u041d\u0438\u043a\u0442\u043e \u043d\u0435 \u043f\u0440\u043e\u0439\u0434\u0435\u0442 \u043a \u0443\u0440\u043e\u0436\u0430\u044e \u0431\u0435\u0437 \u0435\u0433\u043e \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043d\u0438\u044f.',
      imageUrl: 'assets/avatars/harvest-guardian.png',
      previewUrl: 'assets/avatars/harvest-guardian-preview.png',
      backgroundUrl: 'assets/avatars/bg-arena.jpg'
    },
    {
      code: 'season_traveler',
      name: '\u041f\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0435\u043d\u043d\u0438\u043a \u0441\u0435\u0437\u043e\u043d\u043e\u0432',
      shortDescription: '\u0421\u043e\u0431\u0438\u0440\u0430\u0435\u0442 \u0440\u0435\u0434\u043a\u0438\u0435 \u043a\u0443\u043b\u044c\u0442\u0443\u0440\u044b \u0441\u043e \u0432\u0441\u0435\u0433\u043e \u043c\u0438\u0440\u0430.',
      description:
        '\u0418\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u0442\u0435\u043b\u044c \u0434\u0430\u043b\u044c\u043d\u0438\u0445 \u0437\u0435\u043c\u0435\u043b\u044c, \u043a\u043e\u0442\u043e\u0440\u044b\u0439 \u0438\u0449\u0435\u0442 \u043d\u0435\u043e\u0431\u044b\u0447\u043d\u044b\u0435 \u0441\u0435\u043c\u0435\u043d\u0430 \u0438 \u0437\u0430\u0431\u044b\u0442\u044b\u0435 \u0441\u0430\u0434\u043e\u0432\u044b\u0435 \u0442\u0430\u0439\u043d\u044b.',
      imageUrl: 'assets/avatars/season-traveler.png',
      previewUrl: 'assets/avatars/season-traveler-preview.png',
      backgroundUrl: 'assets/avatars/bg-mountains.jpg'
    }
  ];

  constructor(private readonly router: Router) {}

  get selectedAvatar(): GardenAvatar | undefined {
    return this.avatars.find((avatar) => avatar.code === this.selectedAvatarCode);
  }

  selectAvatar(code: string): void {
    this.selectedAvatarCode = code;
  }

  confirm(): void {
    localStorage.setItem('gardenBattle.guardianAvatarCode', this.selectedAvatarCode);
    void this.router.navigateByUrl('/starter-garden');
  }
}
