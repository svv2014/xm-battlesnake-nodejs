var express = require('express');
var router = express.Router();

const LEFT = 'left';
const RIGHT = 'right';
const UP = 'up';
const DOWN = 'down';

// Handle POST request to '/start'
router.post('/start', function (req, res) {
  // NOTE: Do something here to start the game
  console.log(req.body)
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
    randomMove(exclude);
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function validateMove(mySnake, intendedMove) {
  if (isSelfThere(mySnake, intendedMove)) {
    return validateMove(mySnake, randomMove(intendedMove));
  }
  if (isNextWall(mySnake, intendedMove)) {
    return validateMove(mySnake, randomMove(intendedMove));
  }
  if (isNextSmallSnake(mySnake, intendedMove)) {
    return validateMove(mySnake, randomMove(intendedMove));
  }
  if (isNextBigSnake(mySnake, intendedMove)) {
    return validateMove(mySnake, randomMove(intendedMove));
  }
  console.log("move found: ", intendedMove);
  return intendedMove;
}

// Handle POST request to '/move'
router.post('/move', function (req, res) {
  console.log(req.body);
  const gameState = req.body;
  const mySnake = getMySnake(gameState);
  console.log('Snake coordinates: ' + JSON.stringify(mySnake.coords));
  mySnake.gameState = gameState;

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
  let moveAllowed = true;
  const body = mySnake.coords;
  let destCoord = nextCoordinate(mySnake, intendedMove);
  console.log('destCoord: ', destCoord);
  const [destX, destY] = destCoord;
  switch (intendedMove) {
    case LEFT:

      body.forEach(part => {
        const [partX, partY] = part;
        if (destX === partX && destY === partY) {
          moveAllowed = false;
        }
      });
      break;
    case RIGHT:

      body.forEach(part => {
        const [partX, partY] = part;
        if (destX === partX && destY === partY) {
          moveAllowed = false;
        }
      });
      break;
    case UP:

      body.forEach(part => {
        const [partX, partY] = part;
        console.log("isSelfThere: ",{partX, partY} );
        if (destX === partX && destY === partY) {
          moveAllowed = false;
        }

      });
      break;
    case DOWN:

      body.forEach(part => {
        const [partX, partY] = part;
        if (destX === partX && destY === partY) {
          moveAllowed = false;
        }
      });
      break;
    default:
      break;
  }
  console.log("isSelfThere: ",{moveAllowed, intendedMove} );
  return moveAllowed;
}

function isNextWall(mySnake, intendedMove) {
  const destCoord = nextCoordinate(mySnake, intendedMove);
  console.log('isNextWall: destCoord: ', destCoord);
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
  console.log('SNAKE bod + head: ', { body, head });
  switch (intendedMove) {
    case LEFT:
      return [(head[0] - 1), head[1]];
      break;
    case RIGHT:
      return [(head[0] + 1), head[1]];
      break;
    case UP:
      return [head[0], (head[1] + 1)];
      break;
    case DOWN:
      return [head[0], (head[1] - 1)];
      break;

    default:
      break;
  }
}

function isNextSmallSnake(mySnake, intendedMove) {
  return false;
}

function isNextBigSnake(mySnake, intendedMove) {
  return false;
}

module.exports = router
