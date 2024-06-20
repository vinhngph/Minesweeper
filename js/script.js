const game = new Game();
const render = new Render();
const timer = new Timer();
const util = new Utils();
const feature = new Features();
const soundManage = new SoundManage();

const NORMAL = '▶️';
const SAD = '😂';
const WIN = 'Congratulation 🥳';
const LOSE = 'Try again 😑';
const FIRE = 'Status: 🔥';

const MINE = '💣';
const FLAG = '🚩';

let gSafe = document.querySelector('.safe-click');
let gHints = document.querySelector('.hints')
let gLives = document.querySelector('.lives');
let gPlayer = document.querySelector('.player');
let gBestTime = document.querySelector('.best-time');

function init() {
    game.init();
}

function handleLevel(levelSize) {
    switch (levelSize) {
        case 4:
            game.gLevel.size = 4;
            game.gLevel.mines = 2;
            game.gLevel.lives = 1;
            game.gLevel.hints = 1;
            game.gLevel.safeClicks = 1;
            game.gLevel.bestTime = +localStorage.bestTimeEasy;
            break;
        case 8:
            game.gLevel.size = 8;
            game.gLevel.mines = 12;
            game.gLevel.lives = 3;
            game.gLevel.hints = 3;
            game.gLevel.safeClicks = 2;
            game.gLevel.bestTime = +localStorage.bestTimeMedium;
            break;
        case 12:
            game.gLevel.size = 12;
            game.gLevel.mines = 30;
            game.gLevel.lives = 3;
            game.gLevel.hints = 3;
            game.gLevel.safeClicks = 3;
            game.gLevel.bestTime = +localStorage.bestTimeHard;
            break;
    }
    game.gameOver();
    game.restart();
    game.init();
} s

function cellClicked(thisCell, i, j) {
    game.cellClicked(thisCell, i, j);
}

function handleFlag(i, j) {
    game.handleFlag(i, j);
}

function hintOn() {
    feature.hintOn();
}

function restart() {
    game.restart();
}

function showSafeCell() {
    feature.showSafeCell();
}

function undo() {
    feature.undo();
}