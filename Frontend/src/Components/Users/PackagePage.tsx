import React, { useContext, useEffect, useState } from "react";
import { Box, Card, Divider, Stack, Typography, Button } from "@mui/material";
import "../../css/Package.css";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import CardContent from "@mui/material/CardContent";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DiscountIcon from "@mui/icons-material/Discount";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { CurrentPackage, Package } from "../../Interfaces/Package.ts";
import {
  GetCurrentPackageByAccountID,
  GetPackage,
} from "../../API/PackageAPI/GET.tsx";
import { useRankGetAPI } from "../../API/PackageAPI/GET.tsx";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import PackagePaymentConfirm from "./PackagePaymentConfirm.tsx"; // Keep this for Purchase
import PackageFormPopup from "./PackageFormPopup.tsx"; // Form for Send Us
import { ApiResponse } from "../../Interfaces/app.common.ts";

export default function PackagePage({ onCurrentPackageChange }) {
  const { theme, dark } = useContext(ThemeContext);
  const [packageService, setPackageService] = useState<Package[]>([]);
  const [currentPackage, setCurrentPackage] = useState<CurrentPackage | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // For Purchase popup
  const [openForm, setOpenForm] = useState(false); // For Send Us form
  const [selectPackage, setSelectPackage] = useState<Package>();

  const savedAuth = sessionStorage.getItem("auth");
  const user = savedAuth ? JSON.parse(savedAuth) : null;

  const { getAllRanks, getPackageByUserID } = useRankGetAPI();

  useEffect(() => {
    const getPackage = async () => {
      setLoading(true);
      const packageList = await getAllRanks();
      if (packageList) {
        setPackageService(packageList.data);
      } else {
        setPackageService([]);
      }
      const servicePackage = (await getPackageByUserID()) as ApiResponse;
      if (!servicePackage || !servicePackage.status) {
        setLoading(false);
        return;
      }
      setCurrentPackage(servicePackage.data);
      if (onCurrentPackageChange) onCurrentPackageChange(servicePackage); // Gửi lên cha
      setLoading(false);
    };
    getPackage();
  }, [user?.accountId, onCurrentPackageChange]);

  const handleOpen = (pkg: any) => {
    setSelectPackage(pkg);
    setOpen(true);
  };

  const handleOpenForm = (pkg: any) => {
    setSelectPackage(pkg);
    setOpenForm(true);
  };

  const handleClose = () => setOpen(false);
  const handleCloseForm = () => setOpenForm(false);

  type RankKey = "artisan" | "artovator" | "artmaster";
  // Define benefits for each package rankID
  const benefitsMap: Record<RankKey, { icon: JSX.Element; text: string }[]> = {
    artisan: [
      { icon: <CloudUploadIcon />, text: "Upload 50 Art per Month" },
      { icon: <DiscountIcon />, text: "Receive 85% on art sales" },
      { icon: <LoyaltyIcon />, text: "Get exclusive tag Artisan" },
    ],
    artovator: [
      { icon: <CloudUploadIcon />, text: "Upload 100 Art per Month" },
      { icon: <DiscountIcon />, text: "Receive 90% on art sales" },
      { icon: <LoyaltyIcon />, text: "Get exclusive tag Artovator" },
    ],
    artmaster: [
      { icon: <CloudUploadIcon />, text: "Upload Unlimited Art" },
      { icon: <DiscountIcon />, text: "Receive 95% on art sales" },
      { icon: <LoyaltyIcon />, text: "Get exclusive tag ArtMaster" },
    ],
  };

  const renderPackageCard = (
    service: Package,
    rankImage: string,
    isCurrent: boolean
  ) => {
    const benefits = benefitsMap[service.name.toLowerCase() as RankKey] || [];
    return (
      <Card
        className="cardRank"
        sx={{
          backgroundImage: 'url("/images/RankCard.png")',
          borderRadius: "20px",
          position: "relative",
        }}
      >
        <Box sx={{ position: "absolute", top: "-15px", right: "35px" }}>
          <img
            src={rankImage}
            alt="rank"
            style={{ marginLeft: "190px", opacity: "0.8" }}
          />
        </Box>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              margin: "40px 20px 20px 20px",
              alignItems: "flex-start",
            }}
          >
            <Typography
              gutterBottom
              variant="h4"
              color="white"
              className="package-title"
              sx={{ fontFamily: "UniSpace" }}
            >
              {service.name}
            </Typography>
            <Typography
              variant="body1"
              color="white"
              sx={{ marginTop: "-10px" }}
            >
              {service.price === 0 ? "Free" : `${service.price}$ / month`}
            </Typography>
          </Box>
          <Box
            sx={{
              color: "white",
              margin: "20px 20px 20px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              minHeight: "180px",
            }}
          >
            <Stack spacing={1}>
              {benefits.map((benefit, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  {benefit.icon}
                  <Typography>{benefit.text}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </CardContent>
        <Box
          sx={{
            position: "absolute",
            bottom: "20px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            disabled={
              (currentPackage?.rankID as string | undefined) === service._id
            }
            sx={{
              backgroundColor: "transparent",
              color: "white",
              border: "solid 1.5px",
              borderLeft: "none",
              borderRight: "none",
              borderRadius: "10px",
              width: "180px",
              margin: "0 auto",
              ":hover": {
                backgroundColor: "transparent",
                color: "#FFCF50",
                border: "solid 1px #FFCF50",
                borderLeft: "none",
                borderRight: "none",
              },
            }}
            onClick={() => handleOpen(service)}
            size="small"
          >
            {(currentPackage?.rankID as string | undefined) === service._id
              ? "You're Using This Package"
              : "Purchase"}
          </Button>
          {(currentPackage?.rankID as string | undefined) === service._id && (
            <Typography
              sx={{
                textAlign: "center",
                fontFamily: "UniSpace",
                color: theme.color3,
                marginTop: "100px",
                display: "block",
                margin: "0 auto",
              }}
              variant="h5"
            >
              Your Current Package
            </Typography>
          )}
        </Box>
      </Card>
    );
  };

  const renderArtistCard = (service: Package) => (
    <Card
      className="artist-card"
      sx={{
        backgroundImage: 'url("/images/ArtistCard.png")',
        borderRadius: "30px",
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: { xs: "35%", md: "30%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 1,
        }}
      >
        <img
          src="/images/RankElement4.png"
          alt="premium"
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
        />
      </Box>
      <Box
        sx={{
          width: { xs: "65%", md: "70%" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          pl: 2,
          marginRight: "220px",
        }}
      >
        <Typography
          variant="h4"
          color="white"
          sx={{ fontFamily: "UniSpace", mb: 1 }}
        >
          {service.name}
        </Typography>
        <Typography
          variant="body1"
          color="white"
          sx={{ mb: 2, fontSize: "1.2rem" }}
        >
          Own the Artist rank with full privileges like the Artmaster, along
          with the Commission feature to receive custom artwork requests from
          clients.
          <Typography
            variant="body1"
            color="white"
            sx={{ mb: 2, fontSize: "1.2rem" }}
          >
            If you’re confident in your artistic creativity, let us know!
          </Typography>
        </Typography>
        <Button
          variant="outlined"
          sx={{
            color: "white",
            border: "solid 1.5px white",
            borderRadius: "5px",
            alignSelf: "flex-start",
            ":hover": { border: "solid 1px #FFCF50", color: "#FFCF50" },
          }}
          onClick={() => handleOpenForm(service)}
        >
          Send Us
        </Button>
      </Box>
    </Card>
  );

  return (
    <div className="packagePage">
      <Box
        sx={{
          color: theme.color,
          backgroundColor: `rgba(${theme.rgbBackgroundColor}, 0.97)`,
          backgroundImage: dark
            ? 'url("/images/darkPackage.jpg")'
            : 'url("/images/lightPackage.jpg")',
          transition: theme.transition,
          width: "95%",
          margin: "auto",
          borderRadius: "5px",
          marginBottom: "15px",
        }}
      >
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 100 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Box sx={{ padding: "2% 2% 0% 2%" }}>
          <Typography variant="h4" color={theme.color}>
            Account Packages
          </Typography>
          <Divider sx={{ borderColor: theme.color }} />
        </Box>

        <Box className="packageContainer">
          {!packageService.length ? (
            <Typography>
              {loading ? "Loading packages..." : "No packages found"}
            </Typography>
          ) : (
            <>
              {packageService[1] &&
                renderPackageCard(
                  packageService[1],
                  "/images/RankElement1.png",
                  (currentPackage?.rankID as string | undefined) ===
                    packageService[1]._id
                )}
              {packageService[2] &&
                renderPackageCard(
                  packageService[2],
                  "/images/RankElement2.png",
                  (currentPackage?.rankID as string | undefined) ===
                    packageService[2]._id
                )}
              {packageService[3] &&
                renderPackageCard(
                  packageService[3],
                  "/images/RankElement3.png",
                  (currentPackage?.rankID as string | undefined) ===
                    packageService[3]._id
                )}
            </>
          )}
        </Box>
        <Box sx={{ padding: "0% 2% 2% 2%" }}>
          {packageService[4] && renderArtistCard(packageService[4])}
        </Box>
      </Box>
      <PackagePaymentConfirm
        open={open}
        handleClose={handleClose}
        item={selectPackage}
      />
      <PackageFormPopup open={openForm} handleClose={handleCloseForm} />
    </div>
  );
}
