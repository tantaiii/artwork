import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import Box from "@mui/material/Box";
import "../../css/YourCommission.css";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import Backdrop from "@mui/material/Backdrop";
import { GetCreatorByID, UserGetAPI } from "../../API/UserAPI/GET.tsx";
import CircularProgress from "@mui/material/CircularProgress";
import { Creator } from "../../Interfaces/UserInterface.ts";
import { GetCommissionRecieverById } from "../../API/CommissionAPI/GET.tsx";
import { useCommissionPutAPI } from "../../API/CommissionAPI/PUT.tsx";
import { useCommissionGetAPI } from "../../API/CommissionAPI/GET.tsx";
import { useAuth } from "../../secure/AuthContext.tsx";
import { Commission } from "../../Interfaces/CommissionInterface.ts";
import { Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Stack from "@mui/material/Stack";

// Định nghĩa CommissionStepper
function CommissionStepper({
  currentCommission,
  activeStep,
  setActiveStep,
  setOpenSnackbar,
}: {
  currentCommission: Commission;
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { putUpdateProgressById } = useCommissionPutAPI();
  const steps = [
    "Confirm Commission",
    "Drawing",
    "Submit Confirmation",
    "Commission Completed!",
  ];
  const [showArtworkInput, setShowArtworkInput] = useState(false);
  const [artworkURL, setArtworkURL] = useState(currentCommission.artworkURL || "");


  useEffect(() => {
    if (activeStep === 3 || activeStep === 4) {
      setShowArtworkInput(true);
    } else {
      setShowArtworkInput(false);
    }
  }, [activeStep]);


  const updateProgress = async (commissionId: string, progress: number, artworkURL?: string) => {
    try {
      const response = await putUpdateProgressById(commissionId, progress, artworkURL);
      if (response && !response.error) {
        return response.data;
      } else {
        throw new Error(response?.error?.message || "Failed to update progress");
      }
    } catch (err) {
      throw err;
    }
  };


  const handleNext = async () => {
    try {
      const newProgress = activeStep + 1;


      if (newProgress === 3) {
        setShowArtworkInput(true);
      }


      if (activeStep === 3 && !artworkURL.trim()) {
        alert("Please enter the Artwork URL before proceeding.");
        return;
      }


      await updateProgress(currentCommission._id, newProgress, artworkURL || undefined);
      setActiveStep(newProgress);


      if (newProgress === steps.length) {
        setOpenSnackbar(true);
      }
    } catch (err) {
      setActiveStep(currentCommission.progress);
    }
  };


  const handleBack = async () => {
    try {
      const newProgress = activeStep - 1;
      if (newProgress < 0) {
        throw new Error("Progress cannot be less than 0");
      }
      setActiveStep(newProgress);
      await updateProgress(currentCommission._id, newProgress);
    } catch (err) {
      setActiveStep(currentCommission.progress);
    }
  };


  return (
    <Box sx={{ width: "100%", scale: "100%", height: "auto" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            Commission completed - you're finished
          </Typography>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>


          {showArtworkInput && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1">Enter Artwork URL</Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Paste Google Drive link here"
                value={artworkURL}
                onChange={(e) => setArtworkURL(e.target.value)}
                inputProps={{ autoFocus: activeStep === 3 || activeStep === 4 }}
              />
            </Box>
          )}


          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleNext} disabled={activeStep === 4}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </React.Fragment>
      )}
      <Snackbar
        open={false}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Your mission is complete.
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}


export default function YourCommission() {
  const { theme } = useContext(ThemeContext);
  const [commissionList, setCommissionList] = useState<Commission[]>([]);
  const [refreshForm, setRefreshForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const artworkURLRef = useRef<string>(""); // Ref để lưu giá trị artworkURL
  const { getCommissionByRecieverId } = useCommissionGetAPI();
  const { putAcceptCommissionById, putRejectCommissionById, putUpdateProgressById } = useCommissionPutAPI();
  const { user } = useAuth();
  const savedUser = user;


  if (savedUser === null) {
    navigate("/");
  }


  useEffect(() => {
    if (rejectDialogOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [rejectDialogOpen]);


  const formatDateTime = (date: Date | string | null) => {
    if (!date) return "Not set";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "Not set";


    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");


    return `${year}-${month}-${day} ${hours}-${minutes}`;
  };


  interface CommissionResponse {
    status: string;
    message: string;
    data: Commission[];
    timestamp?: string;
  }


  useEffect(() => {
    const getCommissionForm = async () => {
      try {
        if (!savedUser?._id) {
          throw new Error("User ID is not available");
        }
        const response = await getCommissionByRecieverId(String(savedUser._id)) as CommissionResponse;


        const commissions: Commission[] = response.data
          .map((commission: any) => ({
            _id: commission._id,
            requestor: commission.requestor,
            reciever: commission.reciever,
            phoneNumber: commission.phoneNumber,
            email: commission.email,
            description: commission.description,
            accept: commission.accept,
            creationDate: commission.creationDate,
            acceptanceDate: commission.acceptanceDate,
            completionDate: commission.completionDate,
            progress: commission.progress || 0,
            message: commission.message,
            artworkURL: commission.artworkURL,
          }))
          .filter((commission: Commission) => commission.reciever._id === savedUser._id);


        setCommissionList(commissions);
      } catch (error) {
        console.error("Error fetching commissions:", error);
      }
    };
    getCommissionForm();
  }, [refreshForm, open, navigate, user?._id]);


  const handleAccept = async (commission: Commission) => {
    setLoading(true);
    try {
      const response = await putAcceptCommissionById(commission._id);
      setRefreshForm((prev) => !prev);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };


  const handleRejectOpen = (commission: Commission) => {
    setSelectedCommission(commission);
    setRejectDialogOpen(true);
    setRejectMessage("");
  };


  const handleRejectSubmit = async () => {
    if (!selectedCommission) return;
    setLoading(true);
    try {
      console.log("Attempting to reject commission with ID:", selectedCommission._id, "Message:", rejectMessage);
      const response = await putRejectCommissionById(selectedCommission._id, rejectMessage);
      console.log("Response from server:", response);
      setRefreshForm((prev) => !prev);
      setRejectDialogOpen(false);
      setSelectedCommission(null);
      setRejectMessage("");
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };


  const handleRejectClose = () => {
    setRejectDialogOpen(false);
    setSelectedCommission(null);
    setRejectMessage("");
  };


  const RejectDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));


  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));


  const [currentSelect, setCurrentSelect] = useState<Commission | null>(null);
  const handleClickOpen = (commission: Commission) => {
    setActiveStep(commission.progress || 0);
    artworkURLRef.current = commission.artworkURL || ""; // Cập nhật ref khi mở dialog
    setOpen(true);
    setCurrentSelect(commission);
  };


  const handleClose = async () => {
    try {
      setLoading(true);


      if (currentSelect) {
        const artworkURLToSend = activeStep === 4 ? artworkURLRef.current : undefined;
        const response = await putUpdateProgressById(currentSelect._id, activeStep, artworkURLToSend);
        if (response && !response.error) {
          console.log("Progress updated successfully:", response.data);
        } else {
          throw new Error(response?.error?.message || "Failed to save progress");
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
      setOpen(false);
      setCurrentSelect(null);
      setActiveStep(0);
      artworkURLRef.current = "";
      setOpenSnackbar(false);
    }
  };


  return (
    <div className="yourCommission">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        className="box"
        sx={{
          color: theme.color,
          backgroundColor: `rgba(${theme.rgbBackgroundColor}, 0.97)`,
          transition: theme.transition,
          width: "85%",
          margin: "auto",
          borderRadius: "5px",
          marginBottom: "15px",
          minHeight: "800px",
        }}
      >
        <h1>Your Commissions:</h1>
        <Divider variant="middle" sx={{ borderColor: theme.color }} />
        <div
          className="listcommission"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            paddingBottom: "40px",
          }}
        >
          <List
            sx={{ width: "100%", maxWidth: 1000, bgcolor: "background.paper" }}
            style={{
              borderTop: "1px solid black",
              borderLeft: "1px solid black",
              borderRight: "1px solid black",
              borderRadius: "10px",
              padding: 0,
              marginBottom: "50px",
              marginTop: "30px",
            }}
          >
            {commissionList.map((commission: Commission) => (
              <div key={commission._id}>
                <ListItem alignItems="flex-start">
                  <div className="onecommission">
                    <div className="content">
                      <ListItemText>
                        <div
                          className="header"
                          style={{ display: "flex", marginBottom: "5px" }}
                        >
                          {commission.accept === null && (
                            <Avatar style={{ background: theme.color }}>
                              <NotificationsActiveIcon />
                            </Avatar>
                          )}
                          {commission.accept === true && (
                            <Avatar style={{ background: "#10AF27" }}>
                              <CheckIcon />
                            </Avatar>
                          )}
                          {commission.accept === false && (
                            <Avatar style={{ background: "red" }}>
                              <ClearIcon />
                            </Avatar>
                          )}
                          <h3 style={{ margin: "auto 15px" }}>
                            You Got A Commission
                          </h3>
                        </div>
                        <div className="contentcommission">
                          <ListItemText>
                            <Box>
                              {/* Profile Link */}
                              <Link
                                component={RouterLink}
                                to={`/characters/profile/${commission.requestor._id}`}
                                underline="none"
                                sx={{ display: "block" }}
                              >
                                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                                  <Avatar
                                    src={commission.requestor.profilePicture || "https://i.pravatar.cc/150"}
                                    alt="Avatar"
                                    sx={{ width: 48, height: 48, border: "2px solid", borderColor: "grey.300" }}
                                  />
                                  <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    sx={{
                                      color: "primary.main",
                                      "&:hover": { textDecoration: "underline" },
                                    }}
                                  >
                                    {commission.requestor.firstName} {commission.requestor.lastName}
                                  </Typography>
                                </Stack>
                              </Link>


                              {/* Contact Info */}
                              <Stack spacing={0.5} sx={{ mb: 2 }}>
                                <Typography variant="body1" color="text.secondary">
                                  <strong>Phone:</strong> {commission.phoneNumber}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                  <strong>Email:</strong> {commission.email}
                                </Typography>
                              </Stack>


                              {/* Description */}
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                  Description
                                </Typography>
                                <Typography variant="body2" color="text.primary" sx={{ whiteSpace: "pre-wrap" }}>
                                  {commission.description}
                                </Typography>
                              </Box>


                              {/* Dates */}
                              <Stack spacing={1.5}>
                                <Box>
                                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                                    Created
                                  </Typography>
                                  <Typography variant="body2">
                                    {commission.creationDate ? formatDateTime(commission.creationDate) : "Not set"}
                                  </Typography>
                                </Box>


                                <Box>
                                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                                    Accepted
                                  </Typography>
                                  <Typography variant="body2">
                                    {commission.acceptanceDate
                                      ? formatDateTime(commission.acceptanceDate)
                                      : commission.accept === null
                                        ? "Not yet"
                                        : "Not Accepted"}
                                  </Typography>
                                </Box>


                                <Box>
                                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                                    Completed
                                  </Typography>
                                  <Typography variant="body2">
                                    {commission.completionDate ? formatDateTime(commission.completionDate) : "Not completed"}
                                  </Typography>
                                </Box>


                                {commission.artworkURL && (
                                  <Box>
                                    <Typography variant="caption" fontWeight={600} color="text.secondary">
                                      Artwork
                                    </Typography>
                                    <Link href={commission.artworkURL} target="_blank" rel="noopener" sx={{ display: "block" }}>
                                      <Typography
                                        variant="body2"
                                        color="primary"
                                        sx={{
                                          wordBreak: "break-all",
                                          whiteSpace: "normal",
                                          "&:hover": { textDecoration: "underline" },
                                        }}
                                      >
                                        {commission.artworkURL}
                                      </Typography>
                                    </Link>
                                  </Box>
                                )}


                                {commission.message && (
                                  <Box>
                                    <Typography variant="caption" fontWeight={600} color="error.main">
                                      Rejected
                                    </Typography>
                                    <Typography variant="body2" color="error.main" fontWeight={500}>
                                      {commission.message}
                                    </Typography>
                                  </Box>
                                )}
                              </Stack>
                            </Box>
                          </ListItemText>
                        </div>
                      </ListItemText>
                    </div>
                    <div className="button">
                      {commission.accept === null && (
                        <>
                          <Button
                            variant="contained"
                            style={{ marginRight: "20px" }}
                            onClick={() => handleAccept(commission)}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="contained"
                            style={{ marginRight: "20px" }}
                            color="error"
                            onClick={() => handleRejectOpen(commission)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {commission.accept === true && (
                        <Button
                          variant="contained"
                          onClick={() => handleClickOpen(commission)}
                        >
                          Track the progress
                        </Button>
                      )}
                      {commission.accept === false && (
                        <Button
                          style={{ paddingRight: "40px", paddingLeft: "40px" }}
                          variant="contained"
                          disabled
                        >
                          Rejected
                        </Button>
                      )}
                    </div>
                  </div>
                </ListItem>
                <Divider component="li" style={{ backgroundColor: "black" }} />
              </div>
            ))}
          </List>
        </div>


        {/* Dialog để từ chối */}
        <Dialog
          onClose={handleRejectClose}
          open={rejectDialogOpen}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Enter Rejection Reason</DialogTitle>
          <DialogContent sx={{ overflow: "hidden" }}>
            <input
              ref={inputRef}
              type="text"
              id="reject-message"
              placeholder="Enter reason..."
              value={rejectMessage}
              onChange={(e) => setRejectMessage(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRejectClose}>Cancel</Button>
            <Button onClick={handleRejectSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>


        {/* Dialog để theo dõi tiến trình */}
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Track the progress
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            {currentSelect && (
              <CommissionStepper
                currentCommission={currentSelect}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                setOpenSnackbar={setOpenSnackbar}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Save changes
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </Box>
    </div>
  );
}

