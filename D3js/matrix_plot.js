

var data_obj_m=[];

var array_SNPs=[]



function  read_file_to_matrix_plot(file_name) {
	//this function read a .json to inicialaze the variables and call the function manhattan_plot() to craete the manhattan plot
	
var allNodes= new Array();

var dic_chr={};

var n_idx=0;
data_obj_m=[];
array_SNPs=[];

d3.json(file_name, function(json) {
	
	 var  links = json.links;

 json.nodes.forEach( 	
 	function(d) { 
 		
 	   allNodes.push(d) 		
       array_SNPs.push("chr"+d.chrom+':'+d.bp_position)
       dic_chr["chr"+d.chrom+':'+d.bp_position]=n_idx
       n_idx++
       
       });
    
 json.links.forEach(
 			
	function(d) {

		//create an array with objects representing the SNP associations		
		data_obj_m.push(creat_obj(dic_chr["chr"+allNodes[d.source].chrom+':'+allNodes[d.source].bp_position], 
								dic_chr["chr"+allNodes[d.target].chrom+':'+allNodes[d.target].bp_position]));
										});


function creat_obj(labelx,labely ){
	var obj={};
	obj.label_x  = labelx;
	obj.label_y  =labely;
	return obj;
}
       	
      	mix_1=0;
      	mix_2=array_SNPs.length;
      	miy_1=0;
      	miy_2=array_SNPs.length;
      	
     	
     	//alert("oi")
matrix_plot_minmap(mix_1,mix_2,miy_1,miy_2,0,0,0,0)
matrix_plot(mix_1,mix_2,miy_1,miy_2)

});

}














function matrix_plot( x1,x2,y1,y2){
// this function create the matrix show each SNPs association




var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 900 - margin.left - margin.right, //500
    height = 900 - margin.top - margin.bottom;//200






var x = d3.scale.linear().domain([x1,x2])//[0,array_SNPs.length])
	.range([0, width]);
    
var y = d3.scale.linear().domain([y1,y2])//[0,array_SNPs.length])	
    .range([0, width]);
  
 
var x_inv = d3.scale.ordinal().domain([0, width] )
	.range(array_SNPs);
    
var y_inv = d3.scale.ordinal().domain([0, width])	
    .range(array_SNPs);
 
 
 
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




/*   //possible solution to fix the dots outside axis x and y
 var data_test=[]
 
 for(var i in data_obj_m ){
 	
 	if((x1<= (data_obj_m[i].label_x) && (data_obj_m[i].label_x)<=x2) &&  
 	   (y1<= (data_obj_m[i].label_y) && (data_obj_m[i].label_y)<=y2)){
 	   	
 	   	data_test.push(data_obj_m[i]);
 		
 	}
 	
 }  
  */ 
    
    
    
    
svg.selectAll("path1")
    .data(data_obj_m)
  .enter().append("svg:path")
 /* .filter(function(d) {
  	
		return d;// (x1<= x(d.label_x) && x(d.label_x)<=x2) ;//&&  (y1<=y(d.label_y) && y(d.label_y)<=y2);// x(d.label_x) > 100; 
		
            })
            */
   .style("fill", '#0d1dee') //blue
    .attr("transform", function(d) { return "translate(" + x(d.label_x) + "," + y(d.label_y) + ")"; })
    .attr("d", d3.svg.symbol().type("square").size("30"));
    

svg.selectAll("path2")
    .data(data_obj_m)
  .enter().append("svg:path")
  /* .filter(function(d) {
  	
		return d;// (x1<= x(d.label_x) && x(d.label_x)<=x2) ;//&&  (y1<=y(d.label_y) && y(d.label_y)<=y2);// x(d.label_x) > 100; 
		
            })
            */
  .style("fill", '#0d1dee') //blue
    .attr("transform", function(d) { return "translate(" + x(d.label_y) + "," + y(d.label_x) + ")"; })
    .attr("d", d3.svg.symbol().type("square").size("30"));    
    
    
 

svg.append("g")
      .attr("class", "xmat axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
     
svg.selectAll(".xmat text")  // select all the text elements for the xaxis
          .attr("transform", function(d) {
             return "translate(" + this.getBBox().height*-1 + "," + this.getBBox().height*1.5 + ")rotate(-90)";
         });     
     

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

			
			
			svg.append("g")
    			.attr("class", "brush")
    			.call(d3.svg.brush().x(x).y(y)
    			.on("brushstart", brushstart)
    			.on("brush", brushmove)
    			.on("brushend", brushend));


function brushstart() {
  svg.classed("selecting", true);
}

function brushmove() {
  var e = d3.event.target.extent();
  
  /*
  circle.classed("selected", function(d) {
    return e[0][0] <= d[0] && d[0] <= e[1][0] 
        && e[0][1] <= d[1] && d[1] <= e[1][1];
  });
*/

  mx_1=e[0][0];
  mx_2=e[1][0];
  my_1=e[0][1];
  my_2=e[1][1];


  d3.select("#two_weight_value_test").selectAll("h").remove(); //remove the old text
  d3.select("#two_weight_value_test").selectAll("h")           //create the new text
	.data([1])
	.enter().append("h")
	//.text(x_inv(mx_1)+" - "+x_inv(mx_2)+" - "+y_inv(my_1)+" - "+y_inv(my_2));
.text((mx_1)+" - "+(mx_2)+" - "+(my_1)+" - "+(my_2));

}

function brushend() {
  svg.classed("selecting", !d3.event.target.empty());
}    



//});
}





















function matrix_plot_minmap( x1,x2,y1,y2, mrect_x1, mrect_y1, mrect_x2, mrect_y2){
// this function create the matrix show each SNPs association




var margin = {top: 30, right: 30, bottom: 30, left: 30},
    width = 250 - margin.left - margin.right, //500
    height = 250 - margin.top - margin.bottom;//200






var x = d3.scale.linear().domain([x1,x2])//[0,array_SNPs.length])
	.range([0, width]);
    
var y = d3.scale.linear().domain([y1,y2])//[0,array_SNPs.length])	
    .range([0, width]);
  
 
var x_inv = d3.scale.ordinal().domain([0, width] )
	.range(array_SNPs);
    
var y_inv = d3.scale.ordinal().domain([0, width])	
    .range(array_SNPs);
 
 
 
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");


var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#minmap_matrixp").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




/*   //possible solution to fix the dots outside axis x and y
 var data_test=[]
 
 for(var i in data_obj_m ){
 	
 	if((x1<= (data_obj_m[i].label_x) && (data_obj_m[i].label_x)<=x2) &&  
 	   (y1<= (data_obj_m[i].label_y) && (data_obj_m[i].label_y)<=y2)){
 	   	
 	   	data_test.push(data_obj_m[i]);
 		
 	}
 	
 }  
  */ 
    
    
    
    
svg.selectAll("path1")
    .data(data_obj_m)
  .enter().append("svg:path")
 /* .filter(function(d) {
  	
		return d;// (x1<= x(d.label_x) && x(d.label_x)<=x2) ;//&&  (y1<=y(d.label_y) && y(d.label_y)<=y2);// x(d.label_x) > 100; 
		
            })
            */
   .style("fill", '#0d1dee') //blue
    .attr("transform", function(d) { return "translate(" + x(d.label_x) + "," + y(d.label_y) + ")"; })
    .attr("d", d3.svg.symbol().type("square").size("5"));
    

svg.selectAll("path2")
    .data(data_obj_m)
  .enter().append("svg:path")
  /* .filter(function(d) {
  	
		return d;// (x1<= x(d.label_x) && x(d.label_x)<=x2) ;//&&  (y1<=y(d.label_y) && y(d.label_y)<=y2);// x(d.label_x) > 100; 
		
            })
            */
  .style("fill", '#0d1dee') //blue
    .attr("transform", function(d) { return "translate(" + x(d.label_y) + "," + y(d.label_x) + ")"; })
    .attr("d", d3.svg.symbol().type("square").size("5"));    
    
 
 
 
 
	if (mrect_x1!=0 && mrect_y1!=0 && mrect_x2!=0 && mrect_y2!=0 ){
		
			svg.selectAll("rect")  //create color scale bar
			   .data([0])
			   .enter()
			   .append("rect")
			   .attr("x", x(mrect_x1))
			   .attr("y", y(mrect_y1))
			   .attr("width",x(mrect_x2))
			   .attr("height", y(mrect_y2)-y(mrect_y1))   //  yScale(rect_y2)-yScale(rect_y1) rgb(0,0,255) "rgba(255, 255, 0, 0.1)"
			   .attr("fill", "rgba(255, 0, 0, 0.1)")
			   .attr("stroke", "rgba(255, 0, 0, 1)")
			   .attr("stroke-width", "5");
			   
	}   
 
 
 
 
 
 
 

svg.append("g")
      .attr("class", "xmat axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
     
svg.selectAll(".xmat text")  // select all the text elements for the xaxis
          .attr("transform", function(d) {
             return "translate(" + this.getBBox().height*-1 + "," + this.getBBox().height*1.5 + ")rotate(-90)";
         });     
     

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

			
		


//});
}









