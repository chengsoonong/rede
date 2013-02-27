

var data_obj_m=[];
var array_SNPs=[];


function  read_file_to_matrix_plot(file_name) {
	//this function read a .json to inicialaze the variables and call the function matrix_plot() to craete the matrix plot
	
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
		
				var obj={}
		
				obj["label_x"]  = dic_chr["chr"+allNodes[d.source].chrom+':'+allNodes[d.source].bp_position];
				obj["label_y"]  = dic_chr["chr"+allNodes[d.target].chrom+':'+allNodes[d.target].bp_position];

				for (var i in d ){		
					if (i!="comm_id" &&  i!="ct_id" &&  i!= "source"  &&  i!= "target"){
						//statOptions[i]=i
						//st_1.push(i) //get the first element to be visualited
						obj[i]=d[i]			
				}}

			data_obj_m.push(obj);

			//create an array with objects representing the SNP associations		
			//data_obj_m.push(creat_obj(dic_chr["chr"+allNodes[d.source].chrom+':'+allNodes[d.source].bp_position], 
			//dic_chr["chr"+allNodes[d.target].chrom+':'+allNodes[d.target].bp_position]));
								
		});


	function creat_obj(labelx,labely ){ //não preciso mais disso
		var obj={};
		obj.label_x  = labelx;
		obj.label_y  =labely;
		return obj;
	}
       	
    mix_1=0;
    mix_2=array_SNPs.length-1;
    miy_1=0;
    miy_2=array_SNPs.length-1;
    
    matrix_plot_minmap(mix_1,mix_2,miy_1,miy_2,0,0,0,0)
	matrix_plot(mix_1,mix_2,miy_1,miy_2)

});

}





function matrix_plot( x1,x2,y1,y2){
// this function create the matrix show each SNPs association



//--------------------------- create color scale  --------------------------------------------------
			var margin_s = {top: 5, right: 30, bottom: 35, left: 10};
			//Then define width and height as the inner dimensions of the chart area.
			var w_scale_bar = 500 - margin_s.left - margin_s.right;
			var h_scale_bar = 65  - margin_s.top  - margin_s.bottom;
			var barPadding  = 0;
			
			var dataset_mat1 = d3.range(d3.min(data_obj_m,function(d) {return d[st_chosen1]; }), d3.max(data_obj_m,function(d) {return d[st_chosen1]; }));
			var dataset_mat2 = d3.range(d3.min(data_obj_m,function(d) {return d[st_chosen2]; }), d3.max(data_obj_m,function(d) {return d[st_chosen2]; }));
			//alert([d3.min(data_obj_m,function(d) {return d[st_chosen]; }), d3.max(data_obj_m,function(d) {return d[st_chosen]; })])
			
			var colorScale1 = d3.scale.linear() //yellow - red
    			.domain([d3.min(data_obj_m,function(d) {return d[st_chosen1]; }), d3.max(data_obj_m,function(d) {return d[st_chosen1]; })])
    			.interpolate(d3.interpolateHsl)
    			.range(["#E4DB00", "#F31300"]); //http://tributary.io/tributary/3650755/
   				  
   			var colorScale2 = d3.scale.linear() //lightblue - blue
    			.domain([d3.min(data_obj_m,function(d) {return d[st_chosen2]; }), d3.max(data_obj_m,function(d) {return d[st_chosen2]; })])
    			.interpolate(d3.interpolateHsl)
    			//.range(["#00E4DB", "#6717F5"]); //http://tributary.io/tributary/3650755/
    			.range(["#00E4DB", "#2E00E7"]);
		
			//Create SVG element to receive the scale color bar
			var svg_scb1 = d3.select("#scalecolor_matrix1")
          					 .append("svg")
						 	 .attr("width", w_scale_bar + margin_s.left + margin_s.right)
  						     .attr("height", h_scale_bar + margin_s.top + margin_s.bottom)
				    	     .append("g")
 					         .attr("transform", "translate(" + margin_s.left + "," + margin_s.top + ")");

					
						

			svg_scb1.selectAll("rect")  //create color scale bar
				    .data(dataset_mat1)
			        .enter()
			   		.append("rect")
			   		.attr("x", function(d, i) {
			   			return i * (w_scale_bar / dataset_mat1.length);
			   		})
			   		.attr("y", 0)
			   		.attr("width", w_scale_bar / dataset_mat1.length - barPadding)
			   		.attr("height", h_scale_bar)
			   		.attr("fill", function(d,i) { return colorScale1(d);    });
     				

		 
     		svg_scb1.selectAll(".text_smp")
				    .data(dataset_mat1)
			   		.enter()
			   		.append("text") 
			   		.attr("class", "text_smp")
			   		.text(function(d,i) {
			   	 		number_tick=6;			   	 
			   				if(i%   d3.round(dataset_mat1.length /number_tick) ==0 ){return parseInt(d);}
			   			})
			   		.attr("x", function(d, i) {
				   		return (i+0) * (w_scale_bar / dataset_mat1.length);
					   })
				    .attr("y", 40)
			   		.attr("font-family", "sans-serif")
			   		.attr("font-size", "11px")
			   		.attr("fill",function(d) {			return colorScale1(d);	});
    						
    		var svg_scb2 = d3.select("#scalecolor_matrix2")
	               			 .append("svg")
							 .attr("width", w_scale_bar + margin_s.left + margin_s.right)
  						     .attr("height", h_scale_bar + margin_s.top + margin_s.bottom)
				    	     .append("g")
 					         .attr("transform", "translate(" + margin_s.left + "," + margin_s.top + ")");

			svg_scb2.selectAll("rect")  //create color scale bar
 				   .data(dataset_mat2)
				   .enter()
				   .append("rect")
				   .attr("x", function(d, i) {
			   			return i * (w_scale_bar / dataset_mat2.length);
			   		})
			   		.attr("y", 0)
			   		.attr("width", w_scale_bar / dataset_mat2.length - barPadding)
			   		.attr("height", h_scale_bar)
			   		.attr("fill", function(d,i) {  return colorScale2(d);    });
     				

		 
     		 svg_scb2.selectAll(".text_smp")
			   			.data(dataset_mat2)
			   			.enter()
			   			.append("text") 
			   			.attr("class", "text_smp")
			   			.text(function(d,i) {
			   	 			number_tick=6;
			   					if(i%   d3.round(dataset_mat2.length /number_tick) ==0 ){return parseInt(d);}
			   			})
			   			.attr("x", function(d, i) {
			   				return (i+0) * (w_scale_bar / dataset_mat2.length);
			   			})
			   			.attr("y", 40)
			   			.attr("font-family", "sans-serif")
			   			.attr("font-size", "11px")
			   			.attr("fill", function(d) { return colorScale2(d);  });				
			



//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   create color scale  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^			







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
    .orient("top");

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
   //.style("fill", '#0d1dee') //blue colorScale
   .style("fill", function(d) { return colorScale1(d[st_chosen1]); })
    .attr("transform", function(d) { return "translate(" + x(d.label_x) + "," + y(d.label_y) + ")"; })
    .attr("d", d3.svg.symbol().type("square").size("30"));
    

svg.selectAll("path2")
    .data(data_obj_m)
  .enter().append("svg:path")
  /* .filter(function(d) {
  	
		return d;// (x1<= x(d.label_x) && x(d.label_x)<=x2) ;//&&  (y1<=y(d.label_y) && y(d.label_y)<=y2);// x(d.label_x) > 100; 
		
            })
            */
  .style("fill", function(d) { return colorScale2(d[st_chosen2]); })
    .attr("transform", function(d) { return "translate(" + x(d.label_y) + "," + y(d.label_x) + ")"; })
    .attr("d", d3.svg.symbol().type("square").size("30"));    
    
    
 

svg.append("g")
      .attr("class", "xmat axis")
      .attr("transform", "translate(0," + 0 + ")")
      .call(xAxis);
     
svg.selectAll(".xmat text")  // select all the text elements for the xaxis
          .attr("transform", function(d) {
             return "translate(" + this.getBBox().height*1 + "," + this.getBBox().height*-2.5 + ")rotate(-90)";
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
// this function create the minimap from matrix that show all SNPs association


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
    .orient("top");


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
      .attr("transform", "translate(0," + 0 + ")")
      .call(xAxis);
     
svg.selectAll(".xmat text")  // select all the text elements for the xaxis
          .attr("transform", function(d) {
             return "translate(" + this.getBBox().height*1 + "," + this.getBBox().height*-1.5 + ")rotate(-90)";
         });     
     

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

			
		


//});
}





















// -------------------------------- histogram degree X SNPs (matrix) ----------------------------------------

function histogram_degree_SNPs_matrix(file_name){

	//vertical histogram in matrix


var data = new Array();
var allNodes_hes = new Array();

var links_hes = new Array();
	
d3.json(file_name, function(json) {
   
 allNodes_hes = json.nodes;// var links = json.links;
     
 json.links.forEach(	
	function(d) { 
		//if(d.subgraph_id===subgraph_id){
 				links_hes.push(d)  
 	//}
 	}
 	);
 	
 	
 json.nodes.forEach( 
 function(d) { 
 	//if(d.subgraph_id===subgraph_id){
 	data.push(d); 
 	//}
 	});		
 
	//it will create the histogram degree X SNPs in circle_plot
var margin = {top: 50, right: 20, bottom: 50, left: 250},
    width = 500 - margin.left - margin.right, //500
    //height = 1750*3500/200 - margin.top - margin.bottom;//200
    height = 34.1796875*data.length - margin.top - margin.bottom;//200



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




  y.domain(data.map(function(d,i) { return "id:"+i+ "  chr"+d.chrom+':'+d.bp_position; }));
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
		.style("font-size", "17px")
 
          .attr("transform", function(d) {
             return "translate(" + this.getBBox().height*-0.5 + "," + this.getBBox().height*0 + ")rotate(0)";
         })
		.on("mousedown", function(g,i){
			alert("oi"+i);
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
        
		for ( var e in links_hes){			
	
		if(y("chr"+allNodes_hes[links_hes[e].source].chrom+':'+allNodes_hes[links_hes[e].source].bp_position)===y("chr"+data[i].chrom+':'+data[i].bp_position) 
 		|| y("chr"+allNodes_hes[links_hes[e].target].chrom+':'+allNodes_hes[links_hes[e].target].bp_position)===y("chr"+data[i].chrom+':'+data[i].bp_position)){
		
				l.push(y("chr"+allNodes_hes[links_hes[e].source].chrom+':'+allNodes_hes[links_hes[e].source].bp_position));
		      	l.push(y("chr"+allNodes_hes[links_hes[e].target].chrom+':'+allNodes_hes[links_hes[e].target].bp_position));
		      	
		      	list_idx_in_links.push(links_hes[e].ct_id);
		      	
		      			 }		    			 
		      		} 
		      		
		      		
		      		
		      		
		      		
         bar_hDS.filter(function(d) {
      			if(include_in_arr(l,y("chr"+d.chrom+':'+d.bp_position))){return d;} 
      			} )
	    .transition()
        .style("fill", "red");
      
      
      
      
      
     if(plot_chosen==="p_cir"){ //plot_chosen==="p_man"){	plot_chosen==="p_cir"
   	 
   	 d3.select("#chart").selectAll("g circle").transition().style("opacity", 0);
			
	 d3.select("#chart").selectAll("g circle")  //select the circles           
         .filter(function(d) {
      			if(include_in_arr(l,y("chr"+d.chrom+':'+d.bp_position))){return d;} 
      			} )   
	    .transition()
            .style("opacity", 1);            
 	 
   	d3.select("#chart").selectAll(".link").transition().style("opacity", 0);
   	   
    d3.select("#chart").selectAll(".link") //select the association regarding to the circle selected
   			.filter(function(d,i) {
   				
      			if(include_in_arr(list_idx_in_links,d.ct_id)){return d;}
      			 
      			} )
      			.transition()
  				.style("opacity", 0.3);	
  
		}else if(plot_chosen==="p_man"){
			
			//alert("to do something in manhattan plot")
			
		}else{
			
			//alert("to do something in matrix plot")
						
		}
       
       
       
      	
      	
      	 })
     
      
      ;
      
      
      
   svg.selectAll(".bar")  //show degree as tooltip - title
       .data(data)
	  .append("title")
      .text(function(d) { return "chr"+d.chrom+':'+d.bp_position+" ; "+d.degree; });     
  
  
  
});

}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ histogram degree X SNPs (matrix) ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^













