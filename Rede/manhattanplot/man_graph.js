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
    histogram_degree_SNPs(file_json, 0);
    // SNP links
    show_snp_pairs_list(file_json, st_chosen, 0);
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
// function for reset 
function reset_manhattan() {
    // create container needed in the manhattan plot
    create_container_manhattan();
    create_label_button();

    data_from_HDS == "no";

    x_1 = ix_1;
    x_2 = ix_2;
    y_1 = iy_1;
    y_2 = iy_2;

    if (data_from_HDS === "no") {
        manhattan_plot(ix_1, ix_2, iy_1, iy_2, data);
        manhattan_plot_minmap(ix_1, ix_2, iy_1, iy_2, 0, 0, 0, 0, data)
    } else {
        manhattan_plot(ix_1, ix_2, iy_1, iy_2, data_select_from_HDS);
        manhattan_plot_minmap(ix_1, ix_2, iy_1, iy_2, 0, 0, 0, 0, data_select_from_HDS)
    };
};
/* create the labelbutton and unlabelbutton for manhattan plot
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
