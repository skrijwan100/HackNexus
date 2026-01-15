import React, { useEffect } from 'react'
import BlackHoleBackground from '../components/Backgound'
export default function Home() {


  return (
    <>
    <div className="text-2xl text-amber-400">
      <BlackHoleBackground/>
      <div className='absolute flex justify-center w-full h-[50vh] items-center font-extrabold text-8xl'>
   {/* <p>Welcome to HackNexus</p> */}
      </div>
    </div>
    </>
  )
}
