import { Scene } from "phaser";
import { Button } from "../objects/Button";
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
    const centerX = this.game.canvas.width / 2;
    const centerY = this.game.canvas.height / 2;

    this.slotsMachine = new SlotsMachine(this, centerX - 90, centerY - 100);

    new Button(
      this,
      "Girar",
      {
        x: centerX,
        y: centerY + 150,
        variant: "primary",
        size: "md",
        width: 150,
      },
      () => {
        this.slotsMachine.spinReels();
      }
    );
  }

  update() {
    this.slotsMachine.update();
  }
}
