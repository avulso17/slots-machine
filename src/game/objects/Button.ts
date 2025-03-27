export type ButtonProps = {
  x: number;
  y: number;
  texture: string;
  height?: number;
  width?: number;
};

export class Button extends Phaser.GameObjects.NineSlice {
  text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, props: ButtonProps) {
    super(
      scene,
      props.x,
      props.y,
      props.texture,
      undefined,
      props.width ?? 102,
      props.height ?? 56,
      28,
      28
    );
    this.scene = scene;
    this.setName("button-primary");

    this.setText("Girar");

    this.preFX?.addShine(1, 0.2, 5);

    this.scene.add.existing(this);
  }

  public setText(text: string) {
    const centerX = this.x;
    const centerY = this.y;

    this.text = this.scene.add
      .text(centerX, centerY, text, {
        fontSize: "32px",
        fontFamily: "aglet-ultra",
        color: "#EAEAEA",
        stroke: "#41001F",
        strokeThickness: 4,
        shadow: {
          color: "#41001F",
          offsetX: 0,
          offsetY: 2,
          blur: 0,
          stroke: true,
        },
        padding: { x: 10, y: 5 },
      })
      .setDepth(1)
      .setOrigin(0.5, 0.5);
  }

  public onPointerDown() {
    this.text.setStyle({
      color: "#41001F",
    });
  }

  public onPointerUp() {
    this.text.setStyle({
      color: "#EAEAEA",
    });
  }
}
