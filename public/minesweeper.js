
export const BLOCK_STATUSES = {
    HIDDEN: "hidden",
    MARKED: "marked",
    MINE: "mine",
    NUMBER: "number"
};

export function createBoard(boardSize, numberOfMines) {
    const board = [];
    const minePositions = getMinePositions(boardSize, numberOfMines);

    for (let row = 0; row < boardSize; row++) {
        const boardRow = [];
        for (let column = 0; column < boardSize; column++) {
            const element = document.createElement("div");
            // element.dataset.status = BLOCK_STATUSES.HIDDEN;
            const block = {
                element,
                row,
                column,
                mine: minePositions.some(p => positionExists(p, { row, column })),
                get status() {
                    return this.element.dataset.status;
                },
                set status(value) {
                    this.element.dataset.status = value;
                }
            }
            block.status = BLOCK_STATUSES.HIDDEN;
            boardRow.push(block);
        }
        board.push(boardRow);
    }

    return board;
}

export function markBlock(block) {
    if (block.status !== BLOCK_STATUSES.HIDDEN &&
        block.status !== BLOCK_STATUSES.MARKED) {
        return
    }

    if (block.status === BLOCK_STATUSES.MARKED) {
        block.status = BLOCK_STATUSES.HIDDEN;
    } else {
        block.status = BLOCK_STATUSES.MARKED;
    }
}

export function revealBlock(board, block) {
    if (block.status !== BLOCK_STATUSES.HIDDEN) {
        return
    }

    if (block.mine) {
        block.status = BLOCK_STATUSES.MINE;
        return;
    }
    block.status = BLOCK_STATUSES.NUMBER;
    const adjacentBlocks = getAdjacentBlocks(board, block);
    const mines = adjacentBlocks.filter(b => b.mine);
    if (mines.length === 0) {
        adjacentBlocks.forEach(revealBlock.bind(null, board));
    } else {
        block.element.textContent = mines.length;
    }
}

function getMinePositions(boardSize, numberOfMines) {
    // code wil break if numberOfMines is larger than number of blocks in board
    const positions = [];

    while (positions.length < numberOfMines) {
        const position = {
            row: randomNumber(boardSize),
            column: randomNumber(boardSize)
        }

        if (!positions.some(p => positionExists(p, position))) {
            positions.push(position);
        }
    }

    return positions;
}

const positionExists = (a, b) => {
    return a.row === b.row && a.column === b.column;
}

function randomNumber(size) {
    return Math.floor(Math.random() * size);
}

function getAdjacentBlocks(board, { row, column }) {
    const tiles = [];

    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let columnOffset = -1; columnOffset <= 1; columnOffset++) {
            const tile = board[row + rowOffset]?.[column + columnOffset];
            if (tile) tiles.push(tile);
        }
    }

    return tiles;
}

export function checkWin(board) {
    return board.every(row => {
        return row.every(block => {
            return block.status === BLOCK_STATUSES.NUMBER ||
                (block.mine &&
                    (block.status === BLOCK_STATUSES.HIDDEN ||
                        block.status === BLOCK_STATUSES.MARKED));
        })
    })
}

export function checkLose(board) {
    return board.some(row => {
        return row.some(block => {
            return block.status === BLOCK_STATUSES.MINE;
        })
    })
}