// Global variables to store circle patterns, circle diameter, and spacing between circles
let patterns = [];
let circleDiameter;
let spacing = 30; // Define space between circles


function setup() {
  // Create a canvas to fit the full window size and set the background color
  createCanvas(windowWidth, windowHeight);
  background('#194973');
  noLoop(); // Prevent p5.js from continuously redrawing the canvas

  circleDiameter = 200; // Define a fixed diameter for the circles

  // Calculate the number of circles that can fit in the canvas width (columns) and height (rows)
  let cols = ceil(width / (circleDiameter + spacing));
  let rows = ceil(height / (circleDiameter + spacing));

  // Loop through the columns and rows to position each circle pattern
  for(let i = 0; i < cols; i++) {
    for(let j = 0; j < rows; j++) {
      // Calculate staggered offset for both x and y positions
      let offsetX = (j % 2) * spacing * 2; // Horizontal staggering
      let offsetY = (i % 2) * spacing * 2; // Vertical staggering

      // Calculate the x and y positions for each circle
      let x = i * (circleDiameter + spacing) + offsetX + circleDiameter / 2;
      let y = j * (circleDiameter + spacing) + offsetY + circleDiameter / 2;
      

      // Generate random colors for the circle and inner shapes
      let color = [random(255), random(255), random(255)];
      let dotColor = [random(255), random(255), random(255)];

      // Store the circle pattern attributes in the patterns array
      patterns.push({
        x: x,
        y: y,
        size: circleDiameter,
        color: color,
        dotColor: dotColor,
        type: int(random(3)), // Randomly select one of three design types
      });
    }
  }

  // Draw each circle pattern on the canvas
  for(let pattern of patterns) {
    drawPattern(pattern);
  }
}


// Function to draw an individual circle pattern
function drawPattern(pattern) {

  // Draw the outer "pearl necklace" chain around each circle with the new pattern
  let outerRadius = pattern.size / 2 + 10; // Define the radius for the pearl chain
  let pearls = [1, 1, 1, 0]; // Define the pattern of pearls (1 small, 1 small, 1 small, 0 large, and so on)
  let pearlIndex = 0;

  let numPearls = TWO_PI * outerRadius / 20;
  for (let i = 0; i < numPearls; i++) {
    let angle = i * TWO_PI / numPearls;
    let pearlX = pattern.x + outerRadius * cos(angle);
    let pearlY = pattern.y + outerRadius * sin(angle);

    if (pearls[pearlIndex] === 1) {
      fill(random(255), random(255), random(255)); // Set the fill color for the small pearls
      ellipse(pearlX, pearlY, 10); // Draw a small pearl
    } else {
      fill(255); // Set the fill color for the large pearls
      ellipse(pearlX, pearlY, 20); // Draw a large pearl
    }

    pearlIndex = (pearlIndex + 1) % pearls.length; // Move to the next pattern element
  }
    
  let numCircle = 5; // Number of circles
  let startRadius = 100; // Initial radius
  let radiusStep = 20; // Decreasing radius
  for(let i = 0; i < numCircle; i++){
    let radius = startRadius - radiusStep * i;
    ellipse(pattern.x, pattern.y, radius * 2);
    fill(random(255), random(255), random(255)); // Set the fill color for the circle
  }
  
  let numShapes = 20;
  for(let i = 0; i < numShapes; i++) {
    for(let j = 0; j < 5; j++){
      let angle = TWO_PI / numShapes * i;
      let shapeX = pattern.x + (pattern.size / 2 - 10 * j) * cos(angle);
      let shapeY = pattern.y + (pattern.size / 2 - 10 * j) * sin(angle);
      fill(pattern.dotColor); // Set the fill color for the inner shapes

      // Depending on the design type, draw either dots, lines, or rings
      if (pattern.type === 0) {
        // Draw five small circles of radius 5 inside each circle and arrange them neatly
        ellipse(shapeX, shapeY, 5);

      } else if(pattern.type === 1) {
        for(let j = 0; j < 5; j ++){
          let angle = TWO_PI / numShapes * i;
          let shapeX1 = pattern.x + (pattern.size / 2 * 0.6 - 10 * j) * cos(angle);
          let shapeY1 = pattern.y + (pattern.size / 2 * 0.6 - 10 * j) * sin(angle);
          fill(pattern.dotColor); // Set the fill color for the inner shapes
          ellipse(shapeX1, shapeY1, 5);
        }
        
        for(let j = 0; j < 5; j ++){
          let angle = TWO_PI / numShapes * i;
          let shapeX2 = pattern.x + (pattern.size / 2 - 5 * j) * cos(angle);
          let shapeY2 = pattern.y + (pattern.size / 2 - 5 * j) * sin(angle);
          fill(pattern.dotColor); // Set the fill color for the inner shapes
          ellipse(shapeX2, shapeY2, 5);
        }

      } else if(pattern.type === 2) {
        for(let j = 0; j < 8; j ++){
          let radius = 6 * j;
          noFill();
          stroke(random(255), random(255), random(255)); // Set the colour of the internal shape stroke
          ellipse(pattern.x, pattern.y, radius);
        }
        stroke(0); // Restore stroke colour
        drawSawtoothRing(pattern.x, pattern.y, pattern.size /3, 20, pattern.size/2*0.35);
      }
    }
  }
}


// Function to handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Resize the canvas to fit the new window size
  background('#194973'); // Clear the canvas with the same background
  setup(); // Recalculate columns and rows
  patterns = []; // Reset Pattern Array
}


function drawSawtoothRing(cx, cy, radius, teeth, toothHeight){
  let angleIncrement = TWO_PI/teeth;

  beginShape();
  for (let i = 0; i < teeth; i++) {
    let angle = i * angleIncrement;
    
    // Inner vertex
    let innerX = cx + (radius - toothHeight) * cos(angle);
    let innerY = cy + (radius - toothHeight) * sin(angle);
    vertex(innerX, innerY);
    
    // Outer vertex
    let outerX = cx + (radius + toothHeight) * cos(angle + angleIncrement / 2);
    let outerY = cy + (radius + toothHeight) * sin(angle + angleIncrement / 2);
    vertex(outerX, outerY);

    noFill(); // Set SawtoothRing to no fill
  }

  endShape(CLOSE);
  fill(random(255), random(255), random(255)); // Restore fill properties of other shapes
}