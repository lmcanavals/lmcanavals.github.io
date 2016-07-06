!(function(wnd, doc, log){

  d3.select('body').style('width', width + 'px');

  var datafileTsu = 'data/tsevent.txt.tsv';
  var datafileVol = 'data/volerup.txt.tsv';
  var width = 1280, height = width * 9 / 16;
  var graticule = d3.geo.graticule();
  var λ = d3.scale.linear().domain([0, width]).range([-180, 180]);
  var φ = d3.scale.linear().domain([0, height]).range([90, -90]);
  var scaler = d3.scale.linear().range([2, 30]);
  var scalec = d3.scale.linear().range([0, 255]);
  var pcur = [width / 2, height / 2];
  var pmousei;
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
  var ymin = -4360;
  var ymax = 2020;

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
    svg.selectAll('path').attr('d', path);
    svg.selectAll('circle')
      .attr('cx', function(d) { return projection([d[ftsux], d[ftsuy]])[0]; })
      .attr('cy', function(d) { return projection([d[ftsux], d[ftsuy]])[1]; })
      .attr('visibility', function(d) {
        return (d[ftsuf] >= ymin && d[ftsuf] <= ymax)? 'visible': 'hidden';
      });
    svg.selectAll('rect')
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
  svg.on('mousedown', function() {
    pmousei = d3.mouse(this);
    move = true;
  });
  svg.on('mouseup', function() {
    move = false;
    var p = d3.mouse(this);
    pcur = [pcur[0] + p[0] - pmousei[0], pcur[1] + p[1] - pmousei[1]];
  });
  svg.on('mousemove', function() {
    if (!move) return false;
    var p = d3.mouse(this);
    ptemp = [pcur[0] + p[0] - pmousei[0], pcur[1] + p[1] - pmousei[1]];
    projection.rotate([λ(ptemp[0]), φ(ptemp[1])]);
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

  d3.select(self.frameElement).style('height', height + 'px');

})(window,
   document,
   function(msg){ console.log(msg); });

