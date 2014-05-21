/**
 * @fileoverview file to load the json data and store it in global variables
 * @author stefan.sevelda@hotmail.com (Stefan Sevelda)
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 *
 */

var ldvar = [];

// function to load the data
function load_data_json (file_name) {
    // load data from json file
    file_json = file_name;

    // empty the arrays of the json files
    allNodes = [];
    links = [];
    subgraphs = [];
    comunities = [];
    cont_table = [];
    
    // empty array of optional statixtical tests
    st_1 = [];
    statOptions = {};

    d3.json(file_name, function(json) {
        //function to load the the links
        json.ld.forEach(function(d) {
            ldvar.push(d);
        });
//        json.links.forEach(function(d) {
//            links.push(d);
//        });
//
//        //for loop to get all available statistical test of the dataset
//        for (var i in json.links[0]) {
//            if (i != "assoc_group" && i != "source" && i != "target" && i !=
//                "probe_group" && i != "ct_id") {
//                    statOptions[i] = i;
//                    st_1.push(i);  
//                }
//        }
//
//        // function to fill the information of the nodes in allNodes
//        json.nodes.forEach(function(d) {
//            allNodes.push(d);
//        });
//        // load the subgraphs of the json file 
//        subgraphs = json.subgraphs;
//        // load the comunities of the json file
//        communities = json.communities;
//        // load the information about the contingency table 
//        cont_table = json.cont_table;
//        
        // start the plots
        //upload_json()           
    });
};


