import React, { useContext, useState, useRef, useEffect } from "react";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import { SearchResultsList } from "../Users/SearchResultsList.jsx";
import debounce from "lodash/debounce";

import { ArtworkGetAPI } from "../../API/ArtworkAPI/GET.tsx";
import { UserGetAPI } from "../../API/UserAPI/GET.tsx";

const SearchDarkMode = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
  "& .results-list": {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    background: "#333",
    zIndex: 1000,
    maxHeight: "300px",
    overflowY: "auto",
  },
}));

const SearchLightMode = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "rgba(169, 169, 169, 0.15)",
  "&:hover": {
    backgroundColor: "rgba(169, 169, 169, 0.25)",
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
  "& .results-list": {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    background: "#fff",
    zIndex: 1000,
    maxHeight: "300px",
    overflowY: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
      "&:focus": {
        width: "50ch",
      },
    },
  },
}));

export default function CustomizedSearchBar() {
  const { dark } = useContext(ThemeContext);

  const [input, setInput] = useState("");
  const [dataCreator, setDataCreator] = useState([]);
  const [dataArt, setDataArt] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const { getAllUserForSearch } = UserGetAPI();
  // const { getTagList } = useTagGetAPI();
  const { getArtworkforSearch } = ArtworkGetAPI();
  const fetchCreator = async (value) => {
    try {
      const response = await getAllUserForSearch();
      const creators = response;
      const filteredResults = creators.data.filter(
        ({ account, firstName, lastName }) => {
          if (!value) return false;
          const searchValue = value.toLowerCase();
          return (
            account?.userName?.toLowerCase().includes(searchValue) ||
            firstName?.toLowerCase().includes(searchValue) ||
            lastName?.toLowerCase().includes(searchValue)
          );
        }
      );
      setDataCreator(filteredResults);
    } catch (error) {}
  };

  const fetchArt = async (value) => {
    try {
      const response = await getArtworkforSearch();

      if (!value) {
        setDataArt([]);
        return;
      }
      const searchValue = value.toLowerCase();
      const filteredResults = response.data.filter((art) =>
        art?.artworkName?.toLowerCase().includes(searchValue)
      );
      setDataArt(filteredResults);
    } catch (error) {}
  };

  const debouncedSearch = debounce((value) => {
    if (value.trim() === "") {
      setDataCreator([]);
      setDataArt([]);
      setShowResults(false);
    } else {
      fetchCreator(value);
      fetchArt(value);
      setShowResults(true);
    }
  }, 300);

  const handleChange = (value) => {
    setInput(value);
    debouncedSearch(value);
  };
  const handleSelectResult = () => {
    // Reset khi chọn một kết quả
    setInput(""); // Reset input về rỗng
    setShowResults(false); // Ẩn kết quả tìm kiếm
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      // Click ra ngoài thanh tìm kiếm
      setInput(""); // Reset input về rỗng
      setShowResults(false); // Ẩn kết quả tìm kiếm
    }
  };

  useEffect(() => {
    // Thêm event listener khi component mount
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Xóa event listener khi component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const SearchWrapper = dark ? SearchDarkMode : SearchLightMode;

  return (
    <SearchWrapper ref={searchRef}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search..."
        inputProps={{ "aria-label": "search" }}
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
      {showResults && (dataCreator.length > 0 || dataArt.length > 0) && (
        <SearchResultsList
          dataCreator={dataCreator}
          dataArt={dataArt}
          // dataTag={dataTag}
          onSelect={handleSelectResult} // Truyền callback để reset khi chọn
        />
      )}
    </SearchWrapper>
  );
}
