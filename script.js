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

  return { getBoard, setSign, clearField };
})();

const gameController = (() => {
  const players = [Player('X'), Player('O')];
  let _activePlayer = players[0];
  
  const getActivePlayer = () => _activePlayer;
  const getLastPlayer = () => _activePlayer === players[0] ? players[1] : players[0];
  
  const _switchPlayerTurn = () => {
    _activePlayer = _activePlayer === players[0] ? players[1] : players[0];
  }

  const playRound = (idx) => {
    let _board = gameBoard.getBoard();
    if (!gameBoard.setSign(idx, getActivePlayer())) {
      alert("Could not set the requested sign on the board");
      return false;
    }

    if (checkForWin(_board)) {
      console.log(`${getActivePlayer().getSign()} won the game.`);
    } else if (checkForDraw(_board)) {
      console.log('Draw.');
    }
    _switchPlayerTurn();
    return true;
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
    displayController.clearBoard();
  }

  return { getActivePlayer, getLastPlayer, playRound, checkForWin, checkForDraw, restartGame };
})();

const displayController = (() => {
  const _board = Array.from(document.querySelectorAll('button.field'));
  const _restart = document.querySelector('button.rst');

  const _changeTurn = (sign) => {
    const x = document.getElementById('X');
    const o = document.getElementById('O');

    if (sign === 'X') {
      x.classList.add('active');
      o.classList.remove('active');
    } else {
      o.classList.add('active');
      x.classList.remove('active');
    }
  }

  for (let i = 0; i < _board.length; i++) {
    let field = _board[i];
    field.addEventListener('click', () => {
      if (gameController.playRound(i)) {
        const p = field.querySelector('p');
        p.textContent = gameController.getLastPlayer().getSign();
        _changeTurn(gameController.getActivePlayer().getSign());
      }
    });
  }

  _restart.addEventListener('click', () => {
    gameController.restartGame();
    _changeTurn('X');
  })

  const clearBoard = () => {
    _board.forEach(field => {
      const p = field.firstChild;
      p.textContent = '';
    });
  }

  return { clearBoard }
})();