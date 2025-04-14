// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_PointSize;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_PointSize;;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

// add global vars
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_PointSize;
let currentColor = [1.0, 0.0, 0.0, 1.0];
let currentSize = 10.0;
let currentSegments = 10;
let currentAlpha = 0.7;
let lastPoint = null;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_PointSize
  u_PointSize = gl.getUniformLocation(gl.program, 'u_PointSize');
  if (!u_PointSize) {
    console.log('Failed to get the storage location of u_PointSize');
    return;
  }

}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const BRUSH = 3;


let g_selectedType = POINT;

function setupControls() {
  document.getElementById('redSlider').addEventListener('input', updateColor);
  document.getElementById('greenSlider').addEventListener('input', updateColor);
  document.getElementById('blueSlider').addEventListener('input', updateColor);
  document.getElementById('sizeSlider').addEventListener('input', updateSize);
  document.getElementById('segmentSlider').addEventListener('input', updateSegments); // Add this line
  document.getElementById('alphaSlider').addEventListener('input', updateAlpha); // Add this line

  document.getElementById('clearButton').addEventListener('click', clearCanvas);
  
  document.getElementById('pointButton').onclick = function() {g_selectedType = POINT};
  document.getElementById('triButton').onclick = function() {g_selectedType = TRIANGLE};
  document.getElementById('circleButton').onclick = function() {g_selectedType = CIRCLE};
  document.getElementById('brushButton').onclick = function() {g_selectedType = BRUSH};

  document.getElementById('drawCustomButton').onclick = function() {drawMyCustomDesign()};

  updateColorPreview();
  updateSizePreview();
  updateSegmentsPreview();
  updateAlphaPreview();
}

function updateColor() {
  const r = document.getElementById('redSlider').value / 255;
  const g = document.getElementById('greenSlider').value / 255;
  const b = document.getElementById('blueSlider').value / 255;
  currentColor = [r, g, b, currentAlpha];
  updateColorPreview();
}


function updateColorPreview() {
  const preview = document.getElementById('colorPreview');
  const r = Math.round(currentColor[0] * 255);
  const g = Math.round(currentColor[1] * 255);
  const b = Math.round(currentColor[2] * 255);
  const a = currentAlpha;

  preview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  
  // Update the RGB values display
  document.getElementById('redValue').textContent = r;
  document.getElementById('greenValue').textContent = g;
  document.getElementById('blueValue').textContent = b;
  document.getElementById('alphaValue').textContent = a.toFixed(2);

}

function updateSize() {
  currentSize = parseFloat(document.getElementById('sizeSlider').value);
  updateSizePreview();
}

function updateSizePreview() {
  document.getElementById('sizeValue').textContent = currentSize;
}

function updateSegments() {
  currentSegments = parseInt(document.getElementById('segmentSlider').value);
  updateSegmentsPreview();
}

function updateSegmentsPreview() {
  document.getElementById('segmentValue').textContent = currentSegments;
}

function updateAlpha() {
  currentAlpha = parseFloat(document.getElementById('alphaSlider').value);
  updateAlphaPreview();
}

function updateAlphaPreview() {
  document.getElementById('alphaValue').textContent = currentAlpha.toFixed(2);
  updateColorPreview();
}


function clearCanvas() {
  g_shapesList = [];
  renderAllShapes();
}


function main() {

  setupWebGL();
  connectVariablesToGLSL();
  setupControls();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) {if(ev.buttons ==  1) {click(ev)}};
  canvas.onmouseup = handleMouseUp;
  canvas.onmouseleave = handleMouseUp;

  // alpha blending
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];

function click(ev) {
  [x,y] = convertCoordinatesEventToGL(ev);

  if (g_selectedType==POINT) {
    point = new Point();
  } else if (g_selectedType==TRIANGLE) {
    point = new Triangle();
  } else if (g_selectedType==CIRCLE) {
    point = new Circle();
    point.segments = currentSegments;
  } else {
    let brush = new Brush();
    brush.position = [x, y];
    brush.color = currentColor.slice();
    brush.size = currentSize;
    brush.alpha = currentAlpha;
    
    if (lastPoint && ev.buttons == 1) {
      brush.previousPosition = lastPoint;
    }
    
    lastPoint = [x, y];
    
    g_shapesList.push(brush);
    renderAllShapes();
    return;
  }

  point.position = [x,y];
  point.color = currentColor;
  point.size = currentSize;
  g_shapesList.push(point);
  
  renderAllShapes();
}

function handleMouseUp() {
  lastPoint = null;
}
 
function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function renderAllShapes() {
  // Clear <canvas>
  var startTime = performance.now()
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: "+ len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot")
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}
