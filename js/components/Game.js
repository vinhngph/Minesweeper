class Game {
    constructor() {
        this.gBoard = [];
        this.gGame = {
            isRun: false,
            isFirst: true,
            shownCount: 0,
            markedCount: 0,
            secsPassed: 0,
            isSound: true,
        }
        this.gLevel = {
            size: 4,
            mines: 2,
            lives: 1,
            hints: 1,
            bestTime: + localStorage.bestTimeEasy,
            safeClicks: 1,
        }
    }

    init() {
        gPlayer.innerText = NORMAL;
        this.gBoard = this.buildBoard();
        render.renderBoard(this.gBoard);

        let size = this.gLevel.size;

        gLives.innerText = size === 4 ? '❤️' : '❤️❤️❤️';
        gHints.innerText = size === 4 ? 'Hint: 💡' : 'Hints: 💡💡💡';
        gSafe.innerText = size === 4 ? '🔍' : size === 8 ? '🔍🔍' : '🔍🔍🔍';

        if (!this.gLevel.bestTime) return;
        timer.renderBestTime();
    }

    buildBoard() {
        let board = [];

        for (let i = 0; i < this.gLevel.size; i++) {
            board.push([]);

            for (let j = 0; j < this.gLevel.size; j++) {
                let cell = {
                    minesAroundCount: null,
                    isShown: false,
                    isMarked: false,
                    isMine: false,
                    position: { i: i, j: j }
                }

                board[i].push(cell);
            }
        }

        return board;
    }

    placeMines(maxMine, iExist, jExist) {
        let countMine = 0;

        while (countMine < maxMine) {
            let size = this.gLevel.size;

            let i = util.getRandomInt(0, size);
            let j = util.getRandomInt(0, size);

            if (this.gBoard[i][j].isMine) continue;
            if (i === iExist && j === jExist) continue;

            this.gBoard[i][j].isMine = true;
            countMine++;
        }
    }

    countMines3x3(thisBoard, rowIndex, colIndex) {
        let count = 0;

        for (let i = rowIndex - 1; i <= rowIndex + 1; i++) {
            if (i < 0 || i > thisBoard.length - 1) continue;

            for (let j = colIndex - 1; j <= colIndex + 1; j++) {
                if (j < 0 || j > thisBoard[0].length - 1) continue;

                if (i === rowIndex && j === colIndex) continue;

                let currentCell = thisBoard[i][j];
                if (currentCell.isMine) count++;
            }
        }

        return count;
    }

    setNeighbor() {
        for (let i = 0; i < this.gBoard.length; i++) {
            for (let j = 0; j < this.gBoard.length; j++) {
                if (this.gBoard[i][j].isMine) continue;
                let mineCount = this.countMines3x3(this.gBoard, i, j);
                if (!mineCount) mineCount = '';
                this.gBoard[i][j].minesAroundCount = mineCount;
            }
        }
    }

    cellClicked(thisCell, i, j) {
        let cell = this.gBoard[i][j];

        if (cell.isShown || cell.isMarked) return;

        if (!this.gGame.isRun && this.gGame.isFirst) {
            this.gGame.isRun = true;
            this.gGame.isFirst = false;
            gPlayer.innerText = FIRE;

            timer.start();

            this.placeMines(this.gLevel.mines, i, j);
            this.setNeighbor();
        }
        // Hint feature
        else if (feature.gHintOn) {
            return feature.showHint(i, j);
        }
        // Click mine
        else if (cell.isMine) {
            if (this.gGame.isSound) soundManage.bombSound();

            cell.isShown = true;

            if (this.gLevel.lives > 1) {
                this.gLevel.lives--;

                feature.gMoves.push(cell);
                render.renderCell(i, j, MINE);

                let remainLives = this.gLevel.lives;

                switch (remainLives) {
                    case 2:
                        gLives.innerText = '❤️❤️💔';
                        break;
                    case 1:
                        gLives.innerText = '❤️💔💔';
                    default:
                        break;
                }
                gPlayer.innerText = SAD;
                return;
            }
            else if (this.gLevel.lives === 1) {
                render.renderBombs();
                this.gameOver('lost');
                return;
            }
        }

        // Main
        if (this.gGame.isRun) {
            if (cell.minesAroundCount > 0) {
                thisCell.innerHTML = cell.minesAroundCount;
                feature.gMoves.push(cell);
            } else {
                render.renderNeighbors(i, j);
                feature.gMoves.push(feature.gNrMoves.slice());
                feature.gMoves[feature.gMoves.length - 1].push(cell);
                feature.gNrMoves = [];
            }

            thisCell.classList.add('pressed');
            cell.isShown = true;
            if (this.isWin()) this.gameOver('win');
        }
    }

    handleFlag(i, j) {
        let cell = this.gBoard[i][j];

        if (!this.gGame.isRun || cell.isShown && !cell.isMine) return;

        if (!cell.isMarked) {
            render.renderCell(i, j, FLAG);
            cell.isMarked = true;
            if (this.isWin()) this.gameOver('win');
        } else {
            if (cell.isMine && cell.isShown) return;
            render.renderCell(i, j, ' ');
            cell.isMarked = false;
        }

    }

    gameOver(status) {
        timer.stop();
        this.gGame.isRun = false;

        if (status === 'win') {
            gPlayer.innerHTML = WIN;
            timer.setBestTime();
            if (this.gGame.isSound) soundManage.winSound();
        } else if (status == 'lost') {
            gLives.innerHTML = this.gLevel.size === 4 ? '💔' : '💔💔💔';

            gPlayer.innerHTML = LOSE;
            if (this.gGame.isSound) soundManage.loseSound();
        }
    }

    isWin() {
        for (let i = 0; i < this.gBoard.length; i++) {
            for (let j = 0; j < this.gBoard.length; j++) {
                let cell = this.gBoard[i][j];
                if (cell.isMine && !cell.isMarked) return false;
                if (!cell.isMine && !cell.isShown) return false;
            }
        }
        return true;
    }

    restart() {
        timer.stop();
        this.gGame.isRun = false;
        this.gGame.isFirst = true;
        this.gGame.shownCount = 0;
        this.gGame.markedCount = 0;
        this.gGame.secsPassed = 0;
        document.querySelector('.timer').innerHTML = '00:00';
        this.gLevel.hints = this.gLevel.size === 4 ? 1 : 3;
        this.gLevel.lives = this.gLevel.size === 4 ? 1 : 3;
        this.gLevel.safeClicks = 1;
        feature.gMoves = [];
        feature.gNrMoves = [];
        document.querySelector('.best-time').innerHTML = '';
        this.init();
    }
}