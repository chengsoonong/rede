  function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
      //if (!f.type.match('image.*')) {
      //  continue;
     // }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          //var span = document.createElement('span');
          //span.innerHTML = ['<img class="thumb" src="', e.target.result,
            //                '" title="', escape(theFile.name), '"/>'].join('');
          //document.getElementById('list').insertBefore(span, null);
          
          upload_json(e.target.result)
          
          
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
  }



  document.getElementById('files').addEventListener('change', handleFileSelect, false);














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


var mix_1,mix_2,miy_1,miy_2; 					//matrix_plot and here 

var mx_1,mx_2,my_1,my_2; 						//matrix_plot, here and in future in matrix_plot 



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

var st_chosen;  						//only here


var graphColor = d3.scale.category20(); //circle_plot and here


var svg ;								//circle_plot
var all_chrom;   						//circle_plot
var allNodes ;   						//all plots
var data_weight_pvalue; 				//circle_plot and manhattan_plot
var links;    							//all plots
var file_json;  						//circle_plot and here

var select_dropbox;						//only here
var statOptions={}						//only here



var colorScaleedges ;
var colorScaleedges2 ;

var communities;






// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Global variable ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 






//------------------------------------------ load -  first vizualization   ---------------------------------------------- 

plot_chosen="load";   						  //chosen the circle plot like default
//st_chosen="fltGSS";
hide_selection();  //hide the manhattan's buttons in the first vizualization

var st_1=[]
function upload_json ( file_name ){
	//this function make the upload of a json file and create the first vizualization with this selected file	
	
	
//------------------ create and change values in statistic test drop box

	d3.json(file_name, function(json) {         
//comm_id , source ,  target ,subgraph_id ,fltGSS_prtv, fltChi2, fltGSS, fltGSS_cntr, fltSS, fltDSS, ct_id,
    statOptions={}
	for (var i in json.links[0] ){		
		if (i!="comm_id" &&  i!="source"  &&  i!="target" &&  i!="subgraph_id" && i!="ct_id"){
			statOptions[i]=i
			st_1.push(i) //get the first element to be visualited
			}}
			
    st_chosen=st_1[0] //the first element to be visualited

	creat_drop_box()
    change_drop_box() 
	
});
//^^^^^^^^^^^^^^^^^ create and change values in statistic test drop box

     	
	
	graphColor = d3.scale.category10(); 		//reset this varieble
    file_json=file_name;     						 //initializes this goblal variable
	plot_chosen="p_cir";   						  //chosen the circle plot like default
	
	
	//st_chosen="fltGSS";
	
	
	
    d3.select("#hesid").selectAll('svg').remove();					//remove old selection
    d3.select("#scale_bar").selectAll('svg').remove();				//remove old selection
    d3.select("#chart").selectAll('svg').remove();  			    //remove old selection
    d3.select("#snps").selectAll("p").remove(); 					//remove old selection
    d3.select("#pairs").selectAll("p").remove();    				//remove old selection
    d3.select("body").selectAll('svg').remove(); 					//remove old selection
    d3.select("#two_weight_value").selectAll("h").remove(); 		//remove old selection 
	
	hide_selection();    					 	//hide the buttons for zoom manhattan plot
	show_selection();
	Create_chr_circle();
	Create_SNP_association(file_json);		//Create_SNP_association("bdWTC_GSS.json");
	
	brush_weight(file_json);				//brush_weight("bdWTC_GSS.json");
	

	histogram_edges_subgraphId(file_json);
	
	
	
	
	

	
	
	
	

}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ load - first vizualization ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 




//------------------------------------------  chose the plot  - drop box ---------------------------------------------- 
 
 
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
   show_selection();		

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
				//show_selection();
								
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
            
				//matrix_plot( file_json);  // plot matrix of the snps association 
				read_file_to_matrix_plot(file_json);
			}
			
			
			
			
			
	
	});
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ chose the plot - drop box ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 
  










//------------------------------------------  Statistical Test - drop box----------------------------------------------
 
 

 
function creat_drop_box(){ 

 d3.select("#st_select2").selectAll('select').remove();

// create the select element
select_dropbox = d3.select("#st_select2").append("select");

// create the options
select_dropbox.selectAll("option").data(d3.keys(statOptions)).enter().append("option").text(function(d) {
    return d;
});

// add values to the options
select_dropbox.selectAll("option").data(d3.values(statOptions)).attr("value", function(d) {
    return d;
});

}

function change_drop_box(){

select_dropbox.on("change", function change() {
	
	//document.write(this.value);
	st_chosen=this.value; 
   
   
   	if(plot_chosen==="p_cir"){
   		   reset();
    
  			d3.select("#st_name").selectAll("h").remove(); //remove the old text
  			d3.select("#st_name").selectAll("h")           //create the new text
				.data([1])
				.enter().append("h")
				.text(st_chosen);
  				
			}else if( plot_chosen==="p_man"){
			
								
    	d3.select("#chart").selectAll('svg').remove();
    	d3.select("#scale_bar").selectAll('svg').remove();
    	   		d3.select("#minmap_mp").selectAll('svg').remove();
   		
   		//manhattan_plot_minmap(ix_1,ix_2,iy_1,iy_2,  0,0,0,0)
    	
    /*	x_1=ix_1;
    	x_2=ix_2;
    	y_1=iy_1;
    	y_2=iy_2;
   		manhattan_plot(ix_1,ix_2,iy_1,iy_2);
   		*/
   		read_file_to_manhattan_plot(file_json);
				
			}else{
				
				d3.select("body").select("#two_weight_value").transition().style("opacity", 0);
  				d3.select("body").select("#cb").transition().style("opacity", 0);
              	d3.select("body").select("#hc").transition().style("opacity", 0);
  				d3.select("body").select("#snps_text").transition().style("opacity", 0);
  				d3.select("body").select("#footer").transition().style("opacity", 0);
            
				//matrix_plot( file_json);  // plot matrix of the snps association 
				read_file_to_matrix_plot(file_json);

			}
	
});
 
 }
 

 
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Statistical Test - drop box^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 
  
  
    
  
  
  
  
  
  
  
  
  
  
//------------------------------------------show roc and contegency table   ----------------------------------------------      

  function show_roc_ct(){
	snps=document.getElementById("search_snps").value;
	
	
	// alert(snps);
	 	
	//d3.json(file_name, function(json) {
    //links = json.links;// var links = json.links;
		 // 
		 
		 
		 
		 
//prb_a	prb_b	prbCode_a	prbCode_b	browser_a	browser_b	rs_a	rs_b	
//18544	173424	SNP_A-2155222	SNP_A-1842324	chr1:115438232	chr6:32712350	rs742872	rs9272346
		 
	allNodes_links=[]
	
	
	//{"prbCode": "SNP_A-1806075", "degree": 3.0, "prb": 6859, "rs": "rs17104225", "subgraph_id": 2, "bp_position": 48342960, "chrom": 1, "id": 0}
	for (var i in links){
		
		dic={			
			        prb_a: allNodes[links[i].source].prb,
  					prb_b: allNodes[links[i].target].prb,			
			        prbCode_a: allNodes[links[i].source].prbCode,
  					prbCode_b: allNodes[links[i].target].prbCode,			
			        browser_a: "chr"+allNodes[links[i].source].chrom+':'+allNodes[links[i].source].bp_position,
  					browser_b: "chr"+allNodes[links[i].target].chrom+':'+allNodes[links[i].target].bp_position,
		    	    rs_a: allNodes[links[i].source].rs,
		    	    rs_b: allNodes[links[i].target].rs,
		    	    id_links: i
		}
		
		
		
		allNodes_links.push(dic)
		
	}	 
		 
		// document.write([allNodes_links[0].browser_a,allNodes_links[0].browser_b,allNodes_links[0].id_links]+"<br>");
		// document.write([allNodes_links[5].browser_a,allNodes_links[5].browser_b,allNodes_links[5].id_links]+"<br>");
		// document.write([allNodes_links[5]]+"<br>");
		 
	        snps=snps.split(" ");
	
			var snp_a=snps[0];
			var snp_b=snps[snps.length-1];
			var idx_snps="null";
			
		 
	for (var i in allNodes_links){
		
		if ( (snp_a == allNodes_links[i].prb_a && snp_b == allNodes_links[i].prb_b) ||
			 (snp_a == allNodes_links[i].prbCode_a && snp_b == allNodes_links[i].prbCode_b) ||
			 (snp_a == allNodes_links[i].browser_a && snp_b == allNodes_links[i].browser_b) ||
			 (snp_a == allNodes_links[i].rs_a && snp_b == allNodes_links[i].rs_b) )
			 
			 {
			 	
			idx_snps=allNodes_links[i].id_links
			
			
		}	}


		if(idx_snps!="null"){
		
		d3.select("#table_snps").selectAll('table').remove();
		create_table_snps(links[idx_snps])
	
		//"roc_id":0 file_json "bd.json"
		d3.select("#rp").selectAll('svg').remove();
		//ROC_plot (links[i].roc_id,file_json)
		ROC_plot (links[idx_snps].ct_id,file_json)
		
		d3.select("#contp").selectAll('svg').remove();
		cont_plot (links[idx_snps].ct_id,file_json)
		
			
		} 


		else{
			 d3.select("#table_snps").selectAll('table').remove();
			d3.select("#rp").selectAll('svg').remove();
			d3.select("#contp").selectAll('svg').remove();
			
			alert("Error: search again!")
		}

		}
  
  
  
   
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^    show roc and contegency table    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 
  
  
  
  
  
  
  
  
  
  
    
  
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
 	string_html=string_html.substring(0,string_html.lastIndexOf(","));
 		
	string_html+="], \"links\": [";
});	
	
	
}

function json_links_selected(file_name,subgraph_id){
		//this function selected the elementes inside nodes with a subgraph_id chosen and put in the string string_html
		d3.json(file_name, function(json) {
			json.links.forEach( 	function(d) { 
 	
 	
 		if(d.subgraph_id===subgraph_id){
 	 
 string_html+= "{\"source:\" "+d.source+", \"subgraph_id\": "+d.subgraph_id+", \"weight\": "+d.weight+", \"target\": "+d.target+", \"edgs_in_comm\": "+d.edgs_in_comm+", \"comm_id\": "+d.comm_id+ "},";	        
 //string_html+= "{\"source:\" "+d.source+", \"subgraph_id\": "+d.subgraph_id+", \"weight\": "+d.weight+", \"target\": "+d.target+"},";
	 	 	 
	 	}	}    );
 	
 	     
		string_html=string_html.substring(0,string_html.lastIndexOf(","));// IMP -> 		remover a ultima virgula 	   <- IMP
 	 			
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
			 d3.select("#table_snps").selectAll('table').remove(); 
			    				
  			Create_chr_circle();												//create new again
  			Create_SNP_association(file_json);        
            brush_weight(file_json);
            histogram_edges_subgraphId(file_json);

};

function round_ct( value){
	// return numbers with 2 decimal after "."          	
	var v=value.toString();
	var point=".";
	var index_point=v.indexOf(point);
	
	return v.substring(0,index_point);
}



function two_dec( value){
	// return numbers with 2 decimal after "."          	
	var v=value.toString();
	var point=".";
	var index_point=v.indexOf(point);
	var index_twodec=index_point+3;
	
	return v.substring(0,index_twodec);
}


function n_edgs_in_comm (comm_id,d){
	ret=0
	for( var i in d){
		if (d[i]["comm_id"] === comm_id) {
			ret=d[i]["edge_count"];
			
			break
			};
	}
	return ret;
}    


function nodes_selected (s1,s2) {
		l=[]		
		
		for (var i in links){			
			if(links[i][st_chosen]  >=  s1 &&  links[i][st_chosen] <= s2 ){	
					l.push(links[i]["target"]);
					l.push(links[i]["source"]);						 
				};
			}
		
		return l; 
		}		
   			


function include_in_arr(arr,obj) {
    return (arr.indexOf(obj) != -1);
}
    

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ operational functions ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^







//--------------------------------------  BUTTONs AND OPERATIONS --------------------------------------



function hide_selection(){  
	// function hide in buttons and scale

   if (plot_chosen==="load"){
   	
   	d3.select("body").select("#butz").transition().style("opacity", 0);
	d3.select("body").select("#butpl").transition().style("opacity", 0);
	d3.select("body").select("#butrl").transition().style("opacity", 0);
            
 	d3.select("#min_num_scale_bar").selectAll("h1").remove();         // numbers of  color scale bar 
  	d3.select("#max_num_scale_bar").selectAll("h1").remove();         // numbers of  color scale bar
  	d3.select("#degree_scale_bar").transition().style("opacity", 0);  // title of  color scale bar  
  	
  	
  	d3.select("#min_num_scale_bar_c").selectAll("h1").remove();         // numbers of  color scale bar 
  	d3.select("#max_num_scale_bar_c").selectAll("h1").remove();         // numbers of  color scale bar
  	d3.select("#ec_scale_bar_c").transition().style("opacity", 0);  // title of  color scale bar
  	d3.select("#scale_bar_c").transition().style("opacity", 0);
 	

  	
  	}else if(plot_chosen==="p_cir"){

	
	d3.select("body").select("#butz").transition().style("opacity", 0);
	d3.select("body").select("#butpl").transition().style("opacity", 0);
	d3.select("body").select("#butrl").transition().style("opacity", 0);
            
 	d3.select("#min_num_scale_bar").selectAll("h1").remove();         // numbers of  color scale bar 
  	d3.select("#max_num_scale_bar").selectAll("h1").remove();         // numbers of  color scale bar
  	d3.select("#degree_scale_bar").transition().style("opacity", 0);  // title of  color scale bar  
  	
  	d3.select("#load_data").remove();	
  	
  	
			}else if( plot_chosen==="p_man"){
			

  	d3.select("#min_num_scale_bar_c").selectAll("h1").remove();         // numbers of  color scale bar 
  	d3.select("#max_num_scale_bar_c").selectAll("h1").remove();         // numbers of  color scale bar
  	d3.select("#ec_scale_bar_c").transition().style("opacity", 0);  // title of  color scale bar
  	d3.select("#scale_bar_c").transition().style("opacity", 0);
 	
	d3.select("#load_data").remove();
				
			}
			else{
				//d3.select("body").select("#butz").transition().style("opacity", 0);
				d3.select("body").select("#butpl").transition().style("opacity", 0);
				d3.select("body").select("#butrl").transition().style("opacity", 0);
    			//d3.select("body").select("#butr").transition().style("opacity", 0);
  
 				d3.select("#min_num_scale_bar").selectAll("h1").remove();         // numbers of  color scale bar 
  				d3.select("#max_num_scale_bar").selectAll("h1").remove();         // numbers of  color scale bar
  				d3.select("#degree_scale_bar").transition().style("opacity", 0);  // title of  color scale bar  
		  	
  				d3.select("#load_data").remove();	
	  	
  			  	d3.select("#min_num_scale_bar_c").selectAll("h1").remove();         // numbers of  color scale bar 
  				d3.select("#max_num_scale_bar_c").selectAll("h1").remove();         // numbers of  color scale bar
	  			d3.select("#ec_scale_bar_c").transition().style("opacity", 0);  // title of  color scale bar
  				d3.select("#scale_bar_c").transition().style("opacity", 0);
 	
				d3.select("#load_data").remove();				
				
			}  	
  	
}


function show_selection(){ 
	//function show in buttons and scale

	
  	  	if(plot_chosen==="p_cir"){

  	d3.select("#ec_scale_bar_c").transition().style("opacity", 1);  // title of  color scale bar
  	d3.select("#scale_bar_c").transition().style("opacity", 1);
    d3.select("body").select("#butr").transition().style("opacity", 1);
  	  		
			}else if( plot_chosen==="p_man"){
			
	
	d3.select("body").select("#butz").transition().style("opacity", 1);
	d3.select("body").select("#butr").transition().style("opacity", 1);
	d3.select("body").select("#butpl").transition().style("opacity", 1);
	d3.select("body").select("#butrl").transition().style("opacity", 1);
	d3.select("#degree_scale_bar").transition().style("opacity", 1);    // title of  color scale bar  
	

				
			}
			else{
				
				d3.select("body").select("#butz").transition().style("opacity", 1);
	d3.select("body").select("#butr").transition().style("opacity", 1);
	
			}  	
			//else{}  	
	           
}



								//buttons of manhattan plot

d3.select("body").select("#butz").on("click", function change() {      //button ZOOM



if( plot_chosen==="p_man"){
			
   d3.select("#chart").selectAll('svg').remove();
   d3.select("#scale_bar").selectAll('svg').remove();
  
   if(x_1){// if x_1 is not null make ..
  		 manhattan_plot(x_1,x_2,y_1,y_2);
  		 
  		 d3.select("#minmap_mp").selectAll('svg').remove();
   		
   		manhattan_plot_minmap(ix_1,ix_2,iy_1,iy_2,   x_1,  y_2,  x_2-x_1, y_1)
   	}
   else
      
   		manhattan_plot(ix_1,ix_2,iy_1,iy_2);
		
			}
			else{
		
			
 d3.select("#chart").selectAll('svg').remove();

   if(mx_1){// if x_1 is not null make ..
	   	
  		 matrix_plot(mx_1,mx_2,my_1,my_2);
  		 
		d3.select("#minmap_matrixp").selectAll('svg').remove();
		
  		matrix_plot_minmap(mix_1,mix_2,miy_1,miy_2,   mx_1, my_1, mx_2-mx_1, my_2);
   	}
   else
   		matrix_plot(mix_1,mix_2,miy_1,miy_2);
		//d3.select("#minmap_matrixp").selectAll('svg').remove();
		//matrix_plot_minmap(mix_1,mix_2,miy_1,miy_2, 0,0,0,0)
	}  	
});						




d3.select("body").select("#butr").on("click", function change() { 		//button RESET
				
	if( plot_chosen=== "p_cir" ){		
				
		reset();
		
	}else if( plot_chosen==="p_man"){			
				
    	d3.select("#chart").selectAll('svg').remove();
    	d3.select("#scale_bar").selectAll('svg').remove();
    	x_1=ix_1;
    	x_2=ix_2;
    	y_1=iy_1;
    	y_2=iy_2;
   		manhattan_plot(ix_1,ix_2,iy_1,iy_2);
   		
   		d3.select("#minmap_mp").selectAll('svg').remove();
   		
   		manhattan_plot_minmap(ix_1,ix_2,iy_1,iy_2,  0,0,0,0)

   } else{
   	
  			
 d3.select("#chart").selectAll('svg').remove();

   		mx_1=mix_1;
    	mx_2=mix_2;
    	my_1=miy_1;
    	my_2=miy_2;
  		matrix_plot(mx_1,mx_2,my_1,my_2);
  d3.select("#minmap_matrixp").selectAll('svg').remove();
  matrix_plot_minmap(mix_1,mix_2,miy_1,miy_2, 0,0,0,0)		 
  	
   }
   	
   	
   	
   	
   	
});		

d3.select("body").select("#butpl").on("click", function change() {  	//button LABEL

   d3.select("#chart").selectAll('svg').remove();
   d3.select("#scale_bar").selectAll('svg').remove();
   
   if(x_1){// if x_1 is not null make ..
   		manhattan_plot(x_1,x_2,y_1,y_2);
   		
   		d3.select("#minmap_mp").selectAll('svg').remove();
   		
   		manhattan_plot_minmap(ix_1,ix_2,iy_1,iy_2,   x_1,  y_2,  x_2-x_1, y_1)
   		
   	}
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















