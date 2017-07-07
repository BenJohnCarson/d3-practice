(function lineChartIFFE(){
    var svg = d3.select("svg.lineChart"),
        margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%d-%b-%y");

    // var x = d3.scaleTime()
    //     .rangeRound([0, width]);
    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var line = d3.line()
        .x(function(d) { return x(d.letter); })
        .y(function(d) { return y(d.frequency); });

    // d3.tsv("data.tsv", function(d) {
    //   d.date = parseTime(d.date);
    //   d.close = +d.close;
    //   return d;
    function drawGraph(data) {
    // if (error) throw error;
    data.forEach(function(d) {
        // d.date = parseTime(d.date);
        // d.close = +d.close;
        d.frequency = +d.frequency;
        return d;
    });

    // x.domain(d3.extent(data, function(d) { return d.letter; }));
    x.domain(data.map(function(d) { return d.letter; }));
    y.domain(d3.extent(data, function(d) { return d.frequency; }));

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .select(".domain")
        .remove();

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price ($)");

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
    };

    drawGraph(barData);
})();
