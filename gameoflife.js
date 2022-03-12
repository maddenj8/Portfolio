var cell_size = 10
var board = []
var generations = 0 // count the generations that have passed
var max_alive = 1200
var alive_count = 0
var fr = 30
var count = 0
var animate = false
var parent_div = document.getElementById('gol-container');

var cvs_size = parent_div.offsetWidth;
var rnum
var slider

var scaled_x
var scaled_y
var current_selected = 'block'

// var shapes = ['blinker', 'toad', 'block', 'beacon', 'pulsar', 'pentadecathelon', 'glider', 'lwss', 'glider_gun']
var shapes = {
    'blinker': [1, 3],
    'toad': [2, 4],
    'block': [2, 2],
    'beacon': [4, 4],
    'pulsar': [13, 13],
    'pentadecathelon': [10, 3],
    'glider': [3, 3],
    'lwss': [4, 5],
    'glider_gun': [9, 36]
}

function setup() {
    var canvas = createCanvas(parent_div.offsetWidth,parent_div.offsetWidth);
    canvas.parent('gol-container')
    for (var i = 0; i < cvs_size/cell_size; i++) {
        board.push([]) // add row to board
        for (var j = 0; j < cvs_size/cell_size; j++) {
            board[i][j] = {state:0, new_state:0, y:i, x:j}
            // 0 = dead, 255 = alive
        }  
    }

    fill(0)
    strokeWeight(1)
    stroke(70)
    for (var i = 0; i < cvs_size/cell_size; i++) { // draw the initial board state
        for (var j = 0; j < cvs_size/cell_size; j++) {
            fill(board[i][j].state*255) // color depending on alive or not
            rect(j * cell_size, i * cell_size, cell_size, cell_size) // draw rect corresponding to board
        }
    }

    // slider = createSlider(1, 30, 30, 1);
    // slider.position(0, 0)
    current_selected = document.getElementById('shape-select').value
}

function draw() {
    // background('grey');
    frameRate(15)
    fill(fr)
    if (animate) {
        nextGeneration()
    }
    else
        drawPaused()
    count++
    hoverCell()
}

function checkIfAlive(i, j) {
    // cell neighbours > 3 dies by overpopulation
    // cell neighbours < 2 dies by underpopulation
    // cell neighbours == 2 || cell neighbours == 3 live
    // dead cell neighbours == 3 live

    //STEPS
    // get live neighbours of the cell
    // apply the checks above
    // change current cells status depending

    // neighbour is eight squares around the current cell
    var neighbours = getCellNeighbours(i, j)
    if (board[i][j].state == 0 && neighbours == 3) board[i][j].new_state = 1// born from reproduction
    else if (neighbours < 2) board[i][j].new_state = 0 // die from lonliness
    else if (neighbours > 3) board[i][j].new_state = 0 // die from overpopulation
    else if ((neighbours == 2 || neighbours == 3) && board[i][j].state == 1) board[i][j].new_state = 1 // survive

}

function drawPaused() {
    board.forEach((row) => {
        row.forEach((cell) => {
            fill(cell.state*255)
            rect(cell.x * cell_size, cell.y * cell_size, cell_size, cell_size)
        })
    })
}

function getCellNeighbours(i, j) {
    var neighbours = 0 
    if (board[i - 1]) {
        if (board[i-1][j-1] && board[i-1][j-1].state == 1) neighbours++ // top left
        if (board[i-1][j+1] && board[i-1][j+1].state == 1) neighbours++ // top right
        if (board[i-1][j] && board[i-1][j].state == 1) neighbours++ // top
    }
    if (board[i+1]) {
        if (board[i+1][j-1] && board[i+1][j-1].state == 1) neighbours++ // bottom left
        if (board[i+1][j+1] && board[i+1][j+1].state == 1) neighbours++ // bottom right
        if (board[i+1][j] && board[i+1][j].state == 1) neighbours++ // bottom
    }
    if (board[i][j+1] && board[i][j+1].state == 1) neighbours++ // right 
    if (board[i][j-1] && board[i][j-1].state == 1) neighbours++ // left
        
    return neighbours
}

function nextGeneration() { 
    for (var i = 0; i < cvs_size/cell_size; i++) {
        for (var j = 0; j < cvs_size/cell_size; j++) {
            checkIfAlive(i, j) // update particular cell depending on neighbours, update new_state only
        }
    }
    for (var i = 0; i < cvs_size/cell_size; i++) {
        for (var j = 0; j < cvs_size/cell_size; j++) {
            board[i][j].state = board[i][j].new_state // update current state with calculated state
            fill(board[i][j].state*255) // color depending on alive or not
            rect(j * cell_size, i * cell_size, cell_size, cell_size) // draw rect corresponding to board
        }
    }
    generations++ // every frame update inc generation
    // document.getElementById('gen_count').innerHTML = 'Generation: ' + generations
}

function generateShape(shape_name, i, j) {
    // generate specific shapes at randomly generated i and j positions
    switch(shape_name) {
        case 'block':
            console.log('Generating Block shape')
            board[i][j].state = 1
            board[i][j+1].state = 1
            board[i+1][j+1].state = 1
            board[i+1][j].state = 1
            break
        case 'blinker':
            console.log('Generating Blinker shape')
            board[i][j].state = 1
            board[i][j-1].state = 1
            board[i][j+1].state = 1
            break
        case 'toad':
            console.log('Generating Toad shape')
            board[i][j].state = 1
            board[i][j-1].state = 1
            board[i][j+1].state = 1
            board[i+1][j].state = 1
            board[i+1][j+1].state = 1
            board[i+1][j+2].state = 1
            break
        case 'beacon':
            console.log('Generating Beacon shape')
            board[i][j].state = 1
            board[i][j+1].state = 1
            board[i+1][j+1].state = 1
            board[i+1][j].state = 1

            board[i+2][j+2].state = 1
            board[i+2][j+3].state = 1
            board[i+3][j+3].state = 1
            board[i+3][j+2].state = 1
            break
        case 'pulsar':
            console.log('Generating Pulsar shape')
            // -- top left -- //

            // top
            board[i][j].state = 1
            board[i][j-1].state = 1
            board[i][j+1].state = 1

            // bottom
            board[i+5][j-1].state = 1
            board[i+5][j].state = 1
            board[i+5][j+1].state = 1

            // right
            board[i+2][j+2].state = 1
            board[i+3][j+2].state = 1
            board[i+4][j+2].state = 1

            // left
            board[i+2][j-3].state = 1
            board[i+3][j-3].state = 1
            board[i+4][j-3].state = 1

            // -- bottom left -- //

            //top
            board[i+7][j].state = 1
            board[i+7][j+1].state = 1
            board[i+7][j-1].state = 1

            // bottom
            board[i+12][j].state = 1
            board[i+12][j+1].state = 1
            board[i+12][j-1].state = 1

            // right
            board[i+10][j+2].state = 1
            board[i+9][j+2].state = 1
            board[i+8][j+2].state = 1

            // left
            board[i+9][j-3].state = 1
            board[i+10][j-3].state = 1
            board[i+8][j-3].state = 1

            // -- top right -- //

            // top
            board[i][j+5].state = 1
            board[i][j+6].state = 1
            board[i][j+7].state = 1

            // bottom
            board[i+5][j+5].state = 1
            board[i+5][j+6].state = 1
            board[i+5][j+7].state = 1

            // left
            board[i+4][j+4].state = 1
            board[i+2][j+4].state = 1
            board[i+3][j+4].state = 1

            // right
            board[i+2][j+9].state = 1
            board[i+3][j+9].state = 1
            board[i+4][j+9].state = 1

            // -- bottom right -- // 

            // top
            board[i+7][j+5].state = 1
            board[i+7][j+6].state = 1
            board[i+7][j+7].state = 1

            // bottom
            board[i+12][j+7].state = 1
            board[i+12][j+5].state = 1
            board[i+12][j+6].state = 1

            // right
            board[i+10][j+9].state = 1
            board[i+8][j+9].state = 1
            board[i+9][j+9].state = 1

            board[i+10][j+4].state = 1
            board[i+8][j+4].state = 1
            board[i+9][j+4].state = 1
            break
        case 'pentadecathelon':
            board[i][j].state = 1
            board[i+1][j].state = 1
            board[i+2][j-1].state = 1
            board[i+2][j+1].state = 1
            board[i+3][j].state = 1
            board[i+4][j].state = 1
            board[i+5][j].state = 1
            board[i+6][j].state = 1
            board[i+7][j-1].state = 1
            board[i+7][j+1].state = 1
            board[i+8][j].state = 1
            board[i+9][j].state = 1
            break
        case 'glider':
            board[i][j].state = 1
            board[i-1][j].state = 1
            board[i+1][j].state = 1
            board[i+1][j+1].state = 1
            board[i][j+2].state = 1
            break
        case 'lwss': // light weight space ship
            board[i][j].state = 1
            board[i][j+3].state = 1
            board[i+1][j+4].state = 1
            board[i+2][j+4].state = 1
            board[i+3][j+4].state = 1
            board[i+3][j+3].state = 1
            board[i+3][j+2].state = 1
            board[i+3][j+1].state = 1
            board[i+2][j].state = 1
            break
        case 'glider_gun':
            // left block
            board[i+4][j].state = 1
            board[i+4][j+1].state = 1
            board[i+5][j].state = 1
            board[i+5][j+1].state = 1

            // right block
            board[i+2][j+34].state = 1
            board[i+2][j+35].state = 1
            board[i+3][j+34].state = 1
            board[i+3][j+35].state = 1

            // left glider
            board[i+2][j+12].state = 1
            board[i+2][j+13].state = 1
            board[i+3][j+11].state = 1
            board[i+4][j+10].state = 1
            board[i+5][j+10].state = 1
            board[i+6][j+10].state = 1
            board[i+7][j+11].state = 1
            board[i+8][j+12].state = 1
            board[i+8][j+13].state = 1
            board[i+5][j+14].state = 1
            board[i+5][j+16].state = 1
            board[i+5][j+17].state = 1
            board[i+4][j+16].state = 1
            board[i+6][j+16].state = 1
            board[i+3][j+15].state = 1
            board[i+7][j+15].state = 1

            // right glider
            board[i+4][j+20].state = 1
            board[i+3][j+20].state = 1
            board[i+2][j+20].state = 1
            board[i+4][j+21].state = 1
            board[i+3][j+21].state = 1
            board[i+2][j+21].state = 1
            board[i+5][j+22].state = 1
            board[i+1][j+22].state = 1
            board[i+5][j+24].state = 1
            board[i+1][j+24].state = 1
            board[i+6][j+24].state = 1
            board[i][j+24].state = 1

    }
}

function clearBoard() { 
    board.forEach((row) => {
        row.forEach((cell) => {
            cell.state = 0
        })
    })    
    nextGeneration()
    generations = 0
}

function hoverCell() {
    scaled_x = floor(mouseX / cell_size)
    scaled_y = floor(mouseY / cell_size)
    fill(color(204, 204, 255, 127))
    rect(scaled_x*cell_size, scaled_y*cell_size, shapes[current_selected][1] * cell_size, shapes[current_selected][0] * cell_size)
}

function toggleAnimate() {
    animate = !animate
}

document.getElementById('gol-container').addEventListener('click', () => {
    generateShape(document.getElementById('shape-select').value, scaled_y, scaled_x)
})

document.getElementById('shape-select').addEventListener('change', (event) => {
    current_selected = event.target.value
})