//April 13 log:
//Added picture background of map
//Added click function to each star
//Fixed inverted scale for x and y.
//Added color change on circle depending on star type
//Added zoom functionality
//Added legend
//Implementd Star and Planet Classes
//To do - Habitability Filter, zoom cap, print preview

//----Start ----
//set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 50, left: 50},
width = 780 - margin.left - margin.right,
height = 485.4 - margin.top - margin.bottom;
// append the svg object to the body of the page and enable zoom 
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

//add star map background to svg measurements
var mapimage = svg.append("image")
  .attr("xlink:href","_images/starmap.png")
  .attr("width", width)
  .attr("height", height)

  //Read the planet data
  d3.json("https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=dec,ra,pl_hostname,pl_name,pl_pnum,st_rad,st_teff,st_optmag,st_dist,pl_orbsmax&format=json", function(data) {

  // Declare arrays to store star objects and planet objects
  let _stars = []; //empty stars array
  let _planets = []; //empty planets array
  let entry = {}; //empty object
  let duplicate = false; //duplicates flag

  // Loop for the array elements 
  for (let i in data) { 

    //Creating object from class stars for every star in map.
    if(i<1) {
      entry = new star(data[i]['pl_hostname'],data[i]['ra'],data[i]['dec'],data[i]['st_teff'],data[i]['pl_pnum'],data[i]['st_rad'],data[i]['st_optmag'],data[i]['st_dist']);
      _stars.push(entry);
    } else {
      for (let j in _stars) { //Loop through stars array looking for dupes
        if (_stars[j].getName() == data[i]['pl_hostname']) {
          duplicate = true;
        } else {
          duplicate = false;
        }
      }  
      if (duplicate == false) {
        _stars.push(new star(data[i]['pl_hostname'],data[i]['ra'],data[i]['dec'],data[i]['st_teff'],data[i]['pl_pnum'],data[i]['st_rad'],data[i]['st_optmag'],data[i]['st_dist']));  
      }
    }
  } 

  for (let i in data) { 
    //Creating object from class planets for every planet in map.
    //Duplicate validation
    if (i<1) {
      entry = new planet(data[i]['pl_name'],data[i]['ra'],data[i]['dec'],data[i]['pl_orbsmax']);
      _planets.push(entry);
    } else {
      for (let j in _planets) {
          if (_planets[j].getName() == data[i]['pl_name']) {
            duplicate = true;
          } else {
            duplicate = false;
        }
      }  
      if (duplicate == false){

        entry = new planet(data[i]['pl_name'],data[i]['ra'],data[i]['dec'],data[i]['pl_orbsmax']);
        _planets.push(entry);
      }
    }
  }

  //check habitable planets
  //let k = 0;
  //let habitable =[];
/*  for (let j in _stars) {
    for (let i in _planets) {
      if (_planets[i].getHost() == _stars[j].getName() && _planets[i].getPlDist() != null) {
        if (_planets[i].getPlDist() <= _stars[j].getHabZoneMax() 
          && _planets[i].getPlDist()>= _stars[j].getHabZoneMin()) {
          habitable.push(_planets[i]);

        }
      }
    }
  }*/
//  console.log(habitable);

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
    .html("Name: " + d.getName() + ", " + "Number of Planets: " + d.getPlNum())
    .style("left", (d3.mouse(this)[0]+30) + "px")
    .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var viewsystem = function(d) {
    window.open("https://exoplanetarchive.ipac.caltech.edu/overview/" + d.getName(), "_blank")
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

    return d.getColor();

  }

  // Axis Label x
  svg.append("text")
  .attr("class", "x label")
  .attr("text-anchor", "middle")
  .attr("x", width/2)
  .attr("y", height + 30)
  .text("Right Ascencion (hours)");

  // Axis Label y
  svg.append("text")
  .attr("class", "y label")
  .attr("text-anchor", "middle")
  .attr("y", 6)
  .attr("dy", ".75em")
  .attr("transform", "translate(-50,"+(height/2)+") rotate(-90) ")
  .text("Declination (°)");

//-------------------------------------
  // Declare Legend Constants
  var offset = 30; //separation between labels
  var color = ["red", "orange","yellow","white","lightblue","blue","black"]; // Spectral type colors
  var type = ["M", "K", "G","F","A","B","O"] // Spectral Type Names

  // Add Legend
  for ( let i = 0; i < 7; i++) {
    svg.append("circle")
    .attr("cx",offset*i)
    .attr("cy",height+30)
    .attr("r", 4)
    .style("stroke", "gray")
    .style("stroke-width", 1)
    .style("fill", color[i])
    svg.append("text")
    .attr("x", (offset*i+10))
    .attr("y", height+35)
    .text(type[i])
    .style("font-size", "12px")
    .attr("alignment-baseline","middle")
  } 
//-------------------------------------
  // Add dots
  svg.append('g')
  .selectAll("dot")
  .data(_stars)
  .enter()
  .append("circle")
  .attr("class", "bubbles")
  .attr("cx", function (d) { return x(d.getRA()* (1/15)); } ) //1 hour RA = 15 Degrees RA
  .attr("cy", function (d) { return y(d.getDec()); } )
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



