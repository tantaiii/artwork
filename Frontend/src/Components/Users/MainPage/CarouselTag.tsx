import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Tag } from "../../../Interfaces/TagInterface";
import { useNavigate } from "react-router-dom";
import "../../../css/CarouselTag.css";
import { useTagGetAPI } from "../../../API/TagAPI/GET.tsx";

export default function CarouselTag() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 2000, // Increase the speed for smoother transitions
    slidesToShow: 3,
    variableWidth: true,
    slidesToScroll: 1, // Change to 1 for smoother scrolling
    arrows: true,
    autoplay: true,
    autoplaySpeed: 0, // Set to 0 for continuous scrolling
    draggable: true, // Enable dragging with the mouse
    cssEase: "linear", // Use a linear easing function for smooth transitions
    pauseOnHover: false, // Disable pause on hover for continuous scrolling
  };
  const navigate = useNavigate();
  const { getTagList } = useTagGetAPI();

  const colors = [
    "#82c87e",
    "#c07ec8",
    "#c89c7e",
    "#7E8DC8",
    "#C07EC8",
    "#C87E8A",
    "#ff2d00",
  ];
  const [tagList, SetTagList] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const response = await getTagList(); // response là Tag[] | undefined
      if (response && response.length > 0) {
        const uniqueTags: Tag[] = Array.from(
          new Map(response.map((tag: Tag) => [tag._id, tag])).values()
        );
        SetTagList(uniqueTags);
      } else {
        SetTagList([]);
      }
    };
    fetchTags();
  }, []);

  const handleClickTagToFindArtwork = (id: string, name: string) => {
    navigate(`SearchHome/Tags?TagID=${id}&TagName=${name}`);
  };

  function TagList() {
    return (
      <>
        <Slider {...settings}>
          {tagList.map((tag: any, index) => (
            <div key={tag._id}>
              <button
                className="itemtag"
                style={{ backgroundColor: colors[index % colors.length] }}
                onClick={() => {
                  handleClickTagToFindArtwork(tag._id, tag.tagName);
                }}
              >
                {tag.tagName}
              </button>
            </div>
          ))}
        </Slider>
      </>
    );
  }

  return tagList.length !== 0 ? <TagList /> : "";
}
