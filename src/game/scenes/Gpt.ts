import { Scene } from "phaser";

import { Reel } from "../objects/classic-slots";

export class Game extends Scene {
  private symbols: string[] = ["🍒", "🔔", "⭐", "🍀", "💎", "🍋"];
  private reels: Phaser.GameObjects.Text[] = [];
  private spinButton!: Phaser.GameObjects.Text;
  private isSpinning: boolean = false;
  private reelHeight = 150;
  private symbolSize = 50;
  centerX!: number;
  centerY!: number;

  resultText!: Phaser.GameObjects.Text;
  reel!: Reel;

  constructor() {
    super("Game");
  }

  create() {
    this.centerX = window.innerWidth / 2;
    this.centerY = window.innerHeight / 2;

    this.reel = new Reel(this, 200, 200);

    // Criar os reels na tela
    const reelSpacing = 100;

    for (let i = 0; i < 3; i++) {
      const reel = this.add
        .text(
          this.centerX - reelSpacing + i * reelSpacing,
          this.centerY,
          "❔",
          {
            fontSize: "48px",
            color: "#ffffff",
          }
        )
        .setOrigin(0.5);

      this.reels.push(reel);
    }

    // Criar botão de girar
    this.spinButton = this.add
      .text(this.centerX, this.centerY + 100, "GIRAR", {
        fontSize: "32px",
        backgroundColor: "#00ff00",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        // this.spinReels();
        // reel.spin();
        this.reel.spinSymbols();
      });
    this.add
      .text(this.centerX + 100, this.centerY + 100, "STOP", {
        fontSize: "32px",
        backgroundColor: "#f03000",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.reel.stop();
      });
  }

  update(time: number, delta: number): void {
    this.reel.update();
    // this.reel.spinSymbols();
  }

  spinReels() {
    if (this.isSpinning) return; // Impede giros múltiplos simultâneos
    this.isSpinning = true;

    if (this.resultText) {
      this.resultText.destroy();
    }

    const result: string[] = [];

    this.reels.forEach((reel, index) => {
      let iterations = 10 + index * 5; // Faz cada reel parar em momentos diferentes
      let interval = 100; // Velocidade inicial

      const spinInterval = this.time.addEvent({
        delay: interval,
        repeat: iterations,
        callback: () => {
          const randomSymbol =
            this.symbols[Math.floor(Math.random() * this.symbols.length)];
          reel.setText(randomSymbol);

          if (spinInterval.getRepeatCount() === 0) {
            result[index] = randomSymbol; // Armazena o símbolo final

            if (index === this.reels.length - 1) {
              this.checkWin(result);
              this.isSpinning = false;
            }
          }
        },
      });
    });
  }

  checkWin(result: string[]) {
    const isWin = result.every((symbol) => symbol === result[0]);

    this.resultText = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 250,
        isWin ? "🎉 Jackpot! Você ganhou!" : "😢 Tente novamente!",
        { fontSize: "24px", color: isWin ? "#ffff00" : "#ff0000" }
      )
      .setOrigin(0.5);
  }
}
