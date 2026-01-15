import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { useloding } from '../context/LodingContext';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Globe, LogOut, Sparkles, Menu, X } from "lucide-react";

const Navbar = ({ userdata }) => {
  const [open, setOpen] = useState(false);
  const [isopen, setisopen] = useState(false);
  
  // Use a ref to handle clicks outside the dropdown
  const dropdownRef = useRef(null);
  
  const { user, logout } = useAuth();
  const { loading } = useloding();
  const naviget = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setisopen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handlemodle = () => {
    setisopen(!isopen);
  };

  const handlelogout = async () => {
    await logout();
    naviget("/");
    window.location.reload();
  };

  return (
    <nav className="w-full h-[90px] flex items-center justify-between px-6 bg-black/90 backdrop-blur-md relative z-50 shadow-md">
      {/* Logo Section */}
      <Link to="/">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-[70px] md:h-[90px] object-contain" />
        </div>
      </Link>

      {/* Desktop Menu Links (Hidden on Mobile) */}
      <ul className="hidden md:flex gap-8 items-center text-white font-medium">
        <li className="hover:text-green-400 transition-colors cursor-pointer"><a href="#events">Events</a></li>
        <li className="hover:text-green-400 transition-colors cursor-pointer"><a href="#workshops">Workshops</a></li>
        <li className="hover:text-green-400 transition-colors cursor-pointer"><a href="#seminars">Seminars</a></li>
        <li className="hover:text-green-400 transition-colors cursor-pointer"><a href="#team">Find Team</a></li>
      </ul>

      {/* Right Side: Profile & Mobile Toggle */}
      <div className="flex items-center gap-4">
        
        {/* User Profile Logic */}
        {loading ? (
          <div className="relative" ref={dropdownRef}>
            {/* Avatar Image */}
            <div onClick={handlemodle} className="cursor-pointer border-2 border-transparent hover:border-green-400 rounded-full transition-all">
              <img 
                src={userdata?.imgUrl || "https://via.placeholder.com/50"} 
                alt="User" 
                className="h-10 w-10 md:h-[50px] md:w-[50px] rounded-full object-cover" 
              />
            </div>

            {/* Dropdown Menu (Positioned Relative to Avatar) */}
            {isopen && (
              <div className="absolute right-0 mt-3 w-[250px] border-2 border-green-400 rounded-lg bg-black shadow-2xl flex flex-col gap-4 p-4 z-50">
                <div className="border-b border-gray-700 pb-2">
                  <p className="font-medium text-white truncate">{userdata?.fullname || "User"}</p>
                  <p className="text-gray-400 text-xs truncate">{userdata?.email}</p>
                </div>

                <ul className="space-y-1 text-gray-300">
                  <Link to="/profile">
                    <li onClick={() => setisopen(false)} className="flex items-center gap-3 hover:bg-gray-800 p-2 rounded-lg cursor-pointer transition-colors">
                      <Settings size={18} /> <span className="text-sm">Account settings</span>
                    </li>
                  </Link>

                  <li onClick={() => setisopen(false)} className="flex items-center gap-3 hover:bg-gray-800 p-2 rounded-lg cursor-pointer transition-colors">
                    <Globe size={18} /> <span className="text-sm">English</span>
                  </li>

                  <li onClick={() => setisopen(false)} className="flex items-center gap-3 hover:bg-gray-800 p-2 rounded-lg cursor-pointer transition-colors">
                    <Sparkles size={18} /> <span className="text-sm">Upgrade</span>
                  </li>

                  <li onClick={handlelogout} className="flex items-center gap-3 text-red-500 hover:bg-red-500/10 p-2 rounded-lg cursor-pointer transition-colors">
                    <LogOut size={18} /> <span className="text-sm">Sign out</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="hidden md:block px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition-all">
            Login
          </Link>
        )}

        {/* Mobile Hamburger Menu Toggle */}
        <div className="md:hidden text-white cursor-pointer" onClick={() => setOpen(!open)}>
          {open ? <X size={32} /> : <Menu size={32} />}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {open && (
        <div className="absolute top-[90px] left-0 w-full bg-black/95 border-b border-green-400 flex flex-col items-center py-8 gap-6 md:hidden shadow-xl animate-in slide-in-from-top-5 duration-200">
          <a href="#events" className="text-white text-lg hover:text-green-400" onClick={() => setOpen(false)}>Events</a>
          <a href="#workshops" className="text-white text-lg hover:text-green-400" onClick={() => setOpen(false)}>Workshops</a>
          <a href="#seminars" className="text-white text-lg hover:text-green-400" onClick={() => setOpen(false)}>Seminars</a>
          <a href="#team" className="text-white text-lg hover:text-green-400" onClick={() => setOpen(false)}>Find Team</a>
          
          {!loading && (
            <Link to="/login" className="px-8 py-2 bg-green-500 text-white rounded-full font-semibold" onClick={() => setOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;