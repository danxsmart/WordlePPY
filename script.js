const state = {
    secret: '',
    grid: Array(6).fill().map(() => Array(5).fill('')),
    currentRow: 0,
    currentCol: 0,
};

function updateGrid() {
    for (let i = 0; i < state.grid.length; i++) {
        for (let j = 0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

function dibujarBox(container, row, col, letter = '') {
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = letter;

    container.appendChild(box);
    return box;
}

function dibujarGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'grid';

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            dibujarBox(grid, i, j);
        }
    }

    container.appendChild(grid);
}

function regKeyboardEvents() {
    document.body.onkeydown = (e) => {
        const key = e.key;
        if (key === 'Enter') {
            if (state.currentCol === 5) {
                const word = getCurrentWord();
                if (isValidWord(word)) {
                    revWord(word);
                    state.currentRow++;
                    state.currentCol = 0;
                } else {
                    alert('Palabra invalida');
                }
            }
        }
        if (key === 'Backspace') {
            delLetter();
        }
        if (isLetter(key)) {
            addLetter(key);
        }
        updateGrid();
    }
}

function getCurrentWord() {
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function isValidWord(word) {
    
    return true;
}

function revWord(guess) {
    const row = state.currentRow;

    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;

        if (letter === state.secret[i]) {
            box.classList.add('correcto');
        } else if (state.secret.includes(letter)) {
            box.classList.add('error');
        } else {
            box.classList.add('vacio');
        }
    }

    const isWin = state.secret === guess;
    const isOver = state.currentRow === 5;

    if (isWin) {
        alert('Ganaste');
    } else if (isOver) {
        alert(`Perdiste. La palabra era '${state.secret}'.`);
    }
}

function isLetter(key) {
    return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
    if (state.currentCol === 5) return;
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

function delLetter() {
    if (state.currentCol === 0) return;
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
}

async function fetchSecretWord() {
    const response = await fetch('https://random-word-api.herokuapp.com/word?lang=es&number=1&length=5');
    const words = await response.json();
    state.secret = words[0];
}

async function startup() {
    const game = document.getElementById('game');
    dibujarGrid(game);
    regKeyboardEvents();
    await fetchSecretWord();
    console.log(`Secret word: ${state.secret}`); // Para depuración
}

startup();
