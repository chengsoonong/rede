/**
 * @fileoverview All functions to create the circle plot
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 * @author stefan.sevelda@hotmail.com (Stefan Sevelda)
 */

//------------------------------------------   Global variables   ---------------------------------------------- 
/**
 * Constant only for circle_plot.js to create the SVG
 * @const
 * @type {number}
 */
var width = 800, 
    height = 800, 
    width2 = 800, 
    height2 = 800, 
    chromRingOuterRadius = Math.min(width, height) * .42,
    chromRingInnerRadius = chromRingOuterRadius * 0.95;
/**
 * Constant only for circle_plot.js to create the color of the chrommossomos
 * (TODO: change to function reading from ucsc_colour.csv)
 * @const
 * @type {array}
 */
var chromColor = new Array(d3.rgb(153, 102, 0), d3.rgb(102, 102, 0), d3.rgb(153, 153, 30), d3.rgb(204, 0, 0),
    d3.rgb(255, 0, 0), d3.rgb(255, 0, 204), d3.rgb(255, 204, 204), d3.rgb(255, 153, 0),
    d3.rgb(255, 204, 0), d3.rgb(255, 255, 0), d3.rgb(204, 255, 0), d3.rgb(0, 255, 0),
    d3.rgb(53, 128, 0), d3.rgb(0, 0, 204), d3.rgb(102, 153, 255), d3.rgb(153, 204, 255),
    d3.rgb(0, 255, 255), d3.rgb(204, 255, 255), d3.rgb(153, 0, 204), d3.rgb(204, 51, 255),
    d3.rgb(204, 153, 255), d3.rgb(102, 102, 102), d3.rgb(153, 153, 153), d3.rgb(204, 204, 204),
    d3.rgb(1, 1, 1));
/**
 * Global variable only for circle_plot.js to create the circle plot
 * @type {svg} svg
 */
var svg;
/**
 * Global variable only for circle_plot.js to create the circle plot
 * @type {object} all_chrom
 */
var all_chrom;
/**
 * Global variable only for circle_plot.js to create color bar scale.
 * @type {d3} colorScaleedges
 */
var colorScaleedges;
/**
 * Global variable only for circle_plot.js to create color bar scale.
 * @type {d3} colorScaleedges2
 */
var colorScaleedges2;
/**
 * Global variable that is used in circle_plot.js. It will be used to get the information about of the communitties in json file.
 * @type {array[objects]} communities
 */
var communities;
// file name for zoom function to highlight the selected links
var file_name_zoom;
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Global variables ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 

// ---------------------------------- create the circle plot ----------------------------------------

/**
 * Create the SVG element to Plot the chromosomes in a circle and the ticks on chromosome
 */
function Create_chr_circle(view_chr, view_start, view_end) {
    // Selects  the element with id="chart"
    svg = d3.select("#chart") 
        .append("svg")
        .attr("id", "mainplot")
        .attr("width", width2)
        .attr("height", height2)
        .append("g")
        //This transform moves the element by pixels in both the X and Y directions.
        .attr("transform", "translate(" + width2 / 2 + "," + height2 / 2 + ")"); 
        //This transform moves the element by pixels in both the X and Y directions.
        
    // Genome object for drawing Plot the chromosomes in a circle
    all_chrom = Genome();
    all_chrom.set_zoom(view_chr, view_start, view_end);
    //create array that will receive objects with information about SNP from .json 

    //create the vizualization of the chromosomes in circles.
    svg.selectAll("path") 
        // it'll return chromosomes[] with objects content information about each chromosomes
        .data(all_chrom.chromosomes()) 
        //in each object has information such as angle 
        .enter() 
        .append("path")
        .attr("class", "ring")
        .style("fill", function(d) {
            return chromColor[d.index];
        })
        .style("stroke", function(d) {
            return chromColor[d.index];
        })
        .attr("d", d3.svg.arc()
            .innerRadius(chromRingInnerRadius)
            .outerRadius(chromRingOuterRadius)
            .startAngle(function(d) {
                return d.startAngle;
            })
            .endAngle(function(d) {
                return d.endAngle;
            })
        ); //read angles of each object in chromosomes[]

    svg.selectAll("text") 
        // write the numbers in chromosomes 
        .data(all_chrom.chromosomes())
        .enter()
        .append("text")
        .attr("class", "ring")
        .attr("transform", function(d) {
            var angle = (d.startAngle + d.endAngle) / 2;
            if (angle < Math.PI) {
                return "rotate(" + degrees(angle) + ")" + "translate(" + (chromRingInnerRadius + 3) + ")";
            } else {
                return "rotate(" + degrees(angle) + ")" + "translate(" + (chromRingInnerRadius + 3) + ")" +
                    "rotate(180)translate(-13)";
            }
        })
        .style("opacity", function(d) {
            if (d.index + 1 != view_chr && view_chr != 0) {
                return 0;
            }
        })
        .text(function(d) {
            return d.index + 1
        });

    // ticks on chromosome       
    var ticks = svg.append("g")
        .selectAll("g")
        .data(all_chrom.chromosomes())
        .enter().append("g")
        .selectAll("g")
        .data(groupTicks)
        .enter().append("g")
        .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + "translate(" + chromRingOuterRadius + ",0)";
        });

    ticks.append("line")
        .attr("x1", 1)
        .attr("y1", 0)
        .attr("x2", 5)
        .attr("y2", 0)
        .style("opacity", function(d) {
            if (d.index + 1 != view_chr && view_chr != 0) {
                return 0;
            }
        })
        .style("stroke", "#000");

    ticks.append("text")
        .attr("x", 8)
        .attr("dy", ".35em")
        .attr("font-size", "10")
        .attr("text-anchor", function(d) {
            return d.angle > Math.PI ? "end" : null;
        })
        .attr("transform", function(d) {
            return d.angle > Math.PI ? "rotate(180)translate(-16)" : null;
        })
        .style("opacity", function(d) {
            if (d.index + 1 != view_chr && view_chr != 0) {
                return 0;
            }
        })
        .text(function(d) {
            return d.label;
        });
};

/**
 * Create all associations between the SNPs
 */
function Create_SNP_association() {

        // Draw the marks for each snp   - small marks in chromosome 
        svg.selectAll("path.vertex")
            .data(allNodes)
            .enter().append("path")
            .attr("class", "vertex")
            .style("fill", function(d) {
                return chromColor[d.chrom - 1];
            })
            .style("stroke", function(d) {
                return chromColor[d.chrom - 1];
            })
            .attr("d", d3.svg.arc()
                .innerRadius(chromRingInnerRadius - 10)
                // getAngle() is a function of Genome   
                .outerRadius(chromRingInnerRadius - 3) 
                .startAngle(function(node) {
                    return all_chrom.getAngle(node.chrom, node.bp_position) - 0.001;
                })
                .endAngle(function(node) {
                    return all_chrom.getAngle(node.chrom, node.bp_position) + 0.001;
                }));

        // Draw the nodes for each snp   - small circles
        svg.selectAll("circle.vertex")
            .data(allNodes)
            .enter().append("circle")
            .attr("class", "vertex") 
            .style("fill", function(d) {
                return graphColor(d.probe_group)
            })
            .style("stroke", function(d) {
                return graphColor(d.probe_group)
            })
            .attr("cx", chromRingInnerRadius - 20)
            .attr("r", 3)
            .on("click", function(d, i) {
                var person = prompt("\n1) ClinVar\n2) dbSNP\n3) Ensembl\n4) PheGenI\n5) OMIM\n6) openSNP\n7) SNPedia\n8) UCSC");
                if (person != null) {
                    if ("8" == person) {
                        html = 'http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position=' + 'chr' +
                            allNodes[i].chrom + ':' + (allNodes[i].bp_position - 1000) + '-' + (allNodes[i].bp_position + 1000);
                    } else if ("6" == person) {
                        html = 'http://opensnp.org/snps/' + allNodes[i].rs;
                    } else if ("2" == person) {
                        html = 'http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs=' + allNodes[i].rs.substring(2);
                    } else if ("4" == person) {
                        html = 'http://www.ncbi.nlm.nih.gov/gap/phegeni?tab=2&rs=' + allNodes[i].rs.substring(2);
                    } else if ("3" == person) {
                        html = 'http://www.ensembl.org/Homo_sapiens/Variation/Summary?r=' + allNodes[i].chrom + 
                            ':' + (allNodes[i].bp_position - 1000) + '-' + (allNodes[i].bp_position + 1000) +
                            ';source=dbSNP;v=rs' + allNodes[i].rs.substring(2) + ';vdb=variation';
                    } else if ("7" == person) {
                        html = 'http://www.snpedia.com/index.php/Rs' + allNodes[i].rs.substring(2);
                    } else if ("5" == person) {
                        html = 'http://omim.org/search?index=entry&search=rs' + allNodes[i].rs.substring(2);
                    } else if ("1" == person) {
                        html = 'http://www.ncbi.nlm.nih.gov/clinvar?term=rs' + allNodes[i].rs.substring(2);
                    }
                    window.open(html);
                }
            })
            .attr("transform", function(d) {
                return "rotate(" + degrees(all_chrom.getAngle(d.chrom, d.bp_position)) + ")";
            });
        
        //show degree as tooltip - title
        svg.selectAll("g circle") 
        .append("title")
            .text(function(d) {
                return "degree: " + two_dec(d.degree) + "\nSNP: " + d.rs + "\nprobe_group: " + 
                    d.probe_group + "\nposition: " + d.bp_position
            });

        //---------------------------------scale bar -----------------------------------------------
        //check if there is communities in the json file
        if (use_communities === "yes") { 

            var margin = {
                top: 5,
                right: 50,
                bottom: 45,
                left: 10
            };

            var w_scale_bar = 500 - margin.left - margin.right;
            var h_scale_bar = 65 - margin.top - margin.bottom;
            var barPadding = 0;

            var dataset = d3.range(d3.min(links, function(d) {
                    return n_edgs_in_comm(d.assoc_group, communities);
                }), 100 + 1);

            colorScaleedges = d3.scale.log()
                .domain([d3.min(links, function(d) {
                        return n_edgs_in_comm(d.assoc_group, communities)
                }),100])
                .interpolate(d3.interpolateHsl)
                .range(["#3192C9", "#FF7000"]); 

            colorScaleedges2 = d3.scale.linear()
                .domain([d3.min(links, function(d) {
                    return n_edgs_in_comm(d.assoc_group, communities)
                }), 100])
                .interpolate(d3.interpolateHsl)
                .range(["#3192C9", "#FF7000"]); 

            //Create SVG element to receive the scale color bar
            var svg3 = d3.select("#scale_bar_c")
                .append("svg")
                .attr("width", w_scale_bar + margin.left + margin.right)
                .attr("height", h_scale_bar + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            //create color scale bar
            svg3.selectAll("rect") 
            .data(dataset)
                .enter()
                .append("rect")
                .attr("x", function(d, i) {
                    return i * (w_scale_bar / dataset.length);
                })
                .attr("y", 0)
                .attr("width", w_scale_bar / dataset.length - barPadding)
                .attr("height", h_scale_bar)
                .style("opacity", 0.8)
                .attr("fill", function(d, i) {
                    return colorScaleedges2(d);
                });

            svg3.selectAll(".text_scb")
                .data(dataset)
                .enter()
                .append("text")
                .attr("class", "text_scb")
                .text(function(d) {
                    switch (d) {
                        case 1:
                            return 1;
                            break;
                        case 25:
                            return 5;
                            break;
                        case 50:
                            return 10;
                            break;
                        case 75:
                            return 50;
                            break;
                        case 100:
                            return ">100";
                            break;
                    }
                })
                .attr("x", function(d, i) {
                    return i * (w_scale_bar / dataset.length);
                })
                .attr("y", 40)
                .attr("font-family", "sans-serif")
                .attr("font-size", "17.5px")
                .style("opacity", 0.8)
                .style("font-weight", "bold")
                .attr("fill", function(d) {
                    switch (d) {
                        case 1:
                            return colorScaleedges(1);
                            break;
                        case 25:
                            return colorScaleedges(5);
                            break;
                        case 50:
                            return colorScaleedges(10);
                            break;
                        case 75:
                            return colorScaleedges(50);
                            break;
                        case 100:
                            return colorScaleedges(101);
                            break;
                    }
                });
        }
        //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ scale bar ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // Draw the edges  - the association between SNPs
        svg.selectAll("path.link")
            .data(links)
            .enter().append("path")
            .attr("class", "link")
            .style("stroke", function(d) {
                //check if there is communities in the json file
                if (use_communities === "yes") { 
                    if (n_edgs_in_comm(d.assoc_group, communities) >= 100) {
                        return colorScaleedges(100);
                    } else
                        return colorScaleedges(n_edgs_in_comm(d.assoc_group, communities));
                } else {
                    return graphColor(d.probe_group);
                }
            })
            .style("stroke-width", 1)
            .style("opacity", 0.7)
            .style("fill", "none")
            .attr("d", link()) 
            .on("click" , function(d,i) { return highlight_snp_pairs(d, i);});
        //  use_communities="no"	//check if there is communities in the json file 

        // Write out the data in text
        d3.select("#snps").selectAll("p")
            .data(allNodes)
            .enter().append("p")
            .append("link").attr("href", function(d) {
            return 'http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position=' + 'chr' +
                d.chrom + ':' + (d.bp_position - 1000) + '-' + (d.bp_position + 1000);
            })
            .attr("target", "_blank")
            .style("text-decoration", 'none')
            .style("color", '#000')
            .text(function(d) {
                return showSnp(d);
            });

};

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ create the circle plot ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// ----------   declaration of the functions to plot chromosome in circle -----


//Transform radians to degrees
function degrees(radians) {
    return radians / Math.PI * 180 - 90;
};

function tickValues(d, v) {
    //number of bases
    if ((d.endBase - d.startBase) < 50000) {
        return Math.round(d.startBase + (v / d.radPerBase));
    } else if ((d.endBase - d.startBase) < 50000000) {
        return Math.round((d.startBase + (v / d.radPerBase)) / 1000) + "Kb";
    } else {
        return Math.round((d.startBase + (v / d.radPerBase)) / 1000000) + "Mb";
    }
}

function groupTicks(d) {
    // Returns an array with objects of tick angles and labels 
    return d3.range(0, d.totAngle, 0.041).map(function(v, i) {
        return {
            angle: v + d.startAngle,
            label: i % 2 ? null : tickValues(d, v),
            index: d.index
        };
    });
};

// Link object for displaying interactions
function link() {
    var radius = chromRingInnerRadius - 22;
    function link(d) {
        var startAngle = all_chrom.getAngle(allNodes[d.source].chrom, allNodes[d.source].bp_position),
            endAngle = all_chrom.getAngle(allNodes[d.target].chrom, allNodes[d.target].bp_position),
            offset = radius * (0.1 * Math.min(allNodes[d.source].probe_group, 9) - 0.1);

        var startX = Math.sin(startAngle) * radius,
            startY = -Math.cos(startAngle) * radius,
            endX = Math.sin(endAngle) * radius,
            endY = -Math.cos(endAngle) * radius;

        var c1X = Math.sin(startAngle) * offset,
            c1Y = -Math.cos(startAngle) * offset,
            c2X = Math.sin(endAngle) * offset,
            c2Y = -Math.cos(endAngle) * offset;

        return "M" + startX + "," + startY + "C" + c1X + "," + c1Y + " " + c2X + "," + c2Y + " " +
            endX + "," + endY
    }
    return link;
};

// Returns an event handler for fading
function fade(opacity) {
    var sid;
    return function(g, i) {
        svg.selectAll("g circle") //select the circles
            .filter(function(d) {
                return d.probe_group != allNodes[i].probe_group;
            })
            .transition()
            .style("opacity", opacity);

        svg.selectAll("g circle") //show degree as tooltip - title
            .filter(function(d) {
                return d.probe_group === allNodes[i].probe_group;
            })
            .append("title")
            .text(function(d) {
                return "degree: " + two_dec(d.degree)
            });

        svg.selectAll(".link") //select the association regarding to the circle selected
            .filter(function(d) {
                return d.probe_group != allNodes[i].probe_group;
            }).remove();

        d3.select("#snps").selectAll("p").remove(); //remove old text
        d3.select("#pairs").selectAll("p").remove(); //remove old text

        // Write out the data selected in text 
        d3.select("#snps").selectAll("p")
            .data(allNodes)
            .enter().append("p")
            .filter(function(d) {
                return d.probe_group === allNodes[i].probe_group;
            })
            .append("link").attr("href", function(d) { //link for UCSC genome browser for each snp (small circle) selected 			
                return 'http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position=' + 'chr' + d.chrom +
                    ':' + (d.bp_position - 1000) + '-' + (d.bp_position + 1000);
            })
            .attr("target", "_blank")
            .style("text-decoration", 'none')
            .style("color", function(d) { //highlights the SNP selected
                if (d.id != allNodes[i].id) {
                    return "black";
                } else {
                    return graphColor(d.probe_group);
                }
            })
            .text(function(d) {
                return showSnp(d);
            });

        d3.select("#pairs").selectAll("p")
            .data(links)
            .enter().append("p")
            .filter(function(d) {
                return d.probe_group === allNodes[i].probe_group;
            })
            .text(function(d) {
                return showInteract(d);
            });
    };
};
