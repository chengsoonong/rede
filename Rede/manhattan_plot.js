/**
 * @fileoverview All functions and variables to create the Manhattan plot
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */


//------------------------------------------   Global variables   ---------------------------------------------- 

/**
 * Global variable only for manhattan_plot.js to create the scale in manhattan plot.
 * @type {number} chrom_lenght
 */
var chrom_lenght = 0;
/**
 * Global variable only for manhattan_plot.js to create the scale in manhattan plot.
 * @type {array} chrom_acum_length
 */
var chrom_acum_length = new Array();
/**
 * Constant only for manhattan_plot.js to create the scale in manhattan plot.
 * @const
 * @type {array} chromLength
 */
var chromLength = new Array(249250621, 243199373, 198022430, 191154276,
    180915260, 171115067, 159138663, 146364022,
    141213431, 135534747, 135006516, 133851895,
    115169878, 107349540, 102531392, 90354753,
    81195210, 78077248, 59128983, 63025520,
    48129895, 51304566, 155270560, 59373566);

//this initializes chrom_lenght and chrom_acum_length to be used in manhattan plot
for (var i = 0; i < chromLength.length; i++) {
    chrom_lenght = chrom_lenght + chromLength[i];
    chrom_acum_length.push(chrom_lenght);
}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Global variables ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 




//---------------------------------------read json file --------------------------------------

/**
 * Read a .json to inicialaze the variables and call the function manhattan_plot() to craete the manhattan plot
 * @param {string} file_name
 */
function read_file_to_manhattan_plot(file_name) {


    data = new Array();
    allNodes = new Array();
    var data_weight_pvalue = new Array();


    d3.json(file_name, function(json) {
        var links = json.links; // var links = json.links;


        json.nodes.forEach(function(d) {
            allNodes.push(d)
        });

        json.links.forEach(

            function(d) { //this will fill with data the array

                data_weight_pvalue.push(d[st_chosen]);


                if (allNodes[d.source].chrom === 1) { //"chr"+d.chrom+':'+d.bp_position

                    data.push([allNodes[d.source].bp_position, d[st_chosen], allNodes[d.source].degree, "chr" + allNodes[d.source].chrom + ':' + allNodes[d.source].bp_position]);

                } else {

                    data.push([allNodes[d.source].bp_position + chrom_acum_length[allNodes[d.source].chrom - 2], d[st_chosen], allNodes[d.source].degree, "chr" + allNodes[d.source].chrom + ':' + allNodes[d.source].bp_position]);
                }

                if (allNodes[d.target].chrom === 1) {

                    data.push([allNodes[d.target].bp_position, d[st_chosen], allNodes[d.target].degree, "chr" + allNodes[d.target].chrom + ':' + allNodes[d.target].bp_position]);

                } else {
                    data.push([allNodes[d.target].bp_position + chrom_acum_length[allNodes[d.target].chrom - 2], d[st_chosen], allNodes[d.target].degree, "chr" + allNodes[d.target].chrom + ':' + allNodes[d.target].bp_position]);
                }

            });

        ix_1 = 0;
        ix_2 = chrom_lenght;
        iy_1 = d3.min(data_weight_pvalue, function(d) {
            return d;
        }) - 1;
        iy_2 = d3.max(data_weight_pvalue, function(d) {
            return d;
        }) + 1;

        data_from_HDS = "no"

        manhattan_plot_minmap(0, chrom_lenght, d3.min(data_weight_pvalue, function(d) {
            return d;
        }) - 1, d3.max(data_weight_pvalue, function(d) {
            return d;
        }) + 1, 0, 0, 0, 0, data);


        manhattan_plot(0, chrom_lenght, d3.min(data_weight_pvalue, function(d) {
            return d;
        }) - 1, d3.max(data_weight_pvalue, function(d) {
            return d;
        }) + 1, data);



    });

}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ read json file ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^




//------------------------------------- create manhattan plot ---------------------------------------

/**
 * creat the manhataan plot from the dots in data and do the zoom from x1, x2, y1, y2 values.
 * @param {number} x1
 * @param {number} x2
 * @param {number} y1
 * @param {number} y2
 * @param {array} data
 */
function manhattan_plot(x1, x2, y1, y2, data) {
    //creat the manhataan plot  			

    //--------------------------- create color scale  --------------------------------------------------
    var margin_s = {
        top: 5,
        right: 30,
        bottom: 35,
        left: 10
    };
    //Then define width and height as the inner dimensions of the chart area.
    var w_scale_bar = 500 - margin_s.left - margin_s.right;
    var h_scale_bar = 65 - margin_s.top - margin_s.bottom;
    var barPadding = 0;

    var dataset = d3.range(d3.min(data, function(d) {
        return d[2];
    }), d3.max(data, function(d) {
        return d[2];
    }) + 1);

    //alert(dataset)


    var colorScale = d3.scale.log()
        .domain([d3.min(data, function(d) {
            return d[2];
        }), d3.max(data, function(d) {
            return d[2];
        })])
        .interpolate(d3.interpolateHsl)
    //.range(["#08F5EC", "#F50808"]);//39b9b8 00b300 00a166
    .range(["#00b300", "#F50808"]);

    //Create SVG element to receive the scale color bar
    var svg3 = d3.select("#scale_bar")
        .append("svg")
    //.attr("width", w_scale_bar)
    //.attr("height", h_scale_bar);

    .attr("width", w_scale_bar + margin_s.left + margin_s.right)
        .attr("height", h_scale_bar + margin_s.top + margin_s.bottom)
        .append("g")
        .attr("transform", "translate(" + margin_s.left + "," + margin_s.top + ")");




    svg3.selectAll("rect") //create color scale bar
    .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return i * (w_scale_bar / dataset.length);
        })
        .attr("y", 0)
        .attr("width", w_scale_bar / dataset.length - barPadding)
        .attr("height", h_scale_bar)
        .attr("fill", function(d, i) {
            return colorScale(d);
        });

    svg3.selectAll(".text_smp")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "text_smp")
        .text(function(d) {
            number_tick = 6;

            if (d % d3.round(d3.max(data, function(d) {
                return d[2];
            }) / number_tick) == 0) {
                return d;
            }

        })
        .attr("x", function(d, i) {
            return (i + 0.5) * (w_scale_bar / dataset.length);
        })
        .attr("y", 40)
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill",

            function(d) {

                return colorScale(d);

            });


    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   create color scale  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^			





    var margin = {
        top: 30,
        right: 50,
        bottom: 20,
        left: 60
    };

    var w = 800 - margin.left - margin.right; //900;
    var h = 600 - margin.top - margin.bottom; //600;
    //var padding = 30;


    //Create scale functions
    /*
			var xScale = d3.scale.linear()
								 .domain([x1,x2])
								 .range([padding, w - padding * 2]);//.range([padding, w - padding * 2]); //old 810

			
								 

			var yScale = d3.scale.linear()
								 .domain([y1,y2])
								 .range([h - padding, padding]);	
				*/

    var xScale = d3.scale.linear()
        .domain([x1, x2])
        .range([0, w]); //.range([padding, w - padding * 2]); //old 810




    var yScale = d3.scale.linear()
        .domain([y1, y2])
        .range([h, 0]);

    var array_test1 = [""];
    //var array_test2=[padding];
    var array_test2 = [0];
    for (var i = 0; i < chrom_acum_length.length; i++) {
        var num = i + 1;


        array_test1.push("chr" + num);
        array_test2.push(xScale(chrom_acum_length[i]));
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
    //.attr("width", w)
    //.attr("height", h)
    .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var line_chrom = svg.selectAll("line")
        .data(chrom_acum_length)
        .enter()
        .append("line")
        .attr("class", "linechrom")
        .attr("x1", function(d) {
            return xScale(d);
        })
    //.attr("y1", 32)
    .attr("y1", 0)
        .attr("x2", function(d) {
            return xScale(d);
        })
    //.attr("y2", h - padding)
    .attr("y2", h)
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", 5)
        .style("stroke", "black") //stroke-dasharray="5"
    .style("opacity", 0.2);


    //Create circles
    var circle = svg.selectAll("circle")
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
    .style("fill", function(d) {
        return colorScale(d[2])
    })
    //.on("mouseover", fade(0))
    ;

    label_text = svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {
            return d[3] + " ; " + d[1] + " ; " + d[2]; //two_dec(d[2]);
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
    .style("fill", function(d) {
        return colorScale(d[2])
    });

    label_text.transition().duration(1000).style("opacity", 0); //it will fade the label in circles
    //label_text.transition().style("opacity", 0); //it will fade the label in circles



    //Create X axis
    svg.append("g")
        .attr("class", "manaxis").attr("font-size", "10px")
        .attr("transform", "translate(0," + (h) + ")")
        .call(xAxis) //;
    .append("text")
        .attr("class", "manlabel")
        .attr("x", w)
        .attr("y", -6)
        .style("text-anchor", "end").attr("font-size", "17px")
        .text("Chromosome Lengths (nº bases)");


    svg.append("g").attr("transform", "translate(0," + 0 + ")")
        .attr("class", "xt axis")
    //.attr("transform", "translate(" + padding + ",0)")
    .call(xAxis_top); //;		

    svg.selectAll(".xt text") // select all the text elements for the xaxis
    .attr("transform", function(d) {
        return "translate(" + this.getBBox().height + "," + this.getBBox().height * -0.5 + ")rotate(-45)";
    })
    //.attr("transform", "rotate(-45)")
    ;


    //Create Y axis
    svg.append("g")
        .attr("class", "manaxis")
    //.attr("transform", "translate(" + padding + ",0)")
    .call(yAxis)
        .append("text")
        .attr("class", "manlabel")
        .attr("transform", "rotate(-90)")
    //.attr("y", h/2)
    //.attr("x", w)
    .attr("x", -10)
        .attr("y", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end").attr("font-size", "17px")
        .text("-log(p-value)");

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
            return e[0][0] <= d[0] && d[0] <= e[1][0] && e[0][1] <= d[1] && d[1] <= e[1][1];
        });


        x_1 = e[0][0];
        x_2 = e[1][0];
        y_1 = e[0][1];
        y_2 = e[1][1];


        //manhattan_plot_minmap(x1,x2,y1,y2,  xScale_top("chr5"),30, 10, 10)


    }

    function brushend() {
        svg.classed("selecting", !d3.event.target.empty());
    }


}







/**
 * creat a mini manhataan plot from the dots in data and do the zoom from x1, x2, y1, y2 values.
 * If rect_x1, rect_y1, rect_x2, rect_y2 are diferent from zero (0) this create a rectangle
 * to help a see the location of the zoom.
 * @param {number} x1
 * @param {number} x2
 * @param {number} y1
 * @param {number} y2
 * @param {number} rect_x1
 * @param {number} rect_x2
 * @param {number} rect_y1
 * @param {number} rect_y2
 * @param {array} data
 */
function manhattan_plot_minmap(x1, x2, y1, y2, rect_x1, rect_y1, rect_x2, rect_y2, data) {
    //creat the manhataan plot

    var margin_s = {
        top: 5,
        right: 30,
        bottom: 35,
        left: 10
    };
    //Then define width and height as the inner dimensions of the chart area.

    var w_scale_bar = 500 - margin_s.left - margin_s.right;
    var h_scale_bar = 65 - margin_s.top - margin_s.bottom;
    var barPadding = 0;

    //--------------------------- create color scale  --------------------------------------------------

    var dataset = d3.range(d3.min(data, function(d) {
        return d[2];
    }), d3.max(data, function(d) {
        return d[2];
    }) + 1);

    //alert(dataset)


    var colorScale = d3.scale.log()
        .domain([d3.min(data, function(d) {
            return d[2];
        }), d3.max(data, function(d) {
            return d[2];
        })])
        .interpolate(d3.interpolateHsl)
    //.range(["#08F5EC", "#F50808"]);//39b9b8 00b300 00a166
    .range(["#00b300", "#F50808"]);



    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   create color scale  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^			

    var margin = {
        top: 30,
        right: 50,
        bottom: 40,
        left: 60
    };

    var w = 400 - margin.left - margin.right; //900;
    var h = 300 - margin.top - margin.bottom; //600;
    //var padding = 30;

    var xScale = d3.scale.linear()
        .domain([x1, x2])
        .range([0, w]); //.range([padding, w - padding * 2]); //old 810




    var yScale = d3.scale.linear()
        .domain([y1, y2])
        .range([h, 0]);

    var array_test1 = [""];
    //var array_test2=[padding];
    var array_test2 = [0];
    for (var i = 0; i < chrom_acum_length.length; i++) {
        var num = i + 1;

        //array_test1.push( "chr "+num );
        array_test1.push(num);
        array_test2.push(xScale(chrom_acum_length[i]));
    }


    //Create scale top			 
    var xScale_top = d3.scale.ordinal()
        .domain(array_test1)
        .range(array_test2);

    //Define X axis top
    var xAxis_top = d3.svg.axis()
        .scale(xScale_top)
    //.orient("top")
    .orient("bottom")
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
    var svg = d3.select("#minmap_mp")
    // svg = d3.select("#chart")
    .append("svg")
    //.attr("width", w)
    //.attr("height", h)
    .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var line_chrom = svg.selectAll("line")
        .data(chrom_acum_length)
        .enter()
        .append("line")
        .attr("class", "linechrom")
        .attr("x1", function(d) {
            return xScale(d);
        })
    //.attr("y1", 32)
    .attr("y1", 0)
        .attr("x2", function(d) {
            return xScale(d);
        })
    //.attr("y2", h - padding)
    .attr("y2", h)
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", 5)
        .style("stroke", "black") //stroke-dasharray="5"
    .style("opacity", 0.2);





    //Create circles
    var circle = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return xScale(d[0]);
        })
        .attr("cy", function(d) {
            return yScale(d[1]);
        })
        .attr("r", 1.5)
    //.style("fill", function(d) { return graphColor(d[2]) })
    .style("fill", function(d) {
        return colorScale(d[2])
    })
    //.on("mouseover", fade(0))
    ;




    if (rect_x1 != 0 && rect_y1 != 0 && rect_x2 != 0 && rect_y2 != 0) {

        svg.selectAll("rect") //create color scale bar
        .data([0])
            .enter()
            .append("rect")
            .attr("x", xScale(rect_x1))
            .attr("y", yScale(rect_y1))
            .attr("width", xScale(rect_x2))
            .attr("height", yScale(rect_y2) - yScale(rect_y1)) //rgb(0,0,255) "rgba(255, 255, 0, 0.1)"
        .attr("fill", "rgba(0, 0, 255, 0.1)")
            .attr("stroke", "rgba(0, 0, 255, 1)")
            .attr("stroke-width", "5");

    }



    svg.append("g").attr("transform", "translate(0," + h + ")")
        .attr("class", "xt_min axis")
    //.attr("transform", "translate(" + padding + ",0)")
    .call(xAxis_top); //;		

    svg.selectAll(".xt_min text") // select all the text elements for the xaxis
    .attr("transform", function(d) {
        return "translate(" + this.getBBox().height * 1.4 + "," + this.getBBox().height * 1.7 + ")rotate(90)";
    })
    //.attr("transform", "rotate(-45)")
    ;


    //Create Y axis
    svg.append("g")
        .attr("class", "axis")
    //.attr("transform", "translate(" + padding + ",0)")
    .call(yAxis)

    ;


}




//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ create manhattan plot ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^