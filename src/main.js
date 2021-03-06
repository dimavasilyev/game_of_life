var canvas = document.getElementById('game');
var context = canvas.getContext('2d');


/*==============================================
Variables
===============================================*/
var scaleCell = 5;
var grid = [];
var gridCopy =[];
var fps = 60;
var rows =  0;
var cols = 0;
var gameEngine;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



/*==============================================
requestAnimationFrame Setting
===============================================*/
var gameStep = (function () {
  return requestAnimationFrame ||
  webkitRequestAnimationFrame  ||
  mozRequestAnimationFrame     ||
  oRequestAnimationFrame       ||
  msRequestAnimationFrame      ;
})();

var gameEngineStart = function (callback) {
  gameEngine = callback;
  gameEngineStep();
}

var gameEngineStep = function () {
  gameEngine();
  setTimeout(function() {
    gameStep(gameEngineStep);
  }, 1000 / fps);
}

var setGameEngine = function (callback) {
  gameEngine = callback;
}
/*==============================================*/



function generateGrid () {
  rows = parseInt(canvas.width / scaleCell);
  cols = parseInt(canvas.height / scaleCell);

  for (var x = 0; x < rows; x++) {
    grid[x] = [];
    gridCopy[x] = [];
    for (var y = 0; y < cols; y++) {
      grid[x][y] = 0;
      gridCopy[x][y] = 0;
    }
  }
}


function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function seedGrid(cellsCount) {
  if (cellsCount < rows * cols) {
    for (var i = 0; i < cellsCount; i++) {
      grid[getRandomNumber(0, rows)][getRandomNumber(0, cols)] = 1;
    }
  }
}


function drawCell (x, y) {
  context.fillStyle = 'black';
  context.fillRect(x * scaleCell, y * scaleCell, scaleCell, scaleCell);
}

function drawGrid () {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      if (grid[i][j]) {
        drawCell(i, j);
      }
    }
  }
}


function getNextGridState() {
  for (var j = 1; j < rows - 1; j++) {
    for (var k = 1; k < cols - 1; k++) {
          var totalCells = 0;

          totalCells += grid[j - 1][k - 1];
          totalCells += grid[j - 1][k];
          totalCells += grid[j - 1][k + 1];

          totalCells += grid[j][k - 1];
          totalCells += grid[j][k + 1];

          totalCells += grid[j + 1][k - 1];
          totalCells += grid[j + 1][k];
          totalCells += grid[j + 1][k + 1];

          if (grid[j][k] === 0) {
              if (totalCells == 3) {
                    gridCopy[j][k] = 1;
              } else {
                gridCopy[j][k] = 0;
              }
          } else if (grid[j][k] === 1) {
              if (totalCells == 3 || totalCells ==2) {
                gridCopy[j][k] = 1;
              } else {
                gridCopy[j][k] = 0;
              }
          }
      }
    }

    for (var j = 0; j < rows; j++) {
        for (var k = 0; k < cols; k++) {
          grid[j][k] = gridCopy[j][k];
        }
    }
}



function clearCanvas () {
  context.clearRect(0, 0, canvas.width, canvas.height);
}


var init = function () {
  //setGameSize(canvas.width, canvas.height);
  generateGrid();
  seedGrid(50000);
  drawGrid();
  setGameEngine(draw);

}


function draw() {
  clearCanvas();
  getNextGridState();
  drawGrid();
}


gameEngineStart(init);
