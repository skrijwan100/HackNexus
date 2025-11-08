import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png"
import { auth } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [log,setlog]=useState(false)
  const[imgurl,setimgurl]=useState()
  const { user, googleSignIn } = useAuth();
    useEffect(() => {
      const getToken = async () => {
        if (!user) return; // <-- important check
        const token = await user.getIdToken();
        console.log("ID Token:", token);
         const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/fecthuser`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      console.log(data);
      if(data.status){
        setimgurl(data.data.imgUrl)
        return setlog(true)
      }
      };

      getToken();
    }, [user]);
  return (
    <nav className="nav">
      <Link to="/"><div className="nav-logo"><img src={logo} alt="" className="h-[90px]" /></div></Link>

      <ul className={open ? "nav-links open" : "nav-links"}>
        <li><a href="#events">Events</a></li>
        <li><a href="#workshops">Workshops</a></li>
        <li><a href="#seminars">Seminars</a></li> 
        <li><a href="#team">Find Team</a></li>
        {log?<>
            <Link to="/profile"><div>
              <img src={imgurl} alt=""  className="h-[50px] rounded-full cursor-pointer" />
            </div></Link>
          
        </>:<li><Link to="/login" className="login-btn">Login</Link></li>}
      </ul>
      

      <div className="nav-toggle" onClick={() => setOpen(!open)}>
        <span></span><span></span><span></span>
      </div>
    </nav>
  );
};

export default Navbar;
