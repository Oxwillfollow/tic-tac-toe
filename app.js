// TO DO
// Add draw logic. check if board is full after every round

const createPlayer = (name, symbol) => {
    
    const getName = () => name;
    const getSymbol = () => symbol;

    return {
        getName,
        getSymbol,
    }
}

const gameController = (function(){
    const gameBoard = [
        ["","",""],
        ["","",""],
        ["","",""]
    ];

    const gameBoardCells = [];

    let player1;
    let player2;
    let currentPlayer;
    let winner;
    let isDraw;

    const cacheDOM = (function(){
        const gameBoardContainer = document.getElementById("game-board");
        const newGameBtn = document.getElementById("newGame-btn");
        const gameNarrationText = document.querySelector(".game-narration");
        const gamePlayerText = document.querySelector(".game-active-player");

        return {
            gameBoardContainer,
            newGameBtn,
            gameNarrationText,
            gamePlayerText,
        }
    })()

    function generateGameBoardCells(){
        for (let y = 0; y < gameBoard.length; y++) {
            for (let x = 0; x < gameBoard[y].length; x++) {
                let gameBoardCell = document.createElement("div");
                gameBoardCell.classList.add("game-board-cell");
                gameBoardCell.dataset.x = x;
                gameBoardCell.dataset.y = y;
                gameBoardCells.push(gameBoardCell);
                cacheDOM.gameBoardContainer.appendChild(gameBoardCell);
            }      
        }
    }

    function init(){
        player1 = createPlayer("Player 1", "X");
        player2 = createPlayer("Player 2", "O");
        currentPlayer = player1;
        generateGameBoardCells();
        bindEvents();
        render();
    }
    
    function render(){
        // render symbols to gameboard cells
        for (let y = 0; y < gameBoard.length; y++) {
            for (let x = 0; x < gameBoard[y].length; x++) {
                let cell = gameBoardCells.find(cell => cell.getAttribute("data-x") === x.toString() && cell.getAttribute("data-y") === y.toString());

                if(cell)
                    cell.textContent = gameBoard[y][x];
            }      
        }
        
        cacheDOM.gamePlayerText.textContent = `${currentPlayer.getName()} (${currentPlayer.getSymbol()})`;

        if(winner){
            cacheDOM.gameNarrationText.textContent = `Game over! ${winner.getName()} (${winner.getSymbol()}) wins!`
            cacheDOM.gamePlayerText.textContent = "";
        }
        else if(isDraw){
            cacheDOM.gameNarrationText.textContent = `Game over! Draw!`
            cacheDOM.gamePlayerText.textContent = "";
        }
        else{
            cacheDOM.gameNarrationText.textContent = `Click on an empty square!`
        }
    }

    function bindEvents(){
        // bind click events to gameboard cells
        gameBoardCells.forEach(cell => {
            cell.addEventListener('click', () => placeSymbol(cell.getAttribute("data-x"),cell.getAttribute("data-y")));
        });

        cacheDOM.newGameBtn.addEventListener('click', () => restartGame());
    }

    function switchPlayers(){
        if(currentPlayer !== player1)
            currentPlayer = player1;
        else
            currentPlayer = player2;
    }
    
    const placeSymbol = (xCoord, yCoord) => {
        if(winner || isDraw)
            return;

        if(!currentPlayer)
            throw new Error("No player is active!");      

        if(xCoord >= 3 || yCoord >= 3 || xCoord < 0 || yCoord < 0)
            throw new Error("Invalid coordinates!");
        
        if(gameBoard[yCoord][xCoord] !== "")
            return;

        gameBoard[yCoord][xCoord] = currentPlayer.getSymbol();
        console.log(gameBoard[0]);
        console.log(gameBoard[1]);
        console.log(gameBoard[2]);

        winner = checkIfGameWon(xCoord, yCoord);
        console.log(winner);

        if(winner == currentPlayer){
            cacheDOM.newGameBtn.setAttribute("data-enabled", "true");
            // stop taking input from players
            // display a new game button
            render();
        }
        else{
            switchPlayers();
            render();
        }
    }

    const restartGame = () => {
        // clear array
        for (let y = 0; y < gameBoard.length; y++) {
            for (let x = 0; x < gameBoard[y].length; x++) {
                gameBoard[x][y] = "";
            }      
        }
        currentPlayer = player1;
        winner = null;
        cacheDOM.newGameBtn.setAttribute("data-enabled", "false");
        render();
    }

    function checkIfGameWon(xCoord, yCoord){
        let symbol = currentPlayer.getSymbol();
        let lineArray = [];

        // horizontal check (on the current row)
        for (let x = 0; x < gameBoard[yCoord].length; x++) {
            if(gameBoard[yCoord][x] === symbol)
                lineArray.push([yCoord][x]);
        }

        if(lineArray.length >= 3)
            return currentPlayer;
        else
            lineArray.length = 0;

        // vertical check (on the current column)
        for (let y = 0; y < gameBoard[xCoord].length; y++) {
            if(gameBoard[y][xCoord] === symbol)
                lineArray.push([y][xCoord]);
        }

        if(lineArray.length >= 3)
            return currentPlayer;
        else
            lineArray.length = 0;

        // diagonal check top left -> down right
        for (let x = 0, y = 0; x < gameBoard[yCoord].length; x++, y++) {
            if(gameBoard[y][x] === symbol)
                lineArray.push([yCoord][x]);
        }

        if(lineArray.length >= 3)
            return currentPlayer;
        else
            lineArray.length = 0;

        // diagonal check top right -> down left
        for (let x = gameBoard[yCoord].length-1, y = 0; x >= 0; x--, y++) {
            if(gameBoard[y][x] === symbol)
                lineArray.push([yCoord][x]);
        }

        if(lineArray.length >= 3)
            return currentPlayer;
        else
            lineArray.length = 0;

        return null;
    }

    init();

    return {
        placeSymbol,
        restartGame
    }
})();