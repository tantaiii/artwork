import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "@mui/icons-material/Google";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../secure/AuthContext.tsx";
import { useApiService } from "../../service/api.tsx";

export default function LoginWithGoogle({ disableOutsideClick, handleClick }) {
  const { setAccessToken, setUser } = useAuth();
  const apiService = useApiService();
  const navigate = useNavigate();

  const googleAPI = "https://www.googleapis.com/oauth2/v3/userinfo";

  const onClick = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const token = response.access_token;

        // 1. Lấy thông tin tài khoản Google
        const ggAccount = await axios
          .get(googleAPI, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => res?.data);

        if (!ggAccount) {
          alert("Không thể lấy thông tin tài khoản từ Google.");
          return;
        }

        // 2. Gửi thông tin về Backend Node.js
        const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";
        const res = await apiService
          .post(`${baseUrl}/google`, { ggAccount })
          .then((res) => res?.data)
          .catch((err) => {
            console.error("Lỗi khi gọi API Google Auth Backend:", err);
            return null;
          });

        // 3. Kiểm tra an toàn bằng Optional Chaining (?.) tránh crash khi res = null
        if (res?.status === "success" && res?.data) {
          setAccessToken(res.data.accessToken);
          setUser(res.data.user);

          window.dispatchEvent(new Event("userLoggedIn"));

          if (res.data.user?.role?.name === "Admin") {
            navigate("/admin");
          } else {
            navigate("/characters");
          }
        } else {
          // Báo lỗi rõ ràng nếu res bị null hoặc trả về lỗi status
          const errorMsg = res?.message || "Đăng nhập Google thất bại hoặc Server không phản hồi.";
          alert(errorMsg);
        }
      } catch (error) {
        console.error("Lỗi quá trình đăng nhập Google:", error);
        alert("Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại!");
      }
    },
    onError: (error) => {
      console.log("Google Login Error:", error);
    },
  });

  return (
    <Button
      onClick={() => onClick()}
      variant="contained"
      startIcon={<GoogleIcon />}
      fullWidth
      sx={{ backgroundColor: "#DB4437", color: "white" }}
    >
      Login with Google
    </Button>
  );
}