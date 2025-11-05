import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { googleSignIn } = useAuth();
  const [savedata,setsavedata]=useState(false)
  const handleLogin = async () => {
    try {
      const data = await googleSignIn();
      console.log(data.user)
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
      {savedata?<div> User all data</div>:<div className="login-box">
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
