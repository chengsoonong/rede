/**
 * @fileoverview All functions to create the histogram Degree x SNPs plot
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */




/**
 * Create the histogram degree x snp. When click in a bar of the histogram this will selected egds in circle plot
 *     and dots in manhattan plot.    
 * @param {string} file_name
 * @param {number} probe_group 
 */
function histogram_degree_SNPs(file_name,probe_group){

var data = new Array();
var allNodes_hes = new Array();

var links_hes = new Array();
	
d3.json(file_name, function(json) {
   
 
     
 json.links.forEach(	
	function(d) { 
		if(probe_group===0){
 		    links_hes.push(d);	
		}else{
		    if(d.probe_group===probe_group){ links_hes.push(d)}
		}});
 	
 	
 json.nodes.forEach( 
 function(d) { 	
 	if(probe_group===0){
 		 allNodes_hes.push(d); 	
		 data.push(d);
	}else{ 	
 		   allNodes_hes .push(d); 	
 		   if(d.probe_group===probe_group){ data.push(d); }
 	}});		
 
	//it will create the histogram degree X SNPs in circle_plot
var margin = {top: 50, right: 20, bottom: 50, left: 400},
    width = 700 - margin.left - margin.right; //500
    //height = 1750*3500/200 - margin.top - margin.bottom;//200
    
    if (probe_group==0){    
 //    var   height = 34.1796875*allNodes_hes.length - margin.top - margin.bottom;//200

   	    if (data.length>10){
   
	        var   height = 34.1796875*allNodes_hes.length - margin.top - margin.bottom;//200
	    }else{

	    	var   height = 34.1796875*10 - margin.top - margin.bottom;
	    }


   	}else{ 
   	    if (data.length>10){

	        var   height = 34.1796875*data.length - margin.top - margin.bottom;//200
	    }else{

	    	var   height = 34.1796875*10 - margin.top - margin.bottom;
	    }
	 
	 }
	 
	// var   height=34.1796875*10 - margin.top - margin.bottom;

var y = d3.scale.ordinal()
    .rangeRoundBands([0 , height], .5);

var x = d3.scale.linear()
    .range([0, width]);

var xAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var yAxis = d3.svg.axis()
    .scale(x)
    .orient("top")
    ;

var svg = d3.select("#hds_matrix").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//d.label


 

  y.domain(data.map(function(d,i) { return "id:"+allNodes_hes.indexOf(d)+" chr"+d.chrom+':'+d.bp_position+ " " + d.rs + " probe_group:"+d.probe_group; }));
 /* 
  x.domain(
  
  data.sort("true"==="true"
        ? function(a, b) { return b.degree - a.degree; }
        : function(a, b) { return d3.ascending("chr"+a.chrom+':'+a.bp_position, "chr"+b.chrom+':'+b.bp_position); })
        .map(function(d) { return "chr"+d.chrom+':'+d.bp_position; })
  
  );
  */
  x.domain([0, d3.max(data, function(d) { return d.degree; })]);




  svg.append("g")
      .attr("class", "x axis")
      //.attr("transform", "translate(0," + height + ")")
      .call(xAxis);
      
 

		// now rotate text on x axis
        // first move the text left so no longer centered on the tick
        // then rotate up to get 90 degrees.
svg.selectAll(".x text")
		.style("font-size", "14px")
 
          .attr("transform", function(d) {
             return "translate(" + this.getBBox().height*-0.5 + "," + this.getBBox().height*0 + ")rotate(0)";
         })
		.on("click", function(d,i){
		

				
			var person=prompt("\n1) ClinVar\n2) dbSNP\n3) Ensembl\n4) PheGenI\n5) OMIM\n6) openSNP\n7) SNPedia\n8) UCSC");

			if (person!=null){
    			if("8"== person ){
    				html='http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position='+'chr'+data[i].chrom+':'+ (data[i].bp_position-1000)+'-'+(data[i].bp_position+1000)
    				
    	        }else if("6"== person ) {
    		    	html='http://opensnp.org/snps/'+data[i].rs
    		    	
    			}else if("2"== person ) {    				
    				html='http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs='+data[i].rs.substring(2)
    				
    			}else if("4"== person ) {    				
    				html='http://www.ncbi.nlm.nih.gov/gap/phegeni?tab=2&rs='+data[i].rs.substring(2)
    				
    			}else if("3"== person ) {    		
    				html='http://www.ensembl.org/Homo_sapiens/Variation/Summary?r='+data[i].chrom+':'+(data[i].bp_position-1000)+'-'+(data[i].bp_position+1000) +';source=dbSNP;v=rs'+data[i].rs.substring(2)+';vdb=variation'       
					 
    			}else if("7"== person ) {    		
    				html='http://www.snpedia.com/index.php/Rs'+data[i].rs.substring(2)       
					 
    			}else if("5"== person ) {    		
    				html='http://omim.org/search?index=entry&search=rs'+data[i].rs.substring(2)       
					 
    			}else if("1"== person ) {    		
    				html='http://www.ncbi.nlm.nih.gov/clinvar?term=rs'+data[i].rs.substring(2)       
				}
    		
    		
    		
    		
    		
      		window.open(html)
 			}	
						
			//html='http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position='+'chr'+data[i].chrom+':'+ (data[i].bp_position-1000)+'-'+(data[i].bp_position+1000)
			//html="http://www.w3schools.com"
			//window.open(html)//,"_blank","toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=400, height=400");
			
			
		});

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0," + 0 + ")")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(0)")
      .attr("x", width/2)
      .attr("y", -25).style("font-size", "15px")
      //.attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Degree");

/*
chart.selectAll("rect")
   .data(hotdogs)
   .enter().append("rect")
   .attr("x", 0)
   .attr("y", y)
   .attr("width", x)
   .attr("height", y.rangeBand());
*/


  var bar_hDS=svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "ds bar")
      .attr("y", function(d) { return y("chr"+d.chrom+':'+d.bp_position); })
      .attr("height", y.rangeBand())
      .attr("x", 0)
      .attr("width", function(d) { return  x(d.degree); })
      .on("mousedown", function(g,i){ 
      	
      		bar_hDS.style("fill", "steelblue")
      	
      	
        l=[]
        
        list_idx_in_links = []
        list_idx_in_links2 = []
        
		for ( var e in links_hes){			
	
		if(("chr"+allNodes_hes[links_hes[e].source].chrom+':'+allNodes_hes[links_hes[e].source].bp_position)===
		   ("chr"+data[i].chrom+':'+data[i].bp_position) 
 		|| ("chr"+allNodes_hes[links_hes[e].target].chrom+':'+allNodes_hes[links_hes[e].target].bp_position)===
 		   ("chr"+data[i].chrom+':'+data[i].bp_position)){
		
				l.push(("chr"+allNodes_hes[links_hes[e].source].chrom+':'+allNodes_hes[links_hes[e].source].bp_position));
		      	l.push(("chr"+allNodes_hes[links_hes[e].target].chrom+':'+allNodes_hes[links_hes[e].target].bp_position));
		      	
		      	//list_idx_in_links.push(links_hes[e].ct_id);
		      	list_idx_in_links.push(links_hes[e].source+"-"+links_hes[e].target  );
		      	
		      	list_idx_in_links2.push(links_hes[e]);
		      //	alert(links_hes[e].source);
		      //	alert(links_hes[e]); 
		      			 }		    			 
		      		} 
		      		
		      		
		      		
		      		
		      		
         bar_hDS.filter(function(d) {
      			if(include_in_arr(l,("chr"+d.chrom+':'+d.bp_position))){return d;} 
      			} )
	    .transition()
        .style("fill", "red");
      
               bar_hDS.filter(function(d) {
      			if(("chr"+d.chrom+':'+d.bp_position)===("chr"+data[i].chrom+':'+data[i].bp_position)){return d;} 
      			} )
	    .transition()
        .style("fill", "#32ee00");
      
      
      
      
     if(plot_chosen==="p_cir"){ //plot_chosen==="p_man"){	plot_chosen==="p_cir"
   	 
   	 d3.select("#chart").selectAll("g circle").transition().style("opacity", 0);
			
	 d3.select("#chart").selectAll("g circle")  //select the circles           
         .filter(function(d) {
      			if(include_in_arr(l,("chr"+d.chrom+':'+d.bp_position))){return d;} 
      			} )   
	    .transition()
            .style("opacity", 1);            
 	 
 	 
 	 
   	d3.select("#chart").selectAll(".link").transition().style("opacity", 0);
   	   
    d3.select("#chart").selectAll(".link") //select the association regarding to the circle selected
   			.filter(function(d,i) {
   				
      			if(include_in_arr(list_idx_in_links,d.source+"-"+d.target)){return d;}
      			 
      			} )
      			.transition()
  				.style("opacity", 0.3);	
  				
  				
  				
  				
  
		}else if(plot_chosen==="p_man"){
			
			//alert("to do something in manhattan plot")


 data_select_from_HDS = new Array();
allNodes= []//new Array();
var data_weight_pvalue= new Array();
	
json.nodes.forEach( 	function(d) { allNodes.push(d) }    );	
//alert(list_idx_in_links2.length);

for (var i in list_idx_in_links2){ //this will fill with data the array 
	
		var valuetoplot = 0
		if(kindofvalues=="withlog" ){		
			valuetoplot=-1*Math.log(list_idx_in_links2[i][st_chosen])  
		}else{
			valuetoplot=list_idx_in_links2[i][st_chosen] 			
		}
		
		data_weight_pvalue.push(valuetoplot); 
		
	
		if (allNodes[list_idx_in_links2[i].source].chrom===1){         //"chr"+d.chrom+':'+d.bp_position

			data_select_from_HDS.push([allNodes[list_idx_in_links2[i].source].bp_position,valuetoplot,allNodes[list_idx_in_links2[i].source].degree ,"chr"+allNodes[list_idx_in_links2[i].source].chrom+':'+allNodes[list_idx_in_links2[i].source].bp_position ]);	
		
		}else{
			
			data_select_from_HDS.push([allNodes[list_idx_in_links2[i].source].bp_position +chrom_acum_length[allNodes[list_idx_in_links2[i].source].chrom-2] ,valuetoplot,allNodes[list_idx_in_links2[i].source].degree,"chr"+allNodes[list_idx_in_links2[i].source].chrom+':'+allNodes[list_idx_in_links2[i].source].bp_position ]);
		}
		
		if (allNodes[list_idx_in_links2[i].target].chrom===1){
			
			data_select_from_HDS.push([allNodes[list_idx_in_links2[i].target].bp_position,valuetoplot,allNodes[list_idx_in_links2[i].target].degree,"chr"+allNodes[list_idx_in_links2[i].target].chrom+':'+allNodes[list_idx_in_links2[i].target].bp_position ]);	
		
		}else{
			data_select_from_HDS.push([allNodes[list_idx_in_links2[i].target].bp_position +chrom_acum_length[allNodes[list_idx_in_links2[i].target].chrom-2] ,valuetoplot,allNodes[list_idx_in_links2[i].target].degree,"chr"+allNodes[list_idx_in_links2[i].target].chrom+':'+allNodes[list_idx_in_links2[i].target].bp_position]);
		}
		
		}
      	
      	ix_1=0;
      	ix_2=chrom_lenght;
      	iy_1=d3.min(data_weight_pvalue, function(d) { return d; })-1;
      	iy_2=d3.max(data_weight_pvalue, function(d) { return d; })+1;
      	
      	//alert(data_select_from_HDS.length); 
      	
      	data_from_HDS="yes"
      	
      	d3.select("#chart").selectAll('svg').remove();
   		d3.select("#scale_bar").selectAll('svg').remove();
  
   			   		 
  		 	d3.select("#minmap_mp").selectAll('svg').remove();   		
   		 
      	
manhattan_plot_minmap(0, chrom_lenght,d3.min(data_weight_pvalue, function(d) { return d; })-1, d3.max(data_weight_pvalue, function(d) { return d; })+1, 0, 0, 0, 0,data_select_from_HDS);      	


manhattan_plot(0, chrom_lenght,d3.min(data_weight_pvalue, function(d) { return d; })-1, d3.max(data_weight_pvalue, function(d) { return d; })+1,data_select_from_HDS);





			
		}else{
			
			//alert("to do something in matrix plot")
						
		}
       
       
       
      	
      	
      	 });
      
      
      
   svg.selectAll(".bar")  //show degree as tooltip - title
       .data(data)
	  .append("title")
      .text(function(d) { return "chr"+d.chrom+':'+d.bp_position+" ; "+d.degree; });     
  
  
  
});

}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ histogram degree X SNPs (matrix) ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^







