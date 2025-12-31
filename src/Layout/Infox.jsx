import { FaHeartbeat, FaPhoneAlt, FaFirstAid,FaCheckSquare, FaHandshake  } from "react-icons/fa";

function Infox() {
  return (
 <div className="service_area !bg-brand-80">
        <div className="container p-0 ">
            <div className="row no-gutters">
                <div className="col-xl-4 col-md-4 bg-brand-80">
                    <div className="single_service bg-brand-80">
                        <div className="icon">
<FaHeartbeat style={{ fontSize: "30px", color: "#fff" }} />                        </div>
                        <h3>Hospitality</h3>
                        <p>High-quality health, nutrition, and education support to orphans and vulnerable children, where excellence, transparency, and compassion guide every action</p>

                            <a href="#test-form"
                                                className='!bg-white font-sans text-[#026585]  border-1 border-[#026585] px-4 py-3 rounded-md hover:!bg-brand-80  hover:!text-white hover:!border-white transition'
                                              >
                                               Ask for donation
                                              </a>

                    </div>
                </div>
                <div className="col-xl-4 col-md-4">
                    <div className="single_service !bg-main">
                        <div className="icon">
<FaPhoneAlt style={{ fontSize: "30px", color: "#fff" }} />                        </div>
                        <h3>Emergency Call</h3>
                        <p>Working closely with local communities, partners, and volunteers, we ensure holistic support for orphans and vulnerable children in Tanzania and all over the world.</p>
                        <a href="#test-form"
                        className='!bg-white font-sans text-[#026585]  border-1 border-brand-80 px-4 py-3 rounded-md hover:!bg-main  hover:!text-white hover:!border-white transition'
                                                                      >
                                                                      + 255 655 900 444
                                                                      </a>
                    </div>
                </div>
                <div className="col-xl-4 col-md-4">
                    <div className="single_service">
                        <div className="icon">
< FaHandshake style={{ fontSize: "30px", color: "#fff" }} />                        </div>
                        <h3>Get Involved</h3>
                        <p>Our programs are designed to deliver measurable outcomes in health, nutrition, and education, ensuring meaningful change in the lives of children.</p>
                          <a href="#test-form"
                                           className='!bg-white font-sans text-[#026585]  border-1 border-brand-80 px-8 py-3 rounded-md hover:!bg-brand-80 hover:!text-white hover:!border-white transition'
                                                                                         >
                                                                                        Get Involve
                                                                                         </a>

                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Infox;