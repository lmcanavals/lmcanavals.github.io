var VACIO = 0;
var COLITA = 1;
var CUERPO = 2;
var CABEZA = 3;
var MANZANA = 4;
var BLOQUE = 5;

var IZQUIERDA = 'A';
var DERECHA = 'D';
var ABAJO = 'S';
var ARRIBA = 'W';

var X = 0;
var Y = 1;

var CONTINUA = 0;
var MUERTE = 1;
var VICTORIA = 2;

var RAD_START = 0;
var RAD_END = 2 * Math.PI;

// Canvas info.
var canvas = document.getElementById('cnvs');
var width;
var height;
var context = canvas.getContext('2d');

var running = false;
var delay = 100;

var libres;
var nivel;
var serpiente;
var posManzana;
var nLib;
var nFil, nCol;
var dir, cola, cabeza;
var intervalId;

var juego = {
  escala: 30,
  radio: 0,
  colorCuerpo: 'gray',
  colorCabeza: 'gray',
  colorCola: 'gray',
  colorManzana: 'black',
  poner: function(pos, elemento) {
    var x, y; [x, y] = pos;
    if (x >= 0 && x < nCol && y >= 0 && y < nFil) {
      nivel[y][x] = elemento;
      for (var i = 0; i < nLib; ++i) {
        if (libres[i][X] == x && libres[i][Y] == y) {
          libres[i] = libres[--nLib];
          return;
        }
      }
    }
  },
  creaManzana: function() {
    var pos = Math.floor(Math.random() * nLib);
    posManzana = libres[pos];
    this.poner(libres[pos], MANZANA);
    libres[pos] = libres[--nLib];
  },
  drawStuff: function() {
      canvas.width = canvas.width;
      context.beginPath();
      context.fillStyle = this.colorCola;
      context.arc(serpiente[cola][X] * this.escala + this.radio,
                  serpiente[cola][Y] * this.escala + this.radio,
                  this.radio, RAD_START, RAD_END);
      context.fill();
      context.strokeStyle = '#777';
      context.stroke();
      context.fillStyle = this.colorCuerpo;
      for (var i = cola + 1; i < cabeza; ++i) {
        context.beginPath();
        context.arc(serpiente[i][X] * this.escala + this.radio,
                    serpiente[i][Y] * this.escala + this.radio,
                    this.radio, RAD_START, RAD_END);
        context.fill();
        context.strokeStyle = '#777';
        context.stroke();
      }
      context.beginPath();
      context.fillStyle = this.colorCabeza;
      context.arc(serpiente[cabeza][X] * this.escala + this.radio,
                  serpiente[cabeza][Y] * this.escala + this.radio,
                  this.radio, RAD_START, RAD_END);
      context.fill();
      context.strokeStyle = '#777';
      context.stroke();
      context.beginPath();
      context.fillStyle = this.colorManzana;
      context.arc(posManzana[X] * this.escala + this.radio,
                  posManzana[Y] * this.escala + this.radio,
                  this.radio, RAD_START, RAD_END);
      context.fill();
      context.strokeStyle = '#777';
      context.stroke();
  },
  mover: function() {
    var nvPosCabX, nvPosCabY; [nvPosCabX, nvPosCabY] = serpiente[cabeza];
    this.poner([nvPosCabX, nvPosCabY], CUERPO);
    switch (dir) {
      case IZQUIERDA: --nvPosCabX; break;
      case DERECHA: ++nvPosCabX; break;
      case ABAJO: ++nvPosCabY; break;
      case ARRIBA: --nvPosCabY; break;
    }
    if (nvPosCabX < 0  || nvPosCabX >= nCol
      || nvPosCabY < 0 || nvPosCabY >= nFil
      || (nivel[nvPosCabY][nvPosCabX] != VACIO
      && nivel[nvPosCabY][nvPosCabX] != MANZANA)) {
      return MUERTE;
    }
    if (nivel[nvPosCabY][nvPosCabX] !== MANZANA) { // avanzamos cola
      var posColX, posColY; [posColX, posColY] = serpiente[cola];
      nivel[posColY][posColX] = VACIO;
      libres[nLib++] = serpiente[cola];
      cola = ++cola % (nFil * nCol);
    } else { // cola no avanza (serpiente crece una posicion)
      this.creaManzana();
    }
    // mover cabeza
    this.poner([nvPosCabX, nvPosCabY], CABEZA);
    cabeza = ++cabeza % (nFil * nCol);
    serpiente[cabeza] = [nvPosCabX, nvPosCabY];
    var lon;
    if (cola < cabeza) {
      lon = cabeza - cola + 1;
    } else {
      lon = cabeza - nCol * nFil - cola + 1;
    }
    if (lon == nCol * nFil - 10) return VICTORIA; // victoria cuando la serpiente es casi del tamano del tablero

    return CONTINUA;
  },
  main: function() {
    this.radio = this.escala >> 1;
    width = Math.floor(canvas.width / this.escala);
    height = Math.floor(canvas.height / this.escala);
    nFil = height;
    nCol = width;
    nivel = Array(nFil).fill().map(()=>Array(nCol).fill().map(()=>VACIO));
    serpiente = Array(nFil * nCol).fill().map(()=>[0, 0]); // arreglo circular
    libres =  Array(nFil * nCol).fill().map(()=>[0, 0]);
    nLib = 0;
    for (var x = 0; x < nCol; ++x)
      for (var y = 0; y < nFil; ++y)
        libres[nLib++] = [x, y];

    // inicialización manual de serpiente!
    cola = 0;
    cabeza = 3;
    dir = DERECHA;
    serpiente[0] = [3, 3]; // [X, Y]
    serpiente[1] = [4, 3];
    serpiente[2] = [5, 3];
    serpiente[3] = [6, 3];
    this.poner(serpiente[0], COLITA);
    this.poner(serpiente[1], CUERPO);
    this.poner(serpiente[2], CUERPO);
    this.poner(serpiente[3], CABEZA);
    this.creaManzana();
  },
  iniciar: function() {
    console.log('Bienvenido a la UPC!');
    this.main();
    running = true;
    if (intervalId !== undefined)
      clearInterval(intervalId);
    intervalId = setInterval(this.mainLoop, delay);
  },
  cambiarTitulo: function(titulo) {
    document.title = titulo;
  },
  mainLoop: function() {
    var estado = juego.mover();
    juego.drawStuff();
    if (estado === MUERTE || estado === VICTORIA) {
      clearInterval(intervalId);
    }
    if (estado === MUERTE) {
      alert('Game Over :(');
    } else if (estado == VICTORIA) {
      alert('Game Over :)');
    }
  }
};

// Eventos de teclado.
window.onkeypress = function(e) {
  switch (e.keyCode) {
    case 97: dir = dir != DERECHA? IZQUIERDA: dir; break;
    case 100: dir = dir != IZQUIERDA? DERECHA: dir; break;
    case 115: dir = dir != ARRIBA? ABAJO: dir; break;
    case 119: dir = dir != ABAJO? ARRIBA: dir; break;
    case 112:
      if(running) {
        clearInterval(intervalId);
      } else {
        intervalId = setInterval(juego.mainLoop, delay);
      }
      running = !running;
      break;
  }
};

document.getElementById('onoff').onclick = function() {
  juego.iniciar();
};
