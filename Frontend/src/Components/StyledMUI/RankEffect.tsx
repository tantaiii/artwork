import React from "react";
import Typography from "@mui/material/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem } from "@fortawesome/free-solid-svg-icons";

interface RankEffectProps {
  type: 2 | 3 | 4 | 5; // typeID values corresponding to ranks
}

const baseStyle = {
  zIndex: 1000,
  textAlign: "center" as const,
  position: "absolute" as const,
  bottom: 0,
  right: 0,
  padding: "2px 6px",
  borderRadius: "4px",
  fontSize: "9px",
  fontWeight: "bold",
  color: "black",
  display: "flex",
  alignItems: "center",
  gap: "2px",
};

const effects = {
  2: {
    label: "Artisan",
    style: {
      ...baseStyle,
      bgcolor: "gold",
      transform: "translate(0%, 25%)",
      animation: "artisan-blink 1.5s infinite",
      "@keyframes artisan-blink": {
        "0%, 100%": {
          backgroundColor: "gold",
          color: "black",
          boxShadow: "0 0 8px rgba(255, 215, 0, 0.6)",
        },
        "50%": {
          backgroundColor: "black",
          color: "gold",
          boxShadow: "0 0 8px rgba(0, 0, 0, 0.6)",
        },
      },
    },
  },
  3: {
    label: "Artovator",
    style: {
      ...baseStyle,
      bgcolor: "#00BFFF",
      transform: "translate(8%, 25%)",
      animation: "artovator-blink 1.5s infinite",
      "@keyframes artovator-blink": {
        "0%, 100%": {
          backgroundColor: "#00BFFF",
          color: "black",
          boxShadow: "0 0 8px rgba(131, 220, 255, 0.6)",
        },
        "50%": {
          backgroundColor: "black",
          color: "#00BFFF",
          boxShadow: "0 0 8px rgba(0, 0, 0, 0.6)",
        },
      },
    },
  },
  4: {
    label: "Artmaster",
    style: {
      ...baseStyle,
      bgcolor: "#e4f8ba",
      transform: "translate(9%, 25%)",
      animation: "artmaster-blink 1.5s infinite",
      "@keyframes artmaster-blink": {
        "0%, 100%": {
          backgroundColor: "#e4f8ba",
          color: "black",
          boxShadow: "0 0 8px rgba(148, 244, 158, 0.6)",
        },
        "50%": {
          backgroundColor: "black",
          color: "#e4f8ba",
          boxShadow: "0 0 8px rgba(0, 0, 0, 0.6)",
        },
      },
    },
  },
  5: {
    label: "Artist",
    style: {
      ...baseStyle,
      bgcolor: "orange",
      transform: "translate(-7%, 25%)",
      animation: "artist-blink 1.5s infinite",
      "@keyframes artist-blink": {
        "0%, 100%": {
          backgroundColor: "orange",
          color: "black",
          boxShadow: "0 0 8px rgb(247, 87, 0)",
        },
        "50%": {
          backgroundColor: "black",
          color: "orange",
          boxShadow: "0 0 8px rgb(247, 87, 0)",
        },
      },
    },
  },
};

export const RankEffect: React.FC<RankEffectProps> = ({ type }) => {
  console.log("RankEffect received type:", type); // Debug log cho type
  const typeNumber = Number(type);
  const effect = effects[typeNumber];

  if (!effect) {
    console.log("No effect found for type:", typeNumber);
    return null;
  }

  return (
    <Typography sx={effect.style}>
      {effect.label}
      <FontAwesomeIcon icon={faGem} />
    </Typography>
  );
};
