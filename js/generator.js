"use strict"

const foo = !(() => {
  const totalCols = 80,
        totalRows = 24;
  let   offsetx,
        offsety,
        cols,
        rows,
        bx,
        by,
        i, j,
        mat;

// Control handlers
  let   codes = Array(16),
        names = Array(16);

  const canvas  = document.getElementById('cnvs'),
        ctx     = canvas.getContext('2d'),
        cpp     = document.getElementById('cpp'),
        map     = document.getElementById('map');

  for (i = 0; i < 16; ++i) {
    codes[i] = document.getElementById('char' + i);
    names[i] = document.getElementById('name' + i);
  }

  const mchar = [
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
  
  const colors = ["#000", "#800", "#080", "#880", "#008", "#a0a", "#055", "#aaa",
                  "#555", "#f00", "#0f0", "#ff0", "#00f", "#f0f", "#0aa", "#fff"];

  function mcolor(color) {
    return colors[(color & 0x00f) == 0? (color >> 4) : color];
  }

  function writeMat() {
    let cad1 = [rows, ' ', cols, '\n'];
    for (i = 0; i < rows; ++i) {
      for (j = 0; j < cols; ++j) {
        cad1.push(('00' + mat[j][i].toString(16)).substr(-3));
      }
      cad1.push('\n');
    }
    map.value = cad1.join("");

    let cad2 = [`#include "juego.h"

// Caracteres!
const unsigned char glyphs[16] = { `]

    for (i = 0; i < 16; ++i) {
      cad2.push((i === 0? '': ', '), (names[i].value.trim() !== ''? codes[i].value: 0));
    }
    cad2.push(` };

// Constantes de tipo de elemento!
`);
    for (i = 0; i < 16; ++i) {
      if (names[i].value.trim() !== '') {
        cad2.push(`#define ${names[i].value.toUpperCase()}\t${i}\n`);
      }
    }
    cad2.push(`
int px;
int py;

void padPrint(int x, int y, unsigned char glyph) {
    Console::SetCursorPosition(px + x, py + y);
    cout << glyph;
}

void dibujarMapa(int** m, int rows, int cols) {
    px = 40 - cols / 2;
    py = 12 - rows / 2;
    for (int i = 0; i < rows; ++i) {
        for (int j = 0; j < cols; ++j) {
            int obj = objeto(m[i][j]);
            if (obj != VACIO) {
                frommapcolor(m[i][j]);
                padPrint(j, i, glyphs[obj]);
            }
        }
    }
}`);
    cpp.innerHTML = cad2.join("");
  }

  function pintaXY(x, y) {
    const chr = parseInt(codes[(mat[x][y] & 0xf00) >> 8].value);
    ctx.beginPath();
    ctx.rect((offsetx + x) * bx, (offsety + y) * by, bx, by);
    ctx.fillStyle = mcolor(mat[x][y] & 0x0f0);
    ctx.fill();
    ctx.fillStyle = mcolor(mat[x][y] & 0x00f);
    ctx.font = `${Math.floor(by*0.75)}px Consolas, monospace`;
    ctx.fillText(mchar[chr], (offsetx + x) * bx + 1, (offsety + y + 1) * by - 6);
  }

  function drawGrid() {
    // Drawing a grid.
    ctx.beginPath();
    ctx.strokeStyle = '#123';
    for(i = 0; i <= totalCols; ++i) {
      ctx.moveTo(i * bx, 0);
      ctx.lineTo(i * bx, totalRows * by);
    }
    for(i = 0; i <= totalRows; ++i) {
      ctx.moveTo(0, i * by);
      ctx.lineTo(totalCols * bx, i * by);
    }
    ctx.stroke();

    // numbers
    ctx.fillStyle = 'OrangeRed';
    ctx.font = '12pt Consolas';
    for(i = 0; i < cols; ++i) {
      ctx.fillText('' + i % 10, (i + offsetx) * bx + 3, offsety * by - 5);
    }
    for(i = 0; i < rows; ++i) {
      ctx.fillText('' + i % 10, (offsetx - 1) * bx + 1, (offsety + i + 1) * by - 4);
    }

    // drawing actual map region
    ctx.beginPath();
    ctx.strokeStyle = 'OrangeRed';
    ctx.rect(offsetx * bx - 2, offsety * by - 2, cols * bx + 4, rows * by + 4);
    ctx.stroke();
  }

  function drawmat() {
    ctx.fillStyle = "Black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let x = 0; x < cols; ++x) {
      for(let y = 0; y < rows; ++y) {
        if(mat[x][y] !== 0x000) {
          pintaXY(x, y);
        }
      }
    }
    drawGrid();
    writeMat();
  }

  function getRadioVal(nom) {
    const radios = document.getElementsByName(nom);

    for (i = 0, length = radios.length; i < length; ++i) {
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
    for(i = 0; i < cols; ++i) {
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
  canvas.onclick = e => {
    const bcr = canvas.getBoundingClientRect(),
          offx = bcr.left,
          offy = bcr.top,
          x = Math.floor((e.clientX - offx) / bx) - offsetx,
          y = Math.floor((e.clientY - offy) / by) - offsety;
    if (x < 0 || x >= cols || y < 0 || y >= rows) return;

    const fg = parseInt(getRadioVal('fg')),
          bg = parseInt(getRadioVal('bg')),
          code = parseInt(getRadioVal('code')),
          thing = (code << 8) + (bg << 4) + fg;
    mat[x][y] = mat[x][y] == thing ? 0x000 : thing;
    drawmat();
  };

  init(22, 60);

})();
