import React, { useState } from "react";

interface PlayerNameInputProps {
  onAddPlayer: (playerName: string) => void;
}

const PlayerNameInput: React.FC<PlayerNameInputProps> = ({ onAddPlayer }) => {
  const [playerName, setPlayerName] = useState("");

  const handleAddPlayer = () => {
    if (playerName.trim() !== "") {
      onAddPlayer(playerName);
      setPlayerName(""); // Clear the input after adding
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "500px", marginTop: "20px" }}>
      <style>
        {`
          .player-input-container {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .player-input-container input {
            flex: 1;
            padding: 10px;
            font-size: 14px;
            border: 1px solid #ccc;
            border-radius: 5px;
          }

          .player-input-container button {
            padding: 10px;
            font-size: 14px;
            cursor: pointer;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 5px;
          }

          /* Mobile Styles */
          @media (max-width: 768px) {
            .player-input-container {
              flex-direction: column;
              gap: 10px;
            }

            .player-input-container input,
            .player-input-container button {
              width: 100%;
            }
          }
        `}
      </style>
      <div className="player-input-container">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter player name"
        />
        <button onClick={handleAddPlayer}>Add Player</button>
      </div>
    </div>
  );
};

export default PlayerNameInput;