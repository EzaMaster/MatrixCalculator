// Elements and variables for matrix manipulation
const body = document.querySelector("body");

let matrix_Div = document.querySelector(".matrix");
let matrix_conteiner_Div = document.querySelector(".matrix_01");
let matrix_inputs = document.querySelectorAll("#matrix_A input");
const function_Div = document.querySelector(".functions");
const modal = document.querySelector(".modal");
const title = document.getElementById("title");

// Initial matrix structure
let opt_button = false;
let matrix = {
    rows: 3,
    cols: 3,
    data: []
};
let matrix_B = {
    rows: 3,
    cols: 3,
    data: []
}
// ---------------Suport Functions--------------

// function to create stuff(div, p, pre...)
function createStuff(content, where, classL, jd, text) {
    const stuff = document.createElement(content);
    if (classL) {
        stuff.classList.add(classL);
    }
    if (jd) {
        stuff.id = jd;
    }
    if (text !== null) {
        stuff.textContent = text;
    }
    where.appendChild(stuff);
    return stuff;
}

// modal function for the result
const toggleModal = () => {
    const bodyClassList = document.body.classList;

    if (bodyClassList.contains("open")) {
      bodyClassList.remove("open");
      bodyClassList.add("closed");
      modal.removeChild(modal.lastChild);
      title.textContent = "";
    } else {
      bodyClassList.remove("closed");
      bodyClassList.add("open");
    }
};


// Check if all matrix data cells are filled
function check_data(m){
    for(let i = 0; i < m.rows * m.cols; ++i){
        if(m.data[i] == null || m.data[i] == ""){
            return false;
        }
    }
    return true;
}
// Create a formatted matrix inside a content element
function createMatrix(m, content) {
    content.textContent = "";
    content.classList.add("output_number");

    const columnWidths = Array.from({ length: m.cols }, () => 0);

    // Calculate the maximum width for each column
    for (let r = 0; r < m.rows; ++r) {
        for (let c = 0; c < m.cols; ++c) {
            const value = String(m.data[r * m.cols + c]);
            columnWidths[c] = Math.max(columnWidths[c], value.length);
        }
    }

    // Build the formatted matrix
    for (let r = 0; r < m.rows; ++r) {
        for (let c = 0; c < m.cols; ++c) {
            const value = String(m.data[r * m.cols + c]);
            const formattedValue = value.padStart(columnWidths[c] + value.length - value.trimStart().length);
            content.textContent += formattedValue;
            if (c + 1 !== m.cols) {
                content.textContent += "   ";
            }
        }
        content.textContent += "\n";
    }
}
// Function to create a new PopUp
function createPopup(text){
    const popup_Div = createStuff("div", body, "popup", null, null);
    const popup_content = createStuff("div", popup_Div, "popup-content", null, null);
    createStuff("p", popup_content, null, null, text);

    const popup_button = createStuff("button", popup_content, null, "popupOkButton", "OK");
    popup_button.onclick = function() {
        body.removeChild(body.lastChild);
    };
}

// functions for adding and subtracting rows and columns
function addRow(m, div, ipt) {
    if (m.rows < 6) {
        ++m.rows;
        // create new inputs
        for(let i = 0; i < m.cols; ++i){
            let new_input = document.createElement("input");
            new_input.type = "number";
            div.appendChild(new_input);
        }
    
        div.style.gridTemplateRows = `repeat(${m.rows}, 1fr)`;

        const mat = m == matrix ? "#matrix_A" : "#matrix_B";
        ipt = document.querySelectorAll(`${mat} input`);
        ipt.forEach(function(input) {
            input.addEventListener("input", function(event) {
                const targetInput = event.target;
                const inputValue = targetInput.value;
                const inputIndex = Array.from(ipt).indexOf(targetInput);
                m.data[inputIndex] = inputValue;
            });
        });
    }
}
function subRow(m, div, ipt) {
    if(m.rows > 2){
        --m.rows;
        // remove new inputs
        for(let i = 0; i < m.cols; ++i){
            const children = div.children;
            div.removeChild(children[children.length - 1]);
        }

        const mat = m == matrix ? "#matrix_A" : "#matrix_B";
        div.style.gridTemplateRows = `repeat(${m.rows}, 1fr)`;
        ipt = document.querySelectorAll(`${mat} input`);
    }
}
function addCol(m, div,ipt) {
    let k = opt_button ? 5 : 10;
    if (m.cols < k) {
        ++m.cols;
        // create new inputs
        for(let i = 0; i < m.rows; ++i){
            let new_input = document.createElement("input");
            new_input.type = "number";
            div.appendChild(new_input);
        }
        div.style.gridTemplateColumns = `repeat(${m.cols}, 1fr)`;

        const mat = m == matrix ? "#matrix_A" : "#matrix_B";
        ipt = document.querySelectorAll(`${mat} input`);
        ipt.forEach(function(input) {
            input.addEventListener("input", function(event) {
                const targetInput = event.target;
                const inputValue = targetInput.value;
                const inputIndex = Array.from(ipt).indexOf(targetInput);
                m.data[inputIndex] = inputValue;
            });
        });
    }
}
function subCol(m, div, ipt) {
    if(m.cols > 2){
        --m.cols;
        // remove new inputs
        for(let i = 0; i < m.rows; ++i){
            const children = div.children;
            div.removeChild(children[children.length - 1]);
        }
        const mat = m == matrix ? "#matrix_A" : "#matrix_B";
        div.style.gridTemplateColumns = `repeat(${m.cols}, 1fr)`;
        ipt = document.querySelectorAll(`${mat} input`);
    }
}

// functions----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Matrix input event listeners to update matrix data
matrix_inputs.forEach(function(input) {
    input.addEventListener("input", function(event) {
        const targetInput = event.target;
        const inputValue = targetInput.value;
        const inputIndex = Array.from(matrix_inputs).indexOf(targetInput);
        matrix.data[inputIndex] = inputValue;
    });
});
// Button function for determinant calculations
function determinat() {
    if(matrix.rows === matrix.cols){
        if(check_data(matrix)){
            toggleModal();

            const modalContent = createStuff("div", modal, "modal-content", null, null);
            // title
            title.textContent = "Determinant";
            // matrix A
            const out_matrix_A = createStuff("pre", modalContent, null, null, null);
            createMatrix(matrix, out_matrix_A);
            // =
            createStuff("mo", modalContent, null, null, "=");
            // determinant result
            
            createStuff("span", modalContent, null, null, calc_det(matrix));
        }else{
            // Complete the matrix
            createPopup("Complete the matrix!");
        }
    }else{
        // Determinant of a non-square matrix is undefined!
        createPopup("Determinant of a non-square matrix is undefined!");
    }
}
// Button function for Rank calculations
function rank(){
    if(check_data(matrix)){
        toggleModal();

        const modalContent = createStuff("div", modal, "modal-content", null, null);
        // title
        title.textContent = "Rank";
        // matrix A
        const out_matrix_A = createStuff("pre", modalContent, null, null, null);
        createMatrix(matrix, out_matrix_A);
        // =
        createStuff("mo", modalContent, null, null, "=");
        // Rank result
        createStuff("span", modalContent, null, null, calc_rank(matrix));
    }else{
        // Complete the matrix
        createPopup("Complete the matrix!");
    }
}
// Button function for Eigenvalues & Eigenvectors calculations
function eigenvalues() {
    if(matrix.rows === matrix.cols){
        if(check_data(matrix)){
            toggleModal();

            const modalContent = createStuff("div", modal, "modal-content", null, null);
            // title
            title.textContent = "Eigenvalues & Eigenvectors";
            // matrix A
            const out_matrix_A = createStuff("pre", modalContent, null, null, null);
            createMatrix(matrix, out_matrix_A);
            // =
            createStuff("mo", modalContent, null, null, ":");


            const eigenvalues = [...new Set(calc_eigenvalues(matrix).map(value => isNaN(value) ? 0 : value).map(num => num.toFixed(3)))];
            console.log(eigenvalues);
            for (let i = 0; i < eigenvalues.length; i++) {
                createStuff("span", modalContent, null, null, Math.abs(eigenvalues[i]));
                createStuff("mo", modalContent, null, null, "➔");
                const eigsvector = createStuff("pre", modalContent, "res", null, null);
                const mat = {
                    rows: matrix.rows,
                    cols: 1,
                    data: []
                }
                mat.data = calc_eigenvectors(matrix, eigenvalues[i]).map(valore => valore.replace(/[()]/g, ''));
                
                createMatrix(mat, eigsvector);
                if (i + 1 !== eigenvalues.length) {
                    createStuff("mo", modalContent, null, null, ",");
                }
            }
        }else{
            // Complete the matrix
            createPopup("Complete the matrix!");
        }
    }else{
        // Determinant of a non-square matrix is undefined!
        createPopup("Eigenvalues of a non-square matrix is undefined!");
    }
}
// Button function for inverse matrix calculations
function inverse() {
    if(matrix.rows === matrix.cols){
        if(check_data(matrix)){
            const invertible = calc_det(matrix);
            if (invertible !== 0) {
                toggleModal();
    
                const modalContent = createStuff("div", modal, "modal-content", null, null);
                // title
                title.textContent = "Inverse Matrix";
                // matrix A
                const out_matrix_A = createStuff("pre", modalContent, null, null, null);
                createMatrix(matrix, out_matrix_A);
                // =
                createStuff("mo", modalContent, null, null, "=");
                // determinant result
                const out_inverse_matrix = createStuff("pre", modalContent, "res", null, null);
                createMatrix(calc_inverse(matrix), out_inverse_matrix);
            }else {
                // Matrix is not invertible
                createPopup("Matrix is not invertible!");
            }
        }else{
            // Complete the matrix
            createPopup("Complete the matrix!");
        }
    }else{
        // Determinant of a non-square matrix is undefined!
        createPopup("Inverse of a non-square matrix is undefined!");
    }
}


function clean(m) {
    const mat = m == matrix ? "#matrix_A" : "#matrix_B";
    const inputs = document.querySelectorAll(`${mat} input`);
    inputs.forEach(function(input){
        input.value = null;
    })
    m.data = [];
}

// operations ----------------------------------------------------------------------------------------------------------------------------------------------------------------
function operations() {
    if(!opt_button){
        function_Div.style.display = "none";
        opt_button = true;



        if (matrix_conteiner_Div.classList.contains("slide-in-elliptic-right-fwd")) {
            matrix_conteiner_Div.classList.remove("slide-in-elliptic-right-fwd");
        }

        // operators div
        const operations_Div = createStuff("div", body, "operations", null, null);
        // Back button    
        const back_button = createStuff("button", operations_Div, null, null, "Back");
        back_button.onclick = function() {
            back(operations_Div, new_matrix_conteiner);
        };
        // A + B
        const add_operator = createStuff("button", operations_Div, null, null, "A+B");
        add_operator.onclick = function() {
            add_matrix();
        };
        // A - B
        const subtract_operator = createStuff("button", operations_Div, null, null, "A-B");
        subtract_operator.onclick = function() {
            subtract_matrix();
        };
        // A * B
        const times_operator = createStuff("button", operations_Div, null, null, "A×B");
        times_operator.onclick = function() {
            times_matrix();
        };
        // new Matrix conteiner
        const new_matrix_conteiner = createStuff("div", body, "matrix_01", null, null);
        new_matrix_conteiner.classList.add("slide-in-elliptic-left-fwd");
        // new Matrix Div
        const new_matrix_Div = createStuff("div", new_matrix_conteiner, "matrix", "matrix_B", null);
        // imputs for matrix B
        for(let i = 0; i < matrix_B.cols * matrix_B.rows; ++i){
            const new_input = document.createElement("input");
            new_input.type = "number";
            new_matrix_Div.appendChild(new_input);
        }
        // + row Div
        const tmp_add_row_Div = createStuff("div", new_matrix_conteiner, "add_row", null, null);
        // + row button
        const tmp_add_row_button = createStuff("button", tmp_add_row_Div, null, "add_row", "+");
        tmp_add_row_button.onclick = function() {
            addRow(matrix_B, new_matrix_Div, matrix_B_inputs);
        };
        // - row button
        const tmp_sub_row_button = createStuff("button", tmp_add_row_Div, null, "subtract_row", "-");
        tmp_sub_row_button.onclick = function() {
            subRow(matrix_B, new_matrix_Div, matrix_B_inputs);
        };
        // new clean button
        const new_clean_button = createStuff("i", tmp_add_row_Div, "bx", null, null);
        new_clean_button.classList.add("bx-trash");
        new_clean_button.onclick = function() {
            clean(matrix_B);
        };
        // + col Div
        const tmp_add_col_Div = createStuff("div", new_matrix_conteiner, "add_collumn", null, null);
        // + col button
        const tmp_add_col_button = createStuff("button", tmp_add_col_Div, null, "add_col", "+");
        tmp_add_col_button.onclick = function() {
            addCol(matrix_B, new_matrix_Div, matrix_B_inputs);
        };
        // - col button
        const tmp_sub_col_button = createStuff("button", tmp_add_col_Div, null, "subtract_col", "-");
        tmp_sub_col_button.onclick = function() {
            subCol(matrix_B, new_matrix_Div, matrix_B_inputs);
        };

        // matrix B inputs
        let matrix_B_inputs = document.querySelectorAll("#matrix_B input");
        matrix_B_inputs.forEach(function(input) {
            input.addEventListener("input", function(event) {
                const targetInput = event.target;
                const inputValue = targetInput.value;
                const inputIndex = Array.from(matrix_B_inputs).indexOf(targetInput);
                matrix_B.data[inputIndex] = inputValue;
            });
        });
    }
}

// functions for operations----------------------------------------------------------------------------------------------------------------------------------------------------------------
function back(m,n) {
    body.removeChild(m);
    body.removeChild(n);
    function_Div.style.display = "flex";
    opt_button = false;

    matrix_conteiner_Div.classList.add("slide-in-elliptic-right-fwd");
}
function add_matrix() {
    if((matrix_B.rows === matrix.rows) && (matrix_B.cols === matrix.cols)){
        if(check_data(matrix) && check_data(matrix_B)){
            toggleModal();
            
            const modalContent = createStuff("div", modal, "modal-content", null, null);
            // title
            title.textContent = "Sum A + B";
            // matrix A
            const out_matrix_A = createStuff("pre", modalContent, null, null, null);
            createMatrix(matrix, out_matrix_A);
            // +
            createStuff("mo", modalContent, null, null, "+");
            // matrix B
            const out_matrix_B = createStuff("pre", modalContent, null, null, null);
            createMatrix(matrix_B, out_matrix_B);

            // =
            createStuff("mo", modalContent, null, null, "=");
            // matrix result
            const out_matrix_sum = createStuff("pre", modalContent, "res", null, null);
            createMatrix(add_data(matrix.data, matrix_B.data, matrix.rows, matrix.cols), out_matrix_sum);
    
            insert(modalContent, add_data(matrix.data, matrix_B.data, matrix.rows, matrix.cols));
        }else{
            createPopup("Complete the matrices!");
        }
    }else{
        createPopup("Matrices must be of the same size!");
    }
}

function subtract_matrix() {
    if((matrix_B.rows === matrix.rows) && (matrix_B.cols === matrix.cols)){
        if(check_data(matrix) && check_data(matrix_B)){
            toggleModal();
    
            const modalContent = createStuff("div", modal, "modal-content", null, null);
            // title
            title.textContent = "Subtract A - B";
            // matrix A
            const out_matrix_A = createStuff("pre", modalContent, null, null, null);
            createMatrix(matrix, out_matrix_A);
            // -
            createStuff("mo", modalContent, null, null, "-");
            // matrix B
            const out_matrix_B = createStuff("pre", modalContent, null, null, null);
            createMatrix(matrix_B, out_matrix_B);
            // =
            createStuff("mo", modalContent, null, null, "=");
            // matrix result
            const out_matrix_sub = createStuff("pre", modalContent, "res", null, null);
            createMatrix(sub_data(matrix.data, matrix_B.data, matrix.rows, matrix.cols), out_matrix_sub);

            insert(modalContent, sub_data(matrix.data, matrix_B.data, matrix.rows, matrix.cols));
        }else{
            createPopup("Complete the matrices!");
        }
    }else{
        createPopup("Matrices must be of the same size!");
    }
}
function times_matrix() {
    if(matrix_B.rows === matrix.cols){
        if(check_data(matrix) && check_data(matrix_B)){
            toggleModal();

            const modalContent = createStuff("div", modal, "modal-content", null, null);
            // title
            title.textContent = "Times A × B";
            // matrix A
            const out_matrix_A = createStuff("pre", modalContent, null, null, null);
            createMatrix(matrix, out_matrix_A);
            // -
            createStuff("mo", modalContent, null, null, "×");
            // matrix B
            const out_matrix_B = createStuff("pre", modalContent, null, null, null);
            createMatrix(matrix_B, out_matrix_B);
            // =
            createStuff("mo", modalContent, null, null, "=");
            // matrix result
            const out_matrix_times = createStuff("pre", modalContent, "res", null, null);
            createMatrix(times_data(matrix, matrix_B), out_matrix_times);

            insert(modalContent, times_data(matrix, matrix_B));
        }else{
            createPopup("Complete the matrices!");
        }
    }else{
        createPopup("Matrices are not conformable!");
    }
}

function insert(content, res) {
    const insert_Div = createStuff("div", content, "insert", null, null);
    // insert a button
    const insert_a = createStuff("button", insert_Div, null, null, "⤽A");
    insert_a.onclick = function () {
        const matrixInputs = document.querySelectorAll("#matrix_A input");
        let tmp = res;
        matrixInputs.forEach(function(input,index){
            input.value = tmp.data[index];
            matrix.data[index] = tmp.data[index];
        })
        toggleModal();
    }
    // insert b button
    const insert_b = createStuff("button", insert_Div, null, null, "⤽B");
    insert_b.onclick = function () {
        const matrixInputs = document.querySelectorAll("#matrix_B input");
        let tmp = res;
        matrixInputs.forEach(function(input,index){
            input.value = tmp.data[index];
            matrix_B.data[index] = tmp.data[index];
        })
        toggleModal();
    }
}