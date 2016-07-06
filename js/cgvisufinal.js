!(function(wnd, doc, log){

  var datafileTsu = 'data/tsevent.txt.tsv';
  var datafileVol = 'data/volerup.txt.tsv';
  var width = 1280, height = width * 9 / 16;
  var graticule = d3.geo.graticule();
  var λ = d3.scale.linear().domain([0, width]).range([-180, 180]);
  var φ = d3.scale.linear().domain([0, height]).range([90, -90]);
  var scaler = d3.scale.linear().range([2, 30]);
  var scalec = d3.scale.linear().range([0, 255]);
  var pcur = [width / 2, height / 2];
  var pini, plast;
  var move = false;
  var ftsux = 'LONGITUDE';
  var ftsuy = 'LATITUDE';
  var ftsur = 'FOCAL_DEPTH';
  var ftsuc = 'SOLOVIEV';
  var ftsuf = 'YEAR';
  var fvolx = 'Longitude';
  var fvoly = 'Latitude';
  var fvolr = 'Elevation';
  var fvolc = 'VEI';
  var fvolf = 'Year';
  var ymin = YMIN;
  var ymax = YMAX;

  d3.select('body').style('width', width + 'px');

  var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);
  var gMap = svg.append('g');
  var gData = svg.append('g');
  var vproj = [
  {'id': 0, 'name': 'Natural Earth', 'projection': d3.geo.naturalEarth()
    .scale(height * .315)
    .translate([width / 2, height / 2])},
  {'id': 1, 'name': 'Kavrayskiy VII', 'projection': d3.geo.kavrayskiy7()
    .scale(height * .315)
    .translate([width / 2, height / 2])},
  {'id': 2, 'name': 'Orthographic', 'projection': d3.geo.orthographic()
    .scale(height * .5)
    .translate([width / 2, height / 2])
    .clipAngle(90)}];
  var projection;
  var path = d3.geo.path();

  var see = d3.select('body').append('div').append('select');
  see.selectAll('option').data(vproj).enter()
    .append('option')
    .attr('value', function(d) { return d.id; })
    .text(function(d) { return d.name; });
  see.on('click', function() {
    changeProjection(this.selectedOptions[0].value);
    updateStuff();
    pcur = [width / 2, height / 2];
  });


  function updateStuff() {
    gMap.selectAll('path').attr('d', path);
    gData.selectAll('circle')
      .attr('cx', function(d) { return projection([d[ftsux], d[ftsuy]])[0]; })
      .attr('cy', function(d) { return projection([d[ftsux], d[ftsuy]])[1]; })
      .attr('visibility', function(d) {
        return (d[ftsuf] >= ymin && d[ftsuf] <= ymax)? 'visible': 'hidden';
      });
    gData.selectAll('rect')
      .attr('x', function(d) { return projection([d[fvolx], d[fvoly]])[0]; })
      .attr('y', function(d) { return projection([d[fvolx], d[fvoly]])[1]; })
      .attr('visibility', function(d) {
        return (d[fvolf] >= ymin && d[fvolf] <= ymax)? 'visible': 'hidden';
      });
  }

  function changeProjection(i) {
    projection = vproj[i].projection;
    path.projection(projection);
  }

  changeProjection(0);
  svg.on('touchstart', function() {
    if (d3.touches(this).length > 1) return; // TODO Fix touch events to still allow pinch zoom and stuff
    d3.event.preventDefault();
    d3.event.stopPropagation();
    pini = d3.touches(this)[0];
    move = true;
  });
  svg.on('touchend', function() {
    d3.event.preventDefault();
    d3.event.stopPropagation();
    move = false;
    pcur = plast;
  });
  svg.on('touchmove', function() {
    d3.event.preventDefault();
    d3.event.stopPropagation();
    if (!move) return false;
    var p = d3.touches(this)[0];
    plast = [pcur[0] + p[0] - pini[0], pcur[1] + p[1] - pini[1]];
    projection.rotate([λ(plast[0]), φ(plast[1])]);
    updateStuff();
  });
  svg.on('mousedown', function() {
    d3.event.preventDefault();
    d3.event.stopPropagation();
    pini = d3.mouse(this);
    move = true;
  });
  svg.on('mouseup', function() {
    d3.event.preventDefault();
    d3.event.stopPropagation();
    move = false;
    pcur = plast;
  });
  svg.on('mousemove', function() {
    d3.event.preventDefault();
    d3.event.stopPropagation();
    if (!move) return false;
    var p = d3.mouse(this);
    plast = [pcur[0] + p[0] - pini[0], pcur[1] + p[1] - pini[1]];
    projection.rotate([λ(plast[0]), φ(plast[1])]);
    updateStuff();
  });

  gMap.append('path')
    .datum(graticule)
    .attr('class', 'graticule')
    .attr('d', path);

  d3.json('data/world-110m.json', function(error, world) {
    if (error) throw error;

    var countries = topojson.feature(world, world.objects.countries).features,
    neighbors = topojson.neighbors(world.objects.countries.geometries);

    gMap.selectAll('.country')
      .data(countries)
      .enter().insert('path', '.graticule')
      .attr('class', 'country')
      .attr('d', path);

    gMap.insert('path', '.graticule')
      .datum(topojson.mesh(world, world.objects.countries,
            function(a, b) { return a !== b; }))
      .attr('class', 'boundary')
      .attr('d', path);
  });

  function doTypesTsu(d) {
    for (attrName in d) {
      if (attrTypeTsu[attrName].type !== NONE) {
        d[attrName] = convert(d[attrName], attrTypeTsu[attrName]);
      }
    }
    return d;
  };

  function dataProcessingTsu(error, data) {
    if (error) throw error;
    scaler.domain(d3.extent(data, function(d) { return d[ftsur]; }));
    scalec.domain(d3.extent(data, function(d) { return d[ftsuc]; }));
    var circles = gData.selectAll('circle').data(data);
    circles.enter().append('circle')
      .attr('cx', function(d) { return projection([d[ftsux], d[ftsuy]])[0]; })
      .attr('cy', function(d) { return projection([d[ftsux], d[ftsuy]])[1]; })
      .attr('r', function(d) { return scaler(d[ftsur]); })
      .style('fill', function(d) {
        var rb = Math.floor(scalec(d[ftsuc]));
        return 'rgb(' + rb + ', ' + rb + ', 255)';
      });
    circles.exit().remove();
  }

  function doTypesVol(d) {
    for (attrName in d) {
      if (attrTypeVol[attrName].type !== NONE) {
        d[attrName] = convert(d[attrName], attrTypeVol[attrName]);
      }
    }
    return d;
  };

  function dataProcessingVol(error, data) {
    if (error) throw error;
    scaler.domain(d3.extent(data, function(d) { return d[fvolr]; }));
    scalec.domain(d3.extent(data, function(d) { return d[fvolc]; }));
    var rects = gData.selectAll('rect').data(data);
    rects.enter().append('rect')
      .attr('x', function(d) { return projection([d[fvolx], d[fvoly]])[0]; })
      .attr('y', function(d) { return projection([d[fvolx], d[fvoly]])[1]; })
      .attr('width', function(d) { return scaler(d[fvolr]); })
      .attr('height', function(d) { return scaler(d[fvolr]); })
      .style('fill', function(d) {
        var rb = Math.floor(scalec(d[fvolc]));
        return 'rgb(255, ' + rb + ', ' + rb + ')';
      });
    rects.exit().remove();
  }

  d3.tsv(datafileTsu, doTypesTsu, dataProcessingTsu);
  d3.tsv(datafileVol, doTypesVol, dataProcessingVol);

  var timescale = d3.scale.pow().exponent(2)
    .range([50, width - 50])
    .domain([0, YMAX - YMIN]).nice();
  var scaletime = d3.scale.pow().exponent(.5)
    .range([0, YMAX - YMIN])
    .domain([50, width - 50]).nice();
  var timeaxis = d3.svg.axis()
    .scale(timescale)
    .ticks(9, '')
    .tickFormat(function(d) { return d + YMIN; })
    .orient('top');
  svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0, ' + (height - 1) + ')')
    .call(timeaxis)
    .selectAll('text')
      .attr('y', 0)
      .attr('x', 30)
      .attr('transform', 'rotate(-60)')
      .style('font-size', '.75em');
  var timeline = svg.append('line')
    .attr('x1', 50).attr('y1', height - 10)
    .attr('x2', width - 50).attr('y2', height - 10)
    .attr('stroke-width', '20px')
    .attr('stroke', 'yellow')
    .attr('stroke-opacity', .1)
    .attr('stroke-linecap', 'round');
  var barymin = svg.append('line')
    .attr('x1', timescale(ymin - YMIN)).attr('y1', height - 15)
    .attr('x2', timescale(ymin - YMIN)).attr('y2', height - 5)
    .attr('stroke', '#a68')
    .attr('stroke-width', '10px')
    .attr('stroke-opacity', .75)
    .attr('stroke-linecap', 'round');
  var barymax = svg.append('line')
    .attr('x1', timescale(ymax - YMIN)).attr('y1', height - 15)
    .attr('x2', timescale(ymax - YMIN)).attr('y2', height - 5)
    .attr('stroke', '#a6f')
    .attr('stroke-width', '10px')
    .attr('stroke-opacity', .75)
    .attr('stroke-linecap', 'round');
  var ypini = -1;
  barymin.on('click', function() { ypini = 0; });
  barymax.on('click', function() { ypini = 1; });
  timeline.on('click', function() {
    if (ypini === -1) return false;
    var m = d3.mouse(this);
    if (m[0] >= 5 && m[0] <= width - 5) {
      if (ypini === 0) {
        ymin = Math.floor(scaletime(m[0]) + YMIN);
        log(ymin);
        barymin
          .attr('x1', timescale(ymin - YMIN))
          .attr('x2', timescale(ymin - YMIN));
      } else {
        ymax = Math.floor(scaletime(m[0]) + YMIN);
        barymax
          .attr('x1', timescale(ymax - YMIN))
          .attr('x2', timescale(ymax - YMIN));
      }
      updateStuff();
      updateLegend();
    }
    yini = -1;
  });

  var gLegend = svg.append('g')
    .attr('transform', 'translate(20, ' + (height - 200) + ')');
  gLegend.append('rect')
    .attr('x', 0).attr('y', 0)
    .attr('width', 200).attr('height', 150)
    .attr('fill', '#eee')
    .style('fill-opacity', .75)
    .style('stroke', 'gray')
    .style('stroke-width', '2px')
    .style('stroke-opacity', .5);
  var tymin = gLegend.append('text')
    .attr('x', 5).attr('y', 17)
    .attr('font-family', 'monospace')
    .attr('font-size', '1em')
    .style('fill', '#a68')
    .text('Desde el año ' + ymin);
  var tymax = gLegend.append('text')
    .attr('x', 5).attr('y', 30)
    .attr('font-family', 'monospace')
    .attr('font-size', '1em')
    .style('fill', '#a6f')
    .text('Hasta el año ' + ymax);
  gLegend.append('text')
    .attr('x', 5).attr('y', 43)
    .attr('font-family', 'monospace')
    .attr('font-size', '1em')
    .style('fill', 'blue')
    .text('Tsunamis');
  gLegend.append('text')
    .attr('x', 5).attr('y', 103)
    .attr('font-family', 'monospace')
    .attr('font-size', '1em')
    .style('fill', 'red')
    .text('Volcanes');
  var defs = gLegend.append('defs');
  var gradTsu = defs.append("linearGradient")
      .attr("id", "gradTsu")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 80).attr("y1", 0)
      .attr("x2", 120).attr("y2", 0)
    .selectAll("stop")
      .data([
        {offset: "0%", color: "white"},
        {offset: "100%", color: "blue"}
      ])
    .enter().append("stop")
      .attr("offset", function(d) { return d.offset; })
      .attr("stop-color", function(d) { return d.color; });
  var gradVol = defs.append("linearGradient")
      .attr("id", "gradVol")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 80).attr("y1", 0)
      .attr("x2", 120).attr("y2", 0)
    .selectAll("stop")
      .data([
        {offset: "0%", color: "white"},
        {offset: "100%", color: "red"}
      ])
    .enter().append("stop")
      .attr("offset", function(d) { return d.offset; })
      .attr("stop-color", function(d) { return d.color; });
  gLegend.append('circle')
    .attr('cx', 100).attr('cy', 51)
    .attr('r', 20)
    .attr('fill', 'url(#gradTsu)')
    .style('fill-opacity', 1);
  gLegend.append('rect')
    .attr('x', 80).attr('y', 90)
    .attr('width', 40).attr('height', 40)
    .attr('fill', 'url(#gradVol)')
    .style('fill-opacity', 1);

  function updateLegend() {
    tymin.text('Desde el año ' + ymin);
    tymax.text('Hasta el año ' + ymax);
  }

  d3.select(self.frameElement).style('height', height + 'px');

})(window,
   document,
   function(msg){ console.log(msg); });

