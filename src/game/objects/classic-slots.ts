export class Symbol extends Phaser.GameObjects.Image {
  private symbol: string;

  constructor(scene: Phaser.Scene, x: number, y: number, symbol: string) {
    super(scene, x, y, "symbol", symbol);
    this.symbol = symbol;
  }

  getSymbol() {
    return this.symbol;
  }
}

export class Reel extends Phaser.GameObjects.Container {
  private symbols: string[];
  private result: string;
  private readonly reelHeight: number;
  private readonly reelWidth: number;
  private readonly symbolHeight: number;
  private readonly symbolWidth: number;
  private readonly animationDuration: number;
  private isSpinning: boolean;
  private timer: Phaser.Time.TimerEvent;
  private wrapRect: Phaser.Geom.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    // Reel props
    this.scene = scene;
    this.symbols = ["🍒", "🐷", "💎", "⭐", "🍀", "🐽"];
    this.symbolHeight = 44;
    this.symbolWidth = 44;
    this.reelHeight = 3 * this.symbolHeight;
    this.reelWidth = 96;
    this.animationDuration = 2000;
    this.isSpinning = false;
    this.result = "?";

    this.create();

    // Add reel into scene
    scene.add.existing(this);
  }

  create() {
    this.createReel();
    this.createSymbols();
  }

  update() {
    const symbols = this.getAll().slice(1);

    Phaser.Actions.WrapInRectangle(symbols, this.wrapRect, this.symbolHeight);
  }

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

  createSymbols() {
    const axisX = this.reelWidth / 2 - this.symbolWidth / 2;
    const offsetY = -12;
    const gapY = 26;

    for (let i = 0; i < 5; i++) {
      const axisY = i * this.symbolHeight;
      // const axisY = this.reelHeight / 2 - this.symbolHeight / 2;

      this.add(
        this.scene.add.text(axisX, axisY, this.symbols[i], {
          fontSize: "44px",
        })
      );
    }
  }

  spinSymbols() {
    return Phaser.Actions.IncY(this.getAll().slice(1), 2);
  }

  spin() {
    if (this.isSpinning) return;
    this.isSpinning = true;

    this.timer = this.scene.time.addEvent({
      delay: this.animationDuration,
      callback: () => {},
      loop: true,
    });

    const childrens = this.getAll();

    this.scene.tweens.add({
      targets: [...childrens.slice(1)],
      // y: this.reelHeight + 38,
      y: `+=26`,
      duration: this.animationDuration,
      ease: "Linear.Out",
      // repeat: -1,
      onComplete: () => {},
    });
  }

  createSymbol(symbol: string, axisX: number, axisY: number) {
    return this.scene.add.text(axisX, axisY, symbol, {
      fontSize: "44px",
      color: "#000",
    });
  }

  stop() {
    this.isSpinning = false;
    this.scene.tweens.pauseAll();
  }
}

export class ClassicSlots {
  private reels: Reel[] = [];
  private resultText: Phaser.GameObjects.Text;
  private isSpinning: boolean = false;

  spinReels() {
    // fazer cada reel girar
  }

  checkWin(result: string[]) {}
  // vou pegar o resultado de cada reel e verificar se todos sao iguais
  // se forem iguais, vou dar um win
  // se nao forem iguais, vou dar um loss
}
