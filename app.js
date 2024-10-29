// Gameboard module (IIFE)
const Gameboard = (() => {
    const board = Array(9).fill(null);

    const setMark = (index, mark) => {
        if (index >= 0 && index < board.length && board[index] === null) {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const getBoard = () => board;

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) board[i] = null;
    };

    return { setMark, getBoard, resetBoard };
})();

// Player factory function
const Player = (name, mark) => {
    return { name, mark };
};

// Game controller module
const GameController = (() => {
    let player1, player2, currentPlayer;

    const startGame = (name1, name2) => {
        player1 = Player(name1, "X");
        player2 = Player(name2, "O");
        currentPlayer = player1;
        Gameboard.resetBoard();
        DisplayController.render();
        DisplayController.showMessage(`${currentPlayer.name}'s turn`);
    };

    const switchTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        DisplayController.showMessage(`${currentPlayer.name}'s turn`);
    };

    const playTurn = (index) => {
        if (Gameboard.setMark(index, currentPlayer.mark)) {
            DisplayController.render();
            if (checkWinner()) {
                DisplayController.showMessage(`${currentPlayer.name} wins!`);
                return;
            } else if (Gameboard.getBoard().every(cell => cell !== null)) {
                DisplayController.showMessage("It's a tie!");
                return;
            }
            switchTurn();
        }
    };

    const checkWinner = () => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winPatterns.some(pattern =>
            pattern.every(index => Gameboard.getBoard()[index] === currentPlayer.mark)
        );
    };

    return { startGame, playTurn };
})();

// Display controller module
const DisplayController = (() => {
    const boardDiv = document.getElementById("game-board");
    const resultDiv = document.getElementById("result");

    const render = () => {
        boardDiv.innerHTML = "";
        Gameboard.getBoard().forEach((cell, index) => {
            const cellDiv = document.createElement("div");
            cellDiv.textContent = cell;
            cellDiv.addEventListener("click", () => GameController.playTurn(index));
            boardDiv.appendChild(cellDiv);
        });
    };

    const showMessage = (message) => {
        resultDiv.textContent = message;
    };

    document.getElementById("start").addEventListener("click", () => {
        const player1Name = document.getElementById("player1").value || "Player 1";
        const player2Name = document.getElementById("player2").value || "Player 2";
        GameController.startGame(player1Name, player2Name);
    });

    document.getElementById("reset").addEventListener("click", () => {
        GameController.startGame("Player 1", "Player 2");
    });

    return { render, showMessage };
})();
