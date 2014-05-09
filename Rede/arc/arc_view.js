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

/*
 *Global variable for arc plot to check if it is in zoom function
 */
var if_zoom;


// everything needed in arcplot
function start_arc_plot() {

    // remove the old plot the probe-groups and SNP list
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
