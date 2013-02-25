

//cont_plot (48,"bd_test_ct.json")
function cont_plot (idx,filename){


var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width],0.3);



var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");



var svg = d3.select("#contp").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(filename, function(json) {



var datact=json.cont_table[idx];


//var datact={"unv1": [{"controls":0.279101429544 ,"cases":0.262312633833 }, {"controls":0.496936691627 ,"cases":0.498929336188 }, {"controls":0.223961878829 ,"cases":0.238758029979 }], "unv2": [{"controls":0.279441797141 ,"cases":0.262312633833 }, {"controls":0.49659632403 ,"cases":0.499464668094 }, {"controls":0.223961878829 ,"cases":0.238222698073 }], "biv": [[{"controls":0.279101429544 ,"cases":0.262312633833}, {"controls":0.0 ,"cases":0.0}, {"controls":0.0 ,"cases":0.0}],[{"controls":0.000340367597005 ,"cases":0.0}, {"controls":0.49659632403 ,"cases":0.498929336188}, {"controls":0.0 ,"cases":0.0}],[{"controls":0.0 ,"cases":0.0}, {"controls":0.0 ,"cases":0.000535331905782}, {"controls":0.223961878829 ,"cases":0.238222698073}]], "total": {"controls":2938.0 ,"cases":1868.0 }}

 // var datact={"unv1": [{"controls":2220.0 ,"cases":1406.0 }, {"controls":669.0 ,"cases":428.0 }, {"controls":49.0 ,"cases":34.0 }], "unv2": [{"controls":2021.0 ,"cases":1293.0 }, {"controls":816.0 ,"cases":524.0 }, {"controls":101.0 ,"cases":51.0 }], "biv": [[{"controls":1539.0 ,"cases":968.0}, {"controls":607.0 ,"cases":400.0}, {"controls":74.0 ,"cases":38.0}],[{"controls":458.0 ,"cases":301.0}, {"controls":187.0 ,"cases":116.0}, {"controls":24.0 ,"cases":11.0}],[{"controls":24.0 ,"cases":24.0}, {"controls":22.0 ,"cases":8.0}, {"controls":3.0 ,"cases":2.0}]]}; 
 //2938.  1868.

  x.domain([1,2,3,4,5,6,7,8,9,10]);
  //y.domain([0, d3.max(data, function(d) { return d.frequency; })]);
  //y.domain([0, 1]);

var  l1_1 = 112.5 , l1_2 = 0,
	 l2_1 = 112.5*2, l2_2 = 112.5,
	 l3_1 = 112.5*3 ,l3_2= 112.5*2,
 	 l4_1 = 112.5*4+30 ,l4_2=112.5*3+30;

//datact["total"].controls datact["total"].cases 

plot_ct(1,1,2,l1_1,l1_2,-10,122.5, datact["unv1"][0].controls/datact["total"].controls , datact["unv1"][0].cases/datact["total"].cases)
plot_ct(2,4,5,l1_1,l1_2,-10,122.5, datact["biv"][0][0].controls/datact["total"].controls , datact["biv"][0][0].cases/datact["total"].cases)
plot_ct(3,6,7,l1_1,l1_2,-10,122.5, datact["biv"][0][1].controls/datact["total"].controls , datact["biv"][0][1].cases/datact["total"].cases)
plot_ct(4,8,9,l1_1,l1_2,-10,122.5, datact["biv"][0][2].controls/datact["total"].controls , datact["biv"][0][2].cases/datact["total"].cases)

plot_ct(5,1,2,l2_1, l2_2,122.5-10,122.5-10, datact["unv1"][1].controls/datact["total"].controls , datact["unv1"][1].cases/datact["total"].cases)
plot_ct(6,4,5,l2_1, l2_2,122.5-10,122.5-10, datact["biv"][1][0].controls/datact["total"].controls , datact["biv"][1][0].cases/datact["total"].cases)
plot_ct(7,6,7,l2_1, l2_2,122.5-10,122.5-10, datact["biv"][1][1].controls/datact["total"].controls , datact["biv"][1][1].cases/datact["total"].cases)
plot_ct(8,8,9,l2_1, l2_2,122.5-10,122.5-10, datact["biv"][1][2].controls/datact["total"].controls , datact["biv"][1][2].cases/datact["total"].cases)

plot_ct(9 ,1,2,l3_1, l3_2,122.5*2-20,122.5-10, datact["unv1"][2].controls/datact["total"].controls, datact["unv1"][2].cases/datact["total"].cases)
plot_ct(10 ,4,5,l3_1, l3_2,122.5*2-20,122.5-10, datact["biv"][2][0].controls/datact["total"].controls,datact["biv"][2][0].cases/datact["total"].cases)
plot_ct(11 ,6,7,l3_1, l3_2,122.5*2-20,122.5-10, datact["biv"][2][1].controls/datact["total"].controls,datact["biv"][2][1].cases/datact["total"].cases)
plot_ct(12 ,8,9,l3_1, l3_2,122.5*2-20,122.5-10, datact["biv"][2][2].controls/datact["total"].controls,datact["biv"][2][2].cases/datact["total"].cases)




plot_ct(13 ,4,5,l4_1, l4_2,122.5*3-30 +30 ,122.5-10 , datact["unv2"][0].controls/datact["total"].controls, datact["unv2"][0].cases/datact["total"].cases)

plot_ct(14 ,6,7,l4_1, l4_2,122.5*3-30 +30 ,122.5-10 , datact["unv2"][1].controls/datact["total"].controls, datact["unv2"][1].cases/datact["total"].cases)
plot_ct(15 ,8,9,l4_1, l4_2,122.5*3-30 +30 ,122.5-10 , datact["unv2"][2].controls/datact["total"].controls, datact["unv2"][2].cases/datact["total"].cases)


/*
plot_ct(1,1,2,l1_1,l1_2,-10,122.5, datact["unv1"][0].controls/2938. , datact["unv1"][0].cases/1868.)
plot_ct(2,4,5,l1_1,l1_2,-10,122.5, datact["biv"][0][0].controls/2938. ,datact["biv"][0][0].cases/1868.)
plot_ct(3,6,7,l1_1,l1_2,-10,122.5, datact["biv"][0][1].controls/2938. ,datact["biv"][0][1].cases/1868.)
plot_ct(4,8,9,l1_1,l1_2,-10,122.5, datact["biv"][0][2].controls/2938. ,datact["biv"][0][2].cases/1868.)

plot_ct(5,1,2,l2_1, l2_2,122.5-10,122.5-10, datact["unv1"][1].controls/2938. , datact["unv1"][1].cases/1868.)
plot_ct(6,4,5,l2_1, l2_2,122.5-10,122.5-10, datact["biv"][1][0].controls/2938. ,datact["biv"][1][0].cases/1868.)
plot_ct(7,6,7,l2_1, l2_2,122.5-10,122.5-10, datact["biv"][1][1].controls/2938. ,datact["biv"][1][1].cases/1868.)
plot_ct(8,8,9,l2_1, l2_2,122.5-10,122.5-10, datact["biv"][1][2].controls/2938. ,datact["biv"][1][2].cases/1868.)

plot_ct(9 ,1,2,l3_1, l3_2,122.5*2-20,122.5-10, datact["unv1"][2].controls/2938. , datact["unv1"][2].cases/1868.)
plot_ct(10 ,4,5,l3_1, l3_2,122.5*2-20,122.5-10, datact["biv"][2][0].controls/2938. ,datact["biv"][2][0].cases/1868.)
plot_ct(11 ,6,7,l3_1, l3_2,122.5*2-20,122.5-10, datact["biv"][2][1].controls/2938. ,datact["biv"][2][1].cases/1868.)
plot_ct(12 ,8,9,l3_1, l3_2,122.5*2-20,122.5-10, datact["biv"][2][2].controls/2938. ,datact["biv"][2][2].cases/1868.)
 
plot_ct(13 ,4,5,l4_1, l4_2,122.5*3-30 +30 ,122.5-10 +30, datact["unv2"][0].controls/2938. , datact["unv2"][0].cases/1868.)
plot_ct(14 ,6,7,l4_1, l4_2,122.5*3-30 +30 ,122.5-10 +30, datact["unv2"][1].controls/2938. , datact["unv2"][1].cases/1868.)
plot_ct(15 ,8,9,l4_1, l4_2,122.5*3-30 +30 ,122.5-10 +30, datact["unv2"][2].controls/2938. , datact["unv2"][2].cases/1868.)
*/




//plot_ct(x1,x2,y1,y2) height/4,0
function  plot_ct(id, pos_x1, pos_x2, pos_y1, pos_y2, pos_y1r, pos_y2r, control, cases){
	
	//var y = d3.scale.linear().domain([0, 2220])
	var y = d3.scale.linear().domain([0,1])
    .range([pos_y1, pos_y2]);

   

			svg.selectAll("rect"+id)
			  //.data([{letter:pos_x1 , frequency:0.5},{letter:pos_x2 , frequency:0.1}])
			  .data([0])
			   .enter()
			   .append("rect")
			   .attr("x",  x(pos_x1)-5)
			   .attr("y", pos_y1r)//y(1)-10 )=-10
			   .attr("width", 150)
			   .attr("height", pos_y2r)//y(1)-10, y(0)+10)=122.5
			   .attr("fill", function(d){
			   			if(control>cases){return "#4ed05f";} //green
			   			if(control<cases){return "#d06057";} //red
			   			if(control==cases){return "white";}
									   	
			   	
			   	
			   })
			   .attr("stroke", "black")
			   .attr("stroke-width", 1);   // fill="yellow" stroke="orange" stroke-width="5"

  svg.selectAll(".bar"+id)
      //.data([data[0],data[1]])
      .data([{letter:pos_x1 , frequency:control},{letter:pos_x2 , frequency:cases}])
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter)+5; })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.frequency); })//fill: steelblue
      .attr("fill", "steelblue")
      .attr("height", function(d) { return pos_y1 - y(d.frequency); });
      
    svg.selectAll(".text_ct")
			    //.data([{letter:pos_x1 , frequency:two_dec(control*100)},{letter:pos_x2 , frequency:two_dec(cases*100)}])
			     .data([{letter:pos_x1 , frequency:control},{letter:pos_x2 , frequency:cases}])
			   .enter()
			   .append("text") 
			   .attr("class", "text_b")
			   .text(function(d) { return two_dec(d.frequency*100)+"%"; }) 
			   //.text(function(d) { return round_ct(d.frequency*100)+"%"; }) //one_dec
			   //.text(function(d) { return Math.round(d.frequency*100)+"%"; }) // IMP -> don't return one sum equal to 100% in colums
			  // .attr("text-anchor", "middle")Math.round
			   .attr("x", function(d) { return x(d.letter)+15; })
			   .attr("y",function(d) { return y(d.frequency); })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
			   .attr("fill", "black");  
      
      
      
      
      
      
      
     }
      
  function two_dec( value){
	// return numbers with 2 decimal after "."          	
	var v=value.toString();
	var point=".";
	var index_point=v.indexOf(point);
	var index_twodec=index_point+3;
	
	return v.substring(0,index_twodec);
}    
      

});


}