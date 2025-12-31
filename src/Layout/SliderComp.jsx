import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Slider from "react-slick";
import banner2 from "../assets/img/banner/donation1.jpg";
import banner from "../assets/img/banner/donation2.jpg";
import banner3 from "../assets/img/banner/donation3.jpg";

// slides data
const slides = [
  {

    title: "A Meal",
    title2: "Books",
    desc: "A school uniform. A safe place to sleep.”",
    image: banner2,
  },
  {

    title: "Thousands of  ",
    title2: "orphans",
    desc: "lack basic needs like food, shelter, and education.",
    image: banner,
  },
  {

    title: "Your",
    title2: "Donation",
    desc: "can provide hope, dignity, and opportunity.",
    image: banner3,
  },
];

function SliderComp() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    arrows: true,
  };

  return (
    <div className="w-full h-[120vh] relative mb-20">
      <Slider {...settings}>
        {slides.map((slide, i) => (
          <div key={i}>
            <div
              className="w-full h-[120vh] bg-cover bg-center flex items-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="container mx-auto px-4 mt-20 ml-10 md:ml-20">
                <div className="max-w-xl text-left ">
                  <h3 className=" !text-4xl md:!text-7xl font-bold !text-[#ddf1f4] ">
                    <span className="block">{slide.title}</span>
                    {slide.title2}
                  </h3>
                  <p className="!text-[#f4e6e8] mb-6">{slide.desc}</p>
                  <a
                    href="#"
                    className="inline-block !bg-[#026585] text-white px-6 py-3 rounded-md hover:bg-[#a01020] transition"
                  >
                    Get Involved
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default SliderComp;
