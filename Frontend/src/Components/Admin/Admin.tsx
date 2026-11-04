import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Typography, Paper, Button } from "@mui/material";
import AdminNavbar from "./NavigationAd.jsx";
import "../../css/Admin.css";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Avatar from "@mui/material/Avatar";
import PeopleIcon from "@mui/icons-material/People";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartData,
  DoughnutController,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Creator } from "../../Interfaces/UserInterface.ts";

import { AdminGetAPI } from "../../API/AdminAPI/GET.tsx";
import { InteractGetAPI } from "../../API/ArtworkAPI/GET.tsx";
import { UserGetAPI } from "../../API/UserAPI/GET.tsx";

export default function Admin() {
  const [artcount, setArtCount] = useState<number>();
  const [creatorcount, setCreatorCount] = useState<number>();
  const [nearest7arts, setNearest7Arts] = useState<any[]>();
  const [creatorlist, setCreatorList] = useState<Creator[]>();
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayOption, setDisplayOption] = useState<number | string>(10);
  const navigate = useNavigate();
  const { getAllUsersPopulated } = UserGetAPI();
  const { getAllUsers, GetNumberOfArtwork, GetNumberOfUser } = AdminGetAPI();
  const { GetRecentArtListLikeCount } = InteractGetAPI();
  useEffect(() => {
    const getArtworkCount = async () => {
      let artCount = await GetNumberOfArtwork();
      setArtCount(artCount);
    };
    const getCreatorCount = async () => {
      let creatorCount = await GetNumberOfUser();
      setCreatorCount(creatorCount);
    };

    const getNearest7Arts = async () => {
      try {
        const response = await GetRecentArtListLikeCount();
        const sanitizedResponse = Array.isArray(response)
          ? response.map((art) => ({
              ...art,
              artworkID: String(art?._id || ""),
              artworkName: String(art?.artworkName || ""),
              likes: Number(art?.likes || 0),
            }))
          : [];
        setNearest7Arts(sanitizedResponse);
      } catch (error) {
        setNearest7Arts([]);
      } finally {
      }
    };

    const getCreatorDetails = async () => {
      try {
        const res = (await getAllUsersPopulated()) as any;
        const users = Array.isArray(res) ? res : res?.data ?? res ?? [];
        setCreatorList(Array.isArray(users) ? users : []);
      } catch (e) {
        setCreatorList([]);
      }
    };
    getCreatorDetails();
    getNearest7Arts();
    getArtworkCount();
    getCreatorCount();
  }, []);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    DoughnutController
  );

  const [hiddenDatasets, setHiddenDatasets] = useState<number[]>([]);

  const options: {
    responsive: boolean;
    plugins: {
      legend: {
        display: boolean;
        labels: {
          font: {
            size: number;
          };
        };
      };
      title: {
        display: boolean;
        text: string;
        font: {
          size: number;
        };
      };
    };
    scales: {
      x: {
        type: "category";
        grid: {
          color: string;
          lineWidth: number;
        };
        ticks: {
          maxRotation: number;
        };
      };
      y: {
        type: "linear";
        grid: {
          color: string;
          lineWidth: number;
        };
        beginAtZero: boolean;
      };
    };
  } = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 18,
          },
        },
      },
      title: {
        display: true,
        text: `Statistics on recent artwork performance`,
        font: {
          size: 20,
        },
      },
    },
    scales: {
      x: {
        type: "category",
        grid: {
          color: "#ECECEC",
          lineWidth: 1,
        },
        ticks: {
          maxRotation: 45,
        },
      },
      y: {
        type: "linear",
        grid: {
          color: "#ECECEC",
          lineWidth: 1,
        },
        beginAtZero: true,
      },
    },
  };

  const getChartData = () => {
    try {
      if (!Array.isArray(nearest7arts)) {
        return {
          labels: [],
          datasets: [
            {
              label: "Number Of Likes On Recent Artworks",
              data: [],
              backgroundColor: "rgb(46, 144, 250)",
              borderColor: "black",
              borderWidth: 1,
            },
          ],
        };
      }

      // Filter out invalid entries and extract data
      const validArts = nearest7arts.filter(
        (art) =>
          art && typeof art === "object" && "artworkID" in art && "likes" in art
      );

      const labels = validArts.map(
        (art) => String(art.artworkID).trim() || "Unknown"
      );
      const likesList = validArts.map((art) =>
        typeof art.likes === "number" ? art.likes : 0
      );
      return {
        labels,
        datasets: [
          {
            label: "Number Of Likes On Recent Artworks",
            data: likesList,
            backgroundColor: "rgb(46, 144, 250)",
            borderColor: "black",
            borderWidth: 1,
          },
        ],
      };
    } catch (e) {
      return {
        labels: [],
        datasets: [
          {
            label: "Number Of Likes On Recent Artworks",
            data: [],
            backgroundColor: "rgb(46, 144, 250)",
            borderColor: "black",
            borderWidth: 1,
          },
        ],
      };
    }
  };

  const data: ChartData<"bar"> = getChartData();

  return (
    <>
      <AdminNavbar />
      <Container style={{ width: "60vw" }}>
        <Box my={4}>
          <Typography
            component="div"
            variant="h4"
            gutterBottom
            style={{ fontWeight: "bold" }}
          >
            {"Overview"}
          </Typography>
          <div className="total">
            <Box className="infortotal">
              <Avatar
                sx={{ width: 70, height: 70, backgroundColor: "#ed8e00" }}
                style={{ margin: "auto 20px" }}
              >
                <AutoAwesomeIcon sx={{ width: 40, height: 40 }} />
              </Avatar>
              <Typography
                component="div"
                variant="h5"
                gutterBottom
                style={{
                  fontWeight: "bold",
                  color: "#666666",
                  margin: "auto 10px",
                }}
              >
                {"Total Artwork:"}
              </Typography>
              <Typography
                component="div"
                variant="h5"
                gutterBottom
                style={{
                  fontWeight: "bold",
                  color: "#666666",
                  margin: "auto 10px",
                }}
              >
                {typeof artcount === "number" ? artcount : 0}
              </Typography>
            </Box>
            <Box className="infortotal">
              <Avatar
                sx={{ width: 70, height: 70, backgroundColor: "#15b79f" }}
                style={{ margin: "auto 20px" }}
              >
                <PeopleIcon sx={{ width: 40, height: 40 }} />
              </Avatar>
              <Typography
                component="div"
                variant="h5"
                gutterBottom
                style={{
                  fontWeight: "bold",
                  color: "#666666",
                  margin: "auto 10px",
                }}
              >
                {`Total Users: ${
                  typeof creatorcount === "number" ? creatorcount : 0
                }`}
              </Typography>
            </Box>
          </div>

          <div className="allchart">
            {loading === true ? (
              <CircularProgress
                color="primary"
                size={100}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "40%",
                }}
              />
            ) : (
              ""
            )}
            <Box className="boxchart">
              <div
                className="chart"
                style={{ width: "1000px", margin: "auto", padding: "25px" }}
              >
                <Bar options={options} data={data} />
              </div>
              <Box sx={{ mb: 2, margin: "20px" }}>
                <select
                  value={displayOption}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDisplayOption(value);
                    setItemsPerPage(
                      value === "All"
                        ? nearest7arts?.length || 0
                        : Number(value)
                    );
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0",
                    marginRight: "10px",
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value="All">All</option>
                </select>
                <span style={{ color: "#666" }}>Items per page</span>
              </Box>
              <div className="nameworks-container">
                {Array.isArray(nearest7arts) &&
                  nearest7arts
                    .filter(Boolean)
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((work, index) => {
                      const id = work?.artworkID
                        ? String(work.artworkID).trim()
                        : "";
                      const name = work?.artworkName
                        ? String(work.artworkName).trim()
                        : "";

                      if (!id || !name) return null;

                      return (
                        <div
                          className="namework"
                          key={index}
                          onClick={() =>
                            window.open(`/characters/artwork/${id}`)
                          }
                          style={{ cursor: "pointer", padding: "10px" }}
                        >
                          <span>{id}</span> <span>{name}</span>
                        </div>
                      );
                    })}
              </div>
              {displayOption !== "All" &&
                Array.isArray(nearest7arts) &&
                nearest7arts.length > itemsPerPage && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 2,
                      mt: 2,
                      marginBottom: "20px",
                    }}
                  >
                    <Button
                      variant="outlined"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      Back
                    </Button>
                    <Button
                      variant="outlined"
                      disabled={
                        currentPage * itemsPerPage >= nearest7arts.length
                      }
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      Next
                    </Button>
                  </Box>
                )}
            </Box>
          </div>
        </Box>
      </Container>
    </>
  );
}
