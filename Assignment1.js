let checkers = [];
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");


for (let row = 0; row < 8; row++) {
    let boardRow = [];
    for (let col = 0; col < 8; col++) {
        if (row < 3 && (row + col) % 2 === 1) {
            boardRow.push(new Piece(row,col,"red")); 
        } else if (row > 4 && (row + col) % 2 === 1) {
            boardRow.push(new Piece(row,col,"gray"));
        } else {
            boardRow.push(null) 
        }
    }
    checkers.push(boardRow);
}


function drawBoard() {
   

    for (let row = 0; row < checkers.length; row++) {
        for (let col = 0; col < checkers[row].length; col++) {
            const isBlack = (row + col) % 2 === 1;
            ctx.fillStyle = isBlack ? "black" : "white";
            ctx.fillRect(col * 100, row * 100, 100, 100);
        }
    }
}

function drawPieces(){
    for(let row = 0; row < checkers.length;row++){
        for(let col = 0; col< checkers[row].length;col++){
           let piece = checkers[row][col];
           if(piece){
            piece.draw();
           }
        }
    }
 }

window.onload = function(){
    drawBoard();
    drawPieces();
}

canvas.addEventListener("click", function(event){
    let x = event.offsetX;
    let y = event.offsetY;

    let row = Math.floor(y/100);
    let col = Math.floor(x/100);

    if (row >= 0 && row < checkers.length && col >= 0 && col < checkers[row].length) {
        let piece = checkers[row][col];

        // 

        if (piece != null) {
        let selectedPiece = getSelectedPiece();

        if (selectedPiece && selectedPiece !== piece) {
            
            selectedPiece.isClicked = false;
        }
        piece.isClicked = !piece.isClicked;
        }else{

            let selectedPiece = getSelectedPiece();


            if(selectedPiece && selectedPiece.isValidMove(row,col)){
                if(Math.abs(selectedPiece.row - row) === 2){
                    let midRow = (selectedPiece.row + row) / 2;
                    let midCol = (selectedPiece.col + col) / 2;
                    checkers[midRow][midCol] = null
                }
                checkers[selectedPiece.row][selectedPiece.col] = null;

                selectedPiece.move(row,col);
                checkers[row][col] = selectedPiece;
                selectedPiece.isClicked = false;
                
            }
        }
    }

    drawBoard();
    drawPieces();
});

function Piece(row, col, color){
    this.row = row;
    this.col = col;
    this.color = color;
    this.isClicked = false;
    this.isKing = false;
    this.draw = function(){
        if(this.isClicked == true){
            ctx.beginPath();
            ctx.arc(this.col * 100 + 50, this.row * 100 + 50,40,0, Math.PI*2 );
            ctx.fillStyle = "yellow";
            ctx.fill();
        }
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.col * 100 + 50,this.row * 100 + 50,38,0,Math.PI*2);
        ctx.fill();

        if(this.isKing){
            ctx.fillStyle = "white";

            ctx.beginPath();
            ctx.arc(this.col * 100 + 35, this.row * 100 + 40, 5, 0, Math.PI * 2)
            ctx.arc(this.col * 100 + 65, this.row * 100 + 40, 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.col * 100 + 50, this.row * 100 + 60, 15, 0, Math.PI);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
    this.checkKing = function() {
        if ((this.color === "red" && this.row === 7) || (this.color === "gray" && this.row === 0)) {
            this.isKing = true;
        }
    }
    this.move = function(newRow,newCol){
        this.row = newRow;
        this.col = newCol;
        this.checkKing();
    }
    this.isValidMove = function(newRow,newCol){
        if(newRow < 0 || newRow >= 8 ||newCol < 0 || newCol >= 8 ){
            return false;
        }
        if((newRow + newCol) % 2 ==0){
            return false;
        }

        if(checkers[newRow][newCol] !== null){
            return false;
        }

        let rowDiff = newRow - this.row;
        let colDiff = newCol - this.col;

        if(Math.abs(rowDiff) ===1 && Math.abs(colDiff) ==1){
            if(this.isKing){
                return true;
            }else if(this.color === "red" && rowDiff ===1){
                return true;
            }else if(this.color === "gray" && rowDiff === -1){
                return true;
            }else{
                return false;
            }
        }

        if(Math.abs(rowDiff) ==2 && Math.abs(colDiff) ==2){
            let midRow = (this.row + newRow)/2;
            let midCol = (this.col + newCol)/2;
            let midPiece = checkers[midRow][midCol];

            if(midPiece!== null && midPiece.color !== this.color){
                if(this.isKing){
                    return true;
                }
                if(this.color === "gray" && rowDiff === -2 ){
                    return true; 
                }
                if(this.color == "red" && rowDiff=== 2){
                    return true
                }
            }
            return false;
            
        }
        return false;
    }

};

function getSelectedPiece(){
    for(let i = 0; i < checkers.length;i++){
        for(let j = 0; j < checkers[i].length;j++){
            let piece = checkers[i][j];
            if(piece != null && piece.isClicked){
                return piece;
            }
        }
    }
    return null;
}
