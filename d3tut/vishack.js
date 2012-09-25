var time_scale;
var percent_scale;
function draw(data) {
  // define SVG window in an organized fashion
  var container_dimensions = {width: 900, height: 400},
  margins = {top: 10, right: 20, bottom: 30, left: 60},
  chart_dimensions = {
    width: container_dimensions.width - margins.left - margins.right,
    height: container_dimensions.height - margins.top - margins.bottom
  };

  // save selection of chart in SVG elements  
  var chart = d3.select("#timeseries")
    .append("svg")
      .attr("width", container_dimensions.width)
      .attr("height", container_dimensions.height)
    .append("g")
      .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
      .attr("id", "chart");

  // manually set time and percent scales
  time_scale = d3.time.scale()
    .range([0,chart_dimensions.width])
    .domain([1230789600000, 1301634000000]);
  
  percent_scale = d3.scale.linear()
    .range([chart_dimensions.height, 0])
    .domain([65,90]);

  // generate d3 axii from scales
  var time_axis = d3.svg.axis()
    .scale(time_scale);
  var count_axis = d3.svg.axis()
    .scale(percent_scale)
    .orient("left");

  // Create group for x-axis: time and y-axis: percent
  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + chart_dimensions.height + ")")
    .call(time_axis);
  chart.append("g")
    .attr("class", "y axis")
    .call(count_axis);

  // Set text for y-axis
  d3.select(".y.axis")
    .append("text")
    .attr("text-anchor", "middle")
    .text("percent on time")
    .attr("transform", "rotate (-270, 0, 0)")
    .attr("x", container_dimensions.height/2)
    .attr("y", 50);
  
  // build key
  var key_items = d3.select("#key")
	.selectAll("div")
	.data(data)
	.enter()
	.append("div")
	.attr("class", "key_line")
	.attr("id", function(d){return d.line_id});
  key_items.append("div")
    .attr("id", function(d){return "key_square_" + d.line_id})
    .attr("class", "key_square");
  key_items.append("div")
    .attr("class", "key_label")
    .text(function(d){return d.line_name});

  // add function hook 'get_timeseries_data' to key_line divs
  d3.selectAll(".key_line")
    .on("click", get_timeseries_data);  // element data as 1st arg, index as 2nd

}


function get_timeseries_data() {
  // get the ID of the current element
  var id = d3.select(this).attr("id");
  // see if we have an associated time series
  var ts = d3.select("#"+id+"_path");
  console.log(ts);
  if (ts.empty()){
    d3.json("data/subway_wait.json", function(data) {
      // ideally, one would only request data needed rather than use `filter`
      filtered_data = data.filter(function(d){return d.line_id === id});
      draw_timeseries(filtered_data, id);
    });
  } else {
    ts.remove();
  }
}
    
function draw_timeseries(data, id){
  var line = d3.svg.line()
        .x(function(d){return time_scale(d.time)})
        .y(function(d){return percent_scale(d.late_percent)})
        .interpolate("linear");
        
  var g = d3.select('#chart')
        .append('g')
        .attr('id', id+"_path")
        .attr('class', 'timeseries ' + id);
        
  g.append('path')
    .attr('d', line(data));
}
    
