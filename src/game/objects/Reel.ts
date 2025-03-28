type AnimationType = "base" | "bounce";

type ReelConfig = {
  onComplete: () => void;
  turns?: number;
};

type SpinConfig = {
  symbol: string;
  animationType?: AnimationType;
};

export class Reel extends Phaser.GameObjects.Container {
  public onComplete: () => void;
  public TURNS = 2;
  private isSpinning: boolean;
  private wrapRect: Phaser.Geom.Rectangle;
  private SLOTS: Phaser.GameObjects.Rectangle[] = [];
  private readonly ITEMS = Phaser.Utils.Array.Shuffle([
    "bell",
    "cherry",
    "clover",
    "diamond",
    "lemon",
    "star",
    "nose",
  ]);
  private readonly SPEED_FACTOR = 0.15;
  private readonly SPIN_DURATION = 250;
  private readonly ITEM_SIZE = 52;
  private readonly SYMBOL_SIZE = 44;
  private readonly VISIBLE_HEIGHT = this.ITEM_SIZE * 3;
  private readonly VISIBLE_WIDTH = 56;
  private readonly TOTAL_HEIGHT = this.ITEMS.length * this.ITEM_SIZE;
  private readonly SEQUENCE_Y = this.ITEMS.map((_, index) => {
    return index * this.ITEM_SIZE - this.ITEM_SIZE;
  });

  constructor(scene: Phaser.Scene, x: number, y: number, config: ReelConfig) {
    super(scene, x, y);
    this.scene = scene;
    this.setName("reel");
    this.create();
    this.onComplete = config.onComplete;
    this.TURNS = config.turns ?? 2;
    this.SLOTS = this.getAll()
      .slice(1)
      .filter((_, index) => index % 2 === 0) as Phaser.GameObjects.Rectangle[];

    scene.add.existing(this);
  }

  private create() {
    this.createReel();
    this.createSlots();
    this.createMask();
  }

  public update() {
    Phaser.Actions.WrapInRectangle(
      this.getAll().slice(1),
      this.wrapRect,
      this.ITEM_SIZE
    );

    this.on("update", () => {
      console.log("update");
    });
  }

  // Create
  private createReel() {
    const reel = this.scene.add
      .rectangle(0, 0, this.VISIBLE_WIDTH, this.VISIBLE_HEIGHT, 0xffffff, 1)
      .setOrigin(0, 0)
      .setName("reel-background");

    this.add(reel);

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

  private createMask() {
    // Criar uma máscara gráfica para limitar a visibilidade
    const maskShape = this.scene.make.graphics();
    maskShape.fillStyle(0xffffff);
    maskShape.fillRect(this.x, this.y, this.VISIBLE_WIDTH, this.VISIBLE_HEIGHT);
    maskShape.setName("mask");

    const mask = maskShape.createGeometryMask();

    // Aplicar a máscara a este container
    this.setMask(mask);
  }

  private initSpinAnimation(steps: number, animationType?: "base" | "bounce") {
    const targets = this.getAll().slice(1);

    const TURN_VALUE = this.TOTAL_HEIGHT * this.TURNS;
    const Y = TURN_VALUE + this.ITEM_SIZE * steps;

    const distanceFactor = Y / this.ITEM_SIZE;

    const duration =
      this.SPIN_DURATION + distanceFactor * this.SPEED_FACTOR * 100;

    let tweens = [] as any[];

    if (animationType === "bounce") {
      tweens = [
        {
          y: `+=${Y}`,
          duration,
          ease: "Linear",
          repeat: 0,
        },
        {
          y: `+=${this.TOTAL_HEIGHT - this.ITEM_SIZE}`,
          duration: 1100,
          ease: "Quad.out",
          repeat: 0,
        },
        {
          y: "+=52",
          duration: 400,
          ease: "Back.out",
          repeat: 0,
        },
      ];
    } else {
      tweens = [
        {
          y: `+=${Y}`,
          duration,
          ease: "Linear",
          repeat: 0,
        },
        {
          y: "+=10",
          duration: 65,
          ease: "Power1",
          repeat: 0,
          yoyo: true,
        },
      ];
    }

    this.scene.tweens.chain({
      targets: targets,
      tweens,
      onComplete: () => {
        this.stop();
      },
    });
  }

  // Methods
  // funcao para spin symbols
  public spin(config: SpinConfig) {
    if (this.isSpinning) return;
    this.isSpinning = true;
    this.setState("spinning");

    const y_result =
      this.SLOTS.find((child) => {
        return child.name === config.symbol;
      })?.y ?? 52;

    const current_index = this.SEQUENCE_Y.indexOf(Math.ceil(y_result));
    console.log("current_index", current_index, "y", y_result);
    const target_index = 2;

    const steps =
      (target_index - current_index + this.ITEMS.length) % this.ITEMS.length;

    this.initSpinAnimation(steps, config.animationType);
  }

  public console() {
    this.getAll().forEach((child) => {
      console.log(child, this.SLOTS);
    });
  }

  private stop() {
    this.isSpinning = false;
    this.setState("stopped");
    this.onComplete?.();
  }
}
