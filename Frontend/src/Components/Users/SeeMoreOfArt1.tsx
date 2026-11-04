import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Pagination from "@mui/material/Pagination";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import "../../css/SeeMoreForYou.css";
import { ArtworkGetAPI } from "../../API/ArtworkAPI/GET.tsx";
import { Artwork } from "../../Interfaces/ArtworkInterfaces";
import { PlaceHoldersImageCard } from "./PlaceHolders.jsx";
import { useNavigate } from "react-router-dom";

export default function SeeMoreOfArt1() {
  const { theme } = useContext(ThemeContext);
  const { getAllArtworks } = ArtworkGetAPI();

  const [artworkList, setArtworkList] = useState<Artwork[]>([]);
  const [hoveredID, setHoveredID] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const imagesPerPage = 30;

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const allArtworks = await getAllArtworks();
        const sorted = [...allArtworks].sort(
          (a, b) => (b.artworkID ?? 0) - (a.artworkID ?? 0)
        );
        setArtworkList(sorted.slice(0, 100));
      } catch (error) {
        console.error("Failed to load artworks:", error);
        setArtworkList([]);
      }
    };
    fetchArtworks();
  }, []);

  const handleChangePage = (event, value) => setCurrentPage(value);

  const indexOfLastImage = currentPage * imagesPerPage;
  const currentImages = artworkList.slice(
    indexOfLastImage - imagesPerPage,
    indexOfLastImage
  );
  const totalPages = Math.ceil(artworkList.length / imagesPerPage);

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
          <Typography variant="h5">Recommended Works</Typography>
          <div className="listimage">
            <Box className="boxlistimage">
              <ImageList variant="masonry" cols={4} gap={7}>
                {currentImages.length > 0 ? (
                  currentImages.map((work) => (
                    <ImageListItem
                      key={work._id}
                      style={{ position: "relative", cursor: "pointer" }}
                      onMouseEnter={() => setHoveredID(work._id)}
                      onMouseLeave={() => setHoveredID(null)}
                      onClick={() => navigate(`artwork/${work._id}`)}
                    >
                      <img
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          borderRadius: "5px",
                          minWidth: "182px",
                          minHeight: "182px",
                        }}
                        src={
                          (work.imageFile?.preview ||
                            work.imageFile?.image ||
                            work.imageFile ||
                            "/images/loadingImages.gif") as string
                        }
                        alt={work.artworkName}
                        loading="lazy"
                      />
                      {hoveredID === work._id && (
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                            textShadow:
                              "2px 2px 4px rgba(0, 0, 0, 0.6)",
                            fontSize: "18px",
                            zIndex: 1,
                            pointerEvents: "none",
                          }}
                        >
                          {work.artworkName}
                        </div>
                      )}
                    </ImageListItem>
                  ))
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
