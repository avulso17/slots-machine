import { Scene } from "phaser";

export class Button extends Phaser.GameObjects.NineSlice {
  constructor(
    scene: Scene,
    x: number,
    y: number,
    texture: string,
    frame: string,
    width: number,
    height: number,
    leftWidth: number,
    rightWidth: number,
    topHeight: number,
    bottomHeight: number
  ) {
    super(
      scene,
      x,
      y,
      texture,
      frame,
      width,
      height,
      leftWidth,
      rightWidth,
      topHeight,
      bottomHeight
    );

    this.scene.add.existing(this);
  }
}
