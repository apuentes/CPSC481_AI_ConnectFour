function evalFunction(board, curPlayer)
{
    //Check for horizontal winner
    let consec = 0;
    for (let row=0; row<6; row++)
    {
        for (let col=0; col<7; col++)
        {
            if (board[row][col]==curPlayer)
            {
                consec = consec +1;
                if (consec==4)
                {
                    return true;
                }
            }
            else if(board[row][col]!=curPlayer)
            {
                consec = 0;
            }
        }
        consec = 0; 
    }
    //Check for vertical winner
    consec = 0;
    for (let col=0; col<7; col++)
    {
        for (let row=0; row<6; row++)
        {
            if (board[row][col]==curPlayer)
            {
                consec = consec+1;
                if (consec==4)
                {
                    return true;
                }
            }
            else
            {
                consec = 0;
            }
        }
        consec = 0;
    }
    //Check positive slope winner
    for (let row=0; row<3; row++)
    {
        for (let col=0; col<4; col++)
        {
            if (board[row][col]==curPlayer && board[row+1][col+1]==curPlayer && board[row+2][col+2]==curPlayer && board[row+3][col+3]==curPlayer)
            {
                return true;
            }
        }
     }
    //Check negative slope winner
    for (let row=5; row>2; row--)
    {
        for (let col=0; col<4; col++)
        {
            if (board[row][col]==curPlayer && board[row-1][col+1]==curPlayer && board[row-2][col+2]==curPlayer && board[row-3][col+3]==curPlayer)
            {
                return true;
            }
        }
     }
    return false;

}