function donutChart() {
    var width,
        height,
        margin = {top: 10, right: 10, bottom: 10, left: 10},
        colour = d3.scaleOrdinal(d3.schemeCategory20c), // colour scheme
        variable, // value in data that will dictate proportions on chart
        category, // compare data by
        padAngle, // effectively dictates the gap between slices
        labelRadius = 175,
        // floatFormat = d3.format('.4r'),
        cornerRadius; // sets how rounded the corners are on each slice
        // percentFormat = d3.format(',.2%');

    function chart(selection){
        selection.each(function(data) {
            // generate chart

            // ===========================================================================================
            // Set up constructors for making donut. See https://github.com/d3/d3-shape/blob/master/README.md
            var radius = Math.min(width, height) / 2;

            // creates a new pie generator
            var pie = d3.pie()
                .value(function(d) { 
                    return d[variable]; })
                .sort(null);

            // contructs and arc generator. This will be used for the donut. The difference between outer and inner
            // radius will dictate the thickness of the donut
            var arc = d3.arc()
                .outerRadius(radius * 1)
                .innerRadius(radius * 0.7)
                .cornerRadius(cornerRadius)
                .padAngle(padAngle);

            // this arc is used for aligning the text labels
            var outerArc = d3.arc()
                .outerRadius(radius * 0.9)
                .innerRadius(radius * 0.9);
                // .outerRadius(radius)
                // .innerRadius(radius);
            // ===========================================================================================

            // ===========================================================================================
            // append the svg object to the selection
            var svg = selection.append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
              .append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
            // ===========================================================================================

            // ===========================================================================================
            // g elements to keep elements within svg modular
            svg.append('g').attr('class', 'slices');
            svg.append('g').attr('class', 'labelName');
            svg.append('g').attr('class', 'lines');
            // ===========================================================================================

            // ===========================================================================================
            // add and colour the donut slices
            var path = svg.select('.slices')
                .datum(data).selectAll('path')
                .data(pie)
              .enter().append('path')
                .attr('fill', function(d) { return colour(d.data[category]); })
                // Animation for drawing each section
                .transition().delay(function(d, i) { return i * 100;}).duration(1000)
                .attrTween('d', function(d) {
                    var i = d3.interpolate(d.startAngle, d.endAngle);
                    return function(t) {
                        d.endAngle = i(t);
                        return arc(d);
                    }
                })
                // .attr('d', arc);
            // ===========================================================================================

            // ===========================================================================================
            
            //------------- Original Label Functions
            // add text labels
            console.log(svg.select('.labelName').selectAll('text'));
            var label = svg.select('.labelName').selectAll('text')
                .data(pie)
              .enter().append('text')
                .attr('dy', '.35em')
                // For animation, sets initial opacity
                .html(function(d) {
                    // add "key: value" for given category. Number inside tspan is bolded in stylesheet.
                    return d.data[category] + ': <tspan>' + (d.data[variable]) + '</tspan>';
                })
                .attr('transform', function(d) {

                    // effectively computes the centre of the slice.
                    // see https://github.com/d3/d3-shape/blob/master/README.md#arc_centroid
                    var pos = outerArc.centroid(d);

                    // changes the point to be on left or right depending on where label is.

                    pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                    return 'translate(' + pos + ')';
                })
                .style('text-anchor', function(d) {
                    // if slice centre is on the left, anchor text to start, otherwise anchor to end
                    return (midAngle(d)) < Math.PI ? 'start' : 'end';
                })
                // Animates opacity of labels
                .attr("fill-opacity", 0)
              .transition().delay(function(d, i) { return i * 150;})
              .attr("fill-opacity", 1);
            // ===========================================================================================

            // ===========================================================================================
            // add lines connecting labels to slice. A polyline creates straight lines connecting several points
            var polyline = svg.select('.lines')
                .selectAll('polyline')
                .data(pie)
              .enter().append('polyline')
              // For animation, sets initial opacity
              .style("opacity", 0) 
                .attr('points', function(d) {
                    // see label transform function for explanations of these three lines.
                    var pos = outerArc.centroid(d);
                    pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                    // return [arc.centroid(d), outerArc.centroid(d), pos]
                    return [arc.centroid(d), outerArc.centroid(d), pos]
                })
                // Animates opacity of lines
              .transition().delay(function(d, i) { return i * 150;})
              .style("opacity", 0.5);

            // arrangeLabels(svg.select('.labelName'), 'text')
            // ===========================================================================================
            //-------- Alternate label functions
            
            /*
            var enteringLabels = svg.select('.labelName').selectAll(".label").data(pie).enter();
            var labelGroups = enteringLabels.append("g").attr("class", "label");
            labelGroups.append("circle").attr({
                x: 0,
                y: 0,
                r: 2,
                fill: "#000",
                transform: function (d, i) {
                    centroid = arc.centroid(d);
                    return "translate(" + arc.centroid(d) + ")";
                },
                    'class': "label-circle"
            });

            

            var textLines = labelGroups.append("line").attr({
                x1: function (d, i) {
                    console.log("sefsefu");
                    return arc.centroid(d)[0];
                },
                y1: function (d, i) {
                    return arc.centroid(d)[1];
                },
                x2: function (d, i) {
                    centroid = arc.centroid(d);
                    midAngle = Math.atan2(centroid[1], centroid[0]);
                    x = Math.cos(midAngle) * labelRadius;
                    return x;
                },
                y2: function (d, i) {
                    centroid = arc.centroid(d);
                    midAngle = Math.atan2(centroid[1], centroid[0]);
                    y = Math.sin(midAngle) * labelRadius;
                    return y;
                },
                    'class': "polyline"
            });
            var textLabels = labelGroups.append("text").attr({
                x: function (d, i) {
                    console.log("d");
                    var centroid = arc.centroid(d);
                    var midAngle = Math.atan2(centroid[1], centroid[0]);
                    var x = Math.cos(midAngle) * labelRadius;
                    var sign = (x > 0) ? 1 : -1
                    var labelX = x + (5 * sign)
                    return labelX;
                },
                y: function (d, i) {
                    var centroid = arc.centroid(d);
                    var midAngle = Math.atan2(centroid[1], centroid[0]);1
                    var y = Math.sin(midAngle) * labelRadius;
                    console.log(y);
                    return y;
                },
                    'text-anchor': function (d, i) {
                    var centroid = arc.centroid(d);
                    var midAngle = Math.atan2(centroid[1], centroid[0]);
                    var x = Math.cos(midAngle) * labelRadius;
                    return (x > 0) ? "start" : "end";
                },
                    'class': function(d){return'labelName'},
                    'text': function (d) {
                return d.data[category]
            }
            });
            //     .html(function (d) {
            //     return d.data[category]
            // });

                console.log(textLines);
                console.log(textLabels);
                */

            // ===========================================================================================
            // add tooltip to mouse events on slices and labels
            d3.selectAll('.labelName text, .slices path').call(toolTip);
            // ===========================================================================================

            // ===========================================================================================
            // Functions

            // calculates the angle for the middle of a slice
            function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }

            // function that creates and adds the tool tip to a selected element
            function toolTip(selection) {

                // add tooltip (svg circle element) when mouse enters label or slice
                selection.on('mouseenter', function (data) {

                    svg.append('text')
                        .attr('class', 'toolCircle')
                        .attr('dy', -15) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
                        .html(toolTipHTML(data)) // add text to the circle.
                        .style('font-size', '.9em')
                        .style('text-anchor', 'middle'); // centres text in tooltip

                    svg.append('circle')
                        .attr('class', 'toolCircle')
                        .attr('r', radius * 0.55) // radius of tooltip circle
                        .style('fill', colour(data.data[category])) // colour based on category mouse is over
                        .style('fill-opacity', 0.35);

                });

                // remove the tooltip when mouse leaves the slice/label
                selection.on('mouseout', function () {
                    d3.selectAll('.toolCircle').remove();
                });
            }

            // function to create the HTML string for the tool tip. Loops through each key in data object
            // and returns the html string key: value
            function toolTipHTML(data) {

                var tip = '',
                    i   = 0;

                for (var key in data.data) {

                    // if value is a number, format it as a percentage
                    var value = data.data[key];

                    // leave off 'dy' attr for first tspan so the 'dy' attr on text element works. The 'dy' attr on
                    // tspan effectively imitates a line break.
                    if (i === 0) tip += '<tspan x="0">' + key + ': ' + value + '</tspan>';
                    else tip += '<tspan x="0" dy="1.2em">' + key + ': ' + value + '</tspan>';
                    i++;
                }

                return tip;
            }
            // ==========================================================================================

            function arrangeLabels(selection, label_class) {
                console.log(selection.selectAll(label_class));
                var move = 1;
                while (move > 0) {
                    move = 0;
                    selection.selectAll(label_class)
                        .each(function() {
                            var that = this;
                            var a = this.getBoundingClientRect();
                            console.log(a);
                            selection.selectAll(label_class)
                                .each(function() {
                                    if (this != that) {
                                        var b = this.getBoundingClientRect();
                                        if ((Math.abs(a.left - b.left) * 2 < (a.width + b.width)) && (Math.abs(a.top - b.top) * 2 < (a.height + b.height))) {
                                            var dx = (Math.max(0, a.right - b.left) + Math.min(0, a.left - b.right)) * 0.01;
                                            var dy = (Math.max(0, a.bottom - b.top) + Math.min(0, a.top - b.bottom)) * 0.02;
                                            var tt = getTransformation(d3.select(this)
                                                .attr("transform"));
                                            var to = getTransformation(d3.select(that)
                                                .attr("transform"));
                                            move += Math.abs(dx) + Math.abs(dy);

                                            to.translate = [to.translateX + dx, to.translateY + dy];
                                            tt.translate = [tt.translateX - dx, tt.translateY - dy];
                                            d3.select(this)
                                                .attr("transform", "translate(" + tt.translate + ")");
                                            d3.select(that)
                                                .attr("transform", "translate(" + to.translate + ")");
                                            a = this.getBoundingClientRect();
                                        }
                                    }
                                });
                        });
                }
}

        });
    }


    // getter and setter functions. See Mike Bostocks post "Towards Reusable Charts" for a tutorial on how this works.
    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.margin = function(value) {
        if (!arguments.length) return margin;
        margin = value;
        return chart;
    };

    chart.radius = function(value) {
        if (!arguments.length) return radius;
        radius = value;
        return chart;
    };

    chart.padAngle = function(value) {
        if (!arguments.length) return padAngle;
        padAngle = value;
        return chart;
    };

    chart.cornerRadius = function(value) {
        if (!arguments.length) return cornerRadius;
        cornerRadius = value;
        return chart;
    };

    chart.colour = function(value) {
        if (!arguments.length) return colour;
        colour = value;
        return chart;
    };

    chart.variable = function(value) {
        if (!arguments.length) return variable;
        variable = value;
        return chart;
    };

    chart.category = function(value) {
        if (!arguments.length) return category;
        category = value;
        return chart;
    };

    return chart;
}