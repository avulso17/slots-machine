import { Scene } from "phaser";
import { Reel } from "../objects/Reel";

export class Game extends Scene {
  reels: Reel[] = [];
  result: string[] = ["cherry", "bell", "bell"];

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
    this.load.image("pig", "pig.png");
    this.load.image("nose", "pig_nose.png");
  }

  create() {
    const reelWidth = 96;
    const centerX = window.innerWidth / 2 - reelWidth * 2;
    const centerY = window.innerHeight / 2;

    this.reels = [
      new Reel(this, centerX, centerY - 200, 10),
      new Reel(this, centerX + reelWidth, centerY - 200, 15),
      new Reel(this, centerX + reelWidth * 2, centerY - 200, 20),
    ];

    // Criar botão de girar
    this.add
      .text(centerX + 120, centerY + 50, "GIRAR", {
        fontSize: "32px",
        backgroundColor: "#00ff00",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.reels[0].spin(this.result[0]);
        this.reels[1].spin(this.result[1]);
        this.reels[2].spin(this.result[2]);
      });
  }

  update() {
    this.reels.forEach((reel) => {
      reel.update();
    });
  }

  checkWin() {
    const win = this.reels.every((reel) => reel.state === "completed");
    console.log(win);
  }
}
