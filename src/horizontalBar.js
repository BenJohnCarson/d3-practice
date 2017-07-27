(function horizontalBarIFFE(){
    let svg = d3.select("svg.horizontal");
    let margin = {top: 50, right: 50, bottom: 50, left: 50};
    let width = svg.attr("width") - margin.left - margin.right;
    let height = svg.attr("height") - margin.top - margin.bottom;

	//define scales
	let	x = d3.scaleLinear().rangeRound([0, width]),
        y = d3.scaleBand().rangeRound([height, 0]).padding(0.1);
        
    let g = svg.append("g").attr("transform", "translate(" + margin.left + "," +margin.top + ")");

    function drawGraph(data) {
        const xAxis = 'Population (mill)';
        const yAxis = 'Country';

        data.forEach(function(d) {
            d[xAxis] = +d[xAxis];
            return d;
        });

        //define domains based on data
        x.domain([0, d3.max(data, function(d) { return d[xAxis]; })]);
        y.domain(data.map(function(d) { return d[yAxis]; }));

        //append x axis to svg
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

        //append y axis to svg
        g.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text(yAxis);
        //append rects to svg based on data
        g.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("y", function(d) { return y(d[yAxis]); })
            .attr("height", y.bandwidth())
            .attr("width", function(d) { return x(d[xAxis]); })
            .style("fill", "#2ca25f");
    }
    drawGraph(data);
})();