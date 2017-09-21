//define the method to draw the heatmap given a zip code

function update(zipCode) {
  d3.csv("heatmap.csv", function(error, buckets) {
    if (error) throw error;
    buckets = buckets.filter(function(row) {
           return row['Zip Code'] == zipCode;
       })

    // Coerce the CSV data to the appropriate types.
    buckets.forEach(function(d) {
      d['Zip Code'] =  d['Zip Code'];
      d.Month = d.Month;
      d.Year =  d.Year;
      d.Power = + d.Power;
      d.date = parseDate(d.Year + "-" + d.Month);
      console.log(d)
    });

    
    // Compute the scale domains.
    x.domain(d3.extent(buckets, function(d) { return d.date.getMonth(); }));
    y.domain(d3.extent(buckets, function(d) { return d.date.getFullYear(); }));
    z.domain([d3.min(buckets, function(d) { return d.Power; }), d3.max(buckets, function(d) { return d.Power; })]);
    
    
    // Display the tiles for each non-zero bucket.
    var tiles = svg.selectAll(".tile")
                   .data(buckets)
                   .enter().append("rect")
                   .filter(function(d){return d['Zip Code']==zipCode})
                   .attr("class", "tile")
                   .attr("x", function(d) { return x(d.date.getMonth()); })
                   .attr("y", function(d) { return y(d.date.getFullYear() + yStep); })
                   .attr("width", x(xStep) - x(0)-10)
                   .attr("height",  y(0) - y(yStep)-10)
                   .style("fill", function(d) { return z(d.Power); });

    
    // Add a legend for the color values.
    var legend = svg.selectAll(".legend")
        .data(z.ticks(7).reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(" + (width + 100) + "," + (i * 30-20) + ")"; });

    legend.append("rect")
        .attr("width", 25)
        .attr("height", 25)
        .style("fill", z);
    
    legend.append("text")
        .attr("x", 26)
        .attr("y", 10)
        .attr("dx", "10")
        .attr("dy", "10")
        .attr("font-size", "16px")
        .text(String);

    svg.append("text")
        .attr("class", "label")
        .attr("x", width + 100)
        .attr("y", -30)
        .attr("font-size", "20px")
        .text("kWh");

    // Add an x-axis with label.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(20," + height + ")")
        .call(d3.svg.axis().scale(monthScale).tickFormat(d3.time.format("%b")).orient("bottom"))

      .append("text")
        .attr("class", "label")
        .attr("x", width+70)
        .attr("y", 2)
        .attr("font-size", "16px")
        .attr("text-anchor", "end")
        .text("Month");

    // Add a y-axis with label.
    var yAxis = svg.append("g")
                   .attr("class", "y axis")
                   .call(d3.svg.axis().scale(y).orient("left"))
                   .attr("transform", "translate(-10, -20)"); 
        
    yAxis.append("text")
        .attr("class", "label")
        .attr("y", "-20")
        .attr("x", "0")
        .attr("font-size", "16px")
        .attr("text-anchor", "end")
        .text("Year");

        
  });
}