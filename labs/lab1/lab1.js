var flu_data; // loaded asynchronously
var range;
var time_scale;
var color_scale_class = "Blues";
var path = d3.geo.path();
var svg = d3.select("#chart")
  .append("svg");
var legend = d3.select("#legend")
  .append("svg");
var states = svg.append("g")
  .attr("id", "states")
  .attr("class", color_scale_class);

// Draw US States to map
d3.json("us-states.json", function(collection) {
  states.selectAll("path")
    .data(collection.features)
    .enter().append("path")
    // uses 'geometry' parameter to draw path
    .attr("d", path.projection(d3.geo.albersUsa()))
    .append("svg:title")
      .text(function(d,i) {
	return d.properties.name;
      });
});

d3.json("data_flutrends.json", function(json) {
  flu_data = json;
  // Get state names
  state_names = [];
  states.selectAll("path").each(function(d){state_names.push(d.properties.name)});
  all_values = d3.merge(flu_data.map(function(q){
    return state_names.map(function(d){return q.data[d];});}));
  range = d3.extent(all_values);
  draw_states(0);
  draw_slider(0);
  draw_timescale();
  draw_date(0);

  legend
    .attr("width", 13*11+2)
    .attr("height", 14)
    .append("g")
    .attr("class", color_scale_class)
    .selectAll("rect")
    .data(["missing",0,1,2,3,4,5,6,7,8,"outbreak"])
    .enter().append("rect")
    .attr("width", 12)
    .attr("height", 12)
    .attr("y", 1)
    .attr("x", function(d,i){return i*13+1;})
    .attr("class", function(d,i){
      if (isNaN(d)) {
	return d;
      } else {
	return "q"+d+"-9";
      }})
    .append("svg:title")
      .text(function(d,i) {
	if (isNaN(d)) {
	  return toTitleCase(d);
	} else {
	  x = d+1;
	  return "Level "+x;
	}});

});

function draw_states(t) {
  states.selectAll("path")
    .attr("class", function(d,i){return quantize(d, t)})
    .select("title")
    .text(function(d,i) {
	var lvl = flu_data[t].data[d.properties.name];
	return d.properties.name + ": " + lvl;
	});

}

function quantize(d, t) {
  value = flu_data[t].data[d.properties.name];
  if (value === undefined) {
    return "missing";
  } else {
    // this should be using an interpolator
    // max out at p
    x = Math.min(8, Math.floor((value-range[0]) / (0.5*range[1]-range[0]) * 9));
    if (value >= 0.6*range[1]) {
      color_class = "outbreak";
    } else {
      color_class = "q" + x + "-9";
    }
    return color_class;
  }
}

// slider
function draw_slider(start) {
  if (isNaN(start) || start < 0 || start > range[1]) start = 0;
  $("#scale").slider({
    min: 0,
    max: flu_data.length-1,
    value: start,
    slide: function(event, ui) {
      draw_states(ui.value);
      draw_date(ui.value);
    }
  });
}

function draw_timescale() {
  t = flu_data[0]; date1 = new Date(t['year'], t['month']-1, t['day']);
  t = flu_data[flu_data.length-1]; date2 = new Date(t['year'], t['month']-1, t['day']);

  var chart = d3.select("#time_axis")
    .append("svg")
      .attr("width", 960)
      .attr("height", 20)
    .append("g")
      .attr("id", "chart");

  time_scale = d3.time.scale()
    .range([0,960])
    .domain([new Date(2005, 1, 1), new Date(2011, 1, 1)]);
  var time_axis = d3.svg.axis()
    .scale(time_scale);
  chart.append("g")
    .attr("class", "x axis")
    .call(time_axis);
}

function draw_date(i) {
  d = flu_data[i].date;
  s = $.datepicker.formatDate('yy, MM dd', new Date(d['year'], d['month']-1, d['day']));
  d3.select("#date_text")
    .text(s);
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function draw_national() {
  var x_scale = d3.scale.linear()
	.range([0,960])
        .domain([0, flu_data.length]);
  d3.select("#national")
    .append("svg")
    .attr("width", 960)
    .attr("height", 50);
}