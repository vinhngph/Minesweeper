class Render {
    renderBoard(board) {
        let size = board.length;

        let boardHTML = '';

        for (let i = 0; i < size; i++) {
            boardHTML += '<tr>';

            for (let j = 0; j < size; j++) {
                let className = `cell cell${i}-${j}`;
                boardHTML += `<td class="${className}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="handleFlag(${i}, ${j}); return false;"></td>`;
            }

            boardHTML += '</tr>';
        }

        document.querySelector('.game-board>table').innerHTML = boardHTML;
    }

    renderCell(i, j, value) {
        let eCell = document.querySelector(`.cell${i}-${j}`);
        eCell.innerHTML = value;
    }

    renderBombs() {
        for (let i = 0; i < game.gBoard.length; i++) {
            for (let j = 0; j < game.gBoard.length; j++) {
                if (game.gBoard[i][j].isMine) this.renderCell(i, j, MINE);
            }
        }
    }

    renderNeighbors(i, j) {
        for (let rowIdx = i - 1; rowIdx <= i + 1; rowIdx++) {
            if (rowIdx < 0 || rowIdx > game.gBoard.length - 1) continue;

            for (let colIdx = j - 1; colIdx <= j + 1; colIdx++) {
                if (colIdx < 0 || colIdx > game.gBoard[0].length - 1) continue;
                if (rowIdx === i && colIdx === j) continue;

                let currCell = game.gBoard[rowIdx][colIdx];
                if (currCell.isMarked || currCell.isShown) continue;
                feature.gNrMoves.push(currCell);

                this.renderCell(rowIdx, colIdx, currCell.minesAroundCount);
                currCell.isShown = true;
                let elCell = document.querySelector(`.cell${rowIdx}-${colIdx}`);
                elCell.classList.add('pressed');
                if (!currCell.minesAroundCount) this.renderNeighbors(rowIdx, colIdx);
            }
        }
    }
}