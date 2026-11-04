import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Pagination from "@mui/material/Pagination";
import "../../css/SeeMoreForYou.css";
import { ArtworkGetAPI } from "../../API/ArtworkAPI/GET.tsx";
import { Artwork } from "../../Interfaces/ArtworkInterfaces";
import { PlaceHoldersImageCard } from "./PlaceHolders.jsx";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Link } from "react-router-dom";

export default function SeeMoreForYou() {
  const { theme } = useContext(ThemeContext);
  const { getAllArtworks } = ArtworkGetAPI();

  const [currentPage, setCurrentPage] = useState(1);
  const [artworkList, setArtworkList] = useState<Artwork[]>([]);
  const imagesPerPage = 30;

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const allArtworks = await getAllArtworks();
        const shuffled = [...allArtworks].sort(() => 0.5 - Math.random());
        setArtworkList(shuffled.slice(0, 100));
      } catch (err) {
        console.error("Error fetching artworks:", err);
        setArtworkList([]);
      }
    };
    fetchArtworks();
  }, []);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = artworkList.slice(indexOfFirstImage, indexOfLastImage);
  const totalPages = Math.ceil(artworkList.length / imagesPerPage);

  function ArtworkList() {
    return (
      <>
        {currentImages.map((work: Artwork) => (
          <Link key={work._id} to={`artwork/${work._id}`}>
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
      </>
    );
  }

  return (
    <div className="seemorecommentwork">
      <Box
        className="box"
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
        <div className="content-recomment">
          <Typography variant="h5">Random Works</Typography>

          <div className="listimage">
            <Box className="boxlistimage">
              <ImageList variant="masonry" cols={4} gap={7}>
                {currentImages.length > 0 ? (
                  <ArtworkList />
                ) : (
                  <PlaceHoldersImageCard />
                )}
              </ImageList>
            </Box>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handleChangePage}
              color="primary"
              sx={{ mt: 2, mb: 2 }}
            />
          </div>
        )}
      </Box>
    </div>
  );
}
