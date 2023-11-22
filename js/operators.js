function add_data(data1, data2, r, c){
    const add = {
        rows: r,
        cols: c,
        data: []
    }
    for(let i = 0; i < r*c; ++i){
        add.data[i] = Number(data1[i]) + Number(data2[i]);
    }
    return add;
}
function sub_data(data1, data2, r,c){
    const sub = {
        rows: r,
        cols: c,
        data: []
    }
    for(let i = 0; i < r*c; ++i){
        sub.data[i] = Number(data1[i]) - Number(data2[i]);
    }
    return sub;
}
function times_data(m_A, m_B){
    let result = [];
    for (let r = 0; r < m_A.rows; ++r) {
        for (let c = 0; c < m_B.cols; ++c) {
            let sum = 0;
            for (let k = 0; k < m_A.cols; ++k) {
                sum += m_A.data[r * m_A.cols + k] * m_B.data[k * m_B.cols + c];
            }
            result.push(sum);
        }
    }
    const times = {
        rows: m_A.rows,
        cols: m_B.cols,
        data: result
    }
    return times;
}
