// GameSetup.jsx
import React, { useState } from 'react';

function GameSetup({ setGameMode, setPlayerNames, setCurrentTurn }) {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [mode, setMode] = useState('pvp');

  const handleStart = () => {
    const tossWinner = Math.random() < 0.5 ? player1 : mode === 'pvp' ? player2 : 'Computer';
    setPlayerNames({ player1, player2: mode === 'pvp' ? player2 : 'Computer' });
    setGameMode(mode);
    setCurrentTurn(tossWinner);
  };

  return (
    <div className="game-setup">
      <h2>Setup Game</h2>
      <input
        type="text"
        placeholder="Player 1 Name"
        value={player1}
        onChange={(e) => setPlayer1(e.target.value)}
      />
      {mode === 'pvp' && (
        <input
          type="text"
          placeholder="Player 2 Name"
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
        />
      )}
      <select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="pvp">Player vs Player</option>
        <option value="pvc">Player vs Computer</option>
      </select>
      <button disabled={!player1 || (mode === 'pvp' && !player2)} onClick={handleStart}>
        Start Game
      </button>
    </div>
  );
}

export default GameSetup;
