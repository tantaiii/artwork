import React, { useEffect, useRef, useState, useContext } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { ThemeContext } from "./Themes/ThemeProvider.tsx";
import { useAuth } from "../secure/AuthContext.tsx";
import { InteractGetAPI } from "../API/ArtworkAPI/GET.tsx";
import { InteractPOSTAPI } from "../API/ArtworkAPI/POST.tsx";

export default function FavouritesIcon({ artworkID }) {
  const { theme } = useContext(ThemeContext);
  const { accessToken } = useAuth();
  const spansRef = useRef([]);
  const [isClicked, setIsClicked] = useState(false);

  const { getFavouriteStatus } = InteractGetAPI();
  const { toggleFavourite } = InteractPOSTAPI();

  useEffect(() => {
    const fetchFavouriteStatus = async () => {
      if (!artworkID) return;
      try {
        if (accessToken) {
          const res = await getFavouriteStatus(artworkID);
          setIsClicked(res?.data ?? false);
        } else {
          setIsClicked(false);
        }
      } catch (error) {
        throw error;
      }
    };
    fetchFavouriteStatus();
  }, [artworkID, accessToken]);

  const handleFavouriteClick = async () => {
    if (!accessToken) {
      alert("Please log in to continue");
      return;
    }

    try {
      const res = await toggleFavourite(artworkID);
      if (res?.data) {
        setIsClicked(res.data.isFavourite);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (isClicked && spansRef.current) {
      const spans = spansRef.current;
      for (const span of spans) {
        span?.classList.add("anim");
      }
      const timeoutId = setTimeout(() => {
        spans.forEach((span) => span?.classList.remove("anim"));
      }, 700);
      return () => clearTimeout(timeoutId);
    }
  }, [isClicked]);

  return (
    <div className="hero">
      <div className="button-favourite">
        <button
          style={{ display: "flex" }}
          className={`btn ${isClicked ? "active" : ""}`}
          onClick={handleFavouriteClick}
        >
          {isClicked ? (
            <FavoriteIcon sx={{ fontSize: 35 }} style={{ color: "#ff1876" }} />
          ) : (
            <FavoriteBorderIcon
              sx={{ color: theme.color, backgroundColor: "none", fontSize: 35 }}
            />
          )}
          {Array.from({ length: 16 }).map((_, index) => (
            <span
              key={index}
              ref={(el) => (spansRef.current[index] = el)}
            ></span>
          ))}

          <h4
            className="addfavourite"
            style={{
              paddingTop: "5px",
              color: isClicked ? "#ff1876" : theme.color,
            }}
          >
            {isClicked ? "Thanks For Your Love!" : "Add To Favourites"}
          </h4>
        </button>
      </div>
    </div>
  );
}
