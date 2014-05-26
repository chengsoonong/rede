/**
 * @title Implementaition of the ID plot 
 * @fileoverview This file creates an ld plot for the arc plot
 * @author stefan.sevelda@hotmail.com (Stefan Sevelda)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */

var ld_nodes = [];
// function to create ld plot
function create_ld_plot() {

    ld_nodes = [];
    d3.select("#ld_container").selectAll("svg").remove();

    // var for height and width
    var width = 800,
        height = 800;
        paddingtop = 0;

    // general margin for the plot
    var margin = {
        top: 380,
        right: 1,
        bottom: 20,
        left: 1
    };    
     
    for (var i = 0; i < allNodes.length; i++) {
        if(allNodes[i].chrom == 1) {
            ld_nodes.push(allNodes[i]);
        }
    }
    

    // scale for the x axis of the ld plot
    var xscale_ld = d3.scale.linear()
        .domain([0, ld_nodes.length])
        .range([0, width]);
    
    // colour scale for the pvalues
    var colorScale_ldplot = d3.scale.linear() //yellow - red
        .domain([d3.min(ldvar, function(d) {
            return d.R2;
        }), d3.max(ldvar, function(d) {
            return d.R2;
        })])
        .interpolate(d3.interpolateHsl)
        .range(["#FF6600", "#660000"]);

    // create SVG for the plot
    var svg_ldplot = d3.select("#ld_container")
        .append("svg")
        .attr("id", "ldplot")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left  + "," + margin.top + ")");

    
    // create rectangle in the g container
    var lineData = [{"x": 0, "y": paddingtop}, {"x": (width / 2), "y": ((width / 2) + paddingtop)}, 
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
        .data(ld_nodes)
        .enter().append("path")
        .attr("class", "ld_nodes")
        .attr("d", function (d, i) {
            return linefunction([{"x": xscale_ld(i), "y": paddingtop},
                                 {"x": xscale_ld(i + (1/2)), "y": (xscale_ld(1/2) + paddingtop)},
                                 {"x": xscale_ld(i + 1), "y": paddingtop}]);
        })
        .attr("fill", "blue")
        .attr("stroke", "blue")
        .attr("stroke-width", 1);

    svg_ldplot.selectAll()
        .data(ldvar)
        .enter().append("rect")
        .attr("class", "ld_links")
        .attr("transform", function (d) {
            return "translate(" + xscale_ld(x_location_ld(d.source, d.target))
                    + "," + (xscale_ld(y_location_ld(d.source, d.target)) + paddingtop)
                    + ") rotate(45)";
        })
        .attr("width", function (d) { return (xscale_ld(1) / Math.sqrt(2)); })
        .attr("height", function (d) { return (xscale_ld(1) / Math.sqrt(2)); })
        .style("fill", function (d) {
            return colorScale_ldplot(d.R2);
        })
        .style("stroke", function (d) {
            return colorScale_ldplot(d.R2);
        });
        
        function x_location_ld(x,y) {
            var temp;
            if(y < x) {
                temp = x;
                x = y;
                y = temp;
            }
            x = x - ldvar[0].source;
            y = y - ldvar[0].source;
            return ((x +(y + 1))/2);
        };

        function y_location_ld(x,y) {
            if(y < x) {
                temp = x;
                x = y;
                y = temp;
            }
            x = x - ldvar[0].source;
            y = y - ldvar[0].source;
            return ((y - (x + 1))/2); 
        };
};
