import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { CardActionArea, Typography, Box } from "@mui/material"; // Loại bỏ Pagination
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { GetArtworkByTagName } from "../../../API/ArtworkAPI/GET.tsx";
import { PlaceHoldersImageCard } from "../PlaceHolders.jsx";
import { Artwork } from "../../../Interfaces/ArtworkInterfaces"; // Giả sử bạn có interface này
import { ThemeContext } from "../../Themes/ThemeProvider.tsx"; // Giả sử bạn có ThemeProvider
import { useTagGetAPI } from "../../../API/TagAPI/GET.tsx";
import { useLocation } from "react-router-dom";
import { ApiResponse } from "../../../Interfaces/app.common.ts";

export default function SearchHome() {
  const { theme } = useContext(ThemeContext); // Lấy theme từ ThemeContext
  const [art, setArtwork] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const { getArtworkByTagID } = useTagGetAPI();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("TagID");
  const name = queryParams.get("TagName");

  useEffect(() => {
    const fetchArt = async () => {
      setLoading(true);

      try {
        const artworkList = (await getArtworkByTagID(id!)) as ApiResponse;
        setArtwork(artworkList.data as []);
      } catch (error) {
        throw new Error("Lỗi khi lấy danh sách Artwork");
        setArtwork([]);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchArt();
    }
  }, [id, name]);

  function ArtWorkList() {
    return (
      <ImageList variant="masonry" cols={4} className="artwork-grid">
        {art.map((artwork: Artwork) => (
          <Link key={artwork._id} to={`/characters/artwork/${artwork._id}`}>
            <ImageListItem key={artwork._id}>
              {artwork.purchasable && (
                <AttachMoneyIcon
                  style={{
                    position: "absolute",
                    backgroundColor: "green",
                    color: "white",
                    borderRadius: "50%",
                    margin: "5px",
                    fontSize: "40px",
                    bottom: 0,
                    right: 0,
                    zIndex: 2,
                  }}
                  fontSize="large"
                />
              )}
              <img
                style={{ cursor: "pointer" }}
                src={artwork.imageFile.image}
                alt={artwork.artworkName}
                loading="lazy"
              />
            </ImageListItem>
          </Link>
        ))}
      </ImageList>
    );
  }

  return (
    <div className="art-hub-container">
      {/* Main Content */}
      <main className="art-hub-main">
        <div
          className="seemorecommentwork"
          style={{ paddingTop: "2%", paddingBottom: "5%" }}
        >
          <Box
            className="box"
            sx={{
              color: theme.color,
              backgroundColor: `rgba(${theme.rgbBackgroundColor}, 0.97)`,
              transition: theme.transition,
              width: "95%",
              margin: "auto",
              borderRadius: "5px",
            }}
          >
            <div className="content-recomment">
              <Typography variant="h5">The Artwork By Tag : {name}</Typography>
              <div className="listimage">
                <Box className="boxlistimage">
                  {loading ? (
                    <Typography>Loading...</Typography>
                  ) : Array.isArray(art) && art.length > 0 ? (
                    <ArtWorkList />
                  ) : (
                    <PlaceHoldersImageCard />
                  )}
                </Box>
              </div>
            </div>
          </Box>
        </div>
      </main>
    </div>
  );
}
