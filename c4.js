var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var pPieces = [];
var aiPieces = [];
var aiBlockerPieces = [];
var gamePieces = [];
            /* Column X Coords
        242-262  Col 1
        296-313  Col 2
        349-366  Col 3
        405-415  Col 4
        457-470  Col 5
        507-521  Col 6
        560-576  Col 7
        */
var pieceColLoc = [242,296,349,400,452,505,558];
var pieceRowLoc = [428,372,320,263,208,150];
var board = [[0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]];
var pPieceCol = 0;
var player = 1;
var keyReleased;
var addPiece;
var addBlockerPiece = false;
var aiBlockerCnt = 0;
var aiBlockerCntMax = 6;
var game = new Phaser.Game(config);


function preload ()
{
    this.load.image('board', 'assets/c4Board.png');
    this.load.image('red', 'assets/redPiece.png');
    this.load.image('yellow', 'assets/yellPiece.png');
    this.load.image('black', 'assets/blkPiece.png');
}

function create ()
{
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);


    //create game pieces
    for (let i=0; i<22; i++)
    {
        pPieces.push(this.add.sprite(242,-50, 'red').setScale(.5));
        aiPieces.push(this.add.sprite(242,-50, 'yellow').setScale(.5));
        aiBlockerPieces.push(this.add.sprite(242,-50, 'black').setScale(.5));
    }

    this.pPosPiece = this.add.sprite(242, 528, 'red').setScale(.5);
    
    var pointer = this.input.activePointer;
    var gameBoard = this.add.image(400, 300, 'board');
    gameBoard.setScale(1.5);
    this.posY = 0;
    this.text = this.add.text(242, 15, " ", {
    font: "25px Arial",
    fill: "#ff0044",
    align: "center"
    });

}

function clearBoard(board, plyr)
{
    //TODO create a clear board function that pours the pieces down the bottom
    // and bounce out of scene
    var emptyBoard = new Array;
    for (var i=0; i < 6; i++)
    {
        emptyBoard.push(new Array(6).fill(0));
    }
    for (var i=0; i<gamePieces.length; i++)
    {
        gamePieces.pop();
    }

}

function updateBoard(b, player, col){
    //let b=structuredClone(board);
    if (player)
    {
        for (let row=0; row<=5; row++)
            {
                if (b[row][col] == 0)
                {
                    rowIndex = row;
                    b[row][col] = player;
                    break;
                }
            }
    }
    return {b,rowIndex};
}

function getRandInt(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
        
function boardFull(brd)
{
    for (let i=0; i<7; i++)
    {
        if (brd[5][i]==0) return false;
    }
    return true;
}
    
function getOpenCol(brd)
    {
        var openCol = [[],[],[],[],[],[],[]];
        for (c=0; c<7; c++)
        {
            for (r=0; r<6; r++)
            {
                if (brd[r][c] == 0)
                {
                    openCol[c] = [c,r];
                    break;
                }
                
            }
        }            
        if (openCol.length > 0)
        {
            return openCol;
        }
                
    }

function update()
{
    
    if (addPiece)
    {
        if (newPlayerPiece.y < row)
        {
            newPlayerPiece.y = newPlayerPiece.y +20;
        }
        else if (newPlayerPiece.y >= row)
        {

            if(evalFunction(board, player))
            {
                if (player == 1)
                {
                    this.text.setText("YOU Win!");
                    player = 999;
                }
                else if (player == -1)
                {
                    this.text.setText("YOU LOSE!");
                    player = 999;
                }
                
                clearBoard(board, player);
            }
            else if (addBlockerPiece)
            {
                aiBlockerCnt =0;
                addBlockerPiece = false;
            }
            else
            {
                player = -player;
                aiBlockerCnt +=1;
            }
            
            addPiece = false;
            gamePieces.push(newPlayerPiece);
        }
    }

    if (this.left.isDown)
    {
        if (this.keyReleased==true)
        {
            for (let i=0; i<=6; i++)
            {
                if(this.pPosPiece.x == pieceColLoc[i] && i >0)
                {
                    this.pPosPiece.x = pieceColLoc[i-1];
                    pPieceCol = i-1;
                    break;
                }
            }
            this.keyReleased = false;
        }
    }
    else if (this.right.isDown)
    {
        if (this.keyReleased==true)
        {
            for (let i=0; i<6; i++){
                if(this.pPosPiece.x == pieceColLoc[i] && i <6)
                {
                    this.pPosPiece.x = pieceColLoc[i+1];
                    pPieceCol = i+1;
                    break;
                }
            }
            this.keyReleased = false;
        }
    }
    else if (this.enter.isDown && player ==1 && !addPiece)
    {
        
        if (this.keyReleased==true)
        {
            let vals=updateBoard(board, player, pPieceCol);
            board = vals.b;
            row = pieceRowLoc[vals.rowIndex];
            if (player==1)
            {

                newPlayerPiece = pPieces.pop();
            }
            else if (player==-1)
            {

                newPlayerPiece = aiPieces.pop();
            }
            newPlayerPiece.x = this.pPosPiece.x;

            addPiece = true;
        }
        this.keyReleased = false;
    }
    else if (this.left.isUp && 
            this.right.isUp && 
            this.enter.isUp &&
            !addPiece)
    {
        this.keyReleased = true;
    }

    if (player==-1 && !addPiece)
    {
        let aiColPos = miniMax(board,player,3,Math.NEGATIVE_INFINITY,Math.POSITIVE_INFINITY)[0];
        let bVals = updateBoard(board,player,aiColPos);
        board = bVals.b;
        newPlayerPiece = aiPieces.pop();
        newPlayerPiece.x = pieceColLoc[aiColPos];
        row = pieceRowLoc[bVals.rowIndex];
        addPiece = true;

    }

    if (aiBlockerCnt==aiBlockerCntMax && addPiece==false && player == 1)
    {
        let aiColPos = miniMax(board,-player,3,Math.NEGATIVE_INFINITY,Math.POSITIVE_INFINITY)[0];
        let bVals = updateBoard(board,20,aiColPos);
        board = bVals.b;
        newPlayerPiece = aiBlockerPieces.pop();
        newPlayerPiece.x = pieceColLoc[aiColPos];
        row = pieceRowLoc[bVals.rowIndex];
        addBlockerPiece = true;
        aiBlockerCntMax = getRandInt(2,7);
        addPiece = true;
    }     
}