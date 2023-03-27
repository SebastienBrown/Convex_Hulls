const SVG_NS = "http://www.w3.org/2000/svg";

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

function ConvexHull(id) {
    this.id = id;            // (unique) ID of this graph
    this.vertices = [];      // set of vertices in this graph
    this.edges = [];         // set of edges in this graph
    this.nextVertexID = 0;   // ID to be assigned to next vtx
    this.nextEdgeID = 0;     // ID to be assigned to next edge
    
    // create a and return a new vertex at a given location
    this.createVertex = function (x, y) {
	const vtx = new Vertex(this.nextVertexID, this, x, y);
	this.nextVertexID++;
	return vtx;
    }

    // add vtx to the set of vertices of this graph, if the vtx is not
    // already stored as a vertex
    this.addVertex = function(vtx) {
	if (!this.vertices.includes(vtx)) {
	    this.vertices.push(vtx);
	    console.log("added vertex with id " + vtx.id);
	} else {
	    console.log("vertex with id " + vtx.id + " not added because it is already a vertex in the graph.");
	}
    }

    // create and return an edge between vertices vtx1 and vtx2;
    // returns existing edge if there is already an edge between the
    // two vertices
    this.addEdge = function(vtx1, vtx2) {
	if (!this.isEdge(vtx1, vtx2)) {
	    const edge = new Edge(vtx1, vtx2, this.nextEdgeID);
	    this.nextEdgeID++;
	    vtx1.addNeighbor(vtx2);
	    vtx2.addNeighbor(vtx1);
	    this.edges.push(edge);
	    console.log("added edge (" + vtx1.id + ", " + vtx2.id + ")");
	    return edge;
	} else {
	    console.log("edge (" + vtx1.id + ", " + vtx2.id + ") not added because it is already in the graph");
	    return null;
	}
    }

    // determine if vtx1 and vtx2 are already an edge in this graph
    this.isEdge = function (vtx1, vtx2) {
	return (this.getEdge(vtx1, vtx2) != null);
    }

    // return the edge object corresponding to a pair (vtx1, vtx2), or
    // null if no such edge is in the graph
    this.getEdge = function (vtx1, vtx2) {
	for(const edge of this.edges) {
	    if (edge.equals(vtx1, vtx2)) {
		return edge;
	    }
	}

	return null;
    }

    // return a string representation of the adjacency lists of the
    // vertices in this graph
    this.adjacencyLists = function () {
	let str = '';
	for (const vtx of this.vertices) {
	    str += vtx.id + ':';
	    for (const nbr of vtx.neighbors) {
		str += (' ' + nbr.id);
	    }
	    str += '<br>';
	}
	return str;
    }
}

// an object representing a vertex in a graph
// each vertex has an associated unique identifier (id), the graph
// containing the vertex, as well as x,y coordinates of the vertex's
// physical location
function Vertex(id, graph, x, y) {
    this.id = id;        // the unique id of this vertex
    this.graph = graph;  // the graph containing this vertex
    this.x = x;          // x coordinate of location
    this.y = y;          // y coordinate of location
    
    this.neighbors = []; // the adjacency list of this vertex

    // add vtx as a neighbor of this vertex, if it is not already a
    // neighbor
    this.addNeighbor = function (vtx) {
	if (!this.neighbors.includes(vtx)) {
	    this.neighbors.push(vtx);
	}
    }

    // remove vtx as a neighbor of this vertex
    this.removeNeighbor = function (vtx) {
	const index = this.neighbors.indexOf(vtx);
	if (index != -1) {
	    this.neighbors.splice(index, 1);
	}
    }

    // determine if vtx is a neighbor of this vertex
    this.hasNeighbor = function (vtx) {
	return this.neighbors.includes(vtx);
    }
}

// an object representing an edge in a graph
function Edge (vtx1, vtx2, id) {
    this.vtx1 = vtx1;   // first endpoint of the edge
    this.vtx2 = vtx2;   // second endpoint of the edge
    this.id = id;       // the unique identifier of this edge

    // determine if this edge has vtx1 and vtx2 as endpoints
    this.equals = function (vtx1, vtx2) {
	return (this.vtx1 == vtx1 && this.vtx2 == vtx2) || (this.vtx1 == vtx2 && this.vtx2 == vtx1);
    }

}

// an object to visualize and interact with a graph
function ConvexHullViewer (graph, svg, text) {
    this.graph = graph;      // the graph we are visualizing
    this.svg = svg;          // the svg element we are drawing on
    this.text = text;        // a text box

    // define the behavior for clicking on the svg element
    this.svg.addEventListener("click", (e) => {
	// create a new vertex
	this.createVertex(e);
    });

    // sets of highlighted/muted vertices and edges
    this.highVertices = [];
    this.lowVertices = [];
    this.highEdges = [];
    this.lowEdges = [];

    // create svg group for displaying edges
    this.edgeGroup = document.createElementNS(SVG_NS, "g");
    this.edgeGroup.id = "graph-" + graph.id + "-edges";
    this.svg.appendChild(this.edgeGroup);

    // create svg group for displaying vertices
    this.vertexGroup = document.createElementNS(SVG_NS, "g");
    this.vertexGroup.id = "graph-" + graph.id + "-vertices";
    this.svg.appendChild(this.vertexGroup);




    ////////////////////////////////////////////////////////////
    // NEW SINCE LECTURE 08
    ////////////////////////////////////////////////////////////

    // overlay vertices
    this.overlayVertices = [];

    // create svg group for displaying overlays
    this.overlayGroup = document.createElementNS(SVG_NS, "g");
    this.overlayGroup.id = "graph-" + graph.id + "-overlay";
    this.svg.appendChild(this.overlayGroup);

    this.addOverlayVertex = function (vtx) {
	const elt = document.createElementNS(SVG_NS, "circle");
	elt.classList.add("overlay-vertex");
	elt.setAttributeNS(null, "cx", vtx.x);
	elt.setAttributeNS(null, "cy", vtx.y);
	this.overlayGroup.appendChild(elt);
	this.overlayVertices[vtx.id] = elt;
    }

    this.moveOverlayVertex = function (vtx1, vtx2) {
	const elt = this.overlayVertices[vtx1.id];
	this.overlayVertices[vtx1.id] = null;
	this.overlayVertices[vtx2.id] = elt;
	elt.setAttributeNS(null, "cx", vtx2.x);
	elt.setAttributeNS(null, "cy", vtx2.y);
    }

    this.removeOverlayVertex = function (vtx) {
	const elt = this.overlayVertices[vtx.id];
	this.overlayGroup.removeChild(elt);	
    }

    ////////////////////////////////////////////////////////////
    // END NEW
    ////////////////////////////////////////////////////////////



    this.vertexElts = [];   // svg elements for vertices
    this.edgeElts = [];     // svg elements for edges

    // create a new vertex 
    this.createVertex = function (e) {
	const rect = this.svg.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;
	const vtx = graph.createVertex(x, y);
	this.addVertex(vtx);
	this.graph.addVertex(vtx);
	this.updateTextBox(graph.adjacencyLists());
    }

    // add a vertex to the visualization by creating an svg element
    this.addVertex = function (vtx) {
	const elt = document.createElementNS(SVG_NS, "circle");
	elt.classList.add("vertex");
	elt.setAttributeNS(null, "cx", vtx.x);
	elt.setAttributeNS(null, "cy", vtx.y);

	elt.addEventListener("click", (e) => {
	    e.stopPropagation(); // don't create another vertex (i.e., call event listener for the svg element in addition to the vertex
	    this.clickVertex(vtx);
	});

	this.vertexGroup.appendChild(elt);
	this.vertexElts[vtx.id] = elt;
    }
    
    // method to be called when a vertex is clicked
    this.clickVertex = function (vtx) {
	console.log("You clicked vertex " + vtx.id);

	// check if any other highlighted vertices
	if (this.highVertices.length == 0) {
	    this.highVertices.push(vtx);
	    this.highlightVertex(vtx);
	} else if (this.highVertices.includes(vtx)) {
	    this.unhighlightVertex(vtx);
	    this.highVertices.splice(this.highVertices.indexOf(vtx), 1);
	} else {
	    const other = this.highVertices.pop();
	    let e = this.graph.addEdge(other, vtx);
	    if (e != null) {
		this.addEdge(e);
	    }
	    this.unhighlightVertex(other);
	}
    }

    // add an edge to the visualization
    this.addEdge = function (edge) {
	const vtx1 = edge.vtx1;
	const vtx2 = edge.vtx2;
	const edgeElt = document.createElementNS(SVG_NS, "line");
	edgeElt.setAttributeNS(null, "x1", vtx1.x);
	edgeElt.setAttributeNS(null, "y1", vtx1.y);
	edgeElt.setAttributeNS(null, "x2", vtx2.x);
	edgeElt.setAttributeNS(null, "y2", vtx2.y);
	edgeElt.classList.add("edge");
	this.edgeElts[edge.id] = edgeElt;
	this.edgeGroup.appendChild(edgeElt);
	this.updateTextBox(this.graph.adjacencyLists());
    }

    this.updateTextBox = function (str) {
	this.text.innerHTML = str;
    }

    /*********************************************************
     * Methods to (un)highlight and (un) mute vertices/edges *
     *********************************************************/


    this.highlightVertex = function (vtx) {
	const elt = this.vertexElts[vtx.id];
	elt.classList.add("highlight");
    }

    this.unhighlightVertex = function (vtx) {
	const elt = this.vertexElts[vtx.id];
	elt.classList.remove("highlight");	
    }

    this.muteVertex = function (vtx) {
	const elt = this.vertexElts[vtx.id];
	elt.classList.add("muted");
    }

    this.unmuteVertex = function (vtx) {
	const elt = this.vertexElts[vtx.id];
	elt.classList.remove("muted");
    }

    this.highlightEdge = function (e) {
	const elt = this.edgeElts[e.id];
	elt.classList.add("highlight");	
    }

    this.unhighlightEdge = function (e) {
	const elt = this.edgeElts[e.id];
	elt.classList.remove("highlight");	
    }

    this.muteEdge = function (e) {
	const elt = this.edgeElts[e.id];
	elt.classList.add("muted");
    }

    this.unmuteEdge = function (e) {
	const elt = this.edgeElts[e.id];
	elt.classList.remove("muted");
    }

    this.muteAllVertices = function () {
	for (vtx of this.graph.vertices) {
	    this.muteVertex(vtx);
	}
    }

    this.muteAllEdges = function () {
	for (e of this.graph.edges) {
	    this.muteEdge(e);
	}
    }

    this.muteAll = function () {
	this.muteAllVertices();
	this.muteAllEdges();
    }

    this.unmuteAllVertices = function () {
	for (vtx of this.graph.vertices) {
	    this.unmuteVertex(vtx);
	}
    }

    this.unmuteAllEdges = function () {
	for (e of this.graph.edges) {
	    this.unmuteEdge(e);
	}
    }

    this.unmuteAll = function () {
	this.unmuteAllVertices();
	this.unmuteAllEdges();
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

function ConvexHull (ps, viewer) {
    this.ps = ps;          // a PointSet storing the input to the algorithm
    this.viewer = viewer;  // a ConvexHullViewer for this visualization

    
    this.start = function () {


    }

    this.step = function () {
	
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
            return stack;
        }

        //check whether all points in a given pointset are colinear
        //saves x,y coordinates of first point in pointset and initializes two boolean flags
        var xCheck=this.ps.points[0].x;
        var yCheck=this.ps.points[0].y;
        var isXColinear=true;
        var isYColinear=true;
        //console.log(this.ps.points[0].x);
        //console.log(this.ps.points[0].y);

        //if any point in the pointset has a different x/coordinate from the first point, change the respective flags to false and exit the loop
        for(let z=1;z<this.ps.size();z++){
            if((this.ps.points[z].x!=xCheck)||(this.ps.points[z].y!=yCheck)){
                //checks whether the x coordinate of a given point is different from that of the first point in pointset and updates is isXColinear accordingly
                //console.log("THE X VALUE OF THE POINT OF INTEREST IS",this.ps.points[z].x);
                //console.log("THE VALUE OF XCHECK IS ",xCheck);
                if(this.ps.points[z].x!=xCheck){
                    isXColinear=false;
                }
                //console.log("THE Y VALUE OF THE POINT OF INTEREST IS",this.ps.points[z].y);
                //console.log("THE VALUE OF XCHECK IS ",yCheck);
                //checks whether the y coordinate of a given point is different from that of the first point in pointset and updates isYColinear accordingly
                if((this.ps.points[z].y!=yCheck)){
                    isYColinear=false;
                }
            }
        }
        //console.log("STATUS OF ISXCOLINEAR ",isXColinear);
        //console.log("STATUS OF ISYCOLINEAR ",isYColinear);
        //initializes a new array for storing convex hull of colinear points
        //if the x or y coordinate of all points in pointset are the same, creates the corresponding convex hull using the first point and furthest point
        let stackC=[];
        if(isXColinear==true || isYColinear==true){
            stackC.push(this.ps.points[0]);
            stackC.push(this.ps.points[this.ps.size()-1]);
            stackC.push(this.ps.points[0]);
            return stackC;
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
        //once both the upper and lower hulls have been completed and stored in the stack, returns the stack
        return stack;
    }
}
//code for running the tester
try {
    exports.PointSet = PointSet;
    exports.ConvexHull = ConvexHull;
  } catch (e) {
    console.log("not running in Node");
  }