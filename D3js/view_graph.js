
var width = 800,
height = 800,
//chromRingOuterRadius = Math.min(width, height) * .49,
//chromRingInnerRadius = chromRingOuterRadius * 0.95;

chromRingOuterRadius = Math.min(width, height) * .45,
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


function Create_SVG_chart(){
//Create SVG element
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


//******************* ticks on chromosome       

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
    

//*******************  end
		



};


function transition_data(filename){




// Plot nodes and links for the default dataset
d3.json(filename, function(json) {
    var links = json.links;

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
	.on("click", fade(0))
	.on("mouseout", fade(1))
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
	.text(function(d) { return showSnp(d); });
    
 text_showInteract =    d3.select("#pairs").selectAll("p")
	.data(links)
	.enter().append("p")
	.text(function(d) { return showInteract(d); });
});

};


//******************* merge to one html with radio buttons (see view_graph.html)



Create_SVG_chart();
transition_data("bdWTC.json");

		
d3.selectAll("input").on("change", function change() {
			
			
			
			
  //svg.selectAll(".vertex").transition()  //erro
  //.duration(1000) // this is 1s
  //.delay(100)  
  //.style("opacity", 0).remove();			
  	
  // svg.selectAll(".link").transition()
  //.duration(1000) // this is 1s
  //.delay(100)  
  //.style("opacity", 0).remove();	
  
  //svg.selectAll(".vertex").remove();
  //svg.selectAll(".link").remove();
  
  
   //d3.select("#chart").selectAll('svg').remove(); //ok
   
   
   d3.select("#chart").selectAll('svg').transition()
  .duration(1000) // this is 1 second 
  .delay(100)  
  .style("opacity", 0).remove();
  
   //svg.selectAll(".ticks").transition()
   //       .duration(340)
   //       .attr("opacity", 1);	
  	
  			
  			Create_SVG_chart();
  			transition_data(this.id+".json");
  			
  		
 
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
	svg.selectAll("g circle")
            .filter(function(d) {
		return d.subgraph_id != allNodes[i].subgraph_id;
            })
	    .transition()
            .style("opacity", opacity);
    };
};


// Returns an array with objects of tick angles and labels 
 
function groupTicks(d) {
  var k = (d.endAngle - d.startAngle) / d.value;    // number of bases scaled to factor for K
  return d3.range(0, d.value, 0.05 ).map(function(v, i) {  //modification 0.05
    return {
      angle: v * k + d.startAngle,
      label: i % 2 ? null : Math.round((v/d.factor_k) / 1000000) + "Mb"  //number of bases 
    };
  });
};

