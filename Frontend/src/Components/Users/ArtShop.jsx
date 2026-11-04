import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { ArtworkGetAPI } from "../../API/ArtworkAPI/GET.tsx";
import { Discount, Download, Info as InfoIcon } from "@mui/icons-material";
import { pink } from "@mui/material/colors";
import "../../css/ArtShop.css";
import html2canvas from "html2canvas";
import { Link } from "react-router-dom";
import ArtShopDialog from "./ArtShopDialog.jsx";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function ArtShop() {
  const [allArtworks, setAllArtworks] = useState([]); // Tất cả artwork
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [openDowload, setOpenDowload] = useState(false);
  const [idDowLoad, setIdDowLoad] = useState(null);

  const { theme } = useContext(ThemeContext);
  const { getAllArtworks } = ArtworkGetAPI(); // DÙNG HÀM MỚI

  const itemsPerPage = 8;

  // LỌC + PHÂN TRANG BẰNG useMemo → ỔN ĐỊNH, KHÔNG RE-RENDER
  const { purchasableArts, totalPages } = useMemo(() => {
    const filtered = allArtworks.filter(art =>
      art.purchasable === true ||
      art.purchasable === "true" ||
      art.purchasable === 1 ||
      art.purchasable === "1"
    );

    const total = Math.ceil(filtered.length / itemsPerPage) || 1;
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);

    return {
      purchasableArts: paginated,
      totalPages: total,
    };
  }, [allArtworks, currentPage]);

  const handleClose = () => {
    setOpen(false);
    setOpenDowload(false);
    setIdDowLoad(null);
  };

  const handleOpen = () => setOpen(true);

  const fetchArtworks = async () => {
    try {
      handleOpen();
      const data = await getAllArtworks();
      setAllArtworks(data);
    } catch (error) {
      setAllArtworks([]);
    } finally {
      handleClose();
    }
  };

  const formatMoney = (amount) => {
    return amount?.toLocaleString("en-US", { style: "currency", currency: "USD" }) || "$??";
  };

  const downloadSectionAsImage = async (elementId) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const canvas = await html2canvas(element);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${elementId}.png`;
    link.click();
    handleClose();
  };

  const handleYesClick = () => {
    if (idDowLoad) downloadSectionAsImage(idDowLoad);
  };

  const handleDownload = (id) => {
    setIdDowLoad(id);
    setOpenDowload(true);
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  return (
    <div style={{ padding: "2% 0 5%" }}>
      <Box
        sx={{
          color: "#61dafb",
          backgroundColor: `rgba(${theme.rgbBackgroundColor}, 0.5)`,
          backgroundImage: `url("/images/shopBackground.jpg")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          transition: theme.transition,
          width: "90%",
          maxWidth: "1400px",
          margin: "auto",
          borderRadius: "10px",
          padding: "2rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <Backdrop sx={{ color: "#fff", zIndex: 999 }} open={open}>
          <CircularProgress color="inherit" />
        </Backdrop>

        {openDowload && (
          <ArtShopDialog
            open={openDowload}
            handleClose={handleClose}
            handleYesClick={handleYesClick}
          />
        )}

        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, textAlign: "center" }}>
          Purchasable Artworks
        </Typography>

        <ImageList sx={{ width: "100%", height: "auto", overflow: "visible" }} cols={4} gap={16}>
          {purchasableArts.map((art) => (
            <ImageListItem key={art._id || art.artworkID} sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Link to={`/characters/artwork/${art._id || art.artworkID}`}>
                <img
                  id={`img-${art._id || art.artworkID}`}
                  src={art.imageFile?.preview || art.imageFile?.image || art.imageFile}
                  alt={art.artworkName}
                  loading="lazy"
                  style={{
                    height: "220px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              </Link>

              <ImageListItemBar
                title={formatMoney(art.price)}
                subtitle={art.artworkName}
                sx={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)",
                }}
                actionIcon={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <IconButton sx={{ color: "white", p: 0.5 }}>
                      <FavoriteBorderIcon sx={{ color: pink[400], fontSize: 20 }} />
                    </IconButton>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        fontSize: "14px",
                        lineHeight: 1,
                      }}
                    >
                      {art.likes || 0}
                    </Typography>

                    <IconButton
                      sx={{ color: "white", p: 0.5 }}
                      onClick={() => handleDownload(`img-${art._id || art.artworkID}`)}
                    >
                    </IconButton>

                    <Link to={`/artwordrecomment/artwork/${art._id || art.artworkID}`}>
                      <IconButton sx={{ color: "white", p: 0.5 }}>
                        <InfoIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Link>
                  </Box>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>

        {purchasableArts.length === 0 && (
          <Typography textAlign="center" sx={{ mt: 4, color: theme.color2 }}>
            No purchasable artworks found.
          </Typography>
        )}

        {/* PHÂN TRANG */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: theme.color,
                    backgroundColor: theme.backgroundColor,
                    "&.Mui-selected": {
                      backgroundColor: theme.color,
                      color: theme.backgroundColor,
                    },
                  },
                }}
              />
            </Stack>
          </Box>
        )}
      </Box>
    </div>
  );
}

export default ArtShop;