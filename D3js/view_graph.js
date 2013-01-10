
//------------------------------------------   Global variable   ---------------------------------------------- 

// TODO: change to function reading from ucsc_colour.csv
var color = new Array 						//circle_plot
			 (d3.rgb(153,102,0), d3.rgb(102,102,0), d3.rgb(153,153,30), d3.rgb(204,0,0), 
		      d3.rgb(255,0,0), d3.rgb(255,0,204), d3.rgb(255,204,204), d3.rgb(255,153,0),
		      d3.rgb(255,204,0),d3.rgb(255,255,0),d3.rgb(204,255,0),d3.rgb(0,255,0),
		      d3.rgb(53,128,0),d3.rgb(0,0,204),d3.rgb(102,153,255),d3.rgb(153,204,255),
		      d3.rgb(0,255,255),d3.rgb(204,255,255),d3.rgb(153,0,204),d3.rgb(204,51,255),
		      d3.rgb(204,153,255),d3.rgb(102,102,102),d3.rgb(153,153,153),d3.rgb(204,204,204));


// Global variable for only circle_plots
var width =800 ,//800,  ->  300
height =800 ,//800,  -> 300
width2 =800 ,//800,  -> 1500				//for transition
height2 =800 ,//800,   -> 400 				//for transition
chromRingOuterRadius = Math.min(width, height) * .45,   
chromRingInnerRadius = chromRingOuterRadius * 0.95;

var string_html; 							//circle_plot and here

var label_text;  							//manhattan_plot and here

var data ;									//manhattan_plot and inside a function in circle_plot  

var ix_1,ix_2,iy_1,iy_2; 					//manhattan_plot and here 

var x_1,x_2,y_1,y_2; 						//manhattan_plot, here and in future in matrix_plot 



var chrom_lenght=0;							//manhattan_plot and here 

var chrom_acum_length= new Array(); 		//manhattan_plot and here

var chromLength = new Array 				//only here and genome.js
			   (249250621, 243199373, 198022430, 191154276,
				180915260, 171115067, 159138663, 146364022,
				141213431, 135534747, 135006516, 133851895,
				115169878, 107349540, 102531392, 90354753,
				81195210, 78077248, 59128983, 63025520,
				48129895, 51304566, 155270560, 59373566);


for (var i=0; i<chromLength.length;i++){	//this initializes chrom_lenght and chrom_acum_length to be used in manhattan plot 
	chrom_lenght=chrom_lenght+chromLength[i];	
	chrom_acum_length.push(chrom_lenght);	
}


var plot_chosen;  						//only here


var graphColor = d3.scale.category10(); //circle_plot and here


var svg ;								//circle_plot
var all_chrom;   						//circle_plot
var allNodes ;   						//all plots
var data_weight_pvalue; 				//circle_plot and manhattan_plot
var links;    							//all plots
var file_json;  						//circle_plot and here

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Global variable ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 






//------------------------------------------ load -  first vizualization   ---------------------------------------------- 

hide_selection();  //hide the manhattan's buttons in the first vizualization

function upload_json ( file_name ){
	//this function make the upload of a json file and create the first vizualization with this selected file	
	
	graphColor = d3.scale.category10(); 		//reset this varieble
    file_json=file_name;     						 //initializes this goblal variable
	plot_chosen="p_cir";   						  //chosen the circle plot like default
	
    d3.select("#hesid").selectAll('svg').remove();					//remove old selection
    d3.select("#scale_bar").selectAll('svg').remove();				//remove old selection
    d3.select("#chart").selectAll('svg').remove();  			    //remove old selection
    d3.select("#snps").selectAll("p").remove(); 					//remove old selection
    d3.select("#pairs").selectAll("p").remove();    				//remove old selection
    d3.select("body").selectAll('svg').remove(); 					//remove old selection
    d3.select("#two_weight_value").selectAll("h").remove(); 		//remove old selection 
	
	hide_selection();    					 	//hide the buttons for zoom manhattan plot
	Create_chr_circle();
	Create_SNP_association(file_json);		//Create_SNP_association("bdWTC_GSS.json");
	
	brush_weight(file_json);				//brush_weight("bdWTC_GSS.json");
	

	histogram_edges_subgraphId(file_json);

}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ load - first vizualization ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 




//------------------------------------------  chose the plot   ---------------------------------------------- 
 //allows us chose the plot to vizualization	

 d3.select("#Plot_select").on("change", function change() {
 	
   plot_chosen=this.value; 	
   
   d3.select("#chart").selectAll('svg').remove();  				//remove old selection
   d3.select("#scale_bar").selectAll('svg').remove();			//remove old selection
   d3.select("#snps").selectAll("p").remove(); 					//remove old selection
   d3.select("#pairs").selectAll("p").remove();    				//remove old selection
   d3.select("body").selectAll('svg').remove(); 				//remove old selection
   d3.select("#two_weight_value").selectAll("h").remove(); 		//remove old selection 
   d3.select("#hesid").selectAll('svg').remove();				//remove old selection
   
   hide_selection();		

			if(this.value==="p_cir"){
				
  				d3.select("body").select("#two_weight_value").transition().style("opacity", 1);
  				d3.select("body").select("#cb").transition().style("opacity", 1);
  				d3.select("body").select("#hc").transition().style("opacity", 1);
  				d3.select("body").select("#snps_text").transition().style("opacity", 1);
  				d3.select("body").select("#footer").transition().style("opacity", 1);
				
				Create_chr_circle();							//create new again
  				Create_SNP_association(file_json);  			//create new again
  				brush_weight(file_json);						//create new again
  				histogram_edges_subgraphId(file_json);
  				
			}else if( this.value==="p_man"){
				show_selection();
								
				d3.select("body").select("#two_weight_value").transition().style("opacity", 0);
  				d3.select("body").select("#cb").transition().style("opacity", 0);
            	d3.select("body").select("#hc").transition().style("opacity", 0);
  				d3.select("body").select("#snps_text").transition().style("opacity", 0);
				d3.select("body").select("#footer").transition().style("opacity", 0);
					
				read_file_to_manhattan_plot(file_json);
				
			}else{
				
				d3.select("body").select("#two_weight_value").transition().style("opacity", 0);
  				d3.select("body").select("#cb").transition().style("opacity", 0);
              	d3.select("body").select("#hc").transition().style("opacity", 0);
  				d3.select("body").select("#snps_text").transition().style("opacity", 0);
  				d3.select("body").select("#footer").transition().style("opacity", 0);
            
				matrix_plot( file_json);  // plot matrix of the snps association 

			}
	
	});
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ chose the plot ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 
  
  
  
  
//------------------------------------------load and save -  show the data selected in json file    ----------------------------------------------      
function selected_json(){
       	//this function create a new tab, when we click in button "show .json", with a .json with datas selected
       	       	
		//myWindow=window.open('','','width=200,height=100')	
		myWindow=window.open('','json file');
		//myWindow.document.write("\"string_html\"");
		myWindow.document.write(string_html);
		myWindow.focus();

		string_html="";
}
       


function json_nodes_selected(file_name,subgraph_id){  
		//this function selected the elementes inside nodes with a subgraph_id chosen and put in the string string_html
d3.json(file_name, function(json) {
 json.nodes.forEach( 	function(d) {
 	
 	if(d.subgraph_id===subgraph_id){
 
		string_html+="{\"label\": \""+d.label+"\", \"degree\": "+d.degree+", \"rs\": \""+d.rs+
		"\", \"bp_position\": "+d.bp_position+", \"chrom\": "+d.chrom+", \"id\": "+d.id+", \"subgraph_id\": "+d.subgraph_id+"},";
		
 	} }    );		
string_html+="], \"links\": [";
});	
	
	
}

function json_links_selected(file_name,subgraph_id){
		//this function selected the elementes inside nodes with a subgraph_id chosen and put in the string string_html
		d3.json(file_name, function(json) {
			json.links.forEach( 	function(d) { 
 	
 	
 		if(d.subgraph_id===subgraph_id){
 		
			string_html+= "{\"source:\" "+d.source+", \"subgraph_id\": "+d.subgraph_id+", \"weight\": "+d.weight+", \"target\": "+d.target+"},";
	 	 	 
	 	}	}    );
 	
 			// IMP -> 		remover a ultima virgula 	   <- IMP
 	 			
		string_html+="], \"multigraph\": false}";
});	

}


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ show the data selected in json file ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 





//--------------------------------- operational functions ------------------------------------

function reset() {
	//this function recreate the datas in vizualization, removed them and create them 
   
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

};


function two_dec( value){
	// return numbers with 2 decimal after "."          	
	var v=value.toString();
	var point=".";
	var index_point=v.indexOf(point);
	var index_twodec=index_point+3;
	
	return v.substring(0,index_twodec);;
}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ operational functions ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^







//--------------------------------------  BUTTONs AND OPERATIONS --------------------------------------



function hide_selection(){  
	// function hide in buttons and scale
		
	d3.select("body").select("#butz").transition().style("opacity", 0);
	d3.select("body").select("#butpl").transition().style("opacity", 0);
	d3.select("body").select("#butrl").transition().style("opacity", 0);
            
 	d3.select("#min_num_scale_bar").selectAll("h1").remove();         // numbers of  color scale bar 
  	d3.select("#max_num_scale_bar").selectAll("h1").remove();         // numbers of  color scale bar
  	d3.select("#degree_scale_bar").transition().style("opacity", 0);  // title of  color scale bar  
}


function show_selection(){ 
	//function show in buttons and scale
	
	d3.select("body").select("#butz").transition().style("opacity", 1);
	d3.select("body").select("#butr").transition().style("opacity", 1);
	d3.select("body").select("#butpl").transition().style("opacity", 1);
	d3.select("body").select("#butrl").transition().style("opacity", 1); 
	          
	d3.select("#degree_scale_bar").transition().style("opacity", 1);    // title of  color scale bar                        
}



								//buttons of manhattan plot

d3.select("body").select("#butz").on("click", function change() {      //button ZOOM

   d3.select("#chart").selectAll('svg').remove();
   d3.select("#scale_bar").selectAll('svg').remove();
  
   if(x_1)// if x_1 is not null make ..
  		 manhattan_plot(x_1,x_2,y_1,y_2);
   else
   		manhattan_plot(ix_1,ix_2,iy_1,iy_2);
    			
});						

d3.select("body").select("#butr").on("click", function change() { 		//button RESET
				
	if( plot_chosen=== "p_cir" ){		
				
		reset();
		
	}else{			
				
    	d3.select("#chart").selectAll('svg').remove();
    	d3.select("#scale_bar").selectAll('svg').remove();
    	x_1=ix_1;
    	x_2=ix_2;
    	y_1=iy_1;
    	y_2=iy_2;
   		manhattan_plot(ix_1,ix_2,iy_1,iy_2);
   	}
});		

d3.select("body").select("#butpl").on("click", function change() {  	//button LABEL

   d3.select("#chart").selectAll('svg').remove();
   d3.select("#scale_bar").selectAll('svg').remove();
   
   if(x_1)// if x_1 is not null make ..
   		manhattan_plot(x_1,x_2,y_1,y_2);
   else
   		manhattan_plot(ix_1,ix_2,iy_1,iy_2);
   		label_text.transition().style("opacity", 1);
    			
});		
				
d3.select("body").select("#butrl").on("click", function change() { 		//button REMOVE LABEL	
				
    d3.select("#chart").selectAll('svg').remove();
    d3.select("#scale_bar").selectAll('svg').remove();
   
   if(x_1)// if x_1 is not null make ..
   		manhattan_plot(x_1,x_2,y_1,y_2);
   else
   		manhattan_plot(ix_1,ix_2,iy_1,iy_2);
   		label_text.transition().style("opacity", 0);
   			
});		


//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   BUTTON AND OPERATIONS ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^















