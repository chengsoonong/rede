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

// file name for zoom function to highlight the selected links
var file_name_zoom;
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Global variables ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 

/*
 *Global variable for to check if the user is in zoom function
 */
var if_zoom = 0;
/*
 *Global variable for to check if the user selected a specific stat range
 */
var if_stat_brush = 0;
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

// y coordinate of the chromosome bars
var height_chrom_bar = 600;

// y coordinate of the SNP-nodes
var high_nodes = height_chrom_bar - 5;

// file name for zoom function to highlight the selected links
var file_name_zoom;

// array for zoom 
var zoom_allNodes = [],
        zoom_links = [];
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Global variables ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 


//--------------- global variables ---------------------------
// --- data of json files
/**
 * Global variable that is used in view_graph.js and circle_plot.js
 * It have information each nodes pairs.
 * @type {array} links
 */
var links = [];
/**
 * Global variable that is used in view_graph.js and circle_plot.js
 * It have information each nodes.
 * @type {array} allNodes
 */
var allNodes = [];
/**
 * Global variable, which stores the infomation about th subgraphs 
 * @type {array} subgraphs
 */
var subgraphs = [];
/**
 * Global variable that is used in circle_plot.js. It will be used to get the information about of the communitties in json file.
 * @type {array[objects]} communities
 */
var communities = [];
/**
 * Global variable that is used to store the information about the contingency
 * tables of json file
 * @type {array[objects]} cont_table 
 */
var cont_table = [];
// --- data of json files


/**
 * Global variable for circle_plot.js and view_graph.js to save a selected information of a json file
 * @type {string} string_html
 */
var string_html;
/**
 * Global variable for manhattan_plot.js and view_graph.js to put label in dots in manhattan plot
 * @type {svg} label_text
 */
var label_text;
/**
 * Global variable for manhattan_plot.js and view_graph.js with the all dots to create manhattan plot.
 * It's used inside read_file_to_manhattan_plot() and here in button zoom, reset, label and remove label.
 * @type {array} data
 */
var data;
/**
 * Constant for manhattan_plot.js and view_graph.js decide if it will use the variable "data" or  "data_select_from_HDS".
 * with the data to create manhattan plot and used inside read_file_to_manhattan_plot()
 * @type {string} data_from_HDS
 */
var data_from_HDS = "no"
/**
 * Global variable for hit_degree_snps_plot.js and view_graph.js hindle to create the manhattan plot with specifcs dots.
 * @type {array} data_select_from_HDS
 */
var data_select_from_HDS;
/**
 * Global variables for matrix_snp_comm_plot.js, matrix_plot.js and view_graph.js use the initial dots.
 * when a of this plots is selected it will use this variables.
 * @type {number} mix_1, mix_2, miy_1, miy_2
 */
var mix_1, mix_2, miy_1, miy_2;
/**
 * Global variables for matrix_snp_comm_plot.js, matrix_plot.js and view_graph.js to do the zoom.
 * when a of this plots is selected it will use this variables.
 * @type {number} mx_1, mx_2, my_1, my_2
 */
var mx_1, mx_2, my_1, my_2;
/**
 * Global variable that is used in view_graph.js, hist_degree_snps_plot.js and hist_edges_subgraphID_plot.js
 *  It have information about wich plot was selected.
 * @type {string} plot_chosen
 */
var plot_chosen;
/**
 * Global variable that is used in view_graph.js, circle_plot.js,  hist_degree_snps_plot.js and manhattan_plot.js
 *  It have information about wich statistical test was selected.
 * @type {string} st_chosen
 */
var st_chosen;
/**
 * Global variable that is used in circle_plot.js to create the brush and manhattan_plot.js
 * to create the axis y of the manhattan plot. It has the dots about wich statistical test
 * was selected to be used.
 * @type {array} data_weight_pvalue
 */
var data_weight_pvalue = [];
/**
 * Global variable that contains the JSON file encapsulated as a data URL
 * @type {srtring} file_json
 */
var file_json;
/**
 * Global variable that will be used to get the information about of the statistical test choosen.
 * @type {d3} select_dropbox_sort
 */
var select_dropbox_sort;
/**
 * Global variable that will be used to get the information about of the statistical test choosen.
 * @type {d3} select_dropbox
 */
var select_dropbox;

/**
 * Global variable that is used in view_graph.js. It will be used to get the information about of the statistical test to
 * create the dropbox.
 * @type {object} statOptions
 */
var statOptions = {};
/**
 * Global variable that is used in view_graph.js. It will be used to check if there is communities in the json file
 * create the dropbox.
 * @type {array} list_keys_json
 */
var list_keys_json = [];
/**
 * Global variable that is used in view_graph.js and circle_plot. It will be used to check if there is communities in the json file
 * create the dropbox.
 * @type {string} use_communities
 */
var use_communities = "no";
/**
 * Global variable that is used in view_graph.js and circle_plot. It will be used to check if there is cont. table in the json file.
 * @type {string} use_cont_table
 */
var use_cont_table = "no";
/**
 * Global variable that is used in view_graph.js. It is save the first statistical test to be visualited
 * create the dropbox.
 * @type {string} st_1
 */
var st_1 = [];
/**
 * Global variables for manhattan_plot.js and view_graph.js hindle to create the manhattan plot with the initial dots.
 * @type {number} ix_1, ix_2, iy_1, iy_2
 */
var brush_value1, brush_value2;
/**
 * Constant only for circle_plot.js and arc_plot.js to create the color of the nodes
 * @const
 * @type {d3} graphColor
 */
var graphColor = d3.scale.category20();
/*
 * Global array, which stores the nodes and the links, which are filtered by
 * their p-value
 */
var stat_allNodes = [];
var stat_links = [];
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Global variable ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 




// load_data_json.js
// function to load the data
function load_data_json (file_name) {
    // load data from json file
    file_json = file_name;

    // empty the arrays of the json files
    allNodes = [];
    links = [];
    subgraphs = [];
    comunities = [];
    cont_table = [];
    
    // empty array of optional statixtical tests
    st_1 = [];
    statOptions = {};

    d3.json(file_name, function(json) {
        //function to load the the links
        json.links.forEach(function(d) {
            links.push(d);
        });

        //for loop to get all available statistical test of the dataset
        for (var i in json.links[0]) {
            if (i != "assoc_group" && i != "source" && i != "target" && i !=
                "probe_group" && i != "ct_id") {
                    statOptions[i] = i;
                    st_1.push(i);  
                }
        }

        // function to fill the information of the nodes in allNodes
        json.nodes.forEach(function(d) {
            allNodes.push(d);
        });
        // load the subgraphs of the json file 
        subgraphs = json.subgraphs;
        // load the comunities of the json file
        communities = json.communities;
        // load the information about the contingency table 
        cont_table = json.cont_table;
        
        
       

        // start the plots
        upload_json()           
    });
};

// cont_plot.js
/**
 * @fileoverview  function  to create the contigency table
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Soon Ong)
 */



/**
 * Read a .json to initialize the variables, get the datas and create the contigency table plot
 * @param {number} idx
 * @param {string} filename
 */
function cont_plot(idx) {

    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },

    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var formatPercent = d3.format(".0%");

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.3);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var svg = d3.select("#contp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var datact = cont_table[idx];
        x.domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        var l1_1 = 112.5,
            l1_2 = 0,
            l2_1 = 112.5 * 2,
            l2_2 = 112.5,
            l3_1 = 112.5 * 3,
            l3_2 = 112.5 * 2,
            l4_1 = 112.5 * 4 + 30,
            l4_2 = 112.5 * 3 + 30;

        //first row
        plot_ct(1, 1, 2, l1_1, l1_2, -10, 122.5, datact["unv1"][0].controls / datact["total"].controls, 
                datact["unv1"][0].cases / datact["total"].cases)
        plot_ct(2, 4, 5, l1_1, l1_2, -10, 122.5, datact["biv"][0][0].controls / datact["total"].controls,
                datact["biv"][0][0].cases / datact["total"].cases)
        plot_ct(3, 6, 7, l1_1, l1_2, -10, 122.5, datact["biv"][0][1].controls / datact["total"].controls, 
                datact["biv"][0][1].cases / datact["total"].cases)
        plot_ct(4, 8, 9, l1_1, l1_2, -10, 122.5, datact["biv"][0][2].controls / datact["total"].controls,
                datact["biv"][0][2].cases / datact["total"].cases)
        //second row
        plot_ct(5, 1, 2, l2_1, l2_2, 122.5 - 10, 122.5 - 10, datact["unv1"][1].controls / datact["total"].controls,
                datact["unv1"][1].cases / datact["total"].cases)
        plot_ct(6, 4, 5, l2_1, l2_2, 122.5 - 10, 122.5 - 10, datact["biv"][1][0].controls / datact["total"].controls,
                datact["biv"][1][0].cases / datact["total"].cases)
        plot_ct(7, 6, 7, l2_1, l2_2, 122.5 - 10, 122.5 - 10, datact["biv"][1][1].controls / datact["total"].controls,
                datact["biv"][1][1].cases / datact["total"].cases)
        plot_ct(8, 8, 9, l2_1, l2_2, 122.5 - 10, 122.5 - 10, datact["biv"][1][2].controls / datact["total"].controls,
                datact["biv"][1][2].cases / datact["total"].cases)
        //third row
        plot_ct(9, 1, 2, l3_1, l3_2, 122.5 * 2 - 20, 122.5 - 10, datact["unv1"][2].controls / datact["total"].controls,
                datact["unv1"][2].cases / datact["total"].cases)
        plot_ct(10, 4, 5, l3_1, l3_2, 122.5 * 2 - 20, 122.5 - 10, datact["biv"][2][0].controls / datact["total"].controls,
                datact["biv"][2][0].cases / datact["total"].cases)
        plot_ct(11, 6, 7, l3_1, l3_2, 122.5 * 2 - 20, 122.5 - 10, datact["biv"][2][1].controls / datact["total"].controls,
                datact["biv"][2][1].cases / datact["total"].cases)
        plot_ct(12, 8, 9, l3_1, l3_2, 122.5 * 2 - 20, 122.5 - 10, datact["biv"][2][2].controls / datact["total"].controls,
                datact["biv"][2][2].cases / datact["total"].cases)
        //fourth row
        plot_ct(13, 4, 5, l4_1, l4_2, 122.5 * 3 - 30 + 30, 122.5 - 10, datact["unv2"][0].controls / datact["total"].controls,
                datact["unv2"][0].cases / datact["total"].cases)
        plot_ct(14, 6, 7, l4_1, l4_2, 122.5 * 3 - 30 + 30, 122.5 - 10, datact["unv2"][1].controls / datact["total"].controls,
                datact["unv2"][1].cases / datact["total"].cases)
        plot_ct(15, 8, 9, l4_1, l4_2, 122.5 * 3 - 30 + 30, 122.5 - 10, datact["unv2"][2].controls / datact["total"].controls,
                datact["unv2"][2].cases / datact["total"].cases)

        function plot_ct(id, pos_x1, pos_x2, pos_y1, pos_y2, pos_y1r, pos_y2r, control, cases) {
            // Plot a cell of the contingency table
            var y = d3.scale.linear().domain([0, 1])
                .range([pos_y1, pos_y2]);

            svg.selectAll("rect" + id)
                .data([0])
                .enter()
                .append("rect")
                .attr("x", x(pos_x1) - 5)
                .attr("y", pos_y1r) //y(1)-10 )=-10
                .attr("width", 150)
                .attr("height", pos_y2r) //y(1)-10, y(0)+10)=122.5
                .attr("fill", function(d) {
                    if (control > cases) {
                        return "#4ed05f";
                    } //green
                    if (control < cases) {
                        return "#d06057";
                    } //red
                    if (control == cases) {
                        return "white";
                    }
                })
                .attr("stroke", "black")
                .attr("stroke-width", 1);

            svg.selectAll(".bar" + id)
                .data([{
                    letter: pos_x1,
                    frequency: control
                }, {
                    letter: pos_x2,
                    frequency: cases
                }])
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) {
                    return x(d.letter) + 5;
                })
                .attr("width", x.rangeBand())
                .attr("y", function(d) {
                    return y(d.frequency);
                }) //fill: steelblue
                .attr("fill", "steelblue")
                .attr("height", function(d) {
                    return pos_y1 - y(d.frequency);
                });

            svg.selectAll(".text_ct")
                .data([{
                    letter: pos_x1,
                    frequency: control
                }, {
                    letter: pos_x2,
                    frequency: cases
                }])
                .enter()
                .append("text")
                .attr("class", "text_b")
                .text(function(d) {
                    return Math.round(d.frequency * 100) + "%";
                })
                .attr("x", function(d) {
                    return x(d.letter) + 15;
                })
                .attr("y", function(d) {
                    return y(d.frequency);
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("fill", "black");
        }
}
// hist_degree_snps_plot.js
/**
 * @fileoverview All functions to create the histogram Degree x SNPs plot
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */

/**
 * Create the histogram degree x snp. When click in a bar of the histogram this will selected egds in circle plot
 *     and dots in manhattan plot.
 * @param {string} file_name
 * @param {number} probe_group
 */
    
function histogram_degree_SNPs(probe_group, if_zoom, if_stat_brush) {
    
    var data_degree_snp = new Array();
    var allNodes_hes = new Array();
    var links_hes = new Array();

    // filter for the zoom function of the arc plot
    if (if_zoom) {
        zoom_links.forEach( function(d) {
            links_hes.push(d);
        });
        zoom_allNodes.forEach( function(d) {
            allNodes_hes.push(d);
            data_degree_snp.push(d);
        });


    } else if(if_stat_brush) {
        stat_links.forEach( function(d) {
            links_hes.push(d);
        });
        stat_allNodes.forEach( function(d) {
            allNodes_hes.push(d);
            data_degree_snp.push(d);
        });
        
    } else {
        links.forEach( function(d) {
            if (probe_group === 0) {
                links_hes.push(d);
            } else {
                if (d.probe_group === probe_group) {
                    links_hes.push(d);
                }
            }
        });

        allNodes.forEach(function(d) {
            if (probe_group === 0) {
                allNodes_hes.push(d);
                data_degree_snp.push(d);
            } else {
                allNodes_hes.push(d);
                if (d.probe_group === probe_group) {
                    data_degree_snp.push(d);
                }
            }
        });
    }
    //it will create the histogram degree X SNPs in circle_plot
    var margin = {
        top: 50,
        right: 20,
        bottom: 50,
        left: 400
    },

        width = 700 - margin.left - margin.right; 

    if (probe_group == 0) {
        if (data_degree_snp.length > 10) {
            var height = 34.1796875 * allNodes_hes.length - margin.top - margin.bottom; //200
        } else {
            var height = 34.1796875 * 10 - margin.top - margin.bottom;
        }
    } else {
        if (data_degree_snp.length > 10) {
            var height = 34.1796875 * data_degree_snp.length - margin.top - margin.bottom; //200
        } else {
            var height = 34.1796875 * 10 - margin.top - margin.bottom;
        }
    }

    var y = d3.scale.ordinal()
        .rangeRoundBands([0, height], .5);

    var x = d3.scale.linear()
        .range([0, width]);

    var xAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var yAxis = d3.svg.axis()
        .scale(x)
        .orient("top");

    var svg = d3.select("#hds_matrix").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    y.domain(data_degree_snp.map(function(d, i) {
        return "id:" + d.id + " chr" + d.chrom + ':' + d.bp_position + " " + d.rs +
        " probe_group:" + d.probe_group;
    }));

    x.domain([0, d3.max(data_degree_snp, function(d) {
        return d.degree;
    })]);

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis);

    // now rotate text on x axis
    // first move the text left so no longer centered on the tick
    // then rotate up to get 90 degrees.
    svg.selectAll(".x text")
        .style("font-size", "14px")
        .attr("transform", function(d) {
            return "translate(" + this.getBBox().height * -0.5 + "," + this.getBBox().height * 0 + ")rotate(0)";
        })
    .on("click", function(d, i) {
        var person = prompt("\n1) ClinVar\n2) dbSNP\n3) Ensembl\n4) PheGenI\n5) OMIM\n6) openSNP\n"
            + "7) SNPedia\n8) UCSC");

        if (person != null) {
            if ("8" == person) {
                html = 'http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position=' + 'chr' +
        data_degree_snp[i].chrom + ':' + (data_degree_snp[i].bp_position - 1000) + '-' + (data_degree_snp[i].bp_position + 1000);

            } else if ("6" == person) {
                html = 'http://opensnp.org/snps/' + data_degree_snp[i].rs;

            } else if ("2" == person) {
                html = 'http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs=' + data_degree_snp[i].rs.substring(2);

            } else if ("4" == person) {
                html = 'http://www.ncbi.nlm.nih.gov/gap/phegeni?tab=2&rs=' + data_degree_snp[i].rs.substring(2);

            } else if ("3" == person) {
                html = 'http://www.ensembl.org/Homo_sapiens/Variation/Summary?r=' + data_degree_snp[i].chrom + ':' +
        (data_degree_snp[i].bp_position - 1000) + '-' + (data_degree_snp[i].bp_position + 1000) + ';source=dbSNP;v=rs' +
        data_degree_snp[i].rs.substring(2) + ';vdb=variation';

            } else if ("7" == person) {
                html = 'http://www.snpedia.com/index.php/Rs' + data_degree_snp[i].rs.substring(2);

            } else if ("5" == person) {
                html = 'http://omim.org/search?index=entry&search=rs' + data_degree_snp[i].rs.substring(2);

            } else if ("1" == person) {
                html = 'http://www.ncbi.nlm.nih.gov/clinvar?term=rs' + data_degree_snp[i].rs.substring(2);
            }
            window.open(html)
        }
    });

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0," + 0 + ")")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(0)")
        .attr("x", width / 2)
        .attr("y", -25).style("font-size", "15px")
        .style("text-anchor", "end")
        .text("Degree");

    var bar_hDS = svg.selectAll(".bar")
        .data(data_degree_snp)
        .enter().append("rect")
        .attr("class", "ds bar")
        .attr("y", function(d) {
            return y("chr" + d.chrom + ':' + d.bp_position);
        })
    .attr("height", y.rangeBand())
        .attr("x", 0)
        .attr("width", function(d) {
            return x(d.degree);
        })
    .on("mousedown", function(g, i) {
        bar_hDS.style("fill", "steelblue");
        l = [];
        list_idx_in_links = [];
        list_idx_in_links2 = [];

        // filters the selected SNPs and write it in the arrays for the
        // SNPs paragraphs.
        links_hes.forEach(function(e) {
            if (g.id === e.source || g.id === e.target) {
                l.push(("chr" + allNodes[e.source].chrom + ':' +
                        allNodes[e.source].bp_position));
                l.push(("chr" + allNodes[e.target].chrom + ':' +
                        allNodes[e.target].bp_position));
                list_idx_in_links.push(e.source + "-" + e.target);
                list_idx_in_links2.push(e);
            }
        });	

        bar_hDS.filter(function(d) {
            if (include_in_arr(l, ("chr" + d.chrom + ':' + d.bp_position))) {
                return d;
            }
        })
        .transition()
            .style("fill", "red");

        bar_hDS.filter(function(d) {
            if (("chr" + d.chrom + ':' + d.bp_position) === ("chr" + data_degree_snp[i].chrom + ':' + data_degree_snp[i].bp_position)) {
                return d;
            }
        })
        .transition()
            .style("fill", "#32ee00");

        if(plot_chosen == "p_cir" || plot_chosen == "p_arc") {
            d3.select("#chart").selectAll("g circle").transition().style("opacity", 0);

            d3.select("#chart").selectAll("g circle") //select the circles           
                .filter(function(d) {
                    if (include_in_arr(l, ("chr" + d.chrom + ':' + d.bp_position))) {
                        return d;
                    }
                })
            .transition()
                .style("opacity", 1);

            d3.select("#chart").selectAll(".link").transition().style("opacity", 0);

            //select the association regarding to the circle selected
            d3.select("#chart").selectAll(".link") 
                .filter(function(d, i) {
                    if (include_in_arr(list_idx_in_links, d.source + "-" + d.target)) {
                        return d;
                    }
                })
            .transition()
                .style("opacity", 0.3);
        }
    });

    svg.selectAll(".bar") //show degree as tooltip - title
        .data(data_degree_snp)
        .append("title")
        .text(function(d) {
            return "chr" + d.chrom + ':' + d.bp_position + " ; " + d.degree;
        });
}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ histogram degree X SNPs (matrix) ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// hist_edges_subgraph.js
/**
 * @fileoverview Alls function to create the histogram Edges x Subgraph Id (probe_group)
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */

/**
 * It will create the histogram edges X subgraphId in circle plot and communitties plot.
 *     When a bar is clicked a subgraph is selected.
 * @param {string} file_name
 */
function histogram_edges_subgraphId(if_zoom) {

    var data_probe_group1 = [];
    var data_probe_group2 = [];
    var data_obj = []; //array with obj. with the couple egds and probe_group

    var data_probe_group1 = [];
    //this array will receive the probe_group of the json file, example -> [1,3,2,4,1,1,3,4,4,4,2] .
    //Next it will be sorted,  exemplo -> [1,1,1,2,2,3,3,4,4,4]
    var data_probe_group2 = [];
    //this array will receive small array from data_probe_group1.
    //the length the each sub-array represent the number the edges in a subgraph, 
    //example -> [[1,1,1],[2,2],[3,3],[4,4,4]], in this array the 1ª element is the subgraph 1 and has 3 edges.    
        if (if_zoom) {
            zoom_links.forEach( function(d) {
                data_probe_group1.push(d.probe_group);
            });
        } else {
            links.forEach(function(d) {
                data_probe_group1.push(d.probe_group);
            }); //-> [1,3,2,4,1,1,3,4,4,4,2]
        }
        data_probe_group1.sort(function(a, b) { //-> [1,1,1,2,2,3,3,4,4,4]
            return a > b ? 1 : 0;
        });

        //this function will create the array data_probe_group2 from data_probe_group1,
        //exemplo: [1,1,1,2,2,3,3,4,4,4] -> [[1,1,1],[2,2],[3,3],[4,4,4]].
        var max = d3.max(data_probe_group1, function(d) {
            return d;
        });
        var min = d3.min(data_probe_group1, function(d) {
            return d;
        });
        var li, ary;

        while (min <= max) {
            li = data_probe_group1.lastIndexOf(min);
            ary = data_probe_group1.splice(0, li + 1);
            data_probe_group2.push(ary);
            min = d3.min(data_probe_group1, function(d) {
                    return d;
            })            
        }


        function creat_obj_probe(probe_group, edgs) {
            //function to create the obj. with the couple egds and probe_group
            var obj = {};
            obj.n_probe_group = probe_group;
            obj.n_edgs = edgs;
            return obj;
        }

        for (var i = 0; i < data_probe_group2.length; i++) {
            // from data_probe_group2 we will create a array with obj. with the couple egds and probe_group
            data_obj.push(creat_obj_probe(data_probe_group2[i][0], data_probe_group2[i].length));
        }

        var margin = {
            top: 50,
            right: 20,
            bottom: 50,
            left: 150
        },

        width = 700 - margin.left - margin.right; 

        if ( data_obj.length  > 5) {
            var height = 34.1796875 * data_obj.length - margin.top - margin.bottom; 
        } else {
            var height = 34.1796875 * 10 - margin.top - margin.bottom;
        }

        var y = d3.scale.ordinal()
            .rangeRoundBands([0, height], .5);

        var x = d3.scale.linear()
            .range([0, width]);

        var xAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var yAxis = d3.svg.axis()
            .scale(x)
            .orient("top");

        var svg = d3.select("#hesid").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        y.domain(data_obj.map(function(d) {
            return "probe_group " + d.n_probe_group;
        }));

        x.domain([0, d3.max(data_obj, function(d) {
            return d.n_edgs;
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .call(xAxis);
        
        // now rotate text on x axis
        // first move the text left so no longer centered on the tick
        // then rotate up to get 90 degrees.
        // select all the text elements for the xaxis
        svg.selectAll(".x text").style("font-size", "14px"); 

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0," + 0 + ")")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(0)")
            .attr("x", width / 2)
            .attr("y", -25).style("font-size", "14px")
            .style("text-anchor", "end")
            .text("Nº Edges");

        svg.selectAll(".bar")
            .data(data_obj)
            .enter().append("rect")
            .attr("class", "es bar")
            .attr("x", 0)
            .attr("width", function(d) {
                return x(d.n_edgs);
            })
            .attr("y", function(d) {
                return y(d.n_probe_group);
            })
            .attr("height", y.rangeBand())
            .attr("fill", function(d) {
         
    return graphColor(d.n_probe_group);
            })
            .attr("fill-opacity", .5).style("font-size", "14px")
                .on("mousedown", function(g, i) {
                    //when mousedown this selected the probe_group and create the string_html to show in html the seleced data 
                    d3.select("#hc").select("svg").remove();
                    d3.select("#hds_matrix").select("svg").remove();
                    sid = data_obj[i].n_probe_group;

                    histogram_degree_SNPs(sid, 0, 0);

                    string_html = "{\"directed\": false, \"graph\": [], \"nodes\": [";

                    json_nodes_selected(sid);
                    json_links_selected(sid);

                    d3.select("#chart")
                        .selectAll("g circle")
                        .transition()
                        .style("opacity", 1)
                        .style("stroke", function (d) {
                            return graphColor(g.n_probe_group);
                        })
                        .style("fill", function (d) {
                            return graphColor(g.n_probe_group);
                        });

                    d3.select("#chart")
                        .selectAll("g circle") //select the circles
                        .filter(function(d) {
                            return d.probe_group != data_obj[i].n_probe_group;
                        })
                        .transition()
                        .style("opacity", 0);

                    d3.select("#chart")
                        .selectAll(".link")
                        .transition()
                        .style("opacity", 0.3)
                        .style("stroke", function (d) {
                            return graphColor(g.n_probe_group);
                        });

                    d3.select("#chart")
                        .selectAll(".link")
                        .filter(function(d) {
                            return d.probe_group != data_obj[i].n_probe_group;
                        })
                        .transition()
                        .style("opacity", 0);

                    d3.select("#snps").selectAll("p").remove(); //remove old text
                    d3.select("#pairs").selectAll("p").remove(); //remove old text

                    // Write out the data selected in text 
                    d3.select("#snps").selectAll("p")
                        .data(function () {
                            if(if_zoom) {
                                return zoom_allNodes;    
                            } else {
                                return allNodes;      
                            }
                        })
                        .enter().append("p")
                        .filter(function(d) {
                            return d.probe_group === data_obj[i].n_probe_group;
                        })
                        //link for UCSC genome browser for each snp (small circle) selected
                        .append("link").attr("href", function(d) {  			
                            return 'http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position=' + 
                                'chr' + d.chrom + ':' + (d.bp_position - 1000) + '-' + (d.bp_position + 1000);
                        })
                        .attr("target", "_blank")
                        .style("text-decoration", 'none')
                        .style("color", "black")
                        .text(function(d) {
                            return showSnp(d);
                        });

                    d3.select("#pairs").selectAll("p")
                        .data(function () {
                            if(if_zoom) {
                                return zoom_links;    
                            } else {
                                return links;      
                            }
                        })
                        .enter().append("p")
                        .filter(function(d) {
                            return d.probe_group === data_obj[i].n_probe_group;
                        })
                        .text(function(d) {
                            return showInteract(d.ct_id);
                        });
                });

        svg.selectAll(".bar") //show degree as tooltip - title
            .data(data_obj)
            .append("title")
            .text(function(d) {
                return d.n_edgs;
            });

        svg.selectAll(".text_b")
            .data(data_obj)
            .enter()
            .append("text")
            .attr("class", "text_b")
            .text(function(d) {
                return d.n_edgs;
            })
            .attr("x", function(d) {
                return x(d.n_edgs);
            })
            .attr("y", function(d) {
                return y(d.n_probe_group) + 10;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "black")
            .on("mousedown", function(g, i) {
                //when mousedown this selected the probe_group and create the string_html to show in html the seleced data 
                d3.select("#hc").select("svg").remove();
                sid = data_obj[i].n_probe_group;
                string_html = "{\"directed\": false, \"graph\": [], \"nodes\": [";
                json_nodes_selected(sid);
                json_links_selected(sid);

                d3.select("#chart")
                    .selectAll("g circle")
                    .transition()
                    .style("opacity", 1);

                d3.select("#chart")
                    .selectAll("g circle") //select the circles
                    .filter(function(d) {
                        return d.probe_group != data_obj[i].n_probe_group;
                    })
                    .transition()
                    .style("opacity", 0);

                d3.select("#chart")
                    .selectAll(".link")
                    .transition()
                    .style("opacity", 0.3);

                d3.select("#chart")
                    .selectAll(".link")
                    .filter(function(d) {
                        return d.probe_group != data_obj[i].n_probe_group;
                    })
                    .transition()
                    .style("opacity", 0);

                d3.select("#snps").selectAll("p").remove(); //remove old text
                d3.select("#pairs").selectAll("p").remove(); //remove old text

                // Write out the data selected in text 
                d3.select("#snps").selectAll("p")
                    .data(function () {
                        if(if_zoom) {
                            return zoom_allNodes;    
                        } else {
                            return allNodes;      
                        }
                    })
                    .enter().append("p")
                    .filter(function(d) {
                        return d.probe_group === data_obj[i].n_probe_group;
                    })
                    //link for UCSC genome browser for each snp (small circle) selected 			
                    .append("link").attr("href", function(d) { 
                        return 'http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position=' + 
                            'chr' + d.chrom + ':' + (d.bp_position - 1000) + '-' + (d.bp_position + 1000);
                    })
                    .attr("target", "_blank")
                    .style("text-decoration", 'none')
                    .style("color", "black")
                    .text(function(d) {
                        return showSnp(d);
                    });

                d3.select("#pairs").selectAll("p")
                    .data(function () {
                        if(if_zoom) {
                            return zoom_links;    
                        } else {
                            return links;      
                        }
                    })
                    .enter().append("p")
                    .filter(function(d) {
                        return d.probe_group === data_obj[i].n_probe_group;
                    })
                    .text(function(d) {
                        return showInteract(d.ct_id);
                    });
            });
}
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ histogram edges X probe_group ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// matrix_snp_comm_plot.js
/**
 * @fileoverview All functions and variables to create the communitties plot
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */


/**
 * Global variable only for matrix_snp_coomm_plot.js.
 * @type {array} data_obj_mc
 */
var data_obj_mc = [];
/**
 * Global variable only for matrix_snp_coomm_plot.js.
 * @type {array} data_obj_mc2
 */
var data_obj_mc2 = [];
/**
 * Global variable only for matrix_snp_coomm_plot.js.
 * @type {array} array_SNPs_mc
 */
var array_SNPs_mc = [];

/**
 * Read a .json to inicialaze the variables and call the function matrix_comm_plot() to craete the communitties plot
 * @param {string} file_name
 */
function read_file_to_matrix_comm_plot(file_name) {
    data_obj_mc2 = [];
    data_obj_mc = [];
    array_SNPs_mc = [];

    links.forEach( function(d) {
        var obj = {}
        obj["label_x"] = parseInt(d.assoc_group.toString().split(".")[1])
        obj["label_y"] = d.source
        obj["probe_group"] = d.probe_group
        data_obj_mc.push(obj);
        data_obj_mc2.push(obj);

        var obj = {};
        obj["label_x"] = parseInt(d.assoc_group.toString().split(".")[1])
        obj["label_y"] = d.target
        obj["probe_group"] = d.probe_group

        data_obj_mc.push(obj);
        data_obj_mc2.push(obj);
    });

    data_obj_mc = [];
    d3.select("#minmap_matrixsc").selectAll('svg').remove();
    d3.select("#chart").selectAll('svg').remove(); //remove old selection

    for (var e in data_obj_mc2) {
        if (data_obj_mc2[e].probe_group === 1) {
            data_obj_mc.push(data_obj_mc2[e])
        }
    }

    mix_1 = 0;
    mix_2 = d3.max(data_obj_mc, function(d) {
        return d.label_x;
    }) + 1;
    miy_1 = d3.min(data_obj_mc, function(d) {
        return d.label_y;
    }) - 1;
    miy_2 = d3.max(data_obj_mc, function(d) {
        return d.label_y;
    }) + 1;

    matrix_comm_plot_minmap(mix_1, mix_2, miy_1, miy_2, 0, 0, 0, 0)
    matrix_comm_plot(mix_1, mix_2, miy_1, miy_2)
};

/**
 * creat the communitties plot and do the zoom from x1, x2, y1, y2 values.
 * @param {number} x1
 * @param {number} x2
 * @param {number} y1
 * @param {number} y2
 */
function matrix_comm_plot(x1, x2, y1, y2) {

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    },

    width = 800 - margin.left - margin.right, //500
    height = 800 - margin.top - margin.bottom; //200

    var x = d3.scale.linear().domain([x1, x2]) //[0,array_SNPs.length])
        .range([0, width]);

    var y = d3.scale.linear().domain([y1, y2]) //[0,array_SNPs.length])	
        .range([0, width]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.selectAll("path1")
        .data(data_obj_mc)
        .enter().append("svg:path")
        .style("fill", '#0d1dee') //blue
        .attr("transform", function(d) {
            return "translate(" + x(d.label_x) + "," + y(d.label_y) + ")";
        })
        .attr("d", d3.svg.symbol().type("square").size("25"));

    svg.append("g")
        .attr("class", "xmat axis")
        .attr("transform", "translate(0," + 0 + ")")
        .call(xAxis);

    svg.selectAll(".xmat text") // select all the text elements for the xaxis
        .attr("transform", function(d) {
            return "translate(" + this.getBBox().height * 1 + "," + this.getBBox().height * -1.5 + ")rotate(-90)";
        });

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", -650)
        .attr("y", 7)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("SNP id");

    svg.append("g")
        .attr("class", "brush")
        .call(d3.svg.brush().x(x).y(y)
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend));

    function brushstart() {
        svg.classed("selecting", true);
    }

    function brushmove() {
        var e = d3.event.target.extent();
      
        mx_1 = e[0][0];
        mx_2 = e[1][0];
        my_1 = e[0][1];
        my_2 = e[1][1];

    }

    function brushend() {
        svg.classed("selecting", !d3.event.target.empty());
    }
}

/**
 * this function create the minimap from comm that show all SNPs association and do the zoom from x1, x2, y1, y2 values.
 * If mrect_x1, mrect_y1, mrect_x2, mrect_y2 are diferent from zero (0) this create a rectangle
 * to help a see the location of the zoom.
 * @param {number} x1
 * @param {number} x2
 * @param {number} y1
 * @param {number} y2
 * @param {number} mrect_x1
 * @param {number} mrect_x2
 * @param {number} mrect_y1
 * @param {number} mrect_y2
 */
function matrix_comm_plot_minmap(x1, x2, y1, y2, mrect_x1, mrect_y1, mrect_x2, mrect_y2) {

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    },

    width = 250 - margin.left - margin.right, //500
    height = 250 - margin.top - margin.bottom; //200

    var x = d3.scale.linear().domain([x1, x2]) //[0,array_SNPs.length])
        .range([0, width]);

    var y = d3.scale.linear().domain([y1, y2]) //[0,array_SNPs.length])	
        .range([0, width]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#minmap_matrixsc").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.selectAll("path1")
        .data(data_obj_mc)
        .enter().append("svg:path")
        .style("fill", '#0d1dee') //blue
        .attr("transform", function(d) {
            return "translate(" + x(d.label_x) + "," + y(d.label_y) + ")";
        })
        .attr("d", d3.svg.symbol().type("square").size("10"));

    if (mrect_x1 != 0 && mrect_y1 != 0 && mrect_x2 != 0 && mrect_y2 != 0) {
        svg.selectAll("rect") //create color scale bar
            .data([0])
            .enter()
            .append("rect")
            .attr("x", x(mrect_x1))
            .attr("y", y(mrect_y1))
            .attr("width", x(mrect_x2))
            .attr("height", y(mrect_y2) - y(mrect_y1)) 
            .attr("fill", "rgba(255, 0, 0, 0.1)")
            .attr("stroke", "rgba(255, 0, 0, 1)")
            .attr("stroke-width", "5");
    }

    svg.append("g")
        .attr("class", "xmat axis")
        .attr("transform", "translate(0," + 0 + ")")
        .call(xAxis);

    svg.selectAll(".xmat text") // select all the text elements for the xaxis
        .attr("transform", function(d) {
            return "translate(" + this.getBBox().height * 1 + "," + this.getBBox().height * -1.5 + ")rotate(-90)";
        });

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
}
// Roc_plot.js
/**
 * @fileoverview  function  to create the ROC plot.
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Soon Ong)
 */

/**
 * Read a .json to inicialaze the variables, get the datas and create the ROC plot from contigency table data
 * @param {number} idx
 * @param {string} filename
 */
function ROC_plot(idx) {
    //Width and height
    var padding = 30;

    var margin = {
        top: 35,
        right: 35,
        bottom: 65,
        left: 65
    };

    var width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    function preval_mapping(dat, t0, t1) {
        E = 0.0001;
        return (dat.cases / t1) * (t0 / (dat.controls + E));
    }

    function sort_unv(dat, t0, t1) {
        var p = [];
        var p_sort = [];
        var dat_sort = [];
        for (var i in dat) {
            p.push(preval_mapping(dat[i], t0, t1))
        }
        for (var i in p) {
            p_sort.push(p[i])
        }
        p_sort.sort(function(a, b) {
            return b - a
        });
        for (var i in p_sort) {
            id = p.indexOf(p_sort[i])
                dat_sort.push(dat[id])
                p[id] = "s" + p_sort[i]
        }
        return dat_sort
    }

    function sort_biv(dat, t0, t1) {
        var dat_list = [];
        var p = [];
        var p_sort = [];
        var dat_sort = [];
        for (var i in [0, 1, 2]) {
            for (var j in [0, 1, 2]) {
                dat_list.push(dat[i][j])
                    p.push(preval_mapping(dat[i][j], t0, t1))
            }
        }

        for (var i in p) {
            p_sort.push(p[i])
        }

        p_sort.sort(function(a, b) {
            return b - a
        });

        for (var i in p_sort) {

            id = p.indexOf(p_sort[i])
                dat_sort.push(dat_list[id])
                p[id] = "s" + p_sort[i]
        }
        return dat_sort
    }

    function dots_fpr_tpr(dat, t0, t1) {
        var dat_fpr_tpr = []
            var cas = 0
            var con = 0
            for (var i in dat) {
                con = con + dat[i].controls
                    cas = cas + dat[i].cases

                    var fpr = con / t0
                    var tpr = cas / t1

                    dat_fpr_tpr.push({
                        FPR: fpr,
                    TPR: tpr
                    })
            }
        return dat_fpr_tpr;
    }

    unva_data = dots_fpr_tpr(sort_unv(cont_table[idx].unv1, cont_table[idx].total.controls, cont_table[idx].total.cases),
            cont_table[idx].total.controls, cont_table[idx].total.cases);
    unvb_data = dots_fpr_tpr(sort_unv(cont_table[idx].unv2, cont_table[idx].total.controls, cont_table[idx].total.cases),
            cont_table[idx].total.controls, cont_table[idx].total.cases);
    biv_data = dots_fpr_tpr(sort_biv(cont_table[idx].biv, cont_table[idx].total.controls, cont_table[idx].total.cases), 
            cont_table[idx].total.controls, cont_table[idx].total.cases);

    var fpr = [d3.max(unva_data, function(d) {
        return d.FPR;
    }),
        d3.max(unvb_data, function(d) {
            return d.FPR;
        }),
        d3.max(biv_data, function(d) {
            return d.FPR;
        })
    ];

    var tpr = [d3.max(unva_data, function(d) {
        return d.TPR;
    }),
        d3.max(unvb_data, function(d) {
            return d.TPR;
        }),
        d3.max(biv_data, function(d) {
            return d.TPR;
        })
    ];

    var xScale = d3.scale.linear()
        .domain([0, d3.max(fpr, function(d) {
            return d;
        })])
    .range([0, width]);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(tpr, function(d) {
            return d;
        })])
    .range([height, 0]);

    //Define X axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(5);

    //Define Y axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5);

    //Define X axis
    var xAxis2 = d3.svg.axis()
        .scale(xScale)
        .orient("top")
        .ticks(5);

    //Define Y axis
    var yAxis2 = d3.svg.axis()
        .scale(yScale)
        .orient("right")
        .ticks(5);

    var svg = d3.select("#rp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function data2line(dat) {
        str = "M " + xScale(0) + " " + yScale(0) + " L ";
        for (var i in dat) {
            str = str + xScale(dat[i].FPR) + " " + yScale(dat[i].TPR) + " L ";
        }
        return str.slice(0, -3)
    };

    svg.selectAll("line")
        .data([1])
        .enter()
        .append("line")
        .attr("class", "linechrom")
        .attr("x1", xScale(0))
        .attr("y1", yScale(0))
        .attr("x2", xScale(1))
        .attr("y2", yScale(1))
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", 5)
        .style("stroke", "black") 
        .style("opacity", 0.2);

    svg.append("svg:path")
        .attr("d", data2line(biv_data))
        .style("stroke-width", 2)
        .style("stroke", "#ee1500")
        .style("fill", "none");

    svg.append("svg:path")
        .attr("d", data2line(unva_data))
        .style("stroke-width", 2)
        .style("stroke", "#0d1dee")
        .style("fill", "none");

    svg.append("svg:path")
        .attr("d", data2line(unvb_data))
        .style("stroke-width", 2)
        .style("stroke", "#00d70b")
        .style("fill", "none");

    svg.selectAll("path3")
        .data(biv_data)
        .enter().append("svg:path").style("fill", '#ee1500') //red
        .attr("transform", function(d) {
            return "translate(" + xScale(d.FPR) + "," + yScale(d.TPR) + ")";
        })
    .attr("d", d3.svg.symbol().type("cross").size("30"));

    svg.selectAll("path2")
        .data(unva_data)
        .enter().append("svg:path").style("fill", '#0d1dee') //blue
        .attr("transform", function(d) {
            return "translate(" + xScale(d.FPR) + "," + yScale(d.TPR) + ")";
        })
    .attr("d", d3.svg.symbol().type("square").size("30"));

    svg.selectAll("path1")
        .data(unvb_data)
        .enter().append("svg:path").style("fill", '#00d70b') //green
        .attr("transform", function(d) {
            return "translate(" + xScale(d.FPR) + "," + yScale(d.TPR) + ")";
        })
    .attr("d", d3.svg.symbol().type("triangle-up").size("30"));

    /*
       circle - a circle.
       cross - a Greek cross or plus sign.
       diamond - a rhombus.
       square - an axis-aligned square.
       triangle-down - a downward-pointing equilateral triangle.
       triangle-up - an upward-pointing equilateral triangle.
       */
    //----------------------------------------------------label --------------------------------------------			 
    svg.selectAll("path1l")
        .data([{FPR: 0.05,TPR: 0.95}])
        .enter().append("svg:path").style("fill", '#0d1dee') //blue
        .attr("transform", function(d) {
            return "translate(" + xScale(d.FPR) + "," + yScale(d.TPR) + ")";
        })
    .attr("d", d3.svg.symbol().type("square").size("30"));

    svg.selectAll("path2l")
        .data([{FPR: 0.05,TPR: 0.9}])
        .enter().append("svg:path").style("fill", '#00d70b') //green
        .attr("transform", function(d) {
            return "translate(" + xScale(d.FPR) + "," + yScale(d.TPR) + ")";
        })
    .attr("d", d3.svg.symbol().type("triangle-up").size("30"));

    svg.selectAll("path3l")
        .data([{FPR: 0.05,TPR: 0.85}])
        .enter().append("svg:path").style("fill", '#ee1500') //red
        .attr("transform", function(d) {
            return "translate(" + xScale(d.FPR) + "," + yScale(d.TPR) + ")";
        })
    .attr("d", d3.svg.symbol().type("cross").size("30"));

    svg.selectAll("text")
        .data([{
            FPR: 0.0575,
            TPR: 0.94
        }, {
            FPR: 0.0575,
            TPR: 0.89
        }, {
            FPR: 0.0575,
            TPR: 0.84
        }])
    .enter()
        .append("text")
        .text(function(d, i) {
            if (i == 0) {
                return "SNPa (3 dots)";
            }
            if (i == 1) {
                return "SNPb (3 dots)";
            }
            if (i == 2) {
                return "SNPaSNPb (9 dots)";
            }
        })
    .attr("x", function(d) {
        return xScale(d.FPR);
    })
    .attr("y", function(d) {
        return yScale(d.TPR);
    })
    .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", function(d, i) {
            if (i == 0) {
                return "#0d1dee";
            }
            if (i == 1) {
                return "#00d70b";
            }
            if (i == 2) {
                return "#ee1500";
            }
        });

    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ label ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 			
    //Create X axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height) + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width / 2)
        .attr("y", 30)
        .style("text-anchor", "end")
        .text("FPR");

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (height), 0 + ")")
        .call(xAxis2)

        //Create Y axis
        svg.append("g")
        .attr("class", "axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", -100)
        .attr("y", -30)
        .style("text-anchor", "end")
        .text("TPR");

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxis2)
};
// SNP_pairs_list.js
/**
 * @fileoverview All functions and variables to create the Manhattan plot
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */
// global array to store the highlighted links
var highlighting_links = new Array();

function show_snp_pairs_list(file_name, stat_value, if_selected_stat, if_zoom, if_selected, selected_links) {
    // Plot nodes and SNPs_links for the default dataset
        var SNPs_links = [];
        if(!if_zoom && !if_selected_stat) {
            SNPs_links = links;
        } else if(if_zoom && !if_selected_stat){
            SNPs_links = zoom_links ; 
        } else {
            SNPs_links = stat_links; 
        }

        // check if link is already selected
        var temp = false;
        temp = highlighting_links.some(function (d) {
            return d == selected_links;
        });

        // if you click on a link asecond time the highlighting will disappear
        if(!temp) {
            highlighting_links[selected_links] = selected_links;
        } else {
            highlighting_links[selected_links] = undefined;  
        }

        d3.select("#pairs").selectAll("p")
            .data(SNPs_links.sort(function(a, b) {
                return b[stat_value] - a[stat_value];
            }))
            .enter().append("p")
            .attr("id", function (d) {
                return "SNPpair"+ d.ct_id;
            })
            .text(function(d) {
                return showInteract(d.ct_id);
            })
            .style("background-color", function (d, i) {
                if (!if_selected) {
                    return "white"
                } else {
                    if(highlighting_links.some( function (v) { return v === d.ct_id;})) {
                        return "red";
                    }  else {
                        return "white";
                    }
                }
            })
            .on("mousedown", function(g, i) {
                d3.select("#table_snps").selectAll('table').remove();
                create_table_snps(SNPs_links[i])

                //"roc_id":0 file_json "bd.json"
                d3.select("#rp").selectAll('svg').remove();
                // creates the ROC_plot 
                ROC_plot(SNPs_links[i].ct_id)

                d3.select("#contp").selectAll('svg').remove();
                cont_plot(SNPs_links[i].ct_id)
            });
    // remove all highlighted links if you use an other dataset
    check_file_name = file_name;
}
// table_snp_pairs.js
/**
 * @fileoverview  This file has the function to create the table with information about snps pairs
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */

/**
 * From data about snps pairs in dat this function create a table
 * @param {array} dat
 */
function create_table_snps(dat) {

    var dataset = [],
        tmpDataset = []; 

    tmpDataset.push("prb_a");
    tmpDataset.push("prb_b");
    tmpDataset.push("prbCode_a");
    tmpDataset.push("prbCode_b");
    tmpDataset.push("browser_a");
    tmpDataset.push("browser_b");
    tmpDataset.push("rs_a");
    tmpDataset.push("rs_b");

    for (var e in dat) {
        if ("assoc_group" != e && "source" != e && "target" != e && "probe_group" != e && "ct_id" != e) {
            tmpDataset.push(e);
        }
    }
    dataset.push(tmpDataset);
    tmpDataset = []

    tmpDataset.push(allNodes[dat.source].prb);
    tmpDataset.push(allNodes[dat.target].prb);
    tmpDataset.push(allNodes[dat.source].prbCode);
    tmpDataset.push(allNodes[dat.target].prbCode);
    tmpDataset.push("chr" + allNodes[dat.source].chrom + ':' + allNodes[dat.source].bp_position);
    tmpDataset.push("chr" + allNodes[dat.target].chrom + ':' + allNodes[dat.target].bp_position);
    tmpDataset.push(allNodes[dat.source].rs);
    tmpDataset.push(allNodes[dat.target].rs);

    for (var e in dat) {
        if ("assoc_group" != e && "source" != e && "target" != e && "probe_group" != e && "ct_id" != e) {
            tmpDataset.push(dat[e]);
        }

    }
    dataset.push(tmpDataset);

    d3.select("#table_snps")
        .append("table")
        .style("border-collapse", "collapse")
        .style("border", "2px black solid")
        .selectAll("tr")
        .data(dataset)
        .enter().append("tr")
        .selectAll("td")
        .data(function(d) {
            return d;
        })
        .enter().append("td")
        .style("border", "1px black solid")
        .style("padding", "10px")
        .on("mouseover", function() {
            d3.select(this).style("background-color", "aliceblue")
        })
        .on("mouseout", function() {
            d3.select(this).style("background-color", "white")
        })
        .text(function(d) {
            return d;
        })
        .style("font-size", "12px");
}
// view_graph.js
/**
 * @fileoverview Utilities such as global variable and functions for handling the functions in another javascript files and create the plots.
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 * @author stefan.sevelda@hotmail.com (Stefan Sevelda)
 */

//------------------------------------------   Global variable   ---------------------------------------------- 





//------------------------------------------ load -  first vizualization   ---------------------------------------------- 

/**
 * Get the path of the one json file and pass this file in the function upload_json().
 *     More reference in http://www.html5rocks.com/en/tutorials/file/dndfiles/.
 * @param {event} evt it has information about the file or files - FileList object
 */
function handleFileSelect(evt) {

    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                load_data_json(e.target.result);
            };
        })(f);
        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
//displayed the selected plot
plot_chosen = document.getElementById('Plot_select').value; 

/**
 * This function make the upload of a json file and create the first vizualization with this selected file.
 * @param {string} data_uri contains the JSON file
 */
function upload_json() {
    // copy the file contents to the global variable

    //------------------ create and change values in statistic test drop box
    switch(plot_chosen) {
        case "p_arc":
            //remove all unused containers
            remove_section();

            //create used containers
            
            create_container_probegroup();
            drop_stat_cma();
            pvalue_range_container();
            create_textzoom_container();
            //the first element to be visualited
            st_chosen = st_1[0];
            // to create the available statistical test of the dataset located 
            creat_drop_box1("st_select2");
            // to create the dropbox in the SNP pair list
            creat_drop_box1("st_select_snp_pairs");

            //start arc plot
            start_arc_plot();
            break;
        case "p_cir":
            // remove all unused containers
            remove_section();

            // create used containers
            create_container_probegroup();
            drop_stat_cma();
            pvalue_range_container();
            create_textzoom_container();
            //the first element to be visualited
            st_chosen = st_1[0];
            // to create the available statistical test of the dataset located 
            creat_drop_box1("st_select2");
            // to create the dropbox in the SNP pair list
            creat_drop_box1("st_select_snp_pairs");

            //start circular plot
            start_cir_plot();
            break;
        case "p_man":
            // remove all unused containers
            remove_section();

            // create used containers
            drop_stat_cma();
            // start manhattan plot
            start_manhattan_plot(data_uri);
            break;
        case "p_mat":
            // remove all unused containers
            remove_section();
        
            // start plot heat-map
            start_heat_map(data_uri);
            break;
    }
}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ load - first vizualization ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 

// ----------------------------  chose the plot  - drop box ---------------------------------------------- 
//remove old container
function remove_section() {
    // to clear all links and allNodes
    // remove containers
    d3.select("#load_data").remove();
    d3.select("#chart").selectAll('svg').remove();
    d3.select("#scale_bar").selectAll('svg').remove();
    d3.select("#pairs").selectAll("p").remove();
    d3.select("body").selectAll('svg').remove();
    d3.select("#two_weight_value").selectAll("h").remove();
    d3.select("#hesid").selectAll('svg').remove();
    d3.select("#table_snps").selectAll('table').remove();
    d3.select("#butpl").remove();
    d3.select("#butrl").remove();
    d3.select("#textzoom").selectAll('select').remove();
    d3.select("#textzoom").selectAll('input').remove();
    d3.select("#textzoom").selectAll('text').remove();
    d3.select("#container_matrix").remove();
    d3.select("#two_weight_value").remove();
    d3.select("#st_select").remove();
    d3.select("#hesid_text").remove();
};
/**
 * Allows us choose one plot to vizualization
 */
d3.select("#Plot_select").on("change", function change() {
    plot_chosen = this.value;
    upload_json();
});


//------------------------------------------show roc and contegency table   ----------------------------------------------      

/**
 * input tag and button to search for pairs snps to craete the roc and contegency table
 */
function show_roc_ct() {
    snps = document.getElementById("search_snps").value;
    allNodes_links = []

    for (var i in links) {
        dic = {
            prb_a: allNodes[links[i].source].prb,
            prb_b: allNodes[links[i].target].prb,
            prbCode_a: allNodes[links[i].source].prbCode,
            prbCode_b: allNodes[links[i].target].prbCode,
            browser_a: "chr" + allNodes[links[i].source].chrom + ':' + allNodes[links[i].source].bp_position,
            browser_b: "chr" + allNodes[links[i].target].chrom + ':' + allNodes[links[i].target].bp_position,
            rs_a: allNodes[links[i].source].rs,
            rs_b: allNodes[links[i].target].rs,
            id_links: i
        }
        allNodes_links.push(dic);
    }

    snps = snps.split(" ");

    var snp_a = snps[0];
    var snp_b = snps[snps.length - 1];
    var idx_snps = "null";

    var idx_in_links;

    for (var i in allNodes_links) {

        if ((snp_a == allNodes_links[i].prb_a && snp_b == allNodes_links[i].prb_b) ||
            (snp_a == allNodes_links[i].prbCode_a && snp_b == allNodes_links[i].prbCode_b) ||
                (snp_a == allNodes_links[i].browser_a && snp_b == allNodes_links[i].browser_b) ||
                    (snp_a == allNodes_links[i].rs_a && snp_b == allNodes_links[i].rs_b)) {

            idx_snps = allNodes_links[i].id_links;
            idx_in_links = i;
        }
    }

    if (idx_snps != "null") {

        d3.select("#table_snps").selectAll('table').remove();
        create_table_snps(links[idx_snps])
        d3.select("#rp").selectAll('svg').remove();
        ROC_plot(links[idx_snps].ct_id)
        d3.select("#contp").selectAll('svg').remove();
        cont_plot(links[idx_snps].ct_id);

        if (plot_chosen === "p_cir") { 

            d3.select("#chart").selectAll("g circle").transition().style("opacity", 1);
            d3.select("#chart").selectAll("g circle") //select the circles
            .filter(function(d) {
                return d.prb != allNodes_links[idx_in_links].prb_a && d.prb != allNodes_links[idx_in_links].prb_b;
            })
            .transition()
            .style("opacity", 0);

            d3.select("#chart").selectAll(".link").transition().style("opacity", 0);
            d3.select("#chart").selectAll(".link") //select the association regarding to the circle selected
            .filter(function(d, i) {
                return i == idx_in_links;
            }).transition()
            style("opacity", 0.3);

        } else {
            d3.select("#table_snps").selectAll('table').remove();
            d3.select("#rp").selectAll('svg').remove();
            d3.select("#contp").selectAll('svg').remove();
            alert("Error: search again!")
        }
    }
}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^    show roc and contegency table    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 

//------------------------------------------load and save -  show the data selected in json file    ----------------------------------------------

/**
 * This function create a new tab, when we click in button "show .json", with a .json with datas selected
 */
function selected_json() {

    d3.json(file_json, function(json) {

        var string_html_export = "";
        var link_html = "\"links\": [";
        var nodes_html = "\"nodes\": [";
        var subgraphs_html = "\"subgraphs\": [";
        var ct_html = "\"cont_table\": [";

        number_count_probe_group = 1
        number_count_map_id = 0
        number_count_ct_id = 0
        number_count_degree = 0

        //like dictioniry
        map_degree = d3.map();
        map_probe_group = d3.map();
        map_id = d3.map();
        map_nodes = d3.map();
        map_subgraph_nedges = d3.map();
        map_ct_id = d3.map();

        function update_map_id(key) {
            if (map_id.has(key) != true) {
                map_id.set(key, number_count_map_id);
                number_count_map_id = number_count_map_id + 1;
            }
        }

        function update_map_probe_group(key) {
            if (map_probe_group.has(key) != true) {
                map_probe_group.set(key, number_count_probe_group);
                number_count_probe_group = number_count_probe_group + 1;
            }
        }

        function update_map_degree(key) {
            if (map_degree.has(key) != true) {
                map_degree.set(key, 1);
            } else {
                v = map_degree.get(key) + 1;
                map_degree.set(key, v);
            }
        }

        function update_map_subgraph_nedges(key) {
            if (map_subgraph_nedges.has(key) != true) {
                map_subgraph_nedges.set(key, 1);
            } else {
                v = map_subgraph_nedges.get(key) + 1;
                map_subgraph_nedges.set(key, v);
            }
        }

        function update_map_ct_id(key) {
            if (map_ct_id.has(key) != true) {
                map_ct_id.set(key, number_count_ct_id);
                number_count_ct_id = number_count_ct_id + 1;
            }
        }

        for (var i in json) {
            list_keys_json.push(i);
        }

        json.links.forEach(function(d) {
            if (d[st_chosen] >= brush_value1 && d[st_chosen] <= brush_value2) {

                update_map_degree(d.source);
                update_map_degree(d.target);
                update_map_id(d.source);
                update_map_id(d.target);

                update_map_probe_group(d.probe_group);
                update_map_subgraph_nedges(map_probe_group.get(d.probe_group));

                if (use_cont_table == "yes") {
                    update_map_ct_id(d.ct_id)
                    if (map_id.get(d.source) > map_id.get(d.target)) {
                        string_link = "{\"source\": " + map_id.get(d.source) + ", \"probe_group\": " + 
                            map_probe_group.get(d.probe_group) + ", \"target\": " + map_id.get(d.target) +
                            ", \"ct_id\": " + map_ct_id.get(d.ct_id);
                    } else {
                        string_link = "{\"source\": " + map_id.get(d.target) + ", \"probe_group\": " +
                            map_probe_group.get(d.probe_group) + ", \"target\": " + map_id.get(d.source) +
                            ", \"ct_id\": " + map_ct_id.get(d.ct_id);
                    }

                } else {
                    if (map_id.get(d.source) > map_id.get(d.target)) {
                        string_link = "{\"source\": " + map_id.get(d.source) + ", \"probe_group\": " +
                            map_probe_group.get(d.probe_group) + ", \"target\": " + map_id.get(d.target);
                    } else {
                        string_link = "{\"source\": " + map_id.get(d.target) + ", \"probe_group\": " +
                            map_probe_group.get(d.probe_group) + ", \"target\": " + map_id.get(d.source);
                    }
                }

                for (i in st_1) {
                    string_link += ", \"" + st_1[i] + "\": " + d[st_1[i]];
                }
                string_link += "},";
                link_html += string_link;
            }
        });
        link_html = link_html.substring(0, link_html.lastIndexOf(",")); // IMP ->remover a ultima virgula<- IMP	
        link_html = link_html + ']';

        json.nodes.forEach(function(d) {
            //create the nodes to be exporte in json file. It were selected in reange of p-value 
            //"nodes": [{"prbCode": "rs10205611", "degree": 1.0, "prb": 0, "rs": "rs10205611","probe_group": 1,
            //"bp_position": 148853010, "chrom": 2, "id": 0}

            if (map_id.has(d.id)) {
                string_node = "{\"degree\": " + map_degree.get(d.id) + ", \"id\": " + map_id.get(d.id) +
                    ", \"probe_group\": " + map_probe_group.get(d.probe_group);

                for (var i in d) {
                    if (i != "id" && i != "probe_group" && i != "degree") {
                        string_node = string_node + " ,\"" + i + "\": \"" + d[i] + "\"";
                    }
                }
                string_node = string_node + "}";
                map_nodes.set(map_id.get(d.id), string_node);
            }
        });
        sort_keys = map_nodes.keys();
        sort_keys.sort(function(a, b) {
            return a - b;
        });
        for (i in sort_keys) {
            nodes_html += map_nodes.get(sort_keys[i]) + ",";
        }
        nodes_html = nodes_html.substring(0, nodes_html.lastIndexOf(",")); // IMP ->remover a ultima virgula<- IMP	
        nodes_html = nodes_html + ']';

        //create the cont_table to be exporte in json file. It were selected in reange of p-value         
             
        if (use_cont_table == "yes") {
            Array_map_ct_id = [];
            json.cont_table.forEach(function(d, i) {
                if (i in map_ct_id.keys()) {
                    Array_map_ct_id.push(d);
                }
            });
            for (i in Array_map_ct_id) {
                ct_html += "{\"unv1\": [{\"controls\": " + Array_map_ct_id[i]["unv1"][0]["controls"] +
                    ",\"cases\": " + Array_map_ct_id[i]["unv1"][0]["cases"] + "} ";
                ct_html += ",{\"controls\": " + Array_map_ct_id[i]["unv1"][1]["controls"] + ",\"cases\": " +
                    Array_map_ct_id[i]["unv1"][1]["cases"] + "} ";
                ct_html += ",{\"controls\": " + Array_map_ct_id[i]["unv1"][2]["controls"] + ",\"cases\": " +
                    Array_map_ct_id[i]["unv1"][2]["cases"] + "}], ";

                ct_html += "\"unv2\": [{\"controls\": " + Array_map_ct_id[i]["unv2"][0]["controls"] +
                    ",\"cases\": " + Array_map_ct_id[i]["unv2"][0]["cases"] + "} ";
                ct_html += ",{\"controls\": " + Array_map_ct_id[i]["unv2"][1]["controls"] + ",\"cases\": " +
                    Array_map_ct_id[i]["unv2"][1]["cases"] + "} ";
                ct_html += ",{\"controls\": " + Array_map_ct_id[i]["unv2"][2]["controls"] + ",\"cases\": " +
                    Array_map_ct_id[i]["unv2"][2]["cases"] + "}], "

                ct_html += "\"biv\": [[{\"controls\": " + Array_map_ct_id[i]["biv"][0][0]["controls"] + 
                    ",\"cases\": " + Array_map_ct_id[i]["biv"][0][0]["cases"] + "} ";
                ct_html += ",{\"controls\": " + Array_map_ct_id[i]["biv"][0][1]["controls"] + 
                    ",\"cases\": " + Array_map_ct_id[i]["biv"][0][1]["cases"] + "} ";
                ct_html += ",{\"controls\": " + Array_map_ct_id[i]["biv"][0][2]["controls"] +
                    ",\"cases\": " + Array_map_ct_id[i]["biv"][0][2]["cases"] + "}], ";
                ct_html += "[{\"controls\": " + Array_map_ct_id[i]["biv"][1][0]["controls"] +
                    ",\"cases\": " + Array_map_ct_id[i]["biv"][1][0]["cases"] + "} ";
                ct_html += ",{\"controls\": " + Array_map_ct_id[i]["biv"][1][1]["controls"] +
                    ",\"cases\": " + Array_map_ct_id[i]["biv"][1][1]["cases"] + "} ";
                ct_html += ",{\"controls\": " + Array_map_ct_id[i]["biv"][1][2]["controls"] +
                    ",\"cases\": " + Array_map_ct_id[i]["biv"][1][2]["cases"] + "}], ";
                ct_html += "[{\"controls\": " + Array_map_ct_id[i]["biv"][2][0]["controls"] +
                    ",\"cases\": " + Array_map_ct_id[i]["biv"][2][0]["cases"] + "} ";
                ct_html += ",{\"controls\": " + Array_map_ct_id[i]["biv"][2][1]["controls"] +
                    ",\"cases\": " + Array_map_ct_id[i]["biv"][2][1]["cases"] + "} ";
                ct_html += ",{\"controls\": " + Array_map_ct_id[i]["biv"][2][2]["controls"] +
                    ",\"cases\": " + Array_map_ct_id[i]["biv"][2][2]["cases"] + "}]], ";

                ct_html += "\"total\": {\"controls\": " + Array_map_ct_id[i]["unv2"][0]["controls"] +
                    ",\"cases\": " + Array_map_ct_id[i]["unv2"][0]["cases"] + "}} ,";
            }

            ct_html = ct_html.substring(0, ct_html.lastIndexOf(",")); // IMP ->	remover a ultima virgula <- IMP	
            ct_html = ct_html + ']';
        }
        //create the subgraphs to be exporte in json file. It were selected in reange of p-value
        map_subgraph_nedges.forEach(function(k, v) {
            subgraphs_html += "{\"probe_group\": " + k + ", \"edge_count\": " + v + "},";
        })
        subgraphs_html = subgraphs_html.substring(0, subgraphs_html.lastIndexOf(",")); // IMP ->remover a ultima virgula <- IMP
        subgraphs_html = subgraphs_html + ']';
        //string that will be exported								
        if (use_cont_table == "yes") {
            string_html_export = "{\"name\": \"export_name\", " + nodes_html + ", " + link_html +
                ", " + subgraphs_html + ", " + ct_html + "} ";
        } else {
            string_html_export = "{\"name\": \"export_name\", " + nodes_html + ", " + link_html +
                ", " + subgraphs_html + "} ";
        }

        var textFileAsBlob = new Blob([string_html_export], {
            type: 'text/plain'
        });
        var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;

        var downloadLink = document.getElementById("downloadfile");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = "Download " + fileNameToSaveAs;
        if (window.webkitURL != null) {
            // Chrome allows the link to be clicked programmatically.
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
            downloadLink.click();
        } else {
            // Firefox requires the user to actually click the link.
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        }
    });
}
//function to display the all informaiton of the interaction of SNP
function showInteract(d) {
    str = allNodes[links[d].source].rs + " " +  "chr" + allNodes[links[d].source].chrom + 
        ':' + allNodes[links[d].source].bp_position + " " + allNodes[links[d].target].rs + " " +
        "chr" + allNodes[links[d].target].chrom + ':' + allNodes[links[d].target].bp_position + " "; 

        for (var i in links[d]) {
            if (i != "assoc_group" && i != "ct_id" && i != "source" && i != "target") {
                str = str + i + ": " + links[d][i] + " ";
            }
        }
    return str;
}; 

// function to highlight the link
function highlight_snp_pairs (d, i) {
    // var to store the id of the link
    d3.select("#pairs").selectAll("p").remove() 
    show_snp_pairs_list(file_json, select_dropbox_sort, if_stat_brush, if_zoom , 1, d.ct_id);
    var scrollpair = $("#pairs");
    $('html,body').animate({scrollTop: scrollpair.offset().top});
}
/**
 * This function selected the elementes inside nodes with a subgraph_id chosen and put in the string string_html
 * @param {string} file_name
 * @param {number} probe_group
 */
function json_nodes_selected(probe_group) {

        allNodes.forEach(function(d) {
            if (d.probe_group === probe_group) {
                string_html += "{\"label\": \"" + d.label + "\", \"degree\": " + d.degree + ", \"rs\": \"" + d.rs +
                    "\", \"bp_position\": " + d.bp_position + ", \"chrom\": " + d.chrom + ", \"id\": " + d.id +
                    ", \"probe_group\": " + d.probe_group + "},";
            }
        });
        string_html = string_html.substring(0, string_html.lastIndexOf(","));
        string_html += "], \"links\": [";
};

/**
 * This function selected the elementes inside nodes with a subgraph_id chosen and put in the string string_html
 * @param {string} file_name
 * @param {number} probe_group
 */
function json_links_selected(probe_group) {

        links.forEach(function(d) {
            if (d.probe_group === probe_group) {
                string_html += "{\"source:\" " + d.source + ", \"probe_group\": " + d.probe_group + ", \"weight\": " +
                    d.weight + ", \"target\": " + d.target + ", \"edgs_in_comm\": " + d.edgs_in_comm +
                    ", \"assoc_group\": " + d.assoc_group + "},";
            }

        string_html = string_html.substring(0, string_html.lastIndexOf(",")); // IMP ->remover a ultima virgula<- IMP
        string_html += "], \"multigraph\": false}";
    });
};

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ show the data selected in json file ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 

//--------------------------------- operational functions ------------------------------------

/**
 * return a string from um number with 2 decimal after "."
 * @param {number} value
 * @return {string}
 */
function two_dec(value) {
    var v = value.toString();
    var point = ".";
    var index_point = v.indexOf(point);
    var index_twodec = index_point + 3;

    return v.substring(0, index_twodec);
}
/**
 * Check if a object is inside an array and return true if correct and false if no correct.
 * @param {number} arr
 * @param {number} obj
 * @return {Boolean}
 */
function include_in_arr(arr, obj) {
    return (arr.indexOf(obj) != -1);
}
/**
 * Get the all snps pairs that were selected in the brush in circle plot.
 *     All pairs betewen p-values s1 and s2.
 * @param {number} s1
 * @param {number} s2
 * @return {array} l
 */
function nodes_selected(s1, s2, link_selected) {
    l = []

    for (var i in link_selected) {
        if (link_selected[i][st_chosen] >= s1 && link_selected[i][st_chosen] <= s2) {
            l.push(link_selected[i]["target"]);
            l.push(link_selected[i]["source"]);
        };
    }

    return l;
}

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ operational functions ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^




//--------------------------------------  BUTTONs AND OPERATIONS --------------------------------------

/**
 * Do zoom when the button ZOOM is clicked */
d3.select("body").select("#butz").on("click", function change() {
    // set if_stat_brush to zero because it was not a specific stat region
    // selected
    if_stat_brush = 0;

    switch(plot_chosen) {
        case "p_arc":
            d3.select("#hesid").selectAll('svg').remove();
            zoom_arc()
            break;
        case "p_cir":
            zoom_arc()
            zoom_circular();
            break;
        case "p_man":
            zoom_manhattan(file_json);
            break;
        case "p_mat":
            zoom_heatmap(file_json);
            break;
    }
});

/**
 * Does RESET when the RESET button  is clicked
 */
d3.select("body").select("#butr").on("click", function change() { //button RESET
    // set if_stat_brush to zero because it was not a specific stat region
    // selected
    if_stat_brush = 0;

    switch(plot_chosen) {
        case "p_arc":
            //remove all unused containers
            remove_section();

            //create used containers
            create_container_probegroup();
            drop_stat_cma();
            pvalue_range_container();
            create_textzoom_container();
            // to create the available statistical test of the dataset located 
            creat_drop_box1("st_select2");

            //start arc plot
            start_arc_plot();
            break;
        case "p_cir":
            // remove all unused containers
            remove_section();

            // create used containers
            create_container_probegroup();
            drop_stat_cma();
            pvalue_range_container();
            create_textzoom_container();
            // to create the available statistical test of the dataset located 
            creat_drop_box1("st_select2");

            //start circular plot
            start_cir_plot();
            break;
        case "p_man":
            // remove all unused containers
            remove_section();

            // create used containers
            drop_stat_cma();
            // start manhattan plot
            start_manhattan_plot();
            break;
        case "p_mat":
            // remove all unused containers
            remove_section();
        
            // start plot heat-map
            start_heat_map();
            break;
    }
});

//function to load the statistical values of the links
function load_stat_value() {
    // remove elements from array
    data_weight_pvalue = [];
    //function located SNP_pairs_list.js to create list of links
    show_snp_pairs_list(file_json, st_chosen, 0, 0, 0);

    //load p_values 
    links.forEach(function(d) {
        data_weight_pvalue.push(d[st_chosen])
    });
    //brushweight function for the p_values of the snps
    select_snp_stat_range(0);
        
};

/**
 * Create the dropbox statistical test to circle plot and manhattan plot
 * @param {string} classinput is a name to create um class
 */
function creat_drop_box1(classinput) {
    d3.select("#" + classinput).selectAll('select').remove();
    // create the select element
    switch(classinput) {
        case "st_select_snp_pairs":
            select_dropbox_sort = d3.select("#" + classinput).append("select")
                .attr("id", "drop_sort");
            // create the options
            select_dropbox_sort.selectAll("option")
                .data(d3.keys(statOptions))
                .enter().append("option")
                .text(function(d) {
                    return d;
                });
            // add values to the options
            select_dropbox.selectAll("option")
                .data(d3.values(statOptions))
                .attr("value", function(d) {
                    return d;
                });
            // select the Statistical test of the dropbox and scales the axis 
            d3.select("#drop_sort").on("change",  function() {
                st_chosen = this.value;
                d3.select("#pairs").selectAll("p").remove();
                show_snp_pairs_list(file_json, st_chosen, if_stat_brush, if_zoom, 0);
            });             
            break;

        case "st_select2":
            select_dropbox = d3.select("#" + classinput).append("select")
                .attr("id", "dropselect");
            // create the options
            select_dropbox.selectAll("option")
                .data(d3.keys(statOptions))
                .enter().append("option")
                .text(function(d) {
                    return d;
                });
            // add values to the options
            select_dropbox.selectAll("option")
                .data(d3.values(statOptions))
                .attr("value", function(d) {
                    return d;
                });
            // select the Statistical test of the dropbox and scales the axis 
            d3.select("#dropselect").on("change",  function() {
                st_chosen = this.value;
                //load p 
                if(plot_chosen == "p_man") {
                    d3.select("#chart").selectAll('svg').remove();
                    d3.select("#scale_bar").selectAll('svg').remove();
                    d3.select("#minmap_mp").selectAll('svg').remove();
                    d3.select("#hds_matrix").selectAll('svg').remove();
                    read_file_to_manhattan_plot(file_json);

                    histogram_degree_SNPs(file_json, 0, 0, 0);
                } else {
                    data_weight_pvalue = [];
                    links.forEach(
                        function(d) {
                            data_weight_pvalue.push(d[st_chosen])
                        });
                    select_snp_stat_range(0);
                }
            });
            break;
        }
}
//---------------Container --------------------------------------------------
/* create textzoom container for cirular and arc plot
 */
function create_textzoom_container() {
    var textzoom_chrom = [];

    for (var i = 0 ; i < 24; i++){
        if(i < 22) {
            textzoom_chrom[i] = i+ 1;
        } else if (i == 22) {
            textzoom_chrom[i] = "x";
        } else {
            textzoom_chrom[i] = "y";
        }
    }

    
    var zoom_dropbox = d3.select("#textzoom").append("select")
        .attr("id", "view_chr");
        
    zoom_dropbox.selectAll("option")
        .data(textzoom_chrom)
        .enter().append("option")
        .text(function (d) {
            return d;
        })
        .attr("value", function (d,i) {
            return i+1;
        });
    
    d3.select("#textzoom").append("input")
        .attr("id", "texzs")
        .attr("type", "text")
        .attr("size", "10")
        .attr("name", "textzoomstart")
        .attr("value", "")
        .attr("placeholder", "start base");
        
    d3.select("#textzoom").append("input")
        .attr("id", "texze")
        .attr("type", "text")
        .attr("size", "10")
        .attr("name", "textzoomend")
        .attr("value", "")
        .attr("placeholder", "end base");
;
}

// create container with p-value rangebar for the circular and arc plot
function pvalue_range_container() {
   
    var pvalue_container = d3.select("#stat_range_container")
        .append("div")
        .attr("id", "two_weight_value")
        .text("Values: ")
            .append("span");

        pvalue_container.append("div")
            .attr("id", "brush_weight")
            .append("br");
    

};

// create statistical test dropbox container for circular, manhattan and arc plot
function drop_stat_cma() {
    d3.select("#st_select_dropbox").selectAll("div").remove();

    d3.select("#st_select_dropbox")
        .append("div")
        .attr("id", "st_select2")
        .text("Statistical Test")
            .append("br");
};

// create container to display the probe_groups
function create_container_probegroup() {
    d3.select("#probegroup_container").selectAll("div").remove();

    d3.select("#probegroup_container").append("div")
        .attr("id", "hesid_text")
            .append("h3")
                .text("Probe group")
                .append("span")
                    .append("a")
                        .attr("id", "min1")
                        .attr("class", "lnk-minimizar")
                        .attr("href", "#")
                        .text("-");

    d3.select("#probegroup_container").append("div")
        .attr("id", "hesid")
        .append("br");
        
        $(document).ready(function(){
            $("#min1").click(function(){
                // $("#hesid").slideToggle("fast");

                if( $("#hesid").is(':visible') ) {
                    $("#hesid").slideUp();
                    $(this).html('+');
                } else {
                    $("#hesid").slideDown();
                    $(this).html('-');
                }

            });
        });

};
//function for #two_weight:value and # brush_weight to select the SNP in an certain range(statistical test)
function select_snp_stat_range(if_zoom) {
 
    // remove stat-range even diagramm
    d3.select("#brush_weight").selectAll("svg").remove();
    
    //Width and height
    var w = 500;
    var h = 300;
    var padding = 30;
    // scale the axis for the brush weight plot
    var xScale_brush = d3.scale.linear()
        .domain([d3.min( data_weight_pvalue, function(d) {
            return d;
        }) - 1, d3.max(data_weight_pvalue, function(d) {
            return d;
        }) + 1])
        .range([padding, w - padding * 2]);
    //scale of yaxis
    var yScale_brush = d3.scale.linear()
        .domain([0, 0])
        .range([h - padding - 250, padding - 250]);
    // define xAxis
    var xAxis_brush = d3.svg.axis()
        .scale(xScale_brush)
        .orient("bottom")
        .ticks(8);

    //Create SVG element
    var svg_brush = d3.select("#brush_weight")
        .append("svg")
        .attr("class", "weightPvalue")
        .attr("width", w)
        .attr("height", 50);

    //create circles on the axis
    var circle = svg_brush.selectAll("circle")
        .data(data_weight_pvalue)
        .enter().append("circle")
        .attr("cx", function(d) {
            return xScale_brush(d);
        })
        .attr("cy", function(d) {
            return yScale_brush(0);
        }) 
        .attr("r", 2);

    //create xaxis
    svg_brush.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - padding - 250) + ")")
        .call(xAxis_brush);
    
    svg_brush.append("g")
        .attr("class", "brush")
        .call(d3.svg.brush().x(xScale_brush)
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend))
        .selectAll("rect")
        .attr("height", 40);

       function brushstart() { //selected de circles in x cordenate for diferent vizualization
            svg_brush.classed("selecting", true);
        }

        function brushmove() {
            var s = d3.event.target.extent(); //return 2 value that are the 1ª and 2ª position the brush on x coordenate

            if_stat_brush = 1;
            // clear statistical array for filtering  the links
            // (stat-p-value filter)
            stat_links = [];
            // clear array for the statistical p-value filter(SNPs)
            stat_allNodes = []; 

            circle.classed("selected", function(d) {
                return s[0] <= d && d <= s[1];
            }); //selected de circles in x cordenate for diferent vizualization

            d3.select("#two_weight_value").selectAll("h").remove(); //remove the old text
            d3.select("#two_weight_value").selectAll("h") //create the new text
                .data([1])
                .enter().append("h")
                .text(two_dec(s[0]) + " - " + two_dec(s[1]));

            brush_value1 = s[0];

            if (if_zoom) {
                d3.select("#chart").selectAll(".link").transition().style("opacity", 0.3);
            
   
                d3.select("#mainplot").selectAll(".link") 
                    .filter(function(d) {
                        if(d[st_chosen] <= s[0] || d[st_chosen] >= s[1]) {
                            return 1;
                        } else {
                            stat_links.push(d);
                            return 0;
                        }
                    })
                    .transition().style("opacity", 0);

                d3.select("#chart")
                    .selectAll("g .circle_zoom")
                    .transition()
                    .style("opacity", 0);

                //to make all the selected nodes visible 
                var link_selected_stat = [];
                link_selected_stat = nodes_selected(s[0], s[1], zoom_links);

                d3.select("#chart")
                    .selectAll("g .circle_zoom")
                    .filter(function(d, i) {
                        if (include_in_arr(link_selected_stat, d.id)) { // nodes_selected (s[0],s[1]) )
                            stat_allNodes.push(d);
                            return d;
                        }
                    })
                    .transition()
                    .style("opacity", 1);

                
                d3.select("#snps").selectAll("p").remove(); //remove old text

                // Write out the data selected in text 
                d3.select("#snps").selectAll("p")
                    .data(zoom_allNodes)
                    .enter().append("p")
                    .filter(function(d, i) {
                        if (include_in_arr(link_selected_stat, d.id)) { // nodes_selected (s[0],s[1]) )
                            return d;
                        }
                    })
                    .append("link").attr("href", function(d) { 
                        return 'http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position=' + 'chr' +
                            d.chrom + ':' + (d.bp_position - 1000) + '-' + (d.bp_position + 1000);
                    })
                    .attr("target", "_blank")
                    .style("text-decoration", 'none')
                    .style("color", "black")
                    .text(function(d) {
                        return showSnp(d);
                    });

                //brush selecte the pairs 	
                d3.select("#pairs").selectAll("p").remove();

                d3.select("#pairs").selectAll("p")
                    .data(zoom_links)
                    .enter().append("p")
                    .text(function(d) {
                        if (d[st_chosen] >= s[0] && d[st_chosen] <= s[1]) {
                            return showInteract(d.ct_id);
                        } else {
                            return "";
                        }
                    });

            } else {
                d3.select("#chart").selectAll(".link").transition().style("opacity", 0.3);
                // clear statistical array for filtering  the links
                // (stat-p-value filter)
                stat_links = [];
                
                // this declaretion selected the association between specifics  weight values 
                d3.select("#mainplot").selectAll(".link") 
                    .filter(function(d) {
                        if(d[st_chosen] <= s[0] || d[st_chosen] >= s[1]) {
                            return 1;
                        } else {
                            stat_links.push(d);
                            return 0;
                        }
                    })
                    .transition().style("opacity", 0);
                
                d3.select("#chart")
                    .selectAll("g circle")
                    .transition()
                    .style("opacity", 0);

                //to make all the selected nodes visible 
                var link_selected_stat = [];
                link_selected_stat = nodes_selected(s[0], s[1], links);
                // clear array for the statistical p-value filter(SNPs)
                stat_allNodes = []; 

                d3.select("#chart")
                    .selectAll("g circle")
                    .filter(function(d, i) {
                        if (include_in_arr(link_selected_stat, i)) { 
                            stat_allNodes.push(d);
                            return d;
                        }
                    })
                    .transition()
                    .style("opacity", 1);
                    
                                   
                d3.select("#snps").selectAll("p").remove(); //remove old text

                // Write out the data selected in text 
                d3.select("#snps").selectAll("p")
                    .data(allNodes)
                    .enter().append("p")
                    .filter(function(d, i) {
                        if (include_in_arr(link_selected_stat, i)) { 
                            return d;
                        }
                    })
                    .append("link").attr("href", function(d) { 
                        return 'http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position=' + 'chr' +
                            d.chrom + ':' + (d.bp_position - 1000) + '-' + (d.bp_position + 1000);
                    })
                    .attr("target", "_blank")
                    .style("text-decoration", 'none')
                    .style("color", "black")
                    .text(function(d) {
                        return showSnp(d);
                    });

                //brush selecte the pairs 	
                d3.select("#pairs").selectAll("p").remove();

                d3.select("#pairs").selectAll("p")
                    .data(links)
                    .enter().append("p")
                    .text(function(d) {
                        if (d[st_chosen] >= s[0] && d[st_chosen] <= s[1]) {
                            return showInteract(d.ct_id);
                        } else {
                            return "";
                        }
                    });
            }
        }

        function brushend() { //selected de circles in x cordenate for diferent vizualization
            svg_brush.classed("selecting", !d3.event.target.empty());
            // filter for SNPs list
            d3.select("#hds_matrix").selectAll("svg").remove();
            histogram_degree_SNPs(0, 0, 1);

        }

        

};

/**
 * Display the nodes and links for debugging
 */
function showSnp(d) {
    return "id:" + d.id + "  chr" + d.chrom + ':' + d.bp_position + "    " + d.rs + " Subgraph:" +
        d.probe_group;
};

//arc_plot.js
/**
 * @title Implemented linear plot
 * @fileoverview This file creates an arc diagram, which shows the interaction between SNPs. 
 * These links are displayed 
 * through arcs. The 24 Human chromosomes (x and y are included) are plotted as bars in a row on one axis. 
 * @author stefan.sevelda@hotmail.com (Stefan Sevelda)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */

//------------------------------------------   Global variables   ---------------------------------------------- 


//---------------------------------------read json file --------------------------------------

/**
 * Read a .json to initialize the variables and call the function arc_plot() to create the arc plot
 * @param {string} file_name
 */
function read_file_to_arc_plot() {
    //everything needed in arcplot
    file_name_zoom = file_json;

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
    for (var i = 0; i < chrom_acum_length.length; i++) {
        var num = i + 1;
        chr_id.push("chr" + num);
        chr_scale.push(xScale(chrom_acum_length[i]));
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
                        alert("You have not selected a source");         
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
        })
    .on("click" , function(d,i) { return highlight_snp_pairs(d, i);});
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
        .attr("id", "mainplot")
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
    zoom_allNodes = [];
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
        .attr("class", "circle_zoom")
        .style("fill", function(d) {
            return graphColor(d.probe_group);
        })
        .style("stroke", function(d) {
            return graphColor(d.probe_group);
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
    svg.selectAll("g .circle_zoom") 
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
        .on("click" , function(d,i) { return highlight_snp_pairs(d, i);});
   };
 
// arc_view.js
/**
 * @fileoverview The ruling file which start the arc plot, and the zoom function located in the arc_plot.js
 * and the preparation.
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 * @author stefan.sevelda@hotmail.com (Stefan Sevelda)
 */

/* marks for vim editor
 * "'a" --> change otherwise you always have to click the zoom button again to get the selected p-values
 *  displayed on stat-range even
 */




// everything needed in arcplot
function start_arc_plot() {

    // remove the old plot the probe-groups and SNP list
    d3.select("#chart").selectAll('svg').remove();
    d3.select("#hesid").selectAll('svg').remove();
    d3.select("#hds_matrix").selectAll('svg').remove();
        
    // set if_zoom on 0
    if_zoom = 0;
    // load_stat_values
    load_stat_value(); 
    

    // functions in arc_plot.js
    read_file_to_arc_plot();
    select_snp_stat_range(if_zoom);
    graphColor = d3.scale.category10();
    // function in hist_edges_subgraphID_plot.js to start probe-group
    histogram_edges_subgraphId(if_zoom);
    // function in histogram_degree_snps_plot.js to show SNP list
    histogram_degree_SNPs(0, 0, 0);
    // shows the snps pair list
    show_snp_pairs_list(file_json, st_chosen, if_stat_brush, if_zoom, 0);
};

// function to prepair everything for the zoom function of arc_plot
function zoom_arc() {

    // remove the old containers
    d3.select("#hesid").selectAll('svg').remove();
    d3.select("#chart").selectAll('svg').remove();
    d3.select("#pairs").selectAll("p").remove();
    d3.select("body").selectAll('svg').remove();
    d3.select("#two_weight_value").selectAll("h").remove();
    d3.select("#hds_matrix").selectAll('svg').remove();

    // read the zoom parameters
    view_chr = document.getElementById("view_chr").value;
    view_start = document.getElementById("texzs").value;
    view_end = document.getElementById("texze").value;

    // set var to check zoom on 1
    if_zoom = 1;
    
    // zoom-function
    zoom_arc_plot(+view_chr, +view_start, +view_end);
    // empty the array 
    data_weight_pvalue = [];
    // pvalue only of the zoomed links
    zoom_links.forEach( function(d) {
        data_weight_pvalue.push(d[st_chosen])
    });

    // brushweight function for the p_values of the snps
    select_snp_stat_range(if_zoom);

    histogram_degree_SNPs(0, if_zoom, 0);
    histogram_edges_subgraphId(if_zoom);

    show_snp_pairs_list(file_json, st_chosen, if_stat_brush, if_zoom, 0);
};

//function to display the all informaiton of the interaction of SNP
function showInteract(d) {

    str = allNodes[links[d].source].rs + " " +
        "chr" + allNodes[links[d].source].chrom + ':' + allNodes[links[d].source].bp_position + " " +
        allNodes[links[d].target].rs + " " +
        "chr" + allNodes[links[d].target].chrom + ':' + allNodes[links[d].target].bp_position + " "; 

    for (var i in links[d]) {
        if (i != "assoc_group" && i != "ct_id" && i != "source" && i != "target") {
            str = str + i + ": " + links[d][i] + " ";
        }
    }
    return str;
}; 
// circle_plot.js
/**
 * @fileoverview All functions to create the circle plot
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 * @author stefan.sevelda@hotmail.com (Stefan Sevelda)
 */


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

// cir_view.js
/**
 * @fileoverview file to rule the circular ideogram locatede in circle_plot.js
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 * @author stefan.sevelda@hotmail.com (Stefan Sevelda)
 */

//everything needed in arcplot
function start_cir_plot() {

    d3.select("#chart").selectAll('svg').remove();
    d3.select("#hesid").selectAll('svg').remove();
    d3.select("#pairs").selectAll("p").remove();
    d3.select("#hds_matrix").selectAll('svg').remove();
    d3.select("#load_data").remove();
    
   
    // load statistical values
    load_stat_value();
    
    // create cricularplot
    Create_chr_circle(0, 0, 0);
    Create_SNP_association();
    // create group-histogram
    histogram_edges_subgraphId(0);
    // create SNP list
    histogram_degree_SNPs(0, 0, 0);
 };

// function zoom for circular plot
function zoom_circular(){
    // remove old things
    d3.select("#hesid").selectAll('svg').remove();
    d3.select("#scale_bar").selectAll('svg').remove();
    d3.select("#chart").selectAll('svg').remove();
    d3.select("#pairs").selectAll("p").remove();
    d3.select("body").selectAll('svg').remove();
    d3.select("#two_weight_value").selectAll("h").remove();
    d3.select("#hds_matrix").selectAll('svg').remove();

    // read the zoom parameters
    view_chr = document.getElementById("view_chr").value;
    view_start = document.getElementById("texzs").value;
    view_end = document.getElementById("texze").value;
    
    // load statistical values
    load_stat_value();

    // draw zoomed circle "+" converts string to int
    Create_chr_circle(+view_chr, +view_start, +view_end);
    Create_SNP_association();
    histogram_edges_subgraphId();
    // have to store before zoomed SNPs in a variable 
    histogram_degree_SNPs(0, 0, 0); 
};

// genome.js
/**
 * @fileoverview information about each chromosomes
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */




/**
 * Genome object for drawing
 */
function Genome() {
    // return the genome object with the information for drawing the chromosomes circles 

    var genome = {}, //genome = this  !!!
        chromosomes,
        n = 24,
        padding = 0.05,
        small = 0.1;

    var zoom = 0;
    var view_chr = 0,
        view_start = 0,
        view_end = 0;


    // http://www.ncbi.nlm.nih.gov/projects/genome/assembly/grc/human/data/index.shtml
    var chromLength = new Array(249250621, 243199373, 198022430, 191154276,
        180915260, 171115067, 159138663, 146364022,
        141213431, 135534747, 135006516, 133851895,
        115169878, 107349540, 102531392, 90354753,
        81195210, 78077248, 59128983, 63025520,
        48129895, 51304566, 155270560, 59373566);

    function layout() {
        var k,
            x,
            i;

        chromosomes = [];

        // Convert the total number of bases to scaling factor for [0, 2pi].
        k = 0, i = -1;
        while (++i < n) {
            k += chromLength[i];
        }
        k = (2 * Math.PI - padding * n) / k;

        // Compute the start and end angle for each chromosome
        x = 0, i = -1;
        while (++i < n) {
            a0 = x,
            a1 = x += chromLength[i] * k;

            chromosomes[i] = { //array chromosomes with objects content information  
                index: i,
                startAngle: a0,
                endAngle: a1,
                startBase: 0,
                endBase: chromLength[i],
                radPerBase: k,
                totAngle: chromLength[i] * k



            };
            x += padding;
        }
    };

    function layout_zoom() {
        var x, i;

        chromosomes = [];
        i = -1;
        while (++i < n) {
            if (i == view_chr - 1) {
                chromosomes[i] = {
                    index: view_chr - 1,
                    startAngle: 1.5 * small + 2 * padding,
                    endAngle: 2 * Math.PI - 1.5 * small - 2 * padding,
                    startBase: view_start,
                    endBase: view_end,
                    radPerBase: (2 * Math.PI - 4 * padding - 3 * small) / (view_end - view_start),
                    totAngle: 2 * Math.PI - 4 * padding - 3 * small
                };
                // upstream of zoom area
                chromosomes[n] = {
                    index: view_chr - 1,
                    startAngle: 0.5 * small + padding,
                    endAngle: 1.5 * small + padding,
                    startBase: 0,
                    endBase: view_start,
                    radPerBase: small / view_start,
                    totAngle: small
                };
                // downstream of zoom area
                chromosomes[n + 1] = {
                    index: view_chr - 1,
                    startAngle: 2 * Math.PI - 1.5 * small - padding,
                    endAngle: 2 * Math.PI - 0.5 * small - padding,
                    startBase: view_end,
                    endBase: chromLength[i],
                    radPerBase: small / (chromLength[i] - view_end),
                    totAngle: small
                };
            } else {
                chromosomes[i] = {
                    index: n,
                    startAngle: -0.5 * small,
                    endAngle: 0.5 * small,
                    startBase: 0,
                    endBase: chromLength[i],
                    radPerBase: small / chromLength[i],
                    totAngle: small
                };
            };
        };
    };


    genome.set_zoom = function(c, s, e) {
        view_chr = c;
        view_start = s;
        view_end = e;
        if (view_chr == 0) {
            zoom = 0;
            layout();
        } else {
            zoom = 1;
            layout_zoom();
        };
    };

    genome.chromosomes = function() {
        if (!chromosomes) { //ensures that array chromosomes will not be returned empty
            if (zoom == 0) {
                layout();
            } else {
                layout_zoom();
            };
        };
        return chromosomes;
    };

    genome.getAngle = function(chrom, bpPosition) {
        if (!chromosomes) { //ensures that array chromosomes will not be returned empty
            if (zoom == 0) {
                layout();
            } else {
                layout_zoom();
            };
        };
        if (chrom != view_chr) {
            circ_loc = chromosomes[chrom - 1].startAngle + ((bpPosition - chromosomes[chrom - 1].startBase) * chromosomes[chrom - 1].radPerBase);
        } else {
            if (bpPosition < view_start) {
                circ_loc = chromosomes[n].startAngle + ((bpPosition - chromosomes[n].startBase) * chromosomes[n].radPerBase);
            } else if (bpPosition > view_end) {
                circ_loc = chromosomes[n + 1].startAngle + ((bpPosition - chromosomes[n + 1].startBase) * chromosomes[n + 1].radPerBase);
            } else {
                circ_loc = chromosomes[chrom - 1].startAngle + ((bpPosition - chromosomes[chrom - 1].startBase) * chromosomes[chrom - 1].radPerBase);
            };
        };
        return circ_loc;
    };

    return genome;
};

// heat_map.js
/**
 * @fileoverview Ruling file for heat-map matrix_plot  
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 * @author stefan.sevelda@hotmail.com (Stefan Sevelda)
 */

//------------------------------------------   Global variable   ---------------------------------------------- 
/* global variable for statistical test for the colourscale of the heat-map
 * @type int st_chosen_colourscale1
 */
var st_chosen_colourscale1;
/* global variable for statistical test for the colourscale of the heat-map
 * @type int st_chosen_colourscale2
 */
var st_chosen_colourscale2;
/**
 * Global variable that is used in view_graph.js. It will be used to get the information about of the statistical test choosen.
 * @type {d3} select_dropbox_scale1
 */
var select_dropbox_scale1;
/**
 * Global variable that is used in view_graph.js. It will be used to get the information about of the statistical test choosen.
 * @type {d3} select_dropbox_scale2
 */
var select_dropbox_scale2;
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Global variable ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 

// start heat map plot
function start_heat_map(file_name) {
    // write file name in the global var file_json
    file_json = file_name; 
    // Heat map of association matrix
    d3.select("#load_data").remove();
    d3.select("#hds_matrix").selectAll('svg').remove();
    d3.select("#hds_matrix").selectAll('svg').remove();
    d3.select("#table_snps").selectAll('table').remove();
    d3.select("#chart").selectAll('svg').remove();
    d3.select("#minmap_matrixp").selectAll('svg').remove();
    d3.select("#container_matrix").remove();
    
    // create the container for the statistical bars under the plot
    create_stat_container_mat();

    // load the statistical values of the heat-map
    load_stat_value_mat(file_json);
    // start plot matrix_plot.js
    read_file_to_matrix_plot(file_json);
    // list the SNPs
    histogram_degree_SNPs(0, 0, 0);
    // list the links
    show_snp_pairs_list(file_json, st_chosen_colourscale1, 0, if_zoom, 0);
}
function zoom_heatmap(file_name) {
    // write file name in the global var file_json
    file_json = file_name;
    // Heat map of association matrix
    d3.select("#chart").selectAll('svg').remove();
    d3.select("#minmap_matrixp").selectAll('svg').remove();
    d3.select("#container_matrix").remove();
    
    // create bar container under the plot
    create_stat_container_mat();
    
        // list the SNPs
   

    if (mx_1) { // if x_1 is not null make ..
        matrix_plot(mx_1, mx_2, my_1, my_2);
        matrix_plot_minmap(mix_1, mix_2, miy_1, miy_2, mx_1, my_1, mx_2 - mx_1, my_2);
    } else {
        matrix_plot(mix_1, mix_2, miy_1, miy_2);
    }
}; 

// function to load the stattistical values of the links
function load_stat_value_mat(file_json) {
    // remove old statistical values
    data_weight_pvalue = [];
    
    // remove the optional statistical test if you select a new plot
    statOptions = [];
    // load data from json file
    d3.json(file_json, function(json) {
        links = json.links;
        //for loop to get all available statistical test of the dataset
        for (var i in json.links[0]) {
            if (i != "assoc_group" && i != "source" && i != "target" && i != "probe_group" && i != "ct_id") {
                statOptions[i] = i;
                st_1.push(i);  
            }
        }
        //the first element to be visualited
        st_chosen_colourscale1 = st_1[0];
        st_chosen_colourscale2 = st_1[0];
        //function located SNP_pairs_list.js to create list of links
        show_snp_pairs_list(file_json, st_chosen_colourscale1, 0, 0, 0);
        
        // to create the available statistical test of the dataset located view_graph.js (l.421)
        creat_drop_box_man("drop_sort");

        // to create the available statistical test of the dataset located view_graph.js (l.421)
        creat_drop_box_man("scalecolor1_dropbox");
        // to create the dropbox in the SNP pair list
        creat_drop_box_man("scalecolor2_dropbox");
    });
}
/**
 * Create the dropbox statistical test to circle plot and manhattan plot
 * @param {string} classinput is a name to create um class
 */
function creat_drop_box_man(classinput) {
    d3.select("#" + classinput).selectAll('select').remove();
    // create the select element
    switch(classinput) {
        case "st_select_snp_pairs":
            select_dropbox_sort = d3.select("#" + classinput).append("select")
                .attr("id", "drop_sort");
            // create the options
            select_dropbox_sort.selectAll("option")
                .data(d3.keys(statOptions))
                .enter().append("option")
                .text(function(d) {
                    return d;
                });
            // add values to the options
            select_dropbox.selectAll("option")
                .data(d3.values(statOptions))
                .attr("value", function(d) {
                    return d;
                });
            // select the Statistical test of the dropbox and scales the axis 
            d3.select("#drop_sort").on("change",  function() {
                st_chosen = this.value;
                d3.select("#pairs").selectAll("p").remove();
                show_snp_pairs_list(file_json, st_chosen, 0, 0, 0);
            });             
            break;

        case "scalecolor1_dropbox":
            // create the select element
            select_dropbox_scale1 = d3.select("#" + classinput).append("select")
                .attr("id", "colour_scale1");
            // create the options
            select_dropbox_scale1.selectAll("option").data(d3.keys(statOptions)).enter().append("option").text(function(d) {
                return d;
            });
            // add values to the options
            select_dropbox_scale1.selectAll("option").data(d3.values(statOptions)).attr("value", function(d) {
                return d;
            });

            // select the Statistical test of the dropbox and scales the axis 
            d3.select("#colour_scale1").on("change",  function() {
                st_chosen_colourscale1 = this.value;
                
                d3.select("#scalecolor_matrix1").selectAll('svg').remove();
                d3.select("#scalecolor_matrix2").selectAll('svg').remove();
                d3.select("#minmap_matrixp").selectAll('svg').remove();
                d3.select("#chart").selectAll('svg').remove();
                read_file_to_matrix_plot(file_json);
            });             
            break;

         case "scalecolor2_dropbox":
            // create the select element
            select_dropbox_scale2 = d3.select("#" + classinput).append("select")
                .attr("id", "colour_scale2");
            // create the options
            select_dropbox_scale2.selectAll("option").data(d3.keys(statOptions)).enter().append("option").text(function(d) {
                return d;
            });
            // add values to the options
            select_dropbox_scale2.selectAll("option").data(d3.values(statOptions)).attr("value", function(d) {
                return d;
            });
            
            // select the Statistical test of the dropbox and scales the axis 
            d3.select("#colour_scale2").on("change",  function() {
                st_chosen_colourscale2 = this.value;
                d3.select("#scalecolor_matrix1").selectAll('svg').remove();
                d3.select("#scalecolor_matrix2").selectAll('svg').remove();
                d3.select("#minmap_matrixp").selectAll('svg').remove();
                d3.select("#chart").selectAll('svg').remove();
                read_file_to_matrix_plot(file_json);
            });             
            break;
        }
}

// create container for heatmap
function create_stat_container_mat() {
    // creat new div for matrix
    var scale_mat_con = d3.select("#container").append("div")
        .attr("id", "container_matrix");

    scale_mat_con.append("h5")
        .attr("id", "up")
        .text("Upper Right");

    scale_mat_con.append("div")
        .attr("id", "scalecolor1_dropbox");

    scale_mat_con.append("h5")
        .attr("id", "ll")
        .text("Lower Left");
    
    scale_mat_con.append("div")
        .attr("id", "scalecolor2_dropbox");
   
    scale_mat_con.append("div")
        .attr("id", "scalecolor_matrix1");

    scale_mat_con.append("div")
        .attr("id", "scalecolor_matrix2");

};

// matrix_plot.js
/**
 * @fileoverview All functions and variables to create the Matrix plot
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */

/**
 * Global variable only for matrix_plot.js.
 * @type {array} data_obj_m
 */
var data_obj_m = [];
/**
 * Global variable only for matrix_plot.js.
 * @type {array} array_SNPs
 */
var array_SNPs = [];
/**
 * Read a .json to inicialaze the variables and call the function matrix_plot() to craete the matrix plot
 * @param {string} file_name
 */
function read_file_to_matrix_plot(file_name) {
    //this function read a .json to inicialaze the variables and call the function matrix_plot() to craete the matrix plot
    allNodes = new Array(); 
    var dic_chr = {};
    var n_idx = 0;
    data_obj_m = [];
    array_SNPs = [];
    d3.json(file_name, function(json) {
        json.nodes.forEach(
            function(d) {
                allNodes.push(d)
                array_SNPs.push("chr" + d.chrom + ':' + d.bp_position)
                dic_chr["chr" + d.chrom + ':' + d.bp_position] = n_idx
                n_idx++
            });
        json.links.forEach(
            function(d) {
                var obj = {};
                // temporary variable
                var temp;
                // check to place the points on the correct side of the diagonal  
                if(d.source > d.target) {
                    temp = d.target;
                    d.target = d.source;
                    d.source = temp;
                }
                obj["label_x"] = dic_chr["chr" + allNodes[d.source].chrom + ':' + allNodes[d.source].bp_position];
                obj["label_y"] = dic_chr["chr" + allNodes[d.target].chrom + ':' + allNodes[d.target].bp_position];
                for (var i in d) {
                    if (i != "assoc_group" &&  i != "source" && i != "target" && i != "probe_group") {
                        obj[i] = d[i]
                    }
                }
                data_obj_m.push(obj);
            });

        function creat_obj(labelx, labely) { //não preciso mais disso
            var obj = {};
            obj.label_x = labelx;
            obj.label_y = labely;
            return obj;
        }

        mix_1 = 0;
        mix_2 = array_SNPs.length - 1;
        miy_1 = 0;
        miy_2 = array_SNPs.length - 1;

        matrix_plot_minmap(mix_1, mix_2, miy_1, miy_2, 0, 0, 0, 0)
        matrix_plot(mix_1, mix_2, miy_1, miy_2)
    });
}

/**
 * creat the matrix plot and do the zoom from x1, x2, y1, y2 values.
 * @param {number} x1
 * @param {number} x2
 * @param {number} y1
 * @param {number} y2
 */
function matrix_plot(x1, x2, y1, y2) {
    // this function create the matrix show each SNPs association
    //--------------------------- create color scale  --------------------------------------------------
    var margin_s = {
        top: 5,
        right: 40,
        bottom: 35,
        left: 10
    };
    //Then define width and height as the inner dimensions of the chart area.
    var w_scale_bar = 500 - margin_s.left - margin_s.right;
    var h_scale_bar = 65 - margin_s.top - margin_s.bottom;
    var barPadding = 0;

    function range_to_bar_min2max(min, max) {
        var array = [];
        for (var i = min; i <= max; i = i + (max / (max * 100))) {
            array.push(i);
        }
        return array;
    }


    function range_to_bar(st) {
        var array = [];
        for (i in data_obj_m) {
            array.push(data_obj_m[i][st]);
        }
        return array;
    }

    function minmaxst(st) {
        //get the min and max p-value between all statistical test
        var array = [];
        var array_ret = [];

        for (i in st) {
            array.push(d3.min(data_obj_m, function(d) {
                return d[st[i]];
            }));
        }
        array_ret.push(d3.min(array))
        array = [];
        for (i in st) {
            array.push(d3.max(data_obj_m, function(d) {
                return d[st[i]];
            }));
        }
        array_ret.push(d3.max(array))
        array = [];

        return array_ret;
    }

    var dataset_mat1 = range_to_bar_min2max(d3.round(d3.min(data_obj_m, function(d) {
            return d[st_chosen_colourscale1];
        })),
        d3.round(d3.max(data_obj_m, function(d) {
            return d[st_chosen_colourscale1];
        })));
    var dataset_mat2 = range_to_bar_min2max(d3.round(d3.min(data_obj_m, function(d) {
            return d[st_chosen_colourscale2];
        })),
        d3.round(d3.max(data_obj_m, function(d) {
            return d[st_chosen_colourscale2];
        })));
    
    var colorScale1 = d3.scale.linear() //yellow - red
        .domain([d3.min(data_obj_m, function(d) {
            return d[st_chosen_colourscale1];
        }), d3.max(data_obj_m, function(d) {
            return d[st_chosen_colourscale1];
        })])
        .interpolate(d3.interpolateHsl)
        .range(["#E4DB00", "#F31300"]); //http://tributary.io/tributary/3650755/

    var colorScale2 = d3.scale.linear() //lightblue - blue
        .domain([d3.min(data_obj_m, function(d) {
            return d[st_chosen_colourscale2];
        }), d3.max(data_obj_m, function(d) {
            return d[st_chosen_colourscale2];
        })])
        .interpolate(d3.interpolateHsl)
        .range(["#00E4DB", "#2E00E7"]);

    //Create SVG element to receive the scale color bar
    var svg_scb1 = d3.select("#scalecolor_matrix1")
        .append("svg")
        .attr("width", w_scale_bar + margin_s.left + margin_s.right)
        .attr("height", h_scale_bar + margin_s.top + margin_s.bottom)
        .append("g")
        .attr("transform", "translate(" + margin_s.left + "," + margin_s.top + ")");

    svg_scb1.selectAll("rect") //create color scale bar
        .data(dataset_mat1)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return i * (w_scale_bar / dataset_mat1.length);
        })
        .attr("y", 0)
        .attr("width", w_scale_bar / dataset_mat1.length - barPadding)
        .attr("height", h_scale_bar)
        .attr("fill", function(d, i) {
            return colorScale1(d);
        });

    svg_scb1.selectAll(".text_smp")
        .data(dataset_mat1)
        .enter()
        .append("text")
        .attr("class", "text_smp")
        .text(function(d, i) {
            number_tick = 6;
            ld = dataset_mat1.length;
            ad = [0, ld / 4, ld / 2, ld / 2 + ld / 4, ld - 1];
            for (v in ad) {
                if (i == d3.round(ad[v])) {
                    return two_dec(d);
                }
            }
        })
        .attr("x", function(d, i) {
            return (i + 0) * (w_scale_bar / dataset_mat1.length);
        })
        .attr("y", 40)
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("fill", function(d) {
            return colorScale1(d);
        });

    var svg_scb2 = d3.select("#scalecolor_matrix2")
        .append("svg")
        .attr("width", w_scale_bar + margin_s.left + margin_s.right)
        .attr("height", h_scale_bar + margin_s.top + margin_s.bottom)
        .append("g")
        .attr("transform", "translate(" + margin_s.left + "," + margin_s.top + ")");

    svg_scb2.selectAll("rect") //create color scale bar
        .data(dataset_mat2)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return i * (w_scale_bar / dataset_mat2.length);
        })
        .attr("y", 0)
        .attr("width", w_scale_bar / dataset_mat2.length - barPadding)
        .attr("height", h_scale_bar)
        .attr("fill", function(d, i) {
            return colorScale2(d);
        });

    svg_scb2.selectAll(".text_smp")
        .data(dataset_mat2)
        .enter()
        .append("text")
        .attr("class", "text_smp")
        .text(function(d, i) {
            number_tick = 6;
            ld = dataset_mat2.length
            ad = [0, ld / 4, ld / 2, ld / 2 + ld / 4, ld - 1]
            for (v in ad) {
                if (i == d3.round(ad[v])) {
                    return two_dec(d);
                }
            }
        })
        .attr("x", function(d, i) {
            return (i + 0) * (w_scale_bar / dataset_mat2.length);
        })
        .attr("y", 40)
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("fill", function(d) {
            return colorScale2(d);
        });
    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   create color scale  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^			

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    },
    
    width = 700 - margin.left - margin.right, //900
    height = 700 - margin.top - margin.bottom; //900

    var x = d3.scale.linear().domain([x1, x2]) //[0,array_SNPs.length])
        .range([0, width]);

    var y = d3.scale.linear().domain([y1, y2]) //[0,array_SNPs.length])	
        .range([0, width]);

    var x_inv = d3.scale.ordinal().domain([0, width])
        .range(array_SNPs);

    var y_inv = d3.scale.ordinal().domain([0, width])
        .range(array_SNPs);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var xAxis2 = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis2 = d3.svg.axis()
        .scale(y)
        .orient("right");

    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var path_matrix1 = svg.selectAll("path1")
        .data(data_obj_m)
        .enter().append("svg:path")
        .style("fill", function(d) {
            return colorScale2(d[st_chosen_colourscale2]);
        })
        .attr("transform", function(d) {
            return "translate(" + x(d.label_x) + "," + y(d.label_y) + ")";
        })
        .attr("d", d3.svg.symbol().type("square").size("30"));

     var path_matrix2 = svg.selectAll("path2")
        .data(data_obj_m)
        .enter().append("svg:path")
        .style("fill", function(d) {
            return colorScale1(d[st_chosen_colourscale1]);
        })
        .attr("transform", function(d) {
            return "translate(" + x(d.label_y) + "," + y(d.label_x) + ")";
        })
        .attr("d", d3.svg.symbol().type("square").size("30"));

    svg.append("g")
        .attr("class", "xmataxis")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", 500)
        .attr("y", -30)
        .attr("font-size", "17px")
        .style("text-anchor", "end")
        .text("SNP id");
   
    svg.append("g")
        .attr("class", "ymataxis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", -400)
        .attr("y", -45)
        .attr("dy", ".71em")
        .attr("font-size", "17px")
        .style("text-anchor", "end")
        .text("SNP id");

    svg.append("g")
        .attr("class", "xmataxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis2);

    svg.append("g")
        .attr("class", "ymataxis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxis2);

    svg.append("g")
        .attr("class", "brush")
        .call(d3.svg.brush().x(x).y(y)
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend));

    function brushstart() {
        svg.classed("selecting", true);
    }

    function brushmove() {
        var e = d3.event.target.extent();
        zoom_allNodes = [];
        zoom_links = [];

        path_matrix1.classed("selected", function(d, i) { 
            if (e[0][0] <= d.label_x && d.label_x <= e[1][0] && e[0][1] <= d.label_y && d.label_y <=
                e[1][1]) {
                    // store the zoomed links and the involved SNPs in an array for
                    // filtering the SNPs list
                    zoom_allNodes.push(allNodes[d.label_x]); 
                    zoom_allNodes.push(allNodes[d.label_y]); 
                    // store the zoomed links in an array for the SNPs pair list 
                    zoom_links.push(links[d.ct_id]);
                }
            });

        path_matrix2.classed("selected", function(d, i) { 
            if (e[0][0] <= d.label_y && d.label_y <= e[1][0] && e[0][1] <= d.label_x && d.label_x <=
                e[1][1]) {
                    // store the zoomed links and the involved SNPs in an array for
                    // filtering the SNPs list
                    zoom_allNodes.push(allNodes[d.label_x]); 
                    zoom_allNodes.push(allNodes[d.label_y]); 
                    // store the zoomed links in an array for the SNPs pair list and test if
                    // the SNPs pair is already selected in path_matrix1
                    var zoom_links_check = zoom_links.map(function (v) {
                        return v.ct_id;
                    });
                    if(!zoom_links_check.some(function (g) { return d.ct_id == g; })) {
                        zoom_links.push(links[d.ct_id]);
                    }
                }
            });
        mx_1 = e[0][0];
        mx_2 = e[1][0];
        my_1 = e[0][1];
        my_2 = e[1][1];

        d3.select("#two_weight_value_test").selectAll("h").remove(); //remove the old text
        d3.select("#two_weight_value_test").selectAll("h") //create the new text
            .data([1])
            .enter().append("h")
            .text((mx_1) + " - " + (mx_2) + " - " + (my_1) + " - " + (my_2));
    }

    function brushend() {
        svg.classed("selecting", !d3.event.target.empty());
        // call the SNPs list
        d3.select("#hds_matrix").selectAll("svg").remove();
        histogram_degree_SNPs(0, 1, 0);
        // call the SNPs pair list 
        d3.select("#pairs").selectAll("p").remove();
        show_snp_pairs_list(file_json, 0, if_stat_brush, if_zoom, 0);
    }
}

/**
 * this function create the minimap from matrix that show all SNPs association and do the zoom from x1, x2, y1, y2 values.
 * If mrect_x1, mrect_y1, mrect_x2, mrect_y2 are diferent from zero (0) this create a rectangle
 * to help a see the location of the zoom.
 * @param {number} x1
 * @param {number} x2
 * @param {number} y1
 * @param {number} y2
 * @param {number} mrect_x1
 * @param {number} mrect_x2
 * @param {number} mrect_y1
 * @param {number} mrect_y2
 * @param {array} data
 */
function matrix_plot_minmap(x1, x2, y1, y2, mrect_x1, mrect_y1, mrect_x2, mrect_y2) {
    // this function create the minimap from matrix that show all SNPs association

    var margin = {
        top: 100,
        right: 100,
        bottom: 100,
        left: 100
    },

    width = 450 - margin.left - margin.right, //500
    height = 450 - margin.top - margin.bottom; //200

    var x = d3.scale.linear().domain([x1, x2]) 
        .range([0, width]);

    var y = d3.scale.linear().domain([y1, y2])
        .range([0, width]);

    var x_inv = d3.scale.ordinal().domain([0, width])
        .range(array_SNPs);

    var y_inv = d3.scale.ordinal().domain([0, width])
        .range(array_SNPs);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var xAxis2 = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis2 = d3.svg.axis()
        .scale(y)
        .orient("right");

    var svg = d3.select("#minmap_matrixp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var colorScale1 = d3.scale.linear() //yellow - red
        .domain([d3.min(data_obj_m, function(d) {
            return d[st_chosen_colourscale1];
        }), d3.max(data_obj_m, function(d) {
            return d[st_chosen_colourscale1];
        })])
        .interpolate(d3.interpolateHsl)
        .range(["#E4DB00", "#F31300"]); //http://tributary.io/tributary/3650755/

    var colorScale2 = d3.scale.linear() //lightblue - blue
        .domain([d3.min(data_obj_m, function(d) {
            return d[st_chosen_colourscale2];
        }), d3.max(data_obj_m, function(d) {
            return d[st_chosen_colourscale2];
        })])
        .interpolate(d3.interpolateHsl)
        .range(["#00E4DB", "#2E00E7"]);

    svg.selectAll("path1")
        .data(data_obj_m)
        .enter().append("svg:path")
        .style("fill", function(d) {
            return colorScale2(d[st_chosen_colourscale2]);
        })
        .attr("transform", function(d) {
            return "translate(" + x(d.label_x) + "," + y(d.label_y) + ")";
        })
        .attr("d", d3.svg.symbol().type("square").size("5"));

    svg.selectAll("path2")
        .data(data_obj_m)
        .enter().append("svg:path")
        .style("fill", function(d) {
            return colorScale1(d[st_chosen_colourscale1]);
        })
        .attr("transform", function(d) {
            return "translate(" + x(d.label_y) + "," + y(d.label_x) + ")";
        })
        .attr("d", d3.svg.symbol().type("square").size("5"));

    if (mrect_x1 != 0 && mrect_y1 != 0 && mrect_x2 != 0 && mrect_y2 != 0) {
        svg.selectAll("rect") //create color scale bar
            .data([0])
            .enter()
            .append("rect")
            .attr("x", x(mrect_x1))
            .attr("y", y(mrect_y1))
            .attr("width", x(mrect_x2))
            .attr("height", y(mrect_y2) - y(mrect_y1)) //  yScale(rect_y2)-yScale(rect_y1) rgb(0,0,255) "rgba(255, 255, 0, 0.1)"
            .attr("fill", "rgba(255, 0, 0, 0.1)")
            .attr("stroke", "rgba(255, 0, 0, 1)")
            .attr("stroke-width", "5");
    }

    svg.append("g")
        .attr("class", "xmataxis")
        .attr("transform", "translate(0," + 0 + ")")
        .call(xAxis);

    svg.selectAll(".xmataxis text") // select all the text elements for the xaxis
        .attr("transform", function(d) {
            return "translate(" + this.getBBox().height * 1 + "," + this.getBBox().height * -1.5 + ")rotate(-90)";
        });

    svg.append("g")
        .attr("class", "ymataxis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", -75)
        .attr("y", -55)
        .attr("dy", ".71em")
        .attr("font-size", "17px")
        .style("text-anchor", "end")
        .text("SNP id");

    svg.append("g")
        .attr("class", "xmataxis2")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis2);

    svg.selectAll(".xmataxis2 text") // select all the text elements for the xaxis
        .attr("transform", function(d) {
            return "translate(" + this.getBBox().height * 1 + "," + this.getBBox().height * 1.5 + ")rotate(90)";
        });

    svg.append("g")
        .attr("class", "ymataxis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxis2)
}
// mangraph.js
/**
 * @fileoverview Ruling file for the manhattan plot
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 * @author stefan.sevelda@hotmail.com (Stefan Sevelda)
 */

// marks :
// a: creat_dropbox to chose the statistical test
//------------------------------------------   Global variable   ---------------------------------------------- 
/**
 * Global variables for manhattan_plot.js and view_graph.js hindle to create the manhattan plot 
 * with the initial dots.
 * @type {number} ix_1, ix_2, iy_1, iy_2
 */
var ix_1, ix_2, iy_1, iy_2;
/**
 * Global variables for manhattan_plot.js and view_graph.js hindle to create the manhattan
 * plot with specifcs dots selected by brush.
 * @type {number} x_1, x_2, y_1, y_2
 */
var x_1, x_2, y_1, y_2;

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Global variable ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 

//------------------------------------------ load -  first vizualization   ---------------------------------------------- 
function start_manhattan_plot(file_name) {
    // store the file name in the global var file_json
    file_json = file_name; 

    d3.select("#hds_matrix").selectAll('svg').remove();
    d3.select("#table_snps").selectAll('table').remove();
    d3.select("#load_data").remove();
    
    // create container needed in the manhattan plot
    create_container_manhattan();
    create_label_button();
    // load statistical values
    load_stat_value(file_json);
    // start manhattan plot
    read_file_to_manhattan_plot(file_json);
    // SNP list
    histogram_degree_SNPs(file_json, 0, 0, 0);
    // SNP links
    show_snp_pairs_list(file_json, st_chosen, 0, 0, 0);
}
 
// function for the zoom of the manhattan plot
function zoom_manhattan(file_name) {
    
    if (data_from_HDS === "no") {
        d3.select("#chart").selectAll('svg').remove();
        d3.select("#scale_bar").selectAll('svg').remove();

        if (x_1) { // if x_1 is not null make ..
            manhattan_plot(x_1, x_2, y_1, y_2, data);
            d3.select("#minmap_mp").selectAll('svg').remove();
            manhattan_plot_minmap(ix_1, ix_2, iy_1, iy_2, x_1, y_2, x_2 - x_1, y_1, data)
        } else {
            manhattan_plot(ix_1, ix_2, iy_1, iy_2, data);
        };
    } else {
        d3.select("#chart").selectAll('svg').remove();
        d3.select("#scale_bar").selectAll('svg').remove();

        if (x_1) { // if x_1 is not null make ..
            manhattan_plot(x_1, x_2, y_1, y_2, data_select_from_HDS);
            d3.select("#minmap_mp").selectAll('svg').remove();
            manhattan_plot_minmap(ix_1, ix_2, iy_1, iy_2, x_1, y_2, x_2 - x_1, y_1, data_select_from_HDS)
        } else {
            manhattan_plot(ix_1, ix_2, iy_1, iy_2, data_select_from_HDS);
        };
    };

};

/* 
 * create the labelbutton and unlabelbutton for manhattan plot
 */
function create_label_button() {
    // remove the container
    d3.select("#butpl").remove();
    d3.select("#butrl").remove();

    // create label on button 
    d3.select("#control_buttons").append("button")
        .attr("type", "button")
        .attr("id", "butpl")
        .attr("name", "but_put_label")
        .text("label")
        .on("click", function change() { //button LABEL

            d3.select("#chart").selectAll('svg').remove();
            d3.select("#scale_bar").selectAll('svg').remove();
            d3.select("#minmap_mp").selectAll('svg').remove();


            if (data_from_HDS === "no") {

                if (x_1) { // if x_1 is not null make ..
                    manhattan_plot(x_1, x_2, y_1, y_2, data);
                    manhattan_plot_minmap(ix_1, ix_2, iy_1, iy_2, x_1, y_2, x_2 - x_1, y_1, data)
                } else {
                    manhattan_plot(ix_1, ix_2, iy_1, iy_2, data);
                    manhattan_plot_minmap(ix_1, ix_2, iy_1, iy_2, x_1, y_2, x_2 - x_1, y_1, data)
                }

            } else {


                if (x_1) { // if x_1 is not null make ..
                    manhattan_plot(x_1, x_2, y_1, y_2, data_select_from_HDS);
                    manhattan_plot_minmap(ix_1, ix_2, iy_1, iy_2, x_1, y_2, x_2 - x_1, y_1, data_select_from_HDS)
                } else {
                    manhattan_plot(ix_1, ix_2, iy_1, iy_2, data_select_from_HDS);
                    manhattan_plot_minmap(ix_1, ix_2, iy_1, iy_2, x_1, y_2, x_2 - x_1, y_1, data_select_from_HDS)
                }
            }
            label_text.transition().style("opacity", 1);

        });

    // create label off button
    d3.select("#control_buttons").append("button")
        .attr("type", "button")
        .attr("id", "butrl")
        .attr("name", "but_put_label")
        .text("remove_label")
        .on("click", function change() { //button REMOVE LABEL	

            d3.select("#chart").selectAll('svg').remove();
            d3.select("#scale_bar").selectAll('svg').remove();
            d3.select("#minmap_mp").selectAll('svg').remove();

            if (data_from_HDS === "no") {

                if (x_1) { // if x_1 is not null make ..
                    manhattan_plot(x_1, x_2, y_1, y_2, data);
                    manhattan_plot_minmap(ix_1, ix_2, iy_1, iy_2, x_1, y_2, x_2 - x_1, y_1, data)
                } else {
                    manhattan_plot(ix_1, ix_2, iy_1, iy_2, data);
                    manhattan_plot_minmap(ix_1, ix_2, iy_1, iy_2, x_1, y_2, x_2 - x_1, y_1, data)
                }
            } else {


                if (x_1) { // if x_1 is not null make ..
                    manhattan_plot(x_1, x_2, y_1, y_2, data_select_from_HDS);
                    manhattan_plot_minmap(ix_1, ix_2, iy_1, iy_2, x_1, y_2, x_2 - x_1, y_1, data_select_from_HDS)
                } else {
                    manhattan_plot(ix_1, ix_2, iy_1, iy_2, data_select_from_HDS);
                    manhattan_plot_minmap(ix_1, ix_2, iy_1, iy_2, x_1, y_2, x_2 - x_1, y_1, data_select_from_HDS)
                }
            }
            label_text.transition().style("opacity", 0);
        });

}

// int this section we create the needed containers for the manhattan plot
function create_container_manhattan() {
    // remove container 
    d3.select("#scale_bar").remove();
    // create container
    d3.select("#container").append("div")
        .attr("id", "scale_bar");
};

// manhattan_plot.js
/**
 * @fileoverview All functions and variables to create the Manhattan plot
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */

//------------------------------------------   Global variables   ---------------------------------------------- 

/**
 * Global variable only for manhattan_plot.js to create the scale in manhattan plot.
 * @type {number} chrom_lenght
 */
var chrom_lenght = 0;
/**
 * Global variable only for manhattan_plot.js to create the scale in manhattan plot.
 * @type {array} chrom_acum_length
 */
var chrom_acum_length = new Array();
/**
 * Constant only for manhattan_plot.js to create the scale in manhattan plot.
 * @const
 * @type {array} chromLength
 */
var chromLength = new Array(249250621, 243199373, 198022430, 191154276,
    180915260, 171115067, 159138663, 146364022,
    141213431, 135534747, 135006516, 133851895,
    115169878, 107349540, 102531392, 90354753,
    81195210, 78077248, 59128983, 63025520,
    48129895, 51304566, 155270560, 59373566);

//this initializes chrom_lenght and chrom_acum_length to be used in manhattan plot
for (var i = 0; i < chromLength.length; i++) {
    chrom_lenght = chrom_lenght + chromLength[i];
    chrom_acum_length.push(chrom_lenght);
}

var temp_man = new Array();

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Global variables ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 

//---------------------------------------read json file --------------------------------------

/**
 * Read a .json to inicialaze the variables and call the function manhattan_plot() to craete the manhattan plot
 * @param {string} file_name
 */
function read_file_to_manhattan_plot(file_name) {
    data = new Array();
    allNodes = new Array();
    var data_weight_pvalue = new Array();

    d3.json(file_name, function(json) {

        links.forEach(
            function(d) { //this will fill with data the array
                data_weight_pvalue.push(d[st_chosen]);
                if (allNodes[d.source].chrom === 1) { //"chr"+d.chrom+':'+d.bp_position
                    data.push([allNodes[d.source].bp_position, d[st_chosen], allNodes[d.source].degree, "chr" +
                        allNodes[d.source].chrom + ':' + allNodes[d.source].bp_position, d.source]);
                } else {
                    data.push([allNodes[d.source].bp_position + chrom_acum_length[allNodes[d.source].chrom - 2],
                        d[st_chosen], allNodes[d.source].degree, "chr" + allNodes[d.source].chrom + ':' +
                        allNodes[d.source].bp_position, d.source] );
                }
                if (allNodes[d.target].chrom === 1) {
                    data.push([allNodes[d.target].bp_position, d[st_chosen], allNodes[d.target].degree, "chr" +
                        allNodes[d.target].chrom + ':' + allNodes[d.target].bp_position, d.target]);
                } else {
                    data.push([allNodes[d.target].bp_position + chrom_acum_length[allNodes[d.target].chrom - 2],
                        d[st_chosen], allNodes[d.target].degree, "chr" + allNodes[d.target].chrom + ':' +
                        allNodes[d.target].bp_position, d.target]);
                }
            });
        //var for maximum and minimum value of p-values from the dataset 
        var min_pvalue = d3.min(data_weight_pvalue, function(d) {
            return d;
        });
        var max_pvalue = d3.max(data_weight_pvalue, function(d) {
            return d;
        });
        // var which defined the extra space in the bottom and the top of the -log(p-value) axis dynamically to the dataset
        var extend_scale = (max_pvalue - min_pvalue) *0.05;
        
        ix_1 = 0;
        ix_2 = chrom_lenght;
        iy_1 = min_pvalue - extend_scale;
        iy_2 = max_pvalue + extend_scale;

        data_from_HDS = "no"
        manhattan_plot_minmap(ix_1, ix_2, iy_1, iy_2, 0, 0, 0, 0, data);
        manhattan_plot(ix_1, ix_2, iy_1, iy_2, data);
    });
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ read json file ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//------------------------------------- create manhattan plot ---------------------------------------

/**
 * creat the manhataan plot from the dots in data and do the zoom from x1, x2, y1, y2 values.
 * @param {number} x1
 * @param {number} x2
 * @param {number} y1
 * @param {number} y2
 * @param {array} data
 */
function manhattan_plot(x1, x2, y1, y2, data) {
    //create the manhattan plot              

    //--------------------------- create color scale  --------------------------------------------------
    var margin_s = {
        top: 5,
        right: 30,
        bottom: 35,
        left: 10
    };

    //Then define width and height as the inner dimensions of the chart area.
    var w_scale_bar = 500 - margin_s.left - margin_s.right;
    var h_scale_bar = 65 - margin_s.top - margin_s.bottom;
    var barPadding = 0;

    var dataset = d3.range(d3.min(data, function(d) {
        return d[2];
    }), d3.max(data, function(d) {
        return d[2];
    }) + 1);

    var colorScale = d3.scale.log()
        .domain([d3.min(data, function(d) {
            return d[2];
        }), d3.max(data, function(d) {
            return d[2];
        })])
        .interpolate(d3.interpolateHsl)
        .range(["#00b300", "#F50808"]);

    //Create SVG element to receive the scale color bar
    var svg3 = d3.select("#scale_bar")
        .append("svg")
        .attr("width", w_scale_bar + margin_s.left + margin_s.right)
        .attr("height", h_scale_bar + margin_s.top + margin_s.bottom)
        .append("g")
        .attr("transform", "translate(" + margin_s.left + "," + margin_s.top + ")");

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
        .attr("fill", function(d, i) {
            return colorScale(d);
        });

    svg3.selectAll(".text_smp")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "text_smp")
        .text(function(d) {
            number_tick = 6;
            if (d % d3.round(d3.max(data, function(d) {
                return d[2];
            }) / number_tick) == 0) {
                return d;
            }
        })
        .attr("x", function(d, i) {
            return (i + 0.5) * (w_scale_bar / dataset.length);
        })
        .attr("y", 40)
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill",function(d) {
            return colorScale(d);
        });

    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   create color scale  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^           

    var margin = {
        top: 30,
        right: 50,
        bottom: 20,
        left: 60
    };

    var w = 800 - margin.left - margin.right; //900;
    var h = 600 - margin.top - margin.bottom; //600;

    //Create scale functions
    var xScale = d3.scale.linear()
        .domain([x1, x2])
        .range([0, w]); 

    var yScale = d3.scale.linear()
        .domain([y1, y2])
        .range([h, 0]);

    var array_test1 = [""];
    var array_test2 = [0];

    for (var i = 0; i < chrom_acum_length.length; i++) {
        var num = i + 1;
        array_test1.push("chr" + num);
        array_test2.push(xScale(chrom_acum_length[i]));
    }

    //Create scale top           
    var xScale_top = d3.scale.ordinal()
        .domain(array_test1)
        .range(array_test2);

    //Define X axis top
    var xAxis_top = d3.svg.axis()
        .scale(xScale_top)
        .orient("top");

    //Define X axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(5);

    //Define Y axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5);

    //Create SVG element
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var line_chrom = svg.selectAll("line")
        .data(chrom_acum_length)
        .enter()
        .append("line")
        .attr("class", "linechrom")
        .attr("x1", function(d) {
            return xScale(d);
        })
        .attr("y1", 0)
        .attr("x2", function(d) {
            return xScale(d);
        })
        .attr("y2", h)
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", 5)
        .style("stroke", "black") //stroke-dasharray="5"
        .style("opacity", 0.2);

    //Create circles
    var circle = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return xScale(d[0]);
        })
        .attr("cy", function(d) {
            return yScale(d[1]);
        })
        .attr("r", 3.5)
        .style("fill", function(d) {
            return colorScale(d[2]);
        });

    label_text = svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {
            return d[3] + " ; " + d[1] + " ; " + d[2]; 
        })
        .attr("x", function(d) {
            return xScale(d[0]);
        })
        .attr("y", function(d) {
            return yScale(d[1]);
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .style("fill", function(d) {
            return colorScale(d[2]);
        });

    label_text.transition().duration(1000).style("opacity", 0); //it will fade the label in circles

    //Create X axis
    svg.append("g")
        .attr("class", "manaxis").attr("font-size", "10px")
        .attr("transform", "translate(0," + (h) + ")")
        .call(xAxis) //;
        .append("text")
        .attr("class", "manlabel")
        .attr("x", w)
        .attr("y", -6)
        .style("text-anchor", "end").attr("font-size", "17px")
        .text("Chromosome Lengths (nº bases)");

    svg.append("g").attr("transform", "translate(0," + 0 + ")")
        .attr("class", "xt axis")
        .call(xAxis_top);     

    svg.selectAll(".xt text") // select all the text elements for the xaxis
        .attr("transform", function(d) {
            return "translate(" + this.getBBox().height + "," + this.getBBox().height * -0.5 + ")rotate(-45)";
        });

    //Create Y axis
    svg.append("g")
        .attr("class", "manaxis")
        .call(yAxis)
        .append("text")
        .attr("class", "manlabel")
        .attr("transform", "rotate(-90)")
        .attr("x", -10)
        .attr("y", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end").attr("font-size", "17px")
        .text("-log(p-value)");

    svg.append("g")
        .attr("class", "brush")
        .call(d3.svg.brush().x(xScale).y(yScale)
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend));

    //get the values to allows make the zoom when click the button zoon
    function brushstart() {
        svg.classed("selecting", true);
    }

    function brushmove() {
        var e = d3.event.target.extent();
        temp_man = [];
        zoom_allNodes = []; 
        circle.classed("selected", function(d, i) {
            if (e[0][0] <= d[0] && d[0] <= e[1][0] && e[0][1] <= d[1] && d[1] <=
                e[1][1]) {
                zoom_allNodes.push(allNodes[d[4]]);
                return 1;
            }
            temp_man.push(1);
            return 0;
        });

        x_1 = e[0][0];
        x_2 = e[1][0];
        y_1 = e[0][1];
        y_2 = e[1][1];
    }

    function brushend() {
        svg.classed("selecting", !d3.event.target.empty());
        d3.select("#hds_matrix").selectAll("svg").remove();
        histogram_degree_SNPs(0, 1, 0);
    }
}

/**
 * create a mini manhataan plot from the dots in data and do the zoom from x1, x2, y1, y2 values.
 * If rect_x1, rect_y1, rect_x2, rect_y2 are diferent from zero (0) this create a rectangle
 * to help a see the location of the zoom.
 * @param {number} x1
 * @param {number} x2
 * @param {number} y1
 * @param {number} y2
 * @param {number} rect_x1
 * @param {number} rect_x2
 * @param {number} rect_y1
 * @param {number} rect_y2
 * @param {array} data
 */
function manhattan_plot_minmap(x1, x2, y1, y2, rect_x1, rect_y1, rect_x2, rect_y2, data) {
    //create the manhattan plot
    var margin_s = {
        top: 5,
        right: 30,
        bottom: 35,
        left: 10
    };
    //Then define width and height as the inner dimensions of the chart area.
    var w_scale_bar = 500 - margin_s.left - margin_s.right;
    var h_scale_bar = 65 - margin_s.top - margin_s.bottom;
    var barPadding = 0;

    //--------------------------- create color scale  --------------------------------------------------
    var dataset = d3.range(d3.min(data, function(d) {
        return d[2];
    }), d3.max(data, function(d) {
        return d[2];
    }) + 1);

    var colorScale = d3.scale.log()
        .domain([d3.min(data, function(d) {
            return d[2];
        }), d3.max(data, function(d) {
            return d[2];
        })])
        .interpolate(d3.interpolateHsl)
        .range(["#00b300", "#F50808"]);
    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   create color scale  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^           

    var margin = {
        top: 30,
        right: 50,
        bottom: 40,
        left: 60
    };

    var w = 400 - margin.left - margin.right; //900;
    var h = 300 - margin.top - margin.bottom; //600;

    var xScale = d3.scale.linear()
        .domain([x1, x2])
        .range([0, w]); 

    var yScale = d3.scale.linear()
        .domain([y1, y2])
        .range([h, 0]);

    var array_test1 = [""];
    var array_test2 = [0];

    for (var i = 0; i < chrom_acum_length.length; i++) {
        var num = i + 1;
        array_test1.push(num);
        array_test2.push(xScale(chrom_acum_length[i]));
    }

    //Create scale top           
    var xScale_top = d3.scale.ordinal()
        .domain(array_test1)
        .range(array_test2);

    //Define X axis top
    var xAxis_top = d3.svg.axis()
        .scale(xScale_top)
        .orient("bottom");

    //Define X axis
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(5);

    //Define Y axis
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5);

    //Create SVG element
    var svg = d3.select("#minmap_mp")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var line_chrom = svg.selectAll("line")
        .data(chrom_acum_length)
        .enter()
        .append("line")
        .attr("class", "linechrom")
        .attr("x1", function(d) {
            return xScale(d);
        })
        .attr("y1", 0)
        .attr("x2", function(d) {
            return xScale(d);
        })
        .attr("y2", h)
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", 5)
        .style("stroke", "black")
        .style("opacity", 0.2);

    //Create circles
    var circle = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return xScale(d[0]);
        })
        .attr("cy", function(d) {
            return yScale(d[1]);
        })
        .attr("r", 1.5)
        .style("fill", function(d) {
            return colorScale(d[2]);
        });

    if (rect_x1 != 0 && rect_y1 != 0 && rect_x2 != 0 && rect_y2 != 0) {
        svg.selectAll("rect") //create color scale bar
        .data([0])
            .enter()
            .append("rect")
            .attr("x", xScale(rect_x1))
            .attr("y", yScale(rect_y1))
            .attr("width", xScale(rect_x2))
            .attr("height", yScale(rect_y2) - yScale(rect_y1))
            .attr("fill", "rgba(0, 0, 255, 0.1)")
            .attr("stroke", "rgba(0, 0, 255, 1)")
            .attr("stroke-width", "5");
    }

    svg.append("g").attr("transform", "translate(0," + h + ")")
        .attr("class", "xt_min axis")
        .call(xAxis_top); //;       

    svg.selectAll(".xt_min text") // select all the text elements for the xaxis
        .attr("transform", function(d) {
            return "translate(" + this.getBBox().height * 1.4 + "," + this.getBBox().height * 1.7 + ")rotate(90)";
        });

    //Create Y axis
    svg.append("g")
        .attr("class", "axis")
        .call(yAxis);
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ create manhattan plot ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
