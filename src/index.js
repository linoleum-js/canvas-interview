import { throttle } from 'lodash';

import points from '../data/points';

/**
 * I decided not to over-engineer so didn't use classes
 * or other means of encapsulation/decomposition.
 * 
 * In a real project though, I don't write code like that
 * (i.e. global variables etc) 
 **/

const viewportWidth = 500;
const viewportHeight = 500;
const circleRadius = 5;
const padding = 10;

const circleColor = '#777';
const bgColor = '#fff';

let viewportOffsetX = 0;
let viewportOffsetY = 0;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = viewportWidth;
canvas.height = viewportHeight;

const clearCanvas = function () {
  ctx.fillStyle = bgColor;
  ctx.clearRect(0, 0, viewportWidth, viewportHeight);
};

// assuming all coordinates are positive
const getFieldSize = function () {
  let fieldWidth = 0;
  let fieldHeight = 0;
  points.forEach(({ x, y }) => {
    if (x > fieldWidth) {
      fieldWidth = x;
    }
    if (y > fieldHeight) {
      fieldHeight = y;
    }
  });
  return {
    fieldWidth: fieldWidth + circleRadius + padding,
    fieldHeight: fieldHeight + circleRadius + padding
  };
};

const { fieldWidth, fieldHeight } = getFieldSize();

const drawCircle = function ({ x, y }) {
  ctx.fillStyle = circleColor;
  ctx.beginPath();
  ctx.arc(x - viewportOffsetX, y - viewportOffsetY, circleRadius, 0, Math.PI * 2);
  ctx.fill();
};

const isInViewport = function ({ x, y }) {
  return x >= viewportOffsetX && x <= viewportOffsetX + viewportWidth &&
    y >= viewportOffsetY && y <= viewportOffsetY + viewportHeight;
};

const drawCircles = function () {
  points.forEach((point) => {
    if (isInViewport(point)) {
      drawCircle(point);
    }
  });
};

const redrawViewport = function () {
  clearCanvas();
  drawCircles();
};

let isMouseDown = false;
let lastXPosition;
let lastYPosition;
canvas.addEventListener('mousedown', (event) => {
  const { pageX, pageY } = event;
  lastXPosition = pageX;
  lastYPosition = pageY;
  isMouseDown = true;
});
document.addEventListener('mouseup', () => {
  isMouseDown = false;
});

const onMouseMove = (event) => {
  if (!isMouseDown) {
    return;
  }
  const { pageX, pageY } = event;
  const diffX = pageX - lastXPosition;
  const diffY = pageY - lastYPosition;
  lastXPosition = pageX;
  lastYPosition = pageY;
  let newViewportOffsetX = viewportOffsetX - diffX;
  let newViewportOffsetY = viewportOffsetY - diffY;

  // check boundaries
  if (newViewportOffsetX < 0) {
    newViewportOffsetX = 0;
  }
  if (newViewportOffsetX > fieldWidth - viewportWidth) {
    newViewportOffsetX = fieldWidth - viewportWidth;
  }
  if (newViewportOffsetY > fieldHeight - viewportHeight) {
    newViewportOffsetY = fieldHeight - viewportHeight;
  }
  if (newViewportOffsetY < 0) {
    newViewportOffsetY = 0;
  }
  
  viewportOffsetX = newViewportOffsetX;
  viewportOffsetY = newViewportOffsetY;

  redrawViewport();
};

document.addEventListener('mousemove', throttle(onMouseMove, 50));

redrawViewport();
