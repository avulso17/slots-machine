import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    this.add.text(100, 100, "Main Menu");

    this.input.once("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}
