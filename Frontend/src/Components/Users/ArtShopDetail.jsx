import { Backdrop, Box, Button, CircularProgress, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArtDetail } from "../../API/ArtShop/ArtShopServices.tsx";
import "../../css/ArtShopDetail.css";
import { DateRange, Discount, Download, Headset, Shop } from "@mui/icons-material";
import { pink } from "@mui/material/colors";
import ArtShopConfirm from "./ArtShopConfirm";

function ArtShopDetail() {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dataState, setDataState] = useState({});

  const handleClose = () => {
    setOpen(false);
    setOpenDialog(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleBuy = () => {
    setOpenDialog(true);
  };

  const search = async () => {
    try {
      handleOpen();
      const data = await getArtDetail(id);
      setDataState(data?.data);
    } catch (error) {
    } finally {
      handleClose();
    }
  };

  function formatMoney(amount) {
    return (amount || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
  }
  function formatDate(inputDate) {
    var dateObject = new Date(inputDate);
    var day = dateObject.getDate();
    var month = dateObject.getMonth() + 1;
    var year = dateObject.getFullYear();
    var formattedDay = day < 10 ? "0" + day : day;
    var formattedMonth = month < 10 ? "0" + month : month;
    return formattedDay + "-" + formattedMonth + "-" + year;
  }
  useEffect(() => {
    search();
  }, []);
  return (
    <Box
      sx={{
        color: "#61dafb",
        backgroundColor: `rgba(26, 26, 46,0.97)`,
        transition: "all 1s ease-in-out",
        width: "88%",
        margin: "auto",
        borderRadius: "5px",
        marginBottom: "15px",
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
      }}>
      <Backdrop sx={{ color: "#fff", zIndex: 99 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!open && (
        <Box>
          <div style={{ paddingLeft: 20 }}>
            <div>
              <div>
                <div>
                  <h1>{dataState?.artworkName}</h1>
                </div>
              </div>
              <div class="card1 imgage-container">
                <img className="image-custom" src={"data:image/jpeg;base64," + dataState?.imageFile} />
              </div>
              <div>
                <p>
                  <IconButton aria-label="add to favorites">
                    <Headset color="primary" />
                  </IconButton>
                  {dataState?.likes}
                  <IconButton aria-label="share">
                    <Discount sx={{ color: pink[500] }} />
                  </IconButton>
                  {formatMoney(dataState?.price)}
                </p>
              </div>
              <div>
                <p>
                  <IconButton aria-label="share">
                    <DateRange sx={{ color: pink[500] }} />
                  </IconButton>
                  {formatDate(dataState?.dateCreated)}
                </p>
              </div>
              <div style={{ padding: "10px 0 10px 10px" }}>
                {dataState?.purchasable && (
                  <Button sx={{ minWidth: 0 }} onClick={handleBuy} variant="contained" size="small" title="Buy">
                    <Shop />
                  </Button>
                )}
                {dataState?.status === "Đã thanh toán" && (
                  <Button sx={{ minWidth: 0 }} variant="contained" size="small" title="Dowload">
                    <Download />
                  </Button>
                )}
                <div style={{ marginTop: 15 }}>{dataState?.description}</div>
              </div>
            </div>
          </div>
        </Box>
      )}
      {openDialog && <ArtShopConfirm open={openDialog} handleClose={handleClose} item={dataState} />}
    </Box>
  );
}

export default ArtShopDetail;
