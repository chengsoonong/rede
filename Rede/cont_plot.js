/**
 * @fileoverview  function  to create the contigency table
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Soon Ong)
 */



/**
 * Read a .json to initialize the variables, get the datas and create the contigency table plot
 * @param {number} idx
 * @param {string} filename
 */
function cont_plot(idx) {

    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },

    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var formatPercent = d3.format(".0%");

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.3);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var svg = d3.select("#contp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var datact = cont_table[idx];
        x.domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        var l1_1 = 112.5,
            l1_2 = 0,
            l2_1 = 112.5 * 2,
            l2_2 = 112.5,
            l3_1 = 112.5 * 3,
            l3_2 = 112.5 * 2,
            l4_1 = 112.5 * 4 + 30,
            l4_2 = 112.5 * 3 + 30;

        //first row
        plot_ct(1, 1, 2, l1_1, l1_2, -10, 122.5, datact["unv1"][0].controls / datact["total"].controls, 
                datact["unv1"][0].cases / datact["total"].cases)
        plot_ct(2, 4, 5, l1_1, l1_2, -10, 122.5, datact["biv"][0][0].controls / datact["total"].controls,
                datact["biv"][0][0].cases / datact["total"].cases)
        plot_ct(3, 6, 7, l1_1, l1_2, -10, 122.5, datact["biv"][0][1].controls / datact["total"].controls, 
                datact["biv"][0][1].cases / datact["total"].cases)
        plot_ct(4, 8, 9, l1_1, l1_2, -10, 122.5, datact["biv"][0][2].controls / datact["total"].controls,
                datact["biv"][0][2].cases / datact["total"].cases)
        //second row
        plot_ct(5, 1, 2, l2_1, l2_2, 122.5 - 10, 122.5 - 10, datact["unv1"][1].controls / datact["total"].controls,
                datact["unv1"][1].cases / datact["total"].cases)
        plot_ct(6, 4, 5, l2_1, l2_2, 122.5 - 10, 122.5 - 10, datact["biv"][1][0].controls / datact["total"].controls,
                datact["biv"][1][0].cases / datact["total"].cases)
        plot_ct(7, 6, 7, l2_1, l2_2, 122.5 - 10, 122.5 - 10, datact["biv"][1][1].controls / datact["total"].controls,
                datact["biv"][1][1].cases / datact["total"].cases)
        plot_ct(8, 8, 9, l2_1, l2_2, 122.5 - 10, 122.5 - 10, datact["biv"][1][2].controls / datact["total"].controls,
                datact["biv"][1][2].cases / datact["total"].cases)
        //third row
        plot_ct(9, 1, 2, l3_1, l3_2, 122.5 * 2 - 20, 122.5 - 10, datact["unv1"][2].controls / datact["total"].controls,
                datact["unv1"][2].cases / datact["total"].cases)
        plot_ct(10, 4, 5, l3_1, l3_2, 122.5 * 2 - 20, 122.5 - 10, datact["biv"][2][0].controls / datact["total"].controls,
                datact["biv"][2][0].cases / datact["total"].cases)
        plot_ct(11, 6, 7, l3_1, l3_2, 122.5 * 2 - 20, 122.5 - 10, datact["biv"][2][1].controls / datact["total"].controls,
                datact["biv"][2][1].cases / datact["total"].cases)
        plot_ct(12, 8, 9, l3_1, l3_2, 122.5 * 2 - 20, 122.5 - 10, datact["biv"][2][2].controls / datact["total"].controls,
                datact["biv"][2][2].cases / datact["total"].cases)
        //fourth row
        plot_ct(13, 4, 5, l4_1, l4_2, 122.5 * 3 - 30 + 30, 122.5 - 10, datact["unv2"][0].controls / datact["total"].controls,
                datact["unv2"][0].cases / datact["total"].cases)
        plot_ct(14, 6, 7, l4_1, l4_2, 122.5 * 3 - 30 + 30, 122.5 - 10, datact["unv2"][1].controls / datact["total"].controls,
                datact["unv2"][1].cases / datact["total"].cases)
        plot_ct(15, 8, 9, l4_1, l4_2, 122.5 * 3 - 30 + 30, 122.5 - 10, datact["unv2"][2].controls / datact["total"].controls,
                datact["unv2"][2].cases / datact["total"].cases)

        function plot_ct(id, pos_x1, pos_x2, pos_y1, pos_y2, pos_y1r, pos_y2r, control, cases) {
            // Plot a cell of the contingency table
            var y = d3.scale.linear().domain([0, 1])
                .range([pos_y1, pos_y2]);

            svg.selectAll("rect" + id)
                .data([0])
                .enter()
                .append("rect")
                .attr("x", x(pos_x1) - 5)
                .attr("y", pos_y1r) //y(1)-10 )=-10
                .attr("width", 150)
                .attr("height", pos_y2r) //y(1)-10, y(0)+10)=122.5
                .attr("fill", function(d) {
                    if (control > cases) {
                        return "#4ed05f";
                    } //green
                    if (control < cases) {
                        return "#d06057";
                    } //red
                    if (control == cases) {
                        return "white";
                    }
                })
                .attr("stroke", "black")
                .attr("stroke-width", 1);

            svg.selectAll(".bar" + id)
                .data([{
                    letter: pos_x1,
                    frequency: control
                }, {
                    letter: pos_x2,
                    frequency: cases
                }])
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) {
                    return x(d.letter) + 5;
                })
                .attr("width", x.rangeBand())
                .attr("y", function(d) {
                    return y(d.frequency);
                }) //fill: steelblue
                .attr("fill", "steelblue")
                .attr("height", function(d) {
                    return pos_y1 - y(d.frequency);
                });

            svg.selectAll(".text_ct")
                .data([{
                    letter: pos_x1,
                    frequency: control
                }, {
                    letter: pos_x2,
                    frequency: cases
                }])
                .enter()
                .append("text")
                .attr("class", "text_b")
                .text(function(d) {
                    return Math.round(d.frequency * 100) + "%";
                })
                .attr("x", function(d) {
                    return x(d.letter) + 15;
                })
                .attr("y", function(d) {
                    return y(d.frequency);
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("fill", "black");
        }
}
