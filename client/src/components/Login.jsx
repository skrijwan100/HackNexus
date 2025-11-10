import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import Signup from "../pages/Useralldata";
import { auth } from "../lib/firebase";
import {useNavigate} from "react-router-dom"
const Login = () => {
  const { user, googleSignIn } = useAuth();
  const [savedata, setsavedata] = useState(false)
  const [userdata, setuserdata] = useState({})
      const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await googleSignIn();
      console.log(data.user)
      setuserdata(data.user)
      const token = await auth.currentUser.getIdToken();
      console.log(token)
      
      const res1 = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/fecthuser`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data2 = await res1.json();
      console.log(data2);
      if(data2.status){
          return navigate("/")
      }
      setsavedata(true)
    } catch (e) {
      // common popup blocker issue → try signInWithRedirect if needed
      console.error(e);
      alert(e.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
    // TODO: Add your backend login API here
  };

  return (
    <div className="login-container">
      {savedata ? <div><Signup userdata={userdata} /></div> : <div className="login-box">
        <button
          onClick={handleLogin}
          className="flex items-center justify-center gap-2  bg-white text-gray-700 border border-gray-300 rounded-lg font-medium shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200"
        >
          <FcGoogle className="text-xl" />
          <span>Sign in with Google</span>
        </button>

      </div>}

    </div>
  );
};

export default Login;
