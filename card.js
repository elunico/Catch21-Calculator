const CARD_WIDTH = 61;
const CARD_HEIGHT = 105;

function image_name_for(number, suit) {
  return `${number}${suit}`;
}

function image_for(number, suit) {
  return images[image_name_for(number, suit)];
}

const unicode_suit = {
  'S': '♠',
  'C': '♣',
  'H': '♥',
  'D': '♦'
};

const overDraw = 4;

class Card {
  constructor(number, suit, x, y) {
    this.number = number;
    this.suit = suit;
    this.x = x;
    this.y = y;
    this.selected = false;
  }

  toggleSelect() {
    this.selected = !this.selected;
    console.log(this.selected);
  }

  draw() {
    if (this.selected) {
      fill(0, 255, 0);
      noStroke();
      rect(
          this.x - overDraw, this.y - overDraw, CARD_WIDTH + (overDraw * 2),
          CARD_HEIGHT + (overDraw * 2));
    }
    fill(255, 255, 255);
    noStroke();
    rect(this.x, this.y, CARD_WIDTH, CARD_HEIGHT);
    textSize(30);
    if (this.suit == 'H' || this.suit == 'D') {
      fill(255, 0, 0);
    } else {
      fill(0, 0, 0);
    }
    text(this.number, this.x + 5, this.y + CARD_HEIGHT / 3);
    text(unicode_suit[this.suit], this.x + 5, this.y + CARD_HEIGHT * 2 / 3);
  }
}
