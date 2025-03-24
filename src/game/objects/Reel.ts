export class Reel extends Phaser.GameObjects.Container {
  private slots: Phaser.GameObjects.Image[] = [];
  private symbolKeys = ["cherry", "bell", "star", "clover", "lemon", "diamond"];
  private result: string;
  private readonly slotSize = 52;
  private readonly symbolSize = 44;
  private readonly reelHeight = 3 * this.slotSize;
  private readonly reelWidth = 96;
  private readonly animationDuration = 2000;
  private readonly spinSpeed = 4;
  private isSpinning: boolean;
  private wrapRect: Phaser.Geom.Rectangle;

  private timer: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.scene = scene;
    scene.add.existing(this);

    this.create();
  }

  create() {
    this.createReel();
    this.createSlots();
  }

  update() {
    if (this.isSpinning) {
      Phaser.Actions.IncY(this.getAll().slice(1), this.spinSpeed);
    }

    Phaser.Actions.WrapInRectangle(
      this.getAll().slice(1),
      this.wrapRect,
      this.slotSize
    );
  }

  // Create
  createReel() {
    this.add(
      this.scene.add
        .rectangle(0, 0, this.reelWidth, this.reelHeight, 0xffffff, 1)
        .setOrigin(0, 0)
    );

    this.wrapRect = new Phaser.Geom.Rectangle(
      0,
      0,
      this.reelWidth,
      this.reelHeight
    );
  }

  createSymbol(x: number, y: number, symbolKey: string) {
    const symbol = this.scene.add.image(x, y, symbolKey).setOrigin(0, 0);
    symbol.setDisplaySize(this.symbolSize, this.symbolSize);

    return symbol;
  }

  createSlots() {
    const centerX = this.reelWidth / 2 - this.slotSize / 2;

    for (let i = 0; i < 5; i++) {
      // const slot = this.createSymbol(
      //   centerX,
      //   i * this.slotSize,
      //   this.symbolKeys[i]
      // );

      const slot = this.scene.add
        .rectangle(
          centerX,
          i * this.slotSize,
          this.slotSize,
          this.slotSize,
          0xffffff,
          1
        )
        .setOrigin(0, 0)
        .setStrokeStyle(2, 0x000000, 1);

      this.add(slot);
    }
  }

  // Methods
  // funcao para spin symbols
  spin() {
    if (this.isSpinning) return;
    this.isSpinning = true;
  }

  // para de girar
  stop() {
    this.isSpinning = false;
  }

  // ao parar de girar, deve alinhar os símbolos à grade de 44px
  alignReel() {
    Phaser.Actions.IncY(this.getAll().slice(1), 1);
    Phaser.Actions.WrapInRectangle(
      this.getAll().slice(1),
      this.wrapRect,
      this.slotSize
    );
    this.getAll()
      .slice(1)
      .forEach((symbol) => {
        symbol.y = symbol.y - 1;
      });
  }

  // deve setar o resultado de acordo com o símbolo central
  setResult() {}
}
