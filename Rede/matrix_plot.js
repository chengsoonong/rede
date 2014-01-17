/**
 * @fileoverview All functions and variables to create the Matrix plot
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */




/**
 * Global variable only for matrix_plot.js.
 * @type {array} data_obj_m
 */
var data_obj_m = [];
/**
 * Global variable only for matrix_plot.js.
 * @type {array} array_SNPs
 */
var array_SNPs = [];



/**
 * Read a .json to inicialaze the variables and call the function matrix_plot() to craete the matrix plot
 * @param {string} file_name
 */
function read_file_to_matrix_plot(file_name) {
    //this function read a .json to inicialaze the variables and call the function matrix_plot() to craete the matrix plot

    var allNodes = new Array();

    var dic_chr = {};

    var n_idx = 0;
    data_obj_m = [];
    array_SNPs = [];

    d3.json(file_name, function(json) {

        var links = json.links;

        json.nodes.forEach(
            function(d) {
                allNodes.push(d)
                array_SNPs.push("chr" + d.chrom + ':' + d.bp_position)
                dic_chr["chr" + d.chrom + ':' + d.bp_position] = n_idx
                n_idx++
            });

        json.links.forEach(
            function(d) {

                var obj = {};
                // temporary variable
                var temp;

                // check to place the points on the correct side of the diagonal  
                if(d.source > d.target) {
                    temp = d.target;
                    d.target = d.source;
                    d.source = temp;
                }

                obj["label_x"] = dic_chr["chr" + allNodes[d.source].chrom + ':' + allNodes[d.source].bp_position];
                obj["label_y"] = dic_chr["chr" + allNodes[d.target].chrom + ':' + allNodes[d.target].bp_position];

                for (var i in d) {
                    if (i != "assoc_group" && i != "ct_id" && i != "source" && i != "target" && i != "probe_group") {
                        //statOptions[i]=i
                        //st_1.push(i) //get the first element to be visualited
                        obj[i] = d[i]
                    }
                }

                data_obj_m.push(obj);

                //create an array with objects representing the SNP associations		
                //data_obj_m.push(creat_obj(dic_chr["chr"+allNodes[d.source].chrom+':'+allNodes[d.source].bp_position], 
                //dic_chr["chr"+allNodes[d.target].chrom+':'+allNodes[d.target].bp_position]));

            });


        function creat_obj(labelx, labely) { //não preciso mais disso
            var obj = {};
            obj.label_x = labelx;
            obj.label_y = labely;
            return obj;
        }

        mix_1 = 0;
        mix_2 = array_SNPs.length - 1;
        miy_1 = 0;
        miy_2 = array_SNPs.length - 1;

        matrix_plot_minmap(mix_1, mix_2, miy_1, miy_2, 0, 0, 0, 0)
        matrix_plot(mix_1, mix_2, miy_1, miy_2)

    });

}




/**
 * creat the matrix plot and do the zoom from x1, x2, y1, y2 values.
 * @param {number} x1
 * @param {number} x2
 * @param {number} y1
 * @param {number} y2
 */
function matrix_plot(x1, x2, y1, y2) {
    // this function create the matrix show each SNPs association



    //--------------------------- create color scale  --------------------------------------------------
    var margin_s = {
        top: 5,
        right: 40,
        bottom: 35,
        left: 10
    };
    //Then define width and height as the inner dimensions of the chart area.
    var w_scale_bar = 500 - margin_s.left - margin_s.right;
    var h_scale_bar = 65 - margin_s.top - margin_s.bottom;
    var barPadding = 0;


    function range_to_bar_min2max(min, max) {
        var array = [];
        for (var i = min; i <= max; i = i + (max / (max * 100))) {
            array.push(i);
            //document.write(i+"<br>");		
        }
        return array;
    }


    function range_to_bar(st) {
        var array = [];
        for (i in data_obj_m) {
            array.push(data_obj_m[i][st]);
        }
        return array;
    }

    //st_1

    function minmaxst(st) {
        //get the min and max p-value between all statistical test
        var array = [];
        var array_ret = [];

        for (i in st) {
            array.push(d3.min(data_obj_m, function(d) {
                return d[st[i]];
            }));
        }
        array_ret.push(d3.min(array))
        array = [];
        for (i in st) {
            array.push(d3.max(data_obj_m, function(d) {
                return d[st[i]];
            }));
        }
        array_ret.push(d3.max(array))
        array = [];

        return array_ret;
    }

    /*
			minmaxstatisctestpv=minmaxst(st_1)
			var dataset_mat1 = range_to_bar_min2max(d3.round(minmaxstatisctestpv[0]), 
													d3.round(minmaxstatisctestpv[1]));			
			var dataset_mat2 = range_to_bar_min2max(d3.round(minmaxstatisctestpv[0]), 
													d3.round(minmaxstatisctestpv[1]));
			*/

    var dataset_mat1 = range_to_bar_min2max(d3.round(d3.min(data_obj_m, function(d) {
            return d[st_chosen1];
        })),
        d3.round(d3.max(data_obj_m, function(d) {
            return d[st_chosen1];
        })));
    var dataset_mat2 = range_to_bar_min2max(d3.round(d3.min(data_obj_m, function(d) {
            return d[st_chosen2];
        })),
        d3.round(d3.max(data_obj_m, function(d) {
            return d[st_chosen2];
        })));


    //var dataset_mat1 = range_to_bar(st_chosen1);
    //dataset_mat1.sort(function(a,b){return a-b});
    //var dataset_mat2 = range_to_bar(st_chosen2);
    //dataset_mat2.sort(function(a,b){return a-b});


    //var dataset_mat1 = range_to_bar(d3.min(data_obj_m,function(d) {return d[st_chosen1]; }), d3.max(data_obj_m,function(d) {return d[st_chosen1];}));
    //var dataset_mat2 = range_to_bar(d3.min(data_obj_m,function(d) {return d[st_chosen2]; }), d3.max(data_obj_m,function(d) {return d[st_chosen2];}));

    //var dataset_mat1 = d3.range(d3.min(data_obj_m,function(d) {return d[st_chosen1]; }), d3.max(data_obj_m,function(d) {return d[st_chosen1];}));
    //var dataset_mat2 = d3.range(d3.min(data_obj_m,function(d) {return d[st_chosen2]; }), d3.max(data_obj_m,function(d) {return d[st_chosen2];}));
    //alert([d3.min(data_obj_m,function(d) {return d[st_chosen]; }), d3.max(data_obj_m,function(d) {return d[st_chosen]; })])

    //document.write(dataset_mat1+"<br>"+d3.min(data_obj_m,function(d) {return d[st_chosen1]; }), d3.max(data_obj_m,function(d) {return d[st_chosen1];}))

    var colorScale1 = d3.scale.linear() //yellow - red
    .domain([d3.min(data_obj_m, function(d) {
        return d[st_chosen1];
    }), d3.max(data_obj_m, function(d) {
        return d[st_chosen1];
    })])
        .interpolate(d3.interpolateHsl)
        .range(["#E4DB00", "#F31300"]); //http://tributary.io/tributary/3650755/

    var colorScale2 = d3.scale.linear() //lightblue - blue
    .domain([d3.min(data_obj_m, function(d) {
        return d[st_chosen2];
    }), d3.max(data_obj_m, function(d) {
        return d[st_chosen2];
    })])
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




    svg_scb1.selectAll("rect") //create color scale bar
    .data(dataset_mat1)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return i * (w_scale_bar / dataset_mat1.length);
        })
        .attr("y", 0)
        .attr("width", w_scale_bar / dataset_mat1.length - barPadding)
        .attr("height", h_scale_bar)
        .attr("fill", function(d, i) {
            return colorScale1(d);
        });



    svg_scb1.selectAll(".text_smp")
        .data(dataset_mat1)
        .enter()
        .append("text")
        .attr("class", "text_smp")
        .text(function(d, i) {
            number_tick = 6;
            ld = dataset_mat1.length
            //if(i%   d3.round(dataset_mat1.length /number_tick) ==0 ){return parseInt(d);}
            //if(i%   d3.round(dataset_mat1.length /number_tick) ==0 ){return two_dec(d);}
            ad = [0, ld / 4, ld / 2, ld / 2 + ld / 4, ld - 1]

            for (v in ad) {
                if (i == d3.round(ad[v])) {
                    return two_dec(d);
                }
            }

        })
        .attr("x", function(d, i) {
            return (i + 0) * (w_scale_bar / dataset_mat1.length);
        })
        .attr("y", 40)
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("fill", function(d) {
            return colorScale1(d);
        });

    var svg_scb2 = d3.select("#scalecolor_matrix2")
        .append("svg")
        .attr("width", w_scale_bar + margin_s.left + margin_s.right)
        .attr("height", h_scale_bar + margin_s.top + margin_s.bottom)
        .append("g")
        .attr("transform", "translate(" + margin_s.left + "," + margin_s.top + ")");

    svg_scb2.selectAll("rect") //create color scale bar
    .data(dataset_mat2)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return i * (w_scale_bar / dataset_mat2.length);
        })
        .attr("y", 0)
        .attr("width", w_scale_bar / dataset_mat2.length - barPadding)
        .attr("height", h_scale_bar)
        .attr("fill", function(d, i) {
            return colorScale2(d);
        });



    svg_scb2.selectAll(".text_smp")
        .data(dataset_mat2)
        .enter()
        .append("text")
        .attr("class", "text_smp")
        .text(function(d, i) {
            number_tick = 6;
            ld = dataset_mat2.length
            //if(i%   d3.round(dataset_mat2.length /number_tick) ==0 ){return parseInt(d);}
            //if(i%   d3.round(dataset_mat1.length /number_tick) ==0 ){return two_dec(d);}
            ad = [0, ld / 4, ld / 2, ld / 2 + ld / 4, ld - 1]

            for (v in ad) {
                if (i == d3.round(ad[v])) {
                    return two_dec(d);
                }
            }

        })
        .attr("x", function(d, i) {
            return (i + 0) * (w_scale_bar / dataset_mat2.length);
        })
        .attr("y", 40)
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("fill", function(d) {
            return colorScale2(d);
        });




    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   create color scale  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^			







    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    },
        width = 700 - margin.left - margin.right, //900
        height = 700 - margin.top - margin.bottom; //900


    var x = d3.scale.linear().domain([x1, x2]) //[0,array_SNPs.length])
    .range([0, width]);

    var y = d3.scale.linear().domain([y1, y2]) //[0,array_SNPs.length])	
    .range([0, width]);


    var x_inv = d3.scale.ordinal().domain([0, width])
        .range(array_SNPs);

    var y_inv = d3.scale.ordinal().domain([0, width])
        .range(array_SNPs);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var xAxis2 = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis2 = d3.svg.axis()
        .scale(y)
        .orient("right");





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

    .style("fill", function(d) {
        return colorScale2(d[st_chosen2]);
    })
        .attr("transform", function(d) {
            return "translate(" + x(d.label_x) + "," + y(d.label_y) + ")";
        })
        .attr("d", d3.svg.symbol().type("square").size("30"));


    svg.selectAll("path2")
        .data(data_obj_m)
        .enter().append("svg:path")
    /* .filter(function(d) {
  	
		return d;// (x1<= x(d.label_x) && x(d.label_x)<=x2) ;//&&  (y1<=y(d.label_y) && y(d.label_y)<=y2);// x(d.label_x) > 100; 
		
            })
            */

    .style("fill", function(d) {
        return colorScale1(d[st_chosen1]);
    })
        .attr("transform", function(d) {
            return "translate(" + x(d.label_y) + "," + y(d.label_x) + ")";
        })
        .attr("d", d3.svg.symbol().type("square").size("30"));




    svg.append("g")
        .attr("class", "xmataxis")
    //.attr("transform", "translate(0," + 0 + ")")0,(height)
    //.attr("transform", "translate(" + height+",0)")
    .call(xAxis)
        .append("text")
        .attr("class", "label")
    //.attr("y", h/2)
    //.attr("x", w)
    .attr("x", 500)
        .attr("y", -30)
    //.attr("dy", ".71em")
    .attr("font-size", "17px")
        .style("text-anchor", "end")
        .text("SNP id");
    /*    
svg.selectAll(".xmataxis text")  // select all the text elements for the xaxis
          .attr("transform", function(d) {
             return "translate(" + this.getBBox().height*0.75 + "," + this.getBBox().height*-0.9 + ")rotate(-90)";
         });     
 */

    svg.append("g")
        .attr("class", "ymataxis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
    //.attr("y", h/2)
    //.attr("x", w)
    .attr("x", -400)
        .attr("y", -45)
        .attr("dy", ".71em")
        .attr("font-size", "17px")
        .style("text-anchor", "end")
        .text("SNP id");



    svg.append("g")
        .attr("class", "xmataxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis2)


    svg.append("g")
        .attr("class", "ymataxis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxis2)








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

        mx_1 = e[0][0];
        mx_2 = e[1][0];
        my_1 = e[0][1];
        my_2 = e[1][1];


        d3.select("#two_weight_value_test").selectAll("h").remove(); //remove the old text
        d3.select("#two_weight_value_test").selectAll("h") //create the new text
        .data([1])
            .enter().append("h")
        //.text(x_inv(mx_1)+" - "+x_inv(mx_2)+" - "+y_inv(my_1)+" - "+y_inv(my_2));
        .text((mx_1) + " - " + (mx_2) + " - " + (my_1) + " - " + (my_2));

    }

    function brushend() {
        svg.classed("selecting", !d3.event.target.empty());
    }



    //});
}





/**
 * this function create the minimap from matrix that show all SNPs association and do the zoom from x1, x2, y1, y2 values.
 * If mrect_x1, mrect_y1, mrect_x2, mrect_y2 are diferent from zero (0) this create a rectangle
 * to help a see the location of the zoom.
 * @param {number} x1
 * @param {number} x2
 * @param {number} y1
 * @param {number} y2
 * @param {number} mrect_x1
 * @param {number} mrect_x2
 * @param {number} mrect_y1
 * @param {number} mrect_y2
 * @param {array} data
 */
function matrix_plot_minmap(x1, x2, y1, y2, mrect_x1, mrect_y1, mrect_x2, mrect_y2) {
    // this function create the minimap from matrix that show all SNPs association


    var margin = {
        top: 100,
        right: 100,
        bottom: 100,
        left: 100
    },
        width = 450 - margin.left - margin.right, //500
        height = 450 - margin.top - margin.bottom; //200


    var x = d3.scale.linear().domain([x1, x2]) //[0,array_SNPs.length])
    .range([0, width]);

    var y = d3.scale.linear().domain([y1, y2]) //[0,array_SNPs.length])	
    .range([0, width]);


    var x_inv = d3.scale.ordinal().domain([0, width])
        .range(array_SNPs);

    var y_inv = d3.scale.ordinal().domain([0, width])
        .range(array_SNPs);



    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top");


    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");


    var xAxis2 = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis2 = d3.svg.axis()
        .scale(y)
        .orient("right");


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

    var colorScale1 = d3.scale.linear() //yellow - red
    .domain([d3.min(data_obj_m, function(d) {
        return d[st_chosen1];
    }), d3.max(data_obj_m, function(d) {
        return d[st_chosen1];
    })])
        .interpolate(d3.interpolateHsl)
        .range(["#E4DB00", "#F31300"]); //http://tributary.io/tributary/3650755/

    var colorScale2 = d3.scale.linear() //lightblue - blue
    .domain([d3.min(data_obj_m, function(d) {
        return d[st_chosen2];
    }), d3.max(data_obj_m, function(d) {
        return d[st_chosen2];
    })])
        .interpolate(d3.interpolateHsl)
    //.range(["#00E4DB", "#6717F5"]); //http://tributary.io/tributary/3650755/
    .range(["#00E4DB", "#2E00E7"]);



    svg.selectAll("path1")
        .data(data_obj_m)
        .enter().append("svg:path")
    /* .filter(function(d) {
  	
		return d;// (x1<= x(d.label_x) && x(d.label_x)<=x2) ;//&&  (y1<=y(d.label_y) && y(d.label_y)<=y2);// x(d.label_x) > 100; 
		
            })
            */
    .style("fill", function(d) {
        return colorScale2(d[st_chosen2]);
    })
    //.style("fill", '#2E00E7') //blue E4DB00 00E4DB     F31300 2E00E7
    .attr("transform", function(d) {
        return "translate(" + x(d.label_x) + "," + y(d.label_y) + ")";
    })
        .attr("d", d3.svg.symbol().type("square").size("5"));


    svg.selectAll("path2")
        .data(data_obj_m)
        .enter().append("svg:path")
    /* .filter(function(d) {
  	
		return d;// (x1<= x(d.label_x) && x(d.label_x)<=x2) ;//&&  (y1<=y(d.label_y) && y(d.label_y)<=y2);// x(d.label_x) > 100; 
		
            })
            */
    .style("fill", function(d) {
        return colorScale1(d[st_chosen1]);
    })
    //.style("fill", '#F31300') //blue
    .attr("transform", function(d) {
        return "translate(" + x(d.label_y) + "," + y(d.label_x) + ")";
    })
        .attr("d", d3.svg.symbol().type("square").size("5"));





    if (mrect_x1 != 0 && mrect_y1 != 0 && mrect_x2 != 0 && mrect_y2 != 0) {

        svg.selectAll("rect") //create color scale bar
        .data([0])
            .enter()
            .append("rect")
            .attr("x", x(mrect_x1))
            .attr("y", y(mrect_y1))
            .attr("width", x(mrect_x2))
            .attr("height", y(mrect_y2) - y(mrect_y1)) //  yScale(rect_y2)-yScale(rect_y1) rgb(0,0,255) "rgba(255, 255, 0, 0.1)"
        .attr("fill", "rgba(255, 0, 0, 0.1)")
            .attr("stroke", "rgba(255, 0, 0, 1)")
            .attr("stroke-width", "5");

    }


    svg.append("g")
        .attr("class", "xmataxis")
        .attr("transform", "translate(0," + 0 + ")")
        .call(xAxis);

    svg.selectAll(".xmataxis text") // select all the text elements for the xaxis
    .attr("transform", function(d) {
        return "translate(" + this.getBBox().height * 1 + "," + this.getBBox().height * -1.5 + ")rotate(-90)";
    });


    svg.append("g")
        .attr("class", "ymataxis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
    //.attr("y", h/2)
    //.attr("x", w)
    .attr("x", -75)
        .attr("y", -55)
        .attr("dy", ".71em")
        .attr("font-size", "17px")
        .style("text-anchor", "end")
        .text("SNP id");



    svg.append("g")
        .attr("class", "xmataxis2")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis2);


    svg.selectAll(".xmataxis2 text") // select all the text elements for the xaxis
    .attr("transform", function(d) {
        return "translate(" + this.getBBox().height * 1 + "," + this.getBBox().height * 1.5 + ")rotate(90)";
    });

    /*
				      .append("text")
      			.attr("class", "label")      			
      			//.attr("y", h/2)
      			//.attr("x", w)
      			.attr("x", 155)
      			.attr("y", 45)
      			//.attr("dy", ".71em")
      			.attr("font-size", "17px")
      			.style("text-anchor", "end")
      			.text("SNP id");
      		*/

    svg.append("g")
        .attr("class", "ymataxis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxis2)



    //});
}