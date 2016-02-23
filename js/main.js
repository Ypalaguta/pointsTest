/**
 * Created by ypalaguta on 23.02.2016.
 */

//init main variables

var canvas = document.getElementById('mainCanvas');     //canvas object
var canvasBack = document.getElementById('canvasBG');   //canvas background object
var canvasContext = canvas.getContext('2d');            //context of canvas
var pointIncrement = 5;                                 //point size multiplier (5-mean at end of path point will increased for 500%)
var pointsPerAnim = 10;                                  //how much points we want send in 1 animation
var globalPointNumber = 0;                              //variable for sendPoint
var framesPerAnimation = 500;                           //how much times we want redraw canvas in 1 animation
var pointSize = 1;


var _framesPerSecond = 1;                               //how much times we will redraw canvas in 1 second (auto evaluated)
var _pointSizeStep = 0;                                        //step of point increase per recalculate (auto evaluated)


var points = [];                                        //massive of points
var pageHeight;                                         //window.height
var pageWidth;                                          //window.width
var canvHalfHeight;                                     //canvas.height/2
var canvHalfWidth;                                      //canvas.width/2
var tempSize;                                           //temporary variable

//calculate top/left margins for canvas and black-background block

var canvasPosition = function () {
    canvHalfHeight = canvas.clientHeight / 2;
    canvHalfWidth = canvas.width / 2;
    pageHeight = window.innerHeight;
    pageWidth = window.innerWidth;
    tempSize = pageHeight - canvas.height;
    tempSize = ((tempSize > 0) ? (tempSize / 2) : 0) + 'px'
    canvas.style.marginTop = tempSize;
    canvasBack.style.marginTop = tempSize;

    tempSize = pageWidth - canvas.width;
    tempSize = ((tempSize > 0) ? (tempSize / 2) : 0) + 'px';
    canvas.style.marginLeft = tempSize;
    canvasBack.style.marginLeft = tempSize;
};

//append recalculating of canvas position when window resized
//append run function when page loaded

window.addEventListener('resize', canvasPosition);
window.addEventListener('load', run);


//temporary function

function initPoints() {
    canvasContext.beginPath();
    canvasContext.arc(canvHalfWidth, canvHalfHeight, 1, 0, 2 * Math.PI, false);
    canvasContext.arc(5, canvHalfHeight, 5, 0, 2 * Math.PI, false);
    canvasContext.fillStyle = '#ffffff';
    canvasContext.fill();
}

//create point object and push it to points massive

function setPoints() {
    for (var i = 0; i < pointsPerAnim; i++) {
        points.push({
            size: pointSize,
            startX: canvHalfWidth,
            startY: canvHalfHeight,
            destinationX: 0,
            destinationY: 0,
            stepX: 0,
            stepY: 0,
            incCoord: 'x',
            incPerPixels: 'x',
            ownTimeout: ''
        });
        sendPoint();
    }

    //init step point
    _pointSizeStep = (pointSize * pointIncrement) / framesPerAnimation;

}

//calculate point direction and other stats
//create interval which will change point position and size every *frame second
//this function is not drawing points

function sendPoint(pointNumber) {
    pointNumber = pointNumber || globalPointNumber;
    var longerLine;
    var current = points[pointNumber];

    current.destinationX = extRandom(0, canvas.width);
    current.destinationY = extRandom(0, canvas.height);

    longerLine = (current.destinationY < current.destinationX) ? current.destinationX : current.destinationY;
    current.stepsCount = longerLine;

    //set point moving step

    if (current.destinationX == 0 || current.destinationX == canvas.width) {
        current.stepX = (Math.pow(current.destinationX, 2) + Math.pow(current.destinationY, 2)) / framesPerAnimation;
        current.stepY = +(current.stepX * current.destinationY / canvas.height).toFixed(2);
        incCoord=1;
    }
    else {
        current.stepY = (Math.pow(current.destinationX, 2) + Math.pow(current.destinationY, 2)) / framesPerAnimation;
        current.stepX = +(current.stepY * current.destinationX / canvas.width).toFixed(2);
        incCoord=0;
    }

globalPointNumber++;

}

//clear canvas from points

function clearCanvas() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}

//just function to get random number

function extRandom(from, to) {
    return Math.floor((Math.random() * to) + from);
}

//run our application

function run() {
    canvasPosition();
    initPoints();
}