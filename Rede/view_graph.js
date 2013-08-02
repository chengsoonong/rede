/**
 * @fileoverview Utilities such as global variable and functions for handling the functions in another javascript files and create the plots.
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */




//------------------------------------------   Global variable   ---------------------------------------------- 

/**
 * Global variable for circle_plot.js and view_graph.js to save a selected information of a json file
 * @type {string} string_html
 */
var string_html; 						
/**
 * Global variable for manhattan_plot.js and view_graph.js to put label in dots in manhattan plot
 * @type {svg} label_text
 */
var label_text;  							
/**
 * Global variable for manhattan_plot.js and view_graph.js with the all dots to create manhattan plot. 
 * It's used inside read_file_to_manhattan_plot() and here in button zoom, reset, label and remove label.  
 * @type {array} data
 */
var data;									
/**
 * Constant for manhattan_plot.js and view_graph.js decide if it will use the variable "data" or  "data_select_from_HDS".
 * with the data to create manhattan plot and used inside read_file_to_manhattan_plot() 
 * @type {string} data_from_HDS
 */
var data_from_HDS="no"
/**
 * Global variable for hit_degree_snps_plot.js and view_graph.js hindle to create the manhattan plot with specifcs dots.
 * @type {array} data_select_from_HDS
 */
var data_select_from_HDS;
/**
 * Global variables for manhattan_plot.js and view_graph.js hindle to create the manhattan plot with the initial dots.
 * @type {number} ix_1, ix_2, iy_1, iy_2
 */
var ix_1,ix_2,iy_1,iy_2; 					
/**
 * Global variables for manhattan_plot.js and view_graph.js hindle to create the manhattan 
 * plot with specifcs dots selected by brush.
 * @type {number} x_1, x_2, y_1, y_2
 */
var x_1,x_2,y_1,y_2; 						
/**
 * Global variables for matrix_snp_comm_plot.js, matrix_plot.js and view_graph.js use the initial dots.
 * when a of this plots is selected it will use this variables.
 * @type {number} mix_1, mix_2, miy_1, miy_2
 */
var mix_1,mix_2,miy_1,miy_2; 					
/**
 * Global variables for matrix_snp_comm_plot.js, matrix_plot.js and view_graph.js to do the zoom.
 * when a of this plots is selected it will use this variables.
 * @type {number} mx_1, mx_2, my_1, my_2 
 */
var mx_1,mx_2,my_1,my_2; 			 
/**
 * Global variable that is used in view_graph.js, hist_degree_snps_plot.js and hist_edges_subgraphID_plot.js  
 *  It have information about wich plot was selected.
 * @type {string} plot_chosen   
 */
var plot_chosen;						
/**
 * Global variable that is used in view_graph.js, circle_plot.js,  hist_degree_snps_plot.js and manhattan_plot.js  
 *  It have information about wich statistical test was selected.
 * @type {string} st_chosen   
 */
var st_chosen;  						
/**
 * Global variable that is used in view_graph.js and matrix_plot.js  
 *  It have information about wich statistical test was selected to be used in matrix plot.
 * @type {string} st_chosen1   
 */
var st_chosen1;  						
/**
 * Global variable that is used in view_graph.js and matrix_plot.js  
 * It have information about wich statistical test was selected to be used in matrix plot.
 * @type {string} st_chosen2   
 */
var st_chosen2; 
/**
 * Global variable that is used in view_graph.js and circle_plot.js  
 * It have information each nodes.
 * @type {array} allNodes   
 */
var allNodes;
/**
 * Global variable that is used in circle_plot.js to create the brush and manhattan_plot.js 
 * to create the axis y of the manhattan plot. It has the dots about wich statistical test 
 * was selected to be used.
 * @type {array} data_weight_pvalue   
 */
var data_weight_pvalue; 				
/**
 * Global variable that is used in view_graph.js and circle_plot.js  
 * It have information each nodes pairs.
 * @type {array} links   
 */
var links;    	
/**
 * Global variable that have information about of the file path choosen.
 * @type {srtring} file_json   
 */						
var file_json;  						
/**
 * Global variable that will be used to get the information about of the statistical test choosen.
 * @type {d3} select_dropbox   
 */	
var select_dropbox;						
/**
 * Global variable that is used in view_graph.js. It will be used to get the information about of the statistical test choosen.
 * @type {d3} select_dropbox_scale1   
 */	
var select_dropbox_scale1;						
/**
 * Global variable that is used in view_graph.js. It will be used to get the information about of the statistical test choosen.
 * @type {d3} select_dropbox_scale2   
 */	
var select_dropbox_scale2;						
/**
 * Global variable that is used in view_graph.js. It will be used to get the information about of the statistical test to
 * create the dropbox.
 * @type {object} statOptions   
 */
var statOptions={}		
/**
 * Global variable that is used in view_graph.js. It will be used to check if there is communities in the json file
 * create the dropbox.
 * @type {array} list_keys_json     
 */
var list_keys_json=[]
/**
 * Global variable that is used in view_graph.js and circle_plot. It will be used to check if there is communities in the json file
 * create the dropbox.
 * @type {string} use_communities     
 */
var use_communities="no"  
/**
 * Global variable that is used in view_graph.js. It is save the first statistical test to be visualited
 * create the dropbox.
 * @type {string} st_1     
 */
var st_1=[]
/**
 * Global variables for manhattan_plot.js and view_graph.js hindle to create the manhattan plot with the initial dots.
 * @type {number} ix_1, ix_2, iy_1, iy_2
 */
var brush_value1, brush_value2;
			
 

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Global variable ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 




//------------------------------------------ load -  first vizualization   ---------------------------------------------- 

/**
 * Get the path of the one json file and pass this file in the function upload_json().
 *     More reference in http://www.html5rocks.com/en/tutorials/file/dndfiles/.
 * @param {event} evt it has information about the file or files - FileList object
 */
function handleFileSelect(evt) {
  	
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      var reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {   upload_json(e.target.result) };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
  }

document.getElementById('files').addEventListener('change', handleFileSelect, false);




plot_chosen="load";    //chosen the load like default
hide_selection();      //hide the manhattan's , circle's and matrix's buttons and another things in the first vizualization




/**
 * This function make the upload of a json file and create the first vizualization with this selected file.
 * @param {string} file_name has information about the file. 
 */
function upload_json ( file_name ){
    //this function make the upload of a json file and create the first vizualization with this selected file	

	
//------------------ create and change values in statistic test drop box
    use_communities="no" //check if there is communities in the json file
    d3.json(file_name, function(json) {         
    //assoc_group , source ,  target ,subgraph_id ,fltGSS_prtv, fltChi2, fltGSS, fltGSS_cntr, fltSS, fltDSS, ct_id,
    statOptions={}
    list_keys_json=[]
    d3.select("#ec_scale_bar_c").transition().style("opacity", 0);
    
    for (var i in json.links[0] ){
        if (i!="assoc_group" &&  i!="source"  &&  i!="target" &&  i!="probe_group" && i!="ct_id"){
            statOptions[i]=i
            st_1.push(i) //get the first element to be visualited
            }}
            
    for (var i in json ){
    		list_keys_json.push(i)
    	}
	if(include_in_arr(list_keys_json,"communities")){ //check if there is communities in the json file
		use_communities="yes"  //check if there is communities in the json file
		d3.select("#ec_scale_bar_c").transition().style("opacity", 1);
	}	
			
    st_chosen=st_1[0] //the first element to be visualited
    st_chosen1=st_1[0] //the first element to be visualited
    st_chosen2=st_1[0] //the first element to be visualited

    creat_drop_box1("st_select2")
    creat_drop_box2("scalecolor1_dropbox")
    creat_drop_box3("scalecolor2_dropbox")
				
    change_drop_box1() 
    change_drop_box2()
    change_drop_box3()
	
});
//^^^^^^^^^^^^^^^^^ create and change values in statistic test drop box

    graphColor = d3.scale.category10(); 		//reset this varieble
    file_json=file_name;     					//initializes this goblal variable
    plot_chosen="p_cir";   						//chosen the circle plot like default
	
    d3.select("#hesid").selectAll('svg').remove();					//remove old selection
    d3.select("#scale_bar").selectAll('svg').remove();				//remove old selection
    d3.select("#chart").selectAll('svg').remove();  			    //remove old selection
    
    d3.select("#pairs").selectAll("p").remove();    				//remove old selection
    d3.select("body").selectAll('svg').remove(); 					//remove old selection
    d3.select("#two_weight_value").selectAll("h").remove(); 		//remove old selection 
    
	d3.select("#hds_matrix").selectAll('svg').remove();  			    //remove old selection
	
    hide_selection();    					 	//hide the buttons and other things 
    show_selection();							//show the buttons and other things
    Create_chr_circle(0,0,0);
    Create_SNP_association(file_json);			//Create_SNP_association("bdWTC_GSS.json");	
    brush_weight(file_json);					//brush_weight("bdWTC_GSS.json");
    histogram_edges_subgraphId(file_json);
    
    histogram_degree_SNPs(file_json,0);	
    
    
   
	
}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ load - first vizualization ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 




// ----------------------------  chose the plot  - drop box ---------------------------------------------- 
 
/**
 * Allows us choose one plot to vizualization
 */
d3.select("#Plot_select").on("change", function change() {
    plot_chosen=this.value; 	
    
    //remove old selection
    d3.select("#chart").selectAll('svg').remove();
    d3.select("#scale_bar").selectAll('svg').remove();
    d3.select("#pairs").selectAll("p").remove();
    d3.select("body").selectAll('svg').remove();
    d3.select("#two_weight_value").selectAll("h").remove();
    d3.select("#hesid").selectAll('svg').remove();
    d3.select("#table_snps").selectAll('table').remove();   
  
    // redraw everything
    hide_selection();
    show_selection();

    if (this.value==="p_cir") {
        // Circular plot
        d3.select("body").select("#two_weight_value").transition().style("opacity", 1);
        d3.select("body").select("#cb").transition().style("opacity", 1);
        d3.select("body").select("#hc").transition().style("opacity", 1);
        d3.select("body").select("#snps_text").transition().style("opacity", 1);
        d3.select("body").select("#footer").transition().style("opacity", 1);
        d3.select("#hds_matrix").selectAll('svg').remove();

        //create genome object again
        Create_chr_circle(0,0,0);
        Create_SNP_association(file_json);
        brush_weight(file_json);
        histogram_edges_subgraphId(file_json);
        histogram_degree_SNPs(file_json,0);	
                
    } else if (this.value==="p_man") {
	// Manhattan plot
	d3.select("#hds_matrix").selectAll('svg').remove();				
        d3.select("body").select("#two_weight_value").transition().style("opacity", 0);
        d3.select("body").select("#cb").transition().style("opacity", 0);
        d3.select("body").select("#hc").transition().style("opacity", 0);
        d3.select("body").select("#snps_text").transition().style("opacity", 0);
        d3.select("body").select("#footer").transition().style("opacity", 0);
        d3.select("#table_snps").selectAll('table').remove();	
        read_file_to_manhattan_plot(file_json);
        histogram_degree_SNPs(file_json,0);	
				
    } else if (this.value==="p_mat") {
        // Heat map of association matrix
	d3.select("#hds_matrix").selectAll('svg').remove();
        d3.select("body").select("#two_weight_value").transition().style("opacity", 0);
        d3.select("body").select("#cb").transition().style("opacity", 0);
        d3.select("body").select("#hc").transition().style("opacity", 0);
        d3.select("body").select("#snps_text").transition().style("opacity", 0);
        d3.select("body").select("#footer").transition().style("opacity", 0);
        d3.select("#table_snps").selectAll('table').remove();
        //matrix_plot( file_json);  // plot matrix of the snps association 
        read_file_to_matrix_plot(file_json);
        histogram_degree_SNPs(file_json,0);	
   
    } else if (this.value==="p_mat_c") {
        // the number of edges per community
     	d3.select("#hds_matrix").selectAll('svg').remove();
     	d3.select("body").select("#two_weight_value").transition().style("opacity", 0);
        d3.select("body").select("#cb").transition().style("opacity", 0);
        d3.select("body").select("#hc").transition().style("opacity", 0);
        d3.select("body").select("#snps_text").transition().style("opacity", 0);
        d3.select("body").select("#footer").transition().style("opacity", 0);
        d3.select("#table_snps").selectAll('table').remove();	
        histogram_edges_subgraphId(file_json);
	read_file_to_matrix_comm_plot(file_json);
     	histogram_degree_SNPs(file_json,0);	
    }
});
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ chose the plot - drop box ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 




//------------------------------------------  Statistical Test - drop box----------------------------------------------

/**
 * Create the dropbox statistical test to circle plot and manhattan plot 
 * @param {string} classinput is a name to create um class
 */
function creat_drop_box1(classinput){
        d3.select("#"+classinput).selectAll('select').remove();
        // create the select element
        select_dropbox = d3.select("#"+classinput).append("select");
        // create the options
        select_dropbox.selectAll("option").data(d3.keys(statOptions)).enter().append("option").text(function(d) {
        	return d;
        });
        // add values to the options
        select_dropbox.selectAll("option").data(d3.values(statOptions)).attr("value", function(d) {
        return d;
        });
}

/**
 * Create the dropbox with statistical tests (Upper Right) to matrix plot 
 * @param {string} classinput is a name to create um class
 */
function creat_drop_box2(classinput){
    d3.select("#"+classinput).selectAll('select').remove();
    // create the select element
    select_dropbox_scale1 = d3.select("#"+classinput).append("select");
    // create the options
    select_dropbox_scale1.selectAll("option").data(d3.keys(statOptions)).enter().append("option").text(function(d) {
        return d;
    });
    // add values to the options
    select_dropbox_scale1.selectAll("option").data(d3.values(statOptions)).attr("value", function(d) {
        return d;
    });
}

/**
 * Create the dropbox with statistical tests (lower left) to matrix plot 
 * @param {string} classinput is a name to create um class
 */
function creat_drop_box3(classinput){
    d3.select("#"+classinput).selectAll('select').remove();
    // create the select element
    select_dropbox_scale2 = d3.select("#"+classinput).append("select");
    // create the options
    select_dropbox_scale2.selectAll("option").data(d3.keys(statOptions)).enter().append("option").text(function(d) {
    	return d;
    });
    // add values to the options
    select_dropbox_scale2.selectAll("option").data(d3.values(statOptions)).attr("value", function(d) {
    	return d;
    });
}

/**
 * Made atualizations when the dropbox with statistical tests is changed. 
 */
function change_drop_box1(){

    select_dropbox.on("change", function change() {
    st_chosen=this.value;
    
    if(plot_chosen==="p_cir"){
   			
            reset();
            d3.select("#st_name").selectAll("h").remove(); //remove the old text
            d3.select("#st_name").selectAll("h")           //create the new text
                .data([1])
                .enter().append("h")
                .text(st_chosen);
                
   			d3.select("#hds_matrix").selectAll('svg').remove();             
             histogram_degree_SNPs(file_json,0);	
    
                
             //maybe could be necessary remove before create again  				
            	
    }else if( plot_chosen==="p_man"){
    	
        d3.select("#chart").selectAll('svg').remove();
        d3.select("#scale_bar").selectAll('svg').remove();
        d3.select("#minmap_mp").selectAll('svg').remove();
        d3.select("#hds_matrix").selectAll('svg').remove();          
        read_file_to_manhattan_plot(file_json);
		           
        histogram_degree_SNPs(file_json,0);	
    	
		
		
    }else{
				
                d3.select("body").select("#two_weight_value").transition().style("opacity", 0);
                d3.select("body").select("#cb").transition().style("opacity", 0);
                d3.select("body").select("#hc").transition().style("opacity", 0);
                d3.select("body").select("#snps_text").transition().style("opacity", 0);
                d3.select("body").select("#footer").transition().style("opacity", 0);
                
                d3.select("#scalecolor_matrix1").selectAll('svg').remove();
                d3.select("#scalecolor_matrix2").selectAll('svg').remove();
                d3.select("#minmap_matrixp").selectAll('svg').remove();
                d3.select("#chart").selectAll('svg').remove(); 
                read_file_to_matrix_plot(file_json);

            }	
    });
}
 
/**
 * Do atualizations when the dropbox with dropbox with statistical tests (Upper Right) is changed. 
 */
function change_drop_box2(selectDB){

    select_dropbox_scale1.on("change", function change() {
	
                st_chosen1=this.value; 
                d3.select("body").select("#two_weight_value").transition().style("opacity", 0);
                d3.select("body").select("#cb").transition().style("opacity", 0);
                d3.select("body").select("#hc").transition().style("opacity", 0);
                d3.select("body").select("#snps_text").transition().style("opacity", 0);
                d3.select("body").select("#footer").transition().style("opacity", 0);
                
                d3.select("#scalecolor_matrix1").selectAll('svg').remove();
                d3.select("#scalecolor_matrix2").selectAll('svg').remove();
                d3.select("#minmap_matrixp").selectAll('svg').remove();
                d3.select("#chart").selectAll('svg').remove(); 
                read_file_to_matrix_plot(file_json);
    });
 
}
 

/**
 * Do atualizations when the dropbox with dropbox with statistical tests (lower left) is changed.
 */
function change_drop_box3(selectDB){

    select_dropbox_scale2.on("change", function change() {
                st_chosen2=this.value; 
                d3.select("body").select("#two_weight_value").transition().style("opacity", 0);
                d3.select("body").select("#cb").transition().style("opacity", 0);
                d3.select("body").select("#hc").transition().style("opacity", 0);
                d3.select("body").select("#snps_text").transition().style("opacity", 0);
                d3.select("body").select("#footer").transition().style("opacity", 0);
                
                d3.select("#scalecolor_matrix1").selectAll('svg').remove();
                d3.select("#scalecolor_matrix2").selectAll('svg').remove();
                d3.select("#minmap_matrixp").selectAll('svg').remove();
                d3.select("#chart").selectAll('svg').remove(); 
                read_file_to_matrix_plot(file_json);				
        }); 
}
  
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Statistical Test - drop box^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 



  
//------------------------------------------show roc and contegency table   ----------------------------------------------      

/**
 * input tag and button to search for pairs snps to craete the roc and contegency table
 */
function show_roc_ct(){
  	
  	
    snps=document.getElementById("search_snps").value;	
	
	
		 
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

    snps=snps.split(" ");  
	
    var snp_a=snps[0];
    var snp_b=snps[snps.length-1];
    var idx_snps="null";	
	
    var idx_in_links;		
    	 
    for (var i in allNodes_links){
		
        if ( (snp_a == allNodes_links[i].prb_a     && snp_b == allNodes_links[i].prb_b)     ||
            (snp_a == allNodes_links[i].prbCode_a && snp_b == allNodes_links[i].prbCode_b) ||
            (snp_a == allNodes_links[i].browser_a && snp_b == allNodes_links[i].browser_b) ||
            (snp_a == allNodes_links[i].rs_a && snp_b == allNodes_links[i].rs_b) )			 
            {
                    
                    idx_snps=allNodes_links[i].id_links;			
                    idx_in_links=i;
            }
        }


    if(idx_snps!="null"){
		
			d3.select("#table_snps").selectAll('table').remove();
        create_table_snps(links[idx_snps])	
       // alert(links[idx_snps])
        d3.select("#rp").selectAll('svg').remove();
        //ROC_plot (links[i].roc_id,file_json)
        ROC_plot (links[idx_snps].ct_id,file_json)		
        d3.select("#contp").selectAll('svg').remove();
        cont_plot (links[idx_snps].ct_id,file_json);	
        
        
        if(plot_chosen==="p_cir"){ //plot_chosen==="p_man"){	plot_chosen==="p_cir"
   	 
            d3.select("#chart").selectAll("g circle").transition().style("opacity", 1);			
            d3.select("#chart").selectAll("g circle")  //select the circles
            .filter(function(d) {            	            	 
                return d.prb != allNodes_links[idx_in_links].prb_a   &&  d.prb !=allNodes_links[idx_in_links].prb_b ;
            })
            .transition()
            .style("opacity", 0);            
 	 
   	        
   	        d3.select("#chart").selectAll(".link").transition().style("opacity", 0);   	   
            d3.select("#chart") .selectAll(".link") //select the association regarding to the circle selected
            .filter(function(d,i) {
                return i == idx_in_links;
            }).transition()
                style("opacity", 0.3);	
  
        }else if(plot_chosen==="p_man"){
        	
        	//alert("can do something in manhattan plot")
        	
        }else{
        	
        	//alert("can do something in matrix plot")
        	
        	
        }
        
        
    }else{
        
        d3.select("#table_snps").selectAll('table').remove();
        d3.select("#rp").selectAll('svg').remove();
        d3.select("#contp").selectAll('svg').remove();			
        alert("Error: search again!")
        }
        
}
   
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^    show roc and contegency table    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 
  
  
      
  
//------------------------------------------load and save -  show the data selected in json file    ----------------------------------------------
      
/**
 * This function create a new tab, when we click in button "show .json", with a .json with datas selected
 */

/*
function selected_json(){
               	
        //myWindow=window.open('','','width=200,height=100')	
        myWindow=window.open('','json file');
        //myWindow.document.write("\"string_html\"");
        myWindow.document.write(string_html);
        myWindow.focus();
        
        string_html="";
}
*/

function selected_json(){
	

      	
        d3.json(file_json, function(json) {
 	   
        var string_html_export="";     
        var link_html="\"links\": [";
        var nodes_html="\"nodes\": [";
        var subgraphs_html="\"subgraphs\": [";
        var ct_html="\"cont_table\": [";
        
        number_count_probe_group=1      
        number_count_map_id=0
        number_count_ct_id=0
        number_count_degree=0
        
        //like dictioniry
        map_degree=d3.map();
        map_probe_group=d3.map();
        map_id=d3.map();
        map_nodes=d3.map();
        map_subgraph_nedges=d3.map();
        map_ct_id=d3.map();
        
        function update_map_id(key){        	
        	if(map_id.has(key)!=true){
				map_id.set(key,number_count_map_id)
				number_count_map_id=number_count_map_id+1        		         		
        	}
        }        
        
		function update_map_probe_group(key){        	
        	if(map_probe_group.has(key)!=true){
				map_probe_group.set(key,number_count_probe_group)
				number_count_probe_group=number_count_probe_group+1        		         		
        	}
        }      

        function update_map_degree(key){        		
        		if(map_degree.has(key)!=true){
        			map_degree.set(key,1)					        		         		
        		}else{        			
        			v=map_degree.get(key)+1
					map_degree.set(key,v )
        		}	        	        		         		
        }       
             
        function update_map_subgraph_nedges(key){        		
        		if(map_subgraph_nedges.has(key)!=true){
        			map_subgraph_nedges.set(key,1)					        		         		
        		}else{        			
        			v=map_subgraph_nedges.get(key)+1
					map_subgraph_nedges.set(key,v )
        		}	        	        		         		
        }        
        
        function update_map_ct_id(key){
        	if(map_ct_id.has(key)!=true){
				map_ct_id.set(key,number_count_ct_id)
				number_count_ct_id=number_count_ct_id+1        		         		
        	}
        }
        
         	
        json.links.forEach( function(d) {
 
						if (d[st_chosen]  >=  brush_value1	&& d[st_chosen] <=brush_value2){
									
								update_map_degree(d.source)
								update_map_degree(d.target)
								update_map_id(d.source)
								update_map_id(d.target)								
								update_map_ct_id(d.ct_id)
								update_map_probe_group(d.probe_group)
								update_map_subgraph_nedges(map_probe_group.get(d.probe_group))
								
								if( map_id.get(d.source) > map_id.get(d.target)){								
									string_link= "{\"source\": "+map_id.get(d.source)+", \"probe_group\": "+map_probe_group.get(d.probe_group)+", \"target\": "+map_id.get(d.target)+", \"ct_id\": "+map_ct_id.get(d.ct_id)
								}else{
									string_link= "{\"source\": "+map_id.get(d.target)+", \"probe_group\": "+map_probe_group.get(d.probe_group)+", \"target\": "+map_id.get(d.source)+", \"ct_id\": "+map_ct_id.get(d.ct_id)									
								}
																	                
								for (i in st_1){
									string_link+=", \""+st_1[i]+"\": "+d[st_1[i]]	
								}	
								string_link+="},"	
								link_html+=string_link;
								//document.write(link_html);
						//}	 			
					}
        				 	 
        });
        link_html=link_html.substring(0,link_html.lastIndexOf(","));// IMP -> 		remover a ultima virgula 	   <- IMP	
        link_html=link_html+']'
        

        json.nodes.forEach( function(d){
        	//create the nodes to be exporte in json file. It were selected in reange of p-value 
        	//"nodes": [{"prbCode": "rs10205611", "degree": 1.0, "prb": 0, "rs": "rs10205611","probe_group": 1, "bp_position": 148853010, "chrom": 2, "id": 0}
        	
        	//if(map_id.has(d.id)!=null && map_id.has(d.id)!=undefined){
        	if(map_id.has(d.id)){	        		
					    string_node="{\"prbCode\": \""+d.prbCode +"\", \"degree\": "+map_degree.get(d.id)+", \"rs\": \""+d.rs+"\", \"bp_position\": "+d.bp_position+
			     			", \"chrom\": "+d.chrom+", \"id\": "+map_id.get(d.id)+", \"probe_group\": "+map_probe_group.get(d.probe_group)+", \"prb\": "+d.prb+"}"; 
			     		//document.write(map_id.get(d.id),string_node)	
		        		map_nodes.set(map_id.get(d.id),string_node);
        	}
        });        
        sort_keys=map_nodes.keys();
        sort_keys.sort(function(a,b){return a-b});
        for (i in sort_keys ){	
			nodes_html+=map_nodes.get(sort_keys[i])+","
		}
        nodes_html=nodes_html.substring(0,nodes_html.lastIndexOf(","));// IMP -> 		remover a ultima virgula 	   <- IMP	
        nodes_html=nodes_html+']'
        
        //create the cont_table to be exporte in json file. It were selected in reange of p-value         
        //"cont_table":[{"unv1": [{"controls":35.0 ,"cases":18.0 }, {"controls":12.0 ,"cases":3.0 }, {"controls":8.0 ,"cases":4.0 }], 
        //"unv2": [{"controls":40.0 ,"cases":21.0 }, {"controls":14.0 ,"cases":4.0 }, {"controls":1.0 ,"cases":0.0 }], 
        //"biv": [[{"controls":25.0 ,"cases":15.0}, {"controls":9.0 ,"cases":3.0}, {"controls":1.0 ,"cases":0.0}],[{"controls":8.0 ,"cases":2.0}, {"controls":4.0 ,"cases":1.0}, {"controls":0.0 ,"cases":0.0}],[{"controls":7.0 ,"cases":4.0}, {"controls":1.0 ,"cases":0.0}, {"controls":0.0 ,"cases":0.0}]], 
        //"total": {"controls":55.0 ,"cases":25.0 }}]                
        Array_map_ct_id=[]
        json.cont_table.forEach( function(d,i){
        	if (i in map_ct_id.keys()){ 
        	Array_map_ct_id.push(d)
        	}
        }); 
               
        for (i in Array_map_ct_id ){	
        	
        	ct_html+="{\"unv1\": [{\"controls\": "+Array_map_ct_id[i]["unv1"][0]["controls"]+",\"cases\": "+ Array_map_ct_id[i]["unv1"][0]["cases"]+"} "
        	ct_html+=",{\"controls\": "+Array_map_ct_id[i]["unv1"][1]["controls"]+",\"cases\": "+ Array_map_ct_id[i]["unv1"][1]["cases"]+"} "
        	ct_html+=",{\"controls\": "+Array_map_ct_id[i]["unv1"][2]["controls"]+",\"cases\": "+ Array_map_ct_id[i]["unv1"][2]["cases"]+"}], "
        	
        	ct_html+="\"unv2\": [{\"controls\": "+Array_map_ct_id[i]["unv2"][0]["controls"]+",\"cases\": "+ Array_map_ct_id[i]["unv2"][0]["cases"]+"} "
        	ct_html+=",{\"controls\": "+Array_map_ct_id[i]["unv2"][1]["controls"]+",\"cases\": "+ Array_map_ct_id[i]["unv2"][1]["cases"]+"} "
        	ct_html+=",{\"controls\": "+Array_map_ct_id[i]["unv2"][2]["controls"]+",\"cases\": "+ Array_map_ct_id[i]["unv2"][2]["cases"]+"}], "
        	
        	ct_html+="\"biv\": [[{\"controls\": "+Array_map_ct_id[i]["biv"][0][0]["controls"]+",\"cases\": "+ Array_map_ct_id[i]["biv"][0][0]["cases"]+"} "
        	ct_html+=",{\"controls\": "+Array_map_ct_id[i]["biv"][0][1]["controls"]+",\"cases\": "+ Array_map_ct_id[i]["biv"][0][1]["cases"]+"} "
        	ct_html+=",{\"controls\": "+Array_map_ct_id[i]["biv"][0][2]["controls"]+",\"cases\": "+ Array_map_ct_id[i]["biv"][0][2]["cases"]+"}], "        	
        	ct_html+="[{\"controls\": "+Array_map_ct_id[i]["biv"][1][0]["controls"]+",\"cases\": "+ Array_map_ct_id[i]["biv"][1][0]["cases"]+"} "
        	ct_html+=",{\"controls\": "+Array_map_ct_id[i]["biv"][1][1]["controls"]+",\"cases\": "+ Array_map_ct_id[i]["biv"][1][1]["cases"]+"} "
        	ct_html+=",{\"controls\": "+Array_map_ct_id[i]["biv"][1][2]["controls"]+",\"cases\": "+ Array_map_ct_id[i]["biv"][1][2]["cases"]+"}], "        	
        	ct_html+="[{\"controls\": "+Array_map_ct_id[i]["biv"][2][0]["controls"]+",\"cases\": "+ Array_map_ct_id[i]["biv"][2][0]["cases"]+"} "
        	ct_html+=",{\"controls\": "+Array_map_ct_id[i]["biv"][2][1]["controls"]+",\"cases\": "+ Array_map_ct_id[i]["biv"][2][1]["cases"]+"} "
        	ct_html+=",{\"controls\": "+Array_map_ct_id[i]["biv"][2][2]["controls"]+",\"cases\": "+ Array_map_ct_id[i]["biv"][2][2]["cases"]+"}]], "
        	
        	ct_html+="\"total\": {\"controls\": "+Array_map_ct_id[i]["unv2"][0]["controls"]+",\"cases\": "+ Array_map_ct_id[i]["unv2"][0]["cases"]+"}} ,"
        	}
        	
       	ct_html=ct_html.substring(0,ct_html.lastIndexOf(","));// IMP -> 		remover a ultima virgula 	   <- IMP	
        ct_html=ct_html+']'
        
        //create the subgraphs to be exporte in json file. It were selected in reange of p-value
        
        
        map_subgraph_nedges.forEach(function(k,v){
        	subgraphs_html+= "{\"probe_group\": "+ k +", \"edge_count\": "+v+"},"
        	
        })
        
		/*        
        for (i in map_subgraph_nedges){ 
       		 subgraphs_html+= "{\"probe_group\": "+ i +", \"edge_count\": "+map_subgraph_nedges[i]+"},"
        }
        */
        
        
        subgraphs_html=subgraphs_html.substring(0,subgraphs_html.lastIndexOf(","));// IMP -> 		remover a ultima virgula 	   <- IMP	
        subgraphs_html=subgraphs_html+']'
        
		
		//string that will be exported
		string_html_export= "{\"name\": \"export_name\", "+nodes_html+", " +link_html+", "  +subgraphs_html+", "  +ct_html+"} "
  	
		 
  
  var textFileAsBlob = new Blob([string_html_export], {type:'text/plain'});
	var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;

	var downloadLink = document.getElementById("downloadfile");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "Download "+fileNameToSaveAs;
	if (window.webkitURL != null)
	{
		// Chrome allows the link to be clicked programmatically.
		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
		downloadLink.click();
	}
	else
	{
		// Firefox requires the user to actually click the link.
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		//downloadLink.onclick = destroyClickedElement;
		//document.body.appendChild(downloadLink);
	}
  
  
  
  
  
        
});	
			
		//myWindow=window.open('','j'); 
		//myWindow.document.write( "string_html_export") 

}


       
/**
 * This function selected the elementes inside nodes with a subgraph_id chosen and put in the string string_html
 * @param {string} file_name
 * @param {number} probe_group 
 */
function json_nodes_selected(file_name,probe_group){  
		
d3.json(file_name, function(json) {
json.nodes.forEach( 	function(d) {
 	
    if(d.probe_group===probe_group){
 
        string_html+="{\"label\": \""+d.label+"\", \"degree\": "+d.degree+", \"rs\": \""+d.rs+
        "\", \"bp_position\": "+d.bp_position+", \"chrom\": "+d.chrom+", \"id\": "+d.id+", \"probe_group\": "+d.probe_group+"},";
        
    } }    );	
    string_html=string_html.substring(0,string_html.lastIndexOf(","));
    	
    string_html+="], \"links\": [";
});	
}

/**
 * This function selected the elementes inside nodes with a subgraph_id chosen and put in the string string_html
 * @param {string} file_name
 * @param {number} probe_group 
 */
function json_links_selected(file_name,probe_group){
        
        d3.json(file_name, function(json) {
        	json.links.forEach( 	function(d) { 
        
        
        if(d.probe_group===probe_group){
        
string_html+= "{\"source:\" "+d.source+", \"probe_group\": "+d.probe_group+", \"weight\": "+d.weight+", \"target\": "+d.target+", \"edgs_in_comm\": "+d.edgs_in_comm+", \"assoc_group\": "+d.assoc_group+ "},";	        
 //string_html+= "{\"source:\" "+d.source+", \"subgraph_id\": "+d.subgraph_id+", \"weight\": "+d.weight+", \"target\": "+d.target+"},";
         	 
        }	}    );
        
         
        string_html=string_html.substring(0,string_html.lastIndexOf(","));// IMP -> 		remover a ultima virgula 	   <- IMP
        		
        string_html+="], \"multigraph\": false}";
});	

}


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ show the data selected in json file ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 




//--------------------------------- operational functions ------------------------------------

/**
 * this function recreate the datas in vizualization, removed them and create them
 */
function reset() { 
   
             d3.select("#scale_bar").selectAll('svg').remove();  
             d3.select("#chart").selectAll('svg').remove();  					//remove old selection 
             
             d3.select("#pairs").selectAll("p").remove(); 
             d3.select("body").selectAll('svg').remove(); 	
             d3.select("#two_weight_value").selectAll("h").remove();
             d3.select("#hesid").selectAll('svg').remove();
             d3.select("#table_snps").selectAll('table').remove(); 
                				
    Create_chr_circle(0,0,0);												//create new again
            Create_SNP_association(file_json);        
            brush_weight(file_json);
            histogram_edges_subgraphId(file_json);

};

/**
 * return a string from um number with 2 decimal after "." (it is used in contegency table) 
 * @param {number} value 
 * @return {string} 
 */
function round_ct( value){              	
    var v=value.toString();
    var point=".";
    var index_point=v.indexOf(point);
    
    return v.substring(0,index_point);
}

/**
 * return a string from um number with 2 decimal after "."  
 * @param {number} value 
 * @return {string} 
 */
function two_dec( value){          	
    var v=value.toString();
    var point=".";
    var index_point=v.indexOf(point);
    var index_twodec=index_point+3;
    
    return v.substring(0,index_twodec);
}

/**
 * Get the number the edgs inside one communitties  
 * @param {number} assoc_group
 * @param {number} d 
 * @return {number} ret
 */
function n_edgs_in_comm (assoc_group,d){
    ret=0
    for( var i in d){
        if (d[i]["assoc_group"] === assoc_group) {
        ret=d[i]["edge_count"];
        
        break
        };
    }
    return ret;
}    

/**
 * Get the all snps pairs that were selected in the brush in circle plot.
 *     All pairs betewen p-values s1 and s2.   
 * @param {number} s1
 * @param {number} s2 
 * @return {array} l
 */
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
        	
/**
 * Check if a object is inside an array and return true if correct and false if no correct.   
 * @param {number} arr
 * @param {number} obj 
 * @return {Boolean} 
 */
function include_in_arr(arr,obj) {
    return (arr.indexOf(obj) != -1);
}
    
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ operational functions ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^




//--------------------------------------  BUTTONs AND OPERATIONS --------------------------------------

/**
 * hide buttons, scale and another things when a new plot is selected
 */
function hide_selection(){

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
        
        d3.select("#up").transition().style("opacity", 0);
        d3.select("#ll").transition().style("opacity", 0);
        d3.select("#scalecolor1_dropbox").transition().style("opacity", 0);
        d3.select("#scalecolor2_dropbox").transition().style("opacity", 0);
        
        d3.select("#scalecolor_matrix1").transition().style("opacity", 0);
        d3.select("#scalecolor_matrix2").transition().style("opacity", 0);
        
    }else if(plot_chosen==="p_cir"){

        d3.select("body").select("#butpl").transition().style("opacity", 0);
        d3.select("body").select("#butrl").transition().style("opacity", 0);
            
        d3.select("#min_num_scale_bar").selectAll("h1").remove();         // numbers of  color scale bar 
        d3.select("#max_num_scale_bar").selectAll("h1").remove();         // numbers of  color scale bar
        d3.select("#degree_scale_bar").transition().style("opacity", 0);  // title of  color scale bar  
        
        d3.select("#load_data").remove();	
        
        d3.select("#up").transition().style("opacity", 0);
        d3.select("#ll").transition().style("opacity", 0);
        d3.select("#scalecolor1_dropbox").transition().style("opacity", 0);
        d3.select("#scalecolor2_dropbox").transition().style("opacity", 0);
        
        d3.select("#scalecolor_matrix1").transition().style("opacity", 0); 
        d3.select("#scalecolor_matrix2").transition().style("opacity", 0); 				
        
  	
    }else if( plot_chosen==="p_man"){			

        d3.select("#min_num_scale_bar_c").selectAll("h1").remove();         // numbers of  color scale bar 
        d3.select("#max_num_scale_bar_c").selectAll("h1").remove();         // numbers of  color scale bar
        d3.select("#ec_scale_bar_c").transition().style("opacity", 0);  // title of  color scale bar
        d3.select("#scale_bar_c").transition().style("opacity", 0);
        
        d3.select("#load_data").remove();
        
        d3.select("#up").transition().style("opacity", 0);
        d3.select("#ll").transition().style("opacity", 0);
        d3.select("#scalecolor1_dropbox").transition().style("opacity", 0);
        d3.select("#scalecolor2_dropbox").transition().style("opacity", 0);
        
        d3.select("#scalecolor_matrix1").transition().style("opacity", 0); 
        d3.select("#scalecolor_matrix2").transition().style("opacity", 0); 				
        		
        		
    } else if (plot_chosen==="p_mat") {
        
        d3.select("#min_num_scale_bar").selectAll("h1").remove();         // numbers of  color scale bar 
        d3.select("#max_num_scale_bar").selectAll("h1").remove();         // numbers of  color scale bar
        d3.select("#degree_scale_bar").transition().style("opacity", 0);  // title of  color scale bar  
        
        d3.select("#load_data").remove();	
        
        d3.select("#min_num_scale_bar_c").selectAll("h1").remove();         // numbers of  color scale bar 
        d3.select("#max_num_scale_bar_c").selectAll("h1").remove();         // numbers of  color scale bar
        d3.select("#ec_scale_bar_c").transition().style("opacity", 0);  // title of  color scale bar
        d3.select("#scale_bar_c").transition().style("opacity", 0);
        d3.select("#st_select2").transition().style("opacity", 0);
        	
        d3.select("#load_data").remove();
        
    } else if( plot_chosen==="p_mat_c"){ 
    	
     d3.select("#min_num_scale_bar_c").selectAll("h1").remove();         // numbers of  color scale bar 
        d3.select("#max_num_scale_bar_c").selectAll("h1").remove();         // numbers of  color scale bar
        d3.select("#ec_scale_bar_c").transition().style("opacity", 0);  // title of  color scale bar
        d3.select("#scale_bar_c").transition().style("opacity", 0);
        
        d3.select("#load_data").remove();
        
        d3.select("#up").transition().style("opacity", 0);
        d3.select("#ll").transition().style("opacity", 0);
        d3.select("#scalecolor1_dropbox").transition().style("opacity", 0);
        d3.select("#scalecolor2_dropbox").transition().style("opacity", 0);
        
        d3.select("#scalecolor_matrix1").transition().style("opacity", 0); 
        d3.select("#scalecolor_matrix2").transition().style("opacity", 0); 	
    
    
    
        }
}

/**
 * show buttons, scale and another things when a new plot is selected
 */
function show_selection(){ 
	
    if (plot_chosen==="p_cir") {
        
        d3.select("body").select("#butz").transition().style("opacity", 1);
        d3.select("#ec_scale_bar_c").transition().style("opacity", 1);  // title of  color scale bar
        d3.select("#scale_bar_c").transition().style("opacity", 1);
        d3.select("body").select("#butr").transition().style("opacity", 1);
        d3.select("#st_select2").transition().style("opacity", 1);
  	
    } else if( plot_chosen==="p_man") {			
	
        d3.select("body").select("#butz").transition().style("opacity", 1);
        d3.select("body").select("#butr").transition().style("opacity", 1);
        d3.select("body").select("#butpl").transition().style("opacity", 1);
        d3.select("body").select("#butrl").transition().style("opacity", 1);
        d3.select("#degree_scale_bar").transition().style("opacity", 1);    // title of  color scale bar  
        d3.select("#st_select2").transition().style("opacity", 1);
        
    } else if( plot_chosen==="p_mat") { 
	
        d3.select("body").select("#butz").transition().style("opacity", 1);
        d3.select("body").select("#butr").transition().style("opacity", 1);
        d3.select("#up").transition().style("opacity", 1);
        d3.select("#ll").transition().style("opacity", 1);
        d3.select("#scalecolor1_dropbox").transition().style("opacity", 1);
        d3.select("#scalecolor2_dropbox").transition().style("opacity", 1);
        
        d3.select("#scalecolor_matrix1").transition().style("opacity", 1); 
        d3.select("#scalecolor_matrix2").transition().style("opacity", 1); 				
        
    } else if( plot_chosen==="p_mat_c"){ 
   	d3.select("body").select("#butz").transition().style("opacity", 1);
        d3.select("body").select("#butr").transition().style("opacity", 1);
    };  	   
}

/**
 * Do zoom when the button ZOOM is clicked
 */
d3.select("body").select("#butz").on("click", function change() {
    if (plot_chosen==="p_cir") {
        // Circular plot
        // remove old things
        d3.select("#hesid").selectAll('svg').remove();
        d3.select("#scale_bar").selectAll('svg').remove();
        d3.select("#chart").selectAll('svg').remove();
        d3.select("#pairs").selectAll("p").remove();
        d3.select("body").selectAll('svg').remove();
        d3.select("#two_weight_value").selectAll("h").remove();
        d3.select("#hds_matrix").selectAll('svg').remove();	

	// read the zoom parameters
        view_chr = document.getElementById("view_chr").value;	
        view_start = document.getElementById("texzs").value;	
        view_end = document.getElementById("texze").value;	

        // draw zoomed circle "+" converts string to int
        Create_chr_circle(+view_chr, +view_start, +view_end);
        Create_SNP_association(file_json);
        brush_weight(file_json);
        histogram_edges_subgraphId(file_json);
        histogram_degree_SNPs(file_json,0);	
    	
    } else if ( plot_chosen==="p_man") {
        // Manhattan plot
	if(data_from_HDS==="no"){
            d3.select("#chart").selectAll('svg').remove();
            d3.select("#scale_bar").selectAll('svg').remove();
            
            if (x_1) {// if x_1 is not null make ..
                manhattan_plot(x_1,x_2,y_1,y_2,data);  		   		 
                d3.select("#minmap_mp").selectAll('svg').remove();   		
                manhattan_plot_minmap(ix_1,ix_2,iy_1,iy_2,   x_1,  y_2,  x_2-x_1, y_1,data)
            } else {     
                manhattan_plot(ix_1,ix_2,iy_1,iy_2,data);
            };
        } else {
            d3.select("#chart").selectAll('svg').remove();
            d3.select("#scale_bar").selectAll('svg').remove();
            
            if(x_1){// if x_1 is not null make ..
                manhattan_plot(x_1,x_2,y_1,y_2,data_select_from_HDS);  		   		 
                d3.select("#minmap_mp").selectAll('svg').remove();   		
                manhattan_plot_minmap(ix_1,ix_2,iy_1,iy_2,   x_1,  y_2,  x_2-x_1, y_1,data_select_from_HDS)
            } else {     
                manhattan_plot(ix_1,ix_2,iy_1,iy_2,data_select_from_HDS);
            };
   	};
    } else if (plot_chosen==="p_mat") {		
	// Heat map of association matrix
        d3.select("#chart").selectAll('svg').remove();
        d3.select("#minmap_matrixp").selectAll('svg').remove();
        d3.select("#scalecolor_matrix1").selectAll('svg').remove();
        d3.select("#scalecolor_matrix2").selectAll('svg').remove();
        
        if(mx_1){// if x_1 is not null make ..
            matrix_plot(mx_1,mx_2,my_1,my_2);
            matrix_plot_minmap(mix_1, mix_2, miy_1, miy_2, mx_1, my_1, mx_2-mx_1, my_2);
        } else {
            matrix_plot(mix_1,mix_2,miy_1,miy_2);
            //d3.select("#minmap_matrixp").selectAll('svg').remove();
            //matrix_plot_minmap(mix_1,mix_2,miy_1,miy_2, 0,0,0,0)
        };
    } else if(plot_chosen==="p_mat_c") {
        // the number of edges per community
    	d3.select("#chart").selectAll('svg').remove();
        d3.select("#minmap_matrixsc").selectAll('svg').remove();
        d3.select("#scalecolor_matrix1").selectAll('svg').remove();
        d3.select("#scalecolor_matrix2").selectAll('svg').remove();
        
        if(mx_1){// if x_1 is not null make .. 
            matrix_comm_plot(mx_1,mx_2,my_1,my_2);
  	    matrix_comm_plot_minmap(mix_1, mix_2, miy_1, miy_2, mx_1, my_1, mx_2-mx_1, my_2);
        } else {
            matrix_comm_plot(mix_1, mix_2, miy_1, miy_2);
            //d3.select("#minmap_matrixp").selectAll('svg').remove();
            //matrix_plot_minmap(mix_1,mix_2,miy_1,miy_2, 0,0,0,0)
        };
    }  	
});						


/**
 * Do RESET when the button RESET is clicked
 */
d3.select("body").select("#butr").on("click", function change() { 		//button RESET
				
    if (plot_chosen=== "p_cir" ) {		
    	// Circular plot
        reset();
        d3.select("#hds_matrix").selectAll('svg').remove();
        histogram_degree_SNPs(file_json,0);	
    } else if ( plot_chosen==="p_man") {			
        // Manhattan plot
        d3.select("#chart").selectAll('svg').remove();
        d3.select("#minmap_matrixp").selectAll('svg').remove();
        d3.select("#scalecolor_matrix1").selectAll('svg').remove();
        d3.select("#scalecolor_matrix2").selectAll('svg').remove();
        d3.select("#minmap_mp").selectAll('svg').remove();
        d3.select("#scale_bar").selectAll('svg').remove();
        
        x_1=ix_1;
        x_2=ix_2;
        y_1=iy_1;
        y_2=iy_2;
        
        if (data_from_HDS==="no") {
            manhattan_plot(ix_1,ix_2,iy_1,iy_2,data);
            manhattan_plot_minmap(ix_1,ix_2,iy_1,iy_2,  0,0,0,0,data)
        } else {
            manhattan_plot(ix_1,ix_2,iy_1,iy_2,data_select_from_HDS);
            manhattan_plot_minmap(ix_1,ix_2,iy_1,iy_2,  0,0,0,0,data_select_from_HDS)
        };
   } else if (plot_chosen==="p_mat") {
       // Heatmap of association matrix
       d3.select("#chart").selectAll('svg').remove();
       d3.select("#minmap_matrixp").selectAll('svg').remove();
       d3.select("#scalecolor_matrix1").selectAll('svg').remove();
       d3.select("#scalecolor_matrix2").selectAll('svg').remove();
       d3.select("#minmap_mp").selectAll('svg').remove();
       d3.select("#scale_bar").selectAll('svg').remove();
       
       mx_1=mix_1;
       mx_2=mix_2;
       my_1=miy_1;
       my_2=miy_2;
       
       matrix_plot(mx_1,mx_2,my_1,my_2); 
       matrix_plot_minmap(mix_1,mix_2,miy_1,miy_2, 0,0,0,0)		 
   } else if (plot_chosen==="p_mat_c") {
    	// Matrix of communities versus the number of pairs
       d3.select("#chart").selectAll('svg').remove();
       d3.select("#minmap_matrixsc").selectAll('svg').remove();
       d3.select("#minmap_matrixp").selectAll('svg').remove();
       d3.select("#scalecolor_matrix1").selectAll('svg').remove();
       d3.select("#scalecolor_matrix2").selectAll('svg').remove();
       
       mx_1=mix_1;
       mx_2=mix_2;
       my_1=miy_1;
       my_2=miy_2;
       
       matrix_comm_plot_minmap(mix_1, mix_2, miy_1, miy_2, 0,0,0,0)
       matrix_comm_plot(mx_1,mx_2,my_1,my_2);
   };
});		



/**
 * create LABEL when the button LABEL is clicked
 */
d3.select("body").select("#butpl").on("click", function change() {  //button LABEL

    d3.select("#chart").selectAll('svg').remove();
    d3.select("#scale_bar").selectAll('svg').remove();
    d3.select("#minmap_mp").selectAll('svg').remove();  
   
   
   if(data_from_HDS==="no"){
			
        if(x_1){// if x_1 is not null make ..
        manhattan_plot(x_1,x_2,y_1,y_2,data); 
        manhattan_plot_minmap(ix_1,ix_2,iy_1,iy_2,   x_1,  y_2,  x_2-x_1, y_1,data)   		
   	}
   else{
        manhattan_plot(ix_1,ix_2,iy_1,iy_2,data);
        manhattan_plot_minmap(ix_1,ix_2,iy_1,iy_2,   x_1,  y_2,  x_2-x_1, y_1,data)
    }
        
        }else{
        
        
        if(x_1){// if x_1 is not null make ..
        manhattan_plot(x_1,x_2,y_1,y_2,data_select_from_HDS); 
        manhattan_plot_minmap(ix_1,ix_2,iy_1,iy_2,   x_1,  y_2,  x_2-x_1, y_1,data_select_from_HDS)   		
    }
   else{
    manhattan_plot(ix_1,ix_2,iy_1,iy_2,data_select_from_HDS);
    manhattan_plot_minmap(ix_1,ix_2,iy_1,iy_2,   x_1,  y_2,  x_2-x_1, y_1,data_select_from_HDS)
    }
        
        
        }
   
     		
   		
   label_text.transition().style("opacity", 1);
    			
});		



/**
 * REMOVE LABEL when the button "REMOVE LABEL" is clicked
 */				
d3.select("body").select("#butrl").on("click", function change() { 		//button REMOVE LABEL	
				
    d3.select("#chart").selectAll('svg').remove();
    d3.select("#scale_bar").selectAll('svg').remove();
    d3.select("#minmap_mp").selectAll('svg').remove();
    
     if(data_from_HDS==="no"){
			
    if(x_1){// if x_1 is not null make ..
            manhattan_plot(x_1,x_2,y_1,y_2,data);
            manhattan_plot_minmap(ix_1,ix_2,iy_1,iy_2,   x_1,  y_2,  x_2-x_1, y_1,data)
        }
    else{
            manhattan_plot(ix_1,ix_2,iy_1,iy_2,data);
            manhattan_plot_minmap(ix_1,ix_2,iy_1,iy_2,   x_1,  y_2,  x_2-x_1, y_1,data)
        }
            }else{
            
            
    if(x_1){// if x_1 is not null make ..
            manhattan_plot(x_1,x_2,y_1,y_2,data_select_from_HDS);
            manhattan_plot_minmap(ix_1,ix_2,iy_1,iy_2,   x_1,  y_2,  x_2-x_1, y_1,data_select_from_HDS)
        }
    else{
        manhattan_plot(ix_1,ix_2,iy_1,iy_2,data_select_from_HDS);
        manhattan_plot_minmap(ix_1,ix_2,iy_1,iy_2,   x_1,  y_2,  x_2-x_1, y_1,data_select_from_HDS)
        }
        
        }
   
 
    label_text.transition().style("opacity", 0);
   			
});		


//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   BUTTON AND OPERATIONS ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^















