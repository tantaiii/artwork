import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import "../../css/Package.css";
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import { Creator } from "../../Interfaces/UserInterface.ts";
import { UserGetAPI } from "../../API/UserAPI/GET.tsx";
import { ApiResponse } from "../../Interfaces/app.common.ts";
import { useAuth } from "../../secure/AuthContext.tsx";

function ChipDepositeCoin({}) {
  const { theme } = useContext(ThemeContext);
  const [creator, setCreator] = useState<Creator>();
  const { getUserByIdUrl } = UserGetAPI();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCreatorCoins = async () => {
      try {
        const response = (await getUserByIdUrl(user?._id)) as ApiResponse;
        setCreator(response.data);
      } catch (error) {
        console.error("Error fetching creator data:", error);
      }
    };

    if (user?._id) fetchCreatorCoins();
  }, [user]);
  return (
    <div className="premium-typography">
      <Chip
        avatar={
          <Avatar
            alt="Coins"
            src="/icons/coin.gif"
            sx={{ bgcolor: "transparent" }}
          />
        }
        label={`${Number(creator?.coins ?? 0).toFixed(2)}$`}
        variant="outlined"
        sx={{
          "& .MuiChip-avatar": {
            bgcolor: "transparent !important", // ghi đè style của container avatar trong Chip
          },
          "& .MuiChip-label": {
            color: theme.color5, // Thay đổi màu chữ
            fontWeight: "normal", // Đổi kiểu chữ in đậm
            fontSize: "1rem",
            transition: theme.transition,
          },
          transition: "padding 0.3s ease", // chuyển đổi mượt khi padding thay đổi
          "&:hover": {
            paddingRight: "15px",
          },
          "&:hover::after": {
            content: '"💸"',
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: theme.color5,
            fontWeight: "bold",
            fontSize: "1rem",
          },
        }}
        color="secondary"
      />
    </div>
  );
}
export default ChipDepositeCoin;
