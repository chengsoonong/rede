

function matrix_plot( file_name){
// this function create the matrix show each SNPs association

var margin = {top: 90, right: 150, bottom: 90, left: 100},
    width = 800 - margin.left - margin.right, //500
    height = 800 - margin.top - margin.bottom;//200

var allNodes= new Array();

var data_obj=[];

d3.json(file_name, function(json) {
	
	 var  links = json.links;

 json.nodes.forEach(
 	 	
 	function(d) { 
 		
 		allNodes.push(d)
 		 
 		});
    
  
 json.links.forEach(
 			
	function(d) {

		//create an array with obj. representing the SNP associations		
		data_obj.push(creat_obj("chr"+allNodes[d.source].chrom+':'+allNodes[d.source].bp_position, 
								"chr"+allNodes[d.target].chrom+':'+allNodes[d.target].bp_position));
										});


function creat_obj(labelx,labely ){
	var obj={};
	obj.label_x  = labelx;
	obj.label_y  =labely;
	return obj;
}
 
 
 //create an array with each SNPs, here each SNP apear 1 time
var array_SNPs = allNodes.map(function(d) { return "chr"+d.chrom+':'+d.bp_position; });

//create the domain x and y with all SNPs 
var x = d3.scale.ordinal().domain(array_SNPs )
	.rangeRoundBands([0, width], .5, 1);
    
var y = d3.scale.ordinal().domain( array_SNPs)	
    .rangeRoundBands([0, width], .5, 1);
  
 
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");


var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    
   svg.selectAll(".bar") //plot the data in a side of the matrix, because the matrix is symmetric
      .data(data_obj)
      .enter().append("rect")
      .attr("class", "bar_matrix")
      .attr("x", function(d) { return x(d.label_x); })
      .attr("width", x.rangeBand())
      //.attr("width", 10)
      .attr("y", function(d) { return y(d.label_y); })
      .attr("height", x.rangeBand())
      //.attr("height", 10)
      ;
      
     svg.selectAll(".bar2") //plot the data in another side of the matrix, because the matrix is symmetric
      .data(data_obj)
      .enter().append("rect")
      .attr("class", "bar_matrix")
      .attr("x", function(d) { return x(d.label_y); })
      .attr("width", x.rangeBand())
      //.attr("width", 10)
      .attr("y", function(d) { return y(d.label_x); })
      .attr("height", x.rangeBand())
      //.attr("height", 10)
      
     
      
      ;    
      
   /*
 svg.selectAll(".text_b")
			   .data(data_obj)
			   .enter()
			   .append("text") 
			   .attr("class", "text_b")
			   .text(function(d,i) { return i; })
			  // .attr("text-anchor", "middle")
			   .attr("x",function(d) { return x(d.label_x); })
			   .attr("y",20)
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
			   .attr("fill", "black")//.attr("transform", "rotate(-90)")
			   ;
*/
      
/*
 svg.selectAll(".text_c")
			   .data(data_obj)
			   .enter()
			   .append("text") 
			   .attr("class", "text_c")
			   .text(function(d) { return d.label; })
			  // .attr("text-anchor", "middle")
			   .attr("x",function(d) { return x(d.label); })
			   .attr("y",40)
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
			   .attr("fill", "black")
			   ;     
*/
svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
     ;
     
svg.selectAll(".x text")  // select all the text elements for the xaxis
          .attr("transform", function(d) {
             return "translate(" + this.getBBox().height*-1 + "," + this.getBBox().height*4 + ")rotate(-90)";
         });     
     

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    ;

svg.append("g")
    			.attr("class", "brush")
    			.call(d3.svg.brush().x(x).y(x)
    			.on("brushstart", brushstart)
    			.on("brush", brushmove)
    			.on("brushend", brushend));


function brushstart() {
  svg.classed("selecting", true);
}

function brushmove() {
  var e = d3.event.target.extent();
  circle.classed("selected", function(d) {
    return e[0][0] <= d[0] && d[0] <= e[1][0] 
        && e[0][1] <= d[1] && d[1] <= e[1][1];
  });


  x_1=e[0][0];
  x_2=e[1][0];
  y_1=e[0][1];
  y_2=e[1][1];


}

function brushend() {
  svg.classed("selecting", !d3.event.target.empty());
}    



});
}



