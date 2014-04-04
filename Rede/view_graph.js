/**
 * @fileoverview Utilities such as global variable and functions for handling the functions in another javascript files and create the plots.
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 * @author stefan.sevelda@hotmail.com (Stefan Sevelda)
 */

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
/**
 * Constant only for circle_plot.js and arc_plot.js to create the color of the nodes
 * @const
 * @type {d3} graphColor
 */
var graphColor = d3.scale.category20();
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Global variable ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 




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
                upload_json(e.target.result)
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
function upload_json(data_uri) {
    // copy the file contents to the global variable
    file_json = data_uri;

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
            //start arc plot
            start_arc_plot(data_uri);
            break;
        case "p_cir":
            // remove all unused containers
            remove_section();

            // create used containers
            create_container_probegroup();
            drop_stat_cma();
            pvalue_range_container();
            create_textzoom_container();
            //start circular plot
            start_cir_plot(data_uri);
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
    links = [];
    allNodes = [];
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
    d3.select("#hesid_text").remove();
};
/**
 * Allows us choose one plot to vizualization
 */
d3.select("#Plot_select").on("change", function change() {
    plot_chosen = this.value;

    if (this.value === "p_cir") {
        // Circular plot
    
        // remove container
        remove_section();
        
        // create container
        create_container_probegroup();
        drop_stat_cma();
        create_textzoom_container();
        pvalue_range_container();
        // start circular plot
        start_cir_plot(file_json);
    } else if (this.value === "p_man") {
        // Manhattan plot
        // remove container
        remove_section();
    
        // create container
        drop_stat_cma();
        //start circular plot
        start_manhattan_plot(file_json);
    } else if (this.value === "p_mat") {
        // Heat map of association matrix
        //removing
        remove_section();
        d3.select("#st_select2").remove();

        // start heat-map plot
        start_heat_map(file_json);
    } else if (this.value === "p_arc") {
        // arc diagram interaction plot
        // remove container
        remove_section();

        // create container
        create_container_probegroup();
        drop_stat_cma();
        create_textzoom_container();
        pvalue_range_container();
        //start arc plot
        start_arc_plot(file_json);
    }
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
        ROC_plot(links[idx_snps].ct_id, file_json)
        d3.select("#contp").selectAll('svg').remove();
        cont_plot(links[idx_snps].ct_id, file_json);

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
function highlight_snp_pairs (d, i, if_zoom) {
    // var to store the id of the link
    d3.select("#pairs").selectAll("p").remove() 
    show_snp_pairs_list(file_json, select_dropbox_sort, 1 ,if_zoom , d.ct_id);
    var scrollpair = $("#pairs");
    $('html,body').animate({scrollTop: scrollpair.offset().top});
}
/**
 * This function selected the elementes inside nodes with a subgraph_id chosen and put in the string string_html
 * @param {string} file_name
 * @param {number} probe_group
 */
function json_nodes_selected(file_name, probe_group) {

    d3.json(file_name, function(json) {
        json.nodes.forEach(function(d) {
            if (d.probe_group === probe_group) {
                string_html += "{\"label\": \"" + d.label + "\", \"degree\": " + d.degree + ", \"rs\": \"" + d.rs +
                    "\", \"bp_position\": " + d.bp_position + ", \"chrom\": " + d.chrom + ", \"id\": " + d.id +
                    ", \"probe_group\": " + d.probe_group + "},";
            }
        });
        string_html = string_html.substring(0, string_html.lastIndexOf(","));
        string_html += "], \"links\": [";
    });
};

/**
 * This function selected the elementes inside nodes with a subgraph_id chosen and put in the string string_html
 * @param {string} file_name
 * @param {number} probe_group
 */
function json_links_selected(file_name, probe_group) {

    d3.json(file_name, function(json) {
        json.links.forEach(function(d) {
            if (d.probe_group === probe_group) {
                string_html += "{\"source:\" " + d.source + ", \"probe_group\": " + d.probe_group + ", \"weight\": " +
                    d.weight + ", \"target\": " + d.target + ", \"edgs_in_comm\": " + d.edgs_in_comm +
                    ", \"assoc_group\": " + d.assoc_group + "},";
            }
        });

        string_html = string_html.substring(0, string_html.lastIndexOf(",")); // IMP ->remover a ultima virgula<- IMP
        string_html += "], \"multigraph\": false}";
    });
}

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
/**
 * This function selected the elementes inside nodes with a subgraph_id chosen and put in the string string_html
 * @param {string} file_name
 * @param {number} probe_group
 */
function json_nodes_selected(file_name, probe_group) {

    d3.json(file_name, function(json) {
        json.nodes.forEach(function(d) {

            if (d.probe_group === probe_group) {

                string_html += "{\"label\": \"" + d.label + "\", \"degree\": " + d.degree + ", \"rs\": \"" + d.rs +
                    "\", \"bp_position\": " + d.bp_position + ", \"chrom\": " + d.chrom + ", \"id\": " + d.id +
                    ", \"probe_group\": " + d.probe_group + "},";

            }
        });
        string_html = string_html.substring(0, string_html.lastIndexOf(","));
        string_html += "], \"links\": [";
    });
}
/**
 * This function selected the elementes inside nodes with a subgraph_id chosen and put in the string string_html
 * @param {string} file_name
 * @param {number} probe_group
 */
function json_links_selected(file_name, probe_group) {

    d3.json(file_name, function(json) {
        json.links.forEach(function(d) {
            if (d.probe_group === probe_group) {
                string_html += "{\"source:\" " + d.source + ", \"probe_group\": " + d.probe_group + ", \"weight\": " +
                    d.weight + ", \"target\": " + d.target + ", \"edgs_in_comm\": " + d.edgs_in_comm +
                    ", \"assoc_group\": " + d.assoc_group + "},";
            }
        });

        string_html = string_html.substring(0, string_html.lastIndexOf(",")); // IMP -> 		remover a ultima virgula 	   <- IMP
        string_html += "], \"multigraph\": false}";
    });
}//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ operational functions ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^




//--------------------------------------  BUTTONs AND OPERATIONS --------------------------------------

/**
 * Do zoom when the button ZOOM is clicked */
d3.select("body").select("#butz").on("click", function change() {
    switch(plot_chosen) {
        case "p_arc":
            zoom_arc(file_json)
            break;
        case "p_cir":
            zoom_circular(file_json);
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
 * Do RESET when the button RESET is clicked
 */
d3.select("body").select("#butr").on("click", function change() { //button RESET

    switch(plot_chosen) {
        case "p_arc":
            //remove all unused containers
            remove_section();

            //create used containers
            create_container_probegroup();
            drop_stat_cma();
            pvalue_range_container();
            create_textzoom_container();
            //start arc plot
            start_arc_plot(file_json);
            break;
        case "p_cir":
            // remove all unused containers
            remove_section();

            // create used containers
            create_container_probegroup();
            drop_stat_cma();
            pvalue_range_container();
            create_textzoom_container();
            //start circular plot
            start_cir_plot(file_json);
            break;
        case "p_man":
            // remove all unused containers
            remove_section();

            // create used containers
            drop_stat_cma();
            // start manhattan plot
            reset_manhattan();
            break;
        case "p_mat":
            // remove all unused containers
            remove_section();
        
            // start plot heat-map
            start_heat_map(file_json);
            break;
    }
});

//function to load the stattistical values of the links
function load_stat_value(file_json) {
    // remove elements from array
    data_weight_pvalue = [];
    statOptions = [];
    // load data from json file
    d3.json(file_json, function(json) {
        //for loop to get all available statistical test of the dataset
        for (var i in json.links[0]) {
            if (i != "assoc_group" && i != "source" && i != "target" && i != "probe_group" && i != "ct_id") {
                statOptions[i] = i;
                st_1.push(i);  
            }
        }

        //the first element to be visualited
        st_chosen = st_1[0];
        //function located SNP_pairs_list.js to create list of links
        show_snp_pairs_list(file_json, st_chosen, 0, 0);

        //load p_values 
        json.links.forEach(
            function(d) {
                data_weight_pvalue.push(d[st_chosen])
            } 
        );

        // to create the available statistical test of the dataset located view_graph.js (l.421)
        creat_drop_box1("st_select2");
        // to create the dropbox in the SNP pair list
        creat_drop_box1("st_select_snp_pairs");
        //brushweight function for the p_values of the snps
        select_snp_stat_range(0);
        
        
    });
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
                //load p 
                if(plot_chosen == "p_man") {
                    d3.select("#chart").selectAll('svg').remove();
                    d3.select("#scale_bar").selectAll('svg').remove();
                    d3.select("#minmap_mp").selectAll('svg').remove();
                    d3.select("#hds_matrix").selectAll('svg').remove();
                    read_file_to_manhattan_plot(file_json);

                    histogram_degree_SNPs(file_json, 0);
                } else {
                    data_weight_pvalue = [];
                    d3.json(file_json, function(json) {
                        json.links.forEach(
                            function(d) {
                            data_weight_pvalue.push(d[st_chosen])
                        });
                        select_snp_stat_range(0);
                    })
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
            circle.classed("selected", function(d) {
                return s[0] <= d && d <= s[1];
            }); //selected de circles in x cordenate for diferent vizualization

            d3.select("#two_weight_value").selectAll("h").remove(); //remove the old text
            d3.select("#two_weight_value").selectAll("h") //create the new text
                .data([1])
                .enter().append("h")
                .text(two_dec(s[0]) + " - " + two_dec(s[1]));

            brush_value1 = s[0]
            brush_value2 = s[1]

            if (if_zoom) {
                d3.select("#chart").selectAll(".link").transition().style("opacity", 0.3);
   
                d3.select("#mainplot").selectAll(".link") 
                    .filter(function(d) {
                        return d[st_chosen] <= s[0] || d[st_chosen] >= s[1];
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

                d3.select("#mainplot").selectAll(".link") // this declaretion selected the association between specifics  weight values 
                    .filter(function(d) {
                        return d[st_chosen] <= s[0] || d[st_chosen] >= s[1];
                    })
                    .transition().style("opacity", 0);
                
                d3.select("#chart")
                    .selectAll("g circle")
                    .transition()
                    .style("opacity", 0);

                //to make all the selected nodes visible 
                var link_selected_stat = [];
                link_selected_stat = nodes_selected(s[0], s[1], links);

                d3.select("#chart")
                    .selectAll("g circle")
                    .filter(function(d, i) {
                        if (include_in_arr(link_selected_stat, i)) { 
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
        }
};
