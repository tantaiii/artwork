import React, { useContext, useEffect, useState } from "react";
import CarouselTag from "./CarouselTag.tsx";
import RecommendedWorks from "./RecommendedWorks.tsx";
import RecommendedUsers from "./RecommendedUsers.tsx";
import ImgForyou from "./ImgForyou.tsx";
import Box from "@mui/material/Box";
import { ThemeContext } from "../../Themes/ThemeProvider.tsx";
import { Creator } from "../../../Interfaces/UserInterface.ts";
import { Artwork } from "../../../Interfaces/ArtworkInterfaces.ts";
import { ArtworkGetAPI } from "../../../API/ArtworkAPI/GET.tsx";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [user, setUser] = useState<Creator | null>(
    JSON.parse(sessionStorage.getItem("auth") ?? "null")
  );

  useEffect(() => {
    const handleUserLogin = async () => {
      const savedAuth = sessionStorage.getItem("auth");
      const savedUser = savedAuth ? JSON.parse(savedAuth) : null;
      setUser(savedUser);
    };
    window.addEventListener("userLoggedIn", handleUserLogin);
    return () => {
      window.removeEventListener("userLoggedIn", handleUserLogin);
    };
  }, []);

  const { getTopLikedArtworks, getAllArtworks } = ArtworkGetAPI();

  const [reccomendedArtworklist, setReccomendedArtworklist] = useState<Artwork[]>([]);
  const [randomArtwork, setrandomArtwork] = useState<Artwork[]>([]);

  useEffect(() => {
    const getArtList = async () => {
      try {
        const top10 = await getTopLikedArtworks();
        setReccomendedArtworklist(top10 || []);

        const allArts = await getAllArtworks();
        const random10 = Array.isArray(allArts)
          ? allArts.sort(() => 0.5 - Math.random()).slice(0, 10)
          : [];
        setrandomArtwork(random10);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      }
    };
    getArtList();
  }, [user]);

  const { theme } = useContext(ThemeContext);

  return (
    <Box className="homepage">
      <div className="carouseltag">
        <CarouselTag />
      </div>

      <Box
        sx={{
          color: theme.color,
          backgroundColor: `rgba(${theme.rgbBackgroundColor},0.97)`,
          transition: theme.transition,
          width: "95%",
          margin: "auto",
          borderRadius: "5px",
          marginBottom: "15px",
        }}
      >
        <div className="recommendedwork">
          <RecommendedWorks artworkList={reccomendedArtworklist} user={user} />
        </div>

        <div className="recommendedusers">
          <RecommendedUsers />
        </div>

        <div className="Randomimg">
          <div className="headrecommended">
            <Typography variant="h5">Random Artworks, GO!!!</Typography>
            <Link to={`randomword`}>
              <div className="seemore">See More</div>
            </Link>
          </div>
          <div className="foryouimg">
            <ImgForyou artworkList={randomArtwork} />
          </div>
        </div>
      </Box>
    </Box>
  );
}
