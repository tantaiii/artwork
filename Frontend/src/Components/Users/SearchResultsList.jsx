import "../../css/SearchResultsList.css";
import { SearchResultUser } from "./SearchResultUser";
import { SearchResultsArtWork } from "./SearchResultArtWork";
import { GetArtworkByTagName } from "../../API/ArtworkAPI/GET.tsx";
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";

// Hàm lấy 3 phần tử ngẫu nhiên (giữ nguyên)
const getRandomThree = (arr) => {
  if (arr.length < 3) return arr;
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 3);
};

export const SearchResultsList = ({
  dataCreator = [],
  dataArt = [],
  onSelect,
}) => {
  const creatorsToShow = getRandomThree(dataCreator); // 3 creators ngẫu nhiên
  const [artFromTags, setArtFromTags] = useState([]); // Lưu trữ tất cả artworks từ các tag
  const artFromDataArtToShow = getRandomThree(dataArt).slice(0, 3); // 1 artwork từ dataArt
  const artFromTagsToShow = getRandomThree(artFromTags).slice(0, 3); // 2 artworks từ tags

  const handleClick = () => {
    if (onSelect) {
      onSelect(); // Gọi callback để reset input trong ExpandingSearchBar
    }
  };

  const { theme } = useContext(ThemeContext);

  return (
    <div className="results-list">
      {/* Hiển thị tối đa 3 creators */}
      <h4 className="titlesearch" style={{ color: theme.color6 }}>
        On User
      </h4>
      {creatorsToShow.map((creator) => (
        <SearchResultUser
          key={creator._id}
          result={`${creator.lastName} ${creator.firstName}`}
          resultId={creator._id}
          resultIdkey={creator._id}
        />
      ))}

      {artFromDataArtToShow.length > 0 && (
        <div className="art-group">
          <h4 className="titlesearch" style={{ color: theme.color6 }}>
            On Artwork
          </h4>

          {artFromDataArtToShow.map((art) => (
            <SearchResultsArtWork
              key={art._id}
              result={art.artworkName}
              resultId={art._id}
              resultIdkey={art._id}
              onClick={handleClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};
