/**
 * @fileoverview All functions to create the histogram Degree x SNPs plot
 * @author cristovao.casagrande@gmail.com (Cristovao Iglesias)
 * @author chengsoon.ong@unimelb.edu.au (Cheng Ong)
 */

/**
 * Create the histogram degree x snp. When click in a bar of the histogram this will selected egds in circle plot
 *     and dots in manhattan plot.
 * @param {string} file_name
 * @param {number} probe_group
 */
function histogram_degree_SNPs(file_name, probe_group, if_zoom) {
    
    var data = new Array();
    var allNodes_hes = new Array();
    var links_hes = new Array();

    d3.json(file_name, function(json) {
        // filter for the zoom function of the arc plot
        if (if_zoom) {
            zoom_links.forEach( function(d) {
                links_hes.push(d);
            });
            zoom_allNodes.forEach( function(d) {
                allNodes_hes.push(d);
                data.push(d);
            });

        } else {
            json.links.forEach( function(d) {
                if (probe_group === 0) {
                    links_hes.push(d);
                } else {
                    if (d.probe_group === probe_group) {
                        links_hes.push(d);
                    }
                }
            });

            json.nodes.forEach(function(d) {
                if (probe_group === 0) {
                    allNodes_hes.push(d);
                    data.push(d);
                } else {
                    allNodes_hes.push(d);
                    if (d.probe_group === probe_group) {
                        data.push(d);
                    }
                }
            });
        }
        //it will create the histogram degree X SNPs in circle_plot
        var margin = {
            top: 50,
            right: 20,
            bottom: 50,
            left: 400
        },

        width = 700 - margin.left - margin.right; 

        if (probe_group == 0) {
            if (data.length > 10) {
                var height = 34.1796875 * allNodes_hes.length - margin.top - margin.bottom; //200
            } else {
                var height = 34.1796875 * 10 - margin.top - margin.bottom;
            }
        } else {
            if (data.length > 10) {
                var height = 34.1796875 * data.length - margin.top - margin.bottom; //200
            } else {
                var height = 34.1796875 * 10 - margin.top - margin.bottom;
            }
        }

        var y = d3.scale.ordinal()
            .rangeRoundBands([0, height], .5);

        var x = d3.scale.linear()
            .range([0, width]);

        var xAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var yAxis = d3.svg.axis()
            .scale(x)
            .orient("top");

        var svg = d3.select("#hds_matrix").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        y.domain(data.map(function(d, i) {
            return "id:" + d.id + " chr" + d.chrom + ':' + d.bp_position + " " + d.rs +
                " probe_group:" + d.probe_group;
        }));

        x.domain([0, d3.max(data, function(d) {
            return d.degree;
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .call(xAxis);

        // now rotate text on x axis
        // first move the text left so no longer centered on the tick
        // then rotate up to get 90 degrees.
        svg.selectAll(".x text")
            .style("font-size", "14px")
            .attr("transform", function(d) {
                return "translate(" + this.getBBox().height * -0.5 + "," + this.getBBox().height * 0 + ")rotate(0)";
            })
            .on("click", function(d, i) {
                var person = prompt("\n1) ClinVar\n2) dbSNP\n3) Ensembl\n4) PheGenI\n5) OMIM\n6) openSNP\n"
                    + "7) SNPedia\n8) UCSC");

                if (person != null) {
                    if ("8" == person) {
                        html = 'http://genome.ucsc.edu/cgi-bin/hgTracks?org=human&db=hg19&position=' + 'chr' +
                            data[i].chrom + ':' + (data[i].bp_position - 1000) + '-' + (data[i].bp_position + 1000);

                    } else if ("6" == person) {
                        html = 'http://opensnp.org/snps/' + data[i].rs;

                    } else if ("2" == person) {
                        html = 'http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs=' + data[i].rs.substring(2);

                    } else if ("4" == person) {
                        html = 'http://www.ncbi.nlm.nih.gov/gap/phegeni?tab=2&rs=' + data[i].rs.substring(2);

                    } else if ("3" == person) {
                        html = 'http://www.ensembl.org/Homo_sapiens/Variation/Summary?r=' + data[i].chrom + ':' +
                            (data[i].bp_position - 1000) + '-' + (data[i].bp_position + 1000) + ';source=dbSNP;v=rs' +
                            data[i].rs.substring(2) + ';vdb=variation';

                    } else if ("7" == person) {
                        html = 'http://www.snpedia.com/index.php/Rs' + data[i].rs.substring(2);

                    } else if ("5" == person) {
                        html = 'http://omim.org/search?index=entry&search=rs' + data[i].rs.substring(2);

                    } else if ("1" == person) {
                        html = 'http://www.ncbi.nlm.nih.gov/clinvar?term=rs' + data[i].rs.substring(2);
                    }
                    window.open(html)
                }
            });

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0," + 0 + ")")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(0)")
            .attr("x", width / 2)
            .attr("y", -25).style("font-size", "15px")
            .style("text-anchor", "end")
            .text("Degree");

        var bar_hDS = svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "ds bar")
            .attr("y", function(d) {
                return y("chr" + d.chrom + ':' + d.bp_position);
            })
            .attr("height", y.rangeBand())
            .attr("x", 0)
            .attr("width", function(d) {
                return x(d.degree);
            })
            .on("mousedown", function(g, i) {
                bar_hDS.style("fill", "steelblue");
                l = [];
                list_idx_in_links = [];
                list_idx_in_links2 = [];
                
				// filters the selected SNPs and write it in the arrays for the
				// SNPs paragraphs.
                links_hes.forEach(function(e) {
                    if (g.id === e.source || g.id === e.target) {
                        l.push(("chr" + allNodes[e.source].chrom + ':' +
                                allNodes[e.source].bp_position));
                        l.push(("chr" + allNodes[e.target].chrom + ':' +
                                allNodes[e.target].bp_position));
                        list_idx_in_links.push(e.source + "-" + e.target);
                        list_idx_in_links2.push(e);
                    }
                });	

                bar_hDS.filter(function(d) {
                    if (include_in_arr(l, ("chr" + d.chrom + ':' + d.bp_position))) {
                        return d;
                    }
                })
                    .transition()
                    .style("fill", "red");

                bar_hDS.filter(function(d) {
                    if (("chr" + d.chrom + ':' + d.bp_position) === ("chr" + data[i].chrom + ':' + data[i].bp_position)) {
                        return d;
                    }
                })
                    .transition()
                    .style("fill", "#32ee00");

                if(plot_chosen == "p_cir" || plot_chosen == "p_arc") {
                    d3.select("#chart").selectAll("g circle").transition().style("opacity", 0);

                    d3.select("#chart").selectAll("g circle") //select the circles           
                        .filter(function(d) {
                            if (include_in_arr(l, ("chr" + d.chrom + ':' + d.bp_position))) {
                                return d;
                            }
                        })
                        .transition()
                        .style("opacity", 1);

                    d3.select("#chart").selectAll(".link").transition().style("opacity", 0);

                    //select the association regarding to the circle selected
                    d3.select("#chart").selectAll(".link") 
                        .filter(function(d, i) {
                            if (include_in_arr(list_idx_in_links, d.source + "-" + d.target)) {
                                return d;
                            }
                        })
                        .transition()
                        .style("opacity", 0.3);
                }
            });

        svg.selectAll(".bar") //show degree as tooltip - title
            .data(data)
            .append("title")
            .text(function(d) {
                return "chr" + d.chrom + ':' + d.bp_position + " ; " + d.degree;
            });
    });
}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ histogram degree X SNPs (matrix) ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
