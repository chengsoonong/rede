/**
 * @fileoverview All functions and variables to create the Manhattan plot 
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */


function show_snp_pairs_list(file_name,stat_value){

d3.json(file_name, function(json) {// Plot nodes and SNPs_links for the default dataset
    SNPs_links = json.links;// var SNPs_links = json.SNPs_links;
   

    
    
 d3.select("#pairs").selectAll("p")
    .data(SNPs_links.sort(function (a, b) {return b[stat_value] - a[stat_value];}
    ))
    .enter().append("p")
    //.append("link").attr("href","view_graph.html")


    .text(function(d) { return showInteract(d); })
    
    
    .on("mousedown", function(g,i) { 
        
        d3.select("#table_snps").selectAll('table').remove();
        create_table_snps(SNPs_links[i])
        
        //"roc_id":0 file_json "bd.json"
        d3.select("#rp").selectAll('svg').remove();
        //ROC_plot (SNPs_links[i].roc_id,file_json)
        ROC_plot (SNPs_links[i].ct_id,file_json)
        
        d3.select("#contp").selectAll('svg').remove();
        cont_plot (SNPs_links[i].ct_id,file_json)        
        
        });
	 
	
	 
	 
	   });
	   
}