// ScoreBoard.jsx
import React from 'react';

function ScoreBoard({ playerNames, scores }) {
  return (
    <div className="scoreboard">
      <h2>Scoreboard</h2>
      <p>
        {playerNames.player1}: {scores.player1}
      </p>
      <p>
        {playerNames.player2}: {scores.player2}
      </p>
    </div>
  );
}

export default ScoreBoard;
