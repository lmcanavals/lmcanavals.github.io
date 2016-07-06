!(function(wnd, doc, csl){
  csl.log('Hello and welcome! This is just a little project');
  var svg, g, scaleX, scaleY, scaleR, scaleR2, scaleCol;
  var xcol, ycol, rcol, ccol;
  var width = 960, height = 480;
  var inwidth = 800, inheight = 400;
  wnd.onload = function() {
    svg = d3.select('body')
      .append('div')
      .classed('svg-container', true)
      .append('svg');
    svg.attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 ' + width + ' ' + height)
      .classed('svg-content-responsive');
    g = svg.append('g');
    g.attr('transform', 'translate(50, 50)');
    scaleX = d3.scale.linear().range([0, inwidth]);
    scaleY = d3.scale.linear().range([inheight, 0]);
    scaleR = d3.scale.linear().range([5, 40]);
    scaleR2 = d3.scale.linear().range([5, 40]);
    scaleCol = d3.scale.linear().range([0, 255]);
    xcol = "";
    // datafiles: tsevent.txt.tsv  volerup.txt.tsv

    attrType = {
      'ID': {'type': INT, 'defaultValue': 0},
      'YEAR': {'type': INT, 'defaultValue': 0},
      'MONTH': {'type': INT, 'defaultValue': 0},
      'DAY': {'type': INT, 'defaultValue': 0},
      'HOUR': {'type': INT, 'defaultValue': 0},
      'MINUTE': {'type': INT, 'defaultValue': 0},
      'SECOND': {'type': INT, 'defaultValue': 0},
      'EVENT_VALIDITY': {'type': INT, 'defaultValue': 0},
      'CAUSE_CODE': {'type': INT, 'defaultValue': 0},
      'FOCAL_DEPTH': {'type': INT, 'defaultValue': 0},
      'PRIMARY_MAGNITUDE': {'type': FLOAT, 'defaultValue': 0},
      'COUNTRY': {'type': NONE, 'defaultValue': 0},
      'STATE': {'type': NONE, 'defaultValue': 0},
      'LOCATION_NAME': {'type': NONE, 'defaultValue': 0},
      'LATITUDE': {'type': FLOAT, 'defaultValue': 0},
      'LONGITUDE': {'type': FLOAT, 'defaultValue': 0},
      'REGION_CODE': {'type': INT, 'defaultValue': 0},
      'MAXIMUM_WATER_HEIGHT': {'type': FLOAT, 'defaultValue': 0},
      'ABE': {'type': NONE, 'defaultValue': 0},
      'IIDA': {'type': FLOAT, 'defaultValue': 0},
      'SOLOVIEV': {'type': FLOAT, 'defaultValue': 0},
      'WARNING_STATUS': {'type': FLOAT, 'defaultValue': 0},
      'DEATHS': {'type': INT, 'defaultValue': 0},
      'DEATHS_DESCRIPTION': {'type': INT, 'defaultValue': 0},
      'MISSING': {'type': INT, 'defaultValue': 0},
      'MISSING_DESCRIPTION': {'type': INT, 'defaultValue': 0},
      'INJURIES': {'type': INT, 'defaultValue': 0},
      'INJURIES_DESCRIPTION': {'type': INT, 'defaultValue': 0},
      'DAMAGE_MILLIONS_DOLLARS': {'type': FLOAT, 'defaultValue': 0},
      'DAMAGE_DESCRIPTION': {'type': INT, 'defaultValue': 0},
      'HOUSES_DESTROYED': {'type': INT, 'defaultValue': 0},
      'HOUSES_DESTROYED_DESCRIPTION': {'type': INT, 'defaultValue': 0},
      'HOUSES_DAMAGED': {'type': INT, 'defaultValue': 0},
      'HOUSES_DAMAGED_DESCRIPTION': {'type': INT, 'defaultValue': 0},
      'TOTAL_DEATHS': {'type': INT, 'defaultValue': 0},
      'TOTAL_DEATHS_DESCRIPTION': {'type': INT, 'defaultValue': 0},
      'TOTAL_MISSING': {'type': INT, 'defaultValue': 0},
      'TOTAL_MISSING_DESCRIPTION': {'type': INT, 'defaultValue': 0},
      'TOTAL_INJURIES': {'type': INT, 'defaultValue': 0},
      'TOTAL_INJURIES_DESCRIPTION': {'type': INT, 'defaultValue': 0},
      'TOTAL_DAMAGE_MILLIONS_DOLLARS': {'type': FLOAT, 'defaultValue': 0},
      'TOTAL_DAMAGE_DESCRIPTION': {'type': INT, 'defaultValue': 0},
      'TOTAL_HOUSES_DESTROYED': {'type': INT, 'defaultValue': 0},
      'TOTAL_HOUSES_DESTROYED_DESCRIPTION': {'type': INT, 'defaultValue': 0},
      'TOTAL_HOUSES_DAMAGED': {'type': INT, 'defaultValue': 0},
      'TOTAL_HOUSES_DAMAGED_DESCRIPTION': {'type': INT, 'defaultValue': 0}
    }

    d3.tsv('data/tsevent.txt.tsv', doTypes, processData);
  }
  function doTypes(d) {
    for (attrName in d) {
      if (attrType[attrName].type !== NONE) {
        d[attrName] = convert(d[attrName], attrType[attrName]);
      }
    }
    return d;
  };
  function processData(error, data) {
    scaleX.domain(d3.extent(data, function(d) { return d.LONGITUDE; }));
    scaleY.domain(d3.extent(data, function(d) { return d.LATITUDE; }));
    scaleR.domain(d3.extent(data, function(d) { return d.DAMAGE_MILLIONS_DOLLARS; }));
    scaleR2.domain(d3.extent(data, function(d) { return d.MISSING; }));
    scaleCol.domain(d3.extent(data, function(d) { return d.DEATHS; }));
    if (error) throw error;
    var ellipses = g.selectAll('ellipse').data(data)
    ellipses.enter().append('ellipse')
        .attr('cx', function(d) { return scaleX(d.LONGITUDE); })
        .attr('cy', function(d) { return scaleY(d.LATITUDE); })
        .attr('rx', function(d) { return scaleR(d.DAMAGE_MILLIONS_DOLLARS); })
        .attr('ry', function(d) { return scaleR2(d.MISSING); })
        .style('stroke', function(d) { return 'rgba('+scaleCol(d.DEATHS)+', 0, 0, 0.1)'; });
    ellipses.exit().remove();
  }
  return true;
})(window, document, console);
