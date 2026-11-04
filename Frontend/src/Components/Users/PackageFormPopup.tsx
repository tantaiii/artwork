import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { UserPostAPI } from "../../API/UserAPI/POST.tsx";

interface PackageFormPopupProps {
  open: boolean;
  handleClose: () => void;
}

export default function PackageFormPopup({ open, handleClose }: PackageFormPopupProps) {
  const [formText, setFormText] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const { createArtistForm } = UserPostAPI();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async () => {
    if (!isChecked || !formText.trim()) {
      setSnackbarMessage("Please fill out the form and confirm the checkbox.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const payload = {
      description: formText,
      status: null,
      dateCreation: new Date(),
    };


    try {
      await createArtistForm(payload);
      setSnackbarMessage("Form submitted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      handleClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ backgroundColor: "#2e2e2e", color: "white", padding: "16px" }}>
          <DialogTitle sx={{ backgroundColor: "#2e2e2e", color: "white" }}>
            Privacy
          </DialogTitle>
          <Box
            sx={{
              backgroundColor: "#4a4a4a",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "16px",
              maxWidth: "90%",
              margin: "0 auto",
            }}
          >
            <Typography variant="body2" sx={{ mb: 2, color: "white" }}>
              <strong>ACTIVE PARTICIPATION:</strong> You are an active artist and will maintain regular activity on the platform. You confirm that you are not inactive for an extended period as this may result in account restrictions.
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "white" }}>
              <strong>ACKNOWLEDGEMENT:</strong> You acknowledge that inactivity for an extended period may result in account restrictions.
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "white" }}>
              <strong>ARTISTIC SKILLS:</strong> You confirm that you have artistic talent and the ability to create quality artworks. If requested, you may be required to provide proof of your skills (artworks, portfolio, certificates, etc.).
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "white" }}>
              <strong>PRIVACY & DATA PROTECTION:</strong> Your personal information and account-related data will be protected according to our privacy policy. We may collect activity data to enhance the user experience and detect fraudulent behavior.
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "white" }}>
              <strong>COMPLIANCE:</strong> You agree to comply with the platform’s community guidelines and policies. Any actions that violate these terms may result in account restrictions or termination.
            </Typography>
          </Box>
          <DialogTitle sx={{ backgroundColor: "#2e2e2e", color: "white" }}>
            Description
          </DialogTitle>
          <TextField
            label="Type here"
            multiline
            rows={4}
            fullWidth
            value={formText}
            onChange={(e) => setFormText(e.target.value)}
            sx={{
              mt: 2,
              backgroundColor: "#424242",
              "& .MuiInputBase-input": { color: "white" },
              "& .MuiInputLabel-root": { color: "gray" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "gray" },
                "&:hover fieldset": { borderColor: "white" },
                "&.Mui-focused fieldset": { borderColor: "white" },
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                sx={{ color: "white", "&.Mui-checked": { color: "white" } }}
              />
            }
            label="I confirm that this form is accurate and truthful."
            sx={{ mt: 2, color: "white" }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#2e2e2e" }}>
          <Button onClick={handleClose} sx={{ color: "white", border: "1px solid white", mr: 1 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}