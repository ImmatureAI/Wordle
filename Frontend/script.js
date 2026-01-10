let currentRow = 0;
let currentColumn = 0;
const board = document.getElementById("canvas");
for(let i = 0; i < 6; i++){
    const rowElement = document.createElement('div');
    rowElement.setAttribute('class', 'row');
    for(let j = 0; j < 5; j++){
        const tileNum = i*5 + j; 
        const tile = document.createElement('div');
        tile.setAttribute('class', 'tile');
        tile.setAttribute('id', 'tile_'+tileNum);
        rowElement.appendChild(tile);
    }
    board.appendChild(rowElement);
}

document.addEventListener('keydown', (e) => {
    const key = e.key;
    if(key === 'Enter'){
        checkWord();
        return;
    }
    if(key === 'Backspace'){
        deleteLetter();
        return;
    }
    if(isLetter(key)){
        addLetter(key.toUpperCase());
    }
});

function isLetter(str){
    return str.length === 1 && str.match(/[a-z]/i);
}

function deleteLetter(){
    if(currentColumn === 0) return;
    currentColumn--;
    const tileNum = currentRow * 5 + currentColumn;
    const tileElement = document.getElementById(String(tileNum));
    tileElement.innerText = '';
    tileElement.removeAttribute('data');
}

function addLetter(str){
    if (currentColumn === 5) return;
    const tileNum = currentRow * 5 + currentColumn;
    const tileElement = document.getElementById('tile_' + tileNum);
    tileElement.innerText = str;
    currentColumn++;
}
