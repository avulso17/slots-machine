import Phaser from "phaser";

export class SlotMachine extends Phaser.Scene {
  private reels: Reel[] = [];
  private spinButton!: Phaser.GameObjects.Text;
  private isSpinning = false;

  // Configuração do jogo
  private readonly symbolHeight = 44; // Altura de cada símbolo
  private readonly symbolSpacing = 26; // Espaçamento entre símbolos
  private readonly reelWidth = 70; // Largura de cada reel
  private readonly reelSpacing = 20; // Espaçamento entre reels
  private readonly visibleSymbols = 3; // Número de símbolos visíveis em cada reel
  private readonly spinSpeed = 20; // Velocidade de rotação dos reels
  private readonly spinDuration = 2000; // Duração da rolagem em ms
  private readonly reelStopDelay = 500; // Tempo entre a parada de cada reel

  // Símbolos disponíveis
  private readonly symbolKeys = [
    "cherry",
    "bell",
    "star",
    "clover",
    "diamond",
    "lemon",
    "pig",
  ];

  constructor() {
    super("SlotMachine");
  }

  preload() {
    this.load.setPath("assets/images/symbols/");

    // Carregando os símbolos
    this.load.image("cherry", "cherries.png");
    this.load.image("bell", "bell.png");
    this.load.image("star", "star.png");
    this.load.image("clover", "clover.png");
    this.load.image("diamond", "gem.png");
    this.load.image("lemon", "lemon.png");
    this.load.image("pig", "pig.png");
  }

  create() {
    // Calculando as dimensões totais da máquina
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;

    // Adicionando fundo
    this.add.rectangle(
      gameWidth / 2,
      gameHeight / 2,
      gameWidth,
      gameHeight,
      0x000000
    );

    // Calculando posição inicial dos reels
    const totalWidth = this.reelWidth * 3 + this.reelSpacing * 2;
    let startX = (gameWidth - totalWidth) / 2;

    // Adicionando o contêiner da slot machine
    const slotMachineY = gameHeight / 2 - 50;

    // Adicionando moldura da slot machine
    this.add
      .rectangle(
        gameWidth / 2,
        slotMachineY,
        totalWidth + 40,
        this.visibleSymbols * this.symbolHeight + 40,
        0x333333
      )
      .setStrokeStyle(2, 0xffd700);

    // Adicionando linha de pagamento (payline)
    const paylineY = slotMachineY;
    this.add.rectangle(gameWidth / 2, paylineY, totalWidth + 50, 2, 0xff0000);

    // Criando os 3 reels
    for (let i = 0; i < 3; i++) {
      const reelX =
        startX + i * (this.reelWidth + this.reelSpacing) + this.reelWidth / 2;

      // Máscara para o reel - mostra apenas os símbolos visíveis
      const maskHeight = this.visibleSymbols * this.symbolHeight;
      const maskY = slotMachineY;

      // Criando uma máscara gráfica para o reel
      const maskGraphics = this.add.graphics();
      maskGraphics.fillStyle(0xffffff);
      maskGraphics.fillRect(
        reelX - this.reelWidth / 2,
        maskY - maskHeight / 2,
        this.reelWidth,
        maskHeight
      );

      // Criando o reel
      const reel = new Reel(
        this,
        reelX,
        slotMachineY - maskHeight / 2,
        this.symbolKeys,
        this.symbolHeight,
        this.symbolSpacing,
        this.visibleSymbols,
        maskGraphics
      );

      this.reels.push(reel);
    }

    // Adicionando botão de spin
    this.spinButton = this.add
      .text(gameWidth / 2, slotMachineY + 150, "SPIN", {
        fontSize: "32px",
        backgroundColor: "#ff0000",
        padding: { x: 20, y: 10 },
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.startSpin())
      .on("pointerover", () =>
        this.spinButton.setStyle({ backgroundColor: "#aa0000" })
      )
      .on("pointerout", () =>
        this.spinButton.setStyle({ backgroundColor: "#ff0000" })
      );
  }

  update() {
    // Atualizar cada reel
    this.reels.forEach((reel) => reel.update());
  }

  startSpin() {
    if (this.isSpinning) return;

    this.isSpinning = true;
    this.spinButton.setAlpha(0.5).disableInteractive();

    // Inicia o spin de cada reel
    this.reels.forEach((reel) => reel.startSpin(this.spinSpeed));

    // Parar os reels em sequência
    for (let i = 0; i < this.reels.length; i++) {
      this.time.delayedCall(this.spinDuration + i * this.reelStopDelay, () => {
        this.reels[i].stopSpin();

        // Se for o último reel, verificar resultado
        if (i === this.reels.length - 1) {
          this.time.delayedCall(500, () => this.checkResults());
        }
      });
    }
  }

  checkResults() {
    // Obtém os símbolos na linha de pagamento (middle row)
    const paylineSymbols = this.reels.map((reel) => reel.getPaylineSymbol());

    let win = false;

    // Verificando se todos os símbolos são iguais (combinação vencedora)
    if (
      paylineSymbols[0] === paylineSymbols[1] &&
      paylineSymbols[1] === paylineSymbols[2]
    ) {
      win = true;

      // Adicionar animação de vitória
      this.add
        .text(this.cameras.main.width / 2, 100, "VOCÊ GANHOU!", {
          fontSize: "40px",
          color: "#ffff00",
          stroke: "#000000",
          strokeThickness: 6,
        })
        .setOrigin(0.5);

      // Animação dos símbolos vencedores
      this.reels.forEach((reel) => reel.highlightPaylineSymbol());
    }

    // Reset do jogo após um tempo
    this.time.delayedCall(win ? 3000 : 1000, () => {
      this.isSpinning = false;
      this.spinButton.setAlpha(1).setInteractive();

      // Limpar mensagem de vitória, se existir
      this.children.each((child) => {
        if (
          child instanceof Phaser.GameObjects.Text &&
          child.text === "VOCÊ GANHOU!"
        ) {
          child.destroy();
        }
        return true;
      });
    });
  }
}

class Reel {
  private scene: Phaser.Scene;
  private x: number;
  private y: number;
  private symbols: Phaser.GameObjects.Container;
  private symbolImages: Phaser.GameObjects.Image[] = [];
  private symbolKeys: string[];
  private symbolHeight: number;
  private symbolSpacing: number;
  private visibleSymbols: number;
  private reelMask: Phaser.GameObjects.Graphics;
  private spinSpeed: number = 0;
  private spinning: boolean = false;
  private finalPositionY: number = 0;
  private stopSpinRequested: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    symbolKeys: string[],
    symbolHeight: number,
    symbolSpacing: number,
    visibleSymbols: number,
    mask: Phaser.GameObjects.Graphics
  ) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.symbolKeys = symbolKeys;
    this.symbolHeight = symbolHeight;
    this.symbolSpacing = symbolSpacing;
    this.visibleSymbols = visibleSymbols;
    this.reelMask = mask;

    // Criando o container para os símbolos
    this.symbols = scene.add.container(x, y);

    // Aplicando a máscara
    this.symbols.setMask(new Phaser.Display.Masks.GeometryMask(scene, mask));

    // Inicializando os símbolos
    this.initSymbols();
  }

  initSymbols() {
    // Criando mais símbolos do que são visíveis para o efeito de rolagem contínua
    const totalSymbols = this.visibleSymbols + 3;

    // Limpando símbolos existentes
    this.symbolImages.forEach((symbol) => symbol.destroy());
    this.symbolImages = [];
    this.symbols.removeAll();

    // Criando novos símbolos aleatórios
    for (let i = 0; i < totalSymbols; i++) {
      const randomSymbol = Phaser.Utils.Array.GetRandom(this.symbolKeys);
      const symbol = this.scene.add
        .image(0, i * (this.symbolHeight + this.symbolSpacing), randomSymbol)
        .setDisplaySize(this.symbolHeight, this.symbolHeight)
        .setOrigin(0.5, 0.5);

      this.symbolImages.push(symbol);
      this.symbols.add(symbol);
    }
  }

  update() {
    if (!this.spinning) return;

    // Movendo os símbolos para baixo
    this.symbols.y += this.spinSpeed;

    // Verificando se um símbolo saiu da parte inferior e deve retornar ao topo
    const totalHeight =
      this.symbolImages.length * (this.symbolHeight + this.symbolSpacing);

    if (this.symbols.y > this.y + this.symbolHeight) {
      // Primeiro símbolo passou da linha inferior
      const firstSymbol = this.symbolImages.shift();
      if (firstSymbol) {
        // Mover para o final do reel
        firstSymbol.y =
          this.symbolImages.length * (this.symbolHeight + this.symbolSpacing);
        this.symbolImages.push(firstSymbol);
      }

      // Resetar a posição Y para o próximo ciclo
      this.symbols.y = this.y;
    }

    // Verificando se deve parar a rolagem
    if (this.stopSpinRequested) {
      // Desacelerar gradualmente
      this.spinSpeed *= 0.95;

      // Quando a velocidade for baixa o suficiente, alinhar aos slots
      if (this.spinSpeed < 0.5) {
        this.alignSymbols();
        this.spinning = false;
        this.stopSpinRequested = false;
      }
    }
  }

  startSpin(speed: number) {
    this.spinSpeed = speed;
    this.spinning = true;
    this.stopSpinRequested = false;

    // Randomizar símbolos ao iniciar
    this.symbolImages.forEach((symbol) => {
      symbol.setTint(0xffffff);
    });
  }

  stopSpin() {
    // Seleciona aleatoriamente os símbolos finais
    this.randomizeSymbols();

    // Solicitar a parada (desaceleração gradual)
    this.stopSpinRequested = true;
  }

  randomizeSymbols() {
    this.symbolImages.forEach((symbol) => {
      const randomSymbol = Phaser.Utils.Array.GetRandom(this.symbolKeys);
      symbol.setTexture(randomSymbol);
    });
  }

  alignSymbols() {
    // Alinhando os símbolos à grade
    this.symbols.y = this.y;
  }

  getPaylineSymbol() {
    // Retorna o símbolo que está na linha de pagamento (centro do reel)
    const middleIndex = Math.floor(this.visibleSymbols / 2);
    const paylineSymbol = this.symbolImages[middleIndex];

    return paylineSymbol ? paylineSymbol.texture.key : null;
  }

  highlightPaylineSymbol() {
    // Destaca o símbolo na linha de pagamento
    const middleIndex = Math.floor(this.visibleSymbols / 2);
    const paylineSymbol = this.symbolImages[middleIndex];

    if (paylineSymbol) {
      // Adiciona um efeito de destaque (pulsação)
      this.scene.tweens.add({
        targets: paylineSymbol,
        scale: 1.2,
        duration: 300,
        yoyo: true,
        repeat: 5,
        ease: "Sine.easeInOut",
      });

      // Adiciona um brilho dourado
      paylineSymbol.setTint(0xffff00);
    }
  }
}
