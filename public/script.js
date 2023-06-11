import {
    createBoard,
    markBlock,
    BLOCK_STATUSES,
    revealBlock,
    checkWin,
    checkLose
}
    from "./minesweeper.js";

const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 10;

let board;
const boardDiv = document.querySelector(".board");
const minesRemainingText = document.querySelector("[data-mines-remaining]");
const messageText = document.querySelector(".subtext");
const resetButton = document.querySelector("button");

resetButton.addEventListener("click", resetGame);
initialise();

function initialise() {
    board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);

    board.forEach(row => {
        row.forEach(block => {
            boardDiv.append(block.element);
            block.element.addEventListener("click", () => {
                revealBlock(board, block);
                checkGameEnd();
            })
            block.element.addEventListener("contextmenu", e => {
                e.preventDefault();
                markBlock(block);
                setMinesRemainingText();
            })
        })
    })
    boardDiv.style.setProperty("--size", BOARD_SIZE);
    minesRemainingText.textContent = NUMBER_OF_MINES;
}

function setMinesRemainingText() {
    const markedTilesCount = board.reduce((count, row) => {
        return count + row.filter(block => block.status === BLOCK_STATUSES.MARKED).length
    }, 0)

    minesRemainingText.textContent = NUMBER_OF_MINES - markedTilesCount;
}

function checkGameEnd() {
    const win = checkWin(board);
    const lose = checkLose(board);

    if (win || lose) {
        boardDiv.addEventListener("click", stopProp, { capture: true })
        boardDiv.addEventListener("contextmenu", stopProp, { capture: true })
    }

    if (win) {
        messageText.firstChild.textContent = "You win";
        minesRemainingText.textContent = "";
    }

    if (lose) {
        messageText.firstChild.textContent = "You lose";
        minesRemainingText.textContent = "";
        board.forEach(row => {
            row.forEach(block => {
                if (block.status === BLOCK_STATUSES.MARKED) markBlock(block);
                if (block.mine) revealBlock(board, block);
            })
        })
    }
}

function stopProp(e) {
    e.stopImmediatePropagation();
}

function resetGame() {
    boardDiv.innerHTML = "";
    initialise();
    messageText.firstChild.textContent = "Mines remaining: ";
    boardDiv.removeEventListener("click", stopProp, true);
    boardDiv.removeEventListener("contextmenu", stopProp, true);
}

// console.log(board);