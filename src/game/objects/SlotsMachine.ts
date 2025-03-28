import { Reel, ReelAnimationType } from "./Reel";

export class SlotsMachine extends Phaser.GameObjects.Container {
  private reels: Reel[] = [];
  private result: string[] = [];
  private resultText: Phaser.GameObjects.Text;
  private isSpinning: boolean = false;
  private readonly SYMBOLS = [
    "bell",
    "cherry",
    "clover",
    "diamond",
    "lemon",
    "star",
    "nose",
  ];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.scene = scene;
    scene.add.existing(this);

    this.result = [
      Phaser.Math.RND.pick(this.SYMBOLS),
      Phaser.Math.RND.pick(this.SYMBOLS),
      Phaser.Math.RND.pick(this.SYMBOLS),
    ];

    this.createReels();
  }

  public update() {
    this.reels.forEach((reel) => {
      reel.update();
    });
  }

  private createReels() {
    const reelWidth = 56;
    const reelSpacing = 4;

    for (let i = 0; i < 3; i++) {
      const reelX = i * (reelWidth + reelSpacing) + this.x;
      const reel = new Reel(this.scene, reelX, this.y, {
        onComplete: () => this.checkReelStopped(i),
      });

      this.reels.push(reel);
    }
  }

  private checkReelStopped(reelIndex: number) {
    if (reelIndex === 2) {
      this.isSpinning = false;
      this.checkWin();
    }
  }

  public spinReels() {
    if (this.isSpinning) return;
    this.isSpinning = true;
    this.reels.forEach((reel, index) => {
      const symbol = this.result[index] ?? "bell";
      const animationType =
        index === 2
          ? (Phaser.Math.RND.pick(["bounce", "base"]) as ReelAnimationType)
          : "base";

      this.scene.time.delayedCall(index * 200, () => {
        reel.spin({ symbol, animationType });
      });
    });
  }

  public checkWin() {
    console.log(this.reels, this.result);

    const win = this.result.every((symbol) => {
      return symbol === this.result[0];
    });

    if (win) {
      console.log("win");
    }
  }
}
