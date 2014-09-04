/**
 * @title The implementation of the Arc Plot 
 * @fileoverview This file creates an Arc diagram, which shows the interaction between SNPs. 
 * These links are displayed 
 * through arcs. The 24 Human chromosomes (x and y are included) are plotted as bars in a row on one axis. 
 * Further it provides a function for zooming into a desired chromosome
 * @author stefan.sevelda@hotmail.com (Stefan Sevelda)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Soon Ong)
 * @author bedoj@unimelb.edu.au (Justin Bedo)
 */

//------------------------------------------   Global variables   ---------------------------------------------- 

/**
 * Dimension of the Arc plot 
 * @const
 * @type {number}
 */
var width = 800, 
    height = 800;       
/**
 * Rgb values for the different colours of the chromosomes 
 * @const
 * @type {array}
 */
var chromcolour = new Array(d3.rgb(153, 102, 0), d3.rgb(102, 102, 0), d3.rgb(153, 153, 30), d3.rgb(204, 0, 0),
        d3.rgb(255, 0, 0), d3.rgb(255, 0, 204), d3.rgb(255, 204, 204), d3.rgb(255, 153, 0),
        d3.rgb(255, 204, 0), d3.rgb(255, 255, 0), d3.rgb(204, 255, 0), d3.rgb(0, 255, 0),
        d3.rgb(53, 128, 0), d3.rgb(0, 0, 204), d3.rgb(102, 153, 255), d3.rgb(153, 204, 255),
        d3.rgb(0, 255, 255), d3.rgb(204, 255, 255), d3.rgb(153, 0, 204), d3.rgb(204, 51, 255),
        d3.rgb(204, 153, 255), d3.rgb(102, 102, 102), d3.rgb(153, 153, 153), d3.rgb(204, 204, 204),
        d3.rgb(1, 1, 1));
/**
 * Global variable for measuring the complete length of all chromosomes together
 * @type {integer}
 */
var chrom_length = 0;
/**
 * Global array, which indicates the absolute chromosome length for every
 * chromosome 
 * @type {array} 
 */
var chrom_abs_length = new Array();
/**
 * Global array, which indicates the relative chromosome length for every
 * chromosome
 * @const
 * @type {array} 
 */
var chromLength = new Array(249250621, 243199373, 198022430, 191154276,
        180915260, 171115067, 159138663, 146364022,
        141213431, 135534747, 135006516, 133851895,
        115169878, 107349540, 102531392, 90354753,
        81195210, 78077248, 59128983, 63025520,
        48129895, 51304566, 155270560, 59373566);

/**
 * Global array, which indicates of ticks on the chromosomes
 * ticks 25 million base pairs
 * @const
 * @type {array} 
 */
var axis_chrom = new Array();
var i = 0;

while(i <= 300000000) {
    axis_chrom.push(i);
    i += 25000000;
}

/**
 * Global array, which stores the amount of the ticks for every chromosome
 * @const
 * @type {array} 
 */
var ticks_chrom = new Array();

// counting the ticks for every chromosome
for(var i = 0; i < chromLength.length; i++) {
    ticks_chrom.push((chromLength[i] / 25000000 >> 0) +1 );
}

// this initialised chrom_length and chrom_abs_length, to calculate later the
// position of the chromosome in the arc plot
for (var i = 0; i < chromLength.length; i++) {
    chrom_length = chrom_length + chromLength[i];
    chrom_abs_length.push(chrom_length);
}

/**
 * Global variable, which stores the y coordinate of the chromosomes bars
 * @const
 * @type {integer} 
 */
var height_chrom_bar = 300;

/**
 * Global variable, which stores y coordinate of the snp nodes
 * @const
 * @type {integer} 
 */
var height_nodes = height_chrom_bar - 5;

/**
 * Global variable, which stores the name of the current file name. This is
 * essential if a user will work with more than one file 
 * @variable
 * @type {String} 
 */
var file_name;
/**
 * Global array, which stores the information of the zoomed arc plot -> snps and
 * links
 * @variable
 * @type {array} 
 */
var zoom_allNodes = [],
        zoom_links = [];
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Global variables ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 

//---------------------------------------read json file --------------------------------------

// starts the arc plot 
function read_file_to_arc_plot() {
    // everything needed in arc plot
    file_name = file_json;

        ix_1 = 0;
        ix_2 = chrom_length;
        // function for plotting the arc SNP interaction plot 
        create_arc_plot(ix_1, ix_2);
};
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ read json file ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

// ---------------------------------- create arc plot ----------------------------------------
function create_arc_plot(x1, x2) {
    // general margin for the plot
    var margin = {
        top: 1,
        right: 1,
        bottom: 20,
        left: 1
    };

    // padding between the chromosomes
    var padding = 5;
    // width and height of the plot
    var w = 800 - margin.left - margin.right - (24 * padding);
    var h = 600 - margin.top - margin.bottom; 

    // scale function for the chromosomes 
    var xScale = d3.scale.linear()
        .domain([x1, x2])
        .range([0, w]);

    // arrays for storing the chromosome ID and the scaled x-coordinate 
    var chr_id = [""];
    var chr_scale = [0];

    // create chromosome ID and stores the scaled x-coordinate of the chromosomes in the chr_scale array
    for (var i = 0; i < chrom_abs_length.length; i++) {
        var num = i + 1;
        chr_id.push("chr" + num);
        chr_scale.push(xScale(chrom_abs_length[i]));
    }

    // create SVG for the plot
    var svg = d3.select("#chart")
        .append("svg")
        .attr("id", "mainplot")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create g container for every chromosome
    var chromosome_container = svg.selectAll("g.group")
        .data(chromLength)
        .enter().append("svg:g")
        .attr("transform", function(d, i) {
            return "translate("+ ( chr_scale[i] +  i * padding)  + "," + height_chrom_bar + ")";
        })
        // scales the width of chromosomes
        .attr("width", function(d, i) {
            return  xScale(chromLength[i]); 
        })
        .attr("height", 40)
        .attr("class", "group");

    // create rectangle in the g container
    var chrom_bar = chromosome_container.append("rect")
        .attr("transform", "translate(" + 0 + "," + padding + ")")
        .attr("class", "rect")
        // scales the width of chromosomes
        .attr("width", function(d, i) {
            create_ld_plot(i+1, xScale(chromLength[i]), chr_scale[i] + i * padding, padding, 0 , 0, 0);    
            return  xScale(chromLength[i]); 
        })
        .attr("height", 20)
        .style("fill", function(d, i) {
            return chromcolour[i];
        })
        .style("stroke", function(d, i) {
            return chromcolour[i];
        });

    // create the label for the chromosomes
    chromosome_container.append("svg:text")
        .attr("class", "chromosome_number")
        // 2* padding for double digits chromosome numbers
        .attr("transform", "translate(" + (2 * padding) + "," + 35 + ")")
        .append("svg:textPath")
        .text(function(d, i) {
            return i + 1;
        })
        .attr("font-size", "9px") 
        .attr("text-anchor", "end") 
        .style("fill", function(d, i) {
            return chromcolour[i];
        });
    
    // create the ticks of the chromosomes   
    chromosome_container.selectAll("line")
        .data(function (d,i) {
            // creates a new array which stored the exact amount of ticks for the chromosomes
            return axis_chrom.slice(0, ticks_chrom[i]);        
        })
        .enter().append("line")
        .attr("class", "tickchromosomes")
        .attr("x1", function (d) {
            return xScale(d);
        })
        .attr("y1", 0)
        .attr("x2",  function (d) {
            return xScale(d);
        })
        .attr("y2", 5)
        .style("stroke", "#000");    

    // create circles for the location of the interacting SNPs     
    svg.selectAll("circle")
        .data(allNodes)
        .enter().append("circle")
        .attr("class", "nodes")
        .style("fill", function(d) {
            return graphColor(d.probe_group);
        })
        .style("stroke", function(d) {
            return graphColor(d.probe_group);
        })
        // positioning the SNPs
        .attr("cx", function(d) {
            return chr_scale[(d.chrom -1 )] + ((d.chrom -1) * padding) + xScale(d.bp_position); 
        })
        .attr("cy", height_nodes)
        .attr("r", 2)
        // to get information about the SNPs from different sources, if you click on a circle
        .on("click", function (d,i) { externalLink(d, i);});

    // show degree as tooltip - title
    svg.selectAll("g circle") 
        .append("title")
        .text(function(d) {
            return "degree: " + two_dec(d.degree) + "\nSNP: " + d.rs + "\nID: " + d.id + 
            "\nposition: " + d.bp_position
        });

    // draw the edges between linked SNP's nodes
    svg.selectAll("path")
        .data(links)
        .enter().append("path")
        .attr("class", "link")
        .style("stroke", function(d) {
            return graphColor(d.probe_group);
        })
        .style("stroke", 1)
        .style("opacity", 0.7)
        .style("fill", "none")
        // function to create the arc for the links
        .attr("d", function (d) {
            // to ensure that the path is drawn correct 
            if(d.source > d.target) {
                var temp;
                temp = d.source;
                d.source = d.target;
                d.target = temp;
            }

            var start_position_x = chr_scale[(allNodes[d.source].chrom - 1)] +
                ((allNodes[d.source].chrom - 1) * padding) + 
                xScale(allNodes[d.source].bp_position),
                start_position_y = height_nodes ;

            var end_position_x =  chr_scale[(allNodes[d.target].chrom - 1 )] + 
                ((allNodes[d.target].chrom - 1) * padding) + 
                xScale(allNodes[d.target].bp_position),
                end_position_y = height_nodes ;

            // to ensure that the arc links are drawn on the correct side    
            if (end_position_x < start_position_x) {
                var temp; 
                temp = end_position_x; 
                end_position_x = start_position_x;
                start_position_x = temp; 
            }

            var radius = (end_position_x - start_position_x) / 2 ;
            var c1x = start_position_x,
                c1y = start_position_y - radius,
                c2x = end_position_x,
                c2y = end_position_y  - radius ;

            return "M" + start_position_x + "," + start_position_y +  " C" + c1x +
                "," + c1y + "," + c2x + "," + c2y + " " + 
                end_position_x + "," + end_position_y ; 
        })
        .on("click" , function(d,i) { return highlight_snp_pairs(d, i); });

    // creates the colour scale indicator for the ld plot
    createColourScale_ldplot();
};
// ---------------------------------- create arc plot ----------------------------------------

// ----------------------------------  zoom functions ----------------------------------------------
// zoom function of the arc plot
function zoom_arc_plot(v_chr, v_start, v_end) {
    // chosen chromosome for zoom
    var xScale_zoomed_chrom,
        // all other chromosomes
        xScale_unzoomed_chrom;

    // margin for the zoom function of the arc plot
    var margin = {
        top: 1,
        right: 1,
        bottom: 20,
        left: 10
    };

    // padding between the chromosomes
    var padding = 2;
    // width and height of the plot
    var w = 800 - margin.left - margin.right - (24 * padding);
    var h = 600 - margin.top - margin.bottom; 
    // chromosome length without the chosen chromosome
    var chrom_scale_compare = chrom_length - chromLength[(v_chr -1)];

    //for loop to create the length of the chromosomes
    var chromLength_scaled = [];
    for (var i = 0;i < chromLength.length; i++) {
        var temp;
        if ((v_chr - 1) == i) {
            chromLength_scaled.push(w/2);
        } else {
            temp = ((w/2) / chrom_scale_compare) * chromLength[i];
            chromLength_scaled.push(temp);
        }
    }

    //for loop to calculate the x position
    var chrom_x_position = [0];
    var Scaled_abs_xposition = 0;
    for (var i = 0; i < chrom_abs_length.length ; i++) {
        Scaled_abs_xposition = Scaled_abs_xposition + chromLength_scaled[i] + padding;
        chrom_x_position.push(Scaled_abs_xposition);
    }

    // var for the chromsome length of the chosen area
    var selected_chrom_area = v_end - v_start;
    // array for the ticks
    var ticks_chrom_chosen = [];
    // for loop to create the ticks for the chosen chromosome
    for (var i = 0; i< 20 ; i++) {
        var temp_x,
            temp_label,
            temp_range,
            temp_range_label,
            temp;
        if(selected_chrom_area == 0) {
            temp_x = chrom_x_position[(v_chr - 1)] + (chromLength_scaled[(v_chr - 1)] / 20) * i;
            temp_label = Math.round(((chromLength[(v_chr - 1)] / 20) / 1000000) * i) + "MB";
        } else {
            temp_x = chrom_x_position[(v_chr - 1)] + (chromLength_scaled[(v_chr - 1)] / 20) * i;
            temp = Math.round(v_start + (selected_chrom_area / 20)* i);
            if(temp < 50000) {
                temp_range = 1;
                temp_range_label = "";
            } else if(temp < 50000000) {
                temp_range = 1000;
                temp_range_label = "Kb";
            } else {
                temp_range = 1000000;
                temp_range_label = "Mb";
            }
            temp_label = Math.round((temp / temp_range)) + temp_range_label; 
        }
        var obj = {};
        obj["x"] = temp_x;
        obj["label"] = temp_label;
        ticks_chrom_chosen.push(obj);
    }

    // array to store all nodes and all links which should not be displayed in the zoom function
    zoom_allNodes = [];
    zoom_links = [];
    links.forEach( function(d) {
        if((allNodes[d.source].chrom == v_chr  
            && allNodes[d.source].bp_position >= v_start 
            && allNodes[d.source].bp_position <= v_end) ||
            (allNodes[d.source].chrom == v_chr && selected_chrom_area == 0) ||
            (allNodes[d.target].chrom == v_chr && 
             allNodes[d.target].bp_position >= v_start && 
             allNodes[d.target].bp_position <= v_end) ||
            (allNodes[d.target].chrom == v_chr && selected_chrom_area == 0)) {

                zoom_allNodes.push(allNodes[d.source]);
                zoom_allNodes.push(allNodes[d.target]);
                zoom_links.push(d);
            }
    });
    
    // add nodes with degree zero
    allNodes.forEach( function (d) {
        var in_zoomed_chrom = (d.chrom == v_chr && d.degree == 0);
        var in_zoomed_region = (d.bp_position >= v_start && d.bp_position <= v_end);

        if(in_zoomed_chrom && in_zoomed_region) {
            zoom_allNodes.push(d);
        }
    });
    
    // sort and make the zoom_allnodes function unique
    var temp_zoomnodes = [];

    zoom_allNodes.forEach( function (d) {
        temp_zoomnodes.push(d.id);
    });

    temp_zoomnodes = sort_unique(temp_zoomnodes);

    zoom_allNodes = [];

    temp_zoomnodes.forEach( function (d) {
        zoom_allNodes.push(allNodes[d]);
    });
    
   
    // create SVG for the plot
    var svg = d3.select("#chart")
        .append("svg")
        .attr("id", "mainplot")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.select('#ld_container').selectAll('svg').remove();

    var chromosome_container = svg.selectAll("g.group")
        .data(chromLength)
        .enter().append("svg:g")
        .attr("transform", function(d, i) {
            return "translate(" + chrom_x_position[i]  + "," + height_chrom_bar + ")";     
        })
        // scales the width of chromosomes
        .attr("width", function(d, i) {
            create_ld_plot(i+1, chromLength_scaled[i], chrom_x_position[i], padding, v_chr, v_start, v_end);    
            return chromLength_scaled[i]; 
        })
        .attr("height", 40)
        .attr("class", function (d,i) {
            return "chrom" + (i+1);
        });

    var id_chrom_zoom = "g.chrom" + (v_chr);
    // store the the new startpoint
    var startzoom = 0;
    if (v_start == 0 && v_end == 0) {
         var x_scale_zoom = d3.scale.linear()
            .domain([0, chromLength[(v_chr -1)]])
            .range([0, chromLength_scaled[(v_chr -1)]]);
    } else {
        var x_scale_zoom = d3.scale.linear()
            .domain([v_start, v_end])
            .range([0, chromLength_scaled[(v_chr -1)]]);
    }
           
    //function to zoom with the mouse
    var brush = svg.select(id_chrom_zoom)
        .append("g")
        .attr("class", "brush")
        .call(d3.svg.brush().x(x_scale_zoom)
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend))
        .selectAll("rect")
            .attr("height", 40)   
            .style("stroke", "blue")
            .style("fill", "blue")
            .style("opacity" , 0.7);

    function brushstart() { 
        brush.classed("selecting", true);
    }

    function brushmove() {
        var r = d3.event.target.extent(); 
        document.getElementById("texzs").value = Math.round(r[0]);
        document.getElementById("texze").value = Math.round(r[1]);
    }

    function brushend() { 
        brush.classed("selecting", !d3.event.target.empty());
    }

    // create rectangle in the g container
    var chrom_bar = chromosome_container.append("rect")
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .attr("class", "rect")
        // scales the width of chromosomes
        .attr("width", function(d, i) {
            return chromLength_scaled[i]; 
        })
        .attr("height", 20)
        .style("fill", function(d, i) {
            return chromcolour[i];
        })
        .style("stroke", function(d, i) {
            return chromcolour[i];
        });

    //create ticks for the chrom_bar
    svg.selectAll("line")
        .data(ticks_chrom_chosen)
        .enter().append("line")
        .attr("class", "tickchromosome")
        .attr("x1", function(d) {
            return + d.x;
        })
        .attr("y1", height_nodes + 25)
        .attr("x2", function (d) {
            return +  d.x;
        })
        .attr("y2", height_nodes + 30)
        .style("stroke", "#000")

    svg.selectAll("text")
        .data(ticks_chrom_chosen)
        .enter().append("text")
        .attr("class", "label")
        .attr("dy", ".35em")
        .attr("transform", function (d) {
            return "translate("+ d.x + "," + (height_nodes + 38) + ")" + "rotate(90)";  
        })
        .attr("font-size", "10")
        .text(function (d) {
            return d.label;    
        });

    // create the label for the chromosomes
    chromosome_container.append("svg:text")
        .attr("class", "chromosom_number")
        // 2* padding for double digits chromosome numbers
        .attr("transform", function (d, i) {
            if (i == (v_chr-1)) {
                return "translate(" + (8 * padding)  + "," + 15 + ")";
            } else {
                return "translate(" + (4 * padding)  + "," + 35 + ")";  
            }
        })
        .append("svg:textPath")
        .text(function(d, i) {
            return i + 1;
        })
        .attr("font-size", function (d, i) {
            if (i == (v_chr-1)) {
                return "14px";
            } else {
                return "9px";
            }
        })
        .attr("text-anchor", "end")
        .style("fill", function(d, i) {
            if (i == (v_chr - 1)) {
                return "#000";
            } else {
                return chromcolour[i];
            }
        })
        .style("stroke", function(d, i) {
            if (i == (v_chr - 1)) {
                return "#000";
            } else {
                return chromcolour[i];
            }
        });

    // object to store the position of the zoomed chromosomes
    var id_chosen = [];
    // create circles for the location of the interacting SNPs     
    svg.selectAll("circle.vertex")
        .data(zoom_allNodes)
        .enter().append("circle")
        .attr("class", "circle_zoom")
        .style("fill", function(d) {
            return graphColor(d.probe_group);
        })
        .style("stroke", function(d) {
            return graphColor(d.probe_group);
        })
        // positioning the SNPs
        .attr("cx", function(d) {
            if(d.chrom == v_chr && selected_chrom_area == 0) {
                id_chosen[d.id] = chrom_x_position[(d.chrom -1 )] + 
                    ((w/2) / chromLength[(d.chrom - 1)]) * d.bp_position;          
                return id_chosen[d.id];

            } else if (d.chrom == v_chr && selected_chrom_area > 0 && d.bp_position >= v_start && 
                d.bp_position <= v_end) {
                    id_chosen[d.id] = chrom_x_position[(d.chrom -1)] + 
                        ((w/2) / selected_chrom_area) * (d.bp_position - v_start);
                    return  id_chosen[d.id];

            } else if(d.chrom == v_chr && selected_chrom_area > 0 && d.bp_position < v_start  ) {
                id_chosen[d.id] = chrom_x_position[(d.chrom -1)];
                return id_chosen[d.id];

            } else if (d.chrom == v_chr && selected_chrom_area > 0 && d.bp_position > v_end) {
                id_chosen[d.id] = chrom_x_position[(d.chrom - 1)] + (w/2);
                return id_chosen[d.id];

            } else if(d.chrom != v_chr) {
                id_chosen[d.id] = chrom_x_position[(d.chrom -1 )] +
                    ((w/2) / chrom_scale_compare) * d.bp_position; 
                return id_chosen[d.id];

            } else {
                return id_chosen[d.id] = "NaN" ;
            }
        })
        .attr("cy", height_nodes)
        .attr("r", function(d) {
            if(id_chosen[d.id] == "NaN" && d.chrom == v_chr  ) {
                return 0;
            } else {
                return 2;
            }
        })
        // to get information about the SNPs from different sources, if you click on a circle
        .on("click", function (d,i) { externalLink(d, i); });

    // show degree as tooltip - title
    svg.selectAll("g .circle_zoom") 
        .append("title")
        .text(function(d) {
            return "degree: " + two_dec(d.degree) + "\nSNP: " + d.rs + "\nid: " + d.id + 
                "\nposition: " + d.bp_position
        });

    // draw the edges between linked SNP's nodes
    var arcs = svg.selectAll("path.link")
        .data(zoom_links)
        .enter().append("path")
        .attr("class", "link")
        .style("stroke", function(d) {
            return graphColor(d.probe_group);
        })
        .style("stroke", 1)
        .style("stroke-width", 2.5)
        .style("opacity", 3.7)
        .style("fill", "none")
        // function to create the arc for the links
        .attr("d", function (d) {
            // to ensure that the path is drawn correct 
            if(d.source > d.target) {
                var temp;
                temp = d.source;
                d.source = d.target;
                d.target = temp;
            } 

            if (allNodes[d.source].chrom == v_chr || allNodes[d.target].chrom == v_chr)  {
                var start_position_x = id_chosen[d.source],
                    start_position_y = height_nodes ;

                var end_position_x = id_chosen[d.target],
                    end_position_y = height_nodes ;
            } else {
                var start_position_x = "NaN",
                    start_position_y = height_nodes ;

                var end_position_x = "NaN",
                    end_position_y = height_nodes ;
            }

            // to ensure that the arc links are drawn on the correct side    
            if (end_position_x < start_position_x) {
                var temp; 
                temp = end_position_x; 
                end_position_x = start_position_x;
                start_position_x = temp; 
            }

            var radius = (end_position_x - start_position_x) / 2 ;

            var c1x = start_position_x,
                c1y = start_position_y - radius,
                c2x = end_position_x,
                c2y = end_position_y  - radius ;

            return "M" + start_position_x + "," + start_position_y +  " C" + c1x +
                "," + c1y + "," + c2x + "," + c2y + " " + 
                end_position_x + "," + end_position_y ; 
        })
        .on("click" , function(d,i) { return highlight_snp_pairs(d, i);});

    // creates the colour scale indicator for the ld plot
    createColourScale_ldplot();
};
 
function createColourScale_ldplot() {
    
   
    var ldColourRange = ld_colour_dyed();
    var ldRange = [];
    var ldColourbar_w = 20;
    var ldColourbar_h = 230;

    for (var i=0; i < 100; i++) {
        ldRange.push((1/100) * i);   
    }

    var ld_xRange = d3.scale.linear()
        .domain([0, 1])
        .range([0, ldColourbar_h]);

    var colour_yAxis = d3.svg.axis()
        .scale(ld_xRange)
        .orient("left")
        .ticks(10);

    // create SVG for the plot
    var svgLdColourScale = d3.select("#chart")
        .append("svg")
        .attr("id", "ldcolourscale")
        .attr("width", 120)
        .attr("height", height)
        .append("g")
        .attr("class", "axisldcolour")
        .attr("transform", "translate(50, 380)")
        .call(colour_yAxis);

    svgLdColourScale.append("text")
        .attr("x", 0)
        .attr("y",(ldColourbar_h + 10))
        .text("R-square")
        .attr("font-family", "sans-serif")
        .attr("font-size", "30px")
        .attr("fill", "grey");

    svgLdColourScale.selectAll("rect")
        .data(ldRange)
        .enter().append("rect")
        .attr("transform", function (d) {
            return "translate(0," + ld_xRange(d) + ")";
        })
        // scales the width of chromosomes
        .attr("width", ldColourbar_w)
        .attr("height", ld_xRange(1/100))
        .style("fill", function (d) {
            return ldColourRange(d);
        })
        .style("stroke",  function (d) {
            return ldColourRange(d);
        });

    
}
