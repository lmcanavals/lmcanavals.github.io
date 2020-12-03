#pragma once

#include <fstream>

using namespace std;
using namespace System;

// colores
#define NEGRO             0
#define ROJOOSCURO        1
#define VERDEOSCURO       2
#define AMARILLOOSCURO    3
#define AZULOSCURO        4
#define ROSAOSCURO        5
#define CYANOSCURO        6
#define GRIS              7
#define GRISOSCURO        8
#define ROJO              9
#define VERDE             10
#define AMARILLO          11
#define AZUL              12
#define ROSA              13
#define CYAN              14
#define BLANCO            15

int objeto(int m) { return m >> 8; }
int bgcolor(int m) { return (m & 0x0f0) >> 4; }
int fgcolor(int m) { return m & 0x00f; }

ConsoleColor color(int color) {
    if ((color & 0x00f) == 0) {
        color = color >> 4;
    }
    switch (color) {
    case NEGRO:             return ConsoleColor::Black;
    case ROJOOSCURO:        return ConsoleColor::DarkRed;
    case VERDEOSCURO:       return ConsoleColor::DarkGreen;
    case AMARILLOOSCURO:    return ConsoleColor::DarkYellow;
    case AZULOSCURO:        return ConsoleColor::DarkBlue;
    case ROSAOSCURO:        return ConsoleColor::DarkMagenta;
    case CYANOSCURO:        return ConsoleColor::DarkCyan;
    case GRIS:              return ConsoleColor::Gray;
    case GRISOSCURO:        return ConsoleColor::DarkGray;
    case ROJO:              return ConsoleColor::Red;
    case VERDE:             return ConsoleColor::Green;
    case AMARILLO:          return ConsoleColor::Yellow;
    case AZUL:              return ConsoleColor::Blue;
    case ROSA:              return ConsoleColor::Magenta;
    case CYAN:              return ConsoleColor::Cyan;
    case BLANCO:            return ConsoleColor::White;
    }
    return ConsoleColor::Black;
}

void bfcolor(int bg, int fg) {
    Console::BackgroundColor = color(bg);
    Console::ForegroundColor = color(fg);
}

void frommapcolor(int m) {
    bfcolor(bgcolor(m), fgcolor(m));
}

void borrarMapa(int**& mapa, int& rows, int& cols) {
    for (int i = 0; i < rows; ++i) {
        delete[] mapa[i];
    }
    if (mapa != nullptr) {
        delete[] mapa;
    }
    mapa = nullptr;
}

void leerMapa(char* nombre, int**& mapa, int& rows, int& cols) {
    borrarMapa(mapa, rows, cols);
    fstream archivo(nombre);
    if (!archivo.is_open()) return;
    archivo >> rows >> cols;
    mapa = new int*[rows];
    for (int i = 0; i < rows; ++i) {
        mapa[i] = new int[cols];
        for (int j = 0; j < cols; ++j) {
            archivo >> hex >> mapa[i][j];
        }
    }
}
