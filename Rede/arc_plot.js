/**
 * @title Implemented linear plot
 * @fileoverview This file creates an arc diagram, which shows the interaction between SNPs. These links are displayed 
 * through arcs. The 24 Human chromosomes (x and y are included) are plotted as bars in a row on one axis. 
 * @author stefan.sevelda@hotmail.com (Stefan Sevelda)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */




//------------------------------------------   Global variables   ---------------------------------------------- 

/**
 * Constant only for arc_plot.js to create the SVG
 * @const
 * @type {number}
 */
var width = 800, 
    height = 800;       
/**
 * Constant only for arc_plot.js to create the colour of the chromosomes
 * (TODO: change to function reading from ucsc_colour.csv)
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
 *@type integer
 */
 var chrom_length = 0;
/**
 * Global variable only for arc_plot.js to create the scale in arc plot.
 * @type {array} chrom_acum_length
 */
var chrom_acum_length = new Array();
/**
 * Constant only for arc_plot.js to create the scale in arc plot.
 * @const
 * @type {array} chromLength
 */
var chromLength = new Array(249250621, 243199373, 198022430, 191154276,
    180915260, 171115067, 159138663, 146364022,
    141213431, 135534747, 135006516, 133851895,
    115169878, 107349540, 102531392, 90354753,
    81195210, 78077248, 59128983, 63025520,
    48129895, 51304566, 155270560, 59373566);

// Array for the ticks on the chromosomes
var axis_chrom = new Array();
var i = 0;

while(i <= 300000000) {
    axis_chrom.push(i);
    i += 25000000;
}

// var for measuring the ticks
var ticks_chrom = new Array();

// counting the ticks for every chromosome
for(var i = 0; i < chromLength.length; i++) {
    ticks_chrom.push((chromLength[i] / 25000000 >> 0) +1 );
}

// this initialised chrom_length and chrom_acum_length to be used in the arc plot
for (var i = 0; i < chromLength.length; i++) {
    chrom_length = chrom_length + chromLength[i];
    chrom_acum_length.push(chrom_length);
}

// the colour for the different probe groups
var graphcolour = d3.scale.category20();

// y coordinate of the chromosome bars
var height_chrom_bar = 600;

// y coordinate of the SNP-nodes
var high_nodes = height_chrom_bar - 5;

// Array to store all node information of the json file
var allNodes = new Array();

// file name for zoom function to highlight the selected links
var file_name_zoom;

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Global variables ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 


//---------------------------------------read json file --------------------------------------

/**
 * Read a .json to initialize the variables and call the function arc_plot() to create the arc plot
 * @param {string} file_name
 */
function read_file_to_arc_plot(file_name) {
    data = new Array();
    var data_weight_pvalue = new Array();
    file_name_zoom = file_name;
    // load data from json file
    d3.json(file_name, function(json) {
        var links = json.links; 

        // function to fill the information of the nodes in allNodes
        json.nodes.forEach(function(d) {
            allNodes.push(d);
        });

        // function to fill the information of the links in the array
        json.links.forEach(
            function(d) { // this will fill the array with data
                data_weight_pvalue.push(d[st_chosen]);

                if (allNodes[d.source].chrom === 1) { 
                    data.push([allNodes[d.source].bp_position, d[st_chosen], allNodes[d.source].degree, "chr" +
                        allNodes[d.source].chrom + ':' + allNodes[d.source].bp_position]);
                } else {
                    data.push([allNodes[d.source].bp_position + chrom_acum_length[allNodes[d.source].chrom - 2], 
                        d[st_chosen], allNodes[d.source].degree, "chr" + allNodes[d.source].chrom + ':' + 
                        allNodes[d.source].bp_position]);
                }

                if (allNodes[d.target].chrom === 1) {
                    data.push([allNodes[d.target].bp_position, d[st_chosen], allNodes[d.target].degree, "chr" + 
                        allNodes[d.target].chrom + ':' + allNodes[d.target].bp_position]);
                } else {
                    data.push([allNodes[d.target].bp_position + chrom_acum_length[allNodes[d.target].chrom - 2],
                        d[st_chosen], allNodes[d.target].degree, "chr" + allNodes[d.target].chrom + ':' + 
                        allNodes[d.target].bp_position]);
                }                
            });
        
        ix_1 = 0;
        ix_2 = chrom_length;
        
        // function for plotting the arc SNP interaction plot 
        create_arc_plot(ix_1, ix_2, data);
    });
}
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
    for (var i = 0; i < chrom_acum_length.length; i++) {
        var num = i + 1;
        chr_id.push("chr" + num);
        chr_scale.push(xScale(chrom_acum_length[i]));
    }

    // create SVG for the plot
    var svg = d3.select("#chart")
        .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create g container for every chromosome
    var group_chrom = svg.selectAll("g.group")
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
    var chrom_bar = group_chrom.append("rect")
        .attr("transform", "translate(" + 0 + "," + padding + ")")
        .attr("class", "rect")
        // scales the width of chromosomes
        .attr("width", function(d, i) {
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
    group_chrom.append("svg:text")
        .attr("class", "chromosom_number")
        // 2* padding for double digits chromosome numbers
        .attr("transform", "translate(" + (2 * padding)  + "," + 35 + ")")  
        .append("svg:textPath")
            .text(function(d, i) {
                return i + 1;
            })
            .attr("font-size", "9px")
            .attr("text-anchor", "end")
            .style("fill", function(d, i) {
                return chromcolour[i];
            })
            .style("stroke", function(d, i) {
                return chromcolour[i];
            });

    // create the ticks of the chromosomes   
    group_chrom.selectAll("line")
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
    svg.selectAll("circle.vertex")
        .data(allNodes)
        .enter().append("circle")
        .attr("class", "nodes")
        .style("fill", function(d) {
            return graphcolour(d.probe_group);
        })
        .style("stroke", function(d) {
            return graphcolour(d.probe_group);
        })
        // positioning the SNPs
        .attr("cx", function(d) {
            return chr_scale[(d.chrom -1 )] + ((d.chrom -1) * padding) + xScale(d.bp_position); 
        })
        .attr("cy", high_nodes)
        .attr("r", 2)
        // to get information about the SNPs from different sources, if you click on a circle
        .on("click", function(d, i) {

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
                        alert("You have not chosen a source");         
                }               
                window.open(html)
            }
        })
        // show degree as tooltip - title
        svg.selectAll("g circle") 
        .append("title")
        .text(function(d) {
            return "degree: " + two_dec(d.degree) + "\nSNP: " + d.rs + "\nprobe_group: " + d.probe_group + 
                "\nposition: " + d.bp_position
        });

    // draw the edges between linked SNP's nodes
    svg.selectAll("path.link")
        .data(links)
        .enter().append("path")
        .attr("class", "link")
        .style("stroke", function(d) {
            return graphcolour(d.probe_group);
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

            var start_position_x = chr_scale[(allNodes[d.source].chrom - 1)] + ((allNodes[d.source].chrom - 1) * padding) + 
                xScale(allNodes[d.source].bp_position),
                start_position_y = high_nodes ;
                
            var end_position_x =  chr_scale[(allNodes[d.target].chrom - 1 )] + ((allNodes[d.target].chrom - 1) * padding) + 
                xScale(allNodes[d.target].bp_position),
                end_position_y = high_nodes ;

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

            return "M" + start_position_x + "," + start_position_y +  " C" + c1x + "," + c1y + "," + c2x + "," + c2y + " " + 
                end_position_x + "," + end_position_y ; 
        });
};

// ---------------------------------- create arc plot ----------------------------------------

// ----------------------------------  zoom functions ----------------------------------------------

function zoom_arc_plot(v_chr, v_start, v_end) {
    // chosen chromosome for zoom
    var xScale_chosen,
        // all other chromsomes
        xScale_compare;

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
    var length_chrom_x = 0;
    for (var i = 0; i < chrom_acum_length.length ; i++) {
        length_chrom_x = length_chrom_x + chromLength_scaled[i] + padding;
        chrom_x_position.push(length_chrom_x);
    }

    // var for the chromsome length of the chosen area
    var chosenLength = v_end - v_start;
    
    // array for the ticks
    var ticks_chrom_chosen = [];
    // for loop to create the ticks for the chosen chromosome
    for (var i = 0; i< 20 ; i++) {
        var temp_x,
            temp_label,
            temp_range,
            temp_range_label,
            temp;
        if(chosenLength == 0) {
            temp_x = chrom_x_position[(v_chr - 1)] + (chromLength_scaled[(v_chr - 1)] / 20) * i;
            temp_label = Math.round(((chromLength[(v_chr - 1)] / 20) / 1000000) * i) + "MB";
        } else {
            
            temp_x = chrom_x_position[(v_chr - 1)] + (chromLength_scaled[(v_chr - 1)] / 20) * i;
            temp = Math.round(v_start + (chosenLength / 20)* i);
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
   
    // create SVG for the plot
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    var group_chrom = svg.selectAll("g.group")
        .data(chromLength)
        .enter().append("svg:g")
        .attr("transform", function(d, i) {
            return "translate(" + chrom_x_position[i]  + "," + height_chrom_bar + ")";     
        })
    // scales the width of chromosomes
        .attr("width", function(d, i) {
            return chromLength_scaled[i]; 
        })
        .attr("height", 40)
        .attr("class", "group");

    // create rectangle in the g container
    var chrom_bar = group_chrom.append("rect")
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
        .attr("y1", high_nodes + 25)
        .attr("x2", function (d) {
            return +  d.x;
        })
        .attr("y2", high_nodes + 30)
        .style("stroke", "#000")

    svg.selectAll("text")
        .data(ticks_chrom_chosen)
        .enter().append("text")
        .attr("class", "label")
        .attr("dy", ".35em")
        .attr("transform", function (d) {
            return "translate("+ d.x + "," + (high_nodes + 38) + ")" + "rotate(90)";  
        })
        .attr("font-size", "10")
        .text(function (d) {
            return d.label;    
        });

    // create the label for the chromosomes
    group_chrom.append("svg:text")
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
    
    
       
    // array to store all nodes and all links which should not be displayed in the zoom function
    var zoom_allNodes = [],
        zoom_links = [];
    links.forEach( function(d) {
        if((allNodes[d.source].chrom == v_chr  
            && allNodes[d.source].bp_position >= v_start 
            && allNodes[d.source].bp_position <= v_end) ||
            (allNodes[d.source].chrom == v_chr && chosenLength == 0) ||
            (allNodes[d.target].chrom == v_chr && 
            allNodes[d.target].bp_position >= v_start && 
            allNodes[d.target].bp_position <= v_end) ||
            (allNodes[d.target].chrom == v_chr && chosenLength == 0)) {
            
                zoom_allNodes.push(allNodes[d.source]);
                zoom_allNodes.push(allNodes[d.target]);
                zoom_links.push(d);
        }
    });

    // object to store the position of the zoomed chromosomes
    var id_chosen = [];
    // create circles for the location of the interacting SNPs     
    svg.selectAll("circle.vertex")
        .data(zoom_allNodes)
        .enter().append("circle")
        .attr("class", "nodes")
        .style("fill", function(d) {
            return graphcolour(d.probe_group);
        })
        .style("stroke", function(d) {
            return graphcolour(d.probe_group);
        })
        // positioning the SNPs
        .attr("cx", function(d) {
            if(d.chrom == v_chr && chosenLength == 0) {
                id_chosen[d.id] = chrom_x_position[(d.chrom -1 )] + 
                    ((w/2) / chromLength[(d.chrom - 1)]) * d.bp_position;          
                return id_chosen[d.id];
            } else if (d.chrom == v_chr && chosenLength > 0 && d.bp_position >= v_start && 
                d.bp_position <= v_end) {
                    id_chosen[d.id] = chrom_x_position[(d.chrom -1)] + 
                        ((w/2) / chosenLength) * (d.bp_position - v_start);
                    return  id_chosen[d.id];
            } else if(d.chrom == v_chr && chosenLength > 0 && d.bp_position < v_start  ) {
                id_chosen[d.id] = chrom_x_position[(d.chrom -1)];
                return id_chosen[d.id];
            } else if (d.chrom == v_chr && chosenLength > 0 && d.bp_position > v_end) {
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
        .attr("cy", high_nodes)
        .attr("r", function(d) {
            if(id_chosen[d.id] == "NaN" && d.chrom == v_chr  ) {
                return 0;
            } else {
                return 2;
            }
        })
        // to get information about the SNPs from different sources, if you click on a circle
        .on("click", function(d, i) {

            var person = prompt("\n1) ClinVar\n2) dbSNP\n3) Ensembl\n4) PheGenI\n5) OMIM\n" +
                "6) openSNP\n7) SNPedia\n8) UCSC");

            if (person != null) {
                switch(person) {
                    case "1":
                        html = 'http://www.ncbi.nlm.nih.gov/clinvar?term=rs' + d.rs.substring(2);
                        break;
                    case "2": 
                        html = 'http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs=' + 
                            d.rs.substring(2);
                        break;
                    case "3":
                        html = 'http://www.ensembl.org/Homo_sapiens/Variation/Summary?r=' + 
                            d.chrom + ':' + (d.bp_position - 1000) + '-' + 
                            (d.bp_position + 1000) + ';source=dbSNP;v=rs' + d.rs.substring(2) 
                            + ';vdb=variation';
                        break;
                     case "4": 
                        html = 'http://www.ncbi.nlm.nih.gov/gap/phegeni?tab=2&rs=' + 
                            d.rs.substring(2);
                        break;
                    case "5":
                        html = 'http://omim.org/search?index=entry&search=rs' + d.rs.substring(2);
                        break;
                    case "6": 
                        html = 'http://opensnp.org/snps/' + d.rs;
                        break;
                    case "7":
                        html = 'http://www.snpedia.com/index.php/Rs' + d.rs.substring(2);
                        break;
                    case "8":
                        html = 'http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position=' + 'chr' + 
                            d.chrom + ':' + (d.bp_position - 1000) + '-' + 
                            (d.bp_position + 1000);
                        break;
                    default: 
                        alert("You have not chosen a source");         
                }               
                window.open(html)
            }
        })
        // show degree as tooltip - title
        svg.selectAll("g circle") 
        .append("title")
        .text(function(d) {
            return "degree: " + two_dec(d.degree) + "\nSNP: " + d.rs + "\nprobe_group: " + d.probe_group + 
                "\nposition: " + d.bp_position
        });
        
        // draw the edges between linked SNP's nodes
        var arcs = svg.selectAll("path.link")
            .data(zoom_links)
            .enter().append("path")
            .attr("class", "link")
            .style("stroke", function(d) {
                return graphcolour(d.probe_group);
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
            
                
//                if((allNodes[d.source].chrom - 1) == (v_chr - 1) && (allNodes[d.target].chrom - 1) == (v_chr - 1)) {
//                    var start_position_x = chrom_x_position[(allNodes[d.source].chrom - 1)] + 
//                            ((w/2) / chromLength[allNodes[d.source].chrom - 1]) * allNodes[d.source].bp_position,          
//                        start_position_y = high_nodes ;
//                    var end_position_x = chrom_x_position[(allNodes[d.target].chrom - 1)] + 
//                            ((w/2) / chromLength[allNodes[d.target].chrom - 1]) * allNodes[d.target].bp_position,          
//                        end_position_y = high_nodes ;
//
//                } else if((allNodes[d.source].chrom - 1) == (v_chr - 1) && (allNodes[d.target].chrom - 1) != (v_chr - 1)) {        
//                     var start_position_x = chrom_x_position[(allNodes[d.source].chrom - 1)] + 
//                            ((w/2) / chromLength[(allNodes[d.source].chrom - 1)]) * allNodes[d.source].bp_position,          
//                        start_position_y = high_nodes ;
//                    var end_position_x =   chrom_x_position[(allNodes[d.target].chrom -1 )] +
//                            ((w/2) / chrom_scale_compare) * allNodes[d.target].bp_position,
//                        end_position_y = high_nodes ;
//                        
//                } else if((allNodes[d.source].chrom - 1) != (v_chr - i) && (allNodes[d.target].chrom - 1) == (v_chr - 1)){
//                    var start_position_x = chrom_x_position[(allNodes[d.source].chrom -1 )] +
//                            ((w/2) / chrom_scale_compare) * allNodes[d.source].bp_position,
//                        start_position_y = high_nodes ;
//                    var end_position_x = chrom_x_position[(allNodes[d.target].chrom - 1)] + 
//                            ((w/2) / chromLength[allNodes[d.target].chrom - 1]) * allNodes[d.target].bp_position,          
//                        end_position_y = high_nodes ;
//
//                } else { 
//                    var start_position_x = chrom_x_position[(allNodes[d.source].chrom -1 )] +
//                            ((w/2) / chrom_scale_compare) * allNodes[d.source].bp_position,
//                        start_position_y = high_nodes ;
//
//                    var end_position_x =   chrom_x_position[(allNodes[d.target].chrom -1 )] +
//                            ((w/2) / chrom_scale_compare) * allNodes[d.target].bp_position,
//                        end_position_y = high_nodes ;
//                }
                if (allNodes[d.source].chrom == v_chr || allNodes[d.target].chrom == v_chr)  {
                    var start_position_x = id_chosen[d.source],
                        start_position_y = high_nodes ;

                    var end_position_x = id_chosen[d.target],
                        end_position_y = high_nodes ;
                } else {
                    var start_position_x = "NaN",
                        start_position_y = high_nodes ;

                    var end_position_x = "NaN",
                        end_position_y = high_nodes ;
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

                return "M" + start_position_x + "," + start_position_y +  " C" + c1x + "," + c1y + "," + c2x + "," + c2y + " " + 
                    end_position_x + "," + end_position_y ; 
            })
            .on("click" , function(d, i) {
                // var to store the id of the link
                d3.select("#pairs").selectAll("p").remove() 
                show_snp_pairs_list(file_name_zoom, select_dropbox_sort, 1, d.ct_id);
            });
        
};
