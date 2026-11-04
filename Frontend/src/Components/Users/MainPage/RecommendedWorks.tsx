import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea, Typography } from "@mui/material";
import { PlaceHoldersImageCard } from "../PlaceHolders.jsx";

export default function RecommendedWords({ artworkList = [], user }) {
  const [hoveredID, setHoveredID] = useState(null);
  const navigate = useNavigate();

  function ReccomendedArts() {
    return (
      <ImageList className="recommendedImages" cols={5}>
        {artworkList.map((work, index) => {
          // 1. Định danh Artwork ID chuẩn từ SQL Server hoặc Mongoose
          const artworkId = work.artwork_id || work._id || `art_${index}`;
          
          // 2. Lấy link ảnh linh hoạt: Ưu tiên dữ liệu từ SQL Server (preview_url / image_url)
          // Nếu không có, tự động xoay vòng ảnh mẫu local (/images/1.jpg, 2.jpg, 3.jpg) để tránh bị lặp lại
          const imageUrl =
            work.preview_url ||
            work.image_url ||
            work.previewUrl ||
            work.imageUrl ||
            work.image_file_fe ||
            work.imageFileFe ||
            work.imageFile?.preview ||
            work.imageFile?.image ||
            work.imageFile ||
            `/images/${(index % 3) + 1}.jpg`;

          return (
            <CardActionArea
              key={artworkId}
              onMouseEnter={() => setHoveredID(artworkId)}
              onMouseLeave={() => setHoveredID(null)}
              onClick={() => navigate(`artwork/${artworkId}`)}
            >
              <ImageListItem style={{ position: "relative", cursor: "pointer" }}>
                <CardMedia
                  component="img"
                  style={{
                    pointerEvents: "none",
                    objectFit: "cover",
                    width: "15vw",
                    height: "15vw",
                    borderRadius: "5px",
                    minWidth: "182px",
                    minHeight: "182px",
                    filter:
                      hoveredID === artworkId
                        ? "brightness(70%)"
                        : "brightness(100%)",
                    transition: "0.3s ease",
                  }}
                  image={imageUrl}
                  alt={work.artwork_name || work.artworkName || "Artwork"}
                  loading="lazy"
                  onError={(e) => {
                    // 3. Bẫy lỗi: Nếu link online bị ngắt kết nối/ERR_CONNECTION_RESET, 
                    // tự chuyển ngay về ảnh local tĩnh trong public/images/
                    e.target.onerror = null;
                    e.target.src = `/images/${(index % 3) + 1}.jpg`;
                  }}
                />

                {hoveredID === artworkId && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "white",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                      zIndex: 2,
                      opacity: 1,
                      transition: "opacity 0.3s ease-in-out",
                      textAlign: "center",
                    }}
                  >
                    <div>{work.artwork_name || work.artworkName}</div>
                  </div>
                )}
              </ImageListItem>
            </CardActionArea>
          );
        })}
      </ImageList>
    );
  }

  return (
    <>
      <div className="headrecommended">
        <Typography key={user?.user_id || user?.accountID} variant="h5">
          Recommended Artworks{" "}
          {user
            ? `For You, ${user?.first_name || user?.firstName || ""} ${user?.last_name || user?.lastName || ""}`
            : "From The Community"}
        </Typography>
        <Link to={`artwordrecomment`}>
          <div className="seemore">See More</div>
        </Link>
      </div>

      <div className="recommendedimg">
        {artworkList && artworkList.length > 0 ? (
          <ReccomendedArts />
        ) : (
          <PlaceHoldersImageCard />
        )}
      </div>
    </>
  );
}