import { NgClass, NgStyle } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

type CatalogMode = 'crops' | 'buildings' | 'inventory' | null;
type PlacementGhost = 'crop' | 'building' | null;

interface ResourceIndicator {
  readonly label: string;
  readonly value: number;
  readonly image: string;
}

interface GardenCatalogItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly speed?: string;
  readonly storage?: string;
  readonly locked?: boolean;
}

interface GardenObject {
  readonly id: string;
  readonly kind: 'crop' | 'building' | 'tree' | 'rock' | 'river' | 'path';
  readonly title: string;
  readonly image?: string;
  readonly cropClass?: string;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly event?: GardenEvent;
  readonly locked?: boolean;
}

interface GardenEvent {
  readonly title: string;
  readonly image: string;
  readonly x?: number;
  readonly y?: number;
}

interface AmbientObject {
  readonly title: string;
  readonly image: string;
  readonly className: string;
  readonly x: number;
  readonly y: number;
}

const gardenAsset = (name: string) => `/assets/garden/${name}.png`;

@Component({
  selector: 'gb-garden-object',
  standalone: true,
  imports: [NgClass, NgStyle],
  template: `
    <button
      class="garden-object"
      type="button"
      [class.is-crop]="object.kind === 'crop'"
      [class.is-building]="object.kind === 'building'"
      [class.is-locked]="object.locked"
      [ngStyle]="style()"
      [attr.aria-label]="object.title"
      (click)="select.emit(object)"
    >
      @if (object.kind === 'crop') {
        <span class="crop-bed-art" [ngClass]="object.cropClass">
          @if (object.image) {
            <img class="crop-reference" [src]="object.image" [alt]="object.title" draggable="false" />
          }
        </span>
      } @else if (object.image) {
        <img [src]="object.image" [alt]="object.title" draggable="false" />
      } @else {
        <span class="terrain-object" [ngClass]="object.kind"></span>
      }

      @if (object.event; as event) {
        <span class="event-bubble" [style.left.px]="event.x ?? 60" [style.top.px]="event.y ?? -38">
          <img [src]="event.image" [alt]="event.title" draggable="false" />
        </span>
      }
    </button>
  `,
  styles: [`
    :host {
      position: absolute;
      left: 0;
      top: 0;
      display: block;
      pointer-events: auto;
    }

    .garden-object {
      appearance: none;
      position: absolute;
      display: grid;
      place-items: center;
      padding: 0;
      border: 0;
      background: transparent;
      color: inherit;
      cursor: pointer;
      touch-action: manipulation;
      transform: translateZ(0);
    }

    .garden-object:focus-visible {
      outline: 3px solid rgba(255, 246, 168, .9);
      outline-offset: 3px;
      border-radius: 12px;
    }

    .garden-object img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 18px 15px rgba(0, 0, 0, .42));
      user-select: none;
      pointer-events: none;
    }

    .crop-bed-art {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      opacity: .01;
      border-radius: 18px;
      background:
        linear-gradient(135deg, transparent 0 9%, #8b5a23 10% 16%, transparent 17%),
        linear-gradient(225deg, transparent 0 9%, #4f2d11 10% 16%, transparent 17%),
        radial-gradient(ellipse at 50% 54%, #44230f 0 42%, #2d170b 43% 57%, transparent 58%),
        linear-gradient(145deg, #9a6427 0 18%, #573216 19% 82%, #2d1809 83%);
      box-shadow:
        inset 0 0 0 3px rgba(38, 20, 7, .8),
        inset 0 0 0 7px rgba(154, 94, 28, .8),
        0 15px 14px rgba(0, 0, 0, .32);
      transform: perspective(260px) rotateX(48deg) rotateZ(-4deg);
      transform-origin: center bottom;
    }

    .crop-bed-art::before,
    .crop-bed-art::after {
      content: '';
      position: absolute;
      left: 16%;
      right: 16%;
      border-radius: 999px;
      background: rgba(69, 38, 17, .7);
      box-shadow: 0 18px 0 rgba(69, 38, 17, .62), 0 36px 0 rgba(69, 38, 17, .52);
    }

    .crop-bed-art::before {
      top: 32%;
      height: 8px;
    }

    .crop-bed-art::after {
      top: 24%;
      bottom: 20%;
      width: 8px;
      left: 32%;
      right: auto;
      box-shadow: 34px 0 0 rgba(69, 38, 17, .62), 68px 0 0 rgba(69, 38, 17, .52);
    }

    .crop-reference {
      position: absolute;
      z-index: 3;
      left: -10%;
      top: -44%;
      width: 120%;
      height: 120%;
      object-fit: contain;
      mask-image: radial-gradient(ellipse at 50% 52%, #000 0 54%, transparent 76%);
      opacity: .98;
      transform: perspective(260px) rotateX(-48deg) rotateZ(4deg);
      transform-origin: center bottom;
      filter: drop-shadow(0 10px 8px rgba(0, 0, 0, .38));
    }

    .garden-object.is-building img {
      border-radius: 18px;
      mask-image: radial-gradient(ellipse at 50% 58%, #000 0 68%, transparent 82%);
      opacity: .01;
      filter: drop-shadow(0 22px 18px rgba(0, 0, 0, .48));
    }

    .garden-object.is-locked {
      filter: grayscale(.25) opacity(.88);
    }

    .terrain-object {
      display: block;
      width: 100%;
      height: 100%;
      opacity: .01;
    }

    .tree {
      border-radius: 48% 52% 52% 48%;
      background:
        radial-gradient(circle at 50% 18%, #74c34f 0 22%, transparent 23%),
        radial-gradient(circle at 34% 34%, #3f8f2d 0 28%, transparent 29%),
        radial-gradient(circle at 66% 36%, #2e7f28 0 30%, transparent 31%),
        linear-gradient(90deg, transparent 44%, #7b4a19 45% 55%, transparent 56%);
      filter: drop-shadow(0 16px 9px rgba(0, 0, 0, .34));
    }

    .rock {
      border-radius: 42% 58% 54% 46%;
      background: linear-gradient(145deg, #9b9b92, #4d514d 58%, #2f332f);
      box-shadow: inset -10px -10px 18px rgba(0, 0, 0, .26);
    }

    .river {
      border-radius: 999px;
      background:
        radial-gradient(circle at 30% 40%, rgba(255, 255, 255, .34), transparent 18%),
        linear-gradient(90deg, #2d9bd4, #76d3f4 48%, #2785be);
      opacity: .86;
      box-shadow: inset 0 0 18px rgba(255, 255, 255, .22);
    }

    .path {
      border-radius: 999px;
      background:
        repeating-linear-gradient(90deg, rgba(110, 77, 35, .75) 0 18px, rgba(154, 116, 58, .75) 19px 36px);
      opacity: .9;
    }

    .event-bubble {
      position: absolute;
      width: 72px;
      height: 82px;
      pointer-events: auto;
      animation: eventFloat 2.2s ease-in-out infinite;
    }

    .event-bubble img {
      width: 100%;
      height: 100%;
    }

    @keyframes eventFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-7px); }
    }
  `]
})
export class GardenObjectComponent {
  @Input({ required: true })
  object!: GardenObject;

  @Output()
  readonly select = new EventEmitter<GardenObject>();

  style(): Record<string, string> {
    return {
      transform: `translate(${this.object.x}px, ${this.object.y}px)`,
      width: `${this.object.w}px`,
      height: `${this.object.h}px`
    };
  }
}

@Component({
  standalone: true,
  imports: [IonContent, GardenObjectComponent, NgStyle],
  host: { class: 'ion-page' },
  templateUrl: './garden.page.html',
  styleUrl: './garden.page.scss'
})
export class GardenPage {
  private readonly router = inject(Router);

  readonly resources: ResourceIndicator[] = [
    { label: 'Coins', value: 1250, image: gardenAsset('resource-coins') },
    { label: 'Stars', value: 120, image: gardenAsset('resource-stars') },
    { label: 'Gems', value: 35, image: gardenAsset('resource-gems') }
  ];

  readonly crops: GardenCatalogItem[] = [
    { id: 'tomato', title: 'Tomato', description: 'Balanced food crop for daily garden income.', speed: '10 min', storage: '18 / 20', image: gardenAsset('crop-tomato-bed') },
    { id: 'cucumber', title: 'Cucumber', description: 'Fast-growing crop with steady storage turnover.', speed: '8 min', storage: '12 / 20', image: gardenAsset('crop-cucumber-bed') },
    { id: 'carrot', title: 'Carrot', description: 'Reliable root crop with strong base yield.', speed: '12 min', storage: '9 / 18', image: gardenAsset('crop-carrot-bed') },
    { id: 'banana', title: 'Banana', description: 'Tropical bed for rare market recipes.', speed: '24 min', storage: '4 / 12', image: gardenAsset('crop-banana-bed') },
    { id: 'corn', title: 'Corn', description: 'Tall field crop with strong volume output.', speed: '16 min', storage: '14 / 24', image: gardenAsset('crop-corn-bed') },
    { id: 'pepper', title: 'Pepper', description: 'Spicy crop used in boosters and trades.', speed: '18 min', storage: '6 / 14', image: gardenAsset('crop-pepper-bed') },
    { id: 'pumpkin', title: 'Pumpkin', description: 'Large harvest crop for seasonal orders.', speed: '30 min', storage: '2 / 8', image: gardenAsset('crop-pumpkin-bed'), locked: true },
    { id: 'broccoli', title: 'Broccoli', description: 'Premium crop unlocked by garden level.', speed: '22 min', storage: '0 / 10', image: gardenAsset('crop-broccoli-bed'), locked: true },
    { id: 'watermelon', title: 'Watermelon', description: 'Heavy summer crop for big contracts.', speed: '35 min', storage: '0 / 6', image: gardenAsset('crop-watermelon-bed'), locked: true }
  ];

  readonly buildings: GardenCatalogItem[] = [
    { id: 'greenhouse', title: 'Greenhouse', description: 'Protects beds and improves growth cycles.', image: gardenAsset('building-greenhouse') },
    { id: 'laboratory', title: 'Laboratory', description: 'Researches boosters and crop upgrades.', image: gardenAsset('building-laboratory') },
    { id: 'market', title: 'Market', description: 'Opens player trading and daily offers.', image: gardenAsset('building-market') },
    { id: 'warehouse', title: 'Warehouse', description: 'Expands crop and resource storage.', image: gardenAsset('building-warehouse') },
    { id: 'well', title: 'Well', description: 'Supports watering events and garden upkeep.', image: gardenAsset('building-well') },
    { id: 'locked-1', title: 'Locked Building', description: 'Unlocks with garden progress.', image: gardenAsset('building-locked'), locked: true },
    { id: 'locked-2', title: 'Locked Building', description: 'Unlocks with garden progress.', image: gardenAsset('building-locked'), locked: true }
  ];

  readonly gardenObjects: GardenObject[] = [
    { id: 'river', kind: 'river', title: 'River', x: 790, y: 80, w: 84, h: 760 },
    { id: 'path-main', kind: 'path', title: 'Garden path', x: 105, y: 470, w: 650, h: 46 },
    { id: 'path-branch', kind: 'path', title: 'Garden path', x: 456, y: 255, w: 42, h: 430 },
    { id: 'tomato-bed', kind: 'crop', title: 'Tomato crop bed', cropClass: 'crop-tomato', image: gardenAsset('crop-tomato-bed'), x: 120, y: 230, w: 150, h: 112, event: { title: 'Water event', image: gardenAsset('event-water'), x: 46, y: -58 } },
    { id: 'cucumber-bed', kind: 'crop', title: 'Cucumber crop bed', cropClass: 'crop-cucumber', image: gardenAsset('crop-cucumber-bed'), x: 330, y: 240, w: 150, h: 112, event: { title: 'Weeds event', image: gardenAsset('event-weeds'), x: 52, y: -60 } },
    { id: 'carrot-bed', kind: 'crop', title: 'Carrot crop bed', cropClass: 'crop-carrot', image: gardenAsset('crop-carrot-bed'), x: 540, y: 240, w: 150, h: 112 },
    { id: 'corn-bed', kind: 'crop', title: 'Corn crop bed', cropClass: 'crop-corn', image: gardenAsset('crop-corn-bed'), x: 120, y: 410, w: 150, h: 112, event: { title: 'Ladybug event', image: gardenAsset('event-ladybug'), x: 50, y: -60 } },
    { id: 'pepper-bed', kind: 'crop', title: 'Pepper crop bed', cropClass: 'crop-pepper', image: gardenAsset('crop-pepper-bed'), x: 330, y: 410, w: 150, h: 112, event: { title: 'Mystery event', image: gardenAsset('event-question'), x: 50, y: -60 } },
    { id: 'pumpkin-bed', kind: 'crop', title: 'Pumpkin crop bed', cropClass: 'crop-pumpkin', image: gardenAsset('crop-pumpkin-bed'), x: 540, y: 410, w: 150, h: 112 },
    { id: 'broccoli-bed', kind: 'crop', title: 'Broccoli crop bed', cropClass: 'crop-broccoli', image: gardenAsset('crop-broccoli-bed'), x: 120, y: 590, w: 150, h: 112 },
    { id: 'watermelon-bed', kind: 'crop', title: 'Watermelon crop bed', cropClass: 'crop-watermelon', image: gardenAsset('crop-watermelon-bed'), x: 330, y: 590, w: 150, h: 112 },
    { id: 'banana-bed', kind: 'crop', title: 'Banana crop bed', cropClass: 'crop-banana', image: gardenAsset('crop-banana-bed'), x: 540, y: 590, w: 150, h: 112 },
    { id: 'greenhouse', kind: 'building', title: 'Greenhouse', image: gardenAsset('building-greenhouse'), x: 170, y: 760, w: 170, h: 124 },
    { id: 'well', kind: 'building', title: 'Well', image: gardenAsset('building-well'), x: 420, y: 760, w: 118, h: 120 },
    { id: 'warehouse', kind: 'building', title: 'Warehouse', image: gardenAsset('building-warehouse'), x: 600, y: 750, w: 132, h: 136 },
    { id: 'laboratory', kind: 'building', title: 'Laboratory', image: gardenAsset('building-laboratory'), x: 88, y: 930, w: 158, h: 134 },
    { id: 'market', kind: 'building', title: 'Market', image: gardenAsset('building-market'), x: 520, y: 920, w: 158, h: 132 },
    { id: 'tree-a', kind: 'tree', title: 'Tree', x: 40, y: 185, w: 76, h: 108 },
    { id: 'tree-b', kind: 'tree', title: 'Tree', x: 690, y: 185, w: 76, h: 108 },
    { id: 'tree-c', kind: 'tree', title: 'Tree', x: 700, y: 630, w: 76, h: 108 },
    { id: 'rock-a', kind: 'rock', title: 'Rock', x: 670, y: 545, w: 58, h: 42 },
    { id: 'rock-b', kind: 'rock', title: 'Rock', x: 62, y: 710, w: 64, h: 45 }
  ];

  readonly ambient: AmbientObject[] = [
    { title: 'Butterfly', image: gardenAsset('ambient-butterfly'), className: 'butterfly', x: 250, y: 165 },
    { title: 'Bee', image: gardenAsset('ambient-bee'), className: 'bee', x: 665, y: 275 },
    { title: 'Bird', image: gardenAsset('ambient-bird'), className: 'bird', x: 500, y: 116 },
    { title: 'Cloud', image: gardenAsset('ambient-cloud'), className: 'cloud cloud-a', x: 86, y: 92 },
    { title: 'Cloud', image: gardenAsset('ambient-cloud'), className: 'cloud cloud-b', x: 610, y: 80 }
  ];

  readonly inventoryItems = [
    gardenAsset('item-coin'), gardenAsset('item-gem'), gardenAsset('item-star'), gardenAsset('item-bag'), gardenAsset('item-potion'),
    gardenAsset('item-map'), gardenAsset('item-shovel'), gardenAsset('item-book'), gardenAsset('item-chest'), gardenAsset('item-crystal')
  ];

  readonly catalogMode = signal<CatalogMode>(null);
  readonly placementGhost = signal<PlacementGhost>(null);
  readonly selectedObject = signal<GardenObject | null>(null);
  readonly scale = signal(.52);
  readonly translateX = signal(-28);
  readonly translateY = signal(72);
  readonly ghostX = signal(195);
  readonly ghostY = signal(430);
  readonly gardenerFrame = signal(gardenAsset('gardener-front'));
  readonly gardenerX = signal(382);
  readonly gardenerY = signal(650);

  readonly activeCatalogTitle = computed(() => {
    switch (this.catalogMode()) {
      case 'crops': return 'Crop Catalog';
      case 'buildings': return 'Buildings Catalog';
      case 'inventory': return 'Inventory';
      default: return '';
    }
  });

  readonly mapTransform = computed(() => ({
    transform: `translate3d(${this.translateX()}px, ${this.translateY()}px, 0) scale(${this.scale()})`
  }));

  readonly ghostImage = computed(() => {
    const ghost = this.placementGhost();
    return ghost === 'crop' ? gardenAsset('ghost-crop-bed') : ghost === 'building' ? gardenAsset('ghost-building') : null;
  });

  readonly selectedPopupTitle = computed(() => {
    const object = this.selectedObject();
    return object?.title ?? '';
  });

  private dragging = false;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private initialPinchDistance = 0;
  private initialScale = 1;
  private readonly minScale = .48;
  private readonly maxScale = 1.55;
  private readonly mapWidth = 853;
  private readonly mapHeight = 1518;

  constructor() {
    window.setInterval(() => this.moveGardener(), 3200);
  }

  openAvatar(): void {
    void this.router.navigateByUrl('/avatar-select');
  }

  openCatalog(mode: CatalogMode): void {
    this.selectedObject.set(null);
    this.catalogMode.set(mode);
  }

  closeCatalog(): void {
    this.catalogMode.set(null);
  }

  selectObject(object: GardenObject): void {
    this.selectedObject.set(object);
  }

  closePopup(): void {
    this.selectedObject.set(null);
  }

  navigateHome(): void {
    void this.router.navigateByUrl('/dashboard');
  }

  navigateMarket(): void {
    void this.router.navigateByUrl('/market');
  }

  placeCropBed(item: GardenCatalogItem): void {
    if (item.locked) {
      return;
    }
    this.catalogMode.set(null);
    this.selectedObject.set(null);
    this.placementGhost.set('crop');
  }

  build(item: GardenCatalogItem): void {
    if (item.locked) {
      return;
    }
    this.catalogMode.set(null);
    this.selectedObject.set(null);
    this.placementGhost.set('building');
  }

  showDetails(item: GardenCatalogItem): void {
    if (item.locked) {
      return;
    }
  }

  onPointerDown(event: PointerEvent): void {
    if (this.placementGhost()) {
      this.updateGhost(event.clientX, event.clientY);
      return;
    }

    if (event.pointerType === 'touch') {
      return;
    }
    this.dragging = true;
    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;
  }

  onPointerMove(event: PointerEvent): void {
    if (this.placementGhost()) {
      this.updateGhost(event.clientX, event.clientY);
      return;
    }

    if (!this.dragging) {
      return;
    }
    const dx = event.clientX - this.lastPointerX;
    const dy = event.clientY - this.lastPointerY;
    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;
    this.panBy(dx, dy);
  }

  onPointerUp(): void {
    this.dragging = false;
  }

  onTouchStart(event: TouchEvent): void {
    if (this.placementGhost() && event.touches.length > 0) {
      this.updateGhost(event.touches[0].clientX, event.touches[0].clientY);
      return;
    }

    if (event.touches.length === 1) {
      this.dragging = true;
      this.lastPointerX = event.touches[0].clientX;
      this.lastPointerY = event.touches[0].clientY;
    }

    if (event.touches.length === 2) {
      this.dragging = false;
      this.initialPinchDistance = this.distance(event.touches[0], event.touches[1]);
      this.initialScale = this.scale();
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (this.placementGhost() && event.touches.length > 0) {
      event.preventDefault();
      this.updateGhost(event.touches[0].clientX, event.touches[0].clientY);
      return;
    }

    if (event.touches.length === 1 && this.dragging) {
      const touch = event.touches[0];
      this.panBy(touch.clientX - this.lastPointerX, touch.clientY - this.lastPointerY);
      this.lastPointerX = touch.clientX;
      this.lastPointerY = touch.clientY;
      return;
    }

    if (event.touches.length === 2) {
      event.preventDefault();
      const nextDistance = this.distance(event.touches[0], event.touches[1]);
      const ratio = nextDistance / Math.max(this.initialPinchDistance, 1);
      this.scale.set(this.clampScale(this.initialScale * ratio));
      this.clampPan();
    }
  }

  onTouchEnd(event: TouchEvent): void {
    if (event.touches.length === 0) {
      this.dragging = false;
      this.initialPinchDistance = 0;
    }
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const direction = event.deltaY > 0 ? -.08 : .08;
    this.scale.set(this.clampScale(this.scale() + direction));
    this.clampPan();
  }

  @HostListener('window:resize')
  clampPan(): void {
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const scaledWidth = this.mapWidth * this.scale();
    const scaledHeight = this.mapHeight * this.scale();
    const minX = Math.min(0, viewportWidth - scaledWidth - 16);
    const minY = Math.min(0, viewportHeight - scaledHeight - 96);
    this.translateX.set(Math.max(minX, Math.min(16, this.translateX())));
    this.translateY.set(Math.max(minY, Math.min(96, this.translateY())));
  }

  private panBy(dx: number, dy: number): void {
    this.translateX.update((value) => value + dx);
    this.translateY.update((value) => value + dy);
    this.clampPan();
  }

  private clampScale(value: number): number {
    return Number(Math.max(this.minScale, Math.min(this.maxScale, value)).toFixed(3));
  }

  private distance(a: Touch, b: Touch): number {
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  private updateGhost(x: number, y: number): void {
    this.ghostX.set(x);
    this.ghostY.set(y);
  }

  private moveGardener(): void {
    const frames = [
      gardenAsset('gardener-front'),
      gardenAsset('gardener-walk-1'),
      gardenAsset('gardener-walk-2'),
      gardenAsset('gardener-water'),
      gardenAsset('gardener-walk-away')
    ];
    const frame = frames[Math.floor(Math.random() * frames.length)];
    this.gardenerFrame.set(frame);
    this.gardenerX.set(250 + Math.round(Math.random() * 330));
    this.gardenerY.set(500 + Math.round(Math.random() * 350));
  }
}
