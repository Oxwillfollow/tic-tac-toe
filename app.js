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
    let gameEnded = false;

    const cacheDOM = (function(){
        const gameBoardContainer = document.getElementById("game-board");
        const newGameBtn = document.getElementById("newGame-btn");

        return {
            gameBoardContainer,
            newGameBtn,
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

    function checkIfGameWon(){
        let lastSymbol = "";
        let count = 0;
        
        // check each row
        for (let y = 0; y < gameBoard.length; y++) {
            for (let x = 0; x < gameBoard[y].length; x++) {
                if(x == 0 && gameBoard[x][y] !== ""){
                    count++;
                    lastSymbol = gameBoard[x][y];
                }
                else if(gameBoard[x][y] === lastSymbol)
                    count++;
                else{
                    count = 0;
                    lastSymbol = "";
                }
            }
            if(count >= 3){
                return lastSymbol;
            }

            lastSymbol = "";
            count = 0;
        }

        // check each column
        for (let x = 0; x < gameBoard.length; x++) {
            for (let y = 0; y < gameBoard[x].length; y++) {
                if(y == 0 && gameBoard[x][y] !== ""){
                    count++;
                    lastSymbol = gameBoard[x][y];
                }
                else if(gameBoard[x][y] === lastSymbol)
                    count++;
                else{
                    count = 0;
                    lastSymbol = "";
                }
            }

            if(count >= 3){
                return lastSymbol;
            }

            lastSymbol = "";
            count = 0;
        }

        // check two diagonals
        for (let y = 0, x = 0; y < gameBoard.length; y++, x++) {
            if(y == 0 && gameBoard[y][x] !== ""){
                count++;
                lastSymbol = gameBoard[y][x];
            }
            else if(gameBoard[y][x] === lastSymbol)
                count++;
            else{
                count = 0;
                lastSymbol = "";
            }
        }

        if(count >= 3){
            return lastSymbol;
        }

        lastSymbol = "";
        count = 0;

        for (let y = gameBoard.length-1, x = 0; y >= 0; y--, x++) {
            if(y == gameBoard.length-1 && gameBoard[y][x] !== ""){
                count++;
                lastSymbol = gameBoard[y][x];
            }
            else if(gameBoard[y][x] === lastSymbol)
                count++;
            else{
                count = 0;
                lastSymbol = "";
            }
        }

        if(count >= 3){
            return lastSymbol;
        }

        return "";
    }
    
    const placeSymbol = (xCoord, yCoord) => {
        if(gameEnded)
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

        render();

        let winningSymbol = checkIfGameWon();
        if(winningSymbol !== ""){
            gameEnded = true;
            cacheDOM.newGameBtn.setAttribute("data-enabled", "true");
            console.log("Game ended! " + winningSymbol + " won");
            // stop taking input from players
            // display a new game button
        }

        switchPlayers();
    }

    const restartGame = () => {
        // clear array
        for (let y = 0; y < gameBoard.length; y++) {
            for (let x = 0; x < gameBoard[y].length; x++) {
                gameBoard[x][y] = "";
            }      
        }
        currentPlayer = player1;
        gameEnded = false;
        cacheDOM.newGameBtn.setAttribute("data-enabled", "false");
        render();
    }

    init();

    return {
        placeSymbol,
        restartGame
    }
})();







// players have symbols
// gameboard stores symbols
// every time a symbol is placed, check if 3 symbols are in a straight line or diagonal
// if yes, check which player has the symbol