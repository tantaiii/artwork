import React, { useState, useContext } from "react";
import { Box, Button, Checkbox, Typography } from "@mui/material";
import CustomizedTextField from "../../StyledMUI/CustomizedTextField.tsx";
import { ThemeContext } from "../../Themes/ThemeProvider.tsx";
import { useAuth } from "../../../secure/AuthContext.tsx";

import { ReportPostAPI } from "../../../API/ReportAPI/POST.tsx";

const reasons = [
  "Inappropriate content (violence, nudity, hate speech, discrimination)",
  "Copyright infringement (stolen or copied artwork)",
  "Spam or scam",
  "Offensive content (profanity, harassment)",
  "False or misleading information",
  "Other",
];

type ReportFormProps = {
  reporterId?: number | string;
  reportedId?: number | string;
  artworkId?: number | string;
  onClose: () => void;
};

const ReportForm: React.FC<ReportFormProps> = ({ reporterId, reportedId, artworkId, onClose }) => {
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();
  const sessionUserId = user ? user._id ?? (user as any).userId : undefined;

  const isValidId = (v: any) => {
    if (v === undefined || v === null) return false;
    if (typeof v === "number") return !Number.isNaN(v);
    if (typeof v === "string") return v.trim().length > 0;
    return false;
  };

  const [selectedType, setSelectedType] = useState<string>(artworkId ? "Artwork" : "User");
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherDescription, setOtherDescription] = useState("");
  const [confirm, setConfirm] = useState(false);

  const { createReport } = ReportPostAPI();

  const handleReasonClick = (reason: string) => {
    setSelectedReasons((prev) => (prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]));
  };

  const handleSubmit = async () => {
    const readFromStorage = () => {
      try {
        const raw =
          sessionStorage.getItem("auth") ||
          localStorage.getItem("auth") ||
          localStorage.getItem("user") ||
          sessionStorage.getItem("user");
        if (!raw) return undefined;
        return JSON.parse(raw);
      } catch {
        return undefined;
      }
    };

    const normalizeId = (v: any): string | undefined => {
      if (v === undefined || v === null) return undefined;
      if (typeof v === "string") {
        const s = v.trim();
        return s.length > 0 ? s : undefined;
      }
      if (typeof v === "number") {
        return Number.isNaN(v) ? undefined : String(v);
      }
      if (typeof v === "object") {
        // keep only the most common id fields
        const candidates = [v._id, v.id, v.userId, v.user?._id];
        for (const c of candidates) {
          if (c !== undefined && c !== null) {
            const s = String(c).trim();
            if (s.length > 0) return s;
          }
        }
      }
      return undefined;
    };

    // prefer prop values, then AuthContext sessionUserId, then stored auth
    let reporterVal = normalizeId(reporterId) ?? normalizeId(sessionUserId);
    let reportedVal = normalizeId(reportedId);

    if (!reporterVal) {
      const stored = readFromStorage();
      if (stored) {
        reporterVal =
          normalizeId(stored.userId) ??
          normalizeId(stored._id) ??
          normalizeId(stored.user?._id) ??
          normalizeId(stored.accountId);
      }
    }

    // If reportedId is an object (user/creator), try to normalize fields
    if (!reportedVal && typeof reportedId === "object" && reportedId !== null) {
      reportedVal = normalizeId(reportedId);
    }

    // Guard: ensure we have valid IDs before sending (support string ObjectIDs and numeric ids)
    if (!isValidId(reporterVal) || !isValidId(reportedVal)) {
      alert("Unable to submit report: missing or invalid reporter/reported ID.");
      return;
    }

    if (selectedReasons.length === 0 || !confirm) {
      alert("Please select at least one reason and confirm.");
      return;
    }

    const description = selectedReasons.includes("Other") ? otherDescription : selectedReasons.join(", ");

    // payload must match backend field names: reporterID, reportedID, reportedArtworkID
    const payload = {
      reporterID: String(reporterVal),
      reportedID: String(reportedVal),
      reportedArtworkID: selectedType === "Artwork" ? (artworkId ? String(artworkId) : null) : null,
      description,
      status: "Pending",
    };

    try {
      const result = await createReport(payload);
      // If API returned an object indicating failure, surface its message instead of showing success
      if (
        result &&
        (result.status === "error" || result.status === false || String(result.status).toLowerCase() === "failed")
      ) {
        const msg = result.message || result.error || "Failed to submit report.";
        alert(msg);
        return;
      }
      alert("Report submitted successfully.");
      onClose();
    } catch (err) {
      const message =
        (err && (err as any).message) ||
        (err && (err as any).response && (err as any).response.message) ||
        "Failed to submit report.";
      alert(message);
    }
  };

  return (
    <Box sx={{ p: 3, background: theme.backgroundColor, borderRadius: 5, color: theme.color }}>
      <Typography variant="h5" color={theme.color}>
        Report Violation
      </Typography>

      <Typography mt={2} color={theme.color}>
        1. Type of content to report (auto-selected)
      </Typography>
      <Box display="flex" gap={2}>
        <Button
          variant={selectedType === "Artwork" ? "contained" : "outlined"}
          onClick={() => {
            if (artworkId) setSelectedType("Artwork");
          }}
          disabled={!artworkId}
          sx={{ color: selectedType === "Artwork" ? theme.color : theme.color2, borderColor: theme.color2 }}>
          Artwork
        </Button>
        <Button
          variant={selectedType === "User" ? "contained" : "outlined"}
          onClick={() => {
            if (!artworkId) setSelectedType("User");
          }}
          disabled={!!artworkId}
          sx={{ color: selectedType === "User" ? theme.color : theme.color2, borderColor: theme.color2 }}>
          User
        </Button>
      </Box>

      <Typography mt={2} color={theme.color}>
        2. Reason for reporting
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {reasons.map((reason) => (
          <Button
            key={reason}
            variant={selectedReasons.includes(reason) ? "contained" : "outlined"}
            onClick={() => handleReasonClick(reason)}
            sx={{ color: selectedReasons.includes(reason) ? theme.color : theme.color2, borderColor: theme.color2 }}>
            {reason}
          </Button>
        ))}
      </Box>

      {selectedReasons.includes("Other") && (
        <CustomizedTextField
          fullWidth
          variant="outlined"
          label="Describe the issue"
          sx={{ mt: 2, color: theme.color }}
          value={otherDescription}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setOtherDescription(e.target.value)
          }
        />
      )}

      <Box display="flex" alignItems="center" mt={2}>
        <Checkbox checked={confirm} onChange={(e) => setConfirm(e.target.checked)} sx={{ color: theme.color }} />
        <Typography color={theme.color}>I confirm that this report is accurate and truthful.</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button variant="outlined" onClick={onClose} sx={{ color: theme.color, borderColor: theme.color2 }}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ backgroundColor: theme.color }}>
          Submit Report
        </Button>
      </Box>
    </Box>
  );
};

export default ReportForm;
