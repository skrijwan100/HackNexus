import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png"
import { auth } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [log, setlog] = useState(false)
  const [imgurl, setimgurl] = useState()
  const [isopen, setisopen] = useState(false)
  const [out,setout]=useState(false)
  const { user, googleSignIn ,logout} = useAuth();
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
      if (data.status) {
        setimgurl(data.data.imgUrl)
        return setlog(true)
      }
    };

    getToken();
  }, [user,out]);
  const handlemodle = () => {
    if (isopen) {
      return setisopen(false)
    }
    return setisopen(true)
  }
    const handlelogout=async()=>{
    await  logout()
        window.location.reload();
  }
  return (
    <nav className="nav">
      <Link to="/"><div className="nav-logo"><img src={logo} alt="" className="h-[90px]" /></div></Link>

      <ul className={open ? "nav-links open" : "nav-links"}>
        <li><a href="#events">Events</a></li>
        <li><a href="#workshops">Workshops</a></li>
        <li><a href="#seminars">Seminars</a></li>
        <li><a href="#team">Find Team</a></li>
        {log ? <>
          <div onClick={handlemodle}>
            <img src={imgurl} alt="" className="h-[50px] rounded-full cursor-pointer" />
          </div>
          {isopen ? <div className="h-[200px] w-[200px] border-2 border-green-400 fixed top-[81px] right-[18px] rounded-lg bg-black shadow-lg flex flex-col items-center justify-center gap-4 p-3">
           <button
              onClick={handlemodle}
              className="w-full bg-green-500 text-white py-1 rounded-md hover:bg-green-600 transition cursor-pointer"
            >
               <Link to="/profile">Your Details</Link>
            </button>

            {/* Apply Button */}
            <button
            onClick={handlemodle}
              className="w-full bg-blue-500 text-white py-1 rounded-md hover:bg-blue-600 transition cursor-pointer"
            >
              My application
            </button>

            {/* Logout Button */}
            <button
            onClick={handlelogout}
              className="w-full bg-red-500 text-white py-1 rounded-md hover:bg-red-600 transition cursor-pointer"
            >
              Logout
            </button>

          </div>
            : ""}
        </> : <li><Link to="/login" className="login-btn">Login</Link></li>}
      </ul>


      <div className="nav-toggle" onClick={() => setOpen(!open)}>
        <span></span><span></span><span></span>
      </div>
    </nav>
  );
};

export default Navbar;
