/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

var svgHeight = 500
var svgWidth = 500

d3.json("data/revenues.json").then(function(data){
	data.forEach(function(d){
		d.revenue = +d.revenue;
		d.profit = +d.profit;
	})

	var svg = d3.select("#chart-area")
				.append("svg")
				.attr("width", svgWidth)
				.attr("height", svgHeight)

	var x = d3.scaleBand ()	
				.domain(data.map(function(d){
					return d.month ;
				}))
				.range([0, svgWidth])				
				.paddingInner(0.3)
				.paddingOuter(0.3)

	var y = d3.scaleLinear()
				.domain([0, d3.max(data, function(d){
					return d.revenue ;
				})])
				.range([0, svgHeight])				

	var colr = d3.scaleOrdinal()
				.domain(data.map(function(d){
					return d.month;
				}))
				.range(d3.schemeCategory10)
	
	var bars = svg.selectAll("rect").data(data)
	
	var bar = bars.enter()
				.append("rect")
				.attr("x", function(d){
					return x(d.month)
				})			
				.attr("y", function(d){
					return svgHeight - y(d.revenue)
				})
				.attr("width", x.bandwidth)
				.attr("height", function(d){
					return y(d.revenue)
				})
				.attr("fill", function(d){
					return colr(d.month);
				})

})