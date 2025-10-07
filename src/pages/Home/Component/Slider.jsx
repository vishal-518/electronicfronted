import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';

const slides = [
  {
    image: 'https://assets.myntassets.com/assets/images/retaillabs/2020/3/16/4555c67e-7cf2-43f9-b6c8-f923da1debba1584336497021-group-2x.png',
  },
  {
    image: 'https://assets.myntassets.com/assets/images/retaillabs/2022/11/23/a8ff9dca-f24a-4eb1-9880-4fe2aa7298b91669221288328-sne-hp-banner-1440x684.jpg',
  },
  {
    image: 'https://assets.myntassets.com/f_webp,w_980,c_limit,fl_progressive,dpr_2.0/assets/images/2025/AUGUST/25/0pfZkpSF_60a17fdbda0a4622b8bd1f79585836c0.png',
  },
];

const Slider = () => {
  return (
    <div className="w-full md:h-[400px] mt-8 h-[200px]">
      <Swiper
        spaceBetween={0}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        autoplay={{ delay: 3000 }}
        loop={true}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
