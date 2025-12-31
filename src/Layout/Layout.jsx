import {Outlet } from 'react-router-dom'
import Slider from './SliderComp'
import Header from './Header'
import Infox from './Infox'
import Welcome from './Welcome'
import Department from './Department'
import Testimonial from './Testimonial'
import Doctors from './Doctors'
import Emergency from './Emergency'
import Footer from './Footer'


function Layout() {
  return (
    <div className="layout">
<Header/>

    <Slider/>
       <Infox/>
{/*        <Welcome/> */}
       <Department/>
        <Testimonial/>
{/*         <Doctors/> */}
{/*         <Emergency/> */}
        <Footer/>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
