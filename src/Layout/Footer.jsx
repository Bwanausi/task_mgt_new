import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Logo + Description */}
        <div>
          <a href="#" className="inline-block mb-4">
            <img src="img/footer_logo.png" alt="MOI Logo" className="h-12" />
          </a>
          <p className="text-sm leading-relaxed mb-4">
            Firmament morning sixth subdue darkness creeping gathered divide.
          </p>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="text-white hover:!text-[#8d0914]">
              <FaFacebook />
            </a>
            <a href="#" className="text-white hover:!text-[#8d0914]">
              <FaTwitter />
            </a>
            <a href="#" className="text-white hover:!text-[#8d0914]">
              <FaInstagram />
            </a>
            <a href="#" className="text-white hover:!text-[#8d0914]">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Departments */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Programs</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="!text-white hover:!text-[#98222c]">Education Support</a></li>
            <li><a href="#" className="!text-white hover:!text-[#98222c]">Health & Nutrition</a></li>
            <li><a href="#" className="!text-white hover:!text-[#98222c]">Shelter & Care</a></li>
            <li><a href="#" className="!text-white hover:!text-[#98222c]">Skills & Empowerment</a></li>
            <li><a href="#" className="!text-white hover:!text-[#98222c]">Emergency Relief</a></li>
            <li><a href="#" className="!text-white hover:!text-[#98222c]">Sponsorship</a></li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 !text-white">Useful Links</h3>
          <ul className="space-y-2 text-sm ">
            <li><a href="#" className="!text-white hover:!text-[#98222c]">About</a></li>
            <li><a href="#" className=" !text-white hover:!text-[#98222c]">Get Involved</a></li>
            <li><a href="#" className="!text-white hover:!text-[#98222c]">Contact</a></li>
            <li><a href="#" className="!text-white hover:!text-[#98222c]">Donate</a></li>
          </ul>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Address</h3>
          <p className="text-sm leading-relaxed">
             Lumumba <br />
            Dar es Salaam, Tanzania <br />
            +255 655 900 444 <br />
            info@vid.org.tz
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 py-6">
        <p className="text-center text-sm">
          &copy; {new Date().getFullYear()} Volunteer In Development. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
