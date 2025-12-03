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
    const player1 = createPlayer("Player 1", "X");
    const player2 = createPlayer("Player 2", "O");
    let currentPlayer = player1;
    
    function render(){
        // render symbols to gameboard cells
    }

    function bindEvents(){
        // bind click events to gameboard cells
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
        for (let x = 0, y = 0; x < gameBoard.length; x++, y++) {
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

        for (let x = gameBoard.length-1, y = 0; x >= 0; x--, y++) {
            if(x == gameBoard.length-1 && gameBoard[x][y] !== ""){
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

        return "";
    }
    
    const placeSymbol = (xCoord, yCoord) => {
        if(!currentPlayer)
            throw new Error("No player is active!");      

        if(xCoord >= 3 || yCoord >= 3 || xCoord < 0 || yCoord < 0)
            throw new Error("Invalid coordinates!");
        
        if(gameBoard[xCoord][yCoord] !== "")
            return;

        gameBoard[xCoord][yCoord] = currentPlayer.getSymbol();
        console.log(gameBoard[0]);
        console.log(gameBoard[1]);
        console.log(gameBoard[2]);

        render();

        if(checkIfGameWon()){
            console.log("Game ended!");
            // stop taking input from players
            // display a new game button
        }

        switchPlayers();
    }

    const restartGame = () => {
        // clear array
        gameBoard.forEach(item => item = "");
        render();
    }

    return {
        placeSymbol,
        restartGame
    }
})();







// players have symbols
// gameboard stores symbols
// every time a symbol is placed, check if 3 symbols are in a straight line or diagonal
// if yes, check which player has the symbol