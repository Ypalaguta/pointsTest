/**
 * Created by ypalaguta on 23.02.2016.
 */

"use strict";

//formula is true for square but not for rectangle
//we need execute deaw on last element
//we need 2nd buffer for canvas

//we need pre-calculated position
//off random when path ends
//append delay paramether for delayed point start
//we need new init points function

//init main variables
/*
 var canvas = document.getElementById('mainCanvas');     //canvas object
 var canvasBack = document.getElementById('canvasBG');   //canvas background object
 var canvasContext = canvas.getContext('2d');            //context of canvas
 var pointIncrement = 50;                                 //point size multiplier (5-mean at end of path point will increased for 500%)
 var pointsPerAnim = 3000;                                  //how much points we want send in 1 animation
 var globalPointNumber = 0;                              //variable for sendPoint
 var framesPerAnimation = 30;                           //how much times we want redraw canvas in 1 animation
 var pointSize = 0.5;
 */
// funny config
var canvas = document.getElementById('mainCanvas');     //canvas object
var canvasBack = document.getElementById('canvasBG');   //canvas background object
var canvasBuffer = document.createElement('canvas');   //canvas buffer object
var canvasContext = canvas.getContext('2d');            //context of canvas
var bufferContext = canvasBuffer.getContext('2d');            //context of buffer
var pointIncrement = 10;                                 //point size multiplier (5-mean at end of path point will increased for 500%)
var pointsPerAnim = 5000;                                  //how much points we want send in 1 animation
var globalPointNumber = 0;                              //variable for sendPoint
var framesPerAnimation = 20;                           //how much times we want redraw canvas in 1 animation
var pointSize = 0.5;
var doubleBuffered=false;

var _framesPerSecond = 1;                               //how much times we will redraw canvas in 1 second (auto evaluated)
var _pointSizeStep = 0;                                 //step of point increase per recalculate (auto evaluated)


var points = [];                                        //massive of points
var pageHeight;                                         //window.height
var pageWidth;                                          //window.width
var canvHalfHeight;                                     //canvas.height/2
var canvHalfWidth;                                      //canvas.width/2
var tempSize;                                           //temporary variable
var currentX;
var currentY;
var randTo=(pointsPerAnim>1000)?1000:pointsPerAnim;
//calculate top/left margins for canvas and black-background block

var canvasPosition = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasBack.style.width = canvas.width + 'px';
    canvasBack.style.height = canvas.height + 'px';
    canvasBuffer.width = window.innerWidth;
    canvasBuffer.height = window.innerHeight;

    canvHalfHeight = canvas.height / 2;
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

    currentX=canvas.width / (pointsPerAnim/4);
    currentY=canvas.height / (pointsPerAnim/4);

};

//append recalculating of canvas position when window resized
//append run function when page loaded

window.addEventListener('load', run);
window.addEventListener('resize', function () {
    location.reload();
});


//temporary function

function drawPoints() {
    var ourContext=(doubleBuffered)?bufferContext:canvasContext;
    clearCanvas(ourContext);
    for (var i = 0; i < points.length; i++) {
        ourContext.beginPath();
        ourContext.arc(points[i].tempX, points[i].tempY, points[i].pointSize, 0, 2 * Math.PI, false);
        //   canvasContext.arc(5, canvHalfHeight, 5, 0, 2 * Math.PI, false);
        ourContext.fillStyle = points[i].fillColor || '#ffffff';
        ourContext.fill();
    }
    if(doubleBuffered){
    var imgData=bufferContext.getImageData(0,0,canvas.width,canvas.height);
    ourContext.putImageData(imgData,0,0);
    }
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
            tempX: canvHalfWidth,
            tempY: canvHalfHeight,
            stepX: 0,
            stepY: 0,
            pointSize: pointSize,
            delay:0,
        });
        sendPoint(i);

    }

    //init step point
    _pointSizeStep = (pointSize * pointIncrement) / framesPerAnimation;

}

//calculate point direction and other stats
//create interval which will change point position and size every *frame second
//this function is not drawing points

function sendPoint(pointNumber) {
    pointNumber = pointNumber;
    var current = points[pointNumber];

var curPoint;


    if(pointNumber<=pointsPerAnim/4){
        curPoint=pointNumber;
        current.destinationX = 0 + currentX * curPoint;
        current.destinationY = canvas.height;

     }
    else if(pointNumber<=(pointsPerAnim/2)){
        curPoint=pointNumber-(pointsPerAnim-Math.round(pointsPerAnim/4*3));
        current.destinationX = canvas.width;
        current.destinationY = 0 + currentY * curPoint;
    }
    else if(pointNumber<=(pointsPerAnim/4)*3){

        curPoint=pointNumber-Math.round(pointsPerAnim/2);
        current.destinationX = 0;
        current.destinationY = 0 + currentY * curPoint;
    }
    else {
        curPoint=pointNumber-(pointsPerAnim-Math.round(pointsPerAnim/4));
        current.destinationX = 0 + currentX * curPoint;
        current.destinationY = 0;
    }

    current.stepX = ((current.destinationX-current.startX)/framesPerAnimation);
    current.stepY = ((current.destinationY-current.startY)/framesPerAnimation);


  current.delay=extRandom(2,randTo);

}

//clear canvas from points

function clearCanvas(context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

//just function to get random number

function extRandom(from, to) {
    return Math.floor((Math.random() * to) + from);
}

//run our application

function pointIncAll(){
    requestAnimationFrame(pointIncAll);
    for (var i = 0; i < points.length; i++) {
        var current = points[i];
        if (current.delay <= 0) {
            current.tempX += current.stepX;
            current.tempY += current.stepY;
            current.pointSize += _pointSizeStep;

            if ((current.tempX >= current.destinationX && current.tempY >= current.destinationY)&&
                (current.stepX>0&&current.stepY>0)||
                current.tempX < 0 || current.tempY < 0) {
                //   clearInterval(this.ownTimeout);

                current.tempX = current.startX;
                current.tempY = current.startY;
                current.pointSize = pointSize;

            }
        }
        else
        {
            current.delay-=20;
        }

    }
 drawPoints();
}
/*
function pointIncFunc() {
    if (this.firstTime) {
        this.firstTime = 0;
        clearTimeout(this.ownTimeout);
        var a = this;
        this.ownTimeout = setInterval(function () {
            pointIncFunc.call(a)
        }, 100);
    }

    this.tempX += this.stepX;
    this.tempY += this.stepY;
    this.pointSize += _pointSizeStep;

    if (this.tempX >= this.destinationX && this.tempY >= this.destinationY ||
        this.tempX < 0 || this.tempY < 0) {
        //   clearInterval(this.ownTimeout);
        this.tempX = this.startX;
        this.tempY = this.startY;
        this.pointSize = pointSize;
    }
  //  if(this.last)
    //    drawPoints();

}
*/

function quad(progress) {
    return Math.pow(progress, 2)
}

function run() {
    canvasPosition();
    setPoints();
    pointIncAll();
  //  setInterval(drawPoints,10);
   // console.log(points);
}