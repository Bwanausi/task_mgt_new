import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Logo from "../assets/img/logo.png";

import {
  faBars,
  faTimes,
  faAngleDown,
  faEnvelope,
   faPhone, faMapLocationDot
} from "@fortawesome/free-solid-svg-icons";
import {
  faLinkedin,
  faFacebook,
  faGooglePlusG,
  faYoutube,

} from "@fortawesome/free-brands-svg-icons";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className='fixed w-full z-20'>
      <div className='bg-topcolor text-sm h-12 flex items-center '>
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center py-2 px-4">
          <div className="flex gap-3 text-[#C7C7C7] gap-x-4">
            <a href="#" className='!text-[#C7C7C7] hover:!text-[#026585]'><FontAwesomeIcon icon={faLinkedin}/></a>
            <a href="#" className='!text-[#C7C7C7] hover:!text-[#026585]'><FontAwesomeIcon icon={faFacebook} /></a>
            <a href="#" className='!text-[#C7C7C7] hover:!text-[#026585]'><FontAwesomeIcon icon={faGooglePlusG} /></a>
            <a href="#" className='!text-[#C7C7C7] hover:!text-[#026585]'><FontAwesomeIcon icon={faYoutube} /></a>
          </div>
          <div className="flex gap-5 !text-[#C7C7C7] gap-x-2  md:gap-x-10 font-light">
            <a href="#" className='!text-[#C7C7C7] hover:!text-[#026585]'> <FontAwesomeIcon icon={faEnvelope} className='text-[#026585]' />info@vid.org.tz</a>
            <a href="#"  className='!text-[#C7C7C7] hover:!text-[#026585]'><FontAwesomeIcon icon={faPhone} className='text-[#026585]'/> +255 655 900 444</a>
            <a href="#"  className='!text-[#C7C7C7] hover:!text-[#026585]'><FontAwesomeIcon icon={faMapLocationDot} className='text-[#026585]'/> Lumumba,Dar es salaam</a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white text-[#026585]  w-full z-20 h-20" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between  h-20">
             <a href="#" className="flex items-center gap-x-2"><img src={Logo} alt="vid" className="h-14 mx-14"/></a>
            <div className="text-lg font-sans"></div>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-6 font-sans items-center  ">
              <a href="/" className="!text-[#026585] hover:font-bold">Home</a>

              <a href="/" className="!text-[#026585] hover:font-bold">Our Programs</a>
              <a href="/" className="!text-[#026585] hover:font-bold">Donate</a>

              <a href="/" className="!text-[#026585] hover:font-bold">About Us</a>

              <a href="/" className="!text-[#026585] hover:font-bold">Get Involved</a>
              <a href="/" className="!text-[#026585] hover:font-bold">Contact</a>

            </div>

                <div className="hidden lg:block lg:w-1/4">
                  <div className="appointment">
                    <div className=" hidden lg:block">
                      <a
                        href="#test-form"
                        className='!bg-[#026585] font-sans text-white border-1 border-[#026585] px-4 py-2 rounded-md hover:!bg-white hover:!text-[#026585] hover:!border-[#026585] transition'
                      >
                        Make A Donation
                      </a>
                    </div>
                  </div>
                </div>

            {/* Mobile Button */}
            <button
              className="md:hidden text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#f4e6e8] px-4 py-3 space-y-2">
            <a href="/" className="block hover:text-[#f4e6e8]">Home</a>
            <a href="/services" className="block hover:text-[#f4e6e8]">Services</a>
            <a href="/doctors" className="block hover:text-[#f4e6e8]">Doctors</a>
            <a href="/publication" className="block hover:text-[#f4e6e8]">Publication</a>
            <a href="/training" className="block hover:text-[#f4e6e8]">Training</a>
            <a href="/about" className="block hover:text-[#f4e6e8]">About Us</a>
            <a href="/contact" className="block hover:text-[#f4e6e8]">Contact</a>
          </div>
        )}
      </nav>
      </div>
    </header>
  );
}

export default Header;
