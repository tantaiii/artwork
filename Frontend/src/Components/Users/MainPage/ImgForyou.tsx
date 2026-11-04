import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import CardMedia from "@mui/material/CardMedia";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Link } from "react-router-dom";
import { PlaceHoldersImageCard } from "../PlaceHolders";
import { Artwork } from "../../../Interfaces/ArtworkInterfaces";
import { ArtworkGetAPI } from "../../../API/ArtworkAPI/GET.tsx";

export default function ImgForyou() {
  const { getAllArtworks } = ArtworkGetAPI();
  const [artworks, setArtworks] = React.useState<Artwork[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [hoveredID, setHoveredID] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllArtworks();
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        const random10 = shuffled.slice(0, 10);
        setArtworks(random10);
      } catch (err) {
        console.error("Error fetching random artworks:", err);
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <PlaceHoldersImageCard />;
  if (!Array.isArray(artworks) || artworks.length === 0)
    return <PlaceHoldersImageCard />;

  return (
    <ImageList className="recommendedImages" cols={5}>
      {artworks.map((work: Artwork) => (
        <ImageListItem
          key={work._id}
          style={{ position: "relative", cursor: "pointer" }}
          onMouseEnter={() => setHoveredID(work._id)}
          onMouseLeave={() => setHoveredID(null)}
        >
          <Link to={`artwork/${work._id}`}>
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
                  hoveredID === work._id
                    ? "brightness(70%)"
                    : "brightness(100%)",
                transition: "0.3s ease",
              }}
              image={
                (work.imageFile?.preview ||
                  work.imageFile?.image ||
                  work.imageFile ||
                  "/images/loadingImages.gif") as string
              }
              alt={work.artworkName}
              loading="lazy"
            />
          </Link>

          {hoveredID === work._id && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "18px",
                fontWeight: "bold",
                color: "white",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                zIndex: 2,
                textAlign: "center",
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              <div>{work.artworkName}</div>
            </div>
          )}
        </ImageListItem>
      ))}
    </ImageList>
  );
}
