export class Text extends Phaser.GameObjects.Text {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string | string[],
    style: Phaser.Types.GameObjects.Text.TextStyle
  ) {
    super(scene, x, y, text, style);
    this.scene.add.existing(this);

    this.setFontFamily("aglet-ultra");
    this.setFontSize(style.fontSize ?? 32);
    this.setColor(style.color ?? "#EAEAEA");
    this.setStroke(style.stroke ?? "#41001F", style.strokeThickness ?? 4);
    this.setShadow(0, 3, style.shadow?.color ?? "#41001F", 0, true, true);
  }
}
