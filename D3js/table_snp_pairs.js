/**
 * @fileoverview  This file has the function to create the table with information about snps pairs
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */



/**
 * From data about snps pairs in dat this function create a table  
 * @param {array} dat
 */ 
function create_table_snps(dat){	
		
var dataset = [], tmpDataset = []; //, i, j;


tmpDataset.push("prb_a");
tmpDataset.push("prb_b");
tmpDataset.push("prbCode_a");
tmpDataset.push("prbCode_b");
tmpDataset.push("browser_a");
tmpDataset.push("browser_b");
tmpDataset.push("rs_a");
tmpDataset.push("rs_b");


for (var e in dat){
	if("assoc_group"!=e &&	"source"!=e &&	"target" !=e && "probe_group" !=e &&	"ct_id"!=e){
	tmpDataset.push(e);
	}
}
dataset.push(tmpDataset);
tmpDataset=[]

tmpDataset.push(allNodes[dat.source].prb);
tmpDataset.push(allNodes[dat.target].prb);
tmpDataset.push(allNodes[dat.source].prbCode);
tmpDataset.push(allNodes[dat.target].prbCode);
tmpDataset.push("chr"+allNodes[dat.source].chrom+':'+allNodes[dat.source].bp_position);
tmpDataset.push("chr"+allNodes[dat.target].chrom+':'+allNodes[dat.target].bp_position);
tmpDataset.push(allNodes[dat.source].rs);
tmpDataset.push(allNodes[dat.target].rs);

for (var e in dat){
		if("assoc_group"!=e &&	"source"!=e &&	"target" !=e && "probe_group" !=e &&	"ct_id"!=e){
	tmpDataset.push(dat[e]);
	}
	
}
dataset.push(tmpDataset);


d3.select("#table_snps")
    .append("table")
    .style("border-collapse", "collapse")
    .style("border", "2px black solid")
    
    .selectAll("tr")
    .data(dataset)
    .enter().append("tr")
    
    .selectAll("td")
    .data(function(d){return d;})
    .enter().append("td")
    .style("border", "1px black solid")
    .style("padding", "10px")
    .on("mouseover", function(){d3.select(this).style("background-color", "aliceblue")}) 
    .on("mouseout", function(){d3.select(this).style("background-color", "white")}) 
    .text(function(d){return d;})
    .style("font-size", "12px");
}
		
