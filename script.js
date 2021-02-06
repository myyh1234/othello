const silde_bar = document.getElementById('board_size')
const board_size = 480
let cell_count = 8
let board_state = [] // undefined = 비어 있음 0 : 흑 1 : 백
let lay_count = 0 // mod 2 = 0 : 흑 1 : 백
const color_list = ['black', 'white']
const color_hangul = ['흑', '백']
let left_count = [2, 2]

const dx = [-1, 0, 1, -1, 1, -1, 0, 1], dy = [-1, -1, -1, 0, 0, 1, 1, 1]

window.addEventListener('load', () => {
    build_board(8)
})

silde_bar.addEventListener('change', (event) => {
    cell_count = parseInt(event.target.value)
    build_board(cell_count)
})

function build_board(size){
    cell_count = size
    const board = document.getElementById('board')
    board.innerHTML = ''
    board_state = []
    left_count[0] = 2
    left_count[1] = 2
    for (let i = 0; i < size; i++){
        board_state.push([])
        const new_row = document.createElement('div')
        new_row.className = 'row'
        for (let j = 0; j < size; j++){
            board_state[board_state.length - 1].push(undefined)
            const new_cell = document.createElement('div')
            new_cell.className = 'cell'
            new_cell.id = i + '-' + j
            new_cell.style.width = (board_size / size) + 'px'
            new_cell.style.height = (board_size / size) + 'px'
            new_cell.addEventListener('mouseenter', _hover)
            new_cell.addEventListener('mouseleave', leave)
            new_cell.addEventListener('click', lay)
            if ((i == size / 2 && j == size / 2) || (i == size / 2 - 1 && j == size / 2 - 1)){
                board_state[i][j] = 1
                new_cell.appendChild(getimg('white'))
            }
            if ((i == size / 2 && j == size / 2 - 1) || (i == size / 2 - 1 && j == size / 2)){
                board_state[i][j] = 0
                new_cell.appendChild(getimg('black'))
            }
            new_row.appendChild(new_cell)
        }
        board.appendChild(new_row)
    }
    const show_cellcnt = document.getElementById('cell_cnt')
    show_cellcnt.innerHTML = `${size}칸 × ${size}칸`
}

const _hover = function(){
    const nx = parseInt(this.id.split('-')[1])
    const ny = parseInt(this.id.split('-')[0])
    if (board_state[ny][nx] === undefined){
        if (lay_count % 2 == 0)
            this.appendChild(getimg('black', true))
        else
            this.appendChild(getimg('white', true))
    }
}

const leave = function(){
    const nx = parseInt(this.id.split('-')[1])
    const ny = parseInt(this.id.split('-')[0])
    if (board_state[ny][nx] === undefined)
        this.innerHTML = ''
}

const fin_chk = function () {
    // console.log('enter')
    let nxt_can = [false, false]
    for (let i = 0; i < cell_count; i++) {
        for (let j = 0; j < cell_count; j++) {
            if (board_state[i][j] !== undefined)
                continue
            // console.log(i, j)
            for (let k = 0; k < 8; k++) {
                nxt_can[0] |= search(j + dx[k], i + dy[k], 0, k, false) > 1
                nxt_can[1] |= search(j + dx[k], i + dy[k], 1, k, false) > 1
                if (nxt_can[0] && nxt_can[1]){
                    // console.log(i, j, k)
                    break
                }
            }
            if (nxt_can[0] && nxt_can[1])
                break
        }
        if (nxt_can[0] && nxt_can[1])
            break
    }
    // console.log(nxt_can)
    // console.log(nxt_can)
    // console.log(nxt_can[lay_count % 2])
    // console.log(nxt_can[(lay_count + 1) % 2])
    if (!nxt_can[lay_count % 2]) {
        if (!nxt_can[(lay_count + 1) % 2]) {
            let result = `서로 둘 곳이 없으므로 게임이 종료됩니다.\n흑 ${left_count[0]}점, 백 ${left_count[1]}점으로 `
            result += `${left_count[0] > left_count[1] ? '흑의 승리입니다.' : left_count[0] < left_count[1] ? '백의 승리입니다.' : '비겼습니다.'}\n`
            result += `다시 시작하려면 '확인'을 누르세요.`
            if (confirm(result))
                location.reload()
        }
        else {
            alert(`${color_hangul[lay_count % 2]}이 둘 곳이 없으므로 ${color_hangul[(lay_count + 1) % 2]}의 차례로 넘어갑니다.`)
            lay_count++
        }
    }
}

const lay = function(){
    document.getElementById('board_size').disabled = true;
    const nx = parseInt(this.id.split('-')[1])
    const ny = parseInt(this.id.split('-')[0])
    const turn = lay_count % 2
    if (board_state[ny][nx] === undefined) {
        let can = false
        for (let i = 0; i < 8; i++) {
            can |= search(nx + dx[i], ny + dy[i], turn, i, true) > 1
        }
        if (can) {
            lay_count++
            left_count[turn]++
            nowcell = document.getElementById(ny + '-' + nx)
            nowcell.innerHTML = ''
            nowcell.appendChild(getimg(color_list[turn]))
            nowcell.children[0].onload = fin_chk
            board_state[ny][nx] = turn
            
        }
    }
}

const search = function(x, y, turn, d, change){
    if (x >= 0 && x < cell_count && y >= 0 && y < cell_count){
        if (board_state[y][x] === turn){
            // console.log(x, y, turn, d, change, 111)
            return 1
        }
        else if (board_state[y][x] === undefined){
            // console.log(x, y, turn, d, change, 222)
            return 0
        }
        else{
            const ret = search(x + dx[d], y + dy[d], turn, d, change)
            if (ret != 0) {
                if (change) {
                    nowcell = document.getElementById(y + '-' + x)
                    nowcell.innerHTML = ''
                    nowcell.appendChild(getimg(color_list[turn]))
                    board_state[y][x] = turn
                    left_count[turn]++
                    left_count[(turn + 1) % 2]--
                }
                // console.log(x, y, turn, d, change, 333)
                return ret + 1
            }
            else{
                // console.log(x, y, turn, d, change, 444)
                return 0
            }
        }
    }
    else{
        // console.log(x, y, turn, d, change, 555)
        return 0
    }
}

// const check = function(x, y, turn){
//     let can = false
//     for (let i = 0; i < 8; i++){
//         can |= search(x + dx[i], y + dy[i], turn, i, true) > 1
//     }
//     if (can){
//         lay_count++
//         left_count[turn]++
//         nowcell = document.getElementById(y + '-' + x)
//         nowcell.innerHTML = ''
//         nowcell.appendChild(getimg(color_list[turn]))
//         board_state[y][x] = turn
//     }
    
// }

function getimg(color, trans=false){
    const ret = document.createElement('img')
    ret.width = board_size / cell_count - 10
    ret.src = `image/${color}.png`
    if (trans)
        ret.style.opacity = 0.4
    return ret
}