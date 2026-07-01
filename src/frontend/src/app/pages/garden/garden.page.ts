import { AsyncPipe, NgStyle } from '@angular/common';
import { Component, HostListener, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { DashboardComponentsModule } from '../dashboard/components/dashboard-components.module';
import { DashboardDataService } from '../dashboard/services/dashboard-data.service';
import { GARDEN_SEEDLINGS, GardenSeedlingCatalogItem } from './garden-seedlings.data';

@Component({
  standalone: true,
  imports: [AsyncPipe, NgStyle, IonContent, DashboardComponentsModule],
  host: { class: 'ion-page' },
  templateUrl: './garden.page.html',
  styleUrl: './garden.page.scss'
})
export class GardenPage implements OnDestroy {
  readonly dashboardData = inject(DashboardDataService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly imageWidth = 1672;
  readonly imageHeight = 941;
  readonly playArea = {
    x: 620,
    y: 210,
    width: 400,
    height: 520
  };
  readonly mapObjects: GardenMapObject[] = [
    {
      id: 'garden-object-steel-table',
      type: 'table',
      label: 'Steel Table',
      image: '/assets/garden/buildings/steel_table-cropped.png?v=1',
      x: 900,
      y: 230,
      width: 240,
      height: 217,
      scale: 0.624
    }
  ];

  zoom = 1;
  panX = 0;
  panY = 0;
  now = Date.now();
  readonly mapWidth = this.imageWidth;
  readonly mapHeight = this.imageHeight;

  private minZoom = 1;
  private readonly maxZoom = 2.2;
  private baseScale = 1;
  private viewportWidth = window.innerWidth;
  private viewportHeight = window.innerHeight;
  private isPanning = false;
  private draggingObject: GardenMapObject | null = null;
  private nextBedId = 1;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private lastObjectTapAt = 0;
  private lastObjectTapId: string | null = null;
  private pinchStartDistance = 0;
  private pinchStartZoom = 1;
  private readonly timerId = window.setInterval(() => {
    this.now = Date.now();
  }, 1000);

  constructor() {
    this.mapObjects.forEach((object) => this.clampObjectPosition(object));
    this.updateViewportSize();
    this.route.queryParamMap.subscribe((params) => {
      const seedlingId = params.get('seedling');
      const seedling = GARDEN_SEEDLINGS.find((item) => item.id === seedlingId);

      if (!seedling) {
        return;
      }

      const cursorX = Number(params.get('cursorX'));
      const cursorY = Number(params.get('cursorY'));
      this.createGhostBed(
        seedling,
        Number.isFinite(cursorX) && Number.isFinite(cursorY) ? { x: cursorX, y: cursorY } : undefined
      );
      void this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
    });
  }

  get mapTransform(): string {
    return `translate3d(-50%, -50%, 0) scale(${this.totalScale})`;
  }

  get mapLeft(): number {
    return Number((this.viewportWidth / 2 + this.panX).toFixed(2));
  }

  get mapTop(): number {
    return Number((this.viewportHeight / 2 + this.panY).toFixed(2));
  }

  objectStyle(object: GardenMapObject): Record<string, string> {
    return {
      left: `${object.x}px`,
      top: `${object.y}px`,
      width: `${object.width}px`,
      height: `${object.height}px`,
      transform: `scale(${object.scale})`,
      opacity: object.isGhost ? '.68' : '1',
      zIndex: object.isGhost ? '6' : '2'
    };
  }

  growthIndicatorStyle(object: GardenMapObject): Record<string, string> {
    return {
      left: `${object.x + (object.width * object.scale) / 2}px`,
      top: `${object.y - 18}px`
    };
  }

  isInvalidObject(object: GardenMapObject): boolean {
    return Boolean(object.isGhost && this.isObjectOverlapping(object));
  }

  growthProgress(object: GardenMapObject): number {
    if (!object.plantedAt || !object.growthSeconds) {
      return 0;
    }

    const elapsedSeconds = (this.now - object.plantedAt) / 1000;
    return Math.min(100, Math.max(0, (elapsedSeconds / object.growthSeconds) * 100));
  }

  growthLabel(object: GardenMapObject): string {
    if (!object.plantedAt || !object.growthSeconds) {
      return '';
    }

    const remainingSeconds = Math.max(0, Math.ceil(object.growthSeconds - (this.now - object.plantedAt) / 1000));

    if (remainingSeconds === 0) {
      return 'Готово';
    }

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    return minutes > 0 ? `${minutes}м ${seconds}с` : `${seconds}с`;
  }

  isGrowing(object: GardenMapObject): boolean {
    return Boolean(object.plantedAt && object.growthSeconds && this.growthProgress(object) < 100);
  }

  ngOnDestroy(): void {
    window.clearInterval(this.timerId);
  }

  private get totalScale(): number {
    return this.baseScale * this.zoom;
  }

  @HostListener('window:resize')
  @HostListener('window:orientationchange')
  updateViewportSize(): void {
    this.viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    this.viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    this.updateMapSize();
    this.zoom = this.clampZoom(this.zoom);
    this.clampPan();
  }

  onPointerDown(event: PointerEvent): void {
    if (event.pointerType === 'touch' || this.isUiEvent(event.target)) {
      return;
    }

    event.preventDefault();
    this.isPanning = true;
    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;
  }

  onPointerMove(event: PointerEvent): void {
    if (this.draggingObject) {
      event.preventDefault();
      this.draggingObject.x += (event.clientX - this.lastPointerX) / this.totalScale;
      this.draggingObject.y += (event.clientY - this.lastPointerY) / this.totalScale;
      this.clampObjectPosition(this.draggingObject);
      this.lastPointerX = event.clientX;
      this.lastPointerY = event.clientY;
      return;
    }

    if (!this.isPanning) {
      return;
    }

    event.preventDefault();
    this.panBy(event.clientX - this.lastPointerX, event.clientY - this.lastPointerY);
    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;
  }

  onPointerUp(): void {
    this.finishDragging();
  }

  onWheel(event: WheelEvent): void {
    if (this.isUiEvent(event.target)) {
      return;
    }

    event.preventDefault();
    const direction = event.deltaY > 0 ? -0.08 : 0.08;
    this.zoom = this.clampZoom(this.zoom + direction);
    this.clampPan();
  }

  onObjectDoubleClick(event: MouseEvent, object: GardenMapObject): void {
    event.preventDefault();
    event.stopPropagation();

    if (object.type === 'table' && !this.hasPendingGhost()) {
      this.openSeedlingsPage();
    }
  }

  onObjectPointerDown(event: PointerEvent, object: GardenMapObject): void {
    event.stopPropagation();

    if (!object.isGhost) {
      return;
    }

    event.preventDefault();
    this.isPanning = false;
    this.draggingObject = object;
    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;
  }

  onObjectPointerUp(event: PointerEvent, object: GardenMapObject): void {
    event.stopPropagation();

    if (object.isGhost) {
      this.finishDragging();
      return;
    }

    if (object.type !== 'table' || object.isGhost || this.hasPendingGhost()) {
      return;
    }

    const now = Date.now();
    const isSameObject = this.lastObjectTapId === object.id;
    const isDoubleTap = isSameObject && now - this.lastObjectTapAt <= 360;

    this.lastObjectTapAt = now;
    this.lastObjectTapId = object.id;

    if (isDoubleTap) {
      event.preventDefault();
      this.lastObjectTapAt = 0;
      this.lastObjectTapId = null;
      this.openSeedlingsPage();
    }
  }

  onObjectWheel(event: WheelEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onTouchStart(event: TouchEvent): void {
    if (this.isUiEvent(event.target)) {
      return;
    }

    if (event.touches.length === 1) {
      this.isPanning = true;
      this.lastPointerX = event.touches[0].clientX;
      this.lastPointerY = event.touches[0].clientY;
      return;
    }

    if (event.touches.length !== 2) {
      return;
    }

    this.isPanning = false;
    this.pinchStartDistance = this.touchDistance(event.touches[0], event.touches[1]);
    this.pinchStartZoom = this.zoom;
  }

  onTouchMove(event: TouchEvent): void {
    if (event.touches.length === 1 && this.isPanning) {
      event.preventDefault();
      this.panBy(event.touches[0].clientX - this.lastPointerX, event.touches[0].clientY - this.lastPointerY);
      this.lastPointerX = event.touches[0].clientX;
      this.lastPointerY = event.touches[0].clientY;
      return;
    }

    if (event.touches.length !== 2) {
      return;
    }

    event.preventDefault();
    const nextDistance = this.touchDistance(event.touches[0], event.touches[1]);
    const ratio = nextDistance / Math.max(this.pinchStartDistance, 1);
    this.zoom = this.clampZoom(this.pinchStartZoom * ratio);
    this.clampPan();
  }

  onTouchEnd(event: TouchEvent): void {
    if (event.touches.length === 0 && this.draggingObject?.isGhost) {
      this.finishDragging();
    }

    if (event.touches.length === 0) {
      this.isPanning = false;
    }

    if (event.touches.length < 2) {
      this.pinchStartDistance = 0;
    }
  }

  private createGhostBed(seedling: GardenSeedlingCatalogItem, screenPoint?: ScreenPoint): void {
    this.removePendingGhosts();

    const objectWidth = seedling.width * seedling.scale;
    const objectHeight = seedling.height * seedling.scale;
    const mapPoint = screenPoint ? this.screenToMapPoint(screenPoint) : undefined;
    const targetX = mapPoint?.x ?? this.playArea.x + this.playArea.width / 2;
    const targetY = mapPoint?.y ?? this.playArea.y + this.playArea.height / 2;
    const bed: GardenMapObject = {
      id: `garden-bed-${this.nextBedId++}`,
      type: 'bed',
      label: seedling.name,
      image: seedling.image,
      x: targetX - objectWidth / 2,
      y: targetY - objectHeight / 2,
      width: seedling.width,
      height: seedling.height,
      scale: seedling.scale,
      growthSeconds: seedling.growthSeconds,
      isGhost: true
    };

    this.clampObjectPosition(bed);
    this.moveObjectToNearestFreeSpot(bed);
    this.mapObjects.push(bed);
  }

  private hasPendingGhost(): boolean {
    return this.mapObjects.some((object) => object.isGhost);
  }

  private removePendingGhosts(): void {
    for (let index = this.mapObjects.length - 1; index >= 0; index--) {
      if (this.mapObjects[index].isGhost) {
        this.mapObjects.splice(index, 1);
      }
    }

    this.draggingObject = null;
  }

  private finishDragging(): void {
    if (this.draggingObject?.isGhost && !this.isObjectOverlapping(this.draggingObject)) {
      this.draggingObject.isGhost = false;
      this.draggingObject.plantedAt = Date.now();
    }

    this.isPanning = false;
    this.draggingObject = null;
  }

  private openSeedlingsPage(): void {
    void this.router.navigateByUrl('/garden/seedlings');
  }

  private screenToMapPoint(point: ScreenPoint): ScreenPoint {
    return {
      x: this.imageWidth / 2 + (point.x - this.mapLeft) / this.totalScale,
      y: this.imageHeight / 2 + (point.y - this.mapTop) / this.totalScale
    };
  }

  private clampZoom(value: number): number {
    return Number(Math.max(this.minZoom, Math.min(this.maxZoom, value)).toFixed(3));
  }

  private clampObjectPosition(object: GardenMapObject): void {
    const objectWidth = object.width * object.scale;
    const objectHeight = object.height * object.scale;
    const minX = this.playArea.x;
    const minY = this.playArea.y;
    const maxX = this.playArea.x + this.playArea.width - objectWidth;
    const maxY = this.playArea.y + this.playArea.height - objectHeight;

    object.x = Number(Math.max(minX, Math.min(maxX, object.x)).toFixed(2));
    object.y = Number(Math.max(minY, Math.min(maxY, object.y)).toFixed(2));
  }

  private isObjectOverlapping(object: GardenMapObject): boolean {
    return this.mapObjects.some((candidate) => {
      if (candidate.id === object.id || candidate.isGhost) {
        return false;
      }

      return this.objectsIntersect(object, candidate);
    });
  }

  private moveObjectToNearestFreeSpot(object: GardenMapObject): void {
    if (!this.isObjectOverlapping(object)) {
      return;
    }

    const originalX = object.x;
    const originalY = object.y;
    const step = 18;
    const maxX = this.playArea.x + this.playArea.width - object.width * object.scale;
    const maxY = this.playArea.y + this.playArea.height - object.height * object.scale;
    let bestSpot: ScreenPoint | null = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (let y = this.playArea.y; y <= maxY; y += step) {
      for (let x = this.playArea.x; x <= maxX; x += step) {
        object.x = Number(x.toFixed(2));
        object.y = Number(y.toFixed(2));

        if (this.isObjectOverlapping(object)) {
          continue;
        }

        const distance = Math.hypot(x - originalX, y - originalY);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestSpot = { x, y };
        }
      }
    }

    if (bestSpot) {
      object.x = Number(bestSpot.x.toFixed(2));
      object.y = Number(bestSpot.y.toFixed(2));
      return;
    }

    object.x = originalX;
    object.y = originalY;
  }

  private objectsIntersect(a: GardenMapObject, b: GardenMapObject): boolean {
    if (a.type === 'bed' && b.type === 'bed') {
      return this.circlesIntersect(this.bedCircle(a), this.bedCircle(b));
    }

    return this.rectsIntersect(this.objectRect(a), this.objectRect(b));
  }

  private objectRect(object: GardenMapObject): MapRect {
    const width = object.width * object.scale;
    const height = object.height * object.scale;
    const insetX = object.type === 'bed' ? width * 0.18 : width * 0.18;
    const insetTop = object.type === 'bed' ? height * 0.24 : height * 0.18;
    const insetBottom = object.type === 'bed' ? height * 0.14 : height * 0.18;
    const walkwayGap = object.type === 'bed' ? 5 : 2;

    return {
      left: object.x + insetX - walkwayGap,
      top: object.y + insetTop - walkwayGap,
      right: object.x + width - insetX + walkwayGap,
      bottom: object.y + height - insetBottom + walkwayGap
    };
  }

  private rectsIntersect(a: MapRect, b: MapRect): boolean {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  }

  private bedCircle(object: GardenMapObject): MapCircle {
    const width = object.width * object.scale;
    const height = object.height * object.scale;

    return {
      x: object.x + width / 2,
      y: object.y + height * 0.58,
      radius: Math.min(width, height) * 0.36
    };
  }

  private circlesIntersect(a: MapCircle, b: MapCircle): boolean {
    const passage = 1;

    return Math.hypot(a.x - b.x, a.y - b.y) < a.radius + b.radius + passage;
  }


  private panBy(dx: number, dy: number): void {
    this.panX += dx;
    this.panY += dy;
    this.clampPan();
  }

  private clampPan(): void {
    const scaledWidth = this.imageWidth * this.totalScale;
    const scaledHeight = this.imageHeight * this.totalScale;
    const maxX = Math.max(0, (scaledWidth - this.viewportWidth) / 2);
    const maxY = Math.max(0, (scaledHeight - this.viewportHeight) / 2);

    this.panX = Number(Math.max(-maxX, Math.min(maxX, this.panX)).toFixed(2));
    this.panY = Number(Math.max(-maxY, Math.min(maxY, this.panY)).toFixed(2));
  }

  private updateMapSize(): void {
    const coverScale = Math.max(this.viewportWidth / this.imageWidth, this.viewportHeight / this.imageHeight);

    this.baseScale = coverScale;
    this.minZoom = 1;
  }

  private touchDistance(a: Touch, b: Touch): number {
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  private isUiEvent(target: EventTarget | null): boolean {
    return target instanceof Element && Boolean(target.closest('gb-dashboard-header, gb-dashboard-nav-panel, button'));
  }
}

interface GardenMapObject {
  id: string;
  type: 'table' | 'bed';
  label: string;
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  growthSeconds?: number;
  plantedAt?: number;
  isGhost?: boolean;
}

interface ScreenPoint {
  x: number;
  y: number;
}

interface MapRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface MapCircle {
  x: number;
  y: number;
  radius: number;
}
