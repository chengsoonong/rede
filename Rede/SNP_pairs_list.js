/**
 * @fileoverview All functions and variables to create the Manhattan plot
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */
// global array to store the highlighted links
var highlighting_links = new Array();
var check = [];

function show_snp_pairs_list(file_name, stat_value,if_selected ,selected_links) {



    d3.json(file_name, function(json) { // Plot nodes and SNPs_links for the default dataset
        SNPs_links = json.links; // var SNPs_links = json.SNPs_links;

        var temp = false;
        temp = highlighting_links.some(function (d) {
            return d == selected_links;
        });

        if(!temp) {
            highlighting_links[selected_links] = selected_links;
            check[selected_links] = true;
        } else {
            check[selected_links] = false;
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
        //.append("link").attr("href","view_graph.html")


            .text(function(d) {
                return showInteract(d);
            })
            .style("background-color", function (d, i) {
                if (!if_selected) {
                    return "white"
                } else {
                    if(highlighting_links.some( function (v) { return v === d.ct_id;}) && check[i]) {
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
            //ROC_plot (SNPs_links[i].roc_id,file_json)
            ROC_plot(SNPs_links[i].ct_id, file_json)

            d3.select("#contp").selectAll('svg').remove();
            cont_plot(SNPs_links[i].ct_id, file_json)

        });




    });

    check_file_name = file_name;

}