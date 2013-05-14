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

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ load - first vizualization ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 




//------------------------------------------  chose the plot  - drop box ---------------------------------------------- 
 
 /**
 * Allows us choose one plot to vizualization
 */
d3.select("#Plot_select").on("change", function change() {
 	
   plot_chosen=this.value; 	
   
   d3.select("#chart").selectAll('svg').remove();  				//remove old selection
   d3.select("#scale_bar").selectAll('svg').remove();			//remove old selection
   
   d3.select("#pairs").selectAll("p").remove();    				//remove old selection
   d3.select("body").selectAll('svg').remove(); 				//remove old selection
   d3.select("#two_weight_value").selectAll("h").remove(); 		//remove old selection 
   d3.select("#hesid").selectAll('svg').remove();				//remove old selection
   d3.select("#table_snps").selectAll('table').remove();
   
  
   hide_selection();
   show_selection();		//hds_matrix

   if(this.value==="p_cir"){
				
                d3.select("body").select("#two_weight_value").transition().style("opacity", 1);
                d3.select("body").select("#cb").transition().style("opacity", 1);
                d3.select("body").select("#hc").transition().style("opacity", 1);
                d3.select("body").select("#snps_text").transition().style("opacity", 1);
                d3.select("body").select("#footer").transition().style("opacity", 1);
                d3.select("#hds_matrix").selectAll('svg').remove();
                
       Create_chr_circle(0,0,0);							//create new again
                Create_SNP_association(file_json);  			//create new again
                brush_weight(file_json);						//create new again
                histogram_edges_subgraphId(file_json);
                histogram_degree_SNPs(file_json,0);	
    
                
    }else if( this.value==="p_man"){
				//show_selection();
				d3.select("#hds_matrix").selectAll('svg').remove();				
                d3.select("body").select("#two_weight_value").transition().style("opacity", 0);
                d3.select("body").select("#cb").transition().style("opacity", 0);
                d3.select("body").select("#hc").transition().style("opacity", 0);
                d3.select("body").select("#snps_text").transition().style("opacity", 0);
                d3.select("body").select("#footer").transition().style("opacity", 0);
                d3.select("#table_snps").selectAll('table').remove();	
                read_file_to_manhattan_plot(file_json);
               histogram_degree_SNPs(file_json,0);	
   				 
              
				
	}else if (this.value==="p_mat"){
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
   
     }else{
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
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ chose the plot - drop box ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 




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
function selected_json(){
               	
        //myWindow=window.open('','','width=200,height=100')	
        myWindow=window.open('','json file');
        //myWindow.document.write("\"string_html\"");
        myWindow.document.write(string_html);
        myWindow.focus();
        
        string_html="";
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
    
    
    
     }else{
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
        d3.select("#st_select2").transition().style("opacity", 0);
        	
        d3.select("#load_data").remove();
        
        }
}

/**
 * show buttons, scale and another things when a new plot is selected
 */
function show_selection(){ 
	
    if(plot_chosen==="p_cir"){

        d3.select("body").select("#butz").transition().style("opacity", 1);
        d3.select("#ec_scale_bar_c").transition().style("opacity", 1);  // title of  color scale bar
        d3.select("#scale_bar_c").transition().style("opacity", 1);
        d3.select("body").select("#butr").transition().style("opacity", 1);
        d3.select("#st_select2").transition().style("opacity", 1);
  	 	 		
    }else if( plot_chosen==="p_man"){			
	
        d3.select("body").select("#butz").transition().style("opacity", 1);
        d3.select("body").select("#butr").transition().style("opacity", 1);
        d3.select("body").select("#butpl").transition().style("opacity", 1);
        d3.select("body").select("#butrl").transition().style("opacity", 1);
        d3.select("#degree_scale_bar").transition().style("opacity", 1);    // title of  color scale bar  
        d3.select("#st_select2").transition().style("opacity", 1);
        		
     } else if( plot_chosen==="p_mat_c"){ 
    	
   		d3.select("body").select("#butz").transition().style("opacity", 1);
        d3.select("body").select("#butr").transition().style("opacity", 1);
        
        
    
    
     }else{
				
        d3.select("body").select("#butz").transition().style("opacity", 1);
        d3.select("body").select("#butr").transition().style("opacity", 1);
        d3.select("#up").transition().style("opacity", 1);
        d3.select("#ll").transition().style("opacity", 1);
        d3.select("#scalecolor1_dropbox").transition().style("opacity", 1);
        d3.select("#scalecolor2_dropbox").transition().style("opacity", 1);
        
        d3.select("#scalecolor_matrix1").transition().style("opacity", 1); 
        d3.select("#scalecolor_matrix2").transition().style("opacity", 1); 				
        
        }  	   
}

/**
 * Do zoom when the button ZOOM is clicked
 */
d3.select("body").select("#butz").on("click", function change() {      //button ZOOM

    if( plot_chosen==="p_man"){		
		
        if(data_from_HDS==="no"){
            
            d3.select("#chart").selectAll('svg').remove();
            d3.select("#scale_bar").selectAll('svg').remove();
            
            if(x_1){// if x_1 is not null make ..
                 manhattan_plot(x_1,x_2,y_1,y_2,data);  		   		 
                d3.select("#minmap_mp").selectAll('svg').remove();   		
                manhattan_plot_minmap(ix_1,ix_2,iy_1,iy_2,   x_1,  y_2,  x_2-x_1, y_1,data)
            }else      
                manhattan_plot(ix_1,ix_2,iy_1,iy_2,data);
                
        }else{
            
            d3.select("#chart").selectAll('svg').remove();
            d3.select("#scale_bar").selectAll('svg').remove();
            
            if(x_1){// if x_1 is not null make ..
                 manhattan_plot(x_1,x_2,y_1,y_2,data_select_from_HDS);  		   		 
                d3.select("#minmap_mp").selectAll('svg').remove();   		
                manhattan_plot_minmap(ix_1,ix_2,iy_1,iy_2,   x_1,  y_2,  x_2-x_1, y_1,data_select_from_HDS)
            }else      
                manhattan_plot(ix_1,ix_2,iy_1,iy_2,data_select_from_HDS);
   		 }
    		
    }else if(plot_chosen==="p_mat_c"){
    	
    
    	d3.select("#chart").selectAll('svg').remove();
        d3.select("#minmap_matrixsc").selectAll('svg').remove();
        d3.select("#scalecolor_matrix1").selectAll('svg').remove();
        d3.select("#scalecolor_matrix2").selectAll('svg').remove();
        
        if(mx_1){// if x_1 is not null make .. 
	   	
	   
            
            matrix_comm_plot(mx_1,mx_2,my_1,my_2);
  			matrix_comm_plot_minmap(mix_1, mix_2, miy_1, miy_2, mx_1, my_1, mx_2-mx_1, my_2)
  			
        } else
            matrix_comm_plot(mix_1, mix_2, miy_1, miy_2)
            //d3.select("#minmap_matrixp").selectAll('svg').remove();
            //matrix_plot_minmap(mix_1,mix_2,miy_1,miy_2, 0,0,0,0)
    
    } else if (plot_chosen = "p_cir") {

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

        // draw zoomed circle
        Create_chr_circle(view_chr, view_start, view_end);
        Create_SNP_association(file_json);
        brush_weight(file_json);
        histogram_edges_subgraphId(file_json);
        histogram_degree_SNPs(file_json,0);	
    	
    } else {		
			
        d3.select("#chart").selectAll('svg').remove();
        d3.select("#minmap_matrixp").selectAll('svg').remove();
        d3.select("#scalecolor_matrix1").selectAll('svg').remove();
        d3.select("#scalecolor_matrix2").selectAll('svg').remove();
        
        if(mx_1){// if x_1 is not null make ..
	   	
            matrix_plot(mx_1,mx_2,my_1,my_2);
            matrix_plot_minmap(mix_1, mix_2, miy_1, miy_2, mx_1, my_1, mx_2-mx_1, my_2);
  		
        } else
            matrix_plot(mix_1,mix_2,miy_1,miy_2);
            //d3.select("#minmap_matrixp").selectAll('svg').remove();
            //matrix_plot_minmap(mix_1,mix_2,miy_1,miy_2, 0,0,0,0)
    }  	
});						


/**
 * Do RESET when the button RESET is clicked
 */
d3.select("body").select("#butr").on("click", function change() { 		//button RESET
				
    if( plot_chosen=== "p_cir" ){		
    			
        reset();
        d3.select("#hds_matrix").selectAll('svg').remove();
        histogram_degree_SNPs(file_json,0);	
    
    	
    }else  if( plot_chosen==="p_man"){			
        		
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
        	
        
        if(data_from_HDS==="no"){
        	
        manhattan_plot(ix_1,ix_2,iy_1,iy_2,data);
        manhattan_plot_minmap(ix_1,ix_2,iy_1,iy_2,  0,0,0,0,data)
        
        }else{
        
        manhattan_plot(ix_1,ix_2,iy_1,iy_2,data_select_from_HDS);
        manhattan_plot_minmap(ix_1,ix_2,iy_1,iy_2,  0,0,0,0,data_select_from_HDS)
        	
        
        }
      

   } else   if(plot_chosen==="p_mat_c"){
    	
    
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
        
        
    	
    } else{
   	
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
  	
   }
   	
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















