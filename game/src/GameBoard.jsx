// GameBoard.jsx
import React, { useState, useEffect } from 'react';

function GameBoard({ gameMode, playerNames, currentTurn, setCurrentTurn, scores, setScores, gameState, setGameState }) {
  const [board, setBoard] = useState(gameState || Array(9).fill(null));
  const [winner, setWinner] = useState(null);

  const checkWinner = (board) => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.includes(null) ? null : 'Draw';
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentTurn === playerNames.player1 ? 'X' : 'O';
    setBoard(newBoard);
    setGameState(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner === 'Draw' ? 'Draw' : currentTurn);
      if (gameWinner !== 'Draw') {
        setScores({
          ...scores,
          [currentTurn === playerNames.player1 ? 'player1' : 'player2']: scores[
            currentTurn === playerNames.player1 ? 'player1' : 'player2'
          ] + 1,
        });
      }
    } else {
      setCurrentTurn(currentTurn === playerNames.player1 ? playerNames.player2 : playerNames.player1);
    }
  };

  useEffect(() => {
    if (gameMode === 'pvc' && currentTurn === 'Computer' && !winner) {
      const emptyIndices = board.map((val, idx) => (val === null ? idx : null)).filter((idx) => idx !== null);
      const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      setTimeout(() => handleClick(randomIndex), 500);
    }
  }, [currentTurn, board, winner]);

  return (
    <div className="game-board">
      {board.map((cell, idx) => (
        <button key={idx} className="cell" onClick={() => handleClick(idx)}>
          {cell}
        </button>
      ))}
      {winner && <h3>{winner === 'Draw' ? 'It\'s a Draw!' : `${winner} Wins!`}</h3>}
    </div>
  );
}

export default GameBoard;
