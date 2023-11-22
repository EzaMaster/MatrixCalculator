function find_Sub_Matrix(matrix, index){
    let m = {
        rows: matrix.rows - 1,
        cols: matrix.cols - 1,
        data: []
    }
    let i = 0;
    for(let r = 0; r < matrix.rows; ++r){
        for(let c = 0; c < matrix.cols; ++c){
            if(c != index && r != 0){
                m.data[i++] = matrix.data[r * matrix.cols + c];
            }
        }
    }
    return m;
}
function calc_det_2x2(data){
    return (data[0] * data[3]) - (data[1] * data[2]);
}
function calc_det_3x3(data){
    let a = (data[0] * data[4] * data[8]) + 
            (data[1] * data[5] * data[6]) + 
            (data[2] * data[3] * data[7]);

    let b = -(data[2] * data[4] * data[6]) - 
             (data[0] * data[5] * data[7]) - 
             (data[1] * data[3] * data[8]);
    return a + b;
}
function calc_det(matrix){
    if(matrix.rows === 1 && matrix.cols === 1){
        return matrix.data[0];
    }else if(matrix.rows === 2 && matrix.cols === 2){
        return calc_det_2x2(matrix.data);
    }else if(matrix.rows === 3 && matrix.cols === 3){
        return calc_det_3x3(matrix.data);
    }else{
        let det = 0;
        for(let r = 0; r < matrix.rows; ++r){
            det += r % 2 == 0 ? matrix.data[r] * calc_det(find_Sub_Matrix(matrix, r)) : 
                                -matrix.data[r] * calc_det(find_Sub_Matrix(matrix, r));
        }
        return det;
    }
}