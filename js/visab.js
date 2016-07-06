!(function(wnd, doc, log){

  d3.select('body').style('width', width + 'px');

  var datafile = 'data/tsevent.txt.tsv';
  var width = 1280,
  height = width * 9 / 16;
  var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);
  var gMap = svg.append('g');
  var gData = svg.append('g');

  var vproy = ['Ortographic', 'Kavrayskiy VII', 'Natural Earth'];

  var see = d3.select('body').append('div').append('select');
  see.selectAll('option').data(vproy).enter().append('option').attr('value', function(d){return d;});

  var projection1 = d3.geo.orthographic()
    .scale(height * .5)
    .translate([width / 2, height / 2])
    .clipAngle(90);

  var projection2 = d3.geo.kavrayskiy7()
    .scale(height * .315)
    .translate([width / 2, height / 2]);

  var projection = d3.geo.naturalEarth()
    .scale(height * .315)
    .translate([width / 2, height / 2]);

  var path = d3.geo.path()
    .projection(projection);

  var graticule = d3.geo.graticule();

  var λ = d3.scale.linear().domain([0, width]).range([-180, 180]);
  var φ = d3.scale.linear().domain([0, height]).range([90, -90]);
  var scalex = d3.scale.linear().range([0, width]);
  var scaley = d3.scale.linear().range([height, 0]);
  var scaler = d3.scale.linear().range([3, 100]);
  var scalec = d3.scale.linear().range([50, 255]);
  var fieldx = 'LONGITUDE';
  var fieldy = 'LATITUDE';
  var fieldr = 'FOCAL_DEPTH';
  var fieldc = 'MAXIMUM_WATER_HEIGHT';

  svg.on('mousemove', function() {
    var p = d3.mouse(this);
    projection.rotate([λ(p[0]), φ(p[1])]);
    svg.selectAll('path').attr('d', path);
    svg.selectAll('circle')
      .attr('cx', function(d) { return projection([d[fieldx], d[fieldy]])[0]; })
      .attr('cy', function(d) { return projection([d[fieldx], d[fieldy]])[1]; })
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
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
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

  function dataProcessing(error, data) {
    if (error) throw error;
    scalex.domain(d3.extent(data, function(d) { return d[fieldx]; }));
    scaley.domain(d3.extent(data, function(d) { return d[fieldy]; }));
    scaler.domain(d3.extent(data, function(d) { return d[fieldr]; }));
    scalec.domain(d3.extent(data, function(d) { return d[fieldc]; }));
    if (error) throw error;
    var circles = gData.selectAll('circle').data(data)
      circles.enter().append('circle')
      .attr('cx', function(d) { return projection([d[fieldx], d[fieldy]])[0]; })
      .attr('cy', function(d) { return projection([d[fieldx], d[fieldy]])[1]; })
      .attr('r', function(d) { return scaler(d[fieldr]); })
      .style('opaque', 0.2)
      .style('fill', function(d) { return 'rgb(0, 0, '+Math.floor(scalec(d[fieldc]))+')'; });
    circles.exit().remove();
  }

  d3.tsv(datafile, doTypesTsu, dataProcessing);

  d3.select(self.frameElement).style('height', height + 'px');

})(window,
   document,
   function(msg){ console.log(msg); });

