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
    const reelWidth = 96;
    const centerX = 185;
    const centerY = 362;

    this.slotsMachine = new SlotsMachine(this, centerX - 90, centerY - 100);

    const button = new Button(this, {
      x: centerX,
      y: centerY + 250,
      texture: "button-primary",
      height: 56,
      width: 200,
    })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.slotsMachine.spinReels();
        // this.slotsMachine.console();
      });

    this.tweens.add({
      targets: button,
      scale: 1.1,
      duration: 1000,
      ease: "sine.inout",
      yoyo: true,
      repeat: -1,
    });
  }

  update() {
    this.slotsMachine.update();
  }
}
