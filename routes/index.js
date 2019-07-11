var express = require('express');
var router = express.Router();

const LEFT = 'left';
const RIGHT = 'right';
const UP = 'up';
const DOWN = 'down';

// Handle POST request to '/start'
router.post('/start', function (req, res) {
  // NOTE: Do something here to start the game
  // Response data
  var data = {
    color: "#ff00ee",
    name: "Solid",
    head_url: "http://www.placecage.com/c/200/200", // optional, but encouraged!
    taunt: "Wakey wakey!", // optional, but encouraged!
    HeadType: 'bendr',
    TailType: 'block-bum'
  }
  return res.json(data)
})

let moves = [LEFT, UP, DOWN, RIGHT];

function randomMove(exclude) {
  let move = moves[getRandomInt(4)];
  if (move === exclude) {
    return randomMove(exclude);
  }
  return move;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function validateMove(mySnake, intendedMove) {
  if (isSelfThere(mySnake, intendedMove)) {
    console.log('it thinks its there');
    return validateMove(mySnake, randomMove(intendedMove));
  }
  if (isNextWall(mySnake, intendedMove)) {
    console.log('it thinks theres a wall');
    return validateMove(mySnake, randomMove(intendedMove));
  }
  if (isNextSmallSnake(mySnake, intendedMove)) {
    console.log('it thinks theres a snake');
    return intendedMove;
  }
  if (isNextBigSnake(mySnake, intendedMove)) {
    console.log('it thinks theres a snake');
    return validateMove(mySnake, randomMove(intendedMove));
  }
  return intendedMove;
}

// Handle POST request to '/move'
router.post('/move', function (req, res) {
  const gameState = req.body;
  const mySnake = getMySnake(gameState);
  mySnake.gameState = gameState;
  // console.log({gameState});

  const intendedMove = findFood(mySnake, req.body);

  // Response data
  var data = {
    move: validateMove(mySnake, intendedMove),
    taunt: 'Outta my way, snake!', // optional, but encouraged!
  }

  return res.json(data)
})
function getMySnake(gameState) {
  return getSnake(gameState, gameState.you)
}
function getSnake(gameState, id) {
  let snake = gameState.snakes.find(snake => snake.id === id)
  return snake;
}
function findFood(mySnake, gameState) {
  let head = mySnake.coords[0];
  if (gameState.food[0][0] < head[0]) {
    move = LEFT;
  }

  if (gameState.food[0][0] > head[0]) {
    move = RIGHT;
  }

  if (gameState.food[0][1] < head[1]) {
    move = UP;
  }

  if (gameState.food[0][1] > head[1]) {
    move = DOWN;
  }
  return move;
}

function isSelfThere(mySnake, intendedMove) {
  let nextIsBody = false;
  const body = mySnake.coords;
  const destCoord = nextCoordinate(mySnake, intendedMove);
  const [destX, destY] = destCoord;
  switch (intendedMove) {
    case LEFT:
      body.forEach(part => {
        const [partX, partY] = part;
        if (destX === partX && destY === partY) {
          nextIsBody = true;
        }
      });
      break;
    case RIGHT:

      body.forEach(part => {
        const [partX, partY] = part;
        if (destX === partX && destY === partY) {
          nextIsBody = true;
        }
      });
      break;
    case UP:

      body.forEach(part => {
        const [partX, partY] = part;
        if (destX === partX && destY === partY) {
          nextIsBody = true;
        }

      });
      break;
    case DOWN:

      body.forEach(part => {
        const [partX, partY] = part;
        if (destX === partX && destY === partY) {
          nextIsBody = true;
        }
      });
      break;
    default:
      break;
  }
  return nextIsBody;
}


function isNotColide(body, destCoord, intendedMove) {
  let nextIsBody = false;
  const [destX, destY] = destCoord;
  switch (intendedMove) {
    case LEFT:
      body.forEach(part => {
        const [partX, partY] = part;
        if (destX === partX && destY === partY) {
          nextIsBody = true;
        }
      });
      break;
    case RIGHT:

      body.forEach(part => {
        const [partX, partY] = part;
        if (destX === partX && destY === partY) {
          nextIsBody = true;
        }
      });
      break;
    case UP:

      body.forEach(part => {
        const [partX, partY] = part;
        if (destX === partX && destY === partY) {
          nextIsBody = true;
        }

      });
      break;
    case DOWN:

      body.forEach(part => {
        const [partX, partY] = part;
        if (destX === partX && destY === partY) {
          nextIsBody = true;
        }
      });
      break;
    default:
      break;
  }
  return nextIsBody;
}

function isNextWall(mySnake, intendedMove) {
  const destCoord = nextCoordinate(mySnake, intendedMove);
  const { height, width } = mySnake.gameState;
  const [destX, destY] = destCoord;
  if (destX < 0 || destY < 0) {
    return true;
  }
  if (height === destY || width === destX) {
    return true;
  }
}

function nextCoordinate(mySnake, intendedMove) {
  const body = mySnake.coords;
  const head = body[0];
  let destCoord = [];
  switch (intendedMove) {
    case LEFT:
      destCoord = [(head[0] - 1), head[1]];
      return destCoord;
      break;
    case RIGHT:
      destCoord = [(head[0] + 1), head[1]];
      return destCoord;
      break;
    case UP:
      destCoord = [head[0], (head[1] - 1)];
      return destCoord;
      break;
    case DOWN:
      destCoord = [head[0], (head[1] + 1)];
      return destCoord;
      break;

    default:
      break;
  }
}

function isNextSmallSnake(mySnake, intendedMove) {
  const destCoord = nextCoordinate(mySnake, intendedMove);
  console.log({mySnake});
  const theSnakes = mySnake.gameState.snakes;
  let collide = false;
  let big = false;
  const ownSize = mySnake.coords.length;
  theSnakes.forEach(snake => {
    if (!isNotColide(snake.coords,destCoord, intendedMove)) {
      const snakeSize = snake.coords.length;
      big = ownSize < snakeSize;
      collide = true;
    }
    
  });

  return (!big && collide);
}

function isNextBigSnake(mySnake, intendedMove) {
  const destCoord = nextCoordinate(mySnake, intendedMove);
  const theSnakes = mySnake.gameState.snakes;
  let collide = false;
  let big = false;
  const ownSize = mySnake.coords.length;
  theSnakes.forEach(snake => {
    if (!isNotColide(snake.coords,destCoord, intendedMove)) {
      const snakeSize = snake.coords.length;
      big = ownSize < snakeSize;
      collide = true;
    }
    
  });

  return (big && collide);
}

module.exports = router
