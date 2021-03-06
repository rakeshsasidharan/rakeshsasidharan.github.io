
var margin = {top: 100, bottom: 100, left: 10, right : 10} ; 
var canvasHeight = 500
var canvasWidth = 800
var chartHeight= canvasHeight - margin.top - margin.bottom
var chartWidth = canvasWidth - margin.left - margin.right


var tip = d3.tip()
	.html(function(d) {
		return "State: " + d.properties.name + " <br>Region: " + stateRegion.get(d.properties.name) + "<br>Earthquakes: " + earthquake.get(d.properties.name) ; 
  })



var svg = d3.select("#chart-area")
	.append("svg")
	.attr("height", canvasHeight)
	.attr("width", canvasWidth)

svg.call(tip) ; 

var projection =  d3.geoAlbersUsa()
		.translate([canvasWidth	/2, canvasHeight/2])
		.scale([1000])


var earthquake =  d3.map(); 
var stateRegion = d3.map() ; 
var path = d3.geoPath()
		.projection(projection) ; 

var legendSize = {height: 20, width: 30}
var legendPos = {x: 10, y: 100}

var y = d3.scaleLinear()
	.domain([0,9])
	.range([10, 11 * legendSize.height])

var colorRange = ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"]

var legend = d3.select("#chart-area")
	.append("svg")
	.attr("class", "key")
	.attr("height", canvasHeight)
	.attr("width", 200)
	
var promises = [
	d3.json("data/states-10m.json"), 
	d3.csv("data/state-earthquakes.csv")] 


Promise.all(promises).then(function(data){
	ready(data) ; 
}).catch(function(error){
	console.log(error)
})


function ready(us) {
	us[1].forEach(function(d){
		earthquake.set(d.States, +d["Total Earthquakes"]); 
		stateRegion.set(d.States, d.Region); 
	})

	var max = Math.ceil(d3.max(earthquake.values())/1000) * 1000  ;

	var logScale = d3.scaleLog().domain([1, max])

	var color = d3.scaleSequential( function(d) {return d3.interpolateReds(logScale(d))})

	var forInversion = [] ; 

	for (let i = 1; i <= 9; i++){
		forInversion.push(i/9); 
	}

	legendData = forInversion.map(function(d){
		return logScale.invert(d); 
	})

	legend.selectAll("rect")
		.data(legendData)	
		.enter().append("rect")
			.attr("height", legendSize.height)
			.attr("x", legendPos.x)
			.attr("y", function(d,i){return legendPos.y+ y(i) + 10 })
			.attr("width", legendSize.width )
			.attr("fill", function(d){return color(d); })
	
	legend.selectAll("text")
		.data(legendData)	
		.enter().append("text")
			.attr("x", legendPos.x + legendSize.width + 10)
			.attr("y", function(d,i){return legendPos.y + y(i) + 25 })
			.text(function(d,i){return Math.round(legendData[i]) })
			.attr("font-size", "10px")
			.attr("font-weight", "bold")

	legend.append("text")
		.attr("class", "caption")
		.attr("x", legendPos.x)
		.attr("y", y.range()[0] + legendPos.y )
		.attr("fill", "#000")
		.attr("text-anchor", "start")
		.attr("font-weight", "bold")
		.attr("font-size", "15px")
		.text("Earthquake Frequency")

		var statemap = svg.append("g")
		.attr("class", "states")
		.selectAll("path")
			.data(topojson.feature(us[0], us[0].objects.states).features)
		.enter().append("path")
			.style("fill", function(d){
				return color(earthquake.get(d.properties.name));
				})
			.attr("d", path)
			.on("mouseover",function(d, i){
				var rect = this;
				tip.show(d,i);
				tip.attr("class", function(){
					if (rect.getBBox().y < 75) 
						return "d3-tip n down"
					else
						return "d3-tip n" ; 
				})
			})
			.on("mouseout", tip.hide)
			.append("title")
}
