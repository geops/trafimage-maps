/* eslint-disable no-console */
/* eslint-disable no-constant-condition */
/* eslint-disable no-throw-literal */
/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
/* eslint-disable no-empty */
/* eslint-disable no-alert */

/**
 * mapbox-gl behaviour depends on browser configuration, operating system specs and
 * hardware and influences the cavans size calculated in the ExportDialog. In this file we
 * calculate the maximum canvas size to then store it in local storage in order to avoid having
 * to recalculate the maximum canvas every time the ExportDialog is mounted (creates a short,
 * slight lag while calculating)
 * @ignore
 */

const log = false;

// This code comes from this blog: https://www.winski.net/?p=193, https://jsfiddle.net/1sh47wfk/1/
function makeGLCanvas() {
  // Get A WebGL context
  const canvas = document.createElement('canvas');
  const contextNames = ['webgl', 'experimental-webgl'];
  let gl = null;
  for (let i = 0; i < contextNames.length; i += 1) {
    try {
      gl = canvas.getContext(contextNames[i], {
        // Used so that the buffer contains valid information, and bytes can
        // be retrieved from it. Otherwise, WebGL will switch to the back buffer
        preserveDrawingBuffer: true,
      });
    } catch (e) {}
    if (gl != null) {
      break;
    }
  }
  if (gl == null) {
    alert(
      "WebGL not supported.\nGlobus won't work\nTry using browsers such as Mozilla " +
        'Firefox, Google Chrome or Opera',
    );
    // TODO: Expecting that the canvas will be collected. If that is not the case, it will
    // need to be destroyed somehow.
    return null;
  }

  return [canvas, gl];
}

// From Wikipedia
/* function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  if (b > a) {
    const temp = a;
    a = b;
    b = temp;
  }
  while (true) {
    if (b == 0) return a;
    a %= b;
    if (a == 0) return b;
    b %= a;
  }
} */

function isGlContextFillingTheCanvas(gl) {
  try {
    if (log) {
      console.log('size tested:', gl.canvas.width, gl.canvas.height);
    }
    return (
      gl.canvas.width == gl.drawingBufferWidth &&
      gl.canvas.height == gl.drawingBufferHeight
    );
  } catch (e) {
    if (log) {
      console.error(
        'Get max canvas size failed, current size tested:',
        gl.canvas.width,
        gl.canvas.height,
        e,
      );
    }
    return false;
  }
}

// Search with minVal inclusive, maxVal exclusive
function binarySearch(canvas, gl, minVal, maxVal) {
  const interval = (maxVal - minVal) / 2;
  if (minVal == maxVal || interval < 1024) {
    return minVal;
  }

  const middle = Math.floor(minVal + interval);
  canvas.width = middle;
  canvas.height = middle;
  if (log) {
    console.log('binarysearch', middle);
  }

  if (isGlContextFillingTheCanvas(gl)) {
    return binarySearch(canvas, gl, middle, maxVal);
  }
  return binarySearch(canvas, gl, minVal, middle);
}

// (See issue #2) All browsers reduce the size of the WebGL draw buffer for large canvases
// (usually over 4096px in width or height). This function uses a varian of binary search to
// find the maximum size for a canvas given the provided x to y size ratio.
//
// To produce exact results, this function expects an integer ratio. The ratio will be equal to:
// xRatio/yRatio.
function determineMaxCanvasSize() {
  // This function works experimentally, by creating an actual canvas and finding the maximum
  // value, the browser allows.
  const [canvas, gl] = makeGLCanvas();
  const min = 4096;
  const max = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 4096;

  if (min === max) {
    if (log) {
      console.log('Use max texture size', max);
    }
    return max;
  }

  // First find an upper bound.
  canvas.width = min;
  canvas.height = min;
  let upperBound = min;

  while (
    min <= canvas.width &&
    canvas.width <= max &&
    isGlContextFillingTheCanvas(gl)
  ) {
    upperBound *= 2;
    canvas.width = upperBound;
    canvas.height = upperBound;
  }

  if (upperBound >= max) {
    if (log) {
      console.log('Use max texture size', max);
    }
    return max;
  }

  // Get the new lower bound.
  const lowerBound = upperBound / 2;

  // Search for the max size.
  const maxSize = binarySearch(canvas, gl, lowerBound, upperBound);
  if (log) {
    console.log('max canvas size:', maxSize, maxSize);
  }
  return maxSize;
}

export default determineMaxCanvasSize;
