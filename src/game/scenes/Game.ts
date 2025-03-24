import { Scene } from "phaser";
import { Reel } from "../objects/Reel";

export class Game extends Scene {
  reels: Reel[] = [];
  spinButton!: Phaser.GameObjects.Text;

  constructor() {
    super("Game");
  }

  preload() {
    this.load.setPath("assets/images/symbols/");

    this.load.image("cherry", "cherries.png");
    this.load.image("bell", "bell.png");
    this.load.image("star", "star.png");
    this.load.image("clover", "clover.png");
    this.load.image("diamond", "gem.png");
    this.load.image("lemon", "lemon.png");
  }

  create() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    this.reels = [new Reel(this, centerX, centerY - 200)];

    // Criar botão de girar
    this.spinButton = this.add
      .text(centerX, centerY + 100, "GIRAR", {
        fontSize: "32px",
        backgroundColor: "#00ff00",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.reels[0].spin();
      });
    this.add
      .text(centerX + 100, centerY + 100, "STOP", {
        fontSize: "32px",
        backgroundColor: "#f03000",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.reels[0].stop();
      });
  }

  update() {
    this.reels.forEach((reel) => {
      reel.update();
    });
  }
}
