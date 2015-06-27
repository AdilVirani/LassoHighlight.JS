
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
var isDrawing = false;
var _points = [];
var context = canvas.getContext("2d");
var selectionMade = false;

document.addEventListener("mousedown", function(e) {
        console.log("click")

        context.clearRect( 0 , 0 , canvas.width, canvas.height );

        document.body.appendChild(canvas);
        //canvas.style.top = body.scrollTop + "px";
        isDrawing = true;

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
    //var centroid = getCentroid(bb);
    document.body.removeChild(canvas);
    //var element = findElementAt(centroid);
    var element = getInner(bb)
    //var element = rectangleSelect("p", bb.x, bb.y, bb.w, bb.h);
    console.log("bb: " + bb.x +"/"+ bb.y +"/"+ bb.w +"/"+ bb.h)
    console.log("num elements: " + element.length)
    for (i=0; i<element.length; i++){
    console.log("the " + i + "th ele is: " + element[i])
    //selectNode(element[i]);
    }
    //console.log(element)
    //selectNode(element);
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
    context.lineWidth = 3;
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
    return element;
}

//function findElementIn()
//function rectangleSelect(selector, x1, y1, w1, h1) {
//    var elements = [];
//    jQuery(selector).each(function() {
//                          var $this = jQuery(this);
//                          var offset = $this.offset();
//                          var x = offset.left;
//                          var y = offset.top;
//                          var w = $this.width();
//                          var h = $this.height();
//                          
//                          console.log("x: " + x +", y: " + y + ", w:"+ w +", h:" + h)
//                          
//                          if (x >= x1
//                              && y >= y1
//                              && x + w <= x1 + w1
//                              && y + h <= y1 + h1) {
//                          // this element fits inside the selection rectangle
//                          elements.push($this.get(0));
//                          }
//                          });
//    return elements;
//}


function getInner(bb){
    var step = 10;
    var pixelStepY = bb.h/step;
    var pixelStepX = bb.w/step;
    var dic = {};
    for (var i=0;i<bb.h;i += pixelStepY) {
        for (var j=0;j<bb.w;j += pixelStepX) {
            var x = bb.x + j;
            var y = bb.y + i;
            var element = document.elementFromPoint(x, y);
            dic[element] = null;
            //console.log(element)
        }
    }
    var keys = [];
    for (var key in dic) {
        //if (key == HTMLParagraphElement){
        //    continue;
        //}
        if (dic.hasOwnProperty(key)) {
            keys.push(key);
        }

    }
    console.log(keys)
    return keys
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