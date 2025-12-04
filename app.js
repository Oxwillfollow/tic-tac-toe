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
    const cellCount = gameBoard.flat().length;
    let roundCount = 0;
    let player1;
    let player2;
    let currentPlayer;
    let winner;
    let winningLine = [];

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
                gameBoardCell.dataset.highlighted = "false";
                gameBoardCells.push(gameBoardCell);
                cacheDOM.gameBoardContainer.appendChild(gameBoardCell);
            }      
        }
    }

    function init(){
        player1 = createPlayer("Player 1", "X");
        player2 = createPlayer("Player 2", "0");
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

                if(cell){
                    cell.textContent = gameBoard[y][x];

                    if(gameBoard[y][x] === player1.getSymbol())
                        cell.style.color = "#ff6969ff";
                    else
                        cell.style.color = "#3079e6ff";
                }

                if(currentPlayer == player1)
                    cacheDOM.gamePlayerText.style.color = "#ff6969ff";
                else
                    cacheDOM.gamePlayerText.style.color = "#3079e6ff";
            }      
        }
        
        cacheDOM.gamePlayerText.textContent = `${currentPlayer.getName()} (${currentPlayer.getSymbol()})`;

        if(winner){
            cacheDOM.gamePlayerText.textContent = `${winner.getName()} (${winner.getSymbol()}) wins!`
            cacheDOM.gameNarrationText.textContent = `Game over.`;
            cacheDOM.newGameBtn.setAttribute("data-enabled", "true");

            // Highlight winning line
            winningLine.forEach((winningCell, i) => {
                let highlightedCell = gameBoardCells.find(cell => cell.getAttribute("data-x") === winningCell[1].toString() && cell.getAttribute("data-y") === winningCell[0].toString());
                highlightedCell.setAttribute("data-highlighted", "true");
            })
        }
        else if(roundCount >= cellCount){
            cacheDOM.gamePlayerText.textContent = "Draw.";
            cacheDOM.gameNarrationText.textContent = `Try again?`
            cacheDOM.newGameBtn.setAttribute("data-enabled", "true");
        }
        else{
            cacheDOM.gameNarrationText.textContent = `Click on an empty square!`
        }
    }

    function bindEvents(){
        // bind click events to gameboard cells
        gameBoardCells.forEach(cell => {
            cell.addEventListener('click', () => placeSymbol(cell.getAttribute("data-y"),cell.getAttribute("data-x")));
        });

        cacheDOM.newGameBtn.addEventListener('click', () => restartGame());
    }

    function switchPlayers(){
        if(currentPlayer !== player1)
            currentPlayer = player1;
        else
            currentPlayer = player2;
    }
    
    const placeSymbol = (yCoord, xCoord) => {
        if(winner || roundCount >= cellCount)
            return;

        if(!currentPlayer)
            throw new Error("No player is active!");      

        if(xCoord >= 3 || yCoord >= 3 || xCoord < 0 || yCoord < 0)
            throw new Error("Invalid coordinates!");
        
        if(gameBoard[yCoord][xCoord] !== "")
            return;

        gameBoard[yCoord][xCoord] = currentPlayer.getSymbol();
        roundCount++;

        if(roundCount >= cellCount){
            render();
            return;
        }

        winningLine = checkForWinningLine(xCoord, yCoord);
        if(winningLine.length > 0){
            winner = currentPlayer;
        }
        else{
            switchPlayers();
        }

        render();
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
        winningLine.length = 0;
        roundCount = 0;
        cacheDOM.newGameBtn.setAttribute("data-enabled", "false");
        gameBoardCells.forEach(cell => cell.setAttribute("data-highlighted", "false"));
        render();
    }

    function checkForWinningLine(xCoord, yCoord){
        let symbol = currentPlayer.getSymbol();
        let lineArray = [];

        // horizontal check (on the current row)
        for (let x = 0; x < gameBoard[yCoord].length; x++) {
            if(gameBoard[yCoord][x] === symbol)
                lineArray.push([yCoord, x]);
        }

        if(lineArray.length >= 3)
            return lineArray;
        else
            lineArray.length = 0;

        // vertical check (on the current column)
        for (let y = 0; y < gameBoard[xCoord].length; y++) {
            if(gameBoard[y][xCoord] === symbol)
                lineArray.push([y, xCoord]);
        }

        if(lineArray.length >= 3)
            return lineArray;
        else
            lineArray.length = 0;

        // diagonal check top left -> down right
        for (let x = 0, y = 0; x < gameBoard[yCoord].length; x++, y++) {
            if(gameBoard[y][x] === symbol)
                lineArray.push([y, x]);
        }

        if(lineArray.length >= 3)
            return lineArray;
        else
            lineArray.length = 0;

        // diagonal check top right -> down left
        for (let x = gameBoard[yCoord].length-1, y = 0; x >= 0; x--, y++) {
            if(gameBoard[y][x] === symbol)
                lineArray.push([y, x]);
        }

        if(lineArray.length >= 3)
            return lineArray;
        else
            lineArray.length = 0;

        return [];
    }

    init();

    return {
        placeSymbol,
        restartGame
    }
})();