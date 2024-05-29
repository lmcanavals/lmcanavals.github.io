---
layout: default
title: Map generator
custom_css: mapgen
---

<h2>Sort of a text mode game map generator</h2>
<div class="options">
    <div class="map-elements">
    <h3>Map dimensions</h3>
        <label for="rows">Rows</label>
        <input type="number" id="rows" name="rows" value="21" min="10" max="30">
        <label for="cols">Columns</label>
        <input type="number" id="cols" name="cols" value="59" min="20" max="120">
        <button id="reset-map" class="btn">Reset</button>
    <h3>Map elements</h3>
        <button id="add" class="btn">Add new</button>
        <button id="remove" class="btn">Remove</button>
        <button id="save" class="btn">Save</button>
        <p></p>
        <div id="elements" class="elements"></div>
    </div>
    <div class="color-stuff">
        <h3>Element ASCII code and name</h3>
    <label for="ascii">ASCII</label>
        <input type="number" id="ascii" name="ascii" min="1" max="255">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" placeholder="enter element name" size="15">
        <h3>Foreground colors</h3>
        <div class="colors">
            <div class="fg0">
                <label for="fg0">
                    <input id="fg0" type="radio" name="fg" value="0"> 0
                </label>
            </div>
            <div class="fg1">
                <label for="fg1">
                    <input id="fg1" type="radio" name="fg" value="1"> 1
                </label>
            </div>
            <div class="fg2">
                <label for="fg2">
                    <input id="fg2" type="radio" name="fg" value="2"> 2
                </label>
            </div>
            <div class="fg3">
                <label for="fg3">
                    <input id="fg3" type="radio" name="fg" value="3"> 3
                </label>
            </div>
            <div class="fg4">
                <label for="fg4">
                    <input id="fg4" type="radio" name="fg" value="4"> 4
                </label>
            </div>
            <div class="fg5">
                <label for="fg5">
                    <input id="fg5" type="radio" name="fg" value="5"> 5
                </label>
            </div>
            <div class="fg6">
                <label for="fg6">
                    <input id="fg6" type="radio" name="fg" value="6"> 6
                </label>
            </div>
            <div class="fg7">
                <label for="fg7">
                    <input id="fg7" type="radio" name="fg" value="7"> 7
                </label>
            </div>
            <div class="fg8">
                <label for="fg8">
                    <input id="fg8" type="radio" name="fg" value="8"> 8
                </label>
            </div>
            <div class="fg9">
                <label for="fg9">
                    <input id="fg9" type="radio" name="fg" value="9"> 9
                </label>
            </div>
            <div class="fg10">
                <label for="fg10">
                    <input id="fg10" type="radio" name="fg" value="10"> 10
                </label>
            </div>
            <div class="fg11">
                <label for="fg11">
                    <input id="fg11" type="radio" name="fg" value="11"> 11
                </label>
            </div>
            <div class="fg12">
                <label for="fg12">
                    <input id="fg12" type="radio" name="fg" value="12"> 12
                </label>
            </div>
            <div class="fg13">
                <label for="fg13">
                    <input id="fg13" type="radio" name="fg" value="13"> 13
                </label>
            </div>
            <div class="fg14">
                <label for="fg14">
                    <input id="fg14" type="radio" name="fg" value="14"> 14
                </label>
            </div>
            <div class="fg15">
                <label for="fg15">
                    <input id="fg15" type="radio" name="fg" value="15"> 15
                </label>
            </div>
        </div>
        <h3>Background colors</h3>
        <div class="colors">
            <div class="bg0">
                <label for="bg0">
                    <input id="bg0" type="radio" name="bg" value="0"> &nbsp;
                </label>
            </div>
            <div class="bg1">
                <label for="bg1">
                    <input id="bg1" type="radio" name="bg" value="1"> &nbsp;
                </label>
            </div>
            <div class="bg2">
                <label for="bg2">
                    <input id="bg2" type="radio" name="bg" value="2"> &nbsp;
                </label>
            </div>
            <div class="bg3">
                <label for="bg3">
                    <input id="bg3" type="radio" name="bg" value="3"> &nbsp;
                </label>
            </div>
            <div class="bg4">
                <label for="bg4">
                    <input id="bg4" type="radio" name="bg" value="4"> &nbsp;
                </label>
            </div>
            <div class="bg5">
                <label for="bg5">
                    <input id="bg5" type="radio" name="bg" value="5"> &nbsp;
                </label>
            </div>
            <div class="bg6">
                <label for="bg6">
                    <input id="bg6" type="radio" name="bg" value="6"> &nbsp;
                </label>
            </div>
            <div class="bg7">
                <label for="bg7">
                    <input id="bg7" type="radio" name="bg" value="7"> &nbsp;
                </label>
            </div>
            <div class="bg8">
                <label for="bg8">
                    <input id="bg8" type="radio" name="bg" value="8"> &nbsp;
                </label>
            </div>
            <div class="bg9">
                <label for="bg9">
                    <input id="bg9" type="radio" name="bg" value="9"> &nbsp;
                </label>
            </div>
            <div class="bg10">
                <label for="bg10">
                    <input id="bg10" type="radio" name="bg" value="10"> &nbsp;
                </label>
            </div>
            <div class="bg11">
                <label for="bg11">
                    <input id="bg11" type="radio" name="bg" value="11"> &nbsp;
                </label>
            </div>
            <div class="bg12">
                <label for="bg12">
                    <input id="bg12" type="radio" name="bg" value="12"> &nbsp;
                </label>
            </div>
            <div class="bg13">
                <label for="bg13">
                    <input id="bg13" type="radio" name="bg" value="13"> &nbsp;
                </label>
            </div>
            <div class="bg14">
                <label for="bg14">
                    <input id="bg14" type="radio" name="bg" value="14"> &nbsp;
                </label>
            </div>
            <div class="bg15">
                <label for="bg15">
                    <input id="bg15" type="radio" name="bg" value="15"> &nbsp;
                </label>
            </div>
        </div>
    </div>
    <div class="glyphs">
        <h3>Glyphs</h3>
    <span id="glyphs"></span>
  </div>
</div>
<canvas id="cnvs" width="1280" height="768"></canvas>
<p>Descargue <a href="https://github.com/lmcanavals/intro_algorithms/blob/main/upc.h" target="_blank">upc.h</a></p>
<p>Descargue <a href="https://github.com/lmcanavals/intro_algorithms/blob/main/game.h" target="_blank">game.h</a></p>
<pre><code id="map"></code></pre>
<pre><code id="cpp" class="language-cpp"></code></pre>
<script src="/js/generator.js"></script>
