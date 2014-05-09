/**
 * @title Implementaition of the ID plot 
 * @fileoverview This file creates an ld plot for the arc plot
 * @author stefan.sevelda@hotmail.com (Stefan Sevelda)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */

// function to create ld plot
function create_ld_plot() {
    // var for height and width
    var width = 800,
        height = 800;
        paddingtop = 850;

    // general margin for the plot
    var margin = {
        top: 1,
        right: 1,
        bottom: 20,
        left: 1
    };    

    var xscale_ld = d3.scale.linear()
        .domain([0, allNodes.length])
        .range([0, width]);

    // create SVG for the plot
    var svg_ldplot = d3.select("#chart")
        .append("svg")
        .attr("id", "ldplot")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + (margin.top + paddingtop) + ")");

    
    // create rectangle in the g container
    var lineData = [{"x": paddingtop, "y": paddingtop}, {"x": (width / 2), "y": (width / 2)}, 
                    {"x": width, "y": paddingtop}];

    var linefunction = d3.svg.line()
        .x( function(d) {return d.x; })
        .y( function(d) {return d.y; })
        .interpolate("linear"); 

    var ld_triangle = svg_ldplot.append("path")
        .attr("d", linefunction(lineData))
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", "none");

    svg_ldplot.selectAll()
        .data(allNodes)
        .enter().append("path")
        .attr("class", "ld_nodes")
        .attr("d", function (d) {
            return linefunction([{"x": xscale_ld(d.id), "y": 0},
                                 {"x": xscale_ld(d.id + (1/2)), "y": xscale_ld(1/2)},
                                 {"x": xscale_ld(d.id + 1), "y": 0}]);
        })
        .attr("fill", "blue")
        .attr("stroke", "blue")
        .attr("stroke-width", 1);

    svg_ldplot.selectAll()
        .data(links)
        .enter().append("rect")
        .attr("class", "ld_links")
        .attr("transform", function (d) {
            return "translate(" + xscale_ld(x_location_ld(d.source, d.target)) +
            "," + xscale_ld(y_location_ld(d.source, d.target)) + ") rotate(45)"
            ;
        })
        .attr("width", function (d) { return (xscale_ld(1) / Math.sqrt(2)); })
        .attr("height", function (d) { return (xscale_ld(1) / Math.sqrt(2)); })
        .style("fill", "red")
        .style("stroke", "red");
        
        function x_location_ld(x,y) {
            var temp;
            if(y < x) {
                temp = x;
                x = y;
                y = temp;
            }
            return ((x +(y + 1))/2);
        };

        function y_location_ld(x,y) {
            if(y < x) {
                temp = x;
                x = y;
                y = temp;
            }
            return ((y - (x + 1))/2); 
        };
};
