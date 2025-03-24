import Phaser from "phaser";

export class SlotMachine extends Phaser.Scene {
  private symbols: Phaser.GameObjects.Image[] = [];
  private wrapRect!: Phaser.Geom.Rectangle;
  private readonly symbolHeight = 44;
  private readonly reelHeight = 3 * this.symbolHeight; // Exibir 3 símbolos visíveis
  private isSpinning = false;

  constructor() {
    super("SlotMachine");
  }

  preload() {
    this.load.setPath("assets/images/symbols/");

    this.load.image("cherry", "cherries.png");
    this.load.image("bell", "bell.png");
    this.load.image("star", "star.png");
    this.load.image("clover", "clover.png");
    this.load.image("diamond", "gem.png");
    this.load.image("lemon", "lemon.png");
  }

  create() {
    const symbolKeys = ["cherry", "bell", "star", "clover", "diamond", "lemon"];

    // Criando os símbolos no Reel
    for (let i = 0; i < 5; i++) {
      const randomSymbol = Phaser.Utils.Array.GetRandom(symbolKeys);
      const symbol = this.add
        .image(200, i * this.symbolHeight, randomSymbol)
        .setDisplaySize(this.symbolHeight, this.symbolHeight);

      this.symbols.push(symbol);
    }

    // Definir a área do Reel para o efeito de wrap
    this.wrapRect = new Phaser.Geom.Rectangle(0, 0, 400, this.reelHeight);

    // Adicionar botão para iniciar rolagem
    const spinButton = this.add
      .text(150, 300, "SPIN", {
        fontSize: "32px",
        backgroundColor: "#fff",
        color: "#000",
      })
      .setInteractive()
      .on("pointerdown", () => this.startSpin());
  }

  update() {
    if (this.isSpinning) {
      Phaser.Actions.IncY(this.symbols, 5); // Move os símbolos para baixo
      Phaser.Actions.WrapInRectangle(
        this.symbols,
        this.wrapRect,
        this.symbolHeight
      );
    }
  }

  startSpin() {
    this.isSpinning = true;

    this.time.delayedCall(2000, () => {
      this.isSpinning = false;
      this.alignSymbols();
    });
  }

  alignSymbols() {
    // Parar a rolagem e alinhar os símbolos à grade de 44px
    this.symbols.forEach((symbol, index) => {
      symbol.y = index * this.symbolHeight;
    });
  }
}
