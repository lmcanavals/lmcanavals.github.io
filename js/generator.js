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
  names[0].value = 'empty';   codes[0].value = '0';
  names[1].value = 'hero';    codes[1].value = '2';
  names[2].value = 'enemy';   codes[2].value = '15';
  names[3].value = 'life';    codes[3].value = '3';
  names[4].value = 'bullet';  codes[4].value = '7';
  names[6].value = 'block';  codes[6].value = '219';

  const mchar = [" ☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*=,-./0123456789:;<=>?",
                 "@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂",
                 "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐",
                 "└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "].join("");
  
  const colors = ["#000", "#800", "#080", "#880", "#008", "#a0a", "#055", "#aaa",
                  "#555", "#f00", "#0f0", "#ff0", "#00f", "#f0f", "#0aa", "#fff"];

  function mcolor(color) {
    return colors[(color & 0x00f) == 0? (color >> 4) : color];
  }

  function writeMat() {
    let cad1 = [rows, ' ', cols, '\n'];
    for (i = 0; i < rows; ++i) {
      for (j = 0; j < cols; ++j) {
        cad1.push(`0x${('0000' + mat[j][i].toString(16)).substr(-4)} `);
      }
      cad1.push('\n');
    }
    map.innerHTML = cad1.join("");

    let cad2 = [`#include "game.h"

using namespace std;

// Caracteres!
string glyphs[] = { `]

    for (i = 0; i < 16 && names[i].value.trim() !== ''; ++i) {
      cad2.push((i === 0? '"': ', "'), mchar(parseInt(codes[i].value)), '"');
    }
    cad2.push(` };

// Constantes de tipo de elemento!
`);
    for (i = 0; i < 16 && names[i].value.trim() !== ''; ++i) {
        cad2.push(`#define ${names[i].value.toUpperCase()}\t${i}\n`);
    }
    cad2.push(`
void loadStuff(string fname, Map*& map, ConsoleInfo*& ci) {
        ci = new ConsoleInfo;
        getConsoleInfo(ci);
        map = loadMap(fname);
        int marginv = ci->maxRows - map->rows;
        int marginh = ci->maxColumns - map->cols;
        if (marginv < 0 || marginh < 0) {
                map = nullptr; // console too small for labyrinth, try making it bigger
        } else {
                int top = marginv / 2;
                int left = marginh / 2;
                int bottom = marginv - top;
                int right = marginh - left;
                getConsoleInfo(ci, top, right, bottom, left);
        }
}

void drawMap(Map* map, ConsoleInfo* ci) {
        for (int i = 0; i < map->rows; ++i) {
                gotoxy(ci->left, ci->top + i);
                for (int j = 0; j < map->cols; ++j) {
                        if (map->cells[i][j].glyph == ${names[0].value.toUpperCase()}) {
                                cout << " ";
                        } else {
                                color(map->cells[i][j].fcolor, map->cells[i][j].bcolor);
                                cout << glyphs[map->cells[i][j].glyph];
                                clearColor();
                        }
                }
        }
}

int main() {
        ConsoleInfo* ci;
        Map* map;

        loadStuff("lab.awesome", map, ci);
        if (map == nullptr) {
                cout << "Terminal too small for this map\n";
                return -1;
        }

        clear();
        drawMap(map, ci);
        cin.get();
        clear();

        delete ci;
        destroyMap(map);
}
`);
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
    const temp = document.querySelector(`input[name=${nom}]:checked`)
    return temp? parseInt(temp.value): 0;
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

    const fg = getRadioVal('fg'),
          bg = getRadioVal('bg'),
          code = getRadioVal('code'),
          thing = (code << 8) + (bg << 4) + fg;
    mat[x][y] = mat[x][y] == thing ? 0x000 : thing;
    drawmat();
  };

  init(22, 60);

})();
