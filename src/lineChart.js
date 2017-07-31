(function lineChartIFFE(){
    var svg = d3.select("svg.linechart"),
        margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function drawGraph(data) {
        let xAxis = 'Country';
        let yAxis = ['Population (mill)', "Life Expectancy"];
        let axes = {};

        yAxis.forEach(function(y) {
            data.forEach(function(d) {
                d[y] = +d[y];
                return d;
            });
        })

        axes = defineScales(axes);
        axes = defineDomains(axes, xAxis, yAxis);

        const lines = lineData(axes, xAxis, yAxis);
        const colour = d3.scaleOrdinal(d3.schemeCategory10);

        g.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(axes.x))
            .selectAll('text')
                .style('text-anchor', 'end')
                .attr('dx', '-.8em')
                .attr('dy', '.15em')
                .attr('transform', 'rotate(-65)' );

        g.append('g')
            .call(d3.axisLeft(axes.y))
            .append('text')
            .attr('class', 'label-style')
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(yAxis);
        
        lines.forEach(function(line, i) {
            let path = g.append('path')
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", colour(yAxis[i]))
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", line);
            animateLine(path);
        })
    };

    function defineScales(axes) {
        axes.x = d3.scaleBand()
            .rangeRound([0, width])
            .padding(1);
        axes.y = d3.scaleLinear()
            .rangeRound([height, 0]);
        return axes;
    }

    function defineDomains(axes, xAxis, yAxis) {
        axes.x.domain(data.map(function(d) { return d[xAxis]; }));
        axes.y.domain([
            d3.min(yAxis, function(y) { return d3.min(data, function(d) { return d[y]})}),
            d3.max(yAxis, function(y) { return d3.max(data, function(d) { return d[y]})})
        ])
        return axes;
    }

    function lineData(axes, xAxis, yAxis) {
        let lines = [];
        yAxis.forEach(function(y) {
            let line = d3.line()
                .x(function(d) { return axes.x(d[xAxis]); })
                .y(function(d) { return axes.y(d[y]); });
            lines.push(line);
        })
        return lines
    }

    function animateLine(path) {
        let totalLength = path.node().getTotalLength();
        path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(1500)
            .attr('stroke-dashoffset', 0);
    }

    drawGraph(data);
})();
