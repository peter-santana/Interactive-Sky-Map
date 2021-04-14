//April 13 log:
//Added picture background of map
//Added click function to each star
//Fixed inverted scale for x and y.
//Added color change on circle depending on star type
//Added zoom functionality

//----Start ----
//set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 50, left: 50},
width = 780 - margin.left - margin.right,
height = 485.4 - margin.top - margin.bottom;
// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .call(d3.zoom().on("zoom", function () {
  svg.attr("transform", d3.event.transform)
  }))
  .append("g")
  .attr("transform",
  "translate(" + margin.left + "," + margin.top + ")");

var mapimage = svg.append("image")
  .attr("xlink:href","_images/starmap.png")
  .attr("width", width)
  .attr("height", height)

  //Read the planet data
  d3.json("https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=dec,ra,pl_hostname,pl_pnum,st_rad,st_teff,st_optmag,st_dist,pl_orbsmax&format=json", function(data) {


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

/**Note April 14 - Speak to Abel Mendez about this math
  //New array to insert candidates
  let exoCandidates = [];

  //lstar/lsun=((10(-4.72))/-2.5)

  for (let i in data) {
    //Verify if have sufficient data
    //st_optmag = stellar optical magnitude 
    //Absolute visual magnitude
    let avm = data[i]['st_optmag'] - 5 *Math.log(data[i]['st_dist']/10)

    //Bolometric magnitude of star
    if (data[i]['st_rad']>0 && data[i]['st_optmag']>0 && data[i]['pl_orbsmax']>0)
    {

    //Habitable zone calculations per https://www.planetarybiology.com/calculating_habitable_zone.html
    let hab_zonemin = Math.sqrt(data[i]['st_optmag']/1.1);
    let hab_zonemax = Math.sqrt(data[i]['st_optmag']/0.53);
    // Verify if planet in habitable zone

      if (data[i]['pl_orbsmax'] >= hab_zonemin && data[i]['pl_orbsmax']<=hab_zonemax)
      {
        exoCandidates.push(data[i], hab_zonemax, hab_zonemin);
      }
    }
  }
  **/

  // Add X axis Bottom
  var x = d3.scaleLinear()
  .domain([0,24])
  .range([width,0]);
  svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

  // Add X axis top
  var xtop = d3.scaleLinear()
  .domain([0,24])
  .range([width, 0]);
  svg.append("g")
  .attr("transform", "translate(0," - height + ")")
  .call(d3.axisBottom(xtop));


  // Add Y axis
  var y = d3.scaleLinear()
  .domain([-90, 90])
  .range([height,0]);
  svg.append("g")
  .call(d3.axisLeft(y).ticks(6));
  
  // Add Right Y axis
  var yright = d3.scaleLinear()
  .domain([-90, 90])
  .range([height,0]);
  svg.append("g")
  .attr("transform", "translate("+width+",0)")
  .call(d3.axisRight(yright).ticks(6));

  // Add a scale for bubble size
  var z = d3.scaleLinear()
  .domain([200000, 1310000000])
  .range([ 4, 40]);

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
  var viewsystem = function(d) {
    window.open("https://exoplanetarchive.ipac.caltech.edu/overview/" + d.pl_hostname, "_blank")
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

  //Set circle color based on temperature
  var setColor = function(d) {

    if (d.st_teff<3500)
    {
      return "red";
    }
    else if (d.st_teff>3500 && d.st_teff<5000)
    {
      return "orange";
    }
    else if (d.st_teff>5000 && d.st_teff<6000)
    {
      return "yellow";
    }
    else if (d.st_teff>6000 && d.st_teff<7500)
    {
      return "white";
    }
    else if (d.st_teff>7500 && d.st_teff<11000)
    {
      return "black";
    }    
    else if (d.st_teff>11000 && d.st_teff<25000)
    {
      return "blue";
    }
    else 
    {
      return "black";
    }

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
  .attr("cx", function (d) { return x(d.ra* (1/15)); } ) //1 hour RA = 15 Degrees RA
  .attr("cy", function (d) { return y(d.dec); } )
  .attr("r", 3)
  .style("stroke", "gray")
  .style("stroke-width", 1)
  .style("fill", setColor)
  .style("opacity", 1)
    // -3- Trigger the functions
    .on("click", viewsystem)
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )

  })



