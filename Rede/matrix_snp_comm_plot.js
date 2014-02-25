/**
 * @fileoverview All functions and variables to create the communitties plot
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */


/**
 * Global variable only for matrix_snp_coomm_plot.js.
 * @type {array} data_obj_mc
 */
var data_obj_mc = [];
/**
 * Global variable only for matrix_snp_coomm_plot.js.
 * @type {array} data_obj_mc2
 */
var data_obj_mc2 = [];
/**
 * Global variable only for matrix_snp_coomm_plot.js.
 * @type {array} array_SNPs_mc
 */
var array_SNPs_mc = [];

/**
 * Read a .json to inicialaze the variables and call the function matrix_comm_plot() to craete the communitties plot
 * @param {string} file_name
 */
function read_file_to_matrix_comm_plot(file_name) {
    data_obj_mc2 = [];
    data_obj_mc = [];
    array_SNPs_mc = [];

    d3.json(file_name, function(json) {
        var links = json.links;
        json.links.forEach(
            function(d) {
                var obj = {}
                obj["label_x"] = parseInt(d.assoc_group.toString().split(".")[1])
                obj["label_y"] = d.source
                obj["probe_group"] = d.probe_group
                data_obj_mc.push(obj);
                data_obj_mc2.push(obj);

                var obj = {}
                obj["label_x"] = parseInt(d.assoc_group.toString().split(".")[1])
                obj["label_y"] = d.target
                obj["probe_group"] = d.probe_group

                data_obj_mc.push(obj);
                data_obj_mc2.push(obj);
            });

        data_obj_mc = []
        d3.select("#minmap_matrixsc").selectAll('svg').remove();
        d3.select("#chart").selectAll('svg').remove(); //remove old selection
        
        for (var e in data_obj_mc2) {
            if (data_obj_mc2[e].probe_group === 1) {
                data_obj_mc.push(data_obj_mc2[e])
            }
        }

        mix_1 = 0;
        mix_2 = d3.max(data_obj_mc, function(d) {
            return d.label_x;
        }) + 1;
        miy_1 = d3.min(data_obj_mc, function(d) {
            return d.label_y;
        }) - 1;
        miy_2 = d3.max(data_obj_mc, function(d) {
            return d.label_y;
        }) + 1;

        matrix_comm_plot_minmap(mix_1, mix_2, miy_1, miy_2, 0, 0, 0, 0)
        matrix_comm_plot(mix_1, mix_2, miy_1, miy_2)
    });
}

/**
 * creat the communitties plot and do the zoom from x1, x2, y1, y2 values.
 * @param {number} x1
 * @param {number} x2
 * @param {number} y1
 * @param {number} y2
 */
function matrix_comm_plot(x1, x2, y1, y2) {

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    },

    width = 800 - margin.left - margin.right, //500
    height = 800 - margin.top - margin.bottom; //200

    var x = d3.scale.linear().domain([x1, x2]) //[0,array_SNPs.length])
        .range([0, width]);

    var y = d3.scale.linear().domain([y1, y2]) //[0,array_SNPs.length])	
        .range([0, width]);

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

    svg.selectAll("path1")
        .data(data_obj_mc)
        .enter().append("svg:path")
        .style("fill", '#0d1dee') //blue
        .attr("transform", function(d) {
            return "translate(" + x(d.label_x) + "," + y(d.label_y) + ")";
        })
        .attr("d", d3.svg.symbol().type("square").size("25"));

    svg.append("g")
        .attr("class", "xmat axis")
        .attr("transform", "translate(0," + 0 + ")")
        .call(xAxis);

    svg.selectAll(".xmat text") // select all the text elements for the xaxis
        .attr("transform", function(d) {
            return "translate(" + this.getBBox().height * 1 + "," + this.getBBox().height * -1.5 + ")rotate(-90)";
        });

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", -650)
        .attr("y", 7)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("SNP id");

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
      
        mx_1 = e[0][0];
        mx_2 = e[1][0];
        my_1 = e[0][1];
        my_2 = e[1][1];

    }

    function brushend() {
        svg.classed("selecting", !d3.event.target.empty());
    }
}

/**
 * this function create the minimap from comm that show all SNPs association and do the zoom from x1, x2, y1, y2 values.
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
 */
function matrix_comm_plot_minmap(x1, x2, y1, y2, mrect_x1, mrect_y1, mrect_x2, mrect_y2) {

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    },

    width = 250 - margin.left - margin.right, //500
    height = 250 - margin.top - margin.bottom; //200

    var x = d3.scale.linear().domain([x1, x2]) //[0,array_SNPs.length])
        .range([0, width]);

    var y = d3.scale.linear().domain([y1, y2]) //[0,array_SNPs.length])	
        .range([0, width]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#minmap_matrixsc").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.selectAll("path1")
        .data(data_obj_mc)
        .enter().append("svg:path")
        .style("fill", '#0d1dee') //blue
        .attr("transform", function(d) {
            return "translate(" + x(d.label_x) + "," + y(d.label_y) + ")";
        })
        .attr("d", d3.svg.symbol().type("square").size("10"));

    if (mrect_x1 != 0 && mrect_y1 != 0 && mrect_x2 != 0 && mrect_y2 != 0) {
        svg.selectAll("rect") //create color scale bar
            .data([0])
            .enter()
            .append("rect")
            .attr("x", x(mrect_x1))
            .attr("y", y(mrect_y1))
            .attr("width", x(mrect_x2))
            .attr("height", y(mrect_y2) - y(mrect_y1)) 
            .attr("fill", "rgba(255, 0, 0, 0.1)")
            .attr("stroke", "rgba(255, 0, 0, 1)")
            .attr("stroke-width", "5");
    }

    svg.append("g")
        .attr("class", "xmat axis")
        .attr("transform", "translate(0," + 0 + ")")
        .call(xAxis);

    svg.selectAll(".xmat text") // select all the text elements for the xaxis
        .attr("transform", function(d) {
            return "translate(" + this.getBBox().height * 1 + "," + this.getBBox().height * -1.5 + ")rotate(-90)";
        });

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
}
