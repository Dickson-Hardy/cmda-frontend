export const responsiveSliderSettings = {
  dots: false,
  infinite: true,
  autoplay: true,
  cssEase: "linear",
  swipeToSlide: true,
  initialSlide: 0,
  slidesToShow: 4,
  slidesToScroll: 1,
  speed: 500,
  autoplaySpeed: 2000,
  responsive: [
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 700,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

export const membersResponsiveSliderSettings = {
  ...responsiveSliderSettings,
  speed: 3500,
  autoplaySpeed: 3500,
  responsive: [
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 700,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};
