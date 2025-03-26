const ITEMS = [
  "bell",
  "cherries",
  "clover",
  "gem",
  "lemon",
  "pig",
  "pig_nose",
  "star",
];
const ITEM_HEIGHT = 50;
const VISIBLE_HEIGHT = ITEM_HEIGHT * 3;
const TOTAL_HEIGHT = ITEMS.length * ITEM_HEIGHT;
const SPEED = 1.5;

export class Gpt extends Phaser.Scene {
  slots: any[] = [];
  playButton: any;
  items = [
    "bell",
    "cherries",
    "clover",
    "gem",
    "lemon",
    "pig",
    "pig_nose",
    "star",
  ];
  ITEM_HEIGHT = 50;

  constructor() {
    super({ key: "SlotMachine" });
  }

  preload() {
    this.load.image("background", "path/to/background.png");
    ITEMS.forEach((item) => {
      this.load.image(item, `path/to/${item}.png`);
    });
  }

  create() {
    this.add.image(400, 300, "background");

    this.slots = [
      this.createSlot(200, 200),
      this.createSlot(400, 200),
      this.createSlot(600, 200),
    ];

    this.playButton = this.add
      .text(400, 500, "Play", { fontSize: "32px", fill: "#FFF" })
      .setInteractive()
      .on("pointerdown", () => this.play());
  }

  createSlot(x, y) {
    let slot = this.add.container(x, y);
    let items = [];

    for (let i = 0; i < ITEMS.length; i++) {
      let sprite = this.add.image(0, i * ITEM_HEIGHT, ITEMS[i]);
      slot.add(sprite);
      items.push(sprite);
    }

    return { container: slot, items, offset: 0, spinning: false };
  }

  play() {
    const results = [
      this.getRandomResult(),
      this.getRandomResult(),
      this.getRandomResult(),
    ];
    this.slots.forEach((slot, index) => {
      this.spinSlot(slot, results[index], 5 + index * 5);
    });
  }

  spinSlot(slot, result, turns) {
    slot.spinning = true;
    let targetOffset = turns * TOTAL_HEIGHT + result * ITEM_HEIGHT;

    this.tweens.add({
      targets: slot.items,
      y: `+=${targetOffset}`,
      duration: 2000,
      ease: "Cubic.easeOut",
      onComplete: () => (slot.spinning = false),
    });
  }

  getRandomResult() {
    return Math.floor(Math.random() * ITEMS.length);
  }
}
