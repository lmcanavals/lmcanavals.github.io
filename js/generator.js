"use strict"

var foo = !(function() {
  // Canvas info.
  var canvas;
  var ctx;

  // Variables
  var totalCols = 80;
  var totalRows = 24;
  var offsetx;
  var offsety;
  var cols;
  var rows;
  var bx;
  var by;
  var i, j;
  var mat;

// Control handlers
  var output;
  var codes = Array(16);
  var names = Array(16);

  canvas = document.getElementById('cnvs');
  ctx = canvas.getContext('2d');
  output = document.getElementById('output');

  for (i = 0; i < 16; ++i) {
    codes[i] = document.getElementById('char' + i);
    names[i] = document.getElementById('name' + i);
  }

  var mchar = [
    ' ', '☺', '☻', '♥', '♦', '♣', '♠', '•', '◘', '○', '◙', '♂', '♀', '♪', '♫', '☼',
    '►', '◄', '↕', '‼', '¶', '§', '▬', '↨', '↑', '↓', '→', '←', '∟', '↔', '▲', '▼',
    ' ', '!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ',', '<', '=', '>', '?',
    '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_',
    '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '~', '⌂',
    'Ç', 'ü', 'é', 'â', 'ä', 'à', 'å', 'ç', 'ê', 'ë', 'è', 'ï', 'î', 'ì', 'Ä', 'Å',
    'É', 'æ', 'Æ', 'ô', 'ö', 'ò', 'û', 'ù', 'ÿ', 'Ö', 'Ü', 'ø', '£', 'Ø', '×', 'ƒ',
    'á', 'í', 'ó', 'ú', 'ñ', 'Ñ', 'ª', 'º', '¿', '®', '¬', '½', '¼', '¡', '«', '»',
    '░', '▒', '▓', '│', '┤', 'Á', 'Â', 'À', '©', '╣', '║', '╗', '╝', '¢', '¥', '┐',
    '└', '┴', '┬', '├', '─', '┼', 'ã', 'Ã', '╚', '╔', '╩', '╦', '╠', '═', '╬', '¤',
    'ð', 'Ð', 'Ê', 'Ë', 'È', 'ı', 'Í', 'Î', 'Ï', '┘', '┌', '█', '▄', '¦', 'Ì', '▀',
    'Ó', 'ß', 'Ô', 'Ò', 'õ', '↔', 'µ', 'þ', 'Þ', 'Ú', 'Û', 'Ù', 'ý', 'Ý', '¯', '´',
    '•', '±', '‗', '¾', '¶', '§', '÷', '¸', '°', '¨', '·', '¹', '³', '²', '■', ' ']

  function mcolor(color) {
    switch (color) {
      case 0x000: case 0x000: return '#000';
      case 0x001: case 0x010: return '#800';
      case 0x002: case 0x020: return '#080';
      case 0x003: case 0x030: return '#880';
      case 0x004: case 0x040: return '#008';
      case 0x005: case 0x050: return '#a0a';
      case 0x006: case 0x060: return '#055';
      case 0x007: case 0x070: return '#aaa';
      case 0x008: case 0x080: return '#555';
      case 0x009: case 0x090: return '#f00';
      case 0x00a: case 0x0a0: return '#0f0';
      case 0x00b: case 0x0b0: return '#ff0';
      case 0x00c: case 0x0c0: return '#00f';
      case 0x00d: case 0x0d0: return '#f0f';
      case 0x00e: case 0x0e0: return '#0aa';
      case 0x00f: case 0x0f0: return '#fff';
    }
  }

  function writeMat() {
    var cad = '';
    cad +=rows + ' ' + cols + '\n';
    for (i = 0; i < rows; ++i) {
      for (j = 0; j < cols; ++j) {
        cad += (j === 0? '': ' ') + '0x' + ('00' + mat[j][i].toString(16)).substr(-3);
      }
      cad += '\n';
    }
    cad += '\n\n\n\n';
    cad += '/// Copie de aqui en adelante a su programa\n\n';
    cad += '#include "juego.h"\n\n';
    cad += '// Caracteres!\n';
    cad += 'const unsigned char glyphs[16] = { '
    for (i = 0; i < 16; ++i) {
      cad += (i === 0? '': ', ') +
        (names[i].value.trim() !== ''? codes[i].value: 0);

    }
    cad += ' };\n\n';
    cad += '// Constantes de tipo de elemento!\n';
    for (i = 0; i < 16; ++i) {
      if (names[i].value.trim() !== '') {
        cad += '#define ' + names[i].value.toUpperCase() + ' ' + i + '\n';
      }
    }
    cad += '\n\n';

    cad += 'int px;\n';
    cad += 'int py;\n';
    cad += '\n';
    cad += 'void padPrint(int x, int y, unsigned char glyph) {\n';
    cad += '    Console::SetCursorPosition(px + x, py + y);\n';
    cad += '    cout << glyph;\n';
    cad += '}\n';
    cad += '\n';
    cad += 'void dibujarMapa(int** m, int rows, int cols) {\n';
    cad += '    Console::Clear();\n';
    cad += '    px = 40 - cols / 2;\n';
    cad += '    py = 12 - rows / 2;\n';
    cad += '    for (int i = 0; i < rows; ++i) {\n';
    cad += '        for (int j = 0; j < cols; ++j) {\n';
    cad += '            int obj = objeto(m[i][j]);\n';
    cad += '            if (obj != VACIO) {\n';
    cad += '                frommapcolor(m[i][j]);\n';
    cad += '                padPrint(j, i, glyphs[obj]);\n';
    cad += '            }\n';
    cad += '        }\n';
    cad += '    }\n';
    cad += '}\n';

    output.value = cad;
  }

  function pintaXY(x, y) {
    var fg = mat[x][y] & 0x00f;
    var bg = mat[x][y] & 0x0f0;
    var code = (mat[x][y] & 0xf00) >> 8;
    var chr = parseInt(codes[code].value);
    ctx.beginPath();
    ctx.rect((offsetx + x) * bx, (offsety + y) * by, bx, by);
    ctx.fillStyle = mcolor(bg);
    ctx.fill();
    ctx.fillStyle = mcolor(fg);
    ctx.font = '14pt Consolas, monospace';
    ctx.fillText(mchar[chr], (offsetx + x) * bx + 1, (offsety + y + 1) * by - 6);
  }

  function drawGrid() {
    // Drawing a grid.
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    for(i = 0; i <= totalCols; i++) {
      ctx.moveTo(i * bx, 0);
      ctx.lineTo(i * bx, totalRows * by);
    }
    for(i = 0; i <= totalRows; i++) {
      ctx.moveTo(0, i * by);
      ctx.lineTo(totalCols * bx, i * by);
    }
    ctx.stroke();

    // numbers
    ctx.fillStyle = '#fff';
    ctx.font = '12pt "Arial Narrow"';
    for(i = 0; i < cols; i++) {
      ctx.fillText('' + i % 10, (i + offsetx) * bx + 3, offsety * by - 5);
    }
    for(i = 0; i < rows; i++) {
      ctx.fillText('' + i % 10, (offsetx - 1) * bx + 1, (offsety + i + 1) * by - 4);
    }

    // drawing actual map region
    ctx.beginPath();
    ctx.strokeStyle = '#f00';
    ctx.rect(offsetx * bx - 2, offsety * by - 2, cols * bx + 4, rows * by + 4);
    ctx.stroke();
  }

  function drawmat() {
    canvas.width = canvas.width;

    for(var x = 0; x < cols; x++) {
      for(var y = 0; y < rows; y++) {
        if(mat[x][y] !== 0x000) {
          pintaXY(x, y);
        }
      }
    }
    drawGrid();
    writeMat();
  }

  function getRadioVal(nom) {
    var radios = document.getElementsByName(nom);

    for (i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
    return 0;
  }

  function init(r, c) {
    rows = r;
    cols = c;
    offsetx = Math.floor(totalCols / 2 - cols / 2);
    offsety = Math.floor(totalRows / 2 - rows / 2);
    bx = canvas.width / totalCols;
    by = canvas.height / totalRows;

    // Two dimensional array to hold the mat.
    mat = new Array(cols);
    for(i = 0; i < cols; i++) {
      mat[i] = new Int16Array(rows);
    }
    drawmat();
  }

  // boton
  document.getElementById('nuevo').onclick = function(e) {
    rows = parseInt(document.getElementById('rows').value);
    cols = parseInt(document.getElementById('cols').value);
    init(rows, cols);
  };

  // Eventos de mouse.
  canvas.onclick = function(e) {
    var bcr = canvas.getBoundingClientRect();
    var offx = bcr.left;
    var offy = bcr.top;
    var x = Math.floor((e.clientX - offx) / bx) - offsetx;
    var y = Math.floor((e.clientY - offy) / by) - offsety;
    if (x < 0 || x >= cols || y < 0 || y >= rows) return;

    var fg = parseInt(getRadioVal('fg'));
    var bg = parseInt(getRadioVal('bg'));
    var code = parseInt(getRadioVal('code'));
    var thing = (code << 8) + (bg << 4) + fg;
    mat[x][y] = mat[x][y] == thing ? 0x000 : thing;
    drawmat();
  };

  init(21, 60);

})();
