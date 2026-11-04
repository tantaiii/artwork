// src/Components/ArtHubAIButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

// Use a simple emoji icon to avoid external dependency on 'lucide-react'
const ImageIcon = (props) => <img src="/icons/ai.png" alt="AI" {...props} />;

const ArtHubAIButton = () => {
  const navigate = useNavigate();
  const handleClick = () => navigate("arthubai");

  const style = {
    position: "fixed",
    bottom: "calc(2rem + 60px)",
    right: "2rem",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "#06b6d4",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    zIndex: 1002,
  };

  return (
    <div style={style} onClick={handleClick} title="ArtHub AI" role="button" aria-label="Open ArtHub AI">
      <ImageIcon style={{ color: "white", width: 28, height: 28 }} />
    </div>
  );
};

export default ArtHubAIButton;
