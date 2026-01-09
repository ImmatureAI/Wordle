let currentRow = 0;
let currentColumn = 0;
const board = document.getElementById("canvas");
for(let i = 0; i < 6; i++){
    const rowElement = document.createElement('div');
    rowElement.setAttribute('class', 'row');
    for(let j = 0; j < 5; j++){
        const tile = document.createElement('div');
        tile.setAttribute('class', 'tile');

        const inputchar = document.createElement('input');
        inputchar.setAttribute('type', 'text');
        inputchar.setAttribute('class', 'input');

        tile.appendChild(inputchar);
        rowElement.appendChild(tile);
    }
    board.appendChild(rowElement);

}