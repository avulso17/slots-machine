import { Reel } from "./Reel";

export class SlotsMachine extends Phaser.GameObjects.Container {
  private reels: Reel[] = [];
  private result: string[] = ["nose", "nose", "nose"];
  private resultText: Phaser.GameObjects.Text;
  private isSpinning: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.scene = scene;
    scene.add.existing(this);

    this.create();
  }

  public update() {
    this.reels.forEach((reel) => {
      reel.update();
    });
  }

  private create() {
    this.createReels();
  }

  private createReels() {
    const reelWidth = 96;

    for (let i = 0; i < 3; i++) {
      const turns = i + 8;
      const x = i * reelWidth;
      const reel = new Reel(this.scene, x, 0, {
        turns,
        onComplete: () => {
          if (i === 2) {
            this.checkWin();
          }
        },
      });

      this.reels.push(reel);
      this.add(reel);
    }
  }

  public spinReels() {
    this.reels.forEach((reel) => {
      reel.spin(this.result[0]);
      reel.spin(this.result[1]);
      reel.spin(this.result[2]);
    });
  }

  public checkWin() {
    console.log(this.reels, this.result);
  }
}
