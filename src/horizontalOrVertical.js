(function bothIFFE(){
    const svg = d3.select("svg.both");
    const margin = {top: 50, right: 50, bottom: 50, left: 50};
    const width = svg.attr("width") - margin.left - margin.right;
    const height = svg.attr("height") - margin.top - margin.bottom;
    const g = svg.append("g").attr("transform", "translate(" + margin.left + "," +margin.top + ")");

    
    function drawGraph(data, style, animate) {
        let xAxis = 'Country';
        let yAxis = 'Population (mill)';
        let axes = {};

        if (!isVertical(style)) {
            let temp = xAxis;
            xAxis = yAxis;
            yAxis = temp;
        }
        axes = defineScales(style, axes);

        data = prepareData(data, style, xAxis, yAxis);

        axes = defineDomains(axes, xAxis, yAxis, style);


        g.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(axes.x))
            .append("text")
            .attr("y", 30)
            .attr("x", 650)
            .attr("dy", "0.5em")
            .style("fill", "black")
            .text(xAxis);

        g.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(axes.y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text(yAxis);
        
        appendBars(axes, xAxis, yAxis, style, animate);
    }

    function defineScales(style, axes) {
        if (isVertical(style)) {
            axes.x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
            axes.y = d3.scaleLinear().rangeRound([height, 0]);
        } else {
            axes.x = d3.scaleLinear().rangeRound([0, width]);
            axes.y = d3.scaleBand().rangeRound([height, 0]).padding(0.1);
        }
        return axes;
    }

    function prepareData(data, style, xAxis, yAxis) {   
        let axis;
        (isVertical(style)) ? axis = yAxis : axis = xAxis;
        data.forEach(function(d) {
            d[axis] = +d[axis];
            return d;
        });
        return data;
    }

    function defineDomains(axes, xAxis, yAxis, style) {
        if(isVertical(style)) {
            axes.x.domain(data.map(function(d) { return d[xAxis]; }));
            axes.y.domain([0, d3.max(data, function(d) { return d[yAxis]; })]);
        } else {
            axes.x.domain([0, d3.max(data, function(d) { return d[xAxis]; })]);
            axes.y.domain(data.map(function(d) { return d[yAxis]; }));
        }
        return axes;
    }

    function appendBars(axes, xAxis, yAxis, style, animate) {
        let bars = g.selectAll(".bar")
                        .data(data)
                        .enter()
                        .append("rect")
                        .attr("class", "bar");
        if(isVertical(style)) {
            bars.attr("x", function(d) { return axes.x(d[xAxis]); })
                    .attr("width", axes.x.bandwidth())
                    .attr("y", function(d) { return height; })
            if(animate) { bars = animatation(style, bars)};
            bars.attr("height", function(d) { return height - axes.y(d[yAxis]); })
                    .attr("y", function(d) { return axes.y(d[yAxis]); })
        } else {
            bars.attr("x", 0)
                .attr("y", function(d) { return axes.y(d[yAxis]); })
                .attr("height", axes.y.bandwidth())
            if(animate) { bars = animatation(style, bars)};
            bars.attr("width", function(d) { return axes.x(d[xAxis]); })
        }
    }

    function animatation(style, bars) {
        let direction;
        (isVertical(style)) ? direction = 'height' : direction = 'width';
         return bars.attr(direction, 0)
            .transition()
            .duration(1000)
            .delay(function (d, i) {
                return i * 125;
            })
    }

    function isVertical(style) {
        return style === 'vertical';
    }

    drawGraph(data, 'horizontal', false);
})();
