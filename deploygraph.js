
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 50, left: 50},
width = 900 - margin.left - margin.right,
height = 540 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
  "translate(" + margin.left + "," + margin.top + ")");


//Read the data
d3.json("https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=dec,ra,pl_hostname,pl_pnum&format=json", function(data) {


  //New array to insert data without dupes.
  let noDupes = [];

  // Declare an empty object 
  let uniqueObject = {}; 

  // Loop for the array elements 
  for (let i in data) { 

    //Extract the title 
    objname = data[i]['pl_hostname'];
    // Use the title as the index 
    uniqueObject[objname] = data[i]; 
  } 

  // Loop to push unique object into array 
  for (i in uniqueObject) { 
    noDupes.push(uniqueObject[i]);
  } 




  // Add X axis Bottom
  var x = d3.scaleLinear()
  .domain([24, 0])
  .range([ width,0]);
  svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

    // Add X axis Bottom
    var xtop = d3.scaleLinear()
    .domain([24, 0])
    .range([ width, 0]);
    svg.append("g")
    .attr("transform", "translate(0," - height + ")")
    .call(d3.axisBottom(xtop));


  // Add Y axis
  var y = d3.scaleLinear()
  .domain([-90, 90])
  .range([ height, 0]);
  svg.append("g")
  .call(d3.axisLeft(y).ticks(6));
  
  // Add Right Y axis
  var yright = d3.scaleLinear()
  .domain([-90, 90])
  .range([ height, 0]);
  svg.append("g")
  .attr("transform", "translate("+width+",0)")
  .call(d3.axisRight(yright).ticks(6));

  // Add a scale for bubble size
  var z = d3.scaleLinear()
  .domain([200000, 1310000000])
  .range([ 4, 40]);


  // var myimage = svg.append('image')
  //   .attr('xlink:href', 'https://www.evernote.com/shard/s25/sh/0a6c1268-9fe0-4687-ac30-164ed59c30ee/33fab35197b3b7e98c217ef7f5b05ae7/res/81a02713-357f-cb01-3953-9d2d0474ac12')
  //   .attr('width', width + margin.left + margin.right)
  //   .attr('height', height + margin.top + margin.bottom)

  // -1- Create a tooltip div that is hidden by default:
  var tooltip = d3.select("#my_dataviz")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "black")
  .style("border-radius", "5px")
  .style("padding", "10px")
  .style("color", "white")

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  var showTooltip = function(d) {
    tooltip
    .transition()
    .duration(200)
    tooltip
    .style("opacity", 1)
    .html("Name: " + d.pl_hostname + ", " + "Number of Planets: " + d.pl_pnum)
    .style("left", (d3.mouse(this)[0]+30) + "px")
    .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var moveTooltip = function(d) {
    tooltip
    .style("left", (d3.mouse(this)[0]+30) + "px")
    .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var hideTooltip = function(d) {
    tooltip
    .transition()
    .duration(200)
    .style("opacity", 0)
  }

  svg.append("text")
  .attr("class", "x label")
  .attr("text-anchor", "middle")
  .attr("x", width/2)
  .attr("y", height + 30)
  .text("Right Ascencion (hours)");


  svg.append("text")
  .attr("class", "y label")
  .attr("text-anchor", "middle")
  .attr("y", 6)
  .attr("dy", ".75em")
  .attr("transform", "translate(-50,"+(height/2)+") rotate(-90) ")
  .text("Declination (°)");


  // Add dots
  svg.append('g')
  .selectAll("dot")
  .data(noDupes)
  .enter()
  .append("circle")
  .attr("class", "bubbles")
  .attr("cx", function (d) { return x(d.ra) * (67/1000); } )
  .attr("cy", function (d) { return y(d.dec); } )
  .attr("r", 5 )
  .style("fill", "black")
  .style("opacity", 0.4)
    // -3- Trigger the functions
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )

  })