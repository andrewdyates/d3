function draw(data) {
  "use strict";
  var margin = 50, width = 700, height = 300;
  // get minimum and maximum values of collisions_with_injuries
  var x_extent = d3.extent(data, function(d){return d.collision_with_injury;});
  var x_scale = d3.scale.linear()
    .range([margin, width-margin])
    .domain(x_extent);
  var y_extent = d3.extent(data, function(d){return d.dist_between_fail;});
  // reverse y-direction since origin is in top left corner of viewport
  var y_scale = d3.scale.linear()
    .range([height-margin, margin])
    .domain(y_extent);
  
  d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle");
  d3.selectAll("circle")
    .attr("cx", function(d){return x_scale(d.collision_with_injury);})
    .attr("cy", function(d){return y_scale(d.dist_between_fail);});
  d3.selectAll("circle")
    .attr("r", 5);

  var x_axis = d3.svg.axis().scale(x_scale);
  d3.select("svg")
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height-margin) + ")")
    .call(x_axis);
  var y_axis = d3.svg.axis().scale(y_scale).orient("left");
  d3.select("svg")
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin + ", 0 )")
    .call(y_axis);

  d3.select(".x.axis")
    .append("text")
    .text("collisions with injury (per million miles)")
    .attr("x", (width/2) - margin)
    .attr("y", margin/1.5);
  d3.select(".y.axis")
    .append("text")
    .text("mean distance between failure (miles)")
    .attr("transform", "rotate (-90, -43, 0) translate(-280)");
}