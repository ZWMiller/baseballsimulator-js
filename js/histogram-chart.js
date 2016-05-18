function histogramChart(title) {
  var margin = {top: 0, right: 0, bottom: 20, left: 0},
    width = 650,
    height = 400;

  var histogram = d3.layout.histogram(),
    x = d3.scale.ordinal(),
    y = d3.scale.linear(),
    xAxis = d3.svg.axis().scale(x).orient("bottom").tickSize(6, 0).tickFormat(d3.format("0f"));

  function chart(selection) {
    selection.each(function(data) {

      // Compute the histogram.
      data = histogram(data);

      // Update the x-scale.
      x   .domain(data.map(function(d) { return d.x; }))
        .rangeRoundBands([0, width - margin.left - margin.right],.01);

      // Update the y-scale.
        y   .domain([0, d3.max(data, function(d) { return d.y; })])
          .range([height - margin.top - margin.bottom, 0]);

        // Select the svg element, if it exists.
         // d3.select("svg").remove();
          var svg = d3.select(this).selectAll("svg").data([data]);

          // Otherwise, create the skeletal chart.
          var gEnter = svg.enter().append("svg").append("g");
          gEnter.append("g").attr("class", "bars");
          gEnter.append("g").attr("class", "x axis");

          // Update the outer dimensions.
          svg .attr("width", width)
            .attr("height", height);

          // Update the inner dimensions.
            var g = svg.select("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Update the bars.
              var bar = svg.select(".bars").selectAll(".bar").data(data);
              bar.enter().append("rect");
              bar.exit().remove();
              bar .attr("width", x.rangeBand())
                .attr("x", function(d) { return x(d.x); })
                .attr("y", function(d) { return y(d.y); })
                .attr("height", function(d) { return y.range()[0] - y(d.y); })
                .order();

              // Update the x-axis.
                g.select(".x.axis")
                  .attr("transform", "translate(0," + y.range()[0] + ")")
                  .call(xAxis);

                svg.append("text")
                  .attr("class", "x label")
                  .attr("text-anchor", "end")
                  .attr("x", width - width/3)
                  .attr("y", height - height/1.2)
                  .text(title);

                var padding = 20;
                var border=1;
                var bordercolor='black';
                var borderPath = svg.append("rect")
                  .attr("x", 0)
                  .attr("y", 0)
                  .attr("height", height)
                  .attr("width", width)
                  .style("stroke", bordercolor)
                  .style("fill", "none")
                  .style("stroke-width", border);
    });
  }

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  // Expose the histogram's value, range and bins method.
  d3.rebind(chart, histogram, "value", "range", "bins");

  // Expose the x-axis' tickFormat method.
  d3.rebind(chart, xAxis, "tickFormat");

  return chart;
}
