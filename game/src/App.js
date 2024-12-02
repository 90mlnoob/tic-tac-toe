import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [playerNames, setPlayerNames] = useState(
    () =>
      JSON.parse(localStorage.getItem("playerNames")) || {
        player1: "",
        player2: "",
      }
  );
  const [scores, setScores] = useState(
    () =>
      JSON.parse(localStorage.getItem("scores")) || {
        player1: 0,
        player2: 0,
      }
  );
  const [currentTurn, setCurrentTurn] = useState(
    () => localStorage.getItem("currentTurn") || ""
  );
  const [board, setBoard] = useState(
    () => JSON.parse(localStorage.getItem("board")) || Array(9).fill(null)
  );
  const [gameMode, setGameMode] = useState(
    () => localStorage.getItem("gameMode") || "pvp"
  );
  const [winner, setWinner] = useState(null);
  const [isGameSetup, setIsGameSetup] = useState(!playerNames.player1);
  const [nextTurn, setNextTurn] = useState(0);

  const saveState = () => {
    localStorage.setItem("playerNames", JSON.stringify(playerNames));
    localStorage.setItem("scores", JSON.stringify(scores));
    localStorage.setItem("currentTurn", currentTurn);
    localStorage.setItem("board", JSON.stringify(board));
    localStorage.setItem("gameMode", gameMode);
  };

  useEffect(() => {
    saveState();
  }, [playerNames, scores, currentTurn, board, gameMode]);

  useEffect(() => {
    if (gameMode === "pvc" && currentTurn === "Computer" && !winner) {
      const bestMove = findBestMove(board);
      if (bestMove !== null) {
        handleClick(bestMove, true);
      }
    }
  }, [currentTurn, board, winner, gameMode]);

  const handleToss = () => {
    const firstPlayer =
      Math.random() < 0.5
        ? playerNames.player1
        : gameMode === "pvp"
        ? playerNames.player2
        : "Computer";

    console.log(
      "FIRST PLAYER:",
      firstPlayer,
      "gameMode: ",
      gameMode,
      "playerNames.player1",
      playerNames.player1,
      "playerNames.player2",
      playerNames.player2
    );
    setCurrentTurn(firstPlayer);
  };

  const handleGameSetup = (player1, player2, mode) => {
    setPlayerNames({ player1, player2: mode === "pvp" ? player2 : "Computer" });
    setGameMode(mode);
    setNextTurn(1);
    console.log("next Turn handleGameSetup: ", nextTurn);
    // handleToss();
    setIsGameSetup(false);
  };
  useEffect(() => {
    if (nextTurn > 0) {
      handleToss();
      localStorage.setItem("currentTurn", currentTurn);
      console.log("Current Turn: useeffect of nextTurn ", currentTurn);
    }
  }, [nextTurn]);

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
    return board.includes(null) ? null : "Draw";
  };

  const minimax = (newBoard, depth, isMaximizing) => {
    const result = checkWinner(newBoard);
    if (result === "X") return -10 + depth; // Player wins
    if (result === "O") return 10 - depth; // Computer wins
    if (result === "Draw") return 0; // Draw

    const scores = [];
    for (let i = 0; i < 9; i++) {
      if (!newBoard[i]) {
        newBoard[i] = isMaximizing ? "O" : "X"; // Simulate move
        scores.push(minimax(newBoard, depth + 1, !isMaximizing)); // Recursive call
        newBoard[i] = null; // Undo move
      }
    }
    return isMaximizing ? Math.max(...scores) : Math.min(...scores);
  };

  const findBestMove = (currentBoard) => {
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        currentBoard[i] = "O"; // Simulate computer move
        const score = minimax(currentBoard, 0, false); // Evaluate move
        currentBoard[i] = null; // Undo move
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  const handleClick = (index, isComputer = false) => {
    if (board[index] || winner || (!isComputer && currentTurn === "Computer"))
      return;

    const newBoard = [...board];
    newBoard[index] = currentTurn === playerNames.player1 ? "X" : "O";
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner === "Draw" ? "Draw" : currentTurn);
      if (gameWinner !== "Draw") {
        setScores({
          ...scores,
          [currentTurn === playerNames.player1 ? "player1" : "player2"]:
            scores[
              currentTurn === playerNames.player1 ? "player1" : "player2"
            ] + 1,
        });
      }
    } else {
      setCurrentTurn(
        currentTurn === playerNames.player1
          ? playerNames.player2
          : playerNames.player1
      );
    }
  };

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    // handleToss();
    setNextTurn(nextTurn + 1);
    console.log("next Turn: resetBoard ", nextTurn);
  };

  const resetGame = () => {
    setPlayerNames({ player1: "", player2: "" });
    setScores({ player1: 0, player2: 0 });
    setBoard(Array(9).fill(null));
    setCurrentTurn("");
    setWinner(null);
    setIsGameSetup(true);
    setGameMode("pvp");
    localStorage.clear();
  };

  return (
    <div className="app">
      <h1>Tic-Tac-Toe</h1>
      {isGameSetup ? (
        <div className="form-container">
          <h2>Setup Game</h2>
          <form>
            <select id="mode" onChange={(e) => setGameMode(e.target.value)}>
              <option value="pvp">Player vs Player</option>
              <option value="pvc">Player vs Computer</option>
            </select>

            <input
              type="text"
              placeholder="Player 1 Name"
              id="player1"
              required
            />
            <input
              type="text"
              placeholder="Player 2 Name (leave blank for Computer)"
              id="player2"
              required={gameMode === "pvp"}
              disabled={gameMode !== "pvp"}
            />

            <button
              onClick={() =>
                handleGameSetup(
                  document.getElementById("player1").value,
                  document.getElementById("player2").value,
                  document.getElementById("mode").value
                )
              }
            >
              Start Game
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="scoreboard">
            <p>
              {playerNames.player1}: {scores.player1}
            </p>
            <p>
              {playerNames.player2}: {scores.player2}
            </p>
            <p>Next Turn: {currentTurn}</p>
          </div>
          <div className="game-board">
            {board.map((cell, idx) => (
              <button
                key={idx}
                className="cell"
                onClick={() => handleClick(idx)}
              >
                {cell}
              </button>
            ))}
          </div>
          {winner && (
            <h2>{winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}</h2>
          )}
          <div className="controls">
            <button onClick={resetBoard}>New Round</button>
            <button onClick={resetGame}>Reset Game</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
