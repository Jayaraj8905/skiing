var fs = require('fs');
executeMatrix(getMatrix());

// get the matrix
function getMatrix() {
	var value = fs.readFileSync('map.txt', 'utf8');
	var parsedMatrix = value.split('\n');
	var matrix = [];

	// converting map file data to matrix
	for(var index = 0 ; index < parsedMatrix.length; index++) {
		parsedMatrix[index] = parsedMatrix[index].split(' ')
	}
	for(var outer = 0; outer < parsedMatrix.length; outer++) {
		for(var inner =0 ; inner < parsedMatrix[outer].length; inner++) {
		  if (!matrix[outer]) matrix[outer] = [];
		  matrix[outer][inner] = parseInt(parsedMatrix[outer][inner]);
		}
	}	
	return matrix;
}


function executeMatrix(matrix) {
    var outerIndex = matrix.length-1;
    var innerIndex = matrix[0].length-1;

    var finalisedPath = {
    	depth: 0
    };
    var count=0;

    // loop through the every element in the matrix array and find the path
    for (var outerIndex = 0; outerIndex < matrix.length; outerIndex++) {
    	for (var innerIndex = 0; innerIndex < matrix[outerIndex].length; innerIndex++) {
	    	var currPath = getPath(matrix, outerIndex, innerIndex);
	    	currPath.drop = currPath.value - currPath.startVal;
	    	if (currPath && currPath.depth > finalisedPath.depth) {
	    		finalisedPath = currPath;
	    	}
	    	if (currPath && currPath.depth === finalisedPath.depth 
	    		&& currPath.drop > finalisedPath.drop) {
	    		finalisedPath = currPath;
	    	}
	    }	
    }
    
    const depth = finalisedPath.depth;
    const drop = finalisedPath.drop;
    console.log(`Depth: ${depth}, Drop: ${drop}`);
    console.log(`Path: ${finalisedPath.tree}`);	
    console.log(`EmailId: ${depth}${drop}@redmart.com`);
}

function getPath(matrix, outer, inner) {

	function updateObj(child, returnObj) {
		// if the depth is greater than the previous update the info
		if (child.depth > returnObj.depth) {
			returnObj.depth = child.depth; 
			returnObj.tree = child.tree;
			returnObj.startVal = Math.min(child.startVal, returnObj.startVal);
		}
		// if the depth is equal then compare based on the start value 
		// and update the info 
		else if (child.depth == returnObj.depth) {
			if (child.startVal < returnObj.startVal) {
				returnObj.tree = child.tree;
			}
			returnObj.startVal = Math.min(child.startVal, returnObj.startVal);
		}
	}

	function goToNext(outer, inner) {
		var returnObj = {
			depth: 0,
			value: matrix[outer][inner],
			startVal: matrix[outer][inner],
			tree: ''
		}

		// go to top
		if (matrix[outer-1] && matrix[outer-1][inner] < returnObj.value) {
			// get the top child recursively
			let topChild = goToNext(outer-1, inner);
			updateObj(topChild, returnObj);
		}

		// go to bottom
		if (matrix[outer+1] && matrix[outer+1][inner] < returnObj.value) {
			let bottomChild = goToNext(outer+1, inner);
			updateObj(bottomChild, returnObj);
		}

		// go to left
		if (matrix[outer][inner-1] < returnObj.value) {
			let leftChild = goToNext(outer, inner-1);
			updateObj(leftChild, returnObj);
		}

		// go to right
		if (matrix[outer][inner+1] < returnObj.value) {
			let rightChild = goToNext(outer, inner+1);
			updateObj(rightChild, returnObj);
		}


		returnObj.tree += returnObj.tree != '' ? ` - ${returnObj.value}` : returnObj.value;
		returnObj.depth += 1;
		return returnObj; 
	}

	// find the path for the next route
	var nextPath = goToNext(outer, inner);
	return nextPath;
}