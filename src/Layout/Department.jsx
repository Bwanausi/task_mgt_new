import One from "../assets/img/department/education.jpg";
import Two from "../assets/img/department/health.jpg";
import Three from "../assets/img/department/shelter.jpg";
import Four from "../assets/img/department/care.jpg";
import Five from "../assets/img/department/emerg.jpg";
import Six from "../assets/img/department/sponsor.jpg";





import { FaCheckSquare  } from "react-icons/fa";

function Department(){

return(
 <div className="our_department_area !bg-topcolor border-b-2 border-brand">
         <div className="container">
             <div className="row ">
                 <div className="col-xl-12">
                     <div className="section_title text-center mb-55">
                         <h3>OUR PROGRAMS</h3>
                         <p>Empowering children today for a brighter tomorrow. <br/>
                             Ensure every child has access to a better life. </p>
                     </div>
                 </div>
             </div>
             <div className="row">
                 <div className="col-xl-4 col-md-6 col-lg-4">
                     <div className="single_department">
                         <div className="department_thumb">
                             <img src={One}  alt=""/>
                         </div>
                         <div className="department_content">
                             <h3><a href="#">Education Support</a></h3>
                             <p>Esteem spirit temper too say adieus who direct esteem.</p>
                             <a href="#" className="learn_more !text-main">Learn More</a>
                         </div>
                     </div>
                 </div>
                 <div className="col-xl-4 col-md-6 col-lg-4">
                     <div className="single_department">
                         <div className="department_thumb">
                             <img src={Two} alt=""/>
                         </div>
                         <div className="department_content">
                             <h3><a href="#">Health & Nutrition</a></h3>
                             <p>Esteem spirit temper too say adieus who direct esteem.</p>
                             <a href="#" className="learn_more !text-main">Learn More</a>
                         </div>
                     </div>
                 </div>
                 <div className="col-xl-4 col-md-6 col-lg-4">
                     <div className="single_department">
                         <div className="department_thumb">
                             <img src={Three} alt=""/>
                         </div>
                         <div className="department_content">
                             <h3><a href="#">Shelter & Care</a></h3>
                             <p>Esteem spirit temper too say adieus who direct esteem.</p>
                             <a href="#" className="learn_more !text-main">Learn More</a>
                         </div>
                     </div>
                 </div>
                 <div className="col-xl-4 col-md-6 col-lg-4">
                     <div className="single_department">
                         <div className="department_thumb">
                             <img src={Four} alt=""/>
                         </div>
                         <div className="department_content">
                             <h3><a href="#">Skills & Empowerment</a></h3>
                             <p>Esteem spirit temper too say adieus who direct esteem.</p>
                             <a href="#" className="learn_more !text-main">Learn More</a>
                         </div>
                     </div>
                 </div>
                 <div className="col-xl-4 col-md-6 col-lg-4">
                     <div className="single_department">
                         <div className="department_thumb">
                             <img src={Five} alt=""/>
                         </div>
                         <div className="department_content">
                             <h3><a href="#">Emergency Relief</a></h3>
                             <p>Esteem spirit temper too say adieus who direct esteem.</p>
                             <a href="#" className="learn_more !text-main">Learn More</a>
                         </div>
                     </div>
                 </div>
                 <div className="col-xl-4 col-md-6 col-lg-4">
                     <div className="single_department">
                         <div className="department_thumb">
                             <img src={Six} alt=""/>
                         </div>
                         <div className="department_content">
                             <h3><a href="#">Sponsorship</a></h3>
                             <p>Esteem spirit temper too say adieus who direct esteem.</p>
                             <a href="#" className="learn_more !text-main">Learn More</a>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
     </div>

);
}
export default Department;