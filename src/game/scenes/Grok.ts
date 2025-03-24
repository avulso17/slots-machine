export class Grok extends Phaser.Scene {
  private reels: any[] = [];
  private isSpinning = false;
  private reelSpeed = 0;
  private symbols = ["cherry", "bell", "star", "clover", "lemon"];
  private SYMBOL_HEIGHT = 100;
  constructor() {
    super("Grok");
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
    for (let i = 0; i < 3; i++) {
      let reel = {
        symbols: [],
        yOffset: 0,
        group: this.add.group(),
      };

      // Preencher cada rolo com símbolos
      for (let j = -2; j < 3; j++) {
        let symbol = Phaser.Math.RND.pick(this.symbols);
        let sprite = this.add.sprite(
          200 + i * 150,
          300 + j * this.SYMBOL_HEIGHT,
          symbol
        );
        sprite.setScale(0.5);
        reel.symbols.push(sprite);
        reel.group.add(sprite);
      }
      this.reels.push(reel);
    }

    let spinButton = this.add.sprite(400, 500, "spinButton").setInteractive();
    spinButton.on("pointerdown", this.startSpin, this);

    this.add.rectangle(400, 300, 450, 10, 0xff0000, 0.5); // Payline central
  }

  update() {
    if (this.isSpinning) {
      this.reels.forEach((reel, index) => {
        reel.yOffset += this.reelSpeed;

        reel.symbols.forEach((symbol, i) => {
          symbol.y += this.reelSpeed;

          // Reposicionar símbolo que sai da tela
          if (symbol.y > 600) {
            symbol.y -= this.SYMBOL_HEIGHT * 5; // Reposiciona 5 posições acima
            symbol.setTexture(Phaser.Math.RND.pick(this.symbols));
          }
        });

        // Diminuir velocidade e alinhar ao parar
        if (this.reelSpeed > 0) {
          this.reelSpeed -= 0.05 + index * 0.05;
          if (this.reelSpeed <= 0) {
            this.reelSpeed = 0;
            this.alignReel(reel); // Alinhar símbolos quando parar
            if (index === 2) {
              // Último rolo
              this.checkWin();
            }
          }
        }
      });

      if (this.reelSpeed <= 0) {
        this.isSpinning = false;
      }
    }
  }

  alignReel(reel) {
    // Encontrar o símbolo mais próximo da payline (y = 300)
    let closestSymbol = reel.symbols.reduce((prev, curr) =>
      Math.abs(curr.y - 300) < Math.abs(prev.y - 300) ? curr : prev
    );

    // Calcular o deslocamento necessário para alinhar o símbolo central
    let offset = 300 - closestSymbol.y;

    // Aplicar o deslocamento a todos os símbolos do rolo
    reel.symbols.forEach((symbol) => {
      symbol.y += offset;

      // Garantir que símbolos fora da tela sejam reposicionados corretamente
      if (symbol.y > 600) {
        symbol.y -= this.SYMBOL_HEIGHT * 5;
        symbol.setTexture(Phaser.Math.RND.pick(this.symbols));
      } else if (symbol.y < 0) {
        symbol.y += this.SYMBOL_HEIGHT * 5;
        symbol.setTexture(Phaser.Math.RND.pick(this.symbols));
      }
    });
  }

  startSpin() {
    if (!this.isSpinning) {
      this.isSpinning = true;
      this.reelSpeed = 10; // Reinicia a velocidade
    }
  }

  checkWin() {
    let result = this.reels.map((reel) => {
      let centralSymbol = reel.symbols.find(
        (symbol) => Math.abs(symbol.y - 300) < this.SYMBOL_HEIGHT / 2
      );
      return centralSymbol.texture.key;
    });

    if (result[0] === result[1] && result[1] === result[2]) {
      console.log(`Vitória! Combinação: ${result[0]}`);
    } else {
      console.log("Sem vitória. Tente novamente!");
    }
  }
}
