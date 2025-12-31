import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import testimo1 from "../assets/img/testmonial/1.png";
import testimo2 from "../assets/img/testmonial/2.png";
import testimo3 from "../assets/img/testmonial/1.png";
import {FaQuoteLeft   } from "react-icons/fa";


function Testimonial() {
  const testimonials = [
    {
      text: `If I had a mountain of gold,I would not like it to remain with me for more than three days(Wealth should flow,not sit idle)`,
      author: "Umar ibn AI-Khattab(RA)",
      image:testimo1,
    },
    {
      text: `You will never attain righteousness until you spend from that which you love(True generosity comes from giving what matters to you)`,
      author: "Allah (Subhanahu wa Taala)- Qur'an 3:92",
      image:testimo2,

    },
    {
      text: `Charity does not decrease wealth(Giving never makes poorer,Allah replaces it)`,
      author: "Prophet Muhammad",
      image:testimo3,

    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="testmonial_area">
      <Slider {...settings}>
        {testimonials.map((item, index) => (
          <div key={index} className="single-testmonial overlay testmonial_bg_1">
            <div className="container"  >

              <div className="row">
                <div className="col-xl-10 offset-xl-1">
                  <div className="testmonial_info text-center">
                    <div className="quote">
<i><FaQuoteLeft /></i>
                    </div>
                    <p>{item.text}</p>
                    <div className="testmonial_author">
                      <h4>{item.author}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Testimonial;
