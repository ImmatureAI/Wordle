const apiURL = "http://127.0.0.1:5000"

let currentRow = 0;
let currentColumn = 0;
let score = 0;
const board = document.getElementById("canvas");
const scoreBoard = document.getElementById("score");
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

async function initGame(){
    const response = await fetch(`${apiURL}/start`, {
        method: "Post",
        credentials: 'include'
    });
    const data = await response.json();
    console.log(data.message);
}

initGame();

document.addEventListener('keydown', (e) => {
    if(currentRow >= 6) return;

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
    const tileElement = document.getElementById('tile_'+tileNum);
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

async function checkWord(){
    let str = '';
    for(let i = 0; i < 5; i++){
        const tileElement = document.getElementById('tile_' + (currentRow*5 + i));
        str += tileElement.textContent;
    }
    const response = await fetch(`${apiURL}/guess`, {
        method : "Post",
        headers : {
            "Content-type" : "application/json"
        },
        credentials : 'include',
        body: JSON.stringify({guess : str.trim()})
    });

    const data = await response.json();

    if(data.message === "Not in library"){
        alert("Not in word list");
        return;
    }

    const colorArray = data.colors;

    for(let i = 0; i < 5; i++){
        const tileNum = currentRow * 5 + i;
        const tile = document.getElementById('tile_' + tileNum);
        tile.setAttribute("style", `background-color: ${colorArray[i]}`);
        await sleep(100);
    }
    currentColumn = 0;

    if(data.message === "complete"){
        currentRow = 0;
        score += 10;
        scoreBoard.innerText = "Your score: " + score;
        cleanBoard();
        initGame();
        return;
    }
    currentRow++;
    if(currentRow === 6){
        alert("You lost!!!");
        scoreBoard.innerText = "Your final score is " + score;
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

function cleanBoard(){
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            const tileNum = i * 5 + j;
            const tileElement = document.getElementById('tile_' + tileNum);
            tileElement.innerText = '';
            tileElement.removeAttribute('data');
            tileElement.setAttribute("style", `background-color: #a1a1a1`);
        }
    }
}