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
 * Global variable that have information about of the file path choosen.
 * @type {srtring} file_json
 */
var file_json;
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
 * Constant only for circle_plot.js to create the color of the nodes
 * @const
 * @type {d3} graphColor
 */
var graphColor = d3.scale.category20();

// var to check is plot is in the zoom function
var if_zoom;
//everything needed in arcplot
function start_arc_plot(file_name) {

    d3.select("body").select("#two_weight_value").transition().style("opacity", 1);
    d3.select("body").select("#cb").transition().style("opacity", 1);
    d3.select("body").select("#hc").transition().style("opacity", 1);
    d3.select("body").select("#snps_text").transition().style("opacity", 1);
    d3.select("body").select("#footer").transition().style("opacity", 1);
    d3.select("body").select("#butz").transition().style("opacity", 1);
    d3.select("#chart").selectAll('svg').remove();
    d3.select("#hesid").selectAll('svg').remove();
    d3.select("#hds_matrix").selectAll('svg').remove();
    
    // because show_snp_pairs_list needs this var
    file_json = file_name;
    
    // set if_zoom on 0
    if_zoom = 0;
   
   // load statistical values
    load_stat_value(file_json);

    //function in arc_plot.js
    read_file_to_arc_plot(file_json);
    graphColor = d3.scale.category10();
    histogram_edges_subgraphId(file_json, if_zoom);
    histogram_degree_SNPs(file_json, 0);
};

// function to prepair everything for zoom of arc_plot
function zoom_arc(file_name) {
    file_json = file_name;

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
    
    zoom_arc_plot(+view_chr, +view_start, +view_end);
    data_weight_pvalue = [];
    // pvalue only of the zoomed links
    zoom_links.forEach( function(d) {
        data_weight_pvalue.push(d[st_chosen])
    });

    //brushweight function for the p_values of the snps
    select_snp_stat_range(if_zoom);

    histogram_degree_SNPs(file_json, 0);
    histogram_edges_subgraphId(file_json, if_zoom);

    show_snp_pairs_list(file_json, st_chosen, 0, if_zoom);
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


// function to highlight the link
function highlight_snp_pairs (d, i, if_zoom) {
    // var to store the id of the link
    d3.select("#pairs").selectAll("p").remove();

    // file_name for the implementation of the roc curve and the contigency table
    file_name_zoom = file_json;
    show_snp_pairs_list(file_name_zoom, select_dropbox_sort, 1 ,if_zoom , d.ct_id);
    var scrollpair = $("#pairs");
    $('html,body').animate({scrollTop: scrollpair.offset().top});
}


//function for #two_weight:value and # brush_weight to select the SNP in an certain range(statistical test)
function select_snp_stat_range(if_zoom) {
 
    // cleaup diagramm
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
}
//------------------------------------------  Statistical Test - drop box----------------------------------------------



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
}
