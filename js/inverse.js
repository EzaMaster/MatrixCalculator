// Function to calculate the greatest common divisor (GCD) of two numbers
function GCD(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);

    while (b) {
        const temp = b;
        b = a % b;
        a = temp;
    }

    return a;
}

// Function to calculate the inverse of a matrix
function calc_inverse(m) {
    // Calculate the determinant of the matrix
    let det = calc_det(m);

    // Initialize the inverse matrix with the same dimensions as the input matrix
    const inverseM = {
        rows: m.rows,
        cols: m.cols,
        data: []
    }

    // Loop through each element of the matrix
    for (let r = 0; r < m.rows; ++r) {
        for (let c = 0; c < m.cols; ++c) {
            // Create a matrix of minors by excluding the current row and column
            let cMinors = {
                rows: m.rows - 1,
                cols: m.cols - 1,
                data: []
            }

            // Populate the matrix of minors
            for (let r1 = 0; r1 < m.rows; ++r1) {
                for (let c1 = 0; c1 < m.cols; ++c1) {
                    if (r1 !== r && c1 !== c) {
                        cMinors.data.push(m.data[r1 * m.cols + c1]);
                    }
                }
            }

            // Calculate the determinant of the matrix of minors
            let cMinorsDet = calc_det(cMinors);

            // Apply the cofactor sign based on the element's position
            if ((r + c) % 2 !== 0) {
                cMinorsDet = -cMinorsDet;
            }

            // Store the cofactor in the inverse matrix
            inverseM.data[c * m.cols + r] = cMinorsDet;
        }
    }

    // Scale the elements of the inverse matrix by 1/det
    for (let r = 0; r < m.rows; ++r) {
        for (let c = 0; c < m.cols; ++c) {
            let n = inverseM.data[r * m.cols + c];
            let k = 0;
            let tmpDet = det;

            // Check if the element is divisible by the determinant
            if (n % tmpDet === 0) {
                k = n / tmpDet;
            } else {
                // Reduce the fraction using the greatest common divisor
                let gcd = GCD(n, tmpDet);
                n /= gcd;
                tmpDet /= gcd;

                // Format the fraction as a string
                if (n < 0 && tmpDet < 0) {
                    k = -n + "/" + -tmpDet;
                } else if (n > 0 && tmpDet < 0) {
                    k = -n + "/" + (-tmpDet);
                } else if (n === 0) {
                    k = 0;
                } else {
                    k = n + "/" + tmpDet;
                }
            }

            // Update the element in the inverse matrix
            inverseM.data[r * m.cols + c] = k;
        }
    }

    // Return the inverse matrix
    return inverseM;
}
