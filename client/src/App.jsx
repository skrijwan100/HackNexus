import { useState } from 'react'
import reactLogo from './assets/react.svg'
import Logo from './assets/logo.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <img src={Logo} alt="" />
    </>
  )
}

export default App
