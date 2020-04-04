const H = 'H'
const D = 'D'
const S = 'S'
const C = 'C'

const Hearts = 'H'
const Diamonds = 'D'
const Spades = 'S'
const Clubs = 'C'



const numbers =
    ['A'].concat(Array(9).fill(0).map((v, i) => i + 2)).concat(['J', 'Q', 'K']);
const suits = [H, D, S, C];

let cards = [];
let resetButton;
let desireP;
let desireInput;
let desireSubmit;

Array.prototype.removeOnceOfEvery = function(items) {
  let ret = this.slice();
  eachItem: for (let item of items) {
    for (let i = ret.length - 1; i >= 0; i--) {
      if (ret[i] === item) {
        ret.splice(i, 1);
        continue eachItem;
      }
    }
  }
  return ret;
};

Array.prototype.count = function(item) {
  let ret = 0
  for (let element of this) {
    if (item == element) {
      ret++;
    }
  }
  return ret;
};

function powerset(array) {
  let result = [[]];
  for (let i = 0; i < array.length; i++) {
    let len = result.length;
    for (let x = 0; x < len; x++) {
      result.push(result[x].concat(array[i]))
    }
  }
  return result;
}

function factorial(n) {
  let acc = 1;
  for (let i = n; i > 1; i--) {
    acc *= i;
  }
  return acc;
}

function choose(n, k) {
  return factorial(n) / (factorial(k) * factorial(n - k));
}

function findAllSummingNumbers(target, options) {
  return _findAllSummingNumbers(target, options, options);
}



function _findAllSummingNumbers(target, options, cardValues) {
  let unique = findAllUniqueSummingNumbers(target, options);
  let allSummings = {};
  for (let solution of unique) {
    let seen = {};
    let waysToMakeSolution = 1;
    for (let cardValue of solution) {
      let count = cardValues.count(cardValue);
      if (!seen[cardValue]) {
        let totalOptions = choose(count, solution.count(cardValue));
        seen[cardValue] = true;
        waysToMakeSolution *= totalOptions;
      }
    }
    allSummings[solution] = waysToMakeSolution;
  }
  let ret = [];
  for (let solution of Object.keys(allSummings)) {
    let list = JSON.parse(`[${solution}]`);
    let count = allSummings[solution];
    for (let i = 0; i < count; i++) {
      ret.push(list);
    }
  }
  return ret;
}

function findAllUniqueSummingNumbers(target, options) {
  let all = {};
  let solution = findSummingNumbers(target, options);
  let subsets = powerset(solution);
  for (let i = 0; i < subsets.length; i++) {
    let subset = subsets[i];
    let opts = options.removeOnceOfEvery(subset);
    let sol = findSummingNumbers(target, opts);
    if (sol) {
      all[sol] = true;
      subsets.concat(powerset(sol));
    }
  }
  return Object.keys(all).map((v) => JSON.parse(`[${v}]`));
}


function findSummingNumbers(target, options) {
  return _findSummingNumbers(target, [], options.slice(), 0);
}

function _findSummingNumbers(target, currentPool, freePool) {
  let currentSum = currentPool.reduce((p, c) => p + c, 0);
  if (currentSum == target) {
    return currentPool;
  } else if (freePool.length == 0) {
    return null;
  } else {
    let candidate = freePool[0];
    freePool.splice(0, 1);
    let withoutPool = currentPool.slice();
    currentPool.push(candidate);
    let withNew =
        _findSummingNumbers(target, currentPool.slice(), freePool.slice());
    let withOutnew = _findSummingNumbers(target, withoutPool, freePool.slice());
    return withNew != null ? withNew : withOutnew;
  }
}

function calculateOdds(target) {
  let possibleNumbers = [];
  let doubleCountedAces = 0;
  for (let card of cards) {
    if (card.selected) {
      if (card.number == 'A') {
        doubleCountedAces++;
        possibleNumbers.push(1);
        possibleNumbers.push(11);
      } else if (['J', 'K', 'Q'].includes(card.number)) {
        possibleNumbers.push(10);
      } else {
        possibleNumbers.push(card.number);
      }
    }
  }

  let inPlayCards = possibleNumbers.length - doubleCountedAces;

  // subset problem
  /*
    findAllSummingNumbers takes the face value of available cards left in the
    deck and then first calculates how many unique solutions will arrive at the
    target value. Then it calculates how many possible ways it can create those
    solutions using the cards still in the deck. It returns a list of arrays
    each of which contain the card face values that add up to the target. There
    is one of those such arrays PER possible combination of active cards.

    In other words, if the deck was [2A, 2S, 5H, 7D] and we wanted 7, this
    function would return [[2, 5], [2, 5], [7]]. Note that it returns the
    solution [2,5] twice since there are two ways to make the solution [2,5] yet
    it returns the solution [7] only once  because there is only one way to make
    it. If we were instead looking for 4, it would return [[2,2]] since, even
    though there are two 2's--both the 2 of aces (2A) and the 2 of spades (2S),
    the only way to make 4 is to use both of them. If we were looking for 4, BUT
    the deck was [2A, 2S, 2C, 5H, 7D] then the function should return
    [[2,2],[2,2],[2,2]] Since there are 3 ways to make 4: 2A + 2S, 2S + 2C, or
    2A + 2C.

    Therefore, when examining the solution space and each solution in it, we can
    simply find the probablity of drawing a PARTICULAR card of that value rather
    than ANY card of that value, since each opportunity to draw that value is
    already accounted for in the solution space. Therefore, the odds of drawing
    any card in the solution is 1 in the number of cards still in play. This is
    still not as simply as a constant, however, since the number of cards in
    play goes down as we draw cards for the solution. Therefore the function
    below examines all solutions looking at the cards within them. It multiples
    the probabilties of drawing them together. This requires considering the
    index. Finally, since all of these solutions in the solution space are
    possible, it sums these products together to get the final probablity of
    drawing the targeted number worth of face values.
  */

  // FIXME: Sometimes valid solutions (at least those of length 1) do not show
  // up in the solution space

  // FIXME: Order matters. For ever solution, every permutation of that solution
  // is just as valid.

  // FIXME: If a target is impossible, there is a typeerror in powerset

  let solutions = findAllSummingNumbers(target, possibleNumbers);
  console.log(solutions);
  let odds =
      solutions
          .map(
              (solution) =>
                  solution.map((v, idx) => (1 / (inPlayCards - idx)))
                      .reduce((accOdds, cCardOdds) => cCardOdds * accOdds))
          .reduce((accProb, prob) => accProb + prob);
  console.log(odds);
}


const cardBuffer = 5;

function setup() {
  // no animating and thats a lot of image() calls
  frameRate(24);
  let canvas = createCanvas(
      13 * (CARD_WIDTH + cardBuffer) + cardBuffer,
      4 * (CARD_HEIGHT + cardBuffer) + cardBuffer);
  let canvasContainer = select('#canvas-container');
  canvas.parent(canvasContainer);
  let xoff = cardBuffer;
  let yoff = cardBuffer;
  for (let j of suits) {
    for (let i of numbers) {
      cards.push(new Card(i, j, xoff, yoff));
      xoff += CARD_WIDTH + cardBuffer;
      if (xoff + CARD_WIDTH > width) {
        xoff = cardBuffer;
        yoff += CARD_HEIGHT + cardBuffer;
      }
    }
  }
  resetButton = createButton('Reset Selection');
  resetButton.mousePressed(() => {
    for (let card of cards) {
      card.selected = true;
    }
  });
  desireP = createP('Enter the number of points you need:');
  desireInput = createInput('');
  desireSubmit = createButton('Submit');
  desireSubmit.mousePressed(() => {
    calculateOdds(desireInput.value());
  });
}


function draw() {
  background(51);
  for (let card of cards) {
    card.draw();
  }
}

function mousePressed() {
  for (let card of cards) {
    if (mouseX > card.x && mouseX < card.x + CARD_WIDTH && mouseY > card.y &&
        mouseY < card.y + CARD_HEIGHT) {
      card.toggleSelect();
    }
  }
}
