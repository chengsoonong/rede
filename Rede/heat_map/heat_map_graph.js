/**
 * @fileoverview Utilities such as global variable and functions for handling the functions in another javascript files and create the plots.
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */

// marks :
// a: creat_dropbox to chose the statistical test
//------------------------------------------   Global variable   ---------------------------------------------- 

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
 * Global variables for manhattan_plot.js and view_graph.js hindle to create the manhattan plot with the initial dots.
 * @type {number} ix_1, ix_2, iy_1, iy_2
 */
var ix_1, ix_2, iy_1, iy_2;
/**
 * Global variables for manhattan_plot.js and view_graph.js hindle to create the manhattan
 * plot with specifcs dots selected by brush.
 * @type {number} x_1, x_2, y_1, y_2
 */
var x_1, x_2, y_1, y_2;
/* global variable for statistical test for the colourscale of the heat-map
 * @type int st_chosen_colourscale1
 */
var st_chosen_colourscale1;
/* global variable for statistical test for the colourscale of the heat-map
 * @type int st_chosen_colourscale2
 */
var st_chosen_colourscale2;
/**
 * Global variable that is used in view_graph.js and circle_plot.js
 * It have information each nodes.
 * @type {array} allNodes
 */
var allNodes;
/**
 * Global variable that is used in circle_plot.js to create the brush and manhattan_plot.js
 * to create the axis y of the manhattan plot. It has the dots about wich statistical test
 * was selected to be used.
 * @type {array} data_weight_pvalue
 */
var data_weight_pvalue;
/**
 * Global variable that is used in view_graph.js and circle_plot.js
 * It have information each nodes pairs.
 * @type {array} links
 */
var links;
/**
 * Global variable that have information about of the file path choosen.
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
 * Global variable that is used in view_graph.js. It will be used to get the information about of the statistical test choosen.
 * @type {d3} select_dropbox_scale1
 */
var select_dropbox_scale1;
/**
 * Global variable that is used in view_graph.js. It will be used to get the information about of the statistical test choosen.
 * @type {d3} select_dropbox_scale2
 */
var select_dropbox_scale2;
/**
 * Global variable that is used in view_graph.js. It will be used to get the information about of the statistical test to
 * create the dropbox.
 * @type {object} statOptions
 */
var statOptions = {}
/**
 * Global variable that is used in view_graph.js. It will be used to check if there is communities in the json file
 * create the dropbox.
 * @type {array} list_keys_json
 */
var list_keys_json = []
/**
 * Global variable that is used in view_graph.js and circle_plot. It will be used to check if there is communities in the json file
 * create the dropbox.
 * @type {string} use_communities
 */
var use_communities = "no"
/**
 * Global variable that is used in view_graph.js and circle_plot. It will be used to check if there is cont. table in the json file.
 * @type {string} use_cont_table
 */
var use_cont_table = "no"
/**
 * Global variable that is used in view_graph.js. It is save the first statistical test to be visualited
 * create the dropbox.
 * @type {string} st_1
 */
var st_1 = []
/**
 * Global variables for manhattan_plot.js and view_graph.js hindle to create the manhattan plot with the initial dots.
 * @type {number} ix_1, ix_2, iy_1, iy_2
 */
var brush_value1, brush_value2;
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Global variable ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 

//------------------------------------------ load -  first vizualization   ---------------------------------------------- 
function start_heat_map(file_name) {
    file_json = file_name; 
    // Heat map of association matrix
    d3.select("#load_data").remove();
    d3.select("#hds_matrix").selectAll('svg').remove();
    d3.select("#hds_matrix").selectAll('svg').remove();
    d3.select("#table_snps").selectAll('table').remove();
    d3.select("#chart").selectAll('svg').remove();
    d3.select("#minmap_matrixp").selectAll('svg').remove();
    d3.select("#container_matrix").remove();
    
    create_stat_container_mat();

    load_stat_value_man(file_json);
    read_file_to_matrix_plot(file_json);
    histogram_degree_SNPs(file_json, 0);
    show_snp_pairs_list(file_json, st_chosen_colourscale1, 0);
}
function zoom_heatmap(file_name) {
    file_json = file_name;
    // Heat map of association matrix
    d3.select("#chart").selectAll('svg').remove();
    d3.select("#minmap_matrixp").selectAll('svg').remove();
    d3.select("#container_matrix").remove();
    
    create_stat_container_mat();


    if (mx_1) { // if x_1 is not null make ..
        matrix_plot(mx_1, mx_2, my_1, my_2);
        matrix_plot_minmap(mix_1, mix_2, miy_1, miy_2, mx_1, my_1, mx_2 - mx_1, my_2);
    } else {
        matrix_plot(mix_1, mix_2, miy_1, miy_2);
    }
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
/**
 * create LABEL when the button LABEL is clicked
 */
function label_manhattan_plot() { //button LABEL

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
};

/**
 * REMOVE LABEL when the button "REMOVE LABEL" is clicked
 */
function unlabel_manhattan_plot() { //button REMOVE LABEL	

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
};
//function to load the stattistical values of the links
function load_stat_value_man(file_json) {
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
        show_snp_pairs_list(file_json, st_chosen_colourscale1, 0, 0);
        
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
                show_snp_pairs_list(file_json, st_chosen, 0, 0 );
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
                
                d3.select("#chart").selectAll('svg').remove();
                d3.select("#scale_bar").selectAll('svg').remove();
                d3.select("#minmap_mp").selectAll('svg').remove();
                d3.select("#hds_matrix").selectAll('svg').remove();
                read_file_to_manhattan_plot(file_json);

                histogram_degree_SNPs(file_json, 0);
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

}
