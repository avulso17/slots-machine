export class Reel extends Phaser.GameObjects.Container {
  private readonly symbolSize = 44;

  private isSpinning: boolean;
  private wrapRect: Phaser.Geom.Rectangle;

  TURNS = 1;

  ITEMS = ["bell", "cherry", "clover", "diamond", "lemon", "star", "nose"];
  ITEM_SIZE = 52;
  ITEM_Y = 0;
  VISIBLE_HEIGHT = this.ITEM_SIZE * 3;
  VISIBLE_WIDTH = 96;
  TOTAL_HEIGHT = this.ITEMS.length * this.ITEM_SIZE;
  SPEED = 1.5;
  OFFSET_Y = 0;
  OFFSET_Y_TARGET = 0;
  OFFSET_Y_LIMIT = this.ITEMS.length - 1 * this.ITEM_SIZE;
  SLOTS: Phaser.GameObjects.Rectangle[] = [];
  SEQUENCE_Y = this.ITEMS.map((_, index) => {
    return index * this.ITEM_SIZE - this.ITEM_SIZE;
  });

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.scene = scene;
    scene.add.existing(this);

    this.create();

    this.SLOTS = this.getAll()
      .slice(1)
      .filter((_, index) => index % 2 === 0) as Phaser.GameObjects.Rectangle[];
  }

  create() {
    this.createReel();
    this.createSlots();
  }

  update() {
    // if (this.isSpinning) {
    //   this.OFFSET_Y += this.SPEED;

    //   this.getAll()
    //     .slice(1)
    //     .forEach((item, i) => {
    //       let y =
    //         ((this.VISIBLE_HEIGHT - this.ITEM_SIZE) / 2 -
    //           i * this.ITEM_SIZE +
    //           this.OFFSET_Y) %
    //         this.TOTAL_HEIGHT;

    //       if (y <= -this.TOTAL_HEIGHT / 2) {
    //         y += this.TOTAL_HEIGHT;
    //       } else if (y >= this.TOTAL_HEIGHT / 2) {
    //         y -= this.TOTAL_HEIGHT;
    //       }

    //       item.y = y;
    //     });
    // }

    Phaser.Actions.WrapInRectangle(
      this.getAll().slice(1),
      this.wrapRect,
      this.ITEM_SIZE
    );
  }

  // Create
  createReel() {
    this.add(
      this.scene.add
        .rectangle(0, 0, this.VISIBLE_WIDTH, this.VISIBLE_HEIGHT, 0xffffff, 1)
        .setOrigin(0, 0)
    );

    this.wrapRect = new Phaser.Geom.Rectangle(
      0,
      0,
      this.VISIBLE_WIDTH,
      this.TOTAL_HEIGHT - this.ITEM_SIZE * 2
    );
  }

  createSymbol(x: number, y: number, symbolKey: string) {
    const symbol = this.scene.add.image(x, y, symbolKey).setOrigin(0, 0);
    symbol.setDisplaySize(this.symbolSize, this.symbolSize);

    return symbol;
  }

  createSlots() {
    for (let i = 0; i < this.ITEMS.length; i++) {
      const y = i * this.ITEM_SIZE + this.ITEM_SIZE;

      const symbol = this.createSymbol(
        this.VISIBLE_WIDTH / 2 - this.symbolSize / 2,
        y + this.symbolSize / 10,
        this.ITEMS[i]
      )
        .setOrigin(0, 0)
        .setName(this.ITEMS[i])
        .setState(this.ITEMS[i]);

      const slot = this.scene.add
        .rectangle(
          this.VISIBLE_WIDTH / 2 - this.ITEM_SIZE / 2,
          y,
          this.ITEM_SIZE,
          this.ITEM_SIZE,
          0xffffff,
          1
        )
        .setOrigin(0, 0)
        .setStrokeStyle(2, 0x000000, 1)
        .setName(this.ITEMS[i])
        .setState(this.ITEMS[i]);

      this.add([slot, symbol]);
    }
  }

  createTween(steps: number) {
    const targets = this.getAll().slice(1);

    const TURN_VALUE = this.TOTAL_HEIGHT * this.TURNS;
    const Y = TURN_VALUE + this.ITEM_SIZE * steps;

    this.scene.tweens.add({
      targets: targets,
      y: `+=${Y}`,
      duration: 2000,
      ease: "Back.easeOut",
      repeat: 0,
      onComplete: () => {
        this.stop();
      },
    });
  }

  // Methods
  // funcao para spin symbols
  spin(symbol: string) {
    if (this.isSpinning) return;
    this.isSpinning = true;

    const y_result =
      this.SLOTS.find((child) => {
        return child.name === symbol;
      })?.y ?? 52;

    const current_index = this.SEQUENCE_Y.indexOf(y_result);
    const target_index = 2;

    const steps =
      (target_index - current_index + this.ITEMS.length) % this.ITEMS.length;

    this.createTween(steps);
  }

  console() {
    this.getAll().forEach((child) => {
      console.log(child);
    });
  }

  // para de girar
  stop() {
    this.isSpinning = false;
    this.OFFSET_Y = this.OFFSET_Y_TARGET % this.TOTAL_HEIGHT;
  }
}
