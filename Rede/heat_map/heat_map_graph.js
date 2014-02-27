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
    histogram_degree_SNPs(file_json, 0);
    // list the links
    show_snp_pairs_list(file_json, st_chosen_colourscale1, 0);
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
    
    // load the statistical values of the heat-map
    load_stat_value_mat(file_json);
    // list the SNPs
    histogram_degree_SNPs(file_json, 0);
    // list the links
    show_snp_pairs_list(file_json, st_chosen_colourscale1, 0);


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
