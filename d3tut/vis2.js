function draw(data) {
  "use strict";
  d3.select("body")
    .append("div").attr("class", "chart")
    .selectAll(".bar")
    .data(data.cash)
    .enter()
    .append("div")
    .attr("class", "bar")
    .style("width", function(d){return d.count/100 + "px";})
    .style("outline", "1px solid black")
    .text(function(d){return Math.round(d.count);});
}