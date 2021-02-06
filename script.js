const silde_bar = document.getElementById('board_size')
const board_size = 480
let cell_size

window.onload = () => {
    build_board(8)
}

silde_bar.addEventListener('change', (event) => {
    size = parseInt(event.target.value)
    build_board(size)
})

function build_board(size){
    cell_size = size
    const board = document.getElementById('board')
    board.innerHTML = ''
    for (let i = 0; i < size; i++){
        const new_row = document.createElement('div')
        new_row.className = 'row'
        for (let j = 0; j < size; j++){
            const new_cell = document.createElement('div')
            new_cell.className = 'cell'
            new_cell.id = i + '-' + j
            new_cell.style.width = (board_size / size) + 'px'
            new_cell.style.height = (board_size / size) + 'px'

            if ((i == size / 2 && j == size / 2) || (i == size / 2 - 1 && j == size / 2 - 1))
                new_cell.appendChild(getimg(size, 'white'))
            if ((i == size / 2 && j == size / 2 - 1) || (i == size / 2 - 1 && j == size / 2))
                new_cell.appendChild(getimg(size, 'black'))
            new_row.appendChild(new_cell)
        }
        board.appendChild(new_row)
    }
    const show_cellcnt = document.getElementById('cell_cnt')
    show_cellcnt.innerHTML = `${size}칸 × ${size}칸`
}

function getimg(color, trans=false){
    const ret = document.createElement('img')
    ret.width = board_size / cell_size - 10
    ret.src = `image/${color}`
    if (trans)
        ret.src += '_transparent'
    ret.src += '.png'
    return ret
}