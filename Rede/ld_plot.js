/**
 * @title Implementaition of the ID plot 
 * @fileoverview This file creates an ld plot for the arc plot
 * @author stefan.sevelda@hotmail.com (Stefan Sevelda)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Soon Ong)
 */

/**
 * Array which stores the ld snps
 * @array
 * @type {array[objects]}
 */
var ld_nodes = [];

/**
 * Constant for ld plot for storing the colour range of the ld values 
 * @function scale()
 * @type d3 scale function {}
 */
var colourScale_ldplot;

// function to create ld plot
function create_ld_plot(ld_chrom, chromrange, chromposition, padding, zoomed_chrom ) {

    // set padding for the ld_plot
    if(ld_chrom == 1 && if_zoom == 1) {
        var padding_start = 10; 
    } else {
        var padding_start = 0;
    }

    // variable to store the object name of the ld information
    var temp = 'local_links' + ld_chrom
    // empty the arrays for ld plot    
    var ld_plot_data = [];
    ld_plot_data = ldvar[0][temp];
    ld_nodes = [];

    // var for height and width
    var width = chromrange + padding + padding_start,
        height = 400;
        paddingtop = 0;

    // general margin for the ld plot
    var margin = {
        top: 0,
        right: 1,
        bottom: 20,
        left: 1
    };    

    // filter for the zoom function
    if(if_zoom && zoomed_chrom == ld_chrom ) {
        for (var i = 0; i < zoom_allNodes.length; i++) {
            if(zoom_allNodes[i].chrom == ld_chrom) {
                ld_nodes.push(zoom_allNodes[i]);
            }
        }   
        if(ld_chrom == 1) {
            // dyes the lds in the first chromosome if zoomed
            ld_colour_dyed();
        }
    } else {
        for (var i = 0; i < allNodes.length; i++) {
            if(allNodes[i].chrom == ld_chrom) {
                ld_nodes.push(allNodes[i]);
            }
        }
        // dyes lds
        ld_colour_dyed();
    }

    // this function calculate the colour range for the ldvalues of the ld plot
    function ld_colour_dyed () {
        colourScale_ldplot = d3.scale.linear() //yellow - red
            .domain([d3.min(ld_plot_data, function(d) {
                return d.R2;
            }), d3.max(ld_plot_data, function(d) {
                return d.R2;
            })])
            .interpolate(d3.interpolateHsl)
            .range(["#F1F73A", "#660000"]);
    };

    // scale for the x axis of the ld plot
    var xscale_ld = d3.scale.linear()
        .domain([0, ld_nodes.length])
        .range([0, chromrange]);
    
    // indices the ld plot through an triangular   
    var lineData = [{"x": 0 , "y": paddingtop}, 
                    {"x": (chromrange / 2), "y": ((chromrange / 2) + paddingtop)}, 
                    {"x": (chromrange), "y": paddingtop}];

    // function to generate lines
    var linefunction = d3.svg.line()
        .x( function(d) {return d.x; })
        .y( function(d) {return d.y; })
        .interpolate("linear"); 

    // create svg element for the ld plot
    var ld_g = d3.select("#ld_container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + padding_start + "," +
                 margin.top + ")")
        .attr("width", width);

    // create the representing chromosomes for the ld plot (triangular)
    var ld_triangle = ld_g.append("path")
        .attr("d", linefunction(lineData))
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", "none");

    // creates the SNPs as triangular
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
        .attr("stroke-width", 1)
        .on("click", function(d, i) {
            // connection to external databases
            var person = prompt("\n1) ClinVar\n2) dbSNP\n3) Ensembl\n4) PheGenI\n5) OMIM\n" +
                "6) openSNP\n7) SNPedia\n8) UCSC");

            if (person != null) {
                switch(person) {
                    case "1":
                        html = 'http://www.ncbi.nlm.nih.gov/clinvar?term=rs' + allNodes[i].rs.substring(2);
                        break;
                    case "2": 
                        html = 'http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs=' + 
                            allNodes[i].rs.substring(2);
                        break;
                    case "3":
                        html = 'http://www.ensembl.org/Homo_sapiens/Variation/Summary?r=' + 
                            allNodes[i].chrom + ':' + (allNodes[i].bp_position - 1000) + '-' + 
                            (allNodes[i].bp_position + 1000) + ';source=dbSNP;v=rs' + allNodes[i].rs.substring(2) 
                            + ';vdb=variation';
                        break;
                    case "4": 
                        html = 'http://www.ncbi.nlm.nih.gov/gap/phegeni?tab=2&rs=' + 
                            allNodes[i].rs.substring(2);
                        break;
                    case "5":
                        html = 'http://omim.org/search?index=entry&search=rs' + allNodes[i].rs.substring(2);
                        break;
                    case "6": 
                        html = 'http://opensnp.org/snps/' + allNodes[i].rs;
                        break;
                    case "7":
                        html = 'http://www.snpedia.com/index.php/Rs' + allNodes[i].rs.substring(2);
                        break;
                    case "8":
                        html = 'http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position=' + 'chr' + 
                            allNodes[i].chrom + ':' + (allNodes[i].bp_position - 1000) + '-' + 
                            (allNodes[i].bp_position + 1000);
                        break;
                    default: 
                        alert("You have not selected a source");         
                }               
                window.open(html)
            }
        })
        .append("title")
        .text(function (d) {
            // labeling function for mouseover
            return "degree: " + two_dec(d.degree) + "\nSNP: " + d.rs + "\nprobe_group: " + d.probe_group + 
                "\nposition: " + d.bp_position;
        })

    // create the lds as rectangular
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
            return colourScale_ldplot(d.R2);
        })
        .style("stroke", function (d) {
            return colourScale_ldplot(d.R2);
        })
        .append("title")
        .text(function (d) {
            // information about the lds through mouseover
            return "R2 value: " + d.R2 + "\nsource id: " + d.source + "\ntarget id: " + d.target + "\nrs source: " +
                allNodes[d.source].rs + "\nrs target: " + allNodes[d.target].rs +
                "\nsource bp-position: " + allNodes[d.source].bp_position + "\ntarget bp-position: " +
                allNodes[d.target].bp_position + "\ngenetic Distance: " + d.distance; 
        });
        
        // calculates the x position of the lds
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

        // calculates the y position of the lds
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
