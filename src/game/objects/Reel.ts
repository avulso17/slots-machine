export class Reel extends Phaser.GameObjects.Container {
  public TURNS = 2;
  private SLOTS: Phaser.GameObjects.Rectangle[] = [];
  private isSpinning: boolean;
  private wrapRect: Phaser.Geom.Rectangle;
  private readonly ITEMS = [
    "bell",
    "cherry",
    "clover",
    "diamond",
    "lemon",
    "star",
    "nose",
  ];
  private readonly SPEED_FACTOR = 0.5;
  private readonly SPIN_DURATION = 1000;
  private readonly ITEM_SIZE = 52;
  private readonly SYMBOL_SIZE = 44;
  private readonly VISIBLE_HEIGHT = this.ITEM_SIZE * 3;
  private readonly VISIBLE_WIDTH = 96;
  private readonly TOTAL_HEIGHT = this.ITEMS.length * this.ITEM_SIZE;
  private readonly SEQUENCE_Y = this.ITEMS.map((_, index) => {
    return index * this.ITEM_SIZE - this.ITEM_SIZE;
  });

  constructor(scene: Phaser.Scene, x: number, y: number, turns?: number) {
    super(scene, x, y);
    this.scene = scene;
    scene.add.existing(this);

    this.create();

    this.SLOTS = this.getAll()
      .slice(1)
      .filter((_, index) => index % 2 === 0) as Phaser.GameObjects.Rectangle[];

    if (turns) {
      this.TURNS = turns;
    }
  }

  private create() {
    this.createReel();
    this.createSlots();

    // Criar uma máscara gráfica para limitar a visibilidade
    const mask = this.scene.make.graphics({});
    mask.fillStyle(0xffffff);
    mask.fillRect(this.x, this.y, this.VISIBLE_WIDTH, this.VISIBLE_HEIGHT);

    // Aplicar a máscara a este container
    this.setMask(new Phaser.Display.Masks.GeometryMask(this.scene, mask));
  }

  update() {
    Phaser.Actions.WrapInRectangle(
      this.getAll().slice(1),
      this.wrapRect,
      this.ITEM_SIZE
    );
  }

  // Create
  private createReel() {
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

  private createSymbol(x: number, y: number, symbolKey: string) {
    const symbol = this.scene.add.image(x, y, symbolKey).setOrigin(0, 0);
    symbol.setDisplaySize(this.SYMBOL_SIZE, this.SYMBOL_SIZE);

    return symbol;
  }

  private createSlots() {
    for (let i = 0; i < this.ITEMS.length; i++) {
      const y = i * this.ITEM_SIZE + this.ITEM_SIZE;

      const symbol = this.createSymbol(
        this.VISIBLE_WIDTH / 2 - this.SYMBOL_SIZE / 2,
        y + this.SYMBOL_SIZE / 10,
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
        .setName(this.ITEMS[i])
        .setState(this.ITEMS[i]);

      this.add([slot, symbol]);
    }
  }

  private initSpinAnimation(steps: number) {
    const targets = this.getAll().slice(1);

    const TURN_VALUE = this.TOTAL_HEIGHT * this.TURNS;
    const Y = TURN_VALUE + this.ITEM_SIZE * steps;

    const distanceFactor = Y / this.ITEM_SIZE;

    const duration =
      this.SPIN_DURATION + distanceFactor * this.SPEED_FACTOR * 100;

    this.scene.tweens.add({
      targets: targets,
      y: `+=${Y}`,
      duration,
      ease: "Back",
      easeParams: [0.3],
      repeat: 0,
      onComplete: () => {
        this.stop();
      },
    });
  }

  // Methods
  // funcao para spin symbols
  public spin(symbol: string) {
    if (this.isSpinning) return;
    this.isSpinning = true;
    this.setState("spinning");

    const y_result =
      this.SLOTS.find((child) => {
        return child.name === symbol;
      })?.y ?? 52;

    const current_index = this.SEQUENCE_Y.indexOf(y_result);
    const target_index = 2;

    const steps =
      (target_index - current_index + this.ITEMS.length) % this.ITEMS.length;

    this.initSpinAnimation(steps);
  }

  public console() {
    this.getAll().forEach((child) => {
      console.log(child);
    });
  }

  private stop() {
    this.isSpinning = false;
    this.setState("completed");
  }
}
