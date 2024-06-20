class Features {
    constructor() {
        this.gMoves = [];
        this.gNrMoves = [];
        this.gHintOn = false;
    }

    hintOn() {
        if (game.gLevel.hints === 0) return;
        if (!game.gGame.isRun) return;

        this.gHintOn = true;
        game.gLevel.hints--;

        if (game.gLevel.size === 4) {
            return gHints.innerText = 'Hint: ✖️';
        }

        let remainHints = game.gLevel.hints;

        switch (remainHints) {
            case 2:
                gHints.innerText = 'Hints: 💡💡✖️'
                break;
            case 1:
                gHints.innerText = 'Hints: 💡✖️✖️'
                break;
            default:
                gHints.innerText = 'Hints: ✖️✖️✖️'
                break;
        }
    }

    showHint(iIndex, jIndex) {
        for (let i = iIndex - 1; i <= iIndex + 1; i++) {
            if (i < 0 || i > game.gBoard.length - 1) continue;

            for (let j = jIndex - 1; j <= jIndex + 1; j++) {
                if (j < 0 || j > game.gBoard[0].length - 1) continue;
                let curCell = game.gBoard[i][j];

                if (curCell.isShown || curCell.isMarked) continue;

                if (curCell.isMine) render.renderCell(i, j, MINE);
                else if (curCell.minesAroundCount) render.renderCell(i, j, curCell.minesAroundCount);
                else render.renderCell(i, j, ' ');

                let eCell = document.querySelector(`.cell${i}-${j}`);

                eCell.classList.add('hinted');

                setTimeout(render.renderCell, 1000, i, j, ' ');
                setTimeout(this.removeClass, 1000, i, j, 'hinted');
            }
        }
        this.gHintOn = false;
    }

    removeClass(i, j, cls) {
        var elCell = document.querySelector(`.cell${i}-${j}`);
        elCell.classList.remove(cls);
    }

    showSafeCell() {
        if (!game.gGame.isRun) return;
        if (game.gLevel.safeClicks === 0) return;

        game.gLevel.safeClicks--;
        let remains = game.gLevel.safeClicks;

        gSafe.innerHTML = remains === 1 ? '🔍' : remains === 2 ? '🔍🔍' : '✖️';

        let safeCells = [];

        for (let i = 0; i < game.gBoard.length; i++) {
            for (let j = 0; j < game.gBoard[0].length; j++) {
                let cell = game.gBoard[i][j];
                if (cell.isMine || cell.isShown) continue;
                safeCells.push({ i: i, j: j })
            }
        }

        let randomIndex = safeCells[util.getRandomInt(0, safeCells.length)];

        document.querySelector(`.cell${randomIndex.i}-${randomIndex.j}`).classList.add('safe');

        setTimeout(this.removeClass, 2000, randomIndex.i, randomIndex.j, 'safe');
    }

    undo() {
        if (!game.gGame.isRun) return;
        if (!this.gMoves.length) return;

        let move = this.gMoves.pop();

        if (Array.isArray(move)) {
            for (let i = 0; i < move.length; i++) {
                let curtMove = move[i];
                this.reverseMove(curtMove);
            }
        }
        else this.reverseMove(move);
    }

    reverseMove(cell) {
        cell.isShown = false;

        if (cell.isMine) {
            game.gLevel.lives++;
            gLives.innerHTML = gLives.innerHTML === '❤️❤️💔' ? '❤️❤️❤️' : '❤️❤️💔';
        }

        document.querySelector(`.cell${cell.position.i}-${cell.position.j}`).classList.remove('pressed');

        render.renderCell(cell.position.i, cell.position.j, '');
    }
}