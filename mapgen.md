---
layout: default
title: Map generator
custom_css: mapgen
---

<h2>Sort of a text mode game map generator</h2>
<label>Rows: <input type="number" id="rows" value="22" min="10" max="24"></label>
<label>Columns: <input type="number" id="cols" value="60" min="20" max="80"></label>
<button id="nuevo">Nuevo!</button>
<div class="options">
  <div class="box1">
    <h3>Glyphs</h3>
    <span id="glyphs"></span>
  </div>
  <div class="box3">
    <h3>Map elements</h3>
{%- for i in (0..15) -%}
    <label for="code{{ i }}" class="opt">
      <input type="radio" id="code{{ i }}" name="code" value="{{ i }}" {%- if i == 0 -%}checked{%- endif -%}>
      <input type="number" id="char{{ i }}" min="1" max="255" {%- if i == 0 -%} value="0" readonly{%- endif -%}>
      <input type="text" id="name{{ i }}">
    </label>
{%- endfor -%}
  </div>
  <div>
    <h3>Foreground colors</h3>
{%- for i in (0..15) -%}
    <div class="fg fg{{ i }} box2">
      <label for="fg{{ i }}">
        <input id="fg{{ i }}" type="radio" name="fg" value="{{ i }}" {%- if i == 7 -%}checked{%- endif -%}> {{ i }}
      </label>
    </div>
{%- endfor -%}
    
    <br>
    <h3>Background colors</h3>
{%- for i in (0..15) -%}
    <div class="bg bg{{ i }} box2">
      <label for="bg{{ i }}">
        <input id="bg{{ i }}" type="radio" name="bg" value="{{ i }}" {%- if i == 0 -%}checked{%- endif -%}> &nbsp;
      </label>
    </div>
{%- endfor -%}
  </div>
</div>
<canvas id="cnvs" width="1280" height="768"></canvas>
<p>Descargue <a href="https://github.com/lmcanavals/intro_algorithms/blob/main/upc.h" target="_blank">upc.h</a></p>
<p>Descargue <a href="https://github.com/lmcanavals/intro_algorithms/blob/main/game.h" target="_blank">game.h</a></p>
<pre><code id="map"></code></pre>
<pre><code id="cpp" class="language-cpp"></code></pre>
<script src="/js/generator.js"></script>
