var foo = !(function() {
  // Canvas info.
  var canvas = document.getElementById('cnvs');
  var ctx = canvas.getContext('2d');

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
  
  // Control handlers
  var output = document.getElementById("output");
  var codes = Array(16);
  var names = Array(16);
  for (i = 0; i < 16; ++i) {
    codes[i] = document.getElementById("char" + i);
    names[i] = document.getElementById("name" + i);
  }
  
  function mchar(code) {
    switch (code) {
      case 0: return '';
      case 1: return '☺';
      case 2: return '☻';
      case 3: return '♥';
      case 4: return '♦';
      case 5: return '♣';
      case 6: return '♠';
      case 7: return '•';
      case 8: return '◘';
      case 9: return '○';
      case 10: return '◙';
      case 11: return '♂';
      case 12: return '♀';
      case 13: return '♪';
      case 14: return '♫';
      case 15: return '☼';
      case 16: return '►';
      case 17: return '◄';
      case 18: return '↕';
      case 19: return '‼';
      case 20: return '¶';
      case 21: return '§';
      case 22: return '▬';
      case 23: return '↨';
      case 24: return '↑';
      case 25: return '↓';
      case 26: return '→';
      case 27: return '←';
      case 28: return '∟';
      case 29: return '↔';
      case 30: return '▲';
      case 31: return '▼';
      case 32: return ' ';
      case 33: return '!';
      case 34: return '"';
      case 35: return '#';
      case 36: return '$';
      case 37: return '%';
      case 38: return '&';
      case 39: return '\'';
      case 40: return '(';
      case 41: return ')';
      case 42: return '*';
      case 43: return '+';
      case 44: return ',';
      case 45: return '-';
      case 46: return '.';
      case 47: return '/';
      case 48: return '0';
      case 49: return '1';
      case 50: return '2';
      case 51: return '3';
      case 52: return '4';
      case 53: return '5';
      case 54: return '6';
      case 55: return '7';
      case 56: return '8';
      case 57: return '9';
      case 58: return ':';
      case 59: return ';';
      case 60: return '<';
      case 61: return '=';
      case 62: return '>';
      case 63: return '?';
      case 64: return '@';
      case 65: return 'A';
      case 66: return 'B';
      case 67: return 'C';
      case 68: return 'D';
      case 69: return 'E';
      case 70: return 'F';
      case 71: return 'G';
      case 72: return 'H';
      case 73: return 'I';
      case 74: return 'J';
      case 75: return 'K';
      case 76: return 'L';
      case 77: return 'M';
      case 78: return 'N';
      case 79: return 'O';
      case 80: return 'P';
      case 81: return 'Q';
      case 82: return 'R';
      case 83: return 'S';
      case 84: return 'T';
      case 85: return 'U';
      case 86: return 'V';
      case 87: return 'W';
      case 88: return 'X';
      case 89: return 'Y';
      case 90: return 'Z';
      case 91: return '[';
      case 92: return '\\';
      case 93: return ']';
      case 94: return '^';
      case 95: return '_';
      case 96: return '`';
      case 97: return 'a';
      case 98: return 'b';
      case 99: return 'c';
      case 100: return 'd';
      case 101: return 'e';
      case 102: return 'f';
      case 103: return 'g';
      case 104: return 'h';
      case 105: return 'i';
      case 106: return 'j';
      case 107: return 'k';
      case 108: return 'l';
      case 109: return 'm';
      case 110: return 'n';
      case 111: return 'o';
      case 112: return 'p';
      case 113: return 'q';
      case 114: return 'r';
      case 115: return 's';
      case 116: return 't';
      case 117: return 'u';
      case 118: return 'v';
      case 119: return 'w';
      case 120: return 'x';
      case 121: return 'y';
      case 122: return 'z';
      case 123: return '{';
      case 124: return '|';
      case 125: return '}';
      case 126: return '~';
      case 127: return '⌂';
      case 128: return 'Ç';
      case 129: return 'ü';
      case 130: return 'é';
      case 131: return 'â';
      case 132: return 'ä';
      case 133: return 'à';
      case 134: return 'å';
      case 135: return 'ç';
      case 136: return 'ê';
      case 137: return 'ë';
      case 138: return 'è';
      case 139: return 'ï';
      case 140: return 'î';
      case 141: return 'ì';
      case 142: return 'Ä';
      case 143: return 'Å';
      case 144: return 'É';
      case 145: return 'æ';
      case 146: return 'Æ';
      case 147: return 'ô';
      case 148: return 'ö';
      case 149: return 'ò';
      case 150: return 'û';
      case 151: return 'ù';
      case 152: return 'ÿ';
      case 153: return 'Ö';
      case 154: return 'Ü';
      case 155: return 'ø';
      case 156: return '£';
      case 157: return 'Ø';
      case 158: return '×';
      case 159: return 'ƒ';
      case 160: return 'á';
      case 161: return 'í';
      case 162: return 'ó';
      case 163: return 'ú';
      case 164: return 'ñ';
      case 165: return 'Ñ';
      case 166: return 'ª';
      case 167: return 'º';
      case 168: return '¿';
      case 169: return '®';
      case 170: return '¬';
      case 171: return '½';
      case 172: return '¼';
      case 173: return '¡';
      case 174: return '«';
      case 175: return '»';
      case 176: return '░';
      case 177: return '▒';
      case 178: return '▓';
      case 179: return '│';
      case 180: return '┤';
      case 181: return 'Á';
      case 182: return 'Â';
      case 183: return 'À';
      case 184: return '©';
      case 185: return '╣';
      case 186: return '║';
      case 187: return '╗';
      case 188: return '╝';
      case 189: return '¢';
      case 190: return '¥';
      case 191: return '┐';
      case 192: return '└';
      case 193: return '┴';
      case 194: return '┬';
      case 195: return '├';
      case 196: return '─';
      case 197: return '┼';
      case 198: return 'ã';
      case 199: return 'Ã';
      case 200: return '╚';
      case 201: return '╔';
      case 202: return '╩';
      case 203: return '╦';
      case 204: return '╠';
      case 205: return '═';
      case 206: return '╬';
      case 207: return '¤';
      case 208: return 'ð';
      case 209: return 'Ð';
      case 210: return 'Ê';
      case 211: return 'Ë';
      case 212: return 'È';
      case 213: return 'ı';
      case 214: return 'Í';
      case 215: return 'Î';
      case 216: return 'Ï';
      case 217: return '┘';
      case 218: return '┌';
      case 219: return '█';
      case 220: return '▄';
      case 221: return '¦';
      case 222: return 'Ì';
      case 223: return '▀';
      case 224: return 'Ó';
      case 225: return 'ß';
      case 226: return 'Ô';
      case 227: return 'Ò';
      case 228: return 'õ';
      case 229: return '↔';
      case 230: return 'µ';
      case 231: return 'þ';
      case 232: return 'Þ';
      case 233: return 'Ú';
      case 234: return 'Û';
      case 235: return 'Ù';
      case 236: return 'ý';
      case 237: return 'Ý';
      case 238: return '¯';
      case 239: return '´';
      case 240: return '•';
      case 241: return '±';
      case 242: return '‗';
      case 243: return '¾';
      case 244: return '¶';
      case 245: return '§';
      case 246: return '÷';
      case 247: return '¸';
      case 248: return '°';
      case 249: return '¨';
      case 250: return '·';
      case 251: return '¹';
      case 252: return '³';
      case 253: return '²';
      case 254: return '■';
      case 255: return ' ';
    }
  }

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
    cad += "// Caracteres como Constantes!\n";
    for (i = 0; i < 16; ++i) {
      if (names[i].value.trim() !== '') {
        cad += '#define CHAR' + names[i].value.toUpperCase() + "  '\\" + codes[i].value + "'\n";
      }
    }
    cad += '\n\n';
    cad += "// Constantes de tipo de elemento!\n";
    for (i = 0; i < 16; ++i) {
      if (names[i].value.trim() !== '') {
        cad += '#define ' + names[i].value.toUpperCase() + ' 0x' + i.toString(16) + '00\n';
      }
    }
    cad += '\n\n';
    cad += 'int mapa[' + rows + '][' + cols + '] = {\n';
    for (i = 0; i < rows; ++i) {
      cad += '    { ';
      for (j = 0; j < cols; ++j) {
        cad += (j === 0? '': ', ') + '0x' + ('00' + mat[j][i].toString(16)).substr(-3);
      }
      cad += ' }' + (i < rows - 1? ', ': '') + '\n';
    }
    cad += '};\n\n';
    cad += 'int px, py;\n\n';
    cad += 'void dibujarMapa(int m[' + rows + '][' + cols + '], int rows, int cols) {\n';
    cad += '    px = 40 - cols / 2;\n';
    cad += '    py = 12 - rows / 2;\n';
    cad += '    for (int i = 0; i < rows; ++i) {\n';
    cad += '        for (int j = 0; j < cols; ++j) {\n';
    cad += '            int objeto = m[i][j] & 0xf00;\n';
    cad += '            if (objeto != 0x000) {\n';
    cad += '                Console::SetCursorPosition(px + j, py + i);\n';
    cad += '                int bg = m[i][j] & 0x0f0;\n';
    cad += '                int fg = m[i][j] & 0x00f;\n';
    cad += '                bgColor(bg);\n';
    cad += '                fgColor(fg);\n';
    cad += '                switch (objeto) {\n';
    for (i = 0; i < 16; ++i) {
      if (names[i].value.trim() !== '') {
        cad += '                case ' + names[i].value.toUpperCase() + ': cout << CHAR' + names[i].value.toUpperCase() + '; break;\n';
      }
    }
    cad += '                }\n';
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
    ctx.font = "14pt Consolas, monospace";
    ctx.fillText(mchar(chr), (offsetx + x) * bx + 1, (offsety + y + 1) * by - 6);
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
    ctx.font = "12pt 'Arial Narrow'";
    for(i = 0; i < cols; i++) {
      ctx.fillText("" + i % 10, (i + offsetx) * bx + 3, offsety * by - 5);
    }
    for(i = 0; i < rows; i++) {
      ctx.fillText("" + i % 10, (offsetx - 1) * bx + 1, (offsety + i + 1) * by - 4);
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
    var x = Math.floor((e.x - offx) / bx) - offsetx;
    var y = Math.floor((e.y - offy) / by) - offsety;
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
