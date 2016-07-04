!(function(wnd, doc, csl){
  csl.log('Hello and welcome!');
  var svg, g, scaleD, scaleH, scaleDur, scaleCol;
  var xcol, ycol, rcol, ccol;
  var width = 960, height = 540;
  var inwidth = 860, inheight = 440;
  wnd.onload = function() {
    svg = d3.select('body').append('svg')
      .attr('width', width)
      .attr('height', height);
    g = svg.append('g');
    g.attr('transform', 'translate(50, 50)');
    scaleD = d3.scale.linear().range([0, inwidth]);
    scaleH = d3.scale.linear().range([inheight, 0]);
    scaleDur = d3.scale.linear().range([10, 50]);
    scaleCol = d3.scale.category20();
    xcol = ""
    d3.csv('data.csv', type, processData);
  }
  function type(d) {
    d.DateTime = new Date(Date.parse(d.DateTime + ' UTC'));
    var dur = d.Duration.match(/\d+/g);
    d.Duration = (dur != null && dur.length == 3)?
      dur[0] * 3600 + dur[1] * 60 + dur[2] * 1 : 0;
    d.Posted = new Date(Date.parse(d.Posted + ' 00:00:00 UTC'));
    return d;
  };
  function processData(error, data) {

    scaleD.domain(d3.extent(data, function(d) { return d.DateTime.getDay(); }));
    scaleH.domain(d3.extent(data, function(d) { return d.DateTime.getHours(); }));
    scaleDur.domain(d3.extent(data, function(d) { return d.Duration; }));
    if (error) throw error;
    var circles = g.selectAll('circle').data(data)
    circles.enter().append('circle')
        .attr('cx', function(d) { return scaleD(d.DateTime.getDay()); })
        .attr('cy', function(d) { return scaleH(d.DateTime.getHours()); })
        .attr('r', function(d) { return scaleDur(d.Duration); })
        .attr('stroke', function(d) { return scaleCol(d.Shape); });
    circles.exit().remove();
  }
  return true;
})(window, document, console);