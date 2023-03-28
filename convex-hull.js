//const SVG_NS = "http://www.w3.org/2000/svg";

//analogous to the Vertex function
function Point (x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;

    // Compare this Point to another Point p for the purposes of
    // sorting a collection of points. The comparison is according to
    // lexicographical ordering. That is, (x, y) < (x', y') if (1) x <
    // x' or (2) x == x' and y < y'.
    this.compareTo = function (p) {
	if (this.x > p.x) {
	    return 1;
	}

	if (this.x < p.x) {
	    return -1;
	}

	if (this.y > p.y) {
	    return 1;
	}

	if (this.y < p.y) {
	    return -1;
	}

	return 0;
    }

    // return a string representation of this Point
    this.toString = function () {
	return "(" + x + ", " + y + ")";
    }
}


// An object that represents a set of Points in the plane. The `sort`
// function sorts the points according to the `Point.compareTo`
// function. The `reverse` function reverses the order of the
// points. The functions getXCoords and getYCoords return arrays
// containing x-coordinates and y-coordinates (respectively) of the
// points in the PointSet.
function PointSet () {
    this.points = [];
    this.curPointID = 0;

    // create a new Point with coordintes (x, y) and add it to this
    // PointSet
    this.addNewPoint = function (x, y) {
	this.points.push(new Point(x, y, this.curPointID));
	this.curPointID++;
    }

    // add an existing point to this PointSet
    this.addPoint = function (pt) {
	this.points.push(pt);
    }

    // sort the points in this.points 
    this.sort = function () {
	this.points.sort((a,b) => {return a.compareTo(b)});
    }

    // reverse the order of the points in this.points
    this.reverse = function () {
	this.points.reverse();
    }

    // return an array of the x-coordinates of points in this.points
    this.getXCoords = function () {
	let coords = [];
	for (let pt of this.points) {
	    coords.push(pt.x);
	}

	return coords;
    }

    // return an array of the y-coordinates of points in this.points
    this.getYCoords = function () {
	let coords = [];
	for (pt of this.points) {
	    coords.push(pt.y);
	}

	return coords;
    }

    // get the number of points 
    this.size = function () {
	return this.points.length;
    }

    // return a string representation of this PointSet
    this.toString = function () {
	let str = '[';
	for (let pt of this.points) {
	    str += pt + ', ';
	}
	str = str.slice(0,-2); 	// remove the trailing ', '
	str += ']';

	return str;
    }
}

//determines whether the angle abc represents a right turn or not
//is used to determine which elements should belong to the convex hull of the pointset
function orientation(a,b,c){
    let crossProduct = ((b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y)); //calculates the cross product of ab and bc to determine the value of the angle abc
                if (crossProduct == 0){return 0;}  //the points a,b,c are colinear, so this is not a right turn
                else if (crossProduct > 0){return 1;}//the angle abc denotes a right turn, so c can be added to the convex hull
                else{return 2;//the angle abc denotes a left turn, so this is not a right turn
                }
}

function ConvexHullViewer (svg, ps) {
    this.svg = svg;  // an svg object where the visualization is drawn
    this.ps = ps;    // a point set of the points to be visualized
    this.pointCount = 0;
    this.edgesCount = 0;
    this.vertices = [];
    this.edges = [];
    // define the behavior for clicking on the svg element
    this.svg.addEventListener("click", (e) => {
    // create a new vertex
    /*    if(this.pointCount >= 1){
            (this.vertices.pop()).classList.remove("vertex");
        } */

        const rect = this.svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        var elt = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        elt.classList.add("vertex");
        elt.setAttributeNS(null, "cx", x);
        elt.setAttributeNS(null, "cy", y);
        this.vertices.push(elt);
        svg.appendChild(elt);
        ps.addPoint(new Point(x, y, this.pointCount));
        this.pointCount++;

    });
    

    // COMPLETE THIS OBJECT
}

function ConvexHull (ps, viewer) {
    this.ps = ps.sort();          // a PointSet storing the input to the algorithm
    this.viewer = viewer;  // a ConvexHullViewer for this visualization
    this.curAnimation = null;
    
    this.visited = [];
    this.active = [];
    this.cur = null;
    
    this.start = function () {
    
        // todo: un-highlight previously highlighted stuff

        while(viewer.edgesCount >= 1){
            (viewer.edges.pop()).classList.remove("edge");
            viewer.edgesCount--;
        }

    }

    this.step = function () {
	
        //implement this next.

    }

    this.animate = function () {
	
        //makes an edge between two leftmost points, and erases it otherwise.
        if(viewer.edgesCount >= 1){
            (viewer.edges.pop()).classList.remove("edge");
            viewer.edgesCount--;
        }else{
        
        var edgeElt = document.createElementNS("http://www.w3.org/2000/svg", "line");
        edgeElt.setAttributeNS(null, "x1", ps.points[0].x);
	    edgeElt.setAttributeNS(null, "y1", ps.points[0].y);
	    edgeElt.setAttributeNS(null, "x2", ps.points[1].x);
	    edgeElt.setAttributeNS(null, "y2", ps.points[1].y);
	    edgeElt.classList.add("edge");
        viewer.edges.push(edgeElt);
        svg.appendChild(edgeElt);
        viewer.edgesCount++;
        }

    }

    this.getConvexHull = function () {
        
        //initialize array for saving convex hull points
        let stack=[];

        //if the pointset is a single point, return that same point as the hull
        if(this.ps.size()==1){
            return this.ps;
        }

        //sort the pointset and push the 2 elements with the lowest x-coordinate on the stack
        this.ps.sort();
        stack.push(this.ps.points[0]);
        stack.push(this.ps.points[1]);

        //if the pointset is two points, return the corresponding hull
        if(this.ps.size()==2){
            stack.push(this.ps.points[0]);

            //initializes a new PointSet and copies the stack elements into it
            let PS = new PointSet;
            for(let a=0;a<stack.length;a++){
                PS.addNewPoint(stack[a].x,stack[a].y);
            }
            //once both the upper and lower hulls have been completed and stored in the stack, returns the stack
            return PS;
        }

        //check whether all points in a given pointset are colinear
        //saves x,y coordinates of first point in pointset and initializes two boolean flags
        var xCheck=this.ps.points[0].x;
        var yCheck=this.ps.points[0].y;
        var isXColinear=true;
        var isYColinear=true;

        //if any point in the pointset has a different x/coordinate from the first point, change the respective flags to false and exit the loop
        for(let z=1;z<this.ps.size();z++){
            if((this.ps.points[z].x!=xCheck)||(this.ps.points[z].y!=yCheck)){
                //checks whether the x coordinate of a given point is different from that of the first point in pointset and updates is isXColinear accordingly
                if(this.ps.points[z].x!=xCheck){
                    isXColinear=false;
                }
                //checks whether the y coordinate of a given point is different from that of the first point in pointset and updates isYColinear accordingly
                if((this.ps.points[z].y!=yCheck)){
                    isYColinear=false;
                }
            }
        }

        //initializes a new array for storing convex hull of colinear points
        //if the x or y coordinate of all points in pointset are the same, creates the corresponding convex hull using the first point and furthest point
        let stackC=[];
        if(isXColinear==true || isYColinear==true){
            stackC.push(this.ps.points[0]);
            stackC.push(this.ps.points[this.ps.size()-1]);
            stackC.push(this.ps.points[0]);

            //initializes a new PointSet and copies the stack elements into it
            let PS = new PointSet;
            for(let a=0;a<stackC.length;a++){
                PS.addNewPoint(stackC[a].x,stackC[a].y);
            }
            //once both the upper and lower hulls have been completed and stored in the stack, returns the stack
            return PS;
        } 
        
        //completes the upper section of the convex hull
        for(let i=2;i<this.ps.size();i++){
            var c=this.ps.points[i];
            
            //if the stack has length 1, push the next element of this.ps onto it
            if (stack.length==1){
                stack.push(c);
            }
            else{
                //defines variables a and b as the top 2 elements of the stack
                var a = stack[stack.length-2];
                var b = stack[stack.length-1];
                
                //while the stack is more than one element and angle abc is not a right turn, pop the top element off the stack and update a,b accordingly
                while((stack.length>1)&&(orientation(a,b,c)!=1)){
                    stack.pop();
                    var a = stack[stack.length-2];
                    var b = stack[stack.length-1];
                }
                //push c onto the stack
                stack.push(c);
            }
        }

        //this section of the code creates the lower portion of the convex hull
        //reverses the ordering of pointset so that it is sorted by descending x coordinate
        this.ps.reverse();

        //pushes the second element of pointset onto the stack
        stack.push(this.ps.points[1]);

        //completes the lower section of the convex hull
        for(let i=2;i<this.ps.size();i++){
            var c=this.ps.points[i];

            //if the stack has length 1, push the next element of this.ps onto it
            if (stack.length==1){
                stack.push(c);
            }
            else{
                //defines variables a and b as the top 2 elements of the stack
                var a = stack[stack.length-2];
                var b = stack[stack.length-1];
                
                //while the stack is more than one element and angle abc is not a right turn, pop the top element off the stack and update a,b accordingly
                while((stack.length>1)&&(orientation(a,b,c)!=1)){
                    stack.pop();
                    var a = stack[stack.length-2];
                    var b = stack[stack.length-1]; 
                }
                //push c onto the stack
                stack.push(c);
            }
        }
        //initializes a new PointSet and copies the stack elements into it
        let PS = new PointSet;
        for(let a=0;a<stack.length;a++){
            PS.addNewPoint(stack[a].x,stack[a].y);
        }
        //once both the upper and lower hulls have been completed and stored in the stack, returns the stack
        return PS;
    }
}

//code for running the tester
try {
    exports.PointSet = PointSet;
    exports.ConvexHull = ConvexHull;
  } catch (e) {
    console.log("not running in Node");
  }

  var svg = null;
  var ps = null;
  var gv = null;
  var ch = null;

  function draw(){
    svg = document.querySelector("#convex-hull-box");;
    ps = new PointSet;
    gv = new ConvexHullViewer(svg, ps);
    ch = new ConvexHull(ps, gv); 
  }
