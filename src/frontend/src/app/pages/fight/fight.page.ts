import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import Phaser from 'phaser';

const IDLE_FRAME_FILES = [
  'ezgif-frame-001.png',
  'ezgif-frame-005.png',
  'ezgif-frame-009.png'
];

const SIDE_MOVE_FRAME_FILES = [
  'ezgif-frame-020.png',
  'ezgif-frame-028.png',
  'ezgif-frame-036.png',
  'ezgif-frame-044.png',
  'ezgif-frame-052.png'
];

const BACK_MOVE_FRAME_FILES = [
  'ezgif-frame-001.png',
  'ezgif-frame-009.png',
  'ezgif-frame-017.png',
  'ezgif-frame-025.png',
  'ezgif-frame-033.png',
  'ezgif-frame-041.png',
  'ezgif-frame-049.png',
  'ezgif-frame-057.png'
];

const FRONT_MOVE_FRAME_FILES = [
  '001.png',
  '009.png',
  '017.png',
  '025.png',
  '033.png',
  '041.png',
  '049.png',
  '057.png'
];

const SIDE_SHOOT_FRAME_FILES = [
  'ezgif-frame-007.png',
  'ezgif-frame-008.png',
  'ezgif-frame-009.png',
  'ezgif-frame-010.png',
  'ezgif-frame-011.png',
  'ezgif-frame-012.png',
  'ezgif-frame-014.png',
  'ezgif-frame-016.png',
  'ezgif-frame-018.png',
  'ezgif-frame-020.png',
  'ezgif-frame-022.png',
  'ezgif-frame-024.png',
  'ezgif-frame-026.png',
  'ezgif-frame-028.png',
  'ezgif-frame-030.png',
  'ezgif-frame-032.png',
  'ezgif-frame-034.png',
  'ezgif-frame-036.png',
  'ezgif-frame-038.png',
  'ezgif-frame-040.png',
  'ezgif-frame-042.png',
  'ezgif-frame-044.png',
  'ezgif-frame-046.png',
  'ezgif-frame-048.png',
  'ezgif-frame-050.png',
  'ezgif-frame-052.png',
  'ezgif-frame-054.png',
  'ezgif-frame-056.png'
];

const BACK_SHOOT_FRAME_FILES = [
  'ezgif-frame-001.png',
  'ezgif-frame-003.png',
  'ezgif-frame-005.png',
  'ezgif-frame-007.png',
  'ezgif-frame-009.png',
  'ezgif-frame-011.png',
  'ezgif-frame-013.png',
  'ezgif-frame-015.png',
  'ezgif-frame-017.png',
  'ezgif-frame-019.png',
  'ezgif-frame-021.png',
  'ezgif-frame-023.png',
  'ezgif-frame-025.png',
  'ezgif-frame-027.png',
  'ezgif-frame-029.png',
  'ezgif-frame-031.png',
  'ezgif-frame-033.png',
  'ezgif-frame-035.png',
  'ezgif-frame-037.png',
  'ezgif-frame-039.png',
  'ezgif-frame-041.png',
  'ezgif-frame-043.png',
  'ezgif-frame-045.png',
  'ezgif-frame-047.png',
  'ezgif-frame-049.png',
  'ezgif-frame-051.png',
  'ezgif-frame-053.png',
  'ezgif-frame-055.png',
  'ezgif-frame-057.png',
  'ezgif-frame-059.png'
];

const FRONT_SHOOT_FRAME_FILES = [
  'ezgif-frame-001.png',
  'ezgif-frame-003.png',
  'ezgif-frame-005.png',
  'ezgif-frame-007.png',
  'ezgif-frame-009.png',
  'ezgif-frame-011.png',
  'ezgif-frame-013.png',
  'ezgif-frame-015.png',
  'ezgif-frame-017.png',
  'ezgif-frame-019.png',
  'ezgif-frame-021.png',
  'ezgif-frame-023.png',
  'ezgif-frame-025.png',
  'ezgif-frame-027.png',
  'ezgif-frame-029.png',
  'ezgif-frame-031.png',
  'ezgif-frame-033.png',
  'ezgif-frame-035.png',
  'ezgif-frame-037.png',
  'ezgif-frame-039.png',
  'ezgif-frame-041.png',
  'ezgif-frame-043.png',
  'ezgif-frame-045.png',
  'ezgif-frame-047.png',
  'ezgif-frame-049.png',
  'ezgif-frame-051.png',
  'ezgif-frame-053.png',
  'ezgif-frame-055.png',
  'ezgif-frame-057.png',
  'ezgif-frame-059.png'
];

const FRAME_ASSET_VERSION = 'controlled-unit-v4';
const ATTACK_RANGE_BUFFER = 18;
const ATTACK_COOLDOWN_MS = 550;
const DOUBLE_TAP_MS = 280;

type MoveDirection = 'side' | 'back' | 'front';

type MoveFrameSet = {
  direction: MoveDirection;
  frameCount: number;
  flipX: boolean;
};

type FighterUnit = {
  id: string;
  attackRange: number;
  sprite: Phaser.GameObjects.Sprite;
  shadow: Phaser.GameObjects.Ellipse;
  selection: Phaser.GameObjects.Ellipse;
  rangeMarker: Phaser.GameObjects.Ellipse;
  moveEvent: Phaser.Time.TimerEvent | null;
  attackTarget: FighterUnit | null;
  isAttacking: boolean;
  nextAttackAt: number;
};

class FightMoveScene extends Phaser.Scene {
  private pressedUnit: FighterUnit | null = null;
  private pendingUnitTap: { unit: FighterUnit; selectedBeforeTap: FighterUnit | null } | null = null;
  private pendingUnitTapEvent: Phaser.Time.TimerEvent | null = null;
  private selectedUnit: FighterUnit | null = null;
  private units: FighterUnit[] = [];

  constructor() {
    super('FightMoveScene');
  }

  preload(): void {
    this.load.image('battle-background', 'assets/fight/backgrounds/battle.png');

    IDLE_FRAME_FILES.forEach((fileName, index) => {
      this.load.image(this.idleFrameKey(index), `assets/fight/black-idle-game-alpha/${fileName}?v=${FRAME_ASSET_VERSION}`);
    });

    SIDE_MOVE_FRAME_FILES.forEach((fileName, index) => {
      this.load.image(this.sideMoveFrameKey(index), `assets/fight/black-moove-game-alpha/${fileName}?v=${FRAME_ASSET_VERSION}`);
    });

    BACK_MOVE_FRAME_FILES.forEach((fileName, index) => {
      this.load.image(this.backMoveFrameKey(index), `assets/fight/black-back-moove-game-alpha/${fileName}?v=${FRAME_ASSET_VERSION}`);
    });

    FRONT_MOVE_FRAME_FILES.forEach((fileName, index) => {
      this.load.image(this.frontMoveFrameKey(index), `assets/fight/black-back-front-game-alpha/${fileName}?v=${FRAME_ASSET_VERSION}`);
    });

    SIDE_SHOOT_FRAME_FILES.forEach((fileName, index) => {
      this.load.image(this.sideShootFrameKey(index), `assets/fight/black-attack2-game-alpha/${fileName}?v=${FRAME_ASSET_VERSION}`);
    });

    BACK_SHOOT_FRAME_FILES.forEach((fileName, index) => {
      this.load.image(this.backShootFrameKey(index), `assets/fight/black-fire-back-game-alpha/${fileName}?v=${FRAME_ASSET_VERSION}`);
    });

    FRONT_SHOOT_FRAME_FILES.forEach((fileName, index) => {
      this.load.image(this.frontShootFrameKey(index), `assets/fight/black-fire-front-game-alpha/${fileName}?v=${FRAME_ASSET_VERSION}`);
    });
  }

  create(): void {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#11170d');
    this.addCoverImage('battle-background', width / 2, height / 2, width, height);

    this.anims.create({
      key: 'tomato-idle',
      frames: IDLE_FRAME_FILES.map((_, index) => ({ key: this.idleFrameKey(index) })),
      frameRate: 2,
      repeat: -1
    });

    this.anims.create({
      key: 'tomato-move',
      frames: SIDE_MOVE_FRAME_FILES.map((_, index) => ({ key: this.sideMoveFrameKey(index) })),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'tomato-side-shoot',
      frames: SIDE_SHOOT_FRAME_FILES.map((_, index) => ({ key: this.sideShootFrameKey(index) })),
      frameRate: 12,
      repeat: 0
    });

    this.anims.create({
      key: 'tomato-back-shoot',
      frames: BACK_SHOOT_FRAME_FILES.map((_, index) => ({ key: this.backShootFrameKey(index) })),
      frameRate: 12,
      repeat: 0
    });

    this.anims.create({
      key: 'tomato-front-shoot',
      frames: FRONT_SHOOT_FRAME_FILES.map((_, index) => ({ key: this.frontShootFrameKey(index) })),
      frameRate: 12,
      repeat: 0
    });

    const rangedFighter = this.createFighterUnit({
      id: 'ranged',
      x: width * 0.16,
      y: height * 0.58,
      attackRange: 190,
      tint: 0xffffff
    });
    const meleeFighter = this.createFighterUnit({
      id: 'melee',
      x: width * 0.72,
      y: height * 0.45,
      attackRange: 78,
      tint: 0x99d7ff
    });

    meleeFighter.sprite.setFlipX(true);
    this.units = [rangedFighter, meleeFighter];
    this.selectUnit(rangedFighter);

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[]) => {
      const clickedUnit = this.findClickedUnit(gameObjects);

      if (clickedUnit) {
        this.pressedUnit = clickedUnit;
        return;
      }

      this.pressedUnit = null;
      this.clearPendingUnitTap();

      if (!this.selectedUnit) {
        return;
      }

      const targetX = Phaser.Math.Clamp(pointer.x, 58, width - 58);
      const targetY = Phaser.Math.Clamp(pointer.y, 130, height - 58);
      this.playSteppedMove(this.selectedUnit, targetX, targetY);
    });

    this.input.on('pointerup', () => {
      if (!this.pressedUnit) {
        return;
      }

      const clickedUnit = this.pressedUnit;
      this.pressedUnit = null;
      this.handleUnitTap(clickedUnit);
    });
  }

  update(time: number): void {
    this.evaluateAutoAttacks(time);
  }

  private createFighterUnit(config: { id: string; x: number; y: number; attackRange: number; tint: number }): FighterUnit {
    const shadow = this.add.ellipse(config.x, config.y + 22, 92, 24, 0x000000, 0.34);
    shadow.setDepth(1);

    const rangeMarker = this.add.ellipse(config.x, config.y, config.attackRange * 2, config.attackRange * 2);
    rangeMarker.setStrokeStyle(1, 0xff7043, 0.34);
    rangeMarker.setDepth(1.2);
    rangeMarker.setVisible(false);

    const selection = this.add.ellipse(config.x, config.y + 8, 108, 34);
    selection.setStrokeStyle(2, 0xffd45a, 0.9);
    selection.setDepth(1.5);
    selection.setVisible(false);

    const sprite = this.add.sprite(config.x, config.y, this.sideMoveFrameKey(0));
    sprite.setOrigin(0.5, 0.78);
    sprite.setDepth(2);
    sprite.setTint(config.tint);
    sprite.setInteractive({
      pixelPerfect: true,
      alphaTolerance: 10
    });
    sprite.play('tomato-idle');

    const unit = {
      id: config.id,
      attackRange: config.attackRange,
      sprite,
      shadow,
      selection,
      rangeMarker,
      moveEvent: null,
      attackTarget: null,
      isAttacking: false,
      nextAttackAt: 0
    };

    this.syncGroundMarkers(unit);
    this.applyDepthScale(unit);

    return unit;
  }

  private selectUnit(unit: FighterUnit): void {
    this.selectedUnit = unit;
    this.units.forEach((fighterUnit) => {
      const isSelected = fighterUnit === unit;
      fighterUnit.selection.setVisible(isSelected);
      fighterUnit.rangeMarker.setVisible(isSelected);
    });
  }

  private findClickedUnit(gameObjects: Phaser.GameObjects.GameObject[]): FighterUnit | null {
    return this.units.find((unit) => gameObjects.includes(unit.sprite)) ?? null;
  }

  private handleUnitTap(unit: FighterUnit): void {
    if (this.pendingUnitTap?.unit === unit) {
      const attacker = this.pendingUnitTap.selectedBeforeTap;
      this.clearPendingUnitTap();

      if (attacker && attacker !== unit) {
        this.commandAttack(attacker, unit);
        return;
      }

      this.selectUnit(unit);
      return;
    }

    this.clearPendingUnitTap();
    this.pendingUnitTap = {
      unit,
      selectedBeforeTap: this.selectedUnit
    };
    this.pendingUnitTapEvent = this.time.delayedCall(DOUBLE_TAP_MS, () => {
      this.selectUnit(unit);
      this.clearPendingUnitTap();
    });
  }

  private clearPendingUnitTap(): void {
    this.pendingUnitTapEvent?.remove(false);
    this.pendingUnitTapEvent = null;
    this.pendingUnitTap = null;
  }

  private commandAttack(attacker: FighterUnit, target: FighterUnit): void {
    attacker.attackTarget = target;

    const deltaX = target.sprite.x - attacker.sprite.x;
    const deltaY = target.sprite.y - attacker.sprite.y;
    const distance = Math.hypot(deltaX, deltaY);

    if (this.isTargetInAttackRange(attacker, target)) {
      this.faceTargetAndAttack(attacker, target);
      return;
    }

    const stopDistance = Math.max(8, attacker.attackRange - ATTACK_RANGE_BUFFER);
    const approachDistance = Math.max(0, distance - stopDistance);
    const targetX = attacker.sprite.x + (deltaX / distance) * approachDistance;
    const targetY = attacker.sprite.y + (deltaY / distance) * approachDistance;
    this.playSteppedMove(attacker, targetX, targetY, target);
  }

  private idleFrameKey(index: number): string {
    return `tomato-idle-${index + 1}`;
  }

  private sideMoveFrameKey(index: number): string {
    return `tomato-side-move-${index + 1}`;
  }

  private backMoveFrameKey(index: number): string {
    return `tomato-back-move-${index + 1}`;
  }

  private frontMoveFrameKey(index: number): string {
    return `tomato-front-move-${index + 1}`;
  }

  private sideShootFrameKey(index: number): string {
    return `tomato-side-shoot-${index + 1}`;
  }

  private backShootFrameKey(index: number): string {
    return `tomato-back-shoot-${index + 1}`;
  }

  private frontShootFrameKey(index: number): string {
    return `tomato-front-shoot-${index + 1}`;
  }

  private playSteppedMove(
    unit: FighterUnit,
    targetX: number,
    targetY: number,
    attackTarget: FighterUnit | null = null
  ): void {
    unit.moveEvent?.remove(false);
    unit.moveEvent = null;
    unit.attackTarget = attackTarget;
    unit.isAttacking = false;

    const deltaX = targetX - unit.sprite.x;
    const deltaY = targetY - unit.sprite.y;
    const frameSet = this.resolveMoveFrameSet(deltaX, deltaY);
    const distance = Math.hypot(deltaX, deltaY);
    const totalSteps = Math.max(1, Math.round(distance / 9));
    const stepX = deltaX / totalSteps;
    const stepY = deltaY / totalSteps;
    let step = 0;

    unit.sprite.stop();
    unit.sprite.off(Phaser.Animations.Events.ANIMATION_COMPLETE);
    unit.sprite.setFlipX(frameSet.flipX);

    unit.moveEvent = this.time.addEvent({
      delay: 150,
      repeat: totalSteps - 1,
      callback: () => {
        const frameIndex = step % frameSet.frameCount;
        unit.sprite.setTexture(this.moveFrameTextureKey(frameSet.direction, frameIndex));
        unit.sprite.x += stepX;
        unit.sprite.y += stepY;
        this.syncGroundMarkers(unit);
        this.applyDepthScale(unit);
        step += 1;

        if (attackTarget && this.isTargetInAttackRange(unit, attackTarget)) {
          this.faceTargetAndAttack(unit, attackTarget);
          unit.moveEvent?.remove(false);
          unit.moveEvent = null;
          return;
        }

        if (step >= totalSteps) {
          unit.sprite.x = targetX;
          unit.sprite.y = targetY;
          this.syncGroundMarkers(unit);
          this.applyDepthScale(unit);
          attackTarget ? this.faceTargetAndAttack(unit, attackTarget) : unit.sprite.play('tomato-idle');
          unit.moveEvent = null;
        }
      }
    });
  }

  private resolveMoveFrameSet(deltaX: number, deltaY: number): MoveFrameSet {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absY > absX * 0.6) {
      return {
        direction: deltaY < 0 ? 'back' : 'front',
        frameCount: deltaY < 0 ? BACK_MOVE_FRAME_FILES.length : FRONT_MOVE_FRAME_FILES.length,
        flipX: deltaX < -3
      };
    }

    return {
      direction: 'side',
      frameCount: SIDE_MOVE_FRAME_FILES.length,
      flipX: deltaX < 0
    };
  }

  private moveFrameTextureKey(direction: MoveDirection, index: number): string {
    if (direction === 'back') {
      return this.backMoveFrameKey(index);
    }

    if (direction === 'front') {
      return this.frontMoveFrameKey(index);
    }

    return this.sideMoveFrameKey(index);
  }

  private syncGroundMarkers(unit: FighterUnit): void {
    unit.shadow.setPosition(unit.sprite.x, unit.sprite.y + 22);
    unit.selection.setPosition(unit.sprite.x, unit.sprite.y + 8);
    unit.rangeMarker.setPosition(unit.sprite.x, unit.sprite.y);
  }

  private applyDepthScale(unit: FighterUnit): void {
    const scale = Phaser.Math.Clamp(0.78 + ((unit.sprite.y - 130) / (this.scale.height - 188)) * 0.34, 0.78, 1.12);

    unit.sprite.setScale(scale);
    unit.shadow.setScale(scale, scale);
    unit.selection.setScale(scale, scale);
    unit.sprite.setDepth(2 + unit.sprite.y / 1000);
    unit.shadow.setDepth(1 + unit.sprite.y / 1000);
    unit.selection.setDepth(1.5 + unit.sprite.y / 1000);
    unit.rangeMarker.setDepth(1.1 + unit.sprite.y / 1000);
  }

  private faceTargetAndAttack(attacker: FighterUnit, target: FighterUnit): void {
    attacker.moveEvent?.remove(false);
    attacker.moveEvent = null;

    const deltaX = target.sprite.x - attacker.sprite.x;
    const deltaY = target.sprite.y - attacker.sprite.y;
    const frameSet = this.resolveMoveFrameSet(deltaX, deltaY);
    this.playShoot(attacker, frameSet);
  }

  private playShoot(unit: FighterUnit, frameSet: MoveFrameSet): void {
    if (unit.isAttacking || this.time.now < unit.nextAttackAt) {
      return;
    }

    unit.isAttacking = true;
    unit.sprite.setFlipX(frameSet.flipX);
    unit.sprite.play(this.shootAnimationKey(frameSet.direction));
    unit.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (animation: Phaser.Animations.Animation) => {
      if (animation.key === this.shootAnimationKey(frameSet.direction)) {
        unit.isAttacking = false;
        unit.nextAttackAt = this.time.now + ATTACK_COOLDOWN_MS;
        unit.sprite.play('tomato-idle');
      }
    });
  }

  private distanceBetween(first: FighterUnit, second: FighterUnit): number {
    return Math.hypot(first.sprite.x - second.sprite.x, first.sprite.y - second.sprite.y);
  }

  private isTargetInAttackRange(attacker: FighterUnit, target: FighterUnit): boolean {
    return this.distanceBetween(attacker, target) <= attacker.attackRange;
  }

  private evaluateAutoAttacks(time: number): void {
    this.units.forEach((unit) => {
      if (unit.moveEvent || unit.isAttacking) {
        return;
      }

      if (unit.attackTarget && !this.isTargetInAttackRange(unit, unit.attackTarget)) {
        this.commandAttack(unit, unit.attackTarget);
        return;
      }

      if (time < unit.nextAttackAt) {
        return;
      }

      const target = unit.attackTarget && this.isTargetInAttackRange(unit, unit.attackTarget)
        ? unit.attackTarget
        : this.findClosestTargetInRange(unit);

      if (target) {
        this.faceTargetAndAttack(unit, target);
      }
    });
  }

  private findClosestTargetInRange(attacker: FighterUnit): FighterUnit | null {
    return this.units
      .filter((unit) => unit !== attacker && this.isTargetInAttackRange(attacker, unit))
      .sort((first, second) => this.distanceBetween(attacker, first) - this.distanceBetween(attacker, second))[0] ?? null;
  }

  private shootAnimationKey(direction: MoveDirection): string {
    if (direction === 'back') {
      return 'tomato-back-shoot';
    }

    if (direction === 'front') {
      return 'tomato-front-shoot';
    }

    return 'tomato-side-shoot';
  }

  private addCoverImage(key: string, x: number, y: number, width: number, height: number): Phaser.GameObjects.Image {
    const image = this.add.image(x, y, key);
    const texture = this.textures.get(key).getSourceImage() as HTMLImageElement;
    const scale = Math.max(width / texture.width, height / texture.height);

    image.setScale(scale);
    image.setDepth(-10);

    return image;
  }
}

@Component({
  standalone: true,
  imports: [IonContent],
  templateUrl: './fight.page.html',
  styleUrl: './fight.page.scss'
})
export class FightPage implements AfterViewInit, OnDestroy {
  @ViewChild('phaserHost', { static: true })
  private readonly phaserHost!: ElementRef<HTMLDivElement>;

  private game: Phaser.Game | null = null;
  private refreshTimerId: ReturnType<typeof window.setTimeout> | null = null;

  ngAfterViewInit(): void {
    this.game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: this.phaserHost.nativeElement,
      width: 430,
      height: 620,
      backgroundColor: '#11170d',
      scene: FightMoveScene,
      render: {
        transparent: false,
        antialias: true
      }
    });

    this.refreshTimerId = window.setTimeout(() => {
      this.game?.scale.refresh();
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.refreshTimerId) {
      window.clearTimeout(this.refreshTimerId);
      this.refreshTimerId = null;
    }

    this.game?.destroy(true);
    this.game = null;
  }
}
