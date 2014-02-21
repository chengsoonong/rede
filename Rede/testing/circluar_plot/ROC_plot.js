/**
 * @fileoverview  function  to create the ROC plot.
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Soon Ong)
 */



/**
 * Read a .json to inicialaze the variables, get the datas and create the ROC plot from contigency table data
 * @param {number} idx
 * @param {string} filename
 */
function ROC_plot(idx, filename) {

    //Width and height
    //var w = 500;
    //var h = 300;
    var padding = 30;

    var margin = {
        top: 35,
        right: 35,
        bottom: 65,
        left: 65
    };

    var width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;




    d3.json(filename, function(json) {
        var links = json.links; // var links = json.links;


        var datact2 = json.cont_table; // var links = json.links;



        function preval_mapping(dat, t0, t1) {
            E = 0.0001

            return (dat.cases / t1) * (t0 / (dat.controls + E));

        }



        function sort_unv(dat, t0, t1) {
            var p = [];
            var p_sort = [];
            var dat_sort = [];

            for (var i in dat) {

                p.push(preval_mapping(dat[i], t0, t1))
            }

            //p_sort=p
            for (var i in p) {
                p_sort.push(p[i])
            }


            //p_sort.sort(function(a,b){return a-b});
            p_sort.sort(function(a, b) {
                return b - a
            });
            //document.write("psort"+p_sort.length+"<br>")

            for (var i in p_sort) {

                id = p.indexOf(p_sort[i])
                dat_sort.push(dat[id])
                p[id] = "s" + p_sort[i]


            }

            for (var i in [0, 1, 2]) {
                //dat_sort.push(dat[p.indexOf(p_sort[i])])
                //document.write([dat[i].controls,dat[i].cases]+" | "+[dat_sort[i].controls,dat_sort[i].cases]+" | "+  p[i] +" | "+  p_sort[i]+"<br>" );
            }

            return dat_sort

        }


        function sort_biv(dat, t0, t1) {

            var dat_list = [];
            var p = [];
            var p_sort = [];
            var dat_sort = [];

            for (var i in [0, 1, 2]) {
                for (var j in [0, 1, 2]) {
                    dat_list.push(dat[i][j])
                    p.push(preval_mapping(dat[i][j], t0, t1))

                }
            }

            //p_sort=p	

            for (var i in p) {
                p_sort.push(p[i])
            }




            //document.write(p+"<br>");


            //document.write(p_sort+"<br>");
            //p_sort.sort(function(a,b){return a-b});
            p_sort.sort(function(a, b) {
                return b - a
            });
            //document.write(p+"<br>");


            //document.write(p_sort+"<br>");
            for (var i in p_sort) {

                id = p.indexOf(p_sort[i])
                dat_sort.push(dat_list[id])
                p[id] = "s" + p_sort[i]

                //dat_sort.push(dat_list[p.indexOf(p_sort[i])])

            }


            //document.write(p+"<br>");


            //document.write(p_sort+"<br>");

            return dat_sort

        }




        function dots_fpr_tpr(dat, t0, t1) {
            var dat_fpr_tpr = []

            var cas = 0
            var con = 0
            //document.write(dat.length+"<br>")
            for (var i in dat) {

                con = con + dat[i].controls
                cas = cas + dat[i].cases

                var fpr = con / t0
                var tpr = cas / t1


                dat_fpr_tpr.push({
                    FPR: fpr,
                    TPR: tpr
                })
                //document.write("dots->"+[fpr,tpr]+"<br>")
            }
            return dat_fpr_tpr
        }





        unva_data = dots_fpr_tpr(sort_unv(datact2[idx].unv1, datact2[idx].total.controls, datact2[idx].total.cases), datact2[idx].total.controls, datact2[idx].total.cases)
        unvb_data = dots_fpr_tpr(sort_unv(datact2[idx].unv2, datact2[idx].total.controls, datact2[idx].total.cases), datact2[idx].total.controls, datact2[idx].total.cases)
        biv_data = dots_fpr_tpr(sort_biv(datact2[idx].biv, datact2[idx].total.controls, datact2[idx].total.cases), datact2[idx].total.controls, datact2[idx].total.cases)





        for (var i in biv_data) {

            //alert([biv_data[i].FPR,biv_data[i].TPR])
        }
        //alert([a[0].FPR,a[0].TPR,a[1].FPR,a[1].TPR,a[2].FPR,a[2].TPR])





        var fpr = [d3.max(unva_data, function(d) {
                return d.FPR;
            }),
            d3.max(unvb_data, function(d) {
                return d.FPR;
            }),
            d3.max(biv_data, function(d) {
                return d.FPR;
            })
        ]

        var tpr = [d3.max(unva_data, function(d) {
                return d.TPR;
            }),
            d3.max(unvb_data, function(d) {
                return d.TPR;
            }),
            d3.max(biv_data, function(d) {
                return d.TPR;
            })
        ]



        var xScale = d3.scale.linear()
            .domain([0, d3.max(fpr, function(d) {
                return d;
            })])
            .range([0, width]);

        var yScale = d3.scale.linear()
            .domain([0, d3.max(tpr, function(d) {
                return d;
            })])
            .range([height, 0]);





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



        //Define X axis
        var xAxis2 = d3.svg.axis()
            .scale(xScale)
            .orient("top")
            .ticks(5);

        //Define Y axis
        var yAxis2 = d3.svg.axis()
            .scale(yScale)
            .orient("right")
            .ticks(5);


        var svg = d3.select("#rp").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");








        function data2line(dat) {

            str = "M " + xScale(0) + " " + yScale(0) + " L "

            for (var i in dat) {
                str = str + xScale(dat[i].FPR) + " " + yScale(dat[i].TPR) + " L "

            }

            return str.slice(0, -3)

        }


        svg.selectAll("line")
            .data([1])
            .enter()
            .append("line")
            .attr("class", "linechrom")
            .attr("x1", xScale(0))
            .attr("y1", yScale(0))
            .attr("x2", xScale(1))
            .attr("y2", yScale(1))
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", 5)
            .style("stroke", "black") //stroke-dasharray="5"
        .style("opacity", 0.2);





        svg.append("svg:path")
            .attr("d", data2line(biv_data))
            .style("stroke-width", 2)
            .style("stroke", "#ee1500")
            .style("fill", "none");


        svg.append("svg:path")
            .attr("d", data2line(unva_data))
            .style("stroke-width", 2)
            .style("stroke", "#0d1dee")
            .style("fill", "none");


        svg.append("svg:path")
            .attr("d", data2line(unvb_data))
            .style("stroke-width", 2)
            .style("stroke", "#00d70b")
            .style("fill", "none");









        svg.selectAll("path3")
            .data(biv_data)
            .enter().append("svg:path").style("fill", '#ee1500') //red
        .attr("transform", function(d) {
            return "translate(" + xScale(d.FPR) + "," + yScale(d.TPR) + ")";
        })
            .attr("d", d3.svg.symbol().type("cross").size("30"));




        svg.selectAll("path2")
            .data(unva_data)
            .enter().append("svg:path").style("fill", '#0d1dee') //blue
        .attr("transform", function(d) {
            return "translate(" + xScale(d.FPR) + "," + yScale(d.TPR) + ")";
        })
            .attr("d", d3.svg.symbol().type("square").size("30"));




        svg.selectAll("path1")
            .data(unvb_data)
            .enter().append("svg:path").style("fill", '#00d70b') //green
        .attr("transform", function(d) {
            return "translate(" + xScale(d.FPR) + "," + yScale(d.TPR) + ")";
        })
            .attr("d", d3.svg.symbol().type("triangle-up").size("30"));







        /*
circle - a circle.
cross - a Greek cross or plus sign.
diamond - a rhombus.
square - an axis-aligned square.
triangle-down - a downward-pointing equilateral triangle.
triangle-up - an upward-pointing equilateral triangle.
*/

        //----------------------------------------------------label --------------------------------------------			 
        svg.selectAll("path1l")
            .data([{
                FPR: 0.05,
                TPR: 0.95
            }])
            .enter().append("svg:path").style("fill", '#0d1dee') //blue
        .attr("transform", function(d) {
            return "translate(" + xScale(d.FPR) + "," + yScale(d.TPR) + ")";
        })
            .attr("d", d3.svg.symbol().type("square").size("30"));


        svg.selectAll("path2l")
            .data([{
                FPR: 0.05,
                TPR: 0.9
            }])
            .enter().append("svg:path").style("fill", '#00d70b') //green
        .attr("transform", function(d) {
            return "translate(" + xScale(d.FPR) + "," + yScale(d.TPR) + ")";
        })
            .attr("d", d3.svg.symbol().type("triangle-up").size("30"));


        svg.selectAll("path3l")
            .data([{
                FPR: 0.05,
                TPR: 0.85
            }])
            .enter().append("svg:path").style("fill", '#ee1500') //red
        .attr("transform", function(d) {
            return "translate(" + xScale(d.FPR) + "," + yScale(d.TPR) + ")";
        })
            .attr("d", d3.svg.symbol().type("cross").size("30"));


        svg.selectAll("text")
            .data([{
                FPR: 0.0575,
                TPR: 0.94
            }, {
                FPR: 0.0575,
                TPR: 0.89
            }, {
                FPR: 0.0575,
                TPR: 0.84
            }])
            .enter()
            .append("text")
            .text(function(d, i) {
                if (i == 0) {
                    return "SNPa (3 dots)";
                }
                if (i == 1) {
                    return "SNPb (3 dots)";
                }
                if (i == 2) {
                    return "SNPaSNPb (9 dots)";
                }
            })
            .attr("x", function(d) {
                return xScale(d.FPR);
            })
            .attr("y", function(d) {
                return yScale(d.TPR);
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", function(d, i) {
                if (i == 0) {
                    return "#0d1dee";
                }
                if (i == 1) {
                    return "#00d70b";
                }
                if (i == 2) {
                    return "#ee1500";
                }
            });

        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ label ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ 			
        //Create X axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (height) + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
        //.attr("x", width/2)
        .attr("x", width / 2)
        //.attr("y", 30)
        .attr("y", 30)
            .style("text-anchor", "end")
            .text("FPR");


        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + (height), 0 + ")")
            .call(xAxis2)


        //Create Y axis
        svg.append("g")
            .attr("class", "axis")
        //.attr("transform", "translate(" + padding + ",0)")
        .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("x", -100)
            .attr("y", -30)
        //.attr("dy", ".71em")
        .style("text-anchor", "end")
            .text("TPR");

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + width + ",0)")
            .call(yAxis2)


    });
}