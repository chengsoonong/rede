/**
 * @fileoverview All functions to create the circle plot 
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */




//------------------------------------------   Global variables   ---------------------------------------------- 

/**
 * Constant only for circle_plot.js to create the SVG
 * @const
 * @type {number}
 */
var width = 800,//800,  ->  300
    height = 800 ,//800,  -> 300
    width2 = 800 ,//800,  -> 1500				//for transition
    height2 = 800 ,//800,   -> 400 				//for transition
    chromRingOuterRadius = Math.min(width, height) * .42,   
    chromRingInnerRadius = chromRingOuterRadius * 0.95;
/**
 * Constant only for circle_plot.js to create the color of the chrommossomos
 * (TODO: change to function reading from ucsc_colour.csv)
 * @const
 * @type {array}
 */
var chromColor = new Array
               (d3.rgb(153,102,0), d3.rgb(102,102,0), d3.rgb(153,153,30), d3.rgb(204,0,0), 
                d3.rgb(255,0,0), d3.rgb(255,0,204), d3.rgb(255,204,204), d3.rgb(255,153,0),
                d3.rgb(255,204,0),d3.rgb(255,255,0),d3.rgb(204,255,0),d3.rgb(0,255,0),
                d3.rgb(53,128,0),d3.rgb(0,0,204),d3.rgb(102,153,255),d3.rgb(153,204,255),
                d3.rgb(0,255,255),d3.rgb(204,255,255),d3.rgb(153,0,204),d3.rgb(204,51,255),
                d3.rgb(204,153,255),d3.rgb(102,102,102),d3.rgb(153,153,153),d3.rgb(204,204,204),
                d3.rgb(1,1,1));
/**
 * Constant only for circle_plot.js to create the color of the nodes 
 * @const
 * @type {d3} graphColor
 */
var graphColor = d3.scale.category20(); 
/**
 * Global variable only for circle_plot.js to create the circle plot
 * @type {svg} svg
 */
var svg ;						
/**
 * Global variable only for circle_plot.js to create the circle plot
 * @type {object} all_chrom
 */
var all_chrom;   						
/**
 * Global variable only for circle_plot.js to create color bar scale.
 * @type {d3} colorScaleedges
 */
var colorScaleedges;
/**
 * Global variable only for circle_plot.js to create color bar scale.
 * @type {d3} colorScaleedges2
 */
var colorScaleedges2;
/**
 * Global variable that is used in circle_plot.js. It will be used to get the information about of the communitties in json file. 
 * @type {array[objects]} communities   
 */
var communities;

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Global variables ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 

    


// ---------------------------------- create the circle plot ----------------------------------------

/**
 * Create the SVG element to Plot the chromosomes in a circle and the ticks on chromosome   
 */
function Create_chr_circle(view_chr, view_start, view_end){  
	   		
    svg = d3.select("#chart")  // Selects  the element with id="chart"
    .append("svg")
    .attr("width", width2)
    .attr("height", height2)
    .append("g")
    //.attr("transform", "translate(" + 400 + "," + 400  + ")");  //This transform moves the element by pixels in both the X and Y directions.
    .attr("transform", "translate(" + width2 / 2 + "," + height2 / 2 + ")");  //This transform moves the element by pixels in both the X and Y directions.

// // Genome object for drawing Plot the chromosomes in a circle
all_chrom = Genome();
all_chrom.set_zoom(view_chr, view_start, view_end);

allNodes = new Array(); //create array that will receive objects with information about SNP from .json 

data_weight_pvalue= new Array(); //create array that will receive the weight value from .json


svg.selectAll("path") //create the vizualization of the chromosomes in circles.
    .data(all_chrom.chromosomes()) // it'll return chromosomes[] with objects content information about each chromosomes
    .enter()                       //in each object has information such as angle 
    .append("path")
    .attr("class", "ring")
    .style("fill", function(d) { return chromColor[d.index]; })
    .style("stroke", function(d) { return chromColor[d.index]; })
    .attr("d", d3.svg.arc()
          .innerRadius(chromRingInnerRadius)
          .outerRadius(chromRingOuterRadius)
          .startAngle(function(d) { return d.startAngle; })
          .endAngle(function(d) { return d.endAngle; })
         ); //read angles of each object in chromosomes[]


svg.selectAll("text")      // write the numbers in chromosomes 
    .data(all_chrom.chromosomes())
    .enter()
    .append("text")
    .attr("class", "ring")
    .attr("transform", function(d) {
    	var angle = (d.startAngle+d.endAngle)/2;
    	if (angle < Math.PI) {
        	return "rotate("+ degrees(angle) + ")"
        	+ "translate(" + (chromRingInnerRadius+3) + ")";}
    	else {
	        return "rotate("+ degrees(angle) + ")"
    	    + "translate(" + (chromRingInnerRadius+3) + ")"
        	+ "rotate(180)translate(-13)";}
    })
    .style("opacity", function(d) { 
    	if (d.index+1 !=view_chr && view_chr!=0){	return 0;} 
    	})
    .text(function(d) { return d.index+1 });


// ticks on chromosome       

var ticks = svg.append("g")
    .selectAll("g")
     .data(all_chrom.chromosomes())        
    .enter().append("g")
    .selectAll("g")
    .data(groupTicks)
    .enter().append("g")
    
     .attr("transform", function(d) {
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
            + "translate(" + chromRingOuterRadius + ",0)";
    })  	;

ticks.append("line")
    .attr("x1", 1)
    .attr("y1", 0)
    .attr("x2", 5)
    .attr("y2", 0)
    .style("opacity", function(d) { 
    	if (d.index+1 !=view_chr && view_chr!=0){	return 0;} 
    	})
    .style("stroke", "#000");
    

ticks.append("text")
    .attr("x", 8)
    .attr("dy", ".35em")
    .attr("font-size","10")
    .attr("text-anchor", function(d) {
      return d.angle > Math.PI ? "end" : null;
    })
    .attr("transform", function(d) {
      return d.angle > Math.PI ? "rotate(180)translate(-16)" : null;
    })    
    .style("opacity", function(d) { 
    	if (d.index+1 !=view_chr && view_chr!=0){	return 0;} 
    	})
    .text(function(d) { return d.label; });    

};

/**
 * Create all associations betewen the SNPs   
 */
function Create_SNP_association(file_name){


d3.json(file_name, function(json) {// Plot nodes and links for the default dataset
    links = json.links;// var links = json.links;
    var subgraphs = json.subgraphs;	   
    communities = json.communities;
    
    
    json.nodes.forEach(
    function(d) { allNodes.push(d) }   //allNodes[]
    );
    
    
    // Draw the marks for each snp   - small marks in chromosome 
svg.selectAll("path.vertex")
    .data(allNodes)
    .enter().append("path")
    .attr("class", "vertex") //"vertex"
    .style("fill", function(d) { return chromColor[d.chrom-1]; })
    .style("stroke", function(d) { return chromColor[d.chrom-1]; })
    .attr("d", d3.svg.arc()
          .innerRadius(chromRingInnerRadius-10)
          .outerRadius(chromRingInnerRadius-3)          // getAngle() is a function of Genome   
          .startAngle(function(node) { return all_chrom.getAngle(node.chrom, node.bp_position) - 0.001; })
          .endAngle(function(node) { return all_chrom.getAngle(node.chrom, node.bp_position) + 0.001; }))
   
 
    // Draw the nodes for each snp   - small circles
svg.selectAll("circle.vertex")
    .data(allNodes)
    .enter().append("circle")
    .attr("class", "vertex")//"vertex"
    .style("fill", function(d) { return graphColor(d.probe_group) })
    .style("stroke", function(d) { return graphColor(d.probe_group) })
    .attr("cx", chromRingInnerRadius-20)
    .attr("r", 3)
    
    /*
    .on("mouseover", function(d) { 
      svg.selectAll("g circle")  //show degree as tooltip - title
             .filter(function(d) {
        return d.probe_group === allNodes[i].probe_group;
             })
      .append("title")
       .text(function(d) { return "degree: "  });
       })  
    */
	//.on("mouseover", fade(0))  //click mouseover mouseout
	/*//.on("mouseout", reset(1))  //see creat chart	
    .on("mousedown", function(g, i) { 
	 	//when mousedown this selected the probe_group and create the string_html to show in html the seleced data 
            
            sid= allNodes[i].probe_group;
            
            //histogram_degree_SNPs(file_json,sid);	
            
            string_html="{\"directed\": false, \"graph\": [], \"nodes\": [";
            
            json_nodes_selected(file_json,sid);	
            
            json_links_selected(file_json,sid);
             			
            })
     */
    		.on("click", function(d,i){
				
			var person=prompt("\n1) ClinVar\n2) dbSNP\n3) Ensembl\n4) PheGenI\n5) OMIM\n6) openSNP\n7) SNPedia\n8) UCSC");

			if (person!=null){
    			if("8"== person ){
    				html='http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position='+'chr'+allNodes[i].chrom+':'+ (allNodes[i].bp_position-1000)+'-'+(allNodes[i].bp_position+1000)
    	        }else if("6"== person ) {
    		    	html='http://opensnp.org/snps/'+allNodes[i].rs
    		}else if("2"== person ) {
    				
    				html='http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs='+allNodes[i].rs.substring(2)
    		}else if("4"== person ) {
    				
    				html='http://www.ncbi.nlm.nih.gov/gap/phegeni?tab=2&rs='+allNodes[i].rs.substring(2)
    		}else if("3"== person ) {    		
    				html='http://www.ensembl.org/Homo_sapiens/Variation/Summary?r='+allNodes[i].chrom+':'+(allNodes[i].bp_position-1000)+'-'+(allNodes[i].bp_position+1000) +';source=dbSNP;v=rs'+allNodes[i].rs.substring(2)+';vdb=variation'       
					 
    		}else if("7"== person ) {    		
    				html='http://www.snpedia.com/index.php/Rs'+allNodes[i].rs.substring(2)       
					 
    		}
    		else if("5"== person ) {    		
    				html='http://omim.org/search?index=entry&search=rs'+allNodes[i].rs.substring(2)       
					 
    		}
    		else if("1"== person ) {    		
    				html='http://www.ncbi.nlm.nih.gov/clinvar?term=rs'+allNodes[i].rs.substring(2)       
					 
    		}
      		window.open(html)
 			}	
		})
    
           
    .attr("transform", function(d) { 
        return "rotate(" + degrees(all_chrom.getAngle(d.chrom, d.bp_position)) + ")" });


//{"prbCode": "rs10205611", "degree": 1, 
//"rs": "rs10205611", "bp_position": 148853010, 
//"chrom": 2, "id": 0, "probe_group": 1, "prb": 0}
          
 svg.selectAll("g circle")  //show degree as tooltip - title
        //.filter(function(d) {
        //return d.probe_group === allNodes[i].probe_group;
        //     })
      .append("title")
      .text(function(d) { return "degree: " + two_dec(d.degree)+"\nSNP: "+d.rs 
      							+"\nprobe_group: "+ d.probe_group+"\nposition: " +d.bp_position});
         
         



//---------------------------------scale bar -----------------------------------------------

if(use_communities==="yes"){//check if there is communities in the json file



var margin = {top: 5, right: 50, bottom: 45, left: 10};

var w_scale_bar = 500- margin.left - margin.right;
var h_scale_bar = 65- margin.top - margin.bottom;
var barPadding = 0;


/*
var w_scale_bar = 500;
var h_scale_bar = 30;
var barPadding = 0;
*/
var dataset = d3.range(d3.min(links,function(d) {return n_edgs_in_comm(d.assoc_group,communities); }), 
                      //(d3.max(links,function(d) {return d.edgs_in_comm; })+d3.min(links,function(d) {return d.edgs_in_comm; }))/2); 
                        //d3.max(links,function(d) {return d.edgs_in_comm; })
                        100+1
                        );
//var dataset = d3.range(1,10)

 colorScaleedges = d3.scale.log()
                .domain([
                    d3.min(links,function(d) {return n_edgs_in_comm(d.assoc_group,communities) }),
                     
                    //(d3.max(links,function(d) {return d.edgs_in_comm; })+d3.min(links,function(d) {return d.edgs_in_comm; }))/2
                    //d3.max(links,function(d) {return d.edgs_in_comm; })
                    100    				
                    ])
                    //50])
                .interpolate(d3.interpolateHsl)
                //.range(["#08F5EC", "#F50808"]); //#003cff 01b900 39b9b8
                .range(["#3192C9", "#FF7000"]);//range(["#00b300", "#F50808"]);
    			


 colorScaleedges2 = d3.scale.linear()
                .domain([
                    d3.min(links,function(d) {return n_edgs_in_comm(d.assoc_group,communities) }),
                     
                    //(d3.max(links,function(d) {return d.edgs_in_comm; })+d3.min(links,function(d) {return d.edgs_in_comm; }))/2
                    //d3.max(links,function(d) {return d.edgs_in_comm; })    				
                    100
                    
                    ])
                    //50])
                .interpolate(d3.interpolateHsl)
                //.range(["#08F5EC", "#F50808"]); //#003cff 01b900 39b9b8
                .range(["#3192C9", "#FF7000"]);//range(["#00b300", "#F50808"]);

    			
            //Create SVG element to receive the scale color bar
            var svg3 = d3.select("#scale_bar_c")
                    .append("svg")
                //.attr("width", w_scale_bar)
                //.attr("height", h_scale_bar);
                
                   .attr("width", w_scale_bar + margin.left + margin.right)
                   .attr("height", h_scale_bar + margin.top + margin.bottom)
                   .append("g")
                   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg3.selectAll("rect")  //create color scale bar
               .data(dataset)
               .enter()
               .append("rect")
               .attr("x", function(d, i) {
               		return i * (w_scale_bar / dataset.length);
               })
               .attr("y", 0)
               .attr("width", w_scale_bar / dataset.length - barPadding)
               .attr("height", h_scale_bar)
               .style("opacity", 0.8)
               .attr("fill", function(d,i) {
     				 			return colorScaleedges2(d);
    						});
			
			
			
			
             svg3.selectAll(".text_scb")
               .data(dataset)
               .enter()
               .append("text") 
               .attr("class", "text_scb")
               .text(function(d) { 
               	
               	switch (d)
                    {
                        case 1:
                            return 1;
                            break;
                        case 25:
                            return 5;
                            break;
                        case 50:
                            return 10;
                            break;
                        case 75:
                            return 50;
                            break;
                        case 100:
                            return ">100";
                            break;	
                        }
               	
               	//if (1===d ||5===d || 10===d  || 50===d ||99===d)
               	//return 50; 
               	
               	})
               .attr("x", function(d, i) {
               		return i * (w_scale_bar / dataset.length);
               })
               .attr("y", 40)
               .attr("font-family", "sans-serif")
               .attr("font-size", "17.5px")
               .style("opacity", 0.8)    
               .style("font-weight", "bold")
               .attr("fill", function(d) {
               	switch (d)
                    {
                        case 1:
                            return colorScaleedges(1);
                            break;
                        case 25:
                            return colorScaleedges(5);
                            break;
                        case 50:
                            return colorScaleedges(10);
                            break;
                        case 75:
                            return colorScaleedges(50);
                            break;
                        case 100:
                            return colorScaleedges(101);
                            break;		
                        }
                        
                        //return colorScaleedges(d);
                    });
			
			

             d3.select("#min_num_scale_bar_c").selectAll("h1").remove(); //remove the old numbers of color scale
                d3.select("#min_num_scale_bar_c").selectAll("h1")        //create the new numbers of color scale
                .data([1])
                .enter().append("h1")
                .text(d3.min(links,function(d) {return n_edgs_in_comm(d.assoc_group,communities); }));
                
            d3.select("#max_num_scale_bar_c").selectAll("h1").remove(); //remove the old numbers of color scale
               d3.select("#max_num_scale_bar_c").selectAll("h1")           //create the new numbers of color scale
               .data([1])
               .enter().append("h1")
               .text( ">100");   			




}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ scale bar ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


    
    
    
    
    // Draw the edges  - the association between SNPs
 svg.selectAll("path.link")
    .data(links)
    .enter().append("path")
    .attr("class", "link")
    //.style("stroke", function(d) { return graphColor(d.probe_group ); })
    //.style("stroke", function(d) { return graphColor(d.edgs_in_comm); })
    
    .style("stroke", function(d) {		
        //if(d.edgs_in_comm >=100){
        
        if(use_communities==="yes"){ //check if there is communities in the json file
        		
        		
        	  if(n_edgs_in_comm(d.assoc_group,communities) >=100){
           		 return colorScaleedges(100); 
        		}else 
           	 //return colorScaleedges(d.edgs_in_comm); 
            		return colorScaleedges(n_edgs_in_comm(d.assoc_group,communities));
        }else{
        		
      		return graphColor(d.probe_group);
      		
           }
            
            
        })
    .style("stroke-width", 1)
    .style("opacity", 1)
    .style("fill", "none")
    .attr("d", link());

    
  

    //  use_communities="no"	//check if there is communities in the json file 
    

    
    
    
    
    
    
    // Write out the data in text
 d3.select("#snps").selectAll("p")
    .data(allNodes)
    .enter().append("p")


    .append("link").attr("href",function(d){
				
	/*return 'http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position='+
	'chr'+d.chrom+':'+d.label.substring(6).replace("k","000-")+d.bp_position  ;
*/
    return 'http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position='+'chr'+d.chrom+':'+ (d.bp_position-1000)+'-'+(d.bp_position+1000)  ;
            	
            })
            
            .attr("target","_blank")
            .style("text-decoration",'none')
            .style("color", '#000')
    .text(function(d) { return showSnp(d); });
    
/*
    
 d3.select("#pairs").selectAll("p")
 
    .data(links.sort(function (a, b) {
    	return b.STAT - a.STAT;

}
    	
    	
    ))
    .enter().append("p")
    //.append("link").attr("href","view_graph.html")
    .attr("target","_blank")
            .style("text-decoration",'none')
            .style("color", '#000')
    .text(function(d) { return showInteract(d); })
    
    
    .on("mousedown", function(g,i) { 
        
        d3.select("#table_snps").selectAll('table').remove();
        create_table_snps(links[i])
        
        //"roc_id":0 file_json "bd.json"
        d3.select("#rp").selectAll('svg').remove();
        //ROC_plot (links[i].roc_id,file_json)
        ROC_plot (links[i].ct_id,file_json)
        
        d3.select("#contp").selectAll('svg').remove();
        cont_plot (links[i].ct_id,file_json)        
        
        });
	 
*/	 

});

};



// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ create the circle plot ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^







// ------------------------   declaration of the functions to plot crhom. in circle  --------------------------------------

/**
 * Display the nodes and links for debugging   
 */
function showSnp(d)
{
    return "id:"+d.id+"    chr"+d.chrom+':'+d.bp_position + "    " + d.rs + " Subgraph:" + d.probe_group;

};

function showInteract(d)
{
	
	/*
	 prb_a: allNodes[links[i].source].prb,
  					prb_b: allNodes[links[i].target].prb,			
			        prbCode_a: allNodes[links[i].source].prbCode,
  					prbCode_b: allNodes[links[i].target].prbCode,			
			        browser_a: "chr"+allNodes[links[i].source].chrom+':'+allNodes[links[i].source].bp_position,
  					browser_b: "chr"+allNodes[links[i].target].chrom+':'+allNodes[links[i].target].bp_position,
		    	    rs_a: allNodes[links[i].source].rs,
		    	    rs_b: allNodes[links[i].target].rs,
		    	    id_links: i
	*/
	
	
	
    str= allNodes[d.source].rs+" "+
         allNodes[d.target].rs+" "+
         "chr"+allNodes[d.source].chrom+':'+allNodes[d.source].bp_position+" "+
         "chr"+allNodes[d.target].chrom+':'+allNodes[d.target].bp_position+" "
	
	
    for (var i in d ){		
        if (i!="assoc_group" &&  i!="ct_id" &&  i!= "source"  &&  i!= "target"){
            //statOptions[i]=i
            //st_1.push(i) //get the first element to be visualited
            
            str = str + i +": "+d[i]+" "
            }}
            	
    return str;
    
//"fltGSS_prtv": 0.65, "fltGSS": 17.62, "fltGSS_cntr": 17.62, "fltSS": 23.99, "fltDSS": 19.02, "fltChi2": 18.35}
    //return "Source: " + d.source + " Target: " + d.target+ " Weight: " + d.weight + " Subgraph: " + d.probe_group;
  
  //  return "Source: " + d.source + "  Target: " + d.target+ 
  //  "  fltGSS_prtv: " + d.fltGSS_prtv + "  fltGSS: " + d.fltGSS+
  //  "  fltGSS_cntr: " + d.fltGSS_cntr + "  fltSS: " + d.fltSS+
  //  "  fltDSS: " + d.fltDSS + "  fltChi2: " + d.fltChi2+ "  Subgraph: " + d.probe_group;
};

//Transform radians to degrees
function degrees(radians) {
    return radians / Math.PI * 180 - 90;
};

function tickValues(d, v) {
    //number of bases
    if ((d.endBase - d.startBase) < 50000) {
        return Math.round(d.startBase+(v/d.radPerBase))
    } else if ((d.endBase - d.startBase) < 50000000) {
        return Math.round((d.startBase+(v/d.radPerBase)) / 1000) + "Kb"
    } else {
        return Math.round((d.startBase+(v/d.radPerBase)) / 1000000) + "Mb"
    }
}

function groupTicks(d) {
    // Returns an array with objects of tick angles and labels 
    return d3.range(0, d.totAngle, 0.041 ).map(function(v, i) {
        return {
            angle: v + d.startAngle,
            label: i % 2 ? null : tickValues(d, v),
            index: d.index
        };
    });
};


// Link object for displaying interactions
function link() {
    var radius = chromRingInnerRadius-22;

    function link(d) {
    var startAngle = all_chrom.getAngle(allNodes[d.source].chrom, allNodes[d.source].bp_position),
    endAngle = all_chrom.getAngle(allNodes[d.target].chrom, allNodes[d.target].bp_position),
    offset = radius*(0.1*Math.min(allNodes[d.source].probe_group,9)-0.1);
    
    var startX = Math.sin(startAngle)*radius,
    startY = -Math.cos(startAngle)*radius,
    endX = Math.sin(endAngle)*radius,
    endY = -Math.cos(endAngle)*radius;
    
    var c1X = Math.sin(startAngle)*offset,
    c1Y = -Math.cos(startAngle)*offset,
    c2X = Math.sin(endAngle)*offset,
    c2Y = -Math.cos(endAngle)*offset;
    
    return "M" + startX + "," + startY
        + "C" + c1X + "," + c1Y
        + " " + c2X + "," + c2Y
        + " " + endX + "," + endY
    }
    return link;
};


// Returns an event handler for fading
function fade(opacity) {
    var sid;
     return function(g, i) {
    
    svg.selectAll("g circle")  //select the circles
             .filter(function(d) {
             	            	 
    	return d.probe_group != allNodes[i].probe_group ;
             })
        .transition()
             .style("opacity", opacity);
             
             
     svg.selectAll("g circle")  //show degree as tooltip - title
             .filter(function(d) {
        return d.probe_group === allNodes[i].probe_group;
             })
      .append("title")
       .text(function(d) { return "degree: " + two_dec(d.degree) });  
         
         
        
         
    svg.selectAll(".link") //select the association regarding to the circle selected
    			.filter(function(d) {
		return d.probe_group != allNodes[i].probe_group;
            }).remove();
       // .transition()
  		//	.style("opacity", opacity).remove();	
  
  
  
  
  
   d3.select("#snps").selectAll("p").remove(); //remove old text
   d3.select("#pairs").selectAll("p").remove(); //remove old text
  
    // Write out the data selected in text 
 d3.select("#snps").selectAll("p")  
    .data(allNodes)
    .enter().append("p")
    .filter(function(d) { 	return d.probe_group === allNodes[i].probe_group;   })
    .append("link").attr("href",function(d){	//link for UCSC genome browser for each snp (small circle) selected 			
    return 'http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position='+'chr'+d.chrom+':'+ (d.bp_position-1000)+'-'+(d.bp_position+1000)  ;				
    		})
    .attr("target","_blank")	
    .style("text-decoration",'none')	
    .style("color", function(d) {  //highlights the SNP selected
                    if (d.id != allNodes[i].id) {	
                    	return "black";
                    } else {
                    	return graphColor(d.probe_group);
                    }
                })      
	.text(function(d) { return showSnp(d); });
   
  

 d3.select("#pairs").selectAll("p")
	.data(links)
	.enter().append("p")
	.filter(function(d) {
		return d.probe_group === allNodes[i].probe_group;
            })
	.text(function(d) { 
		
	
		return showInteract(d); });
   

            
    };
};

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   declaration of the functions to plot crhom. in circle  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^









// ---------------------------------------- brush weight  --------------------------------------------

/**
 * this function create the brush on weight value to vizualizate SNPs association in specific weight range
 * @param {string} file_name
 */  
function brush_weight(file_name){ 

d3.json(file_name, function(json) {
    links = json.links;// var links = json.links;

	json.links.forEach(
		
	function(d) { data_weight_pvalue.push(d[st_chosen]) }   //data_weight_pvalue[]
    );
      	
	//Width and height
			var w = 500;
			var h = 300;
			var padding = 30;
							
		var dataset = data_weight_pvalue;
       //var dataset = dat;
       
       
			//Create scale functions
			var xScale = d3.scale.linear()
								 .domain([d3.min(dataset, function(d) { return d; })-1, d3.max(dataset, function(d) { return d; })+1])
								 //.range([padding, w - padding * 2]);
								.range([padding, w - padding * 2]);
            								
								
			var yScale = d3.scale.linear()
								 .domain([0, 0])
								 .range([h - padding-250, padding-250]);


			//Define X axis
			var xAxis = d3.svg.axis()
							  .scale(xScale)
							  .orient("bottom")
							  .ticks(8);

			//Create SVG element
			var svg2 = d3.select("#brush_weight")
						.append("svg")
						.attr("class", "weightPvalue")
						.attr("width", w)
						.attr("height", 50);

			//Create circles
	var circle2= svg2.selectAll("circle")
			   .data(dataset)
			   .enter()
			   .append("circle")
			   .attr("cx", function(d) {
			   		return xScale(d);
			   })
			   .attr("cy", function(d) {
			   		return yScale(0);
			   })
			   .attr("r", 2);
					
			//Create X axis
			svg2.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0," + (h - padding-250) + ")")
				.call(xAxis);
				
			svg2.append("g")
    		.attr("class", "brush")
    		.call(d3.svg.brush().x(xScale)
    		.on("brushstart", brushstart)
    		.on("brush", brushmove)
    		.on("brushend", brushend))
  			.selectAll("rect")
    		.attr("height", 40);	
	
			
function brushstart() { //selected de circles in x cordenate for diferent vizualization
  svg2.classed("selecting", true);
}

function brushmove() {
  var s = d3.event.target.extent(); //return 2 value that are the 1ª and 2ª position the brush on x coordenate
  circle2.classed("selected", function(d) { return s[0] <= d && d <= s[1]; }); //selected de circles in x cordenate for diferent vizualization
  
  d3.select("#two_weight_value").selectAll("h").remove(); //remove the old text
  d3.select("#two_weight_value").selectAll("h")           //create the new text
	.data([1])
	.enter().append("h")
	.text(two_dec(s[0])+" - "+two_dec(s[1]));
	
	brush_value1=s[0]
	brush_value2=s[1]
	
	
	d3.select("#chart").selectAll(".link").transition().style("opacity", 1);	
	//svg.selectAll(".link").remove(); //remove the old association
	//reset_association();			 //create the new association
	   
	svg.selectAll(".link") // this declaretion selected the association between specifics  weight values 
   			//.filter(function(d) { return  d[st_chosen]  <=  s[0]	|| d[st_chosen] >=s[1];  }).remove();	
   				.filter(function(d) { return  d[st_chosen]  <=  s[0]	|| d[st_chosen] >=s[1];  })
   				.transition().style("opacity", 0);
   			

   	 d3.select("#chart") 	
		.selectAll("g circle")
   		.transition()
  	     .style("opacity", 0);
   	 
   	 
   	 
   	 
   	 
   	 d3.select("#chart") 
   	 .selectAll("g circle")
	.filter(function(d,i) {		
    	if (include_in_arr(nodes_selected(s[0],s[1]),i)){  // nodes_selected (s[0],s[1]) )
    			return d;
    			}})
	    .transition()
            .style("opacity", 1);








	
		
 d3.select("#snps").selectAll("p").remove(); //remove old text
 
    // Write out the data selected in text 
 d3.select("#snps").selectAll("p")  
	.data(allNodes)
	.enter().append("p")
	.filter(function(d,i) {		
    	if (include_in_arr(nodes_selected(s[0],s[1]),i)){  // nodes_selected (s[0],s[1]) )
    			return d;
    			}})
	//.filter(function(d) { 	return d.probe_group === data_obj[i].n_probe_group;   })
	.append("link").attr("href",function(d){	//link for UCSC genome browser for each snp (small circle) selected 			
	return 'http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position='+'chr'+d.chrom+':'+ (d.bp_position-1000)+'-'+(d.bp_position+1000)  ;		
			})
	.attr("target","_blank")	
	.style("text-decoration",'none')	
    .style("color", "black")      
	.text(function(d) { return showSnp(d); });


	
//brush selecte the pairs 	
d3.select("#pairs").selectAll("p").remove(); 

d3.select("#pairs").selectAll("p")
	.data(links)
	.enter().append("p")	
	.text(function(d) { 	
		return showInteract(d); });   			
   			
d3.select("#pairs").selectAll("p")
   			.filter(function(d) { return   d[st_chosen]  <=  s[0]	|| d[st_chosen] >=s[1];  }).remove();	 			
   			
   			
   			
   			
}

function brushend() { //selected de circles in x cordenate for diferent vizualization
  svg2.classed("selecting", !d3.event.target.empty());
}
	

 	
	
});

};
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ brush weight  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^







