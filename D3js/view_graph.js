// Global variable for all
var width =800 ,//800,
height =800 ,//800,
width2 =800 ,//800, //for transition
height2 =800 ,//800, //for transition

//chromRingOuterRadius = Math.min(width, height) * .49,  //old adjustment
//chromRingInnerRadius = chromRingOuterRadius * 0.95;

chromRingOuterRadius = Math.min(width, height) * .45,   //new adjustment
chromRingInnerRadius = chromRingOuterRadius * 0.95;

//---------variable for manhattan plot

var margin = {top: 10, right: 10, bottom: 20, left: 40},
    width_pm = 960 - margin.right - margin.left,
    height_pm = 500 - margin.top - margin.bottom;

var data ;

var chrom_lenght=0;

var ix_1,ix_2,iy_1,iy_2;
var x_1,x_2,y_1,y_2;

var chromLength = new Array(249250621, 243199373, 198022430, 191154276,
				180915260, 171115067, 159138663, 146364022,
				141213431, 135534747, 135006516, 133851895,
				115169878, 107349540, 102531392, 90354753,
				81195210, 78077248, 59128983, 63025520,
				48129895, 51304566, 155270560, 59373566);

var chrom_acum_length= new Array();

var plot_chosen;

for (var i=0; i<chromLength.length;i++){
	
	chrom_lenght=chrom_lenght+chromLength[i];	
	chrom_acum_length.push(chrom_lenght);
	
}
//---------variable for manhattan plot ----end


// TODO: change to function reading from ucsc_colour.csv
var color = new Array(d3.rgb(153,102,0), d3.rgb(102,102,0), d3.rgb(153,153,30), d3.rgb(204,0,0), 
		      d3.rgb(255,0,0), d3.rgb(255,0,204), d3.rgb(255,204,204), d3.rgb(255,153,0),
		      d3.rgb(255,204,0),d3.rgb(255,255,0),d3.rgb(204,255,0),d3.rgb(0,255,0),
		      d3.rgb(53,128,0),d3.rgb(0,0,204),d3.rgb(102,153,255),d3.rgb(153,204,255),
		      d3.rgb(0,255,255),d3.rgb(204,255,255),d3.rgb(153,0,204),d3.rgb(204,51,255),
		      d3.rgb(204,153,255),d3.rgb(102,102,102),d3.rgb(153,153,153),d3.rgb(204,204,204));



// Global variable for all
var graphColor = d3.scale.category10();
var svg ;
var all_chrom;
var allNodes ;
var data_weight_pvalue;
var links;
var file_json;







function Create_chr_circle(){  
	// function to Create the SVG element , to Plot the chromosomes in a circle and the ticks on chromosome   
		
 svg = d3.select("#chart")  // Selects  the element with id="chart"
    .append("svg")
    .attr("width", width2)
    .attr("height", height2)
    .append("g")
    //.attr("transform", "translate(" + 400 + "," + 400  + ")");  //This transform moves the element by pixels in both the X and Y directions.
    .attr("transform", "translate(" + width2 / 2 + "," + height2 / 2 + ")");  //This transform moves the element by pixels in both the X and Y directions.

// // Genome object for drawing Plot the chromosomes in a circle
 all_chrom = Genome();


allNodes = new Array(); //create array that will receive objects with information about SNP from .json 

data_weight_pvalue= new Array(); //create array that will receive the weight value from .json


svg.selectAll("path") //create the vizualization of the chromosomes in circles.
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
    

// when we click in vizualization it declaration below will reset the vizualization using the function reset		

d3.select("#chart").selectAll('svg').on("click", reset());

};


function Create_SNP_association(filename){
//this function create all associations betewen the SNPs


// Plot nodes and links for the default dataset
d3.json(filename, function(json) {
    links = json.links;// var links = json.links;
	   

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

    
    // Draw the edges  - the association between SNPs
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
//this function create the brush on weight value to vizualizate SNPs association in specific weight range 



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
		
	svg.selectAll(".link").remove(); //remove the old association
	reset_association();			 //create the new association
	   
	svg.selectAll(".link") // this declaretion selected the association between specifics  weight values 
   			.filter(function(d) { return   d.weight  <=  s[0]	||  d.weight >=s[1];  }).remove();	
}

function brushend() { //selected de circles in x cordenate for diferent vizualization
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

hide_button();     //hide the buttons for zoom manhattan plot
Create_chr_circle();
Create_SNP_association("bdWTC.json");
file_json="bdWTC.json";
brush_weight("bdWTC.json");
plot_chosen="p_cir";     //chosen the circle plot like default


// merge to one html with radio buttons 
		
/*
  
  d3.selectAll("input").on("change", function change() {
			
   d3.select("#chart").selectAll('svg').remove();  				//remove old selection
   d3.select("#snps").selectAll("p").remove(); 					//remove old selection
   d3.select("#pairs").selectAll("p").remove();    				//remove old selection
   d3.select("body").selectAll('svg').remove(); 				//remove old selection
   d3.select("#two_weight_value").selectAll("h").remove(); 		//remove old selection 

			file_json=this.id+".json";     						//create new again
  			Create_chr_circle();								//create new again
  			Create_SNP_association(this.id+".json");  			//create new again
  			brush_weight(this.id+".json");						//create new again
   			
});						
 
 
 */



 d3.select("#Dataset_select").on("change", function change() {
 	
 	file_json=this.value+".json";
 	
 	if( plot_chosen=== "p_cir" ){
 	
   d3.select("#chart").selectAll('svg').remove();  			    //remove old selection
   d3.select("#snps").selectAll("p").remove(); 					//remove old selection
   d3.select("#pairs").selectAll("p").remove();    				//remove old selection
   d3.select("body").selectAll('svg').remove(); 				//remove old selection
   d3.select("#two_weight_value").selectAll("h").remove(); 		//remove old selection 
			     						
  			Create_chr_circle();									//create new again
  			Create_SNP_association(this.value+".json");  			//create new again
  			brush_weight(this.value+".json");						//create new again
  			
  	}else{
  		 
  		d3.select("#chart").selectAll('svg').remove();  		
  		show_button();
		read_file_to_chart(file_json);  		
  		
  	}		
	
	});




 d3.select("#Plot_select").on("change", function change() {
 //allows us chose the plot to vizualization	
 	
   plot_chosen=this.value; 	
 	
   d3.select("#chart").selectAll('svg').remove();  			    //remove old selection
   d3.select("#snps").selectAll("p").remove(); 					//remove old selection
   d3.select("#pairs").selectAll("p").remove();    				//remove old selection
   d3.select("body").selectAll('svg').remove(); 				//remove old selection
   d3.select("#two_weight_value").selectAll("h").remove(); 		//remove old selection 
   
   hide_button();		

			if(this.value==="p_cir"){
				
				Create_chr_circle();							//create new again
  				Create_SNP_association(file_json);  			//create new again
  				brush_weight(file_json);						//create new again
  				
			}else{
				
				show_button();
				read_file_to_chart(file_json);
			}
	
	});





// Display the nodes and links for debugging
function showSnp(d)
{
    return "chr"+d.chrom+':'+d.bp_position + "    " + d.rs + " Subgraph:" + d.subgraph_id;

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
      .text(function(d) { return "degree: " + two_dec(d.degree) });  
        
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


function reset() {
	//this function recreate the datas in vizualization, removed them and create them 
    return function() {
               
             d3.select("#chart").selectAll('svg').remove();  					//remove old selection 
   			 d3.select("#snps").selectAll("p").remove(); 
   			 d3.select("#pairs").selectAll("p").remove(); 
   			 d3.select("body").selectAll('svg').remove(); 	
   			 d3.select("#two_weight_value").selectAll("h").remove();
   				
  			Create_chr_circle();												//create new again
  			Create_SNP_association(file_json);        
            brush_weight(file_json);
            
            
    };
};



 
function groupTicks(d) {
	// Returns an array with objects of tick angles and labels 
	
  var k = (d.endAngle - d.startAngle) / d.value;    // number of bases scaled to factor for K
  return d3.range(0, d.value, 0.041 ).map(function(v, i) {  //modification 0.05
    return {
      angle: v * k + d.startAngle,
      label: i % 2 ? null : Math.round((v/d.factor_k) / 1000000) + "Mb"  //number of bases 
    };
  });
};



function two_dec( value){
	// return numbers with 2 decimal after "."          	
	var v=value.toString();
	var point=".";
	var index_point=v.indexOf(point);
	var index_twodec=index_point+3;
	
	return v.substring(0,index_twodec);;
}








//--------------------manhattan plot

function  read_file_to_chart(file_name) {
	//this function read um .json to inicialaze the variables and call the function create_chart() to craet the manhattan plot
	
data = new Array();
allNodes= new Array();
data_weight_pvalue= new Array();
		
	
d3.json(file_name, function(json) {
   var  links = json.links;// var links = json.links;


 json.nodes.forEach( 	function(d) { allNodes.push(d) }    );
  
	json.links.forEach(
		

		
	function(d) { //this will fill with data the array
		
		data_weight_pvalue.push(d.weight); 
		
	
		if (allNodes[d.source].chrom===1){

			data.push([allNodes[d.source].bp_position,d.weight,allNodes[d.source].degree]);	
		
		}else{
			
			data.push([allNodes[d.source].bp_position +chrom_acum_length[allNodes[d.source].chrom-2] ,d.weight,allNodes[d.source].degree]);
		}
		
		if (allNodes[d.target].chrom===1){
			
			data.push([allNodes[d.target].bp_position,d.weight,allNodes[d.target].degree]);	
		
		}else{
			data.push([allNodes[d.target].bp_position +chrom_acum_length[allNodes[d.target].chrom-2] ,d.weight,allNodes[d.target].degree]);
		}
		
		});
      	
      	ix_1=0;
      	ix_2=chrom_lenght;
      	iy_1=d3.min(data_weight_pvalue, function(d) { return d; })-1;
      	iy_2=d3.max(data_weight_pvalue, function(d) { return d; })+1;
      	
create_chart(0, chrom_lenght,d3.min(data_weight_pvalue, function(d) { return d; })-1, d3.max(data_weight_pvalue, function(d) { return d; })+1);
});

}

function create_chart (x1,x2,y1,y2){
//creat the manhataan plot
var x = d3.scale.linear()
								 .domain([x1,x2])//.domain([0, chrom_lenght])
								 .range([0, width_pm]);

var y = d3.scale.linear()
								//.domain([d3.min(data_weight_pvalue, function(d) { return d; })-1, d3.max(data_weight_pvalue, function(d) { return d; })+1])
								.domain([y1,y2])								 
								.range([height_pm, 0]);

var scale_weight = d3.scale.linear()
								//.domain([d3.min(data_weight_pvalue, function(d) { return d; })-1, d3.max(data_weight_pvalue, function(d) { return d; })+1])
								.domain([y1,y2])								 
								.range([height_pm, 0]);




var svg = d3.select("#chart").append("svg")
    .attr("width", width_pm + margin.right + margin.left)
    .attr("height", height_pm + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height_pm + ")")
    .call(d3.svg.axis().scale(x).orient("bottom"));

svg.append("g")
    .attr("class", "y axis")
   
    .call(d3.svg.axis().scale(y).orient("left"));



var circle = svg.append("g").selectAll("circle")
    .data(data)
  .enter().append("circle")
    .attr("transform", function(d) { return "translate(" + x(d[0]) + "," + y(d[1]) + ")"; })
    .attr("r", 3.5)
    .style("fill", function(d) { return graphColor(d[2]) })
   // .append("title")
   // .text(function(d) { return "degree: " + two_dec(d.degree) })
    
    ;
    
    

svg.append("g")
    .attr("class", "brush")
    .call(d3.svg.brush().x(x).y(y)
    .on("brushstart", brushstart)
    .on("brush", brushmove)
    .on("brushend", brushend)
        );
    
 
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


function hide_button(){
d3.select("body").select("#butz").transition()
            .style("opacity", 0);

d3.select("body").select("#butr").transition()
            .style("opacity", 0);            
}

function show_button(){
d3.select("body").select("#butz").transition()
            .style("opacity", 1);

d3.select("body").select("#butr").transition()
            .style("opacity", 1);            
}

d3.select("body").select("#butz").on("click", function change() {

			
    d3.select("#chart").selectAll('svg').remove();
   create_chart(x_1,x_2,y_1,y_2);
   
    			
});						


d3.select("body").select("#butr").on("click", function change() {

			
    d3.select("#chart").selectAll('svg').remove();
   create_chart(ix_1,ix_2,iy_1,iy_2);
   
   
   			
});		







