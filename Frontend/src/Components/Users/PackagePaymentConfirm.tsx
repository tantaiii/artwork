import * as React from "react";
import Dialog from "@mui/material/Dialog";
import "../../css/ArtConfirm.css";
import { useNavigate } from "react-router-dom";
import { Package, CurrentPackage } from "../../Interfaces/Package";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { useRankPostAPI } from "../../API/PackageAPI/POST.tsx";
import { UserGetAPI } from "../../API/UserAPI/GET.tsx";
import { useAuth } from "../../secure/AuthContext.tsx";
import { ApiResponse } from "../../Interfaces/app.common.ts";

interface PackagePaymentConfirmProps {
  open: boolean;
  item?: Package;
  handleClose: () => void;
  onPackagePurchased?: (newPackage: CurrentPackage) => void;
}

export default function PackagePaymentConfirm({
  open,
  item,
  handleClose,
  onPackagePurchased,
}: PackagePaymentConfirmProps) {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { upgradeRank } = useRankPostAPI();
  const { getUserByIdUrl } = UserGetAPI();

  React.useEffect(() => {
    if (!item) {
      handleClose();
    }
  }, [item, handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !user?._id) return;
    const creator = (await getUserByIdUrl(user?._id)) as ApiResponse;
    try {
      setLoading(true);
      const paymentData = {
        packageID: item._id,
        packageName: item.name,
        packagePrice: item.price,
        userID: user?._id,
      };
      const coins = creator.data.coins as number;
      if (coins - paymentData.packagePrice < 0) {
        alert("Your money don't enough to upgrade, please deposit more");
        navigate("/characters/depositecoin");
      } else {
        const rankID = item._id;

        // Gọi API để cập nhật package
        const response = await upgradeRank(
          rankID,
          coins - paymentData.packagePrice
        );
        if (response.status) {
          // Thông báo thành công và cập nhật state ở component cha
          alert("Package purchased successfully!");
        }
        if (onPackagePurchased) {
          onPackagePurchased(response.data as CurrentPackage); // Gửi dữ liệu lên cha để cập nhật currentPackage
        }
        handleClose();
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="dialog-custom"
      sx={{ borderRadius: 50, background: "none" }}
    >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 100 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <section className="add-card page">
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="name" className="label">
            <span className="title">Package Name</span>
            <input
              className="input-field"
              type="text"
              name="packageName"
              value={item.name || ""}
              readOnly
              title="Package name"
            />
          </label>
          <label htmlFor="price" className="label">
            <span className="title">Price</span>
            <input
              id="price"
              className="input-field"
              value={item.price !== undefined ? `${item.price}$` : ""}
              readOnly
              name="price"
              title="Package price"
            />
          </label>
          <button className="checkout-btn" type="submit" disabled={loading}>
            {loading ? "Processing..." : "Confirm Purchase"}
          </button>
          <button
            className="checkout-btn cancel-btn"
            type="button"
            onClick={handleClose}
            style={{ marginTop: "10px", backgroundColor: "#ccc" }}
          >
            Cancel
          </button>
        </form>
      </section>
    </Dialog>
  );
}
