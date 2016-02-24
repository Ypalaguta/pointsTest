/**
 * Created by ypalaguta on 23.02.2016.
 */

"use strict";

//init main variables

var canvas = document.getElementById('mainCanvas');     //canvas object
var canvasBack = document.getElementById('canvasBG');   //canvas background object
var canvasContext = canvas.getContext('2d');            //context of canvas
var pointIncrement = 50;                                 //point size multiplier (5-mean at end of path point will increased for 500%)
var pointsPerAnim = 1000;                                  //how much points we want send in 1 animation
var globalPointNumber = 0;                              //variable for sendPoint
var framesPerAnimation = 100;                           //how much times we want redraw canvas in 1 animation
var pointSize = 0.5;

/* funny config
 var canvas = document.getElementById('mainCanvas');     //canvas object
 var canvasBack = document.getElementById('canvasBG');   //canvas background object
 var canvasContext = canvas.getContext('2d');            //context of canvas
 var pointIncrement = 150;                                 //point size multiplier (5-mean at end of path point will increased for 500%)
 var pointsPerAnim = 500;                                  //how much points we want send in 1 animation
 var globalPointNumber = 0;                              //variable for sendPoint
 var framesPerAnimation = 200;                           //how much times we want redraw canvas in 1 animation
 var pointSize = 1;
*/

var _framesPerSecond = 1;                               //how much times we will redraw canvas in 1 second (auto evaluated)
var _pointSizeStep = 0;                                 //step of point increase per recalculate (auto evaluated)


var points = [];                                        //massive of points
var pageHeight;                                         //window.height
var pageWidth;                                          //window.width
var canvHalfHeight;                                     //canvas.height/2
var canvHalfWidth;                                      //canvas.width/2
var tempSize;                                           //temporary variable

//calculate top/left margins for canvas and black-background block

var canvasPosition = function () {
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    canvasBack.style.width=canvas.width+'px';
    canvasBack.style.height=canvas.height+'px';

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

};

//append recalculating of canvas position when window resized
//append run function when page loaded

window.addEventListener('load', run);
window.addEventListener('resize', function(){location.reload();});


//temporary function

function drawPoints() {
    clearCanvas();
    for(var i = 0; i < points.length; i++){
    canvasContext.beginPath();
    canvasContext.arc(points[i].tempX, points[i].tempY, points[i].pointSize, 0, 2 * Math.PI, false);
 //   canvasContext.arc(5, canvHalfHeight, 5, 0, 2 * Math.PI, false);
    canvasContext.fillStyle = points[i].fillColor||'#ffffff';
    canvasContext.fill();
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
            tempX:canvHalfWidth,
            tempY:canvHalfHeight,
            stepX: 0,
            stepY: 0,
            pointSize: pointSize,
            incCoord: 'x',
            incPerPixels: 0,
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

    //current.destinationX = extRandom(0, canvas.width);
    //current.destinationY = extRandom(0, canvas.height);
if(extRandom(0,2)){
    current.destinationX =  canvas.width;
    current.destinationY = extRandom(0, canvas.height);
} else {
    current.destinationX =  extRandom(0, canvas.width);
    current.destinationY = canvas.height;
}


    longerLine = (current.destinationY < current.destinationX) ? current.destinationX : current.destinationY;
    current.stepsCount = longerLine;

    //set point moving step

    if (current.destinationX == 0 || current.destinationX == canvas.width) {
        current.stepX = +(Math.sqrt((Math.pow(current.destinationX, 2) + Math.pow(current.destinationY, 2))) / framesPerAnimation).toFixed(2);
        current.stepY = +(current.stepX * current.destinationY / canvas.height).toFixed(2);
       // incCoord=1;
    }
    else {
        current.stepY = +(Math.sqrt((Math.pow(current.destinationX, 2) + Math.pow(current.destinationY, 2))) / framesPerAnimation).toFixed(2);
        current.stepX = +(current.stepY * current.destinationX / canvas.width).toFixed(2);
    }

    current.incPerPixels=longerLine/pointIncrement;
    current.incCoord=(current.destinationY < current.destinationX) ? 'x' : 'y';

    current.ownTimeout = setTimeout(function(){pointIncFunc.call(current)},globalPointNumber*extRandom(0,300));
    current.firstTime=1;

    if(extRandom(0,2)) {
        current.destinationX*=-1;
    }
    if(extRandom(0,2)) {
        current.destinationY*=-1;
    }
    if(extRandom(0,2)) {
        current.stepX*=-1;
    }
    if(extRandom(0,2)) {
        current.stepY*=-1;
    }

    //colour circles
    /*
    if(extRandom(0,2)) {
        current.fillColor='#25F5F5';
    }
    else if(extRandom(0,2)) {
        current.fillColor='#1FF9B2';
    }
    else if(extRandom(0,2)) {
        current.fillColor='#1F94F9';
    }
*/


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

function pointIncFunc(){
    if(this.firstTime){
        this.firstTime=0;
        clearTimeout(this.ownTimeout);
        var a=this;
        this.ownTimeout = setInterval(function(){pointIncFunc.call(a)},30);
    }

   this.tempX+=this.stepX;
   this.tempY+=this.stepY;
   this.pointSize+=_pointSizeStep;

    if(this.tempX>=this.destinationX&&this.tempY>=this.destinationY||
        this.tempX<0||this.tempY<0){
        //   clearInterval(this.ownTimeout);
        this.tempX=this.startX;
        this.tempY=this.startY;
        this.pointSize=pointSize;
    }

}

function run() {
    canvasPosition();
    setPoints();
   setInterval(drawPoints,30);
    console.log(points[0]);
}