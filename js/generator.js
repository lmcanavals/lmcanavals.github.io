"use strict";

!(() => {
  // proper constants
  const MAX_ELEMENTS = 256,
    FONT = "monospace",
    WHR = calcWidthHeightRatio(FONT),
    GLYPHS = [
      " ☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*=,-./0123456789:;<=>?",
      "@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂",
      "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐",
      "└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ",
    ].join(""),
    COLORS = [
      "#000",
      "#800",
      "#080",
      "#880",
      "#008",
      "#a0a",
      "#055",
      "#aaa",
      "#555",
      "#f00",
      "#0f0",
      "#ff0",
      "#00f",
      "#f0f",
      "#0aa",
      "#fff",
    ];

  // pointers
  const elems = Array(MAX_ELEMENTS),
    canvas = document.querySelector("#cnvs"),
    ctx = canvas.getContext("2d"),
    cpp = document.querySelector("#cpp"),
    map = document.querySelector("#map"),
    espan = document.querySelector("#elements"),
    gspan = document.querySelector("#glyphs"),
    ascii = document.querySelector("#ascii"),
    name = document.querySelector("#name");

  // proper variables
  let offsetx,
    offsety,
    cols,
    rows,
    bx,
    by,
    i,
    j,
    mat,
    clicked,
    oldX,
    oldY,
    max_cols,
    max_rows,
    fontheight,
    yfix;

  // initialized variables
  let numElems = 0, curElem = 0;

  // functions dom manipulation
  function createElement(elemInfo) {
    if (elemInfo.element === "text") {
      return document.createTextNode(elemInfo.text);
    }
    const elem = document.createElement(elemInfo.element);
    if ("attrs" in elemInfo) {
      for (const attr in elemInfo.attrs) {
        elem.setAttribute(attr, elemInfo.attrs[attr]);
      }
    }
    if ("children" in elemInfo) {
      for (const child of elemInfo.children) {
        elem.appendChild(createElement(child));
      }
    }
    if ("listeners" in elemInfo) {
      for (const listener of elemInfo.listeners) {
        elem.addEventListener(listener.event, listener.callback);
      }
    }
    return elem;
  }
  function addGameElement(ascii, name, bg, fg) {
    if (numElems >= MAX_ELEMENTS) {
      return false;
    }
    elems[numElems] = {
      "ascii": ascii,
      "name": name,
      "bg": bg,
      "fg": fg,
    };
    espan.appendChild(createElement({
      "element": "div",
      "children": [{
        "element": "label",
        "attrs": { "for": `element${numElems}`, "class": `bg${bg} fg${fg}` },
        "children": [{
          "element": "input",
          "attrs": {
            "type": "radio",
            "id": `element${numElems}`,
            "name": "element",
            "value": `${numElems}`,
          },
          "listeners": [{
            "event": "click",
            "callback": (e) => {
              activateElement(parseInt(e.target.value));
            },
          }],
        }, {
          "element": "text",
          "text": `${
            ascii == 0 ? "nil" : ascii == 32 ? "' '" : GLYPHS[ascii]
          } ${name}`,
        }],
      }],
    }));
    ++numElems;

    return true;
  }

  function activateElement(idx) {
    curElem = idx;
    ascii.value = elems[curElem].ascii;
    name.value = elems[curElem].name;
    document.querySelector(`#bg${elems[curElem].bg}`).checked = true;
    document.querySelector(`#fg${elems[curElem].fg}`).checked = true;
  }

  function writeMat() {
    const cad1 = [rows, " ", cols, " ", numElems, "\n"];
    const len = Math.ceil(numElems / 100);
    for (i = 0; i < numElems; ++i) {
      cad1.push(`${elems[i].ascii}`);
      cad1.push(" ");
    }
    cad1.pop();
    cad1.push("\n");
    for (i = 0; i < rows; ++i) {
      for (j = 0; j < cols; ++j) {
        const txt = "  " + mat[j][i].toString();
        cad1.push(`${txt.substring(txt.length - len)}`);
        cad1.push(" ");
      }
      cad1.pop();
      cad1.push("\n");
    }
    map.innerHTML = "";
    map.appendChild(createElement({
      "element": "text",
      "text": cad1.join(""),
    }));

    const cad2 = [`#include "game.h"

using namespace std;

// Caracteres!
char glyphs[] = {`];
    for (i = 0; i < numElems; ++i) {
      cad2.push(i === 0 ? " " : ", ", parseInt(elems[i].ascii));
    }
    cad2.push(` };
    
// just in case
// string glyphs[] = { `);
    for (i = 0; i < numElems; ++i) {
      cad2.push(i === 0 ? '"' : ', "', GLYPHS[parseInt(elems[i].ascii)], '"');
    }
    cad2.push(` };
    
// Constantes de tipo de elemento!
`);
    /*    for (i = 0; i < 16 && names[i].value.trim() !== ""; ++i) {
      cad2.push(`#define ${names[i].value.toUpperCase()}\t${i}\n`);
    }*/
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
                        if (map->cells[i][j].glyph == EMPTY) {
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
                cout << "Terminal too small for this map\\n";
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
    const ch = parseInt(elems[mat[x][y]].ascii);
    ctx.beginPath();
    ctx.rect((offsetx + x) * bx, (offsety + y) * by, bx, by);
    ctx.fillStyle = COLORS[elems[mat[x][y]].bg];
    ctx.fill();
    ctx.fillStyle = COLORS[elems[mat[x][y]].fg];
    ctx.font = `${fontheight}px ${FONT}`;
    ctx.fillText(
      GLYPHS[ch],
      (offsetx + x) * bx,
      (offsety + y + 1) * by - yfix,
    );
  }

  function drawGrid() {
    // Drawing a grid.
    ctx.beginPath();
    ctx.strokeStyle = "#111";
    for (i = 0; i <= max_cols; ++i) {
      ctx.moveTo(i * bx, 0);
      ctx.lineTo(i * bx, max_rows * by);
    }
    for (i = 0; i <= max_rows; ++i) {
      ctx.moveTo(0, i * by);
      ctx.lineTo(max_cols * bx, i * by);
    }
    ctx.stroke();

    // numbers
    ctx.fillStyle = "OrangeRed";
    ctx.font = `${fontheight}px ${FONT}`;
    for (i = 0; i < cols; ++i) {
      ctx.fillText(`${i % 10}`, (i + offsetx) * bx, offsety * by - yfix);
    }
    for (i = 0; i < rows; ++i) {
      ctx.fillText(
        `${i % 10}`,
        (offsetx - 1) * bx,
        (offsety + i + 1) * by - yfix,
      );
    }

    // drawing actual map region
    ctx.beginPath();
    ctx.strokeStyle = "OrangeRed";
    ctx.rect(offsetx * bx - 1, offsety * by - 1, cols * bx + 2, rows * by + 2);
    ctx.stroke();
  }

  function drawmat() {
    ctx.fillStyle = "Black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < cols; ++x) {
      for (let y = 0; y < rows; ++y) {
        if (mat[x][y] !== 0) {
          pintaXY(x, y);
        }
      }
    }
    drawGrid();
    writeMat();
  }

  function init() {
    max_cols = cols + 2;
    max_rows = rows + 2;
    clicked = false;
    oldX = -1;
    oldY = -1;
    offsetx = Math.floor(max_cols / 2 - cols / 2);
    offsety = Math.floor(max_rows / 2 - rows / 2);
    bx = canvas.width / max_cols;
    fontheight = bx * WHR;
    yfix = fontheight * 0.3;
    by = fontheight + yfix * 1.07;
    canvas.height = by * max_rows;

    // Two dimensional array to hold the mat.
    mat = new Array(cols);
    for (i = 0; i < cols; ++i) {
      mat[i] = new Int16Array(rows);
    }
    drawmat();
  }

  function update(e) {
    const bcr = canvas.getBoundingClientRect(),
      offx = bcr.left,
      offy = bcr.top,
      x = Math.floor((e.clientX - offx) / bx) - offsetx,
      y = Math.floor((e.clientY - offy) / by) - offsety;
    if (x < 0 || x >= cols || y < 0 || y >= rows) return;
    if (x !== oldX || y !== oldY) {
      oldX = x;
      oldY = y;
      mat[x][y] = mat[x][y] == curElem ? 0 : curElem;
      drawmat();
    }
  }

  function calcWidthHeightRatio(font) {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.font = `100px ${font}`;
    return 100 / ctx.measureText("\xdb").width;
  }

  // initializations
  addGameElement(0, "empty", 0, 0);
  addGameElement(1, "hero", 0, 2);
  addGameElement(219, "wall", 4, 3);
  addGameElement(3, "oneup", 0, 1);
  addGameElement(72, "upperh", 0, 1);
  addGameElement(103, "lowerg", 0, 1);

  gspan.appendChild(createElement({
    "element": "div",
    "attrs": { "class": "box2 th" },
    "children": [{ "element": "text", "text": "\u00A0" }],
  }));
  for (let i = 0; i < 16; ++i) {
    gspan.appendChild(createElement({
      "element": "div",
      "attrs": { "class": "box3 th" },
      "children": [{ "element": "text", "text": i.toString(16) }],
    }));
  }
  for (let i = 0; i < 256; ++i) {
    const ch = i === 0
      ? "nul"
      : i === 32
      ? "sp"
      : i === 255
      ? "nbsp"
      : GLYPHS[i];
    const txt = `00${i.toString(16)}`;
    if (i % 16 == 0) {
      gspan.appendChild(createElement({
        "element": "div",
        "attrs": { "class": "box2 th" },
        "children": [{
          "element": "text",
          "text": `0x${txt.substring(txt.length - 2, txt.length - 1)}_`,
        }],
      }));
    }
    gspan.appendChild(createElement({
      "element": "div",
      "attrs": { "class": "box3" },
      "children": [{
        "element": "text",
        "text": ch,
      }, {
        "element": "span",
        "attrs": { "class": "tooltiptext" },
        "children": [{
          "element": "text",
          "text": `${ch} 0x${txt.substring(txt.length - 2)} ${i}`,
        }],
      }],
    }));
  }

  // radio events
  (function () {
    let radios = document.querySelectorAll("input[name=fg]");
    for (const radio of radios) {
      radio.addEventListener("click", () => {
        elems[curElem].fg = radio.value;
        const parent =
          document.querySelector(`#element${curElem}`).parentElement;
        const cls = parent.getAttribute("class");
        parent.setAttribute(
          "class",
          `${cls.match(/bg\d+/)[0]} fg${radio.value}`,
        );
        drawmat();
      });
    }
    radios = document.querySelectorAll("input[name=bg]");
    for (const radio of radios) {
      radio.addEventListener("click", () => {
        elems[curElem].bg = radio.value;
        const parent =
          document.querySelector(`#element${curElem}`).parentElement;
        const cls = parent.getAttribute("class");
        parent.setAttribute(
          "class",
          `bg${radio.value} ${cls.match(/fg\d+/)[0]}`,
        );
        drawmat();
      });
    }
  })();

  // eventos de botones
  document.querySelector("#new").addEventListener("click", () => {
    rows = parseInt(document.querySelector("input[name=rows]").value);
    cols = parseInt(document.querySelector("input[name=cols]").value);
    init();
  });

  // Eventos de mouse.
  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    update(e);
  });
  canvas.addEventListener("mousemove", (e) => {
    if (clicked) update(e);
  });
  canvas.addEventListener("mouseup", () => {
    clicked = false;
    oldX = -1;
    oldY = -1;
  });
  canvas.addEventListener("mouseleave", () => {
    clicked = false;
    oldX = -1;
    oldY = -1;
  });

  document.querySelector("#element0").click();
  document.querySelector("#new").click();
})();
