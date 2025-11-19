import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from './pages/Home'
import Login from './components/Login'
import Profile from './components/Profile'
import LoadingScreen from './components/Mainloder'
import { useloding } from './context/LodingContext'
import { useAuth } from './context/AuthContext'
function App() {
  const { user } = useAuth();
  const { loading, setLoading } = useloding()
  const [log, setlog] = useState(true)
  const [userdata, setuserdata] = useState({})
  useEffect(() => {
    const getToken = async () => {
      setlog(true)
      try {

        // if (!user) return; // <-- important check
        const token = await user.getIdToken();
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/fecthuser`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setLoading(false)
        setlog(false)
        if (data.status) {
          setuserdata(data.data)
          setLoading(true)
          return setlog(false)
        }

      } catch (error) {
        setLoading(false)
        setlog(false)
      }
    };
    getToken();
  }, [user]);
  if (log) {
    return (
      <>
        <LoadingScreen />
      </>
    )
  }
  return (
    <>
      <BrowserRouter>
        <Navbar userdata={userdata} />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Profile userdata={userdata} />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
