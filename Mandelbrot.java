/*
 * Note that this program uses the Java Vector API, which is only
 * available as an incubator feature in Java 16+. In order to compile
 * and run the program you need to use flag '--add-modules
 * jdk.incubator.vector'. For example:
 *
 * > javac --add-modules jdk.incubator.vector Mandelbrot.java
 *
 * In order to run any program that uses the Mandelbrot class, you
 * similarly have to add the same flag to the java command, e.g.:
 *
 * > java --add-modules jdk.incubator.vector MandelbrotTester
 */

import jdk.incubator.vector.*;
import java.util.Arrays;


// A class for computing the Mandelbrot set and escape times for
// points in the complex plane
public class Mandelbrot {

    // the maximum number of iterations of the system to consider 
    private float maxIter = 100.0F;

    // the squared distance to the origin for escape
    private float maxSquareModulus = 100.0F;

    // coordinates of the region to be computed
    private float xMin, xMax, yMin, yMax;

    static final VectorSpecies<Float> SPECIES = FloatVector.SPECIES_PREFERRED;

    public Mandelbrot() {
	
    }

    public Mandelbrot(float maxIter, float maxSquareModulus) {
	this.maxIter = maxIter;
	this.maxSquareModulus = maxSquareModulus;
    }

    public Mandelbrot(float[] params) {
	setAll(params);
    }

    public float getMaxIter() {
	return maxIter;
    }

    // set the region to be considered from points
    public void setRegion(float xMin, float xMax, float yMin, float yMax) {
	this.xMin = xMin;
	this.xMax = xMax;
	this.yMin = yMin;
	this.yMax = yMax;
    }

    // set the region to be considered from an array of coordinates
    public void setRegion(float[] coords) {
	this.xMin = coords[0];
	this.xMax = coords[1];
	this.yMin = coords[2];
	this.yMax = coords[3];
    }

    public void setIterAndModulus(float maxIter, float maxSquaredModulus) {
	this.maxIter = maxIter;
	this.maxSquareModulus = maxSquareModulus;
    }

    // set all parameters; the first four values in params are
    // interpreted as coordinates of the region, while params[4] and
    // params[5] are the maximum iterations and maximum squared
    // modulus, respectively
    public void setAll(float[] params) {
	setRegion(params);
	setIterAndModulus(params[4], params[5]);
    }

    // a baseline implementation of computing escape times for the
    // current region
    // esc is a 2d array to record the escape times,
    // where the first index records rows of the region, and the
    // second index is the column number
    public void escapeTimesBaseline (float[][] esc) {
	float xStep = (xMax - xMin) / esc[0].length;
	float yStep = (yMax - yMin) / esc.length;

	for (int i = 0; i < esc.length; i++) {
	    for (int j = 0; j < esc[0].length; j++) {
		int iter = 0;
		float cx = xMin + j * xStep;
		float cy = yMin + i * yStep;

		float zx = 0;
		float zy = 0;
		
		while (iter < maxIter && zx * zx + zy * zy < maxSquareModulus) {
		    float z = zx * zx - zy * zy + cx;
		    zy = 2 * zx * zy + cy;
		    zx = z;

		    iter++;		    
		}

		esc[i][j] = iter;
	    }
	}
    }

    // an optimized implementation of escapeTimesBaseline that uses
    // vector operations
    public void escapeTimesOptimized (float[][] esc) {
	float xStep = (xMax - xMin) / esc[0].length;
	float yStep = (yMax - yMin) / esc.length;
    //int bounded=(esc[0].length*esc.length);
    int step = SPECIES.length();
    int bound = SPECIES.loopBound(esc[0].length);
    //int val=;

    var xmin=FloatVector.broadcast(SPECIES,1);
    //var steps=FloatVector.broadcast(SPECIES,);
    
    int i=0;
    for (;i<esc.length;i++){
        var cy=yMin+i*yStep;
        int j=0;

    for(;j<bound;j+=step){
        float[] cx = new float[step];
        for (int k=0;k<;step){
            cx[k]=xMin+k*xStep;
        }

      var cx = FloatVector.fromArray(SPECIES,cx,0);
      var iter = FloatVector.zero(SPECIES);
      //var cy = FloatVector.broadcast(SPECIES,val);
      //var cx = FloatVector.broadcast(SPECIES);
      var zx = FloatVector.zero(SPECIES);
      var zy = FloatVector.zero(SPECIES);

      var bitMask=(((zx.mul(zx)).add(zy.mul(zy))).lt(maxSquareModulus));
      



        while (iter < maxIter && zx * zx + zy * zy < maxSquareModulus) {
		    float z = zx * zx - zy * zy + cx;
		    zy = 2 * zx * zy + cy;
		    zx = z;

		    iter++;		    
		}
        esc[i][j] = iter;
    }
    
    //for (int i = 0; i < esc.length; i++) {
	    //for (int j = 0; j < esc[0].length; j++) {
            
        //}

	////////////////////////////////////////////////////////////
	// COMPLETE THIS METHOD
	////////////////////////////////////////////////////////////
	
    }
    //System.out.prinln();
}
}
