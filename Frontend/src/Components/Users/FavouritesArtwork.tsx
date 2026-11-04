import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
// @ts-ignore CSS is loaded by the bundler; TypeScript has no CSS module declaration.
import "../../css/SeeMoreOfArt1.css";
import { InteractGetAPI } from "../../API/ArtworkAPI/GET.tsx";
import { Artwork } from "../../Interfaces/ArtworkInterfaces";
import { PlaceHoldersImageCard } from "./PlaceHolders.jsx";
import { Link } from "react-router-dom";

interface FavouritesArtworkProps {
  userId: string;
}

export default function FavouritesArtwork({ userId }: FavouritesArtworkProps) {
  const { theme } = useContext(ThemeContext);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 30;
  const [artworkList, setArtworkList] = useState<Artwork[]>([]);

  const { getFavouritesArtworks } = InteractGetAPI();

  useEffect(() => {
    const getArtworks = async () => {
      try {
        const artworkList = await getFavouritesArtworks(userId);

        const indexOfLastImage = currentPage * imagesPerPage;
        const indexOfFirstImage = indexOfLastImage - imagesPerPage;
        const currentImages = artworkList?.slice(indexOfFirstImage, indexOfLastImage) || [];

        setArtworkList(currentImages);
      } catch (error) {
        throw error;
      }
    };

    if (userId) getArtworks();
  }, [currentPage, userId]);

  function ArtWorkList() {
    return (
      <ImageList variant="masonry" cols={4}>
        {artworkList.map((work) => (
          <Link key={work._id} to={`/characters/artwork/${work._id}`}>
            <ImageListItem key={work._id}>
              <img
                style={{ cursor: "pointer" }}
                src={
                  (work.imageFile?.preview ||
                    work.imageFile?.image ||
                    work.imageFile ||
                    "/images/loadingImages.gif") as string
                }
                alt={work.artworkName}
                loading="lazy"
              />
            </ImageListItem>
          </Link>
        ))}
      </ImageList>
    );
  }

  return (
    <div className="seemorecommentwork" style={{ paddingTop: "2%", paddingBottom: "5%" }}>
      <Box
        className="box"
        sx={{
          color: theme.color,
          backgroundColor: `rgba(${theme.rgbBackgroundColor},0.97)`,
          transition: theme.transition,
          width: "95%",
          margin: "auto",
          borderRadius: "5px",
        }}
      >
        <div className="content-recomment">
          <Typography variant="h5">Favourite Artwork:</Typography>
          <div className="listimage">
            <Box className="boxlistimage">
              {artworkList.length !== 0 ? <ArtWorkList /> : <PlaceHoldersImageCard />}
            </Box>
          </div>
        </div>
      </Box>
    </div>
  );
}
