const CARD_WIDTH = 61;
const CARD_HEIGHT = 105;

function image_name_for(number, suit) {
  return `${number}${suit}`;
}

function image_for(number, suit) {
  return images[image_name_for(number, suit)];
}


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
      rect(this.x - 3, this.y - 3, CARD_WIDTH + 6, CARD_HEIGHT + 6);
    }
    image(
        image_for(this.number, this.suit), this.x, this.y, CARD_WIDTH,
        CARD_HEIGHT);
  }
}
