/**
 * @title Implementaition of the ID plot 
 * @fileoverview This file creates an ld plot for the arc plot
 * @author stefan.sevelda@hotmail.com (Stefan Sevelda)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */

var ld_nodes = [];


// function to create ld plot
function create_ld_plot(ld_chrom, chromrange, chromposition, padding, zoomed_chrom ) {

    if(ld_chrom == 1 && if_zoom == 1) {
        var padding_start = 10; 
    } else {
        var padding_start = 0;
    }

    var temp = 'local_links' + ld_chrom
    var ld_plot_data = [];
    ld_plot_data = ldvar[0][temp];
    ld_nodes = [];

    // var for height and width
    var width = chromrange + padding + padding_start,
        height = 400;
        paddingtop = 0;

    // general margin for the plot
    var margin = {
        top: 0,
        right: 1,
        bottom: 20,
        left: 1
    };    
    if(if_zoom && zoomed_chrom == ld_chrom ) {
        for (var i = 0; i < zoom_allNodes.length; i++) {
            if(zoom_allNodes[i].chrom == ld_chrom) {
                ld_nodes.push(zoom_allNodes[i]);
            }
        }   
    } else {
        for (var i = 0; i < allNodes.length; i++) {
            if(allNodes[i].chrom == ld_chrom) {
                ld_nodes.push(allNodes[i]);
            }
        }
    }

    // scale for the x axis of the ld plot
    var xscale_ld = d3.scale.linear()
        .domain([0, ld_nodes.length])
        .range([0, chromrange]);
    
    // colour scale for the pvalues
    var colorScale_ldplot = d3.scale.linear() //yellow - red
        .domain([d3.min(ld_plot_data, function(d) {
            return d.R2;
        }), d3.max(ld_plot_data, function(d) {
            return d.R2;
        })])
        .interpolate(d3.interpolateHsl)
        .range(["#F1F73A", "#660000"]);

    
    
    // create rectangle in the g container
    var lineData = [{"x": 0 , "y": paddingtop}, 
                    {"x": (chromrange / 2), "y": ((chromrange / 2) + paddingtop)}, 
                    {"x": (chromrange), "y": paddingtop}];

    var linefunction = d3.svg.line()
        .x( function(d) {return d.x; })
        .y( function(d) {return d.y; })
        .interpolate("linear"); 

    var ld_g = d3.select("#ld_container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + padding_start + "," +
                 margin.top + ")")
        .attr("width", width);

    var ld_triangle = ld_g.append("path")
        .attr("d", linefunction(lineData))
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", "none");

    ld_g.selectAll()
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

    ld_g.selectAll()
        .data(ld_plot_data)
        .enter().append("rect")
        .attr("class", "ld_links")
        .attr("transform", function (d) {
            return "translate(" + ( xscale_ld(x_location_ld(d.source, d.target)))
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
            x = x - ld_plot_data[0].source;
            y = y - ld_plot_data[0].source;
            return ((x +(y + 1))/2);
        };

        function y_location_ld(x,y) {
            if(y < x) {
                temp = x;
                x = y;
                y = temp;
            }
            x = x - ld_plot_data[0].source;
            y = y - ld_plot_data[0].source;
            return ((y - (x + 1))/2); 
        };
};
