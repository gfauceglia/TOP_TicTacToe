const Player = (sign) => {
  let _sign = sign;
  const getSign = () => _sign;
  return { getSign };
}

const Cell = () => {
  let value = undefined;
  const getValue = () => value;
  const setValue = (player) => value = player.getSign();
  return { getValue, setValue };
}

const gameBoard = (() => {
  const _cells = 9;
  let _board = new Array(_cells);
  for (let i = 0; i < _cells; i++) {
    _board[i] = Cell();
  }

  const getBoard = () => _board;

  const setSign = (idx, player) => {
    if (_board[idx].getValue()) return false;
    _board[idx].setValue(player);
    return true;
  }

  const clearField = () => {
    for (let i = 0; i < _cells; i++) {
      _board[i] = Cell();
    }
  }

  const printBoard = () => {
    const boardWithCellValues = _board.map((cell) => cell.getValue() || ' ');
    console.log(`
      ${boardWithCellValues[0]} | ${boardWithCellValues[1]} | ${boardWithCellValues[2]}
      ---------
      ${boardWithCellValues[3]} | ${boardWithCellValues[4]} | ${boardWithCellValues[5]}
      ---------
      ${boardWithCellValues[6]} | ${boardWithCellValues[7]} | ${boardWithCellValues[8]}
    `);
  }
  return { getBoard, setSign, clearField, printBoard };
})();

const gameController = (() => {
  const players = [Player('X'), Player('O')];
  let _activePlayer = players[0];
  
  const getActivePlayer = () => _activePlayer;
  
  const _switchPlayerTurn = () => {
    _activePlayer = _activePlayer === players[0] ? players[1] : players[0];
  }

  const _printNewRound = (board) => {
    gameBoard.printBoard();
    if (!checkForWin(board) && !checkForDraw(board)) {
      console.log(`${getActivePlayer().getSign()}'s turn.`);
    }
  }

  const playRound = (idx) => {
    let _board = gameBoard.getBoard();
    if (!gameBoard.setSign(idx, getActivePlayer())) {
      console.log("Could not set the requested sign on the board");
      return;
    }

    _switchPlayerTurn();
    _printNewRound(_board);
    if (checkForWin(_board)) {
      _switchPlayerTurn();
      return `${getActivePlayer().getSign()} won the game.`;
    } else if (checkForDraw(_board)) {
      return 'Draw.';
    }
  }
  
  const _checkRows = (board) => {
    for (let i = 0; i < 3; i++) {
      let row = []
      for (let j = i * 3; j < i * 3 + 3; j++) {
        row.push(board[j].getValue());
      }

      if (row.every(field => field == 'X') || row.every(field => field == 'O')) {
        return true;
      }
    }
  return false;
  }

  const _checkColumns = (board) => {
    for (let i = 0; i < 3; i++) {
      let column = []
      for (let j = 0; j < 3; j++) {
        column.push(board[i + 3 * j].getValue());
      }
      if (column.every(field => field == 'X') || column.every(field => field == 'O')) {
        return true;
      }
    }
  return false;
  }

  const _checkDiagonals = (board) => {
    diagonal1 = [board[0], board[4], board[8]];
    diagonal2 = [board[2], board[4], board[6]];
    
    return (diagonal1.every(field => field.getValue() == 'X') || diagonal1.every(field => field.getValue() == 'O') || 
            diagonal2.every(field => field.getValue() == 'X') || diagonal2.every(field => field.getValue() == 'O'));
  }

  const checkForWin = (board) => (_checkColumns(board) || _checkDiagonals(board) || _checkRows(board));

  const checkForDraw = (board) => {
    if (checkForWin(board)) {
      return false;
    }
    for (let i = 0; i < 9; i++) {
      const field = board[i].getValue();
      if (field == undefined) {
          return false;
      }
    }
  return true;
  }

  const restartGame = () => {
    gameBoard.clearField();
    _activePlayer = players[0];
    _printNewRound(gameBoard.getBoard());
  }

  return {getActivePlayer, playRound, checkForWin, checkForDraw, restartGame};
})();