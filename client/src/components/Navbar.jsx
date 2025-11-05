import React, { useState } from "react";
import logo from "../assets/logo.png"
import { Link, useNavigate } from 'react-router-dom';
const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <Link to="/"><div className="nav-logo"><img src={logo} alt="" className="h-[90px]" /></div></Link>

      <ul className={open ? "nav-links open" : "nav-links"}>
        <li><a href="#events">Events</a></li>
        <li><a href="#workshops">Workshops</a></li>
        <li><a href="#seminars">Seminars</a></li> 
        <li><a href="#team">Find Team</a></li>
        <li></li>
      </ul>
      <Link to="/login" className="login-btn">Login</Link>

      <div className="nav-toggle" onClick={() => setOpen(!open)}>
        <span></span><span></span><span></span>
      </div>
    </nav>
  );
};

export default Navbar;
