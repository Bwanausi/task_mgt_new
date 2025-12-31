import welcome1 from "../assets/img/banner/welcome1.jpg";
import welcome2 from "../assets/img/banner/welcome2.jpg";
import { FaCheckSquare } from "react-icons/fa";

function Welcome() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Images Section */}
        <div className="relative flex justify-center">
          <div className="relative w-full max-w-md">
            <img
              src={welcome2}
              alt="Welcome 2"
              className="rounded-lg shadow-lg w-full"
            />
            <img
              src={welcome1}
              alt="Welcome 1"
              className="absolute -bottom-8 -left-8 w-2/3 rounded-lg shadow-xl border-4 border-white"
            />
          </div>
        </div>

        {/* Content Section */}
        <div>
          <h2 className="text-2xl font-bold text-[#8d0914] mb-4">
            DEPARTMENT OF NEUROSURGERY
          </h2>
          <h3 className="text-xl md:text-2xl font-semibold leading-snug mb-6">
            We are the Best in Orthopaedics, Neurosurgery &amp; Traumatology
          </h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            We provide comprehensive evaluation and therapeutic services for a
            wide range of conditions like Stroke, Brain, Hemorrhage, Backache,
            Spinal Disorders, Epilepsy, and other neurological ailments.
            Services offered are surgical treatment for a wide variety of
            ailments such as head injuries &amp; trauma, brain tumors,
            hydrocephalus, arterio-venous malformations, and aneurysms.
          </p>

          {/* List with icons */}
          <ul className="space-y-3 mb-6">
            <li className="flex items-center">
              <FaCheckSquare className="text-[#8d0914] mr-2 text-lg" />
              Medical Treatment
            </li>
            <li className="flex items-center">
              <FaCheckSquare className="text-[#8d0914] mr-2 text-lg" />
              Qualified Doctors
            </li>
            <li className="flex items-center">
              <FaCheckSquare className="text-[#8d0914] mr-2 text-lg" />
              24 Hours Services
            </li>
            <li className="flex items-center">
              <FaCheckSquare className="text-[#8d0914] mr-2 text-lg" />
              Emergency Services
            </li>
          </ul>

          {/* Button */}
          <a
            href="#"
            className="inline-block !bg-[#8d0914] text-white px-4 py-3 my-4 rounded-md hover:!bg-[#a01020] transition"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
