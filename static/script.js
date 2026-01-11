const apiURL = ""

let typingAllowed = false;
let currentRow = 0;
let currentColumn = 0;
let score = 0;
let wordNum = 0;
const board = document.getElementById("canvas");
const scoreBoard = document.getElementById("score");
const restartButton = document.getElementById("restart")
const wordCount = document.getElementById("count");
const letterBox = document.getElementById("letters");

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

for(let n = 65; n <= 90; n++){
    const letterRow = document.createElement('div');
    letterRow.setAttribute('class', 'letterRow');
    let i;
    for(i = n; i <= n + 12 && i <= 90; i++){
        const c = String.fromCharCode(i);
        const letterTile = document.createElement('div');
        letterTile.setAttribute('class', 'letterTile');
        letterTile.setAttribute('id', 'letter_' + c);
        letterTile.innerText = c;
        letterTile.addEventListener('click', () => addLetter(c));
        letterRow.appendChild(letterTile);
    }
    n = i-1;
    letterBox.appendChild(letterRow);
}

const rowElem = document.createElement('div');
rowElem.setAttribute('class', letterRow);

const enter = document.createElement('div');
enter.setAttribute('class', 'submit');
enter.addEventListener('click', checkWord);
enter.innerText = "Enter";
rowElem.appendChild(enter);

const backspace = document.createElement('div');
backspace.setAttribute('class', 'submit');
backspace.addEventListener('click', deleteLetter);
backspace.innerText = "Back"
rowElem.appendChild(backspace);

letterBox.appendChild(rowElem);

async function initGame(){
    const response = await fetch(`${apiURL}/start`, {
        method: "Post",
        credentials: 'include'
    });
    const data = await response.json();
    console.log(data.message);

    restartButton.style.display = 'none'
    board.style.display = "initial";
    letterBox.style.display = 'initial';
    cleanBoard();
    cleanLetters();
    typingAllowed = true;
    currentRow = 0;
    currentColumn = 0;
    scoreBoard.innerText = "Score: " + score;
    wordCount.innerText = "Word: " + wordNum;
}

initGame();

document.addEventListener('keydown', (e) => {
    if(currentRow >= 6 || !typingAllowed) return;

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
    if (currentColumn >= 5 || currentRow >= 6 || !typingAllowed) return;
    const tileNum = currentRow * 5 + currentColumn;
    const tileElement = document.getElementById('tile_' + tileNum);
    tileElement.innerText = str;
    currentColumn++;
}

async function checkWord(){
    typingAllowed = false;

    let str = '';
    for(let i = 0; i < 5; i++){
        const tileElement = document.getElementById('tile_' + (currentRow*5 + i));
        str += tileElement.textContent;
    }
    if(str.length < 5){
        alert("Word is not 5 letters long");
        typingAllowed = true;
        return;
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
        typingAllowed = true;
        return;
    }

    if(data.message === "already guessed"){
        alert("Word already guessed");
        typingAllowed = true;
        return;
    }

    const colorArray = data.colors;

    for(let i = 0; i < 5; i++){
        const tileNum = currentRow * 5 + i;
        const tile = document.getElementById('tile_' + tileNum);
        tile.setAttribute("style", `background-color: ${colorArray[i]}`);
        await sleep(100);
    }

    for(let i = 0; i < 5; i++){
        const letterTile = document.getElementById('letter_' + str[i]);
        const currColor = letterTile.style.backgroundColor;
        if(colorArray[i] === currColor || currColor === "green") continue;
        if(currColor === "yellow" && (colorArray[i] === "black")) continue;
        letterTile.style.backgroundColor = colorArray[i];
    }

    currentColumn = 0;
    currentRow++;
    
    if(data.message === "complete"){
        wordNum++;
        score += 7 - (currentRow);
        scoreBoard.innerText = "Your score: " + score;
        wordCount.innerText = "Number of words: " + wordNum;
        initGame();
        return;
    }
    else if(currentRow === 6){
        alert("You lost!!!");
        gameLost();
    }
    typingAllowed = true;
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

function cleanLetters(){
    for (let n = 65; n <= 90; n++) {
        const letterTile = document.getElementById('letter_' + String.fromCharCode(n));
        letterTile.style.backgroundColor = "#a1a1a1";
    }
}

async function gameLost(){
    typingAllowed = false;
    letterBox.style.display = "none";
    board.style.display = "none";
    scoreBoard.innerText = "Your final score is " + score;
    wordCount.innerText = "Your final word count is " + wordNum;
    restartButton.style.display = 'flex';
    score = 0;
    wordNum = 0;
}

restartButton.addEventListener('click', initGame)