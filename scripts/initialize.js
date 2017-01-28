var SVG_HEIGHT = 800;
var SVG_WIDTH = 1000;

var FIELD_RESOLUTION_DEFAULT = 20;
var FIELD_RESOLUTION;
var FIELD_RESOLUTION_MAX = 100;
var FIELD_RESOLUTION_MIN = 10;

var P_RED;
var P_RED_DEFAULT = 0.5;


var GRID_OPACITY;
var GRID_OPACITY_DEFAULT = 0.75;


var show_grid = true;

var training_data;
var field_data;

var BLACK = "#000000";
var BLUE = "#ccb3ff";
var RED = "#ff4d4d";
var INDETERMINED_COLOR = "#80ff80";

var data_stroke_on;
var data_stroke_on_default = true;

var red_data, blue_data;
var red_x, red_y, blue_x, blue_y;

var DATA_POINT_R_DEFAULT = 10;
var DATA_POINT_R;
var DATA_POINT_R_MIN = 5;
var DATA_POINT_R_MAX = 20;
var FIELD_DATA_R;
var FIELD_DATA_R_DEFAULT = 4;



var PADDING_X = SVG_WIDTH * 0.1;
var PADDING_Y = SVG_HEIGHT * 0.1;

var N;
var N_DEFAULT = 40;
var N_min = 3;
var N_max = 100;

var K;
var K_DEFAULT = 6;
var K_min = 1;
var K_max = 10;

var mainContainer, mainControlsContainter, infoContainer, controlsContainter, KNNContainer, SVGContainer;



var SVG_front_layer, SVG_back_layer, SVG_tooltip_layer, SVG_tooltip_bottom_layer;

  

d3.selection.prototype.moveToFront = function() 
{
  return this.each(function()
        {
          this.parentNode.appendChild(this);
        });
};


function setupControlsContainer()
{
  mainControlsContainter = mainContainer.append("div").attr("id", "controls_container");
  
  // Info container
  infoContainer = mainControlsContainter.append("div").attr("id", "info_container");
  // Controls Header
  infoContainer.attr("id", "controls_header").append("h1").html("KNN")
  
  // Controls Body
  infoContainer.attr("id", "controls_body").append("p").html("...")
  
  
  // Setup Controller container
  controlsContainter = mainControlsContainter.append("div").attr("id", "input_container");
  
  
  // Create Container for test data generation
  var testDataContainer = controlsContainter.append("div").attr("id", "test_data_controller");
  
  // Set value of N
  testDataContainer.append("p")
                      .html("Test Points, N: ")
                   .append("input")
                      .attr("type", "number")
                      .attr("min", N_min)
                      .attr("max", N_max)
                      .attr("step", 1)
                      .attr("value", N)
                      .on("change", function()
                      {
                        this.value = (this.value < N_min) ? N_min : this.value;
                        this.value = (this.value > N_max) ? N_max : this.value;
                        N = this.value;
                      });
  
  
  // Set values of R proportion
  testDataContainer.append("p")
                      .html("Proportion Red: ")
                    .append("input")
                      .attr("type", "range")
                      .attr("value", P_RED)
                      .attr("min", 0)
                      .attr("max", 1)
                      .attr("step", 0.005)
                      .style("width", "200px")
                      .on("change", function()
                      {
                        P_RED = this.value;
                      });

              
  
  // Set value of K
  testDataContainer.append("p")
                      .html("K value: ")
                    .append("input")
                      .attr("type", "range")
                      .attr("value", K)
                      .attr("min", K_min)
                      .attr("max", K_max)
                      .attr("step", 1)
                      .style("width", "200px")
                      .on("change", function()
                      {
                        // Check entered value against K constraints
                        this.value = (this.value < K_min) ? K_min : this.value;
                        this.value = (this.value > K_max) ? K_max : this.value;
                        
                        K = this.value;
                        resetKHeader();
                        
    
                        
                        generateField();
                        
                        if (show_grid)
                        {
                          d3.selectAll(".field_circles").transition()
                                .duration(1500)
                                .attr("r", 0);
                          
                          plotField();
                        }
                        
                        
                      });
  
  
  
  
  
  // Set values of radius
  testDataContainer.append("p")
                      .html("Circle Radii: ")
                    .append("input")
                      .attr("type", "range")
                      .attr("value", DATA_POINT_R)
                      .attr("min", DATA_POINT_R_MIN)
                      .attr("max", DATA_POINT_R_MAX)
                      .attr("step", 1)
                      .style("width", "200px")
                      .on("change", function()
                      {
                        this.value = (this.value < 1) ? 1 : this.value;
                        DATA_POINT_R = this.value;
    
                        var circles = d3.selectAll(".circles")
                        
                        circles.transition()
                                 .duration(500)
                                 .attr("r", DATA_POINT_R)
                                  .ease("elastic");
                      });
  
  // Show Grid Button
  testDataContainer.append("p")
                      .html("Show Grid: ")
                   .append("input")
                      .attr("type", "checkbox")
                      .attr("id", "show_grid_button")
                      .attr("value", show_grid)
                      .property("checked", true)
                      .on("click", function()
                      {
                        show_grid = this.checked
                        if (show_grid)
                        {
                          d3.selectAll(".field_circles").remove();
                          d3.selectAll(".circles").remove();
                          
                          plotField();
                          plotTestData();
                        }
                        else
                        {
                          console.log("HERE");
                          d3.selectAll(".field_circles")
                              .transition()
                                .duration(500)
                                .style("opacity", 0);
                        }
                      });
  
  // Grid opacity
  testDataContainer.append("p")
                      .html("Grid Opacity: ")
                    .append("input")
                      .attr("type", "range")
                      .attr("value", GRID_OPACITY)
                      .attr("min", 0)
                      .attr("max", 1)
                      .attr("step", 0.005)
                      .style("width", "200px")
                      .on("change", function()
                      {
                        GRID_OPACITY = this.value;
    
                        var circles = d3.selectAll(".field_circles")
                        
                        circles.transition()
                                 .duration(500)
                                 .style("opacity", GRID_OPACITY)
                                  .ease("cubic", .5);
                      });

  // Grid Resolution
  testDataContainer.append("p")
                      .html("Grid Resolution: ")
                    .append("input")
                      .attr("type", "range")
                      .attr("value", FIELD_RESOLUTION)
                      .attr("min", FIELD_RESOLUTION_MIN)
                      .attr("max", FIELD_RESOLUTION_MAX)
                      .attr("step", 10)
                      .style("width", "200px")
                      .on("change", function()
                      {
                        FIELD_RESOLUTION = this.value;
                        
    
                        if (FIELD_RESOLUTION < 50)
                        {
                          data_stroke_on = true;
                          FIELD_DATA_R = FIELD_DATA_R_DEFAULT * 1.5;
                        }
                        else
                        {
                          FIELD_DATA_R = FIELD_DATA_R_DEFAULT;
                        }
                        
                        if (FIELD_RESOLUTION >= 80)
                        {
                          data_stroke_on = false;
                        }
    
                        resetSVGContainer();
                        
                        generateData();
                        generateField();
    
                        if (show_grid)
                        { 
                          plotField();
                        }
                        plotTestData();
    
    
                    
                      });
  
  // Generate test data Button
  testDataContainer.append("input")
                      .attr("type", "button")
                      .attr("id", "generate_data_button")
                      .attr("value", "Generate Test Data!")
                      .on("click", function()
                      {
                        start();
                      });
  
  
  // Reset Button
  testDataContainer.append("input")
                      .attr("type", "button")
                      .attr("value", "Reset!")
                      .on("click", function()
                      {
                        resetSVGContainer();
                      });
}


function resetSVGContainer()
{
  d3.select("#knn_container").remove()
  setupKNNContainer();
}

function setupKNNContainer()
{
  var background;
  
  KNNContainer = mainContainer.append("div").attr("id", "knn_container");
  
  SVGContainer = KNNContainer.append("svg")
                                .attr("id", "svg_container")
                                .attr("height", SVG_HEIGHT)
                                .attr("width", SVG_WIDTH);
  
  background = SVGContainer.append("svg:rect")
                                  .attr("id", "svg_background")
                                  .attr("height", SVG_HEIGHT)
                                  .attr("width", SVG_WIDTH)
                                  .style("fill", "#f2f2f2")
                                  .style("stroke", "black")
                                  .style("stroke-width", 2)
  
  
  
  
  SVG_tooltip_bottom_layer = SVGContainer.append('g').attr("id", "tooltip_bottom_layer");
  SVG_tooltip_layer = SVGContainer.append('g').attr("id", "tooltip_layer");
  SVG_back_layer = SVGContainer.append('g'); 
  SVG_front_layer = SVGContainer.append('g');
  
  
  SVGContainer.append("text")
                .attr("id", "K_title")
                .attr("x", 5)
                .attr("y", 20)
                .text(function() { return "K = " + K; })
  
  SVGContainer.append("svg:circle")
                  .attr("cx", SVG_WIDTH*0.15)
                  .attr("cy", SVG_HEIGHT*0.04 + DATA_POINT_R)
                  .attr("r", DATA_POINT_R*1.5)
                  .style("stroke", BLACK)
                  .style("fill", RED);
  
  SVGContainer.append("text")
                  .attr("x", SVG_WIDTH*0.18)
                  .attr("y", SVG_HEIGHT*0.044 + DATA_POINT_R)
                  .text("Red Class");
  
  SVGContainer.append("svg:circle")
                  .attr("cx", SVG_WIDTH*0.35)
                  .attr("cy", SVG_HEIGHT*0.04 + DATA_POINT_R)
                  .attr("r", DATA_POINT_R*1.5)
                  .style("stroke", BLACK)
                  .style("fill", BLUE);
  
  SVGContainer.append("text")
                  .attr("x", SVG_WIDTH*0.38)
                  .attr("y", SVG_HEIGHT*0.044 + DATA_POINT_R)
                  .text("Purple Class");
  
  
  SVGContainer.append("svg:circle")
                  .attr("cx", SVG_WIDTH*0.55)
                  .attr("cy", SVG_HEIGHT*0.04 + DATA_POINT_R)
                  .attr("r", DATA_POINT_R*1.5)
                  .style("stroke", BLACK)              
                  .style("fill", INDETERMINED_COLOR);
  
  SVGContainer.append("text")
                  .attr("x", SVG_WIDTH*0.58)
                  .attr("y", SVG_HEIGHT*0.044 + DATA_POINT_R)
                  .text("Indeterminable");
}




function initialize_containers()
{
  mainContainer = d3.select("body").append("div").attr("id", "main_container");
  setupControlsContainer();
  setupKNNContainer();  
}



function resetKHeader()
{
  d3.select("#K_title").text( function() { return "K = " + K;} );
}



function initializeVariables()
{
  data_stroke_on = data_stroke_on_default;
  N = N_DEFAULT;
  K = K_DEFAULT;
  DATA_POINT_R = DATA_POINT_R_DEFAULT;
  P_RED = P_RED_DEFAULT;
  GRID_OPACITY = GRID_OPACITY_DEFAULT;
  FIELD_RESOLUTION = FIELD_RESOLUTION_DEFAULT;
  
  FIELD_DATA_R = FIELD_DATA_R_DEFAULT
  if (FIELD_RESOLUTION < 50)
  {
    FIELD_DATA_R = FIELD_DATA_R * 1.5;
  }
}

function start()
{
  resetSVGContainer();
  generateData();
  generateField();

  if (show_grid)
  { 
    plotField();
  }
  plotTestData();
}

function initialize()
{
  initializeVariables();
  initialize_containers();
  start();
}