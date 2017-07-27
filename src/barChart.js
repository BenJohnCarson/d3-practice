(function barChartIFFE(){
    var svg = d3.select("svg.vertical"),
        margin = {top: 50, right: 50, bottom: 50, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function drawGraph(data) {
        const xAxis = 'Country';
        const yAxis = 'Population (mill)';

        data.forEach(function(d) {
            d[yAxis] = +d[yAxis];
            return d;
        });

        x.domain(data.map(function(d) { return d[xAxis]; }));
        y.domain([0, d3.max(data, function(d) { return d[yAxis]; })]);

        g.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .attr("y", 30)
            .attr("x", 650)
            .attr("dy", "0.5em")
            .style("fill", "black")
            .text(xAxis);

        g.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text(yAxis);

        g.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d[xAxis]); })
            .attr("y", function(d) { return y(d[yAxis]); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d[yAxis]); })
        };
    drawGraph(data);
})();
