// Global variable for all
var width =800 ,//800,  ->  300
height =800 ,//800,  -> 300
width2 =800 ,//800,  -> 1500//for transition
height2 =800 ,//800,   -> 400 //for transition


chromRingOuterRadius = Math.min(width, height) * .45,   //new adjustment
chromRingInnerRadius = chromRingOuterRadius * 0.95;

//var string_html="{\"directed\": false, \"graph\": [], \"nodes\": [<br>";
    	var string_html;


//---------variable for manhattan plot

var label_text;

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


//******************************************************************************

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

//d3.select("#chart").selectAll('svg').on("click", reset());
//d3.select("#scale_bar").selectAll('svg').remove();

};
//******************************************************************************

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
	
	 .on("mousedown", 
	 
	 function(g, i) {
  		 	sid= allNodes[i].subgraph_id;
 			histogram_circle(file_json,sid);	
 			
 			
 			
 			string_html="{\"directed\": false, \"graph\": [], \"nodes\": [<br>";

			json_nodes_selected(file_json,sid);
	
		
			json_links_selected(file_json,sid);	
				

 			
			}	 
	 
	 )
	
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
//******************************************************************************



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
//******************************************************************************


// create the first vizualization with "bdWTC.json" like default

hide_button();  


function cria ( file ){
	
	file_json=file;
	
		d3.select("#hesid").selectAll('svg').remove();
 	d3.select("#scale_bar").selectAll('svg').remove();
   d3.select("#chart").selectAll('svg').remove();  			    //remove old selection
   d3.select("#snps").selectAll("p").remove(); 					//remove old selection
   d3.select("#pairs").selectAll("p").remove();    				//remove old selection
   d3.select("body").selectAll('svg').remove(); 				//remove old selection
   d3.select("#two_weight_value").selectAll("h").remove(); 		//remove old selection 
			     						
	
	
hide_button();     //hide the buttons for zoom manhattan plot
Create_chr_circle();
Create_SNP_association(file_json);//Create_SNP_association("bdWTC_GSS.json");
//file_json="bdWTC_GSS.json";
brush_weight(file_json);//brush_weight("bdWTC_GSS.json");
plot_chosen="p_cir";     //chosen the circle plot like default

histogram_edges_subgraphId(file_json);

}





//******************************************************************************


// merge to one html with radio buttons

 d3.select("#Dataset_select").on("change", function change() {
 	
 	file_json=this.value+"_GSS.json";
 	
 	if( plot_chosen=== "p_cir" ){
 		
 	d3.select("#hesid").selectAll('svg').remove();
 	d3.select("#scale_bar").selectAll('svg').remove();
   d3.select("#chart").selectAll('svg').remove();  			    //remove old selection
   d3.select("#snps").selectAll("p").remove(); 					//remove old selection
   d3.select("#pairs").selectAll("p").remove();    				//remove old selection
   d3.select("body").selectAll('svg').remove(); 				//remove old selection
   d3.select("#two_weight_value").selectAll("h").remove(); 		//remove old selection 
			     						
  			Create_chr_circle();									//create new again
  			Create_SNP_association(this.value+"_GSS.json");  			//create new again
  			brush_weight(this.value+"_GSS.json");						//create new again
  			histogram_edges_subgraphId(file_json);
  	}else{
  		 
  		d3.select("#chart").selectAll('svg').remove(); 
  		d3.select("#scale_bar").selectAll('svg').remove(); 		
  		show_button();
		read_file_to_chart(file_json);  		
  		
  	}		
	
	});
//******************************************************************************


 //allows us chose the plot to vizualization	

 d3.select("#Plot_select").on("change", function change() {
 	
   plot_chosen=this.value; 	
   d3.select("#chart").selectAll('svg').remove();  	
   d3.select("#scale_bar").selectAll('svg').remove();	
   		    //remove old selection
   d3.select("#snps").selectAll("p").remove(); 					//remove old selection
   d3.select("#pairs").selectAll("p").remove();    				//remove old selection
   d3.select("body").selectAll('svg').remove(); 				//remove old selection
   d3.select("#two_weight_value").selectAll("h").remove(); 		//remove old selection 
   d3.select("#hesid").selectAll('svg').remove();
   
   hide_button();		

			if(this.value==="p_cir"){
				
				Create_chr_circle();							//create new again
  				Create_SNP_association(file_json);  			//create new again
  				brush_weight(file_json);						//create new again
  				histogram_edges_subgraphId(file_json);
  				
			}else{
				
				show_button();
				read_file_to_chart(file_json);
			

			}
	
	});
//******************************************************************************


// declaration of the functions to plot crhom. in circle


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
	var sid;
    return function(g, i) {
	svg.selectAll("g circle")  //select the circles
            .filter(function(d) {
            	
            	
            	//sid= allNodes[i].subgraph_id;
            	 
            	 
            	 
		return d.subgraph_id != allNodes[i].subgraph_id ;
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
	.text(function(d) { 
		
	
		
//		string_html+="{\"label\": \""+d.label+"\", \"degree\": "+d.degree+", \"rs\": \""+d.rs+
//		"\", \"bp_position\": "+d.bp_position+", \"chrom\": "+d.chrom+", \"id\": "+d.id+", \"subgraph_id\": "+d.subgraph_id+"}<br>";
		
		return showSnp(d); });
   
  
  
  //string_html+="], \"links\": [<br>";
  
  
    
 d3.select("#pairs").selectAll("p")
	.data(links)
	.enter().append("p")
	.filter(function(d) {
		return d.subgraph_id === allNodes[i].subgraph_id;
            })
	.text(function(d) { 
		
		
	
//string_html+= "{\"source:\" "+d.source+", \"subgraph_id\": "+d.subgraph_id+", \"weight\": "+d.weight+", \"target\": "+d.target+"},<br>";
		
		
		return showInteract(d); });
   
 //d3.select("#hc").append("svg").remove();    //  show histogram when mouseover
 
 //  sid= allNodes[i].subgraph_id;
 //histogram_circle(file_json,sid);
   
      
    //   string_html+="], \"multigraph\": false}";
            
    };
};

      
       function openWin()
{
//myWindow=window.open('','','width=200,height=100')	
myWindow=window.open('','json file');
//myWindow.document.write("\"string_html\"");
myWindow.document.write(string_html);

myWindow.focus();

string_html="";
}
       







function reset() {
	//this function recreate the datas in vizualization, removed them and create them 
    //return function() {
             d3.select("#scale_bar").selectAll('svg').remove();  
             d3.select("#chart").selectAll('svg').remove();  					//remove old selection 
   			 d3.select("#snps").selectAll("p").remove(); 
   			 d3.select("#pairs").selectAll("p").remove(); 
   			 d3.select("body").selectAll('svg').remove(); 	
   			 d3.select("#two_weight_value").selectAll("h").remove();
			  d3.select("#hesid").selectAll('svg').remove();
			    				
  			Create_chr_circle();												//create new again
  			Create_SNP_association(file_json);        
            brush_weight(file_json);
            histogram_edges_subgraphId(file_json);
            
            
 //   };
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

//******************************************************************************



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
      	
create_chart(0, chrom_lenght,d3.min(data_weight_pvalue, function(d) { return d; })-1, d3.max(data_weight_pvalue, function(d) { return d; })+1);
});

}
//******************************************************************************


function create_chart (x1,x2,y1,y2){
//creat the manhataan plot
var margin = {top: 20, right: 10, bottom: 20, left: 10};
//Then define width and height as the inner dimensions of the chart area.


			var w = 900 ;//- margin.left - margin.right;//900;
			var h = 600 ;//- margin.top - margin.bottom;//600;
			var padding = 30;

			var w_scale_bar = 500;
			var h_scale_bar = 30;
			var barPadding = 0;
			
//------------------------------------------------------------------------------------
			var dataset = d3.range(d3.min(data,function(d) {return d[2]; }), d3.max(data,function(d) {return d[2]; }));
			
			var colorScale = d3.scale.linear()
    			.domain([d3.min(data,function(d) {return d[2]; }), d3.max(data,function(d) {return d[2]; })])
    			.interpolate(d3.interpolateHsl)
    			.range(["#08F5EC", "#F50808"]);
			
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
//------------------------------------------------------------------------------------			
			
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
			//var svg = d3.select("#chart")
			      svg = d3.select("#chart")
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
			   
			   .style("opacity", 0.2)
				
				;
	
	
			//bug
			/*
			 svg.selectAll("text")
			   .data(chrom_acum_length)
			   .enter()
			   .append("text")
			   .text(function(d,i) { return i+1;  })
			   .attr("class", "textchrom")
			   .attr("x", function(d,i) {return xScale(d);   })
			   .attr("y", 30)
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "8px")
			   //.attr("fill", "red");
				.style("opacity", 0.2);	
			*/		
			




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
//******************************************************************************



function hide_button(){  //replace the function name because this function not only act in button 
	
	
d3.select("body").select("#butz").transition()
            .style("opacity", 0);

//d3.select("body").select("#butr").transition().style("opacity", 0);
            
d3.select("body").select("#butpl").transition()
            .style("opacity", 0);

d3.select("body").select("#butrl").transition()
            .style("opacity", 0);
            
 d3.select("#min_num_scale_bar").selectAll("h1").remove();    // numbers of  color scale bar 
  d3.select("#max_num_scale_bar").selectAll("h1").remove();   // numbers of  color scale bar
  
  d3.select("#degree_scale_bar").transition().style("opacity", 0);  // title of  color scale bar
}
//******************************************************************************


function show_button(){ //replace the function name because this function not only act in button
d3.select("body").select("#butz").transition()
            .style("opacity", 1);

d3.select("body").select("#butr").transition()
            .style("opacity", 1);
            
d3.select("body").select("#butpl").transition()
            .style("opacity", 1);

d3.select("body").select("#butrl").transition()
            .style("opacity", 1);
           
d3.select("#degree_scale_bar").transition()      // title of  color scale bar
            .style("opacity", 1);                        
}

//******************************************************************************

//buttons of manhattan plot

d3.select("body").select("#butz").on("click", function change() {

   d3.select("#chart").selectAll('svg').remove();
   d3.select("#scale_bar").selectAll('svg').remove();
   if(x_1)// if x_1 is not null make ..
   create_chart(x_1,x_2,y_1,y_2);
   else
   	create_chart(ix_1,ix_2,iy_1,iy_2);
    			
});						


d3.select("body").select("#butr").on("click", function change() {
				
	if( plot_chosen=== "p_cir" ){
	
		//d3.select("#chart").selectAll('svg').on("click", reset());			
		reset();
		
	}else{			
				
    	d3.select("#chart").selectAll('svg').remove();
    	d3.select("#scale_bar").selectAll('svg').remove();
    	x_1=ix_1;
    	x_2=ix_2;
    	y_1=iy_1;
    	y_2=iy_2;
   		create_chart(ix_1,ix_2,iy_1,iy_2);
   	}
});		

d3.select("body").select("#butpl").on("click", function change() {

   d3.select("#chart").selectAll('svg').remove();
   d3.select("#scale_bar").selectAll('svg').remove();
   if(x_1)// if x_1 is not null make ..
   create_chart(x_1,x_2,y_1,y_2);
   else
   	create_chart(ix_1,ix_2,iy_1,iy_2);
   	label_text.transition().style("opacity", 1);
    			
});						


d3.select("body").select("#butrl").on("click", function change() {
				
    d3.select("#chart").selectAll('svg').remove();
    d3.select("#scale_bar").selectAll('svg').remove();
   if(x_1)// if x_1 is not null make ..
   create_chart(x_1,x_2,y_1,y_2);
   else
   	create_chart(ix_1,ix_2,iy_1,iy_2);
   label_text.transition().style("opacity", 0);
   			
});		

//******************************************************************************



function json_nodes_selected(file,subgraph_id){  	
d3.json(file, function(json) {
 json.nodes.forEach( 	function(d) {
 	
 	if(d.subgraph_id===subgraph_id){
 
		string_html+="{\"label\": \""+d.label+"\", \"degree\": "+d.degree+", \"rs\": \""+d.rs+
		"\", \"bp_position\": "+d.bp_position+", \"chrom\": "+d.chrom+", \"id\": "+d.id+", \"subgraph_id\": "+d.subgraph_id+"}<br>";
		
 	} }    );		
string_html+="], \"links\": [<br>";
});	



		
	
}

function json_links_selected(file,subgraph_id){

d3.json(file, function(json) {
	json.links.forEach( 	function(d) { 
 	
 	
 	if(d.subgraph_id===subgraph_id){
 		
		string_html+= "{\"source:\" "+d.source+", \"subgraph_id\": "+d.subgraph_id+", \"weight\": "+d.weight+", \"target\": "+d.target+"},<br>";
	 	 	 
 	}	}    );
 	
 	// remover a ultima virgula -imp
 	
 			
string_html+="], \"multigraph\": false}";
});	


	
				


}




function histogram_circle(file,subgraph_id){
	
var margin = {top: 20, right: 20, bottom: 120, left: 40},
    width = 850 - margin.left - margin.right, //500
    height = 400 - margin.top - margin.bottom;//200

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .5, 1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");


var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    //.tickFormat(formatPercent)
    ;

var svg = d3.select("#hc").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



var data = new Array();
var allNodes= new Array();
var data_weight_pvalue= new Array();
		
	
d3.json(file, function(json) {
   

 json.nodes.forEach( 	function(d) { 
 	
 	
 	if(d.subgraph_id===subgraph_id){
 	data.push(d); 
 	}
 	
 	}    );		
 

//d.label

  x.domain(data.map(function(d) { return "chr"+d.chrom+':'+d.bp_position; }));
  y.domain([0, d3.max(data, function(d) { return d.degree; })]);




  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
      
 svg.append("text")
     // .attr("transform", "rotate(-90)")
      .attr("y", 365)
      .attr("x", 400)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("SNPs");

		// now rotate text on x axis
        // first move the text left so no longer centered on the tick
        // then rotate up to get 90 degrees.
svg.selectAll(".x text")  // select all the text elements for the xaxis
          .attr("transform", function(d) {
             return "translate(" + this.getBBox().height*-1 + "," + this.getBBox().height*4 + ")rotate(-90)";
         });



  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Degree");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x("chr"+d.chrom+':'+d.bp_position); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.degree); })
      .attr("height", function(d) { return height - y(d.degree); });
      
   svg.selectAll(".bar")  //show degree as tooltip - title
       .data(data)
	  .append("title")
      .text(function(d) { return "chr"+d.chrom+':'+d.bp_position+" ; "+d.degree; });     
      

  d3.select("#cb").on("change", change);
/*
  var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", true).each(change);
  }, 2000);
*/
  function change() {
  //  clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked 
        ? function(a, b) { return b.degree - a.degree; }
        : function(a, b) { return d3.ascending("chr"+a.chrom+':'+a.bp_position, "chr"+b.chrom+':'+b.bp_position); })
        .map(function(d) { return "chr"+d.chrom+':'+d.bp_position; }))
        .copy();

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0("chr"+d.chrom+':'+d.bp_position); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }
});

}










function histogram_edges_subgraphId(file){
	
var margin = {top: 20, right: 20, bottom: 90, left: 40},
    width = 850 - margin.left - margin.right, //500
    height = 400 - margin.top - margin.bottom;//200

var formatPercent = d3.format(".0%");

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



var data_subgraph_id1 = new Array();
var data_subgraph_id2 = new Array();
	
d3.json(file, function(json) {
   

 json.nodes.forEach( 	function(d) { 
 	
 	data_subgraph_id1.push(d.subgraph_id);    }    );
 	
 data_subgraph_id1.sort(function(a, b){
   return a > b? 1 : 0;
});
 

create_data_subgraph_id3()
function create_data_subgraph_id3(){
	
	var max=d3.max(data_subgraph_id1, function(d) { return d; });
	var min=d3.min(data_subgraph_id1, function(d) { return d; });
	var li, ary;

	while(min<max ){
		
		li=data_subgraph_id1.lastIndexOf(min);
		ary=data_subgraph_id1.splice(0,li+1);
		data_subgraph_id2.push(ary);
		min=d3.min(data_subgraph_id1, function(d) { return d; })
		
	}
	data_subgraph_id2.push(data_subgraph_id1);
	
}

var data_obj=[];

function creat_obj(subgraph_id,edgs ){
	var obj={};
	obj.n_subgraph_id  = subgraph_id;
	obj.n_edgs  =edgs;
	return obj;
}

for (var i=0;i<data_subgraph_id2.length;i++ ){
 	
 	data_obj.push(creat_obj(data_subgraph_id2[i][0],data_subgraph_id2[i].length-1));
 }


  x.domain(data_obj.map(function(d) { return d.n_subgraph_id; }));
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
      .text("Subgraph_id");

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
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.n_subgraph_id); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.n_edgs); })
      .attr("height", function(d) { return height - y(d.n_edgs); });

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
			   .attr("x",function(d) { return x(d.n_subgraph_id); })
			   .attr("y",function(d) { return y(d.n_edgs+0.5); })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
			   .attr("fill", "black")
			   ;     


});

}







