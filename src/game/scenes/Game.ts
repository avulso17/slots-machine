import { Scene } from "phaser";
import { SlotsMachine } from "../objects/SlotsMachine";

export class Game extends Scene {
  private slotsMachine: SlotsMachine;

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

    this.slotsMachine = new SlotsMachine(this, 0, 0);

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
        this.slotsMachine.spinReels();
        console.log(this.slotsMachine);
      });
  }

  update() {
    this.slotsMachine.update();
  }
}
