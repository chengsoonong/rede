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
var width = 1000, //800,  ->  300
    height = 800, //800,  -> 300
    width2 = 800, //800,  -> 1500               //for transition
    height2 = 800; //800,   -> 400              //for transition
   
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
 * Constant only for arc_plot.js to create the colour of the nodes
 * @const
 * @type {d3} graphcolour
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

var axis_chrom = new Array(0, 25000000, 50000000, 75000000, 100000000,
    125000000, 150000000, 175000000, 200000000, 225000000, 250000000,
    275000000, 300000000);



// this initialized chrom_length and chrom_acum_length to be used in the arc plot
for (var i = 0; i < chromLength.length; i++) {
    chrom_length = chrom_length + chromLength[i];
    chrom_acum_length.push(chrom_length);
}

// var for measuaring the ticks

var ticks_chrom = new Array();

// counting the ticks for every chromosome
for(var i = 0; i < chromLength.length; i++) {

    ticks_chrom.push((chromLength[i] / 25000000 >> 0) +1 );
}

var graphcolour = d3.scale.category20();

/**
 * Global variable only for arc_plot.js to create the arc plot
 * @type {object} all_chrom
 */
var all_chrom;
/**
 * Global variable only for arc_plot.js to create colour bar scale.
 * @type {d3} colourScaleedges
 */
var colourScaleedges;
/**
 * Global variable only for arc_plot.js to create colour bar scale.
 * @type {d3} colourScaleedges2
 */
var colourScaleedges2;
/**
 * Global variable that is used in arc_plot.js. It will be used to get the information about of the communities in json file.
 * @type {array[objects]} communities
 */
var communities;

// y coordinate of the chromosome bars

var height_chrom_bar = 600

// y coordinate of the nodes
var high_nodes = height_chrom_bar - 5;
// Array to store all node information of the json file
var allNodes = new Array();

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Global variables ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 


//---------------------------------------read json file --------------------------------------

/**
 * Read a .json to initialize the variables and call the function arc_plot() to create the arc plot
 * @param {string} file_name
 */
function read_file_to_arc_plot(file_name) {


    data = new Array();
    var data_weight_pvalue = new Array();

    // load data from json file
    d3.json(file_name, function(json) {
        var links = json.links; 

        // function to fill the information of the nodes in allNodes
        json.nodes.forEach(function(d) {
            allNodes.push(d)
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
                    d[st_chosen], allNodes[d.source].degree, "chr" + allNodes[d.source].chrom + ':' 
                    + allNodes[d.source].bp_position]);
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


function create_arc_plot(x1, x2, data) {

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
        .domain([x1, x2 ])
        .range([0, w]);

    var chr_id = [""];
    var chr_scale = [0];


    //create chromosome id and store the scaled x-location of the chromosomes in the chr_scale array
    for (var i = 0; i < chrom_acum_length.length; i++) {
        var num = i + 1;
        chr_id.push("chr" + num);
        chr_scale.push(xScale(chrom_acum_length[i]));
    }

    // create SVG for the plot
    var svg = d3.select("#chart")
        .append("svg")
            .attr("width", width2)
            .attr("height", height2)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // create g container for every chromosome
    var group_chrom = svg.selectAll("g.group")
        .data(chromLength)
        .enter().append("svg:g")
        .attr("transform", function(d, i) {
            return "translate("+ ( chr_scale[i] +  i * padding)  + "," + height_chrom_bar + ")";
        })
        .attr("width", function(d, i) { return  xScale(chromLength[i]); })// scales the width of chromosomes
        .attr("height", 40)
        .attr("class", "group");

    // create rectangle in the g container
    var chrom_bar = group_chrom.append("rect")
        .attr("transform", "translate(" + 0 + "," + padding + ")")
        .attr("class", "rect")
        .attr("width", function(d, i) { return  xScale(chromLength[i]); })// scales the width of chromosomes
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
        .attr("transform", "translate(" + (2 * padding)  + "," + 35 + ")") // 2* padding for double digits chromosome numbers 
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

    //create the ticks of the chromosomes
    
    group_chrom.selectAll("line")
        .data(function (d,i) {
            return axis_chrom.slice(0, ticks_chrom[i]); // creates a new array which stored the exact amount of ticks for the chromosomes
        })
        .enter().append("line")
        .attr("class", "tickchromosomes")
        .attr("x1", function (d) {return xScale(d);})
        .attr("y1", 0)
        .attr("x2",  function (d) {return xScale(d);})
        .attr("y2", 5)
        .style("stroke", "#000");    

  
    // create circles for the location of the interacting SNPs   

     
    svg.selectAll("circle.vertex")
        .data(allNodes)
        .enter().append("circle")
        .attr("class", "nodes")
        .style("fill", function(d) {
            return graphcolour(d.probe_group)
        })
        .style("stroke", function(d) {
            return graphcolour(d.probe_group)
        })
        .attr("cx", function(d) {
            return chr_scale[(d.chrom -1 )] + ((d.chrom -1) * padding) + xScale(d.bp_position); // position of the circles
        })
        .attr("cy", high_nodes)
        .attr("r", 2)
        // to get information about the SNPs from different sources, if you click on a circle
        .on("click", function(d, i) {

            var person = prompt("\n1) ClinVar\n2) dbSNP\n3) Ensembl\n4) PheGenI\n5) OMIM\n" +
                                "6) openSNP\n7) SNPedia\n8) UCSC");

            if (person != null) {
                if ("8" == person) {
                    html = 'http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position=' + 'chr' + 
                    allNodes[i].chrom + ':' + (allNodes[i].bp_position - 1000) + '-' + (allNodes[i].bp_position + 1000)
                } else if ("6" == person) {
                    html = 'http://opensnp.org/snps/' + allNodes[i].rs
                } else if ("2" == person) {

                    html = 'http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs=' + 
                    allNodes[i].rs.substring(2)
                } else if ("4" == person) {

                    html = 'http://www.ncbi.nlm.nih.gov/gap/phegeni?tab=2&rs=' + 
                    allNodes[i].rs.substring(2)
                } else if ("3" == person) {
                    html = 'http://www.ensembl.org/Homo_sapiens/Variation/Summary?r=' + 
                    allNodes[i].chrom + ':' + (allNodes[i].bp_position - 1000) + '-' + 
                    (allNodes[i].bp_position + 1000) + ';source=dbSNP;v=rs' + allNodes[i].rs.substring(2) + ';vdb=variation'

                } else if ("7" == person) {
                    html = 'http://www.snpedia.com/index.php/Rs' + allNodes[i].rs.substring(2)

                } else if ("5" == person) {
                    html = 'http://omim.org/search?index=entry&search=rs' + allNodes[i].rs.substring(2)

                } else if ("1" == person) {
                    html = 'http://www.ncbi.nlm.nih.gov/clinvar?term=rs' + allNodes[i].rs.substring(2)

                }
                window.open(html)
            }
        })
        svg.selectAll("g circle") //show degree as tooltip - title
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
        .attr("d", function (d) {// function to create the arc for the links

            // to ensure that the path is drawn correct 
            if(d.source > d.target)
            {
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


