// Import necessary libraries
const Equation = algebra.Equation;

// Function to convert matrix data into a 2D array
function createMatrixArray(matrix) {
    let matrixArray = [];
    for (let row = 0; row < matrix.rows; ++row) {
        let rowData = [];
        for (let col = 0; col < matrix.cols; ++col) {
            rowData.push(matrix.data[row * matrix.cols + col]);
        }
        matrixArray.push(rowData);
    }
    return matrixArray;
}

// Function to subtract lambda from the diagonal of a matrix
function removeLambda(m, lambda) {
    let ans = {
        rows: m.rows,
        cols: m.cols,
        data: m.data.slice()
    }
    for(let r = 0; r < m.rows; ++r){
        for(let c = 0; c < m.cols; ++c){
            if (r == c) {
                ans.data[r * m.cols + c] = m.data[r * m.cols + c] - lambda;
            }
        }
    }
    return ans;
}

// Gaussian elimination function to solve a system of linear equations
function GaussianElimination(mat){
    function normalize(mat, index, pivot){
        let newMat = Object.assign([], mat);
        let multiplier = 1/(newMat[index][pivot]); 
        for (let i = 0; i < newMat[index].length; i++){
            if (newMat[index][i] != 0){
                newMat[index][i] *= multiplier; 
            }
        }
        return newMat; 
    }

    function change(mat, index, pivot){
        if ((index+1) >= mat.length){
            return;
        }
        let newMat = Object.assign([], mat); 
        for (let i = (index+1); i < newMat.length; i++){
            let multiplier = newMat[i][pivot] * -1; 
            for (j = 0; j < newMat[i].length; j++){
                newMat[i][j] = newMat[i][j] + (newMat[index][j] * multiplier); 
            }
        }
        return newMat; 
    }

    let augmentedMatrix = mat.map(row => [...row, 0]); 

    let pivots = augmentedMatrix.length-1;
    for (let pivot = 0; pivot < pivots; pivot++){
        augmentedMatrix = normalize(mat, pivot, pivot);
        augmentedMatrix = change(mat, pivot, pivot); 
    }
    return augmentedMatrix; 
}

// Function to create algebraic expressions from coefficient arrays and a variable map
function createExpr(arr, map) {
    if (arr.every(element => element == 0)) {
        return false;
    }
    const variables = ["x", "y", "z", "a", "b", "c", "d", "e", "f", "g"];

    let p1 = "", p = "";
    let ans = [];
    let firstTerm = false;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] != 0.00) {
            if (!firstTerm) {
                firstTerm = true;
                p = "(" + arr[i] + " * " + variables[i] + ")";
            }else {
                if (p1.length < 1 && arr[i] > 0.00) {
                    p1 += " -";
                }else if (p1.length > 0){
                    p1 += arr[i] > 0.00 ? " -" : " +";
                }
                p1 += "(" + Math.abs(arr[i]) + " * " + variables[i] + ")"; 
            }
        }
    }
    if (p1.length < 1) {
        p1 = "0";
    }
    p = p.replace(/[xyzabcdefg]/g, carattere => map[carattere]);

    p1 = p1.replace(/[xyzabcdefg]/g, carattere => map[carattere]);
    
    ans[0] = algebra.parse(p);
    ans[1] = algebra.parse(p1);
    return ans;
}

// Function to extract a variable from a string
function findV(S) {
    let ans = "";
    S.split("").forEach(c => {
        if (c.match(/[a-zA-Z]/)) {
            ans = c;
            return;
        }
    });
    return ans;
}

// Function to solve a system of linear equations
function solveEquation(matrix) {
    const n = matrix.length;

    let solution = {
        'x': 'x',
        'y': 'y',
        'z': 'z',
        'a': 'a',
        'b': 'b',
        'c': 'c',
        'd': 'd',
        'e': 'e',
        'f': 'f',
        'g': 'g',
    };

    for (let i = n - 1; i >= 0; i--) {
        const expr = createExpr(matrix[i], solution);

        if (expr) {
            const eq = new Equation(expr[0], expr[1]);
            
            const f = findV(expr[1].toString());
            if (isFinite(expr[1]) || f.length < 1) {
                const v = findV(expr[0].toString());
                const variableValue = eq.solveFor(v).toString();
                solution[v] = `(${variableValue})`;
                continue;
            }
            const Answer = [];

            for (let j = 0; j < 2; j++) {
                Answer.push(eq.solveFor(findV(expr[j].toString())));
            }

            let k = 1
            for (let j = 0; j < 2; j++) {
                const v = findV(Answer[j].toString());
                const eq = new Equation(Answer[j], expr[k]);
                const variableValue = eq.solveFor(v).toString();
                solution[v] = `(${variableValue})`;
                k--;
                expr[k] = eq.solveFor(v);
            }
        }
    }

    return Object.values(solution).filter(value => !/[a-z]/i.test(value));
}

// Function to calculate eigenvalues of a matrix
function calc_eigenvalues(m) {
    return math.eigs(math.matrix(createMatrixArray(m))).values.toArray();
}

// Function to calculate eigenvectors for a given matrix and eigenvalues
function calc_eigenvectors(mat, eigenvalues) {
    let gaussianMatrix = GaussianElimination(createMatrixArray(removeLambda(mat, eigenvalues)));
    gaussianMatrix = gaussianMatrix.map(cols => cols.map(value => isNaN(value) ? 0 : value));
    gaussianMatrix = gaussianMatrix.map(cols => cols.map(value => !isFinite(value) ? 1 : value));
    gaussianMatrix = gaussianMatrix.map(cols => cols.map(rows => rows.toFixed(5)));

    return (solveEquation(gaussianMatrix));
}