import React, { useEffect, useState } from "react";
import { Box, CardMedia, Typography, Button } from "@mui/material";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import "../../css/PaymentArea.css";
import { QrInfor } from "../../Interfaces/PaymentIntrerfaces.ts";
import { PaymentPostAPI } from "../../API/PaymentAPI/POST.tsx";
import { PaymentPutAPI } from "../../API/PaymentAPI/PUT.tsx";
import CustomizedTextField from "../StyledMUI/CustomizedTextField.tsx";
import { useAuth } from "../../secure/AuthContext.tsx";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import { ApiResponse } from "../../Interfaces/app.common.ts";
import CustomizedPopperPayment from "./CustomizedPopperPayment.tsx";
import { useNavigate } from "react-router-dom";

export default function PaymentArea({
  setShowPayment,
  setAmount,
}: {
  setShowPayment: React.Dispatch<React.SetStateAction<boolean>>;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { user } = useAuth();
  const { getQrCode } = PaymentPostAPI();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState<number | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [depositValue, setDepositValue] = useState<number>();
  const [showPopup, setShowPopup] = useState(false); // ✅ popup control
  const { acceptPayment } = PaymentPutAPI();
  const navigate = useNavigate();

  const getQrCodeUrl = async () => {
    try {
      if (!depositValue || depositValue <= 0) {
        alert("Please enter a valid deposit amount!");
        return;
      }

      setIsLoading(true);
      const data: QrInfor = {
        amount: depositValue,
        description: user?.phoneNumber!,
        qrCode: "",
      };

      const response = (await getQrCode(data)) as ApiResponse;
      if (response?.data?.data) {
        setQrCode(response.data.data.qrCode);
        setOrderCode(response.data.data.orderCode);
      } else {
        alert("Failed to generate QR code. Please try again.");
      }
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!orderCode) return;

    const intervalId = setInterval(async () => {
      try {
        const res = (await acceptPayment(orderCode)) as ApiResponse;
        if (res.data.status === "success") {
          setSuccess(true);
          setShowPopup(true);
          clearInterval(intervalId);

          setTimeout(() => {
            setShowPopup(false);
            setShowPayment(false);
            navigate("/characters");
          }, 3000);

          setAmount((prev) => prev + (depositValue ? depositValue / 25000 : 0));
        }
      } catch (err) {}
    }, 15000);

    return () => clearInterval(intervalId);
  }, [orderCode]);

  return (
    <Box>
      {showPopup && <CustomizedPopperPayment amount={depositValue! / 25000} />}
      <Box className={success ? "successed-box" : "failed-box"}>
        <Typography
          variant="h5"
          className={
            success ? "gradient-text-successed" : "gradient-text-failed"
          }
          sx={{ mb: 5 }}
        >
          DEPOSIT COIN
        </Typography>

        <Box
          sx={{
            position: "relative",
            width: 250,
            height: 250,
            mb: 2,
            backgroundColor: "rgb(44, 44, 46)",
            borderRadius: 3,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {qrCode ? (
            <CardMedia
              className="QRimg"
              component="img"
              image={qrCode}
              alt="QR Code Payment"
              sx={{ objectFit: "contain", width: "100%", height: "100%" }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <CustomizedTextField
                id="price"
                label="Enter Your Money To Deposit"
                name="price"
                type="number"
                value={depositValue ?? ""}
                onKeyDown={(e: any) => {
                  if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e: any) => {
                  const val = Number(e.target.value);
                  if (val > 0 || e.target.value === "") {
                    setDepositValue(val);
                  }
                }}
                inputProps={{
                  min: 1,
                  inputMode: "numeric",
                }}
                sx={{
                  input: {
                    color: "white",
                    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                      {
                        WebkitAppearance: "none",
                        margin: 0,
                      },
                    MozAppearance: "textfield",
                    textAlign: "center",
                  },
                  label: { color: "orange" },
                  width: "200px",
                }}
              />

              <Button
                sx={{
                  width: "120px",
                  height: "40px",
                  color: "#5682B1",
                  border: "2px solid #5682B1",
                  fontWeight: "bold",
                  ":hover": { backgroundColor: "#5682B122" },
                }}
                disabled={isLoading}
                onClick={getQrCodeUrl}
              >
                {isLoading ? "Processing..." : "Deposit"}
              </Button>
            </Box>
          )}
        </Box>

        <Typography variant="h5">Scan QR to deposit coins</Typography>
        <Typography variant="h6" className="VND-COIN">
          25.000 VND = 1 COIN
        </Typography>
        <Typography variant="h6" className="gradient-text-successed">
          <ReportGmailerrorredIcon
            style={{ transform: "translateY(5px)", color: "red" }}
          />
          Content to transfer:{" "}
          {user?._id?.toString().concat(user?.phoneNumber || "")}
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          NOTE: If you already transferred money but nothing happens, please
          check “Transaction History” to claim your coins!
        </Typography>
      </Box>
    </Box>
  );
}
