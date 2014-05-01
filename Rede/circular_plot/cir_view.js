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
