





function  read_file_to_manhattan_plot(file_name) {
	//this function read a .json to inicialaze the variables and call the function manhattan_plot() to craete the manhattan plot
	
data = new Array();
allNodes= new Array();
data_weight_pvalue= new Array();
		
	
d3.json(file_name, function(json) {
   var  links = json.links;// var links = json.links;


 json.nodes.forEach( 	function(d) { allNodes.push(d) }    );
  
	json.links.forEach(
		
	function(d) { //this will fill with data the array
		
		data_weight_pvalue.push(d.weight); 
		
	
		if (allNodes[d.source].chrom===1){         //"chr"+d.chrom+':'+d.bp_position

			data.push([allNodes[d.source].bp_position,d.weight,allNodes[d.source].degree ,"chr"+allNodes[d.source].chrom+':'+allNodes[d.source].bp_position ]);	
		
		}else{
			
			data.push([allNodes[d.source].bp_position +chrom_acum_length[allNodes[d.source].chrom-2] ,d.weight,allNodes[d.source].degree,"chr"+allNodes[d.source].chrom+':'+allNodes[d.source].bp_position ]);
		}
		
		if (allNodes[d.target].chrom===1){
			
			data.push([allNodes[d.target].bp_position,d.weight,allNodes[d.target].degree,"chr"+allNodes[d.target].chrom+':'+allNodes[d.target].bp_position ]);	
		
		}else{
			data.push([allNodes[d.target].bp_position +chrom_acum_length[allNodes[d.target].chrom-2] ,d.weight,allNodes[d.target].degree,"chr"+allNodes[d.target].chrom+':'+allNodes[d.target].bp_position]);
		}
		
		});
      	
      	ix_1=0;
      	ix_2=chrom_lenght;
      	iy_1=d3.min(data_weight_pvalue, function(d) { return d; })-1;
      	iy_2=d3.max(data_weight_pvalue, function(d) { return d; })+1;
      	
manhattan_plot(0, chrom_lenght,d3.min(data_weight_pvalue, function(d) { return d; })-1, d3.max(data_weight_pvalue, function(d) { return d; })+1);
});

}





//******************************************************************************


function manhattan_plot(x1,x2,y1,y2){
//creat the manhataan plot

var margin = {top: 20, right: 10, bottom: 20, left: 10};
//Then define width and height as the inner dimensions of the chart area.


			var w = 900 ;//- margin.left - margin.right;//900;
			var h = 600 ;//- margin.top - margin.bottom;//600;
			var padding = 30;
			
			var w_scale_bar = 500;
			var h_scale_bar = 30;
			var barPadding = 0;
		
//--------------------------- create color scale  --------------------------------------------------

			var dataset = d3.range(d3.min(data,function(d) {return d[2]; }), d3.max(data,function(d) {return d[2]; }));
			
			var colorScale = d3.scale.log()
    			.domain([d3.min(data,function(d) {return d[2]; }), d3.max(data,function(d) {return d[2]; })])
    			.interpolate(d3.interpolateHsl)
    			//.range(["#08F5EC", "#F50808"]);//39b9b8 00b300 00a166
    			.range(["#00b300", "#F50808"]);
			
			//Create SVG element to receive the scale color bar
			var svg3 = d3.select("#scale_bar")
						.append("svg")
						.attr("width", w_scale_bar)
						.attr("height", h_scale_bar);

			svg3.selectAll("rect")  //create color scale bar
			   .data(dataset)
			   .enter()
			   .append("rect")
			   .attr("x", function(d, i) {
			   		return i * (w_scale_bar / dataset.length);
			   })
			   .attr("y", 0)
			   .attr("width", w_scale_bar / dataset.length - barPadding)
			   .attr("height", 100)
			   .attr("fill", function(d,i) {
     				 return colorScale(d);
    });
			
			 d3.select("#min_num_scale_bar").selectAll("h1").remove(); //remove the old numbers of color scale
  				d3.select("#min_num_scale_bar").selectAll("h1")        //create the new numbers of color scale
				.data([1])
				.enter().append("h1")
				.text(two_dec( d3.min(data,function(d) {return d[2]; })));
			
			d3.select("#max_num_scale_bar").selectAll("h1").remove(); //remove the old numbers of color scale
  				d3.select("#max_num_scale_bar").selectAll("h1")           //create the new numbers of color scale
				.data([1])
				.enter().append("h1")
				.text(two_dec( d3.max(data,function(d) {return d[2]; })));
				
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   create color scale  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^			

	
			
			//Create scale functions
			var xScale = d3.scale.linear()
								 .domain([x1,x2])
								 .range([padding, w - padding * 2]);//.range([padding, w - padding * 2]); //old 810

			var yScale = d3.scale.linear()
								 .domain([y1,y2])
								 .range([h - padding, padding]);	
			
											 
			var array_test1=[""];
			var array_test2=[padding];
			for  (var i=0;i<chrom_acum_length.length;i++){
				var num=i+1;
				
				array_test1.push( "chr"+num );
				array_test2.push( xScale(chrom_acum_length[i])   );
			}				
								 
							 
					//Create scale top			 
				var xScale_top = d3.scale.ordinal()
   								 .domain(array_test1)
    							.range(array_test2);	
    							
    			//Define X axis top
			var xAxis_top = d3.svg.axis()
							  .scale(xScale_top)
							  .orient("top")
							  //.ticks(5)
							  ;							 
								 
							 	

			//Define X axis
			var xAxis = d3.svg.axis()
							  .scale(xScale)
							  .orient("bottom")
							  .ticks(5);

			//Define Y axis
			var yAxis = d3.svg.axis()
							  .scale(yScale)
							  .orient("left")
							  .ticks(5);
							  							  
							  
			//Create SVG element
			var svg = d3.select("#chart")
			     // svg = d3.select("#chart")
						.append("svg")
						.attr("width", w)
						.attr("height", h);
								
						
	var line_chrom =	svg.selectAll("line")
			   .data(chrom_acum_length)
			   .enter()
			   .append("line")
			   .attr("class", "linechrom")
			   .attr("x1", function(d) {return xScale(d);   })
			   .attr("y1", 32)
			   .attr("x2", function(d) {return xScale(d);   })
			   .attr("y2", h - padding)
			   .attr("stroke-width", 1)
			   .attr("stroke-dasharray", 5)			   
			   .style("stroke", "black") //stroke-dasharray="5"
			   .style("opacity", 0.2);
	

			//Create circles
		var circle =	svg.selectAll("circle")
			   .data(data)
			   .enter()
			   .append("circle")
			   .attr("cx", function(d) {
			   		return xScale(d[0]);
			   })
			   .attr("cy", function(d) {
			   		return yScale(d[1]);
			   })
			   .attr("r", 3.5)
			   //.style("fill", function(d) { return graphColor(d[2]) })
			   .style("fill", function(d) { return colorScale(d[2]) })
			   //.on("mouseover", fade(0))
			   ;

 label_text=svg.selectAll("text")
			   .data(data)
			   .enter()
			   .append("text")
			   .text(function(d) {
			   		return d[3] + " ; " + d[1]+ " ; " + two_dec(d[2]);
			   })
			   .attr("x", function(d) {
			   		return xScale(d[0]);
			   })
			   .attr("y", function(d) {
			   		return yScale(d[1]);
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
			   //.attr("fill", "red")
			   .style("fill", function(d) { return colorScale(d[2]) });

				label_text.transition().duration(1000).style("opacity", 0); //it will fade the label in circles
 				//label_text.transition().style("opacity", 0); //it will fade the label in circles

	
			
			//Create X axis
			svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0," + (h - padding) + ")")
				.call(xAxis)//;
				.append("text")
      			.attr("class", "label")
      			.attr("x", w)
      			.attr("y", -6)
      			.style("text-anchor", "end")
      			.text("Chromosome Lengths (nº bases)");
      			
      			
      		svg.append("g").attr("transform", "translate(0," + 30 + ")")
				.attr("class", "xt axis")
				//.attr("transform", "translate(" + padding + ",0)")
				.call(xAxis_top);//;		
      			
     svg.selectAll(".xt text")  // select all the text elements for the xaxis
          .attr("transform", function(d) { return "translate(" + this.getBBox().height + "," + this.getBBox().height*-0.5 + ")rotate(-45)";})
          //.attr("transform", "rotate(-45)")
         	;
 			
      						
			//Create Y axis
			svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(" + padding + ",0)")
				.call(yAxis)
				.append("text")
      			.attr("class", "label")
      			.attr("transform", "rotate(-90)")
      			.attr("y", 6)
      			.attr("x", w)
      			.attr("dy", ".71em")
      			.style("text-anchor", "end")
      			.text("Weight");
				
			svg.append("g")
    			.attr("class", "brush")
    			.call(d3.svg.brush().x(xScale).y(yScale)
    			.on("brushstart", brushstart)
    			.on("brush", brushmove)
    			.on("brushend", brushend));
 
//get the values to allows make the zoom when click the button zoon
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
    
 
}










