import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommentIcon from "@mui/icons-material/Comment";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Comments from "../Comments.jsx";
import Box from "@mui/material/Box";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import { Artwork } from "../../Interfaces/ArtworkInterfaces.ts";
import { faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faTags } from "@fortawesome/free-solid-svg-icons";
import { User } from "../../Interfaces/UserInterface.ts";
import Chip from "@mui/material/Chip";
import { Download } from "@mui/icons-material";
import { Button, Divider } from "@mui/material";
import { Tag } from "../../Interfaces/TagInterface.ts";
import { faSignature } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import ArtShopConfirm from "./ArtShopConfirm.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ArtShopDialog from "./ArtShopDialog.jsx";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import LikeIcon from "../LikeIcon.jsx";
import "../../css/ArtPost.css";
import { useDeleteArtwork } from "../../API/ArtworkAPI/DELETE.tsx";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import ReportForm from "./UserForms/ReportForm.tsx";
import FavouritesIcon from "../FavouritesIcon.jsx";
import { ApiResponse } from "../../Interfaces/app.common.ts";
import { useArtworkGetAPI } from "../../API/ArtworkAPI/GET.tsx";
import { useAuth } from "../../secure/AuthContext.tsx";
import { GetTransactionApi } from "../../API/TransactionAPI/GET.tsx";

export default function PostWork() {
  const colors = [
    "#82c87e",
    "#c07ec8",
    "#c89c7e",
    "#7E8DC8",
    "#C07EC8",
    "#C87E8A",
  ];
  const { theme } = useContext(ThemeContext);
  const { id } = useParams();
  const [creator, setCreator] = useState<User>();
  const [tags, setTags] = useState<Tag[]>([]);

  const [openArtShopConfirm, setOpenArtShopConfirm] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDownload, setOpenDownload] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");

  const [artworkbyid, setArtworkById] = useState<Artwork>();
  const [totalComments, setTotalComments] = useState<number>(0);
  const [status, setStatus] = useState<boolean>(false);

  let user = useAuth().user;

  const { getArtworkById, getTotalComments } = useArtworkGetAPI();
  const navigate = useNavigate();
  const { deleteArtById } = useDeleteArtwork();
  const { getTransactionByArtworkId } = GetTransactionApi();

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const [artworkRes, transactionRes] = await Promise.all([
          getArtworkById(id),
          getTransactionByArtworkId(id),
        ]);

        const artworkData = (artworkRes as ApiResponse<Artwork>)?.data;
        if (artworkData) {
          setArtworkById(artworkData);
          setTags(artworkData.tagID as Tag[]);
          setCreator(artworkData.userID as User);
        }

        const isActive = (transactionRes as ApiResponse)?.status === true;
        setStatus(isActive);
      } catch {
        setStatus(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    const fetchTotalComments = async () => {
      try {
        const response = (await getTotalComments(id ? id : "0")) as {
          data: {
            status: string;
            message: string;
            data: { total: number };
            timestamp: string;
          };
        };
        const total = response.data.data.total;
        setTotalComments(total);
      } catch (error) {
        throw error;
      }
    };
    if (id) fetchTotalComments();
  }, [id]);

  const handleOpenArtShopConfirm = () => {
    setOpenArtShopConfirm(!openArtShopConfirm);
  };

  const handleOpenReport = () => {
    setOpenReport(true);
  };

  const handleClose = () => {
    setOpenArtShopConfirm(false);
    setOpenDownload(false);
    setOpenReport(false);
    setOpenDownload(false);
  };

  const downloadImage = async () => {
    if (!artworkbyid?.imageFile) return;

    try {
      const response = await fetch(artworkbyid?.imageFile?.image ?? "");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${artworkbyid.artworkName || "artwork"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setOpenDownload(false);
    } catch (error) {
      throw error;
    }
  };

  const handleYesClick = async () => {
    if (!artworkbyid?._id) return;
    await downloadImage();
  };

  const handleDownload = () => {
    if (!artworkbyid?._id) return;
    setOpenDownload(true);
  };

  const handleDelete = async () => {
    try {
      const deleteArtwork = await deleteArtById(artworkbyid?._id!);
      if (deleteArtwork.status === true) {
        setAlertMessage("Successful to delete artwork");
        setAlertSeverity("success");
        setAlertOpen(true);
        setTimeout(() => {
          navigate(`/characters/`);
        }, 1500);
      } else {
        setAlertMessage("Fail to delete Artwork");
        setAlertSeverity("error");
        setAlertOpen(true);
        navigate(`/characters/artwork/${artworkbyid?._id!}`);
      }
    } catch (err) {}
  };
  function formatMoney(amount?: number | null): string {
    if (amount == null || isNaN(amount)) return "0 Coins";
    return (
      amount.toLocaleString("vi-VN", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      }) + " Coins"
    );
  }

  // const handleClickOpen = () => {
  //   setOpenArtShopConfirm(true);
  // };

  // const [value, setValue] = useState(0);

  // const handleChange = (event: any, newValue: any) => {
  //   setValue(newValue);
  // };

  function TagList() {
    return (
      <>
        {tags.map((tag, index) => (
          <div key={index} className="tag-item">
            <Stack direction="row" spacing={1}>
              <Chip
                label={tag.tagName}
                variant="filled"
                style={{
                  backgroundColor: colors[index % colors.length],
                  marginBottom: "5px",
                  color: "white",
                  fontSize: "1rem",
                }}
              />
            </Stack>
          </div>
        ))}
      </>
    );
  }
  return (
    <Box sx={{ paddingTop: "2%" }}>
      {openDownload && (
        <ArtShopDialog
          open={openDownload}
          handleClose={handleClose}
          handleYesClick={handleYesClick}
        />
      )}
      <div
        className="poswork"
        style={{
          backgroundColor: theme.backgroundColor,
          paddingBottom: "50px",
          color: theme.color,
        }}
      >
        <div className="info-postwork">
          <div
            className="imgpost"
            style={{ backgroundColor: theme.hoverBackgroundColor }}
          >
            <img
              style={{
                pointerEvents: artworkbyid?.purchasable ? "none" : "auto",
              }}
              alt={artworkbyid?.artworkName}
              src={
                artworkbyid?.purchasable
                  ? artworkbyid?.imageFile?.preview ??
                    artworkbyid?.imageFile?.image ??
                    ""
                  : artworkbyid?.imageFile?.image ?? ""
              }
            />
          </div>
          <Divider orientation="vertical" />
          <div className="contentpost">
            {typeof artworkbyid?.userID !== "string" && (
              <Link
                to={`/characters/profile/${artworkbyid?.userID._id}`}
                className="infor-user-post"
              >
                <Avatar
                  src={artworkbyid?.userID.profilePicture}
                  sx={{ width: 50, height: 50 }}
                />
                <div className="name-user-post" style={{ color: "#1565C0" }}>
                  {`${artworkbyid?.userID?.firstName ?? ""} ${
                    artworkbyid?.userID?.lastName ?? ""
                  }`}
                </div>
              </Link>
            )}

            <div className="content-post-img">
              <div>
                <FontAwesomeIcon
                  icon={faSignature}
                  style={{
                    marginRight: "5px",
                    fontSize: "18px",
                    color: "#1565C0",
                  }}
                />
                Name: {artworkbyid?.artworkName}
              </div>
              <div>
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  style={{
                    marginRight: "5px",
                    fontSize: "18px",
                    color: "#1565C0",
                  }}
                />
                Posted date:{" "}
                {artworkbyid?.dateCreated
                  ? new Date(artworkbyid.dateCreated)
                      .toLocaleString("sv-SE", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                        timeZone: "Asia/Ho_Chi_Minh",
                      })
                      .replace(" ", " ")
                  : ""}
              </div>

              <div>
                <FontAwesomeIcon
                  icon={faEye}
                  style={{
                    marginRight: "5px",
                    fontSize: "18px",
                    color: "#1565C0",
                  }}
                />
                View: {artworkbyid?.views}
              </div>

              <div>
                <FontAwesomeIcon
                  icon={faHeart}
                  style={{
                    marginRight: "5px",
                    fontSize: "18px",
                    color: "#E53935",
                  }}
                />
                Like: {artworkbyid?.likes}
              </div>

              <div>
                <FontAwesomeIcon
                  icon={faComments}
                  style={{
                    marginRight: "5px",
                    fontSize: "18px",
                    color: "#1565C0",
                  }}
                />
                Comment: {totalComments}
              </div>

              <div>
                <FontAwesomeIcon
                  icon={faMoneyBillWave}
                  style={{
                    marginRight: "5px",
                    fontSize: "18px",
                    color: "#1565C0",
                  }}
                />
                Price:{" "}
                {artworkbyid?.price === 0
                  ? "Free"
                  : formatMoney(artworkbyid?.price)}
              </div>

              <h4 style={{ marginBottom: "5px", marginTop: "10px" }}>
                <FontAwesomeIcon
                  icon={faTags}
                  style={{
                    marginRight: "8px",
                    fontSize: "18px",
                    color: "#1565C0",
                  }}
                />
                Tags:
              </h4>
              <div className="tag-container">
                {tags.length !== 0 ? <TagList /> : ""}
              </div>

              <div>
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  style={{
                    marginRight: "5px",
                    fontSize: "18px",
                    color: "#1565C0",
                  }}
                />
                Description: {artworkbyid?.description}
              </div>
            </div>
          </div>
        </div>
        <Box className="comment-section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "60%",
            }}
          >
            <LikeIcon artworkID={String(id ?? "")} />
            <FavouritesIcon artworkID={String(id ?? "")} />
            <div className="button-comment">
              <a href="#comment" style={{ display: "flex" }}>
                <CommentIcon
                  sx={{ color: theme.color, fontSize: 35, marginRight: "5px" }}
                />
                <h4 style={{ paddingTop: "5px" }} className="addfavourite">
                  Comment
                </h4>
              </a>
            </div>
            {user?._id === creator?._id ? (
              <>
                <Button
                  onClick={handleDelete}
                  color="error"
                  variant="contained"
                  style={{
                    color: "white",
                    height: "50px",
                    margin: "10px",
                  }}
                >
                  Delete Artwork
                </Button>
                <Link to={`/characters/artwork/update/${artworkbyid?._id}`}>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "#5dbae5",
                      color: "white",
                      height: "50px",
                      margin: "10px",
                    }}
                  >
                    Update Artwork
                  </Button>
                </Link>
              </>
            ) : (
              <div style={{ margin: "auto 5px" }}>
                {artworkbyid?.purchasable === true && status === false ? (
                  <Chip
                    label={formatMoney(artworkbyid?.price)}
                    onClick={handleOpenArtShopConfirm}
                    style={{
                      fontSize: "20px",
                      padding: "20px",
                      fontWeight: "600",
                      backgroundColor: "#61dafb",
                    }}
                  />
                ) : (
                  creator && (
                    <>
                      <Button
                        sx={{
                          minWidth: "40%",
                          marginBottom: "5px",
                          height: "40px",
                        }}
                        variant="contained"
                        size="small"
                        title="Dowload"
                        onClick={handleDownload}
                        endIcon={<Download />}
                      >
                        Download Artwork
                      </Button>
                    </>
                  )
                )}
                {creator && (
                  <Button
                    sx={{
                      minWidth: "20%",
                      marginBottom: "5px",
                      height: "40px",
                    }}
                    onClick={() => setOpenReport(true)}
                    variant="contained"
                    color="error"
                    style={{ marginLeft: "20px" }}
                  >
                    Report
                  </Button>
                )}
              </div>
            )}
            {creator && (
              <Dialog
                open={openReport}
                onClose={handleClose}
                className="dialog-custom"
                BackdropProps={{
                  sx: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  },
                }}
              >
                <ReportForm
                  reporterId={String(user?._id)}
                  reportedId={String(creator?._id)}
                  artworkId={String(artworkbyid?._id)}
                  onClose={() => setOpenReport(false)}
                />
              </Dialog>
            )}
          </div>
          <div id='"#comment"'>
            <Comments />
          </div>
        </Box>
      </div>
      {openArtShopConfirm && (
        <ArtShopConfirm
          open={openArtShopConfirm}
          handleClose={handleOpenArtShopConfirm}
          item={artworkbyid!}
        />
      )}
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
