// Global variables to store circle patterns, circle diameter, and spacing between circles
let song;
let fft;
let patterns = [];
let circleDiameter;
let spacing = 30; // Define space between circles
let angle = 0; 


function preload() {
  song = loadSound('audio/Bless_This_Space.mp3');
}


function setup() {
  fft = new p5.FFT();
  // Create a canvas to fit the full window size and set the background color
  createCanvas(windowWidth, windowHeight);
  background('#0D0D0D');

  circleDiameter = 300; // Define a fixed diameter for the circles

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
      let color = [(50), random(255), random(150,255)];
      let dotColor = [(50), random(255), random(150,255)];

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

// Draw animation
function draw() {
  background('#0D0D0D'); // Clear the canvas
  let spectrum = fft.analyze(); // Get the frequency spectrum
  let bass = fft.getEnergy(20,800); 
  
  // Map the bass frequency energy to a range for the outerRadius
  let dynamicRadius = map(bass, 0, 255, circleDiameter / 2, circleDiameter*1.2); // Adjusted max limit
  dynamicRadius = constrain(dynamicRadius, circleDiameter / 2, circleDiameter*1.2); // Ensure it stays within limits



  // Check if the song is playing before updating the angle for rotation
  if (song.isPlaying()) {
    angle += 0.05; // Increase the angle for rotation only if the song is playing

    // Update the colors of the patterns if the song is playing
    for (let pattern of patterns) {
      pattern.dotColor = [(50), random(255), random(150,255)];
    }
  }

  // Draw each circle pattern with the current angle and possibly updated colors
  for (let pattern of patterns) {
    push(); // Save the current drawing state
    translate(pattern.x, pattern.y); // Move the origin to the circle's center
    if (song.isPlaying()) {
      rotate(angle); // Rotate the grid only if the song is playing
    }
    drawPattern(pattern,dynamicRadius); // Draw the pattern with updated colors
    pop(); // Restore the original drawing state
  }
}

function drawPattern(pattern,dynamicRadius) {
  
  let numPearls = TWO_PI * dynamicRadius / 25; // The number of pearls is based on the circumference
  // Amplify the effect of the frequency energy
  let bassEnergy = fft.getEnergy(20, 140); // Get the energy of the bass frequencies
  let amplifiedEnergy = pow(bassEnergy, 2.5); // Raise the energy to the power of 2.5 to make the change more drastic
  // Map the amplified energy to a usable size for the outerRadius
  let newOuterRadius = map(amplifiedEnergy, 0, pow(255, 2.5), circleDiameter / 2, circleDiameter * 1.2);
  
  // Ensure the newOuterRadius does not exceed the maximum or minimum limits
  newOuterRadius = constrain(newOuterRadius, circleDiameter / 2, circleDiameter * 1.2);

  for (let i = 0; i < numPearls; i++) {
    let angle = i * TWO_PI / numPearls;
    let pearlX = newOuterRadius * cos(angle);
    let pearlY = newOuterRadius * sin(angle);

    
    fill(pattern.dotColor); // Set the fill color for the small pearls
    ellipse(pearlX, pearlY, 10); // Draw a small pearl
   
  }

  let numCircle = 5; // Number of circles
  let startRadius = newOuterRadius/2.2; // Initial radius
  let radiusStep = newOuterRadius/10; // Decreasing radius
  for(let i = 0; i < numCircle; i++){
    let radius = startRadius - radiusStep * i;
    ellipse(0, 0, radius * 2);
    fill(pattern.color); // Set the fill color for the circle
  }

  let numShapes = 20;
  for(let i = 0; i < numShapes; i++) {
    for(let j = 0; j < 5; j++){
      let angle = TWO_PI / numShapes * i;
      let shapeX = (pattern.size / 2 - 10 * j) * cos(angle);
      let shapeY = (pattern.size / 2 - 10 * j) * sin(angle);
      fill(pattern.dotColor); // Set the fill color for the inner shapes

      // Depending on the design type, draw either dots, lines, or rings
      if (pattern.type === 0) {
        ellipse(shapeX, shapeY, 5);

      } else if(pattern.type === 1) {
        for(let i = 0; i < numShapes; i++) {
          let angle = TWO_PI / numShapes * i;
          let innerRadius = pattern.size / 2 * 0.6;
          for(let j = 0; j < 5; j++){
            let shapeX = innerRadius * cos(angle) - 10 * j * cos(angle);
            let shapeY = innerRadius * sin(angle) - 10 * j * sin(angle);
            fill(pattern.dotColor);
            ellipse(shapeX, shapeY, 5);
          }
        }

      } else if(pattern.type === 2) {
        for(let j = 0; j < 8; j++){
          let radius = 6 * j;
          noFill();
          stroke(pattern.dotColor); // Set the stroke color for the rings
          ellipse(0, 0, radius); // Draw the rings centered around the new origin (0,0)
        }
        stroke(pattern.color); // Reset the stroke color for other shapes
      
        // Now draw the sawtooth ring, still around (0,0)
        drawSawtoothRing(0, 0, newOuterRadius/2.5, 20, newOuterRadius/2.5 * 0.35);
      }
    }
  }

  if (pattern.type === 2) {
    drawSawtoothRing(0, 0, newOuterRadius/2.5, 20, newOuterRadius/2.5 * 0.35);
  }
}

// The drawSawtoothRing function should also be updated to draw around the origin
function drawSawtoothRing( newOuterRadius,radius, teeth, toothHeight){
  let angleIncrement = TWO_PI / teeth;
  beginShape();
  for (let i = 0; i < teeth; i++) {
    let angle = i * angleIncrement;
    
    // Inner vertex
    let innerX = (radius - toothHeight) * cos(angle);
    let innerY = (radius - toothHeight) * sin(angle);
    vertex(innerX, innerY);
    
    // Outer vertex
    let outerX = (newOuterRadius + toothHeight) * cos(angle + angleIncrement / 2);
    let outerY = (newOuterRadius + toothHeight) * sin(angle + angleIncrement / 2);
    vertex(outerX, outerY);
  }
  endShape(CLOSE);
}

// Function to handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Resize the canvas to fit the new window size
  background('#0D0D0D'); // Clear the canvas with the same background
  setup(); // Recalculate columns and rows
  patterns = []; // Reset Pattern Array
  loop();
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
  fill((50), random(255), random(150,255)); // Restore fill properties of other shapes
}

function mousePressed() {
  if (song.isPlaying()) {
    song.pause(); // Pause the song if it is playing
  } else {
    song.loop(); // Play the song if it is not playing
  }
}
