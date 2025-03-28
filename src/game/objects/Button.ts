import { Text } from "./Text";

type ButtonConfig = {
  x: number;
  y: number;
  texture: string;
  width: number;
  height: number;
};

export class Button extends Phaser.GameObjects.Container {
  private callback: () => void;
  private isDisabled: boolean;
  private button: Phaser.GameObjects.NineSlice;
  private text: Phaser.GameObjects.Text;
  constructor(
    scene: Phaser.Scene,
    text: string,
    config: ButtonConfig,
    callback: () => void
  ) {
    super(scene, config.x, config.y);
    this.scene = scene;
    this.callback = callback;
    this.isDisabled = false; // Estado inicial habilitado

    // Criando a imagem do botão
    this.button = this.scene.add
      .nineslice(
        0,
        0,
        config.texture,
        undefined,
        config.width,
        config.height,
        28,
        28
      )
      .setInteractive();
    this.add(this.button);

    // Criando o texto do botão
    this.text = new Text(this.scene, 0, 0, text, {
      fontSize: "32px",
    });
    this.text.setOrigin(0.5, 0.5);
    this.text.setDepth(1);
    this.add(this.text);

    // Adiciona interatividade
    this.button.on("pointerdown", this.onPress, this);
    this.button.on("pointerup", this.onRelease, this);
    this.button.on("pointerout", this.onCancel, this);

    // Adiciona à cena
    this.scene.add.existing(this);
  }

  onPress() {
    if (this.isDisabled) return;
    if (this.callback) this.callback();
    this.scene.tweens.add({
      targets: [this.button, this.text],
      scaleX: 0.9,
      scaleY: 0.9,
      duration: 100,
      ease: "Quad.easeOut",
    });
  }

  onRelease() {
    if (this.isDisabled) return;
    this.scene.tweens.add({
      targets: [this.button, this.text],
      scaleX: 1,
      scaleY: 1,
      duration: 100,
      ease: "Quad.easeOut",
    });
  }

  onCancel() {
    if (this.isDisabled) return;
    this.scene.tweens.add({
      targets: [this.button, this.text],
      scaleX: 1,
      scaleY: 1,
      duration: 100,
      ease: "Quad.easeOut",
    });
  }

  setDisabled(disabled: boolean) {
    this.isDisabled = disabled;
    this.button.setTint(disabled ? 0x666666 : 0xffffff);
    this.button.disableInteractive(disabled);
  }
}
