function calc_rank(matrix) {
    
    const m = matrix.rows;
    const n = matrix.cols;
    let data = matrix.data.slice();
    let rank_max = Math.min(m, n);

    for (let c = 0; c < rank_max; ++c) {
        for (let r = 0; r < m; ++r) {
            if (r !== c) {
                const factor = data[r * n + c] / data[c * n + c];
                for (let k = c; k < n; ++k) {
                    data[r * n + k] -= factor * data[c * n + k];
                }
            }
        }
    }

    // Count the rows non Null
    let nonZeroRows = 0;
    for (let r = 0; r < m; ++r) {
        let isNonZero = false;
        for (let c = 0; c < n; ++c) {
            if (Math.abs(data[r * n + c]) > 1e-10) {
                isNonZero = true;
                break;
            }
        }
        if (isNonZero) {
            nonZeroRows++;
        }
    }

    return nonZeroRows;
}