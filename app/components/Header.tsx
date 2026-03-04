"use client";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";

export default function Header() {

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: false,
    pauseOnFocus: false,
    cssEase: "ease-in-out",
  };

  const slides = [
    "/slick.png",
    "/slick1.png",
    "/slick2.png",
    "/slick3.png",
    "/slick4.png",
    "/slick5.png",
  ];

  return (
    <div>
      <div className="w-full">

        <Slider {...settings}>
          {slides.map((src, index) => (
            <div key={index}>

              <div className="relative w-full h-[70vh] overflow-hidden">

                <Image
                  src={src}
                  alt={`slide-${index}`}
                  fill
                  priority
                  className="object-cover"
                />

              </div>

            </div>
          ))}
        </Slider>

      </div>
    </div>
  );
}