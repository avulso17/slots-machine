import { Scene } from "phaser";
import { Reel } from "../objects/Reel";

export class Game extends Scene {
  reels: Reel[] = [];

  // slot props
  ITEMS = ["Bell", "Cherries", "Clover", "Gem", "Lemon", "Pig", "Nose", "Star"];
  ITEM_HEIGHT = 50;
  VISIBLE_HEIGHT = this.ITEM_HEIGHT * 3;
  TOTAL_HEIGHT = this.ITEMS.length * this.ITEM_HEIGHT;
  SPEED = 1.5;

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
    this.add
      .text(centerX, centerY + 100, "GIRAR", {
        fontSize: "32px",
        backgroundColor: "#00ff00",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.reels[0].spin("cherry");
      });

    this.add
      .text(centerX, centerY + 220, "Console", {
        fontSize: "32px",
        backgroundColor: "#00ff00",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.reels[0].console();
      });
  }

  update() {
    this.reels.forEach((reel) => {
      reel.update();
    });
  }
}
