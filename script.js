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
  }

  const clearField = () => {
    for (let i = 0; i < _cells; i++) {
      _board[i] = undefined;
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

  const _printNewRound = () => {
    gameBoard.printBoard();
    console.log(`${getActivePlayer().getSign()}'s turn.`);
  }

  const playRound = (idx) => {
    if (!gameBoard.setSign(idx, getActivePlayer())) {
      console.log("Could not set the requested sign on the board");
      return;
    }
    _switchPlayerTurn();
    _printNewRound();
  }
  
  const _checkRows = (board) => {
    for (let i = 0; i < 3; i++) {
      let row = []
      for (let j = i * 3; j < i * 3 + 3; j++) {
        row.push(board[j]);
      }

      return (row.every(field => field == 'X') || row.every(field => field == 'O'));
    }
  return false;
  }

  const _checkColumns = (board) => {
    for (let i = 0; i < 3; i++) {
      let column = []
      for (let j = 0; j < 3; j++) {
        column.push(board[i + 3 * j]);
      }
      return (column.every(field => field == 'X') || column.every(field => field == 'O'));
    }
  return false;
  }

  const _checkDiagonals = (board) => {
    diagonal1 = [board.getField(0), board.getField(4), board.getField(8)];
    diagonal2 = [board.getField(6), board.getField(4), board.getField(2)];
    
    return (diagonal1.every(field => field == 'X') || diagonal1.every(field => field == 'O') || 
            diagonal2.every(field => field == 'X') || diagonal2.every(field => field == 'O'));
  }

  const checkForWin = (board) => (_checkColumns(board) || _checkDiagonals(board) || _checkRows(board));

  const checkForDraw = (board) => {
    if (checkForWin(board)) {
      return false;
    }
    for (let i = 0; i < 9; i++) {
      const field = board.getField(i);
      if (field == undefined) {
          return false;
      }
    }
  return true;
  }

  return {getActivePlayer, playRound, checkForWin, checkForDraw};
})();