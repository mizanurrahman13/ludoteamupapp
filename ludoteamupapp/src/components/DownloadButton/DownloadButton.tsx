import React from "react";
import * as XLSX from "xlsx";
import { Team } from "../FileUpload/FileUpload"; // Import Team type if it's in FileUpload

interface DownloadButtonProps {
  teams: Team[]; // Array of teams to generate Excel
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ teams }) => {
  // Function to create and download .xlsx file
  const handleDownload = () => {
    const workbook = XLSX.utils.book_new();
    const worksheetData: any[] = [];

    teams.forEach((team) => {
      worksheetData.push([
        { v: team.name, s: { font: { color: { rgb: team.color.replace("#", "") } } } }, // Team name styled with its color
        { v: team.players.join(", "), s: { font: { color: { rgb: team.color.replace("#", "") } } } }, // Players styled with team color
      ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Teams");

    // Trigger download
    XLSX.writeFile(workbook, "teamup-list.xlsx");
  };

  return (
    <button
      onClick={handleDownload}
      style={{
        marginTop: "20px",
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        cursor: "pointer",
      }}
    >
      Download Excel
    </button>
  );
};

export default DownloadButton;
