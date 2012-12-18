


var width = 800,
height = 800,
//chromRingOuterRadius = Math.min(width, height) * .49,  //old adjustment
//chromRingInnerRadius = chromRingOuterRadius * 0.95;

chromRingOuterRadius = Math.min(width, height) * .45,   //new adjustment
chromRingInnerRadius = chromRingOuterRadius * 0.95;


// TODO: change to function reading from ucsc_colour.csv
var color = new Array(d3.rgb(153,102,0), d3.rgb(102,102,0), d3.rgb(153,153,30), d3.rgb(204,0,0), 
		      d3.rgb(255,0,0), d3.rgb(255,0,204), d3.rgb(255,204,204), d3.rgb(255,153,0),
		      d3.rgb(255,204,0),d3.rgb(255,255,0),d3.rgb(204,255,0),d3.rgb(0,255,0),
		      d3.rgb(53,128,0),d3.rgb(0,0,204),d3.rgb(102,153,255),d3.rgb(153,204,255),
		      d3.rgb(0,255,255),d3.rgb(204,255,255),d3.rgb(153,0,204),d3.rgb(204,51,255),
		      d3.rgb(204,153,255),d3.rgb(102,102,102),d3.rgb(153,153,153),d3.rgb(204,204,204));

var graphColor = d3.scale.category10();

var svg ;
var all_chrom;
var allNodes ;

var data_weight_pvalue;

var links;

var file_json;

function Create_SVG_chart(){  
	// function to Create SVG element , to Plot the chromosomes in a circle and the ticks on chromosome   
	
	
 svg = d3.select("#chart")  // Selects  the element with id="chart"
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");  //This transform moves the element by pixels in both the X and Y directions.

// Plot the chromosomes in a circle
 all_chrom = Genome();

// Global variable for all the vertices
 allNodes = new Array();

data_weight_pvalue= new Array();


svg.selectAll("path")
    .data(all_chrom.chromosomes()) // it'll return chromosomes[] with objects content information about each chromosomes
    .enter()                       //in each object has information such as angle 
    .append("path")
    .attr("class", "ring")
    .style("fill", function(d) { return color[d.index]; })
    .style("stroke", function(d) { return color[d.index]; })
    .attr("d", d3.svg.arc().innerRadius(chromRingInnerRadius).outerRadius(chromRingOuterRadius)); //read angles of each object in chromosomes[]


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
		+ "rotate(180)translate(-16)";}
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
    });

ticks.append("line")
    .attr("x1", 1)
    .attr("y1", 0)
    .attr("x2", 5)
    .attr("y2", 0)
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
    .text(function(d) { return d.label; });    
    

// when we click in chart it declaration below will reset the chart using the function reset		

d3.select("#chart").selectAll('svg').on("click", reset(1));

};


function transition_data(filename){
//this function create all associations betewen the SNPs


// Plot nodes and links for the default dataset
d3.json(filename, function(json) {
    links = json.links;// var links = json.links;

	//json.links.forEach(
	//function(d) { data_weight_pvalue.push(d.weight) }   //data_weight_pvalue[]
    //);
   
    

    json.nodes.forEach(
	function(d) { allNodes.push(d) }   //allNodes[]
    );


    // Draw the marks for each snp   - small marks in chromosomes 
  svg.selectAll("path.vertex")
	.data(allNodes)
	.enter().append("path")
	.attr("class", "vertex") //"vertex"
	.style("fill", function(d) { return color[d.chrom-1]; })
	.style("stroke", function(d) { return color[d.chrom-1]; })
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
	.style("fill", function(d) { return graphColor(d.subgraph_id) })
	.style("stroke", function(d) { return graphColor(d.subgraph_id) })
	.attr("cx", chromRingInnerRadius-20)
	.attr("r", 3)
	.on("mouseover", fade(0))  //click mouseover mouseout
	//.on("mouseout", reset(1))  //see creat chart
	.attr("transform", function(d) { 
	    return "rotate(" + degrees(all_chrom.getAngle(d.chrom, d.bp_position)) + ")" });

    
    // Draw the edges
 svg.selectAll("path.link")
	.data(links)
	.enter().append("path")
	.attr("class", "link")
	.style("stroke", function(d) { return graphColor(d.subgraph_id); })
	.style("stroke-width", 1)
	.style("opacity", 0.3)
	.style("fill", "none")
	.attr("d", link());

    
    
    // Write out the data in text
 d3.select("#snps").selectAll("p")
	.data(allNodes)
	.enter().append("p")
	.append("link").attr("href",function(d){
				
	return 'http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position='+
	'chr'+d.chrom+':'+d.label.substring(6).replace("k","000-")+d.bp_position  ;
				
			})
			.attr("target","_blank")
			.style("text-decoration",'none')
			.style("color", '#000')
	.text(function(d) { return showSnp(d); });
	
	
    
 d3.select("#pairs").selectAll("p")
	.data(links)
	.enter().append("p")
	.text(function(d) { return showInteract(d); });
	
	
});




};




function brush_weight(filename){
//this function create brush_weight


// Plot nodes and links for the default dataset
d3.json(filename, function(json) {
    links = json.links;// var links = json.links;

	json.links.forEach(
	function(d) { data_weight_pvalue.push(d.weight) }   //data_weight_pvalue[]
    );
     

  	
	//Width and height
			var w = 500;
			var h = 300;
			var padding = 30;
			
		
			
		var dataset = data_weight_pvalue;
       //var dataset = dat;
       
       
			//Create scale functions
			var xScale = d3.scale.linear()
								 .domain([0, d3.max(dataset, function(d) { return d; })])
								 //.range([padding, w - padding * 2]);
								.range([padding, w - padding * 2]);
          	
          
								
								
			var yScale = d3.scale.linear()
								 .domain([0, 0])
								 .range([h - padding-250, padding-250]);


			//Define X axis
			var xAxis = d3.svg.axis()
							  .scale(xScale)
							  .orient("bottom")
							  .ticks(5);

			//Create SVG element
			var svg2 = d3.select("body")
						.append("svg")
						.attr("class", "weightPvalue")
						.attr("width", w)
						.attr("height", h);

			//Create circles
	var circle2=		svg2.selectAll("circle")
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
			
function brushstart() {
  svg2.classed("selecting", true);
}

function brushmove() {
  var s = d3.event.target.extent();
  circle2.classed("selected", function(d) { return s[0] <= d && d <= s[1]; });
  
  d3.select("#teste").selectAll("p").remove();
  d3.select("#teste").selectAll("p")
	.data([1])
	.enter().append("p")
	.text((s[0])+"  "+(s[1]));
	
	//reset(1);
	
	 		 //d3.select("#chart").selectAll('svg').remove(); //ok
   			 //d3.select("#snps").selectAll("p").remove(); //ok
   			 //d3.select("#pairs").selectAll("p").remove(); //ok
   			 //d3.select("body").selectAll('svg').remove(); //ok	
   				
  			//Create_SVG_chart();
  			//transition_data(file_json); 
			//brush_weight(file_json);
	svg.selectAll(".link").remove();
	reset_association();
	 //    IMP    - acho que devo usar esta declaração para selecionar as associações entre os especificados p-values  
	svg.selectAll(".link") //select the association regarding to the circle selected
   			.filter(function(d) {
		//return  s[0]<= d.weight && d.weight <=s[1];
		return   d.weight  <=  s[0]	||  d.weight >=s[1];	
            }).remove();
	
	
	
  
}

function brushend() {
  svg2.classed("selecting", !d3.event.target.empty());
}
	
	
	
function reset_association(){
	 
    // Draw the edges
 svg.selectAll("path.link")
	.data(links)
	.enter().append("path")
	.attr("class", "link")
	.style("stroke", function(d) { return graphColor(d.subgraph_id); })
	.style("stroke-width", 1)
	.style("opacity", 0.3)
	.style("fill", "none")
	.attr("d", link());
	
} 	
	
	
});


};





// create the first vizualization with "bdWTC.json" like default


Create_SVG_chart();
transition_data("bdWTC.json");
file_json="bdWTC.json";
brush_weight("bdWTC.json");

//******************* merge to one html with radio buttons 		
d3.selectAll("input").on("change", function change() {
			
   d3.select("#chart").selectAll('svg').remove(); //ok
   d3.select("#snps").selectAll("p").remove(); //ok
   d3.select("#pairs").selectAll("p").remove(); //ok
   //weightPvalue	
   d3.select("body").selectAll('svg').remove(); //ok			
	//d3.select("#slider-range-max").remove(); //ok
			
  			file_json=this.id+".json";
  			Create_SVG_chart();
  			transition_data(this.id+".json");
  			//slider_weight();
  			brush_weight(this.id+".json");
 
  			
});						
 

//*******************  end




// Display the nodes and links for debugging
function showSnp(d)
{
    return d.label + " rs:" + d.rs + " Subgraph:" + d.subgraph_id;
//    return d.label 
//	+ " Chromosome: " + d.chrom + " Position:" + d.bp_position
//	+ " rs:" + d.rs + " Subgraph:" + d.subgraph_id;
};

function showInteract(d)
{
    return "Source: " + d.source + " Target: " + d.target
	+ " Weight: " + d.weight + " Subgraph: " + d.subgraph_id;
};

//Transform radians to degrees
function degrees(radians) {
    return radians / Math.PI * 180 - 90;
};


// Link object for displaying interactions
function link() {
    var genome = Genome(),
    radius = chromRingInnerRadius-22;

    function link(d) {
	var startAngle = genome.getAngle(allNodes[d.source].chrom, allNodes[d.source].bp_position),
	endAngle = genome.getAngle(allNodes[d.target].chrom, allNodes[d.target].bp_position),
	offset = radius*(0.1*Math.min(allNodes[d.source].subgraph_id,9)-0.1);

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
    return function(g, i) {
	svg.selectAll("g circle")  //select the circles
            .filter(function(d) {
		return d.subgraph_id != allNodes[i].subgraph_id;
            })
	    .transition()
            .style("opacity", opacity);
            
            
    svg.selectAll("g circle")  //show degree as tooltip - title
            .filter(function(d) {
		return d.subgraph_id === allNodes[i].subgraph_id;
            })
	  .append("title")
      .text(function(d) { return "degree: " +d.degree });        
            
            
         //    IMP    - acho que devo usar esta declaração para selecionar as associações entre os especificados p-values
   svg.selectAll(".link") //select the association regarding to the circle selected
   			.filter(function(d) {
		return d.subgraph_id != allNodes[i].subgraph_id;
            }).remove();
       // .transition()
  		//	.style("opacity", opacity).remove();	
  
   d3.select("#snps").selectAll("p").remove(); //remove old text
   d3.select("#pairs").selectAll("p").remove(); //remove old text
  
    // Write out the data selected in text 
 d3.select("#snps").selectAll("p")  
	.data(allNodes)
	.enter().append("p")
	.filter(function(d) { 	return d.subgraph_id === allNodes[i].subgraph_id;   })
	.append("link").attr("href",function(d){	//link for UCSC genome browser for each snp (small circle) selected 			
	return 'http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position='+
	'chr'+d.chrom+':'+d.label.substring(6).replace("k","000-")+d.bp_position  ;				
			})
	.attr("target","_blank")	
	.style("text-decoration",'none')	
    .style("color", function(d) {  //highlights the SNP selected
					if (d.id != allNodes[i].id) {	
						return "black";
					} else {
						return graphColor(d.subgraph_id);
					}
				})      
	.text(function(d) { return showSnp(d); });
    
    
 d3.select("#pairs").selectAll("p")
	.data(links)
	.enter().append("p")
	.filter(function(d) {
		return d.subgraph_id === allNodes[i].subgraph_id;
            })
	.text(function(d) { return showInteract(d); });
   
            
    };
};


function reset(opacity) {
	//this function recreate the datas 
    return function(g, i) {
    /*	
	svg.selectAll("g circle") //acho q isso nao eh necessario pois eu estou recriando tudo novamente
            .filter(function(d) {
		return d.subgraph_id != allNodes[i].subgraph_id;
            })
	    .transition()
            .style("opacity", opacity);
      */      
            
             d3.select("#chart").selectAll('svg').remove(); //ok
   			 d3.select("#snps").selectAll("p").remove(); //ok
   			 d3.select("#pairs").selectAll("p").remove(); //ok
   			 d3.select("body").selectAll('svg').remove(); //ok	
   				
  			Create_SVG_chart();
  			transition_data(file_json);        
            brush_weight(file_json);
            
            
    };
};


// Returns an array with objects of tick angles and labels 
 
function groupTicks(d) {
  var k = (d.endAngle - d.startAngle) / d.value;    // number of bases scaled to factor for K
  return d3.range(0, d.value, 0.041 ).map(function(v, i) {  //modification 0.05
    return {
      angle: v * k + d.startAngle,
      label: i % 2 ? null : Math.round((v/d.factor_k) / 1000000) + "Mb"  //number of bases 
    };
  });
};

