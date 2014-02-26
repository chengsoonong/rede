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
/**
 * Global variable that is used in view_graph.js, circle_plot.js,  hist_degree_snps_plot.js and manhattan_plot.js
 *  It have information about wich statistical test was selected.
 * @type {string} st_chosen
 */
var st_chosen;
/**
 * Global variable that is used in view_graph.js and matrix_plot.js
 *  It have information about wich statistical test was selected to be used in matrix plot.
 * @type {string} st_chosen1
 */
var st_chosen1;
/**
 * Global variable that is used in view_graph.js and matrix_plot.js
 * It have information about wich statistical test was selected to be used in matrix plot.
 * @type {string} st_chosen2
 */
var st_chosen2;
/**
 * Global variable that is used in view_graph.js and matrix_plot.js
 * It have information about wich statistical test was selected to be used in matrix plot.
 * @type {string} st_chosen3
 */
var st_chosen3;
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
function start_manhattan_plot(file_name) {
    file_json = file_name; 
    d3.select("#hds_matrix").selectAll('svg').remove();
    d3.select("body").select("#two_weight_value").transition().style("opacity", 0);
    d3.select("body").select("#cb").transition().style("opacity", 0);
    d3.select("body").select("#hc").transition().style("opacity", 0);
    d3.select("body").select("#snps_text").transition().style("opacity", 0);
    d3.select("body").select("#footer").transition().style("opacity", 0);
    d3.select("#table_snps").selectAll('table').remove();
    d3.select("#load_data").remove();
    
    create_container_manhattan();
    create_label_button();
    load_stat_value(file_json);
    read_file_to_manhattan_plot(file_json);
    histogram_degree_SNPs(file_json, 0);
    show_snp_pairs_list(file_json, st_chosen, 0);
}
 
// function for the zoom of the manhattan plot
function zoom_manhattan(file_name) {
    // Manhattan plot
    file_json = file_name;

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


/* create the labelbutton and unlabelbutton for manhattan plot
 */
function create_label_button() {
    // creat label on button 
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
    d3.select("#container").append("div")
        .attr("id", "scale_bar");
};
