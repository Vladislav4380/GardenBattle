import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface GardenAvatar {
  code: string;
  name: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  previewUrl: string;
  backgroundUrl: string;
  locked?: boolean;
}

@Component({
  selector: 'app-avatar-card',
  standalone: true,
  imports: [NgIf],
  templateUrl: './avatar-card.component.html',
  styleUrl: './avatar-card.component.scss'
})
export class AvatarCardComponent {
  @Input({ required: true }) avatar!: GardenAvatar;
  @Input() selected = false;

  @Output() select = new EventEmitter<string>();

  onSelect(): void {
    if (this.avatar.locked) {
      return;
    }

    this.select.emit(this.avatar.code);
  }
}
