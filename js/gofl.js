!(function() {
  // Useful constants.
  var BOX_SIDE = 10;
  var DELAY = 150;
  var ZERO = 0;
  var ONE = 1;
  var RADIO = BOX_SIDE >> 1;
  var RAD_START = 0;
  var RAD_END = 2 * Math.PI;

  // Canvas info.
  var canvas = document.getElementById('cnvs');
  var width = canvas.width / BOX_SIDE;
  var height = canvas.height / BOX_SIDE;
  var context = canvas.getContext('2d');

  // Auxiliar variables.
  var running = false;
  var intervalId;

  // Two dimensional array to hold the cells.
  var cells = new Array(width);
  var prevGen = new Array(width);
  for(var i = 0; i < width; i++) {
    cells[i] = new Int8Array(height);
    prevGen[i] = new Int8Array(height);
    for (var j = 0; j < height; j++) {
      cells[i][j] = Math.floor(Math.random() * 100) > 80? ONE: ZERO;
    }
  }

  function drawCells() {
    canvas.width = canvas.width;
    // Drawing a grid.
    context.beginPath();
    context.strokeStyle = '#444444';
    for(var i = 0; i <= width; i++) {
      context.moveTo(i * BOX_SIDE, 0);
      context.lineTo(i * BOX_SIDE, height * BOX_SIDE);
    }
    for(var i = 0; i <= height; i++) {
      context.moveTo(0, i * BOX_SIDE);
      context.lineTo(width * BOX_SIDE, i * BOX_SIDE);
    }
    context.stroke();

    // drawCells
    for(var x = 0; x < width; x++) {
      for(var y = 0; y < height; y++) {
        if(cells[x][y] == ONE) {
          context.beginPath();
          context.fillStyle = '#008800';
          context.arc(x * BOX_SIDE + RADIO, y * BOX_SIDE + RADIO, RADIO,
              RAD_START, RAD_END);
          context.fill();
          context.strokeStyle = '#003300';
          context.stroke();
        }
      }
    }
  }

  // Counts the number of cell neighbours.
  function countNeighbours(x, y) {
    var count = 0;
    count += x > 0 && y > 0 ? prevGen[x - 1][y - 1] : 0;
    count += y > 0 ? prevGen[x][y - 1] : 0;
    count += x < width - 1 && y > 0 ? prevGen[x + 1][y - 1] : 0;
    count += x > 0 ? prevGen[x - 1][y] : 0;
    count += x < width - 1 ? prevGen[x + 1][y] : 0;
    count += x > 0 && y < height - 1 ? prevGen[x - 1][y + 1] : 0;
    count += y < height - 1 ? prevGen[x][y + 1] : 0;
    count += x < width - 1 && y < height - 1 ? prevGen[x + 1][y + 1] : 0;
    return count;
  }

  // Defining main loop routine.
  var mainLoop = function() {
    // switch grid and prevGen.
    var temp = cells;
    cells = prevGen;
    prevGen = temp;

    // evaluate each cell and calculate the next generation.
    for(var x = 0; x < width; x++) {
      for(var y = 0; y < height; y++) {
        var neighbours = countNeighbours(x, y);
        var prevCell = prevGen[x][y];
        var val = ZERO;
        // optimized version of the 3 rules of game of life.
        if (neighbours == 3 || (prevCell == 1 && neighbours == 2)) {
            val = ONE;
        }
        cells[x][y] = val;
      }
    }
    drawCells();
  }

  // Eventos de teclado.
  window.onkeypress = function(e) {
    // stoping/resuming main loop.
    if(e.keyCode == 112) { // 'p'
      if(running) {
        clearInterval(intervalId);
      } else {
        intervalId = setInterval(mainLoop, DELAY);
      }
      running = !running;
    }
  }

  // Eventos de mouse.
  canvas.onclick = function(e) {
    var x = Math.floor((e.x - canvas.offsetLeft) / BOX_SIDE);
    var y = Math.floor((e.y - canvas.offsetTop) / BOX_SIDE);
    cells[x][y] = cells[x][y] == ONE ? ZERO : ONE;
    drawCells();
  }

  drawCells();
})()

