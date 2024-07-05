// src/components/MultiItemCarousel.js
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1280 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 1280, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const CustomLeftArrow = ({ onClick }) => {
  return (
    <button
      className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-white rounded-full focus:outline-none"
      onClick={onClick}
    >
      <FaArrowLeft />
    </button>
  );
};

const CustomRightArrow = ({ onClick }) => {
  return (
    <button
      className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-white rounded-full focus:outline-none"
      onClick={onClick}
    >
      <FaArrowRight />
    </button>
  );
};

const MultiItemCarousel = ({ children, autoPlaySpeed = 3000 }) => {
  return (
    <Carousel
      responsive={responsive}
      autoPlay={true}
      draggable={false}
      infinite
      autoPlaySpeed={autoPlaySpeed}
      customLeftArrow={<CustomLeftArrow />}
      customRightArrow={<CustomRightArrow />}
    >
      {children}
    </Carousel>
  );
};

export default MultiItemCarousel;
