import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import One from "../assets/img/experts/one.jpg";
import Cat from "../assets/img/experts/cat.png";
import Alb from "../assets/img/experts/alb.png";
import Bry from "../assets/img/experts/bry.jpg";
import Ann from "../assets/img/experts/ann.jpg";
import Zeh from "../assets/img/experts/zeh.png";

const doctors = [
  { id: 1, name: "Dr. Shaban Kimaro", specialty: "Neurologist", image: One },
  { id: 2, name: "Dr. Catherine Kavishe", specialty: "Radiologist", image: Cat },
  { id: 3, name: "Dr. Albert Ulimali", specialty: "Anaesthesiologist", image: Alb },
  { id: 4, name: "Dr. Bryson Mcharo", specialty: "Paediatric Surgeon", image: Bry },
  { id: 5, name: "Dr. Anna Lemnge", specialty: "Anaesthesiologist", image: Ann },
  { id: 6, name: "Dr. Zehrabanu Hussein", specialty: "Orthopaedic Surgeon", image: Zeh },
];

const Doctor = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="doctor-carousel-area py-16 bg-[#f4e6e8]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-[#8d0914]">
          OUR DOCTORS
        </h2>
        <Slider {...settings}>
          {doctors.map((doc) => (
            <div key={doc.id} className="px-2 sm:px-3 lg:px-4">
              <div className="doctor-card bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl hover:scale-105 transition-transform duration-300">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-40 h-40 mx-auto object-cover rounded-full border-4 border-pink-200 transition-transform duration-300 hover:scale-105"
                />
                <div className="mt-4">
                  <h3 className="font-semibold text-lg text-[#8d0914]">{doc.name}</h3>
                  <p className="text-sm text-gray-600 italic">{doc.specialty}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Doctor;
