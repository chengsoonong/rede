/**
 * @fileoverview Alls function to create the histogram Edges x Subgraph Id (probe_group)
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */




/**
 * It will create the histogram edges X subgraphId in circle plot and communitties plot.
 *     When a bar is clicked a subgraph is selected. 
 * @param {string} file_name
 */
function histogram_edges_subgraphId(file_name){
	
	
	
var margin = {top: 30, right: 20, bottom: 90, left: 40},
    width = 850 - margin.left - margin.right, //500
    height = 400 - margin.top - margin.bottom;//200


var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .5, 1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left") ;

var svg = d3.select("#hesid").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var data_probe_group1 = new Array();  
//this array will receive the probe_group of the json file, exemplo -> [1,3,2,4,1,1,3,4,4,4,2] .
//Next it will be sorted,  exemplo -> [1,1,1,2,2,3,3,4,4,4]

var data_probe_group2 = new Array();  
//this array will receive small array from data_probe_group1.
//the lenght the each sub-array represent the number the edges in a subgraph, 
//exemplo -> [[1,1,1],[2,2],[3,3],[4,4,4]], in this array the 1ª element is the subgraph 1 and has 3 edges.    
	
d3.json(file_name, function(json) {
   
 json.links.forEach( function(d) {  data_probe_group1.push(d.probe_group); } );  //-> [1,3,2,4,1,1,3,4,4,4,2]
 //json.nodes.forEach( function(d) {  data_probe_group1.push(d.probe_group); } );  //-> [1,3,2,4,1,1,3,4,4,4,2]
 	
 data_probe_group1.sort(function(a, b){ //-> [1,1,1,2,2,3,3,4,4,4]
   return a > b? 1 : 0; 
});
 

create_data_probe_group2()

function create_data_probe_group2(){
	//this function will create the array data_probe_group2 from data_probe_group1,
	//exemplo: [1,1,1,2,2,3,3,4,4,4] -> [[1,1,1],[2,2],[3,3],[4,4,4]].
	
	var max=d3.max(data_probe_group1, function(d) { return d; });
	var min=d3.min(data_probe_group1, function(d) { return d; });
	var li, ary;

	while(min<max ){
		
		li=data_probe_group1.lastIndexOf(min);
		ary=data_probe_group1.splice(0,li+1);
		//document.write(ary+"<br>");
		//ary=data_probe_group1.splice(0,li);
		data_probe_group2.push(ary);
		min=d3.min(data_probe_group1, function(d) { return d; })
		
	}
	data_probe_group2.push(data_probe_group1);
	
}

var data_obj=[]; //array with obj. with the couple egds and probe_group

function creat_obj(probe_group,edgs ){
	//function to create the obj. with the couple egds and probe_group
	var obj={};
	obj.n_probe_group  = probe_group;
	obj.n_edgs  =edgs;
	return obj;
}

for (var i=0;i<data_probe_group2.length;i++ ){
 	// from data_probe_group2 we will create a array with obj. with the couple egds and probe_group
 	 
 	//data_obj.push(creat_obj(data_probe_group2[i][0],data_probe_group2[i].length-1));
 	data_obj.push(creat_obj(data_probe_group2[i][0],data_probe_group2[i].length));
 }
  


  x.domain(data_obj.map(function(d) { return d.n_probe_group; }));
  y.domain([0, d3.max(data_obj, function(d) { return d.n_edgs; })]);


  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
      
      svg.append("text")
     // .attr("transform", "rotate(-90)")
      .attr("y", 330)
      .attr("x", 400)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("probe_group");

  		// now rotate text on x axis
        // first move the text left so no longer centered on the tick
        // then rotate up to get 90 degrees.
svg.selectAll(".x text")  // select all the text elements for the xaxis
          .attr("transform", function(d) {
             return "translate(" + this.getBBox().height*-1 + "," + this.getBBox().height*1 + ")rotate(-90)";
         });    


  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Nº Edges");
      





  svg.selectAll(".bar")
      .data(data_obj)
    .enter().append("rect")
      .attr("class", "es bar")
      .attr("x", function(d) { return x(d.n_probe_group); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.n_edgs); })
      .attr("height", function(d) { return height - y(d.n_edgs); })  
          
      .attr("fill", function(d) { return   graphColor(d.n_probe_group); })
      
      .attr("fill-opacity",.5)
      .on("mousedown", function(g,i) { 
	 	//when mousedown this selected the probe_group and create the string_html to show in html the seleced data 
  		 	
  		//d3.select("#chart").selectAll(".link").remove(); //remove the old association
	    //reset_association();			 //create the new association 	
  		//svg.selectAll(".link")  
   	 
   	 
   	 if(plot_chosen==="p_mat_c"){
   	 	
   	 	data_obj_mc=[]
   	 	d3.select("#minmap_matrixsc").selectAll('svg').remove();
   	 	d3.select("#chart").selectAll('svg').remove();  				//remove old selection
   	 	for (var e in data_obj_mc2){
   	 		
   	 		if ( data_obj_mc2[e].probe_group=== data_obj[i].n_probe_group){
   	 			data_obj_mc.push( data_obj_mc2[e])
   	 		}
   	 		
   	 	}
   	
   	
   	  mix_1=0;
      mix_2=d3.max(data_obj_mc, function(d) { return d.label_x; })+1;
      miy_1=d3.min(data_obj_mc, function(d) { return d.label_y; })-1; 
      miy_2=d3.max(data_obj_mc, function(d) { return d.label_y; })+1;  	
   	 	
   	 	
      	
	matrix_comm_plot(mix_1, mix_2, miy_1, miy_2) 
   	matrix_comm_plot_minmap(mix_1, mix_2, miy_1, miy_2, 0,0,0,0)
   	
   	
   	 	
   	 }else{
   	 
   	 
   	 
   	 
   	  
   	 d3.select("#hc").select("svg").remove();
   	 d3.select("#hds_matrix").select("svg").remove();
   	 sid= data_obj[i].n_probe_group;
  		 	
 			histogram_degree_SNPs(file_json,sid);	
 			
 			string_html="{\"directed\": false, \"graph\": [], \"nodes\": [";

			json_nodes_selected(file_json,sid);	
		
			json_links_selected(file_json,sid);
   	 
   	 
   	 
   	 
   	 
   	 
   	 
   	 
   	 d3.select("#chart") 	
		.selectAll("g circle")
   		.transition()
  	     .style("opacity", 1);
   	 
   	 
   	 
   	 
   	 
   	 d3.select("#chart") 
   	 .selectAll("g circle")  //select the circles
            .filter(function(d) {
            	            	 
		return d.probe_group != data_obj[i].n_probe_group;
            })
	    .transition()
            .style("opacity", 0);
   	 
   	 
   	 
   	 
   	 
   	 
   	 
   	 
   	  d3.select("#chart") 	
		.selectAll(".link")	
   		.transition()
  	     .style("opacity", 0.3);

	  d3.select("#chart") 	
		.selectAll(".link")
		//.data(links) //select the association regarding to the circle selected
   		.filter(function(d) { return d.probe_group != data_obj[i].n_probe_group;      })
   		//.remove();
		//	document.write(data_obj[i].n_probe_group); 	
         .transition()
  	     .style("opacity", 0);		
		
		
		
		
   d3.select("#snps").selectAll("p").remove(); //remove old text
   d3.select("#pairs").selectAll("p").remove(); //remove old text
  
    // Write out the data selected in text 
 d3.select("#snps").selectAll("p")  
	.data(allNodes)
	.enter().append("p")
	.filter(function(d) { 	return d.probe_group === data_obj[i].n_probe_group;   })
	.append("link").attr("href",function(d){	//link for UCSC genome browser for each snp (small circle) selected 			
	return 'http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position='+'chr'+d.chrom+':'+ (d.bp_position-1000)+'-'+(d.bp_position+1000)  ;		
			})
	.attr("target","_blank")	
	.style("text-decoration",'none')	
    .style("color", "black")      
	.text(function(d) { return showSnp(d); });
   
  
  
  
  

 d3.select("#pairs").selectAll("p")
	.data(links)
	.enter().append("p")
	.filter(function(d) {
		return d.probe_group === data_obj[i].n_probe_group;
            })
	.text(function(d) { 
		
	
		return showInteract(d); });
		
	}	
			 			
});
      
      
      
      

 svg.selectAll(".bar")  //show degree as tooltip - title
       .data(data_obj)
	  .append("title")
      .text(function(d) { return d.n_edgs; });  
      
 svg.selectAll(".text_b")
			   .data(data_obj)
			   .enter()
			   .append("text") 
			   .attr("class", "text_b")
			   .text(function(d) { return d.n_edgs; })
			  // .attr("text-anchor", "middle")
			   .attr("x",function(d) { return x(d.n_probe_group); })
			   .attr("y",function(d) { return y(d.n_edgs+0.5); })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
			   .attr("fill", "black")
			   .on("mousedown", function(g,i) { 
	 	//when mousedown this selected the probe_group and create the string_html to show in html the seleced data 
  		 	
  		//d3.select("#chart").selectAll(".link").remove(); //remove the old association
	    //reset_association();			 //create the new association 	
  		//svg.selectAll(".link")  
   	 
   	 
   	 
   	    	 d3.select("#hc").select("svg").remove();
   	 
   	 		sid= data_obj[i].n_probe_group;
  		 	
 			//histogram_degree_SNPs(file_json,sid);	
 			
 			string_html="{\"directed\": false, \"graph\": [], \"nodes\": [";

			json_nodes_selected(file_json,sid);	
		
			json_links_selected(file_json,sid);
   	 
   	 
   	 
   	 
   	 
   	 
   	 
   	 d3.select("#chart") 	
		.selectAll("g circle")
   		.transition()
  	     .style("opacity", 1);
   	 
   	 
   	 
   	 
   	 
   	 d3.select("#chart") 
   	 .selectAll("g circle")  //select the circles
            .filter(function(d) {
            	            	 
		return d.probe_group != data_obj[i].n_probe_group;
            })
	    .transition()
            .style("opacity", 0);
   	 
   	 
   	 
   	 
   	 
   	 
   	 
   	 
   	  d3.select("#chart") 	
		.selectAll(".link")	
   		.transition()
  	     .style("opacity", 0.3);

	  d3.select("#chart") 	
		.selectAll(".link")
		//.data(links) //select the association regarding to the circle selected
   		.filter(function(d) { return d.probe_group != data_obj[i].n_probe_group;      })
   		//.remove();
		//	document.write(data_obj[i].n_probe_group); 	
         .transition()
  	     .style("opacity", 0);		
		
		
		
		
   d3.select("#snps").selectAll("p").remove(); //remove old text
   d3.select("#pairs").selectAll("p").remove(); //remove old text
  
    // Write out the data selected in text 
 d3.select("#snps").selectAll("p")  
	.data(allNodes)
	.enter().append("p")
	.filter(function(d) { 	return d.probe_group === data_obj[i].n_probe_group;   })
	.append("link").attr("href",function(d){	//link for UCSC genome browser for each snp (small circle) selected 			
	return 'http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position='+'chr'+d.chrom+':'+ (d.bp_position-1000)+'-'+(d.bp_position+1000)  ;		
			})
	.attr("target","_blank")	
	.style("text-decoration",'none')	
    .style("color", "black")      
	.text(function(d) { return showSnp(d); });
   
  
  
  
  

 d3.select("#pairs").selectAll("p")
	.data(links)
	.enter().append("p")
	.filter(function(d) {
		return d.probe_group === data_obj[i].n_probe_group;
            })
	.text(function(d) { 
		
	
		return showInteract(d); });
		
		
		
		
					
		});     



});

}
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ histogram edges X probe_group ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

