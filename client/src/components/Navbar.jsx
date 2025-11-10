import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png"
import { auth } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { useloding } from '../context/LodingContext'
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Globe, LogOut, Sparkles } from "lucide-react";
const Navbar = ({userdata}) => {
  const [open, setOpen] = useState(false);

  const [imgurl, setimgurl] = useState()
  const [isopen, setisopen] = useState(false)
  const [out, setout] = useState(false)
  const [name, setname] = useState('')
  const [email, setemail] = useState('')
  const { user, googleSignIn, logout } = useAuth();
  const {loading,setLoading}=useloding()
  // useEffect(() => {
  //   const getToken = async () => {
  //     setLoading(true)
  //     if (!user) return; // <-- important check
  //     const token = await user.getIdToken();
  //     console.log("ID Token:", token);
  //     const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/fecthuser`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     const data = await res.json();
  //     setLoading(false)
  //     if (data.status) {
  //       setimgurl(data.data.imgUrl)
  //       setname(data.data.fullname)
  //       setemail(data.data.email)
  //       setLoading(false)
  //       return setlog(true)
  //     }
  //   };
  //   getToken();
  // }, [user, out]);
  const handlemodle = () => {
    if (isopen) {
      return setisopen(false)
    }
    return setisopen(true)
  }
  const handlelogout = async () => {
    await logout()
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
        {loading ? <>
          <div onClick={handlemodle}>
            <img src={userdata.imgUrl} alt="" className="h-[50px] rounded-full cursor-pointer" />
          </div>
          {isopen ? <div className="h-[300px] w-[250px] border-2 border-green-400 fixed top-[81px] right-[18px] rounded-lg bg-black shadow-lg flex flex-col items-center justify-center gap-4 p-3">
            <div className="">
              <p className="font-medium text-white">{userdata.fullname}</p>
              <p className="text-white text-xs">{userdata.email}</p>
            </div>

            {/* <hr className="my-2" /> */}

            {/* Menu Options */}
            <ul className="space-y-2 text-gray-500">
             <Link to="/profile"> <li onClick={handlemodle} className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer">
                <Settings size={16} /> Account settings
              </li></Link>

              <li onClick={handlemodle}  className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer">
                <Globe size={16} /> English
              </li>

              <li onClick={handlemodle} className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer">
                <Sparkles size={16} />
                Upgrade
              </li>

              <li  onClick={handlelogout} className="flex items-center gap-2 text-red-500 hover:bg-gray-100 p-2 rounded-lg cursor-pointer">
                <LogOut size={16} /> Sign out
              </li>
            </ul>
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
