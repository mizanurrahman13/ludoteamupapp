import React, { useState } from "react";
import * as XLSX from "xlsx";
import PlayerNameInput from "../PlayerNameInput/PlayerNameInput"; // Import the PlayerNameInput component
import DownloadButton from "../DownloadButton/DownloadButton"; // Import the DownloadButton component

export type Team = {
  name: string;
  players: string[];
  color: string; // Add a color property for each team
};

const FileUpload: React.FC = () => {
  const [players, setPlayers] = useState<string[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC300",
    "#C70039", "#900C3F", "#581845", "#00CED1", "#7B68EE",
  ];

  const teamsPerPage = 10;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const playerList = XLSX.utils.sheet_to_json(sheet, { header: 1 }).flat() as string[];
      setPlayers((prevPlayers) => [...prevPlayers, ...playerList]); // Append new players
    };
    reader.readAsArrayBuffer(file);
  };

  const addPlayer = (playerName: string) => {
    setPlayers((prevPlayers) => [...prevPlayers, playerName]);
  };

  // const generateTeams = () => {
  //   const shuffled = [...players].sort(() => 0.5 - Math.random());
  //   const tempTeams: Team[] = [];
  //   let teamIndex = 0;

  //   for (let i = 0; i < shuffled.length; i += 2) {
  //     const teamName = `Team ${String.fromCharCode(65 + teamIndex)}`;
  //     const teamPlayers = shuffled.slice(i, i + 2);
  //     const teamColor = colors[teamIndex % colors.length];
  //     tempTeams.push({ name: teamName, players: teamPlayers, color: teamColor });
  //     teamIndex++;
  //   }
  //   setTeams(tempTeams);
  //   setCurrentPage(1);
  // };

  const generateTeams = () => {
    const shuffled = [...players].sort(() => 0.5 - Math.random());
    const tempTeams: Team[] = [];
  
    for (let i = 0; i < shuffled.length; i += 2) {
      const teamName = `Team ${Math.floor(i / 2) + 1}`; // Use numbering instead of alphabet
      const teamPlayers = shuffled.slice(i, i + 2);
      const teamColor = colors[(Math.floor(i / 2)) % colors.length];
      tempTeams.push({ name: teamName, players: teamPlayers, color: teamColor });
    }
    setTeams(tempTeams);
    setCurrentPage(1);
  };
  

  const indexOfLastTeam = currentPage * teamsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
  const currentTeams = teams.slice(indexOfFirstTeam, indexOfLastTeam);
  const totalPages = Math.ceil(teams.length / teamsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    padding: "10px", // Add padding for smaller screens
  };

  const teamListStyle: React.CSSProperties = {
    maxHeight: "400px",
    overflowY: "auto",
    width: "80%", // Set width as a percentage for responsiveness
    maxWidth: "600px", // Limit max width for larger devices
    border: "1px solid #ccc",
    padding: "10px",
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "8px", // Add rounded corners for a modern look
    backgroundColor: "#f9f9f9", // Subtle background color for better visuals
  };

  const teamListContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  };

  // Adjust media queries for additional responsiveness
  const mediaQueries = `
    @media (max-width: 768px) {
      h2 {
        font-size: 1.5rem; // Scale down header size on tablets
      }
      input, button {
        width: 100%; // Full-width buttons and inputs for mobile
        font-size: 14px;
      }
      .teamList {
        width: 90%; // Adjust list width on smaller screens
      }
    }
  
    @media (max-width: 480px) {
      h2 {
        font-size: 1.2rem; // Scale down header size for smaller devices
      }
      input, button {
        font-size: 12px; // Smaller font size for mobile
      }
      .teamList {
        width: 100%; // Maximize width on mobile devices
      }
    }
  `;

  return (
    <>
      <style>{mediaQueries}</style>
      <div style={containerStyle}>
        <h2 style={{ marginBottom: "20px" }}>Ludo Team-Up Generator</h2>
        <input type="file" accept=".xlsx" onChange={handleFileUpload} />
        <PlayerNameInput onAddPlayer={addPlayer} />
        <button
          onClick={generateTeams}
          disabled={players.length < 2}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Generate Teams
        </button>
        {teams.length > 0 && (
          <div style={{ marginTop: "30px", width: "100%" }}>
            <h3>Generated Teams</h3>
            <div style={teamListContainerStyle}>
              <div style={teamListStyle}>
                <ul style={{ listStyleType: "none", padding: 0 }}>
                  {currentTeams.map((team, index) => (
                    <li
                      key={index}
                      style={{
                        fontWeight: "bold",
                        color: team.color, // Dynamically apply color
                        margin: "10px 0",
                      }}
                    >
                      {team.name}: {team.players.join(" and ")}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                style={{
                  marginRight: "10px",
                  padding: "5px 10px",
                  cursor: currentPage > 1 ? "pointer" : "not-allowed",
                }}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                style={{
                  marginLeft: "10px",
                  padding: "5px 10px",
                  cursor: currentPage < totalPages ? "pointer" : "not-allowed",
                }}
              >
                Next
              </button>
            </div>
            <DownloadButton teams={teams} />
          </div>
        )}
      </div>
    </>
  );
};

export default FileUpload;
