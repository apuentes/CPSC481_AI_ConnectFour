function sectionsOfFour(brd)
{   var section = new Array();
    for (var row=0; row <6; row++)
    {
        for (var col=0; col<4; col++)
        {
            section.push([brd[row][col],brd[row][col+1],brd[row][col+2],brd[row][col+3]]);
        }
    }
    for (let col=0; col<7; col++)
    {
        for (let row=0; row<3; row++)
        {
            section.push([brd[row][col],brd[row+1][col],brd[row+2][col],brd[row+3][col]]);
        }
    }
    for (let row=0; row<3; row++)
    {
        for (let col=0; col<4; col++)
        {
            section.push([brd[row][col],brd[row+1][col+1],brd[row+2][col+2],brd[row+3][col+3]]);
        }
    }
    for (let row=5; row>2; row--)
    {
        for (let col=0; col<4; col++)
        {
            section.push([brd[row][col],brd[row-1][col+1],brd[row-2][col+2],brd[row-3][col+3]]);
        }
    }
    return section;
}

function sectionScore(section, player)
    {
        var scr = 0;
        var plyrCnt = 0;
        var oppCnt = 0;
        var openPosCnt = 0;
        for (var i=0; i<4; i++)
        {
            if (section[i] == player) plyrCnt +=1;
            else if (section[i]== -player) oppCnt +=1;
            else if (section[i]== 0) openPosCnt +=1;
        }
        if (plyrCnt == 4) scr +=1000;
        if (plyrCnt == 3 && openPosCnt ==1) scr += 5;
        if (plyrCnt ==2 && openPosCnt ==2) scr += 2;
        if (oppCnt == 3 && openPosCnt ==1) scr -= 4;
        
        return scr;
    }

    function getScore(brd, player)
    {
        var scr = 0;
        var sections = sectionsOfFour(brd);
        for (var i=0; i < sections.length; i++)
        {
            scr += sectionScore(sections[i], player);
        }
        for ( var i =0; i<6; i++)
        {
            if (brd[i][3]==player) scr +=3;
        }
        return scr;
    }

    function miniMax(brd, player, depth, alpha, beta)
    {
	    //var openColumnList = getOpenCol(brd);
        if (evalFunction(brd, -1)==true) return [-1, 9999];
        if (evalFunction(brd, 1)==true) return [-1, -9999];
        if (boardFull(brd)) return [-1, 0];	
        if (depth == 0) return [-1, getScore(brd,-1)];
        
        if (player == -1) 
        {
        // Maximizing player
        var value = Number.NEGATIVE_INFINITY;
        var col = -1;
        for (var i = 0; i < 7; i++) 
        {
            if (brd[5][i] == 0) {
                var boardCopy = new Array(6);
                boardCopy = structuredClone(brd);
                var j = 0;
                for (j; j <=4; j++) {
                    if (boardCopy[j][i] == 0)
                        break;
                }
                
                boardCopy[j][i] = player;
                var newScore = miniMax(boardCopy, -player, depth - 1, alpha, beta)[1];
                if (newScore > value) {
                    value = newScore;
                    col = i;
                }
                alpha = Math.max(alpha, value);
                if (alpha >= beta) break;
            }
            
        }
        return [col, value];
    } else 
    {
        // Minimizing player
        var value = Number.POSITIVE_INFINITY;
        var col = -1;
        for (var i = 0; i < 7; i++) 
        {
            if (board[5][i] == 0) {
                var boardCopy = new Array(6);
                boardCopy = structuredClone(brd);
                var j = 0;
                for (j; j <=4; j++) {
                    if (boardCopy[j][i] == 0)
                        break;
                }
                boardCopy[j][i] = player;
                var newScore = miniMax(boardCopy, -player, depth - 1, alpha, beta)[1];
                if (newScore < value) {
                    value = newScore;
                    col = i;
                }
                beta = Math.min(beta, value);
                if (alpha >= beta) break;
            }
            
        }
        return [col, value];
    }
    }