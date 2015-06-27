/**
 * Created by phili_000 on 4/28/2015.
 */
var body = document.body,
    html = document.documentElement;

var width = Math.max( body.scrollWidth, body.offsetWidth,
    html.clientWidth, html.scrollWidth, html.offsetWidth );

var height = Math.max( body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight );

var canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = "absolute";
canvas.style.top = 0;
//canvas.style.backgroundColor = "black";
var isDrawing = false;
var _points = [];
var context = canvas.getContext("2d");
var selectionMade = false;

document.addEventListener("mousedown", function(e) {


        context.clearRect( 0 , 0 , canvas.width, canvas.height );
        if (isTextSelected())
            return;
        document.body.appendChild(canvas);
        canvas.style.top = body.scrollTop + "px";

        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;
        _points = [];
        draw(e);
});

canvas.addEventListener("mousemove", function(e) {
    draw(e);
});

canvas.addEventListener("mouseup", function(e) {
    isDrawing = false;
    var bb = getBoundingRect();
    var centroid = getCentroid(bb);
    document.body.removeChild(canvas);
    var element = findElementAt(centroid);
    console.log(element)
    selectNode(element);

});


var prevX, prevY, currX, currY;

var words = $("p").text().split(" ");
$("p").empty();
$.each(words, function(i, v) {
       $("p").append($("<span>").text(v).append(" "));
       });

function draw(e) {
    if (isDrawing == false)
        return;
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvas.offsetLeft;
    currY = e.clientY - canvas.offsetTop;

    _points.push({x: currX, y: currY});
    context.beginPath();
    context.moveTo(prevX + body.scrollTop, prevY );
    context.lineTo(currX, currY);
    context.strokeStyle = "red";
    context.lineWidth = 5;
    context.stroke();
    context.closePath();
}

function selectNode(node) {
    var range = document.createRange();
    var selection = window.getSelection();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
}

function getBoundingRect() {
    var minX = 1000000;
    var maxX = -1000000;
    var minY = 1000000;
    var maxY = -1000000;
    for(var i=0;i<_points.length;i++) {
        var p = _points[i];
        maxY = p.y > maxY ? p.y : maxY;
        maxX = p.x > maxX ? p.x : maxX;
        minX = p.x < minX ? p.x : minX;
        minY = p.y < minY ? p.y : minY;
    }

    return {x: minX, y:minY, w:maxX - minX, h: maxY - minY};
}

function getCentroid(bb) {
    var x = bb.x + bb.w/2;
    var y = bb.y + bb.h/2;
    return {x:x, y:y};
}

function findElementAt(centroid) {
    var element = document.elementFromPoint(centroid.x, centroid.y);

    while (element.getName() != "HTMLParagraphElement") {
        element = element.parentNode;
    }
    return element;
}

function isTextSelected() {
    var range = document.createRange();
    var selection = window.getSelection();
    console.log(selection.toString().length);
    return (selection.toString().length > 0);
}

Object.prototype.getName = function() {
    var funcNameRegex = /function (.{1,})\(/;
    var results = (funcNameRegex).exec((this).constructor.toString());
    return (results && results.length > 1) ? results[1] : "";
};